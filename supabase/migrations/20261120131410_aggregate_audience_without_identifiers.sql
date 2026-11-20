-- Only daily counters: no visitor/session identifier, IP, raw URL or event timestamp.
create table public.website_daily_totals (
 day date not null default ((now() at time zone 'Europe/Madrid')::date),
 page text not null check (length(page)<=150),
 country text not null check (country='Unknown' or country ~ '^[A-Z]{2}$'),
 region text not null check (length(region) between 1 and 80),
 city text not null check (length(city) between 1 and 100),
 views bigint not null default 1 check (views>0),
 primary key (day,page,country,region,city)
);
alter table public.website_daily_totals enable row level security;
revoke all on public.website_daily_totals from public,anon,authenticated;
grant select on public.website_daily_totals to authenticated;
grant select,insert,update,delete on public.website_daily_totals to service_role;
create policy website_totals_admin_read on public.website_daily_totals for select to authenticated using ((select public.is_admin()));

create function public.record_website_pageview(p jsonb) returns void language plpgsql security invoker set search_path='' as $$
begin
 if p is null or jsonb_typeof(p)<>'object' or not (p ?& array['page','country','region','city']) or p-array['page','country','region','city']<>'{}'::jsonb then raise exception 'invalid_counter'; end if;
 if p->>'page' is null or p->>'page' not in ('/index.html','/about/index.html','/colecciones/index.html','/contacto/index.html','/para-tiendas/index.html','/puntos-de-venta/index.html','/politica-privacidad-bebepunt/privacidad/index.html','/portal/index.html','/portal/inicio.html','/portal/catalogo.html','/portal/colecciones.html','/portal/producto.html','/portal/perfil.html') then raise exception 'invalid_page'; end if;
 insert into public.website_daily_totals(day,page,country,region,city,views)
 values((now() at time zone 'Europe/Madrid')::date,p->>'page',p->>'country',p->>'region',p->>'city',1)
 on conflict(day,page,country,region,city) do update set views=public.website_daily_totals.views+1;
end $$;
revoke all on function public.record_website_pageview(jsonb) from public,anon,authenticated;
grant execute on function public.record_website_pageview(jsonb) to service_role;

create function public.website_audience_dashboard(days integer default 30) returns jsonb language plpgsql security invoker set search_path='' as $$
declare today date:=(now() at time zone 'Europe/Madrid')::date; since date; answer jsonb;
begin
 if not public.is_admin() then raise exception 'admin_only' using errcode='42501'; end if;
 if days is null or days not in (1,7,30,90) then raise exception 'invalid_period'; end if;
 since:=today-days+1;
 select jsonb_build_object(
  'updated_at',now(),'views',coalesce(sum(views),0),
  'today_views',(select coalesce(sum(views),0) from public.website_daily_totals where day=today),
  'previous_views',case when days=90 then null else (select coalesce(sum(views),0) from public.website_daily_totals where day>=since-days and day<since) end,
  'countries',count(distinct nullif(country,'Unknown')),
  'located_views',coalesce(sum(views) filter(where country<>'Unknown'),0),
  'first_day',(select min(day) from public.website_daily_totals),
  'locations_total',(select count(*) from (select country,region,city from public.website_daily_totals where day>=since and day<=today group by country,region,city)t),
  'locations',(select coalesce(jsonb_agg(to_jsonb(t)),'[]') from (select country,region,city,sum(views) views from public.website_daily_totals where day>=since and day<=today group by country,region,city order by views desc,country,region,city limit 100)t),
  'pages',(select coalesce(jsonb_agg(to_jsonb(t)),'[]') from (select page,sum(views) views from public.website_daily_totals where day>=since and day<=today group by page order by views desc,page)t),
  'daily',(select coalesce(jsonb_agg(to_jsonb(t)),'[]') from (select to_char(since+i,'YYYY-MM-DD') day_label,coalesce((select sum(views) from public.website_daily_totals where day=since+i),0) views from generate_series(0,days-1)i order by i)t)
 ) into answer from public.website_daily_totals where day>=since and day<=today;
 return answer;
end $$;
revoke all on function public.website_audience_dashboard(integer) from public,anon;
grant execute on function public.website_audience_dashboard(integer) to authenticated;

-- Cached older pages can no longer append session-level tracking events.
-- Previously consented records remain subject to their existing 90-day deletion job.
create or replace function public.record_website_event(p jsonb) returns void language plpgsql security invoker set search_path='' as $$ begin return; end $$;
revoke all on function public.record_website_event(jsonb) from public,anon,authenticated;
grant execute on function public.record_website_event(jsonb) to service_role;
select cron.schedule('website-daily-retention','23 3 * * *',$job$delete from public.website_daily_totals where day < (now() at time zone 'Europe/Madrid')::date-89;$job$);

-- Accept the new published policy and cached versions during rollout.
create or replace function public.handle_new_user() returns trigger language plpgsql security definer set search_path='' as $$
declare version text:=new.raw_user_meta_data->>'privacy_version';
begin
 if coalesce(new.raw_user_meta_data->>'privacy_accepted','')<>'true' or version is null or version not in ('2026-10-22','2026-11-05','2026-11-18','2026-11-20') then raise exception 'Debes aceptar la política de privacidad vigente.'; end if;
 insert into public.profiles(id,shop_name,contact_name,email,role,status) values(new.id,coalesce(nullif(trim(new.raw_user_meta_data->>'shop_name'),''),'Tienda pendiente'),coalesce(nullif(trim(new.raw_user_meta_data->>'contact_name'),''),'Contacto pendiente'),new.email,'shop','pending');
 insert into public.privacy_acceptances(user_id,policy_version,policy_path,language) values(new.id,version,'/politica-privacidad-bebepunt/privacidad/index.html',case when new.raw_user_meta_data->>'preferred_language'='en' then 'en' else 'es' end);
 return new;
end $$;
revoke all on function public.handle_new_user() from public,anon,authenticated;

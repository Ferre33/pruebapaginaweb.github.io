-- Accept and record the policy version actually displayed; preserve approval gates.
create or replace function public.handle_new_user() returns trigger language plpgsql security definer set search_path='' as $$
declare version text:=new.raw_user_meta_data->>'privacy_version';
begin
 if coalesce(new.raw_user_meta_data->>'privacy_accepted','')<>'true' or version is null or version not in ('2026-10-22','2026-11-05','2026-11-18') then raise exception 'Debes aceptar la política de privacidad vigente.'; end if;
 insert into public.profiles(id,shop_name,contact_name,email,role,status) values(new.id,coalesce(nullif(trim(new.raw_user_meta_data->>'shop_name'),''),'Tienda pendiente'),coalesce(nullif(trim(new.raw_user_meta_data->>'contact_name'),''),'Contacto pendiente'),new.email,'shop','pending');
 insert into public.privacy_acceptances(user_id,policy_version,policy_path,language) values(new.id,version,'/politica-privacidad-bebepunt/privacidad/index.html',case when new.raw_user_meta_data->>'preferred_language'='en' then 'en' else 'es' end);
 return new;
end $$;
revoke all on function public.handle_new_user() from public,anon,authenticated;

create table public.website_events(
 id uuid primary key, session_id uuid not null, created_at timestamptz not null default now(),
 page text not null check(length(page)<=150), country text not null default 'Unknown',
 region text not null default 'Unknown',city text not null default 'Unknown',
 device text not null check(device in ('mobile','tablet','desktop')),language text not null check(language in ('es','en')),
 referrer text not null check(length(referrer)<=150)
);
alter table public.website_events enable row level security;
revoke all on public.website_events from public,anon,authenticated;
grant all on public.website_events to service_role;
create index website_events_time on public.website_events(created_at);
create index website_events_session_time on public.website_events(session_id,created_at);
create function public.record_website_event(p jsonb) returns void language plpgsql security definer set search_path='' as $$
begin
 -- Bound traffic and deduplicate browser retries. Anonymous clients cannot call this RPC.
 if (select count(*) from public.website_events where created_at>now()-interval '1 day')>=20000 then return; end if;
 if (select count(*) from public.website_events where session_id=(p->>'session_id')::uuid and created_at>now()-interval '1 hour')>=120 then return; end if;
 insert into public.website_events(id,session_id,page,country,region,city,device,language,referrer)
 values((p->>'id')::uuid,(p->>'session_id')::uuid,p->>'page',left(p->>'country',80),left(p->>'region',80),left(p->>'city',100),p->>'device',p->>'language',p->>'referrer') on conflict(id) do nothing;
end $$;
revoke all on function public.record_website_event(jsonb) from public,anon,authenticated;
grant execute on function public.record_website_event(jsonb) to service_role;
create function public.website_dashboard(days integer default 30) returns jsonb language plpgsql security definer set search_path='' as $$
declare since timestamptz; answer jsonb;
begin
 if not public.is_admin() then raise exception 'admin_only' using errcode='42501'; end if;
 if days not in (1,7,30,90) then raise exception 'invalid_period'; end if;
 since:=case when days=1 then date_trunc('day',now() at time zone 'Europe/Madrid') at time zone 'Europe/Madrid' else now()-make_interval(days=>days) end;
 select jsonb_build_object(
 'updated_at',now(),'views',count(*),'sessions',count(distinct session_id),
 'active',(select count(distinct session_id) from public.website_events where created_at>now()-interval '5 minutes'),
 'previous_views',(select count(*) from public.website_events where created_at>=since-(now()-since) and created_at<since),
 'countries',count(distinct nullif(country,'Unknown')),
 'first_seen',(select min(created_at) from public.website_events),
 'locations',(select coalesce(jsonb_agg(to_jsonb(t)),'[]') from (select country,region,city,count(*) views,count(distinct session_id) sessions from public.website_events where created_at>=since group by country,region,city order by views desc limit 100)t),
 'pages',(select coalesce(jsonb_agg(to_jsonb(t)),'[]') from (select page,count(*) views from public.website_events where created_at>=since group by page order by views desc limit 30)t),
 'devices',(select coalesce(jsonb_agg(to_jsonb(t)),'[]') from (select device,count(*) views from public.website_events where created_at>=since group by device order by views desc)t),
 'sources',(select coalesce(jsonb_agg(to_jsonb(t)),'[]') from (select referrer,count(*) views from public.website_events where created_at>=since group by referrer order by views desc limit 20)t),
 'daily',(select coalesce(jsonb_agg(to_jsonb(t)),'[]') from (select to_char(created_at at time zone 'Europe/Madrid','YYYY-MM-DD') as day_label,count(*) views from public.website_events where created_at>=since group by day_label order by day_label)t)
 ) into answer from public.website_events where created_at>=since;
 return answer;
end $$;
revoke all on function public.website_dashboard(integer) from public,anon;
grant execute on function public.website_dashboard(integer) to authenticated;
select cron.schedule('website-events-retention','17 3 * * *',$job$delete from public.website_events where created_at<now()-interval '90 days';$job$);

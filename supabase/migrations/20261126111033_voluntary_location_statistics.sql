-- Separate voluntary locality contributions from existing IP-based page-view totals.
create table public.website_zone_daily (
 day date not null default ((now() at time zone 'Europe/Madrid')::date),
 country text not null check (country ~ '^[A-Z]{2}$'),
 region text not null check (length(region) between 1 and 150),
 province text not null check (length(province) between 1 and 150),
 city text not null check (length(city) between 1 and 150),
 method text not null check (method in ('device','selected')),
 consent_version text not null check (consent_version='2026-11-26'),
 reports bigint not null default 1 check (reports>0),
 primary key(day,country,region,province,city,method,consent_version)
);
alter table public.website_zone_daily enable row level security;
revoke all on public.website_zone_daily from public,anon,authenticated;
grant select on public.website_zone_daily to authenticated;
grant select,insert,update,delete on public.website_zone_daily to service_role;
create policy website_zone_admin_read on public.website_zone_daily for select to authenticated using ((select public.is_admin()));

-- Short-lived operation hashes prevent retry duplicates. No geography, IP or user ID.
create schema if not exists bebepunt_analytics_private;
revoke all on schema bebepunt_analytics_private from public,anon,authenticated;
grant usage on schema bebepunt_analytics_private to service_role;
create table bebepunt_analytics_private.website_zone_receipts (
 token_hash text primary key check (token_hash ~ '^[a-f0-9]{64}$'),
 expires_at timestamptz not null default (now()+interval '30 minutes')
);
alter table bebepunt_analytics_private.website_zone_receipts enable row level security;
revoke all on bebepunt_analytics_private.website_zone_receipts from public,anon,authenticated;
grant select,insert,delete on bebepunt_analytics_private.website_zone_receipts to service_role;

create function public.record_website_zone(p jsonb,receipt text) returns boolean
language plpgsql security invoker set search_path='' as $$
declare inserted integer;
begin
 if p is null or jsonb_typeof(p)<>'object' or not (p ?& array['country','region','province','city','method','consent_version']) or p-array['country','region','province','city','method','consent_version']<>'{}'::jsonb then raise exception 'invalid_zone'; end if;
 if receipt is null or receipt !~ '^[a-f0-9]{64}$' then raise exception 'invalid_receipt'; end if;
 insert into bebepunt_analytics_private.website_zone_receipts(token_hash) values(receipt) on conflict do nothing;
 get diagnostics inserted=row_count;
 if inserted=0 then return false; end if;
 insert into public.website_zone_daily(day,country,region,province,city,method,consent_version,reports)
 values((now() at time zone 'Europe/Madrid')::date,p->>'country',p->>'region',p->>'province',p->>'city',p->>'method',p->>'consent_version',1)
 on conflict(day,country,region,province,city,method,consent_version) do update set reports=public.website_zone_daily.reports+1;
 return true;
end $$;
revoke all on function public.record_website_zone(jsonb,text) from public,anon,authenticated;
grant execute on function public.record_website_zone(jsonb,text) to service_role;

create function public.website_zone_dashboard(days integer default 30) returns jsonb
language plpgsql security invoker set search_path='' as $$
declare today date:=(now() at time zone 'Europe/Madrid')::date; since date; answer jsonb;
begin
 if not coalesce(public.is_admin(),false) then raise exception 'admin_only' using errcode='42501'; end if;
 if days is null or days not in (1,7,30,90) then raise exception 'invalid_period'; end if;
 since:=today-days+1;
 select jsonb_build_object(
  'reports',coalesce(sum(reports),0),
  'device_reports',coalesce(sum(reports) filter(where method='device'),0),
  'selected_reports',coalesce(sum(reports) filter(where method='selected'),0),
  'locations_total',(select count(*) from (select country,region,province,city from public.website_zone_daily where day between since and today group by country,region,province,city)t),
  'locations',(select coalesce(jsonb_agg(to_jsonb(t)),'[]') from (
   select country,region,province,city,sum(reports) reports,
    sum(reports) filter(where method='device') device_reports,
    sum(reports) filter(where method='selected') selected_reports
   from public.website_zone_daily where day between since and today group by country,region,province,city
   order by reports desc,country,region,province,city limit 1000)t)
 ) into answer from public.website_zone_daily where day between since and today;
 return answer;
end $$;
revoke all on function public.website_zone_dashboard(integer) from public,anon;
grant execute on function public.website_zone_dashboard(integer) to authenticated;

select cron.schedule('website-zone-retention','37 3 * * *',$job$delete from public.website_zone_daily where day < (now() at time zone 'Europe/Madrid')::date-89;$job$);
select cron.schedule('website-zone-receipts','*/10 * * * *',$job$delete from bebepunt_analytics_private.website_zone_receipts where expires_at<now();$job$);

-- Keep cached form versions working while the revised notice is deployed.
create or replace function public.handle_new_user() returns trigger language plpgsql security definer set search_path='' as $$
declare version text:=new.raw_user_meta_data->>'privacy_version';
begin
 if coalesce(new.raw_user_meta_data->>'privacy_accepted','')<>'true' or version is null or version not in ('2026-10-22','2026-11-05','2026-11-18','2026-11-20','2026-11-26') then raise exception 'Debes aceptar la política de privacidad vigente.'; end if;
 insert into public.profiles(id,shop_name,contact_name,email,role,status) values(new.id,coalesce(nullif(trim(new.raw_user_meta_data->>'shop_name'),''),'Tienda pendiente'),coalesce(nullif(trim(new.raw_user_meta_data->>'contact_name'),''),'Contacto pendiente'),new.email,'shop','pending');
 insert into public.privacy_acceptances(user_id,policy_version,policy_path,language) values(new.id,version,'/politica-privacidad-bebepunt/privacidad/index.html',case when new.raw_user_meta_data->>'preferred_language'='en' then 'en' else 'es' end);
 return new;
end $$;
revoke all on function public.handle_new_user() from public,anon,authenticated;

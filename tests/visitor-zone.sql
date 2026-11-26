begin;
set local role service_role;
do $$
declare p jsonb:='{"country":"ES","region":"Comunitat Valenciana","province":"Valencia","city":"Ayora","method":"selected","consent_version":"2026-11-26"}'; baseline bigint; result boolean;
begin
 select coalesce(sum(reports),0) into baseline from public.website_zone_daily;
 result:=public.record_website_zone(p,repeat('a',64));
 if result is not true then raise exception 'first submission not recorded'; end if;
 result:=public.record_website_zone(p,repeat('a',64));
 if result is not false then raise exception 'retry was duplicated'; end if;
 if (select coalesce(sum(reports),0) from public.website_zone_daily)<>baseline+1 then raise exception 'incorrect total'; end if;
 begin
  perform public.record_website_zone(p||'{"latitude":39.06}',repeat('b',64));
  raise exception 'unexpected coordinate accepted';
 exception when raise_exception then if sqlerrm<>'invalid_zone' then raise; end if;
 end;
end $$;
reset role;
set local role anon;
do $$begin
 begin perform public.website_zone_dashboard(30);raise exception 'anonymous dashboard access';exception when insufficient_privilege then null;end;
 begin perform public.record_website_zone('{}',repeat('c',64));raise exception 'anonymous write access';exception when insufficient_privilege then null;end;
end $$;
reset role;
select set_config('request.jwt.claim.sub','00000000-0000-0000-0000-000000000000',true);
set local role authenticated;
do $$begin
 if (select count(*) from public.website_zone_daily)<>0 then raise exception 'RLS exposed locality data';end if;
 begin perform public.website_zone_dashboard(30);raise exception 'non-admin dashboard access';exception when insufficient_privilege then null;end;
 begin perform public.record_website_zone('{}',repeat('c',64));raise exception 'client write access';exception when insufficient_privilege then null;end;
end $$;
reset role;
do $$declare administrator text;begin
 select id::text into administrator from public.profiles where role='admin' and status='approved' order by created_at limit 1;
 if administrator is null then raise exception 'admin fixture unavailable';end if;
 perform set_config('request.jwt.claim.sub',administrator,true);
end $$;
set local role authenticated;
do $$declare d jsonb;begin
 d:=public.website_zone_dashboard(30);
 if (d->>'reports')::bigint<1 or not jsonb_typeof(d->'locations')='array' then raise exception 'admin dashboard failed';end if;
 begin perform public.website_zone_dashboard(0);raise exception 'invalid period accepted';exception when raise_exception then if sqlerrm<>'invalid_period' then raise;end if;end;
end $$;
reset role;
rollback;
select 'PASS: atomic count, duplicate suppression, coordinate rejection, admin-only RLS and rollback' as result;

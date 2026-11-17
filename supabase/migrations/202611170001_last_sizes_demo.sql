-- Isolated demo inventory. No payments, commercial orders or warehouse movements.
create table public.last_sizes_demo (
 id uuid primary key default gen_random_uuid(), name text not null check(length(trim(name)) between 1 and 120),
 name_en text not null check(length(trim(name_en)) between 1 and 120), size_label text not null check(length(trim(size_label)) between 1 and 32),
 stock integer not null check(stock between 0 and 99999), published boolean not null default false
);
alter table public.last_sizes_demo enable row level security;
revoke all on public.last_sizes_demo from public, anon, authenticated;
grant select,insert(name,name_en,size_label,stock),update(published) on public.last_sizes_demo to authenticated;
create policy last_sizes_admin on public.last_sizes_demo for all to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));
insert into public.last_sizes_demo(name,name_en,size_label,stock,published) values
 ('Pelele Alma','Alma romper','6 M',4,true),('Vestido Aura','Aura dress','3 A / Y',2,true),('Peto Aguamarina','Aquamarine dungarees','12 M',3,false);

create schema last_sizes_private;
revoke all on schema last_sizes_private from public,anon,authenticated;
create table last_sizes_private.last_sizes_demo_receipts (
 admin_id uuid not null, request_id uuid not null, lines jsonb not null, created_at timestamptz not null default now(), primary key(admin_id,request_id)
);
revoke all on last_sizes_private.last_sizes_demo_receipts from public,anon,authenticated;
create function public.buy_last_sizes_demo(request_id uuid, basket jsonb) returns void
language plpgsql security definer set search_path='' as $$
declare line record; saved jsonb;
begin
 if not public.is_admin() then raise exception 'admin_only' using errcode='42501'; end if;
 if request_id is null or jsonb_typeof(basket) is distinct from 'object' or basket='{}'::jsonb then raise exception 'invalid_basket'; end if;
 insert into last_sizes_private.last_sizes_demo_receipts values(auth.uid(),request_id,basket,now()) on conflict do nothing;
 if not found then
  select r.lines into saved from last_sizes_private.last_sizes_demo_receipts r where r.admin_id=auth.uid() and r.request_id=buy_last_sizes_demo.request_id;
  if saved is distinct from basket then raise exception 'invalid_basket'; end if;
  return;
 end if;
 for line in select key,value from jsonb_each(basket) order by key loop
  if jsonb_typeof(line.value)<>'number' or line.value::text !~ '^[1-9][0-9]{0,4}$' then raise exception 'invalid_quantity'; end if;
  update public.last_sizes_demo set stock=stock-line.value::text::integer
   where id=line.key::uuid and published and stock>=line.value::text::integer;
  if not found then raise exception 'insufficient_stock'; end if;
 end loop;
end $$;
revoke all on function public.buy_last_sizes_demo(uuid,jsonb) from public,anon;
grant execute on function public.buy_last_sizes_demo(uuid,jsonb) to authenticated;

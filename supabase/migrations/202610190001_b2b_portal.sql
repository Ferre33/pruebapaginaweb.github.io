-- BEBEPUNT B2B portal — Supabase/PostgreSQL migration
-- Run in a fresh Supabase project. Review and test in staging before production.
create extension if not exists pgcrypto;

create type public.shop_status as enum ('pending','approved','rejected','suspended');
create type public.order_status as enum ('received','processing','shipped','completed','cancelled');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role text not null default 'shop' check (role in ('shop','admin')),
  status public.shop_status not null default 'pending',
  shop_name text not null,
  contact_name text not null,
  tax_id text,
  phone text,
  address text,
  postal_code text,
  city text,
  country text not null default 'España',
  email text,
  approved_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.collections (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  season text,
  is_active boolean not null default true,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

create table public.products (
  id uuid primary key default gen_random_uuid(),
  collection_id uuid references public.collections(id) on delete set null,
  name text not null,
  slug text not null unique,
  description text not null default '',
  image_path text,
  is_active boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.product_variants (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  sku text not null unique,
  size text not null default '',
  color text not null default '',
  professional_price numeric(12,2) not null check (professional_price >= 0),
  stock integer not null default 0 check (stock >= 0),
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  unique(product_id, size, color)
);

create table public.orders (
  id uuid primary key default gen_random_uuid(),
  order_number bigint generated always as identity unique,
  shop_id uuid not null references public.profiles(id),
  status public.order_status not null default 'received',
  customer_note text not null default '',
  subtotal numeric(12,2) not null check (subtotal >= 0),
  currency char(3) not null default 'EUR',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  variant_id uuid references public.product_variants(id) on delete set null,
  sku_snapshot text not null,
  product_snapshot text not null,
  size_snapshot text not null default '',
  color_snapshot text not null default '',
  unit_price numeric(12,2) not null check (unit_price >= 0),
  quantity integer not null check (quantity > 0),
  line_total numeric(12,2) generated always as (unit_price * quantity) stored
);

create index products_collection_active_idx on public.products(collection_id, is_active);
create index variants_product_active_idx on public.product_variants(product_id, is_active);
create index orders_shop_created_idx on public.orders(shop_id, created_at desc);
create index order_items_order_idx on public.order_items(order_id);

create or replace function public.is_admin()
returns boolean language sql stable security definer set search_path = '' as $$
  select exists(select 1 from public.profiles p where p.id = (select auth.uid()) and p.role = 'admin');
$$;

create or replace function public.is_approved_shop()
returns boolean language sql stable security definer set search_path = '' as $$
  select exists(
    select 1 from public.profiles p join auth.users u on u.id = p.id
    where p.id = (select auth.uid()) and p.role = 'shop'
      and p.status = 'approved' and u.email_confirmed_at is not null
  );
$$;

-- Create a profile when an account is created. Registration metadata is untrusted;
-- role/status are always forced to shop/pending.
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = '' as $$
begin
  insert into public.profiles (id, shop_name, contact_name, email, role, status)
  values (
    new.id,
    coalesce(nullif(trim(new.raw_user_meta_data ->> 'shop_name'), ''), 'Tienda pendiente'),
    coalesce(nullif(trim(new.raw_user_meta_data ->> 'contact_name'), ''), 'Contacto pendiente'),
    new.email, 'shop', 'pending'
  );
  return new;
end;
$$;
create trigger on_auth_user_created after insert on auth.users
for each row execute procedure public.handle_new_user();

alter table public.profiles enable row level security;
alter table public.collections enable row level security;
alter table public.products enable row level security;
alter table public.product_variants enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;

create policy "profile self read or admin" on public.profiles for select to authenticated
using (id = (select auth.uid()) or (select public.is_admin()));
-- Shop profile changes are admin-only in this initial version to prevent role/status escalation.
create policy "admin manage profiles" on public.profiles for all to authenticated
using ((select public.is_admin())) with check ((select public.is_admin()));

create policy "approved shops read active collections" on public.collections for select to authenticated
using (is_active and (select public.is_approved_shop()) or (select public.is_admin()));
create policy "admins manage collections" on public.collections for all to authenticated
using ((select public.is_admin())) with check ((select public.is_admin()));

create policy "approved shops read active products" on public.products for select to authenticated
using ((is_active and (select public.is_approved_shop())) or (select public.is_admin()));
create policy "admins manage products" on public.products for all to authenticated
using ((select public.is_admin())) with check ((select public.is_admin()));

create policy "approved shops read active variants" on public.product_variants for select to authenticated
using ((is_active and (select public.is_approved_shop())) or (select public.is_admin()));
create policy "admins manage variants" on public.product_variants for all to authenticated
using ((select public.is_admin())) with check ((select public.is_admin()));

create policy "shops read own orders admin all" on public.orders for select to authenticated
using (shop_id = (select auth.uid()) or (select public.is_admin()));
create policy "admins update orders" on public.orders for update to authenticated
using ((select public.is_admin())) with check ((select public.is_admin()));
create policy "shops read own order items admin all" on public.order_items for select to authenticated
using (exists(select 1 from public.orders o where o.id = order_id and (o.shop_id = (select auth.uid()) or (select public.is_admin()))));
create policy "admins manage order items" on public.order_items for all to authenticated
using ((select public.is_admin())) with check ((select public.is_admin()));

-- No client-side inserts into orders/items. The RPC validates stock and price,
-- locks stock rows, calculates totals on the server and creates the order atomically.
create or replace function public.place_b2b_order(p_items jsonb, p_note text default '')
returns table(order_id uuid, order_number bigint, subtotal numeric)
language plpgsql security definer set search_path = '' as $$
declare
  v_uid uuid := (select auth.uid());
  v_order_id uuid;
  v_order_number bigint;
  v_subtotal numeric(12,2) := 0;
  v_item jsonb;
  v_variant public.product_variants%rowtype;
  v_qty integer;
  v_shop public.profiles%rowtype;
begin
  if v_uid is null then raise exception 'Debes iniciar sesión.'; end if;
  select * into v_shop from public.profiles where id = v_uid for share;
  if not found or v_shop.status <> 'approved' or v_shop.role <> 'shop' or not (select public.is_approved_shop()) then
    raise exception 'La cuenta de tienda no está aprobada.';
  end if;
  if jsonb_typeof(p_items) <> 'array' or jsonb_array_length(p_items) < 1 or jsonb_array_length(p_items) > 100 then
    raise exception 'El carrito no es válido.';
  end if;
  -- Validate all quantities and availability before creating the order.
  for v_item in select value from jsonb_array_elements(p_items) loop
    if coalesce(v_item->>'variant_id','') !~* '^[0-9a-f-]{36}$' then raise exception 'Variante no válida.'; end if;
    if coalesce(v_item->>'quantity','') !~ '^[1-9][0-9]{0,3}$' then raise exception 'Cantidad no válida.'; end if;
    v_qty := (v_item->>'quantity')::integer;
    select pv.* into v_variant
      from public.product_variants pv join public.products p on p.id = pv.product_id
      where pv.id = (v_item->>'variant_id')::uuid and pv.is_active and p.is_active
      for update of pv;
    if not found then raise exception 'Hay un producto que ya no está disponible.'; end if;
    if v_variant.stock < v_qty then raise exception 'Stock insuficiente para SKU %.', v_variant.sku; end if;
    v_subtotal := v_subtotal + (v_variant.professional_price * v_qty);
  end loop;
  insert into public.orders(shop_id, customer_note, subtotal)
  values (v_uid, left(coalesce(p_note,''), 2000), v_subtotal)
  returning id, orders.order_number into v_order_id, v_order_number;
  for v_item in select value from jsonb_array_elements(p_items) loop
    v_qty := (v_item->>'quantity')::integer;
    select pv.* into v_variant from public.product_variants pv
      where pv.id = (v_item->>'variant_id')::uuid for update;
    if v_variant.stock < v_qty or not v_variant.is_active then raise exception 'El stock ha cambiado; actualiza el carrito.'; end if;
    insert into public.order_items(order_id, variant_id, sku_snapshot, product_snapshot, size_snapshot, color_snapshot, unit_price, quantity)
    select v_order_id, v_variant.id, v_variant.sku, p.name, v_variant.size, v_variant.color, v_variant.professional_price, v_qty
    from public.products p where p.id = v_variant.product_id;
    update public.product_variants set stock = stock - v_qty where id = v_variant.id;
  end loop;
  return query select v_order_id, v_order_number, v_subtotal;
end;
$$;
revoke all on function public.place_b2b_order(jsonb,text) from public, anon;
grant execute on function public.place_b2b_order(jsonb,text) to authenticated;

-- Only admins can approve/reject/suspend a store. The function keeps approval logic server-side.
create or replace function public.set_shop_status(p_shop_id uuid, p_status public.shop_status)
returns void language plpgsql security definer set search_path = '' as $$
begin
  if not (select public.is_admin()) then raise exception 'No autorizado.'; end if;
  if p_status = 'approved' then
    update public.profiles set status = p_status, approved_at = now(), updated_at = now() where id = p_shop_id and role = 'shop';
  else
    update public.profiles set status = p_status, updated_at = now() where id = p_shop_id and role = 'shop';
  end if;
  if not found then raise exception 'Tienda no encontrada.'; end if;
end;
$$;
revoke all on function public.set_shop_status(uuid,public.shop_status) from public, anon;
grant execute on function public.set_shop_status(uuid,public.shop_status) to authenticated;

-- Storage: create a PRIVATE bucket named "b2b-product-media" in Supabase Storage.
-- Do not expose original wholesale catalog files in the public bucket.


-- Private Storage policies for signed URLs. Create the private bucket first.
-- The path is not treated as an authorization boundary by itself; membership is checked in SQL.
create policy "approved shops and admins read private product media"
on storage.objects for select to authenticated
using (
  bucket_id = 'b2b-product-media'
  and (
    (select public.is_approved_shop())
    or (select public.is_admin())
  )
);
create policy "admins upload private product media"
on storage.objects for insert to authenticated
with check (bucket_id = 'b2b-product-media' and (select public.is_admin()));
create policy "admins update private product media"
on storage.objects for update to authenticated
using (bucket_id = 'b2b-product-media' and (select public.is_admin()))
with check (bucket_id = 'b2b-product-media' and (select public.is_admin()));
create policy "admins delete private product media"
on storage.objects for delete to authenticated
using (bucket_id = 'b2b-product-media' and (select public.is_admin()));

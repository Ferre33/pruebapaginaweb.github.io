-- Apply AFTER 202610190001_b2b_portal.sql. Existing profiles/products/orders are preserved.
begin;
alter table public.profiles add column if not exists avatar_path text;
alter table public.products add column if not exists is_orderable boolean not null default false;
alter table public.products add column if not exists made_to_order boolean not null default true;
alter table public.products add column if not exists composition text not null default '';
alter table public.products add column if not exists washing text not null default '';
alter table public.products add column if not exists measurements text not null default '';
alter table public.products add column if not exists lead_time text not null default '';
alter table public.products add column if not exists size_guide jsonb not null default '[]';
alter table public.orders add column if not exists customer_snapshot jsonb;
alter table public.orders add column if not exists tax_amount numeric(12,2) not null default 0;
alter table public.orders add column if not exists tax_rate numeric(6,4) not null default 0;
alter table public.orders add column if not exists total numeric(12,2);
alter table public.orders add column if not exists deposit_amount numeric(12,2);
alter table public.orders add column if not exists deposit_paid boolean not null default false;
alter table public.orders add column if not exists balance_paid boolean not null default false;
alter table public.orders add column if not exists balance_requested boolean not null default false;
alter table public.orders add column if not exists request_id uuid;
create unique index if not exists orders_request_unique on public.orders(shop_id,request_id);
-- Legacy orders are deliberately not converted to payable orders without an operator review.
create table if not exists public.commerce_settings(
 id boolean primary key default true check(id), checkout_enabled boolean not null default false,
 tax_rate numeric(6,4) not null default 0 check(tax_rate between 0 and 1),
 allowed_countries text[] not null default array['ES'],
 terms_version text not null default 'pending'
);
insert into public.commerce_settings(id) values(true) on conflict do nothing;
alter table public.commerce_settings enable row level security;
create policy "members read commerce settings" on public.commerce_settings for select to authenticated using(public.is_approved_shop() or public.is_admin());
create policy "admins manage commerce settings" on public.commerce_settings for all to authenticated using(public.is_admin()) with check(public.is_admin());
alter table public.orders add column if not exists terms_version text;
create table if not exists public.order_payments(
 order_id uuid not null references public.orders(id), phase text not null check(phase in ('deposit','balance')),
 session_id text unique, session_url text, attempt integer not null default 0,
 invoice_id text, payment_intent_id text, paid boolean not null default false,
 primary key(order_id,phase)
);
alter table public.order_payments enable row level security;
-- Only server service role can access payment sessions. Customers request documents through API ownership checks.
revoke all on public.order_payments from anon,authenticated;
-- Prevent the old RPC from bypassing seasonal availability, fiscal snapshots and deposits.
revoke execute on function public.place_b2b_order(jsonb,text) from authenticated;
-- Prevent direct admin writes to payment flags; the verified server manages status changes.
drop policy if exists "admins update orders" on public.orders;

create or replace function public.update_my_profile(p_data jsonb) returns void
language plpgsql security definer set search_path='' as $$
declare v_avatar text:=p_data->>'avatar_path';
begin
 if auth.uid() is null then raise exception 'Debes iniciar sesión.'; end if;
 if length(trim(coalesce(p_data->>'shop_name','')))<1 or length(trim(coalesce(p_data->>'contact_name','')))<1 then raise exception 'Completa la tienda y el contacto.'; end if;
 if coalesce(p_data->>'country','') !~ '^[A-Z]{2}$' then raise exception 'Introduce el código de país de dos letras (ES, PT…).'; end if;
 if v_avatar is not null and split_part(v_avatar,'/',1)<>auth.uid()::text then raise exception 'Foto no válida.'; end if;
 update public.profiles set shop_name=left(trim(p_data->>'shop_name'),160),contact_name=left(trim(p_data->>'contact_name'),160),
 tax_id=left(trim(p_data->>'tax_id'),80),phone=left(trim(p_data->>'phone'),80),address=left(trim(p_data->>'address'),300),
 postal_code=left(trim(p_data->>'postal_code'),30),city=left(trim(p_data->>'city'),160),country=p_data->>'country',avatar_path=v_avatar,updated_at=now()
 where id=auth.uid();
 if not found then raise exception 'Perfil no encontrado.'; end if;
end;$$;
revoke all on function public.update_my_profile(jsonb) from public,anon;
grant execute on function public.update_my_profile(jsonb) to authenticated;

create or replace function public.create_b2b_order(p_items jsonb,p_note text,p_request uuid) returns uuid
language plpgsql security definer set search_path='' as $$
declare
 v_shop public.profiles%rowtype; v_settings public.commerce_settings%rowtype;
 v_order uuid; v_item jsonb; v_variant public.product_variants%rowtype; v_product public.products%rowtype;
 v_qty integer; v_subtotal numeric(12,2):=0; v_tax numeric(12,2); v_total numeric(12,2);
begin
 if not public.is_approved_shop() then raise exception 'Se requiere una tienda aprobada y correo verificado.'; end if;
 select * into v_shop from public.profiles where id=auth.uid() for update;
 if p_request is null then raise exception 'Falta la referencia de la solicitud.'; end if;
 select id into v_order from public.orders where shop_id=auth.uid() and request_id=p_request;
 if found then return v_order; end if;
 select * into v_settings from public.commerce_settings where id=true;
 if not v_settings.checkout_enabled or v_settings.terms_version='pending' then raise exception 'La venta online todavía no está habilitada.'; end if;
 if coalesce(trim(v_shop.tax_id),'')='' or coalesce(trim(v_shop.address),'')='' or coalesce(trim(v_shop.city),'')='' or coalesce(trim(v_shop.postal_code),'')='' or coalesce(trim(v_shop.phone),'')='' then raise exception 'Completa los datos de facturación y contacto en Mi perfil.'; end if;
 if not(v_shop.country=any(v_settings.allowed_countries)) then raise exception 'Contacta con BEBEPUNT para pedidos a este país.'; end if;
 if p_items is null or jsonb_typeof(p_items)<>'array' then raise exception 'Carrito no válido.'; end if;
 if jsonb_array_length(p_items)<1 or jsonb_array_length(p_items)>100 then raise exception 'El carrito debe tener entre 1 y 100 variantes.'; end if;
 if (select count(*)<>count(distinct value->>'variant_id') from jsonb_array_elements(p_items)) then raise exception 'No repitas variantes.'; end if;
 for v_item in select value from jsonb_array_elements(p_items) order by value->>'variant_id' loop
  if coalesce(v_item->>'quantity','') !~ '^[1-9][0-9]{0,3}$' then raise exception 'Cantidad no válida.'; end if;
  v_qty:=(v_item->>'quantity')::integer;
  select * into v_variant from public.product_variants where id=(v_item->>'variant_id')::uuid and is_active for update;
  if not found then raise exception 'Variante no disponible.'; end if;
  select * into v_product from public.products where id=v_variant.product_id for share;
  if not v_product.is_active or not v_product.is_orderable then raise exception 'El modelo % no está disponible esta temporada.',v_product.name; end if;
  if not v_product.made_to_order and v_variant.stock<v_qty then raise exception 'Stock insuficiente: %.',v_variant.sku; end if;
  v_subtotal:=v_subtotal+v_qty*v_variant.professional_price;
 end loop;
 v_tax:=round(v_subtotal*v_settings.tax_rate,2);v_total:=v_subtotal+v_tax;
 if v_total<1 then raise exception 'El importe mínimo del pedido es 1 EUR.'; end if;
 insert into public.orders(shop_id,customer_note,subtotal,tax_rate,tax_amount,total,deposit_amount,customer_snapshot,request_id,terms_version)
 values(auth.uid(),left(coalesce(p_note,''),2000),v_subtotal,v_settings.tax_rate,v_tax,v_total,round(v_total/2,2),
 jsonb_build_object('shop_name',v_shop.shop_name,'contact_name',v_shop.contact_name,'tax_id',v_shop.tax_id,'phone',v_shop.phone,'email',v_shop.email,'address',v_shop.address,'postal_code',v_shop.postal_code,'city',v_shop.city,'country',v_shop.country),p_request,v_settings.terms_version) returning id into v_order;
 for v_item in select value from jsonb_array_elements(p_items) order by value->>'variant_id' loop
  v_qty:=(v_item->>'quantity')::integer;
  select * into v_variant from public.product_variants where id=(v_item->>'variant_id')::uuid;
  select * into v_product from public.products where id=v_variant.product_id;
  insert into public.order_items(order_id,variant_id,sku_snapshot,product_snapshot,size_snapshot,color_snapshot,unit_price,quantity)
  values(v_order,v_variant.id,v_variant.sku,v_product.name,v_variant.size,v_variant.color,v_variant.professional_price,v_qty);
  if not v_product.made_to_order then update public.product_variants set stock=stock-v_qty where id=v_variant.id; end if;
 end loop;
 return v_order;
end;$$;
revoke all on function public.create_b2b_order(jsonb,text,uuid) from public,anon;
grant execute on function public.create_b2b_order(jsonb,text,uuid) to authenticated;

-- Webhook atomic recording: retries are harmless and amount is checked against the stored order.
create or replace function public.record_b2b_payment(p_order uuid,p_phase text,p_session text,p_cents bigint,p_invoice text,p_intent text) returns void
language plpgsql security definer set search_path='' as $$
declare o public.orders%rowtype; expected bigint;
begin
 select * into o from public.orders where id=p_order for update;
 if not found or o.total is null then raise exception 'Pedido no válido.'; end if;
 if p_phase not in ('deposit','balance') then raise exception 'Fase no válida.'; end if;
 expected:=round((case when p_phase='deposit' then o.deposit_amount else o.total-o.deposit_amount end)*100);
 if p_cents<>expected then raise exception 'Importe no válido.'; end if;
 if not exists(select 1 from public.order_payments where order_id=p_order and phase=p_phase and session_id=p_session) then raise exception 'Sesión no reconocida.'; end if;
 update public.order_payments set paid=true,invoice_id=coalesce(p_invoice,invoice_id),payment_intent_id=p_intent where order_id=p_order and phase=p_phase;
 if p_phase='deposit' then update public.orders set deposit_paid=true,updated_at=now() where id=p_order;
 else update public.orders set balance_paid=true,updated_at=now() where id=p_order; end if;
end;$$;
revoke all on function public.record_b2b_payment(uuid,text,text,bigint,text,text) from public,anon,authenticated;
grant execute on function public.record_b2b_payment(uuid,text,text,bigint,text,text) to service_role;
insert into storage.buckets(id,name,public,file_size_limit,allowed_mime_types) values('b2b-avatars','b2b-avatars',false,2097152,array['image/jpeg','image/png','image/webp']) on conflict(id) do nothing;
create policy "own avatar read" on storage.objects for select to authenticated using(bucket_id='b2b-avatars' and (storage.foldername(name))[1]=auth.uid()::text);
create policy "own avatar insert" on storage.objects for insert to authenticated with check(bucket_id='b2b-avatars' and (storage.foldername(name))[1]=auth.uid()::text);
create policy "own avatar delete" on storage.objects for delete to authenticated using(bucket_id='b2b-avatars' and (storage.foldername(name))[1]=auth.uid()::text);
commit;

begin;
alter table public.profiles add column customer_type text not null default 'shop' check(customer_type in ('retail','shop','warehouse'));
create index profiles_customer_type_idx on public.profiles(customer_type,status);
-- Keep the existing catalogue-only mode. This is a server-side price visibility gate.
alter table public.commerce_settings add column customer_prices_enabled boolean not null default false;
drop policy if exists "Enable read access for all users" on public.profiles;
drop policy if exists "Permitir inserción pública de solicitudes" on public.commerce_settings;
create table public.variant_prices(
 variant_id uuid not null references public.product_variants(id) on delete cascade,
 customer_type text not null check(customer_type in ('retail','shop','warehouse')),
 price numeric(12,2) not null check(price >= 0),
 primary key(variant_id,customer_type)
);
alter table public.variant_prices enable row level security;
revoke all on public.variant_prices from public,anon,authenticated;
grant select,insert,update,delete on public.variant_prices to authenticated;
grant all on public.variant_prices to service_role;
create policy "administrators manage tariffs" on public.variant_prices for all to authenticated
 using((select public.is_admin())) with check((select public.is_admin()));
create policy "approved clients read only their published tariff" on public.variant_prices for select to authenticated
 using((select public.is_approved_shop())
 and customer_type=(select p.customer_type from public.profiles p where p.id=(select auth.uid()))
 and exists(select 1 from public.commerce_settings s where s.id and s.customer_prices_enabled and (customer_type<>'retail' or s.retail_enabled))
 and exists(select 1 from public.product_variants v join public.products p on p.id=v.product_id where v.id=variant_id and v.is_active and p.is_active));
insert into public.variant_prices(variant_id,customer_type,price) select id,'shop',professional_price from public.product_variants;
insert into public.variant_prices(variant_id,customer_type,price) select id,'retail',retail_price from public.product_variants where retail_price is not null;
-- Retain legacy prices for backwards compatibility, but do not expose other tariffs.
revoke select on public.product_variants from public,anon,authenticated;
grant select(id,product_id,sku,size,color,color_en,stock,is_active,created_at) on public.product_variants to authenticated;
create function public.set_customer_classification(p_shop_id uuid,p_status public.shop_status,p_customer_type text)
returns void language plpgsql security invoker set search_path='' as $$
begin
 if auth.uid() is null or not public.is_admin() then raise exception 'No autorizado.'; end if;
 if p_customer_type is null or p_customer_type not in ('retail','shop','warehouse') then raise exception 'Clasificación no válida.'; end if;
 update public.profiles set status=p_status,customer_type=p_customer_type,
 approved_at=case when p_status='approved' and status<>'approved' then now() else approved_at end,updated_at=now()
 where id=p_shop_id and role='shop';
 if not found then raise exception 'Cliente no encontrado.'; end if;
end;$$;
revoke all on function public.set_customer_classification(uuid,public.shop_status,text) from public,anon;
grant execute on function public.set_customer_classification(uuid,public.shop_status,text) to authenticated;
-- Price lookup uses RLS and never falls back to another customer category.
create function public.customer_unit_price(p_variant_id uuid,p_customer_type text)
returns numeric language plpgsql security invoker set search_path='' as $$
declare amount numeric;
begin
 select price into amount from public.variant_prices where variant_id=p_variant_id and customer_type=p_customer_type;
 if amount is null then raise exception 'Tarifa pendiente para esta categoría de cliente.'; end if;
 return amount;
end;$$;
revoke all on function public.customer_unit_price(uuid,text) from public,anon;
grant execute on function public.customer_unit_price(uuid,text) to authenticated,service_role;
-- Update the existing checked checkout path; legacy endpoint stays revoked.
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
 if not v_settings.customer_prices_enabled then raise exception 'La venta online todavía no está habilitada.'; end if;
 if v_shop.customer_type='retail' then raise exception 'La venta a particulares todavía no está habilitada.'; end if;
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
  v_subtotal:=v_subtotal+v_qty*public.customer_unit_price(v_variant.id,v_shop.customer_type);
 end loop;
 v_tax:=round(v_subtotal*v_settings.tax_rate,2);v_total:=v_subtotal+v_tax;
 if v_total<1 then raise exception 'El importe mínimo del pedido es 1 EUR.'; end if;
 insert into public.orders(shop_id,customer_note,subtotal,tax_rate,tax_amount,total,deposit_amount,customer_snapshot,request_id,terms_version)
 values(auth.uid(),left(coalesce(p_note,''),2000),v_subtotal,v_settings.tax_rate,v_tax,v_total,round(v_total/2,2),
 jsonb_build_object('customer_type',v_shop.customer_type,'shop_name',v_shop.shop_name,'contact_name',v_shop.contact_name,'tax_id',v_shop.tax_id,'phone',v_shop.phone,'email',v_shop.email,'address',v_shop.address,'postal_code',v_shop.postal_code,'city',v_shop.city,'country',v_shop.country),p_request,v_settings.terms_version) returning id into v_order;
 for v_item in select value from jsonb_array_elements(p_items) order by value->>'variant_id' loop
  v_qty:=(v_item->>'quantity')::integer;
  select * into v_variant from public.product_variants where id=(v_item->>'variant_id')::uuid;
  select * into v_product from public.products where id=v_variant.product_id;
  insert into public.order_items(order_id,variant_id,sku_snapshot,product_snapshot,size_snapshot,color_snapshot,unit_price,quantity)
  values(v_order,v_variant.id,v_variant.sku,v_product.name,v_variant.size,v_variant.color,public.customer_unit_price(v_variant.id,v_shop.customer_type),v_qty);
  if not v_product.made_to_order then update public.product_variants set stock=stock-v_qty where id=v_variant.id; end if;
 end loop;
 return v_order;
end;$$;
create function public.set_variant_tariffs(p_variant_id uuid,p_prices jsonb)
returns void language plpgsql security invoker set search_path='' as $$
declare k text; amount numeric;
begin
 if auth.uid() is null or not public.is_admin() then raise exception 'No autorizado.'; end if;
 if jsonb_typeof(p_prices)<>'object' or p_prices is null then raise exception 'Tarifas no válidas.'; end if;
 perform 1 from public.product_variants where id=p_variant_id for update;
 if not found then raise exception 'Variante no encontrada.'; end if;
 foreach k in array array['retail','shop','warehouse'] loop
  if not(p_prices ? k) then raise exception 'Falta una categoría.'; end if;
  if p_prices->k='null'::jsonb then
   delete from public.variant_prices where variant_id=p_variant_id and customer_type=k;
  else
   if jsonb_typeof(p_prices->k)<>'number' then raise exception 'Precio no válido.'; end if;
   amount=(p_prices->>k)::numeric;
   if amount<0 or amount>9999999999.99 or round(amount,2)<>amount then raise exception 'Precio no válido.'; end if;
   insert into public.variant_prices(variant_id,customer_type,price) values(p_variant_id,k,amount)
   on conflict(variant_id,customer_type) do update set price=excluded.price;
  end if;
 end loop;
end;$$;
revoke all on function public.set_variant_tariffs(uuid,jsonb) from public,anon;
grant execute on function public.set_variant_tariffs(uuid,jsonb) to authenticated;
commit;

-- Run in SQL Editor as postgres. All fixtures and profile edits roll back.
begin;
select set_config('test.admin',(select id::text from public.profiles where role='admin' limit 1),true);
select set_config('test.customer',(select p.id::text from public.profiles p join auth.users u on u.id=p.id where p.role='shop' and u.email_confirmed_at is not null limit 1),true);
do $$begin
 if nullif(current_setting('test.admin'),'') is null or nullif(current_setting('test.customer'),'') is null then raise exception 'A verified client and administrator are required for this test.'; end if;
end$$;
insert into public.products(name,slug,is_active,is_orderable) values('Tariff test','transaction-only-tariff-test',true,true);
insert into public.product_variants(product_id,sku,professional_price,stock) select id,'transaction-only-tariff-test',20,100 from public.products where slug='transaction-only-tariff-test';
select set_config('test.variant',(select id::text from public.product_variants where sku='transaction-only-tariff-test'),true);
select set_config('request.jwt.claim.sub',current_setting('test.admin'),true);
set local role authenticated;
select public.set_variant_tariffs(current_setting('test.variant')::uuid,'{"shop":20,"warehouse":15,"retail":40}');
select public.set_customer_classification(current_setting('test.customer')::uuid,'approved','warehouse');
do $$begin
 if (select count(*) from public.variant_prices where variant_id=current_setting('test.variant')::uuid)<>3 then raise exception 'Admin must see three prices.'; end if;
 if (select customer_type from public.profiles where id=current_setting('test.customer')::uuid)<>'warehouse' then raise exception 'Classification was not saved.'; end if;
end$$;
reset role;
select set_config('request.jwt.claim.sub',current_setting('test.customer'),true);
set local role authenticated;
do $$begin
 if exists(select 1 from public.variant_prices) then raise exception 'Prices must remain hidden in catalogue-only mode.'; end if;
 begin
  perform public.set_customer_classification(current_setting('test.customer')::uuid,'approved','retail');
  raise exception 'Client changed own classification!';
 exception when raise_exception then if sqlerrm<>'No autorizado.' then raise; end if; end;
 begin
  perform professional_price from public.product_variants;
  raise exception 'Legacy prices leaked!';
 exception when insufficient_privilege then null; end;
end$$;
reset role;
update public.commerce_settings set customer_prices_enabled=true where id;
set local role authenticated;
do $$begin
 if (select array_agg(customer_type) from public.variant_prices where variant_id=current_setting('test.variant')::uuid)<>array['warehouse'] then raise exception 'Client can see another tariff.'; end if;
 if public.customer_unit_price(current_setting('test.variant')::uuid,'warehouse')<>15 then raise exception 'Incorrect warehouse price.'; end if;
 begin
  perform public.customer_unit_price(current_setting('test.variant')::uuid,'retail');
  raise exception 'Other tariff leaked!';
 exception when raise_exception then if sqlerrm<>'Tarifa pendiente para esta categoría de cliente.' then raise; end if; end;
end$$;
reset role;
update public.profiles set status='suspended' where id=current_setting('test.customer')::uuid;
set local role authenticated;
do $$begin if exists(select 1 from public.variant_prices) then raise exception 'Suspended client can read prices.'; end if; end$$;
reset role;
rollback;
select 'PASS: classification, admin tariff editor, hidden prices, category isolation, suspension, no legacy-price access; all test changes rolled back.' as result;

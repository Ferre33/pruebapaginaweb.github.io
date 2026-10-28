-- Apply once: preserve all models, change current seasonal availability only.
begin;
update public.products p set is_orderable = coalesce((select c.slug = 'ceremonia' from public.collections c where c.id = p.collection_id), false);
commit;

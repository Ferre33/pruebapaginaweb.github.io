alter table public.last_sizes_demo add column photo text check (photo ~ '^[A-Za-z0-9_-]+[.](jpg|jpeg|png|webp)$');
update public.last_sizes_demo set photo=case name
 when 'Pelele Alma' then 'ceremonia-27-402.jpg'
 when 'Vestido Aura' then 'ceremonia6.jpg'
 when 'Peto Aguamarina' then 'bebe6.jpg' end
 where name in ('Pelele Alma','Vestido Aura','Peto Aguamarina');
grant insert(photo) on public.last_sizes_demo to authenticated;

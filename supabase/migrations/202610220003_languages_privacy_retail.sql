-- Apply after 202610200002. No existing records, prices or permissions are removed.
begin;
-- English commercial content. NULL means not yet translated; Spanish remains the fallback.
alter table public.collections add column if not exists name_en text;
alter table public.collections add column if not exists season_en text;
alter table public.products add column if not exists name_en text;
alter table public.products add column if not exists description_en text;
alter table public.products add column if not exists composition_en text;
alter table public.products add column if not exists washing_en text;
alter table public.products add column if not exists measurements_en text;
alter table public.products add column if not exists lead_time_en text;
alter table public.products add column if not exists size_guide_en jsonb;
alter table public.product_variants add column if not exists color_en text;
-- Separate future retail tariff: never inferred from the professional price.
alter table public.product_variants add column if not exists retail_price numeric(12,2) check(retail_price is null or retail_price >= 0);
alter table public.commerce_settings add column if not exists retail_enabled boolean not null default false;
-- This release has NO retail order endpoint or public price grants. Enabling retail later
-- requires its own authorised checkout, tax display, terms and stock validation.
create table if not exists public.privacy_acceptances (
 user_id uuid primary key references auth.users(id) on delete cascade,
 policy_version text not null,
 policy_path text not null,
 accepted_at timestamptz not null default now(),
 language text not null check(language in ('es','en'))
);
alter table public.privacy_acceptances enable row level security;
revoke all on public.privacy_acceptances from anon,authenticated;
grant select on public.privacy_acceptances to authenticated;
drop policy if exists "read own privacy acceptance" on public.privacy_acceptances;
create policy "read own privacy acceptance" on public.privacy_acceptances for select to authenticated using(user_id=auth.uid() or public.is_admin());
-- Client metadata never determines role, approval, prices or the server timestamp.
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path='' as $$
begin
 if coalesce(new.raw_user_meta_data->>'privacy_accepted','') <> 'true'
    or coalesce(new.raw_user_meta_data->>'privacy_version','') <> '2026-10-22'
 then raise exception 'Debes aceptar la política de privacidad vigente.'; end if;
 insert into public.profiles(id,shop_name,contact_name,email,role,status)
 values(new.id,coalesce(nullif(trim(new.raw_user_meta_data->>'shop_name'),''),'Tienda pendiente'),
 coalesce(nullif(trim(new.raw_user_meta_data->>'contact_name'),''),'Contacto pendiente'),new.email,'shop','pending');
 insert into public.privacy_acceptances(user_id,policy_version,policy_path,language)
 values(new.id,'2026-10-22','/politica-privacidad-bebepunt/privacidad/index.html',case when new.raw_user_meta_data->>'preferred_language'='en' then 'en' else 'es' end);
 return new;
end;$$;
commit;

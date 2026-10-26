-- BEBEPUNT: queued admin notifications for email-confirmed wholesale applicants.
-- No secrets in SQL or Git. Add bebepunt_brevo_api_key through Supabase Vault UI.
begin;
create extension if not exists pg_net with schema extensions;
create extension if not exists pg_cron;
create schema if not exists bebepunt_private;
revoke all on schema bebepunt_private from public, anon, authenticated;

create table if not exists bebepunt_private.application_mail_settings (
  singleton boolean primary key default true check (singleton),
  enabled boolean not null default false,
  recipient text not null,
  sender text not null,
  review_url text not null check (review_url like 'https://%')
);
insert into bebepunt_private.application_mail_settings(singleton,recipient,sender,review_url)
values(true,'ferrepancracio@gmail.com','ferrepancracio@gmail.com',
'https://pruebapaginawebgithubio.vercel.app/portal/admin.html') on conflict do nothing;

create table if not exists bebepunt_private.application_mail_outbox (
  applicant_id uuid primary key references public.profiles(id) on delete cascade,
  state text not null default 'queued' check (state in ('queued','sending','accepted','failed','cancelled')),
  attempts integer not null default 0 check (attempts between 0 and 5),
  request_id bigint,
  last_http_status integer,
  created_at timestamptz not null default now(),
  last_attempt_at timestamptz,
  next_attempt_at timestamptz not null default now(),
  accepted_at timestamptz
);
alter table bebepunt_private.application_mail_settings enable row level security;
alter table bebepunt_private.application_mail_outbox enable row level security;
revoke all on all tables in schema bebepunt_private from public, anon, authenticated;

create or replace function bebepunt_private.process_application_mail()
returns void language plpgsql security definer set search_path = '' as $fn$
declare
  cfg bebepunt_private.application_mail_settings%rowtype;
  item record;
  result record;
  api_key text;
  req_id bigint;
  body_text text;
begin
  -- Serialize manual and scheduled workers, without blocking sign-ups.
  if not pg_try_advisory_xact_lock(20261025, 1) then return; end if;
  select * into cfg from bebepunt_private.application_mail_settings where singleton;

  -- Poll confirmed requests: no network calls/triggers inside the signup transaction.
  insert into bebepunt_private.application_mail_outbox(applicant_id)
    select p.id from public.profiles p join auth.users u on u.id=p.id
    where p.role='shop' and p.status='pending' and u.email_confirmed_at is not null
    on conflict do nothing;

  for item in select * from bebepunt_private.application_mail_outbox where state='sending' loop
    select status_code, timed_out, error_msg into result from net._http_response
      where id=item.request_id order by created desc limit 1;
    if found then
      if result.status_code between 200 and 299 then
        update bebepunt_private.application_mail_outbox set state='accepted',
          accepted_at=now(),last_http_status=result.status_code where applicant_id=item.applicant_id;
      else
        update bebepunt_private.application_mail_outbox set
          state=case when attempts>=5 or (result.status_code between 400 and 499
            and result.status_code not in (408,429)) then 'failed' else 'queued' end,
          last_http_status=result.status_code, next_attempt_at=now()+interval '15 minutes'
          where applicant_id=item.applicant_id;
      end if;
    elsif item.last_attempt_at < now()-interval '15 minutes' then
      -- A lost network response may require at-least-once delivery; never retry indefinitely.
      update bebepunt_private.application_mail_outbox set
        state=case when attempts>=5 then 'failed' else 'queued' end,
        next_attempt_at=now() where applicant_id=item.applicant_id;
    end if;
  end loop;

  update bebepunt_private.application_mail_outbox o set state='cancelled'
    where o.state in ('queued','failed') and not exists (
      select 1 from public.profiles p join auth.users u on u.id=p.id
      where p.id=o.applicant_id and p.role='shop' and p.status='pending'
        and u.email_confirmed_at is not null);

  if not coalesce(cfg.enabled,false) then return; end if;
  -- Also verify the fixed recipient still owns an administrator profile.
  if not exists(select 1 from public.profiles p join auth.users u on u.id=p.id
    where p.role='admin' and lower(u.email)=lower(cfg.recipient)) then return; end if;
  select decrypted_secret into api_key from vault.decrypted_secrets
    where name='bebepunt_brevo_api_key';
  if api_key is null or length(trim(api_key))<20 then return; end if;

  for item in
    select o.applicant_id,p.shop_name,p.contact_name,u.email
    from bebepunt_private.application_mail_outbox o
    join public.profiles p on p.id=o.applicant_id join auth.users u on u.id=p.id
    where o.state='queued' and o.attempts<5 and o.next_attempt_at<=now()
      and p.role='shop' and p.status='pending' and u.email_confirmed_at is not null
    order by o.created_at limit 5
  loop
    body_text := 'BEBEPUNT · Nueva solicitud pendiente de aprobación' || E'\n\n' ||
      'Tienda: ' || left(coalesce(item.shop_name,''),300) || E'\n' ||
      'Contacto: ' || left(coalesce(item.contact_name,''),300) || E'\n' ||
      'Correo verificado: ' || item.email || E'\n\n' ||
      'Revisar, aprobar o denegar: ' || cfg.review_url || E'\n\n' ||
      'Entra con tu cuenta de administrador. En Solicitudes y tiendas, localiza esta tienda, ' ||
      'selecciona Aprobada o Rechazada y pulsa Guardar. Abrir el enlace no cambia el acceso.' || E'\n\n' ||
      '---' || E'\n\n' || 'BEBEPUNT · New application awaiting approval' || E'\n\n' ||
      'Shop: ' || left(coalesce(item.shop_name,''),300) || E'\n' ||
      'Contact: ' || left(coalesce(item.contact_name,''),300) || E'\n' ||
      'Verified email: ' || item.email || E'\n\n' ||
      'Review, approve or reject: ' || cfg.review_url || E'\n\n' ||
      'Sign in with your administrator account. Under Applications and shops, find this shop, ' ||
      'select Approved or Rejected and press Save. Opening the link does not change access.';
    req_id := net.http_post(
      url := 'https://api.brevo.com/v3/smtp/email',
      headers := jsonb_build_object('api-key',api_key,'Content-Type','application/json','accept','application/json'),
      body := jsonb_build_object(
        'sender',jsonb_build_object('name','BEBEPUNT','email',cfg.sender),
        'to',jsonb_build_array(jsonb_build_object('email',cfg.recipient)),
        'subject','BEBEPUNT · Solicitud pendiente / Pending application',
        'textContent',body_text,'tags',jsonb_build_array('wholesale-application')),
      timeout_milliseconds := 10000);
    update bebepunt_private.application_mail_outbox set state='sending',request_id=req_id,
      attempts=attempts+1,last_attempt_at=now() where applicant_id=item.applicant_id;
  end loop;
end;
$fn$;
revoke all on function bebepunt_private.process_application_mail() from public,anon,authenticated;
select cron.schedule('bebepunt-application-mail','* * * * *','select bebepunt_private.process_application_mail();');
-- Deliberately disabled until Vault credential is entered and reviewed.
select bebepunt_private.process_application_mail();
commit;

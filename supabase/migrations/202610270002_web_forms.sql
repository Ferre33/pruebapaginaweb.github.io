-- Requires the existing application-notification migration (Vault, pg_net, pg_cron).
-- Disabled until Brevo lists, DOI templates and sender have been verified.
begin;
create table public.web_submissions (
 id uuid primary key,
 category text not null check(category in ('newsletter','contact','retailer')),
 email text not null check(length(email)<=254),
 name text not null default '' check(length(name)<=160),
 message text not null default '' check(length(message)<=5000),
 shop_name text not null default '' check(length(shop_name)<=160),
 phone text not null default '' check(length(phone)<=60),
 city text not null default '' check(length(city)<=160),
 language text not null check(language in ('es','en')),
 privacy_version text not null,
 consent_received_at timestamptz not null default now(),
 created_at timestamptz not null default now()
);
alter table public.web_submissions enable row level security;
revoke all on public.web_submissions from anon,authenticated;
grant select on public.web_submissions to authenticated;
create policy web_submissions_admin on public.web_submissions for select to authenticated using(public.is_admin());
create index web_submissions_category_date on public.web_submissions(category,created_at desc);

create table bebepunt_private.web_form_settings (
 singleton boolean primary key default true check(singleton),
 enabled boolean not null default false,
 recipient text not null,
 sender text not null,
 site_url text not null default 'https://pruebapaginawebgithubio.vercel.app',
 newsletter_list_id bigint check(newsletter_list_id>0),
 contact_list_id bigint check(contact_list_id>0),
 retailer_list_id bigint check(retailer_list_id>0),
 doi_template_es bigint check(doi_template_es>0),
 doi_template_en bigint check(doi_template_en>0)
);
insert into bebepunt_private.web_form_settings(singleton,recipient,sender)
select true,recipient,sender from bebepunt_private.application_mail_settings where singleton;
create table bebepunt_private.web_form_outbox (
 submission_id uuid not null references public.web_submissions(id) on delete cascade,
 kind text not null check(kind in ('notify','sync')),
 state text not null default 'queued' check(state in ('queued','sending','accepted','failed')),
 attempts integer not null default 0 check(attempts between 0 and 5),
 request_id bigint,
 last_http_status integer,
 provider_message_id text,
 last_attempt_at timestamptz,
 next_attempt_at timestamptz not null default now(),
 accepted_at timestamptz,
 primary key(submission_id,kind)
);
alter table bebepunt_private.web_form_settings enable row level security;
alter table bebepunt_private.web_form_outbox enable row level security;
revoke all on bebepunt_private.web_form_settings,bebepunt_private.web_form_outbox from public,anon,authenticated;

create or replace function public.record_web_submission(p_data jsonb)
returns uuid language plpgsql security definer set search_path='' as $fn$
declare record_id uuid := (p_data->>'request_id')::uuid;
begin
 insert into public.web_submissions(id,category,email,name,message,shop_name,phone,city,language,privacy_version)
 values(record_id,p_data->>'category',p_data->>'email',p_data->>'name',p_data->>'message',p_data->>'shop_name',p_data->>'phone',p_data->>'city',p_data->>'language',p_data->>'privacy_version') on conflict(id) do nothing;
 insert into bebepunt_private.web_form_outbox(submission_id,kind) values(record_id,'notify'),(record_id,'sync') on conflict do nothing;
 return record_id;
end;$fn$;
revoke all on function public.record_web_submission(jsonb) from public,anon,authenticated;
grant execute on function public.record_web_submission(jsonb) to service_role;

create or replace function bebepunt_private.process_web_forms()
returns void language plpgsql security definer set search_path='' as $fn$
declare cfg bebepunt_private.web_form_settings%rowtype; job record; response record;
 api_key text; payload jsonb; endpoint text; req_id bigint; target_list bigint; template bigint; category_label text;
begin
 if not pg_try_advisory_xact_lock(20261027,2) then return; end if;
 select * into cfg from bebepunt_private.web_form_settings where singleton;
 -- Observe completed HTTP requests before attempting new jobs.
 for job in select * from bebepunt_private.web_form_outbox where state='sending' loop
  select * into response from net._http_response where id=job.request_id;
  if found then
   update bebepunt_private.web_form_outbox set last_http_status=response.status_code,
    state=case when response.status_code between 200 and 299 then 'accepted' when attempts>=5 or (response.status_code between 400 and 499 and response.status_code not in (408,429)) then 'failed' else 'queued' end,
    accepted_at=case when response.status_code between 200 and 299 then now() else null end,
    next_attempt_at=now()+interval '15 minutes'
    where submission_id=job.submission_id and kind=job.kind;
   -- Do not store raw error bodies, which may contain private provider data.
   if response.status_code between 200 and 299 and job.kind='notify' then
    begin
     update bebepunt_private.web_form_outbox set provider_message_id=(response.content::jsonb->>'messageId') where submission_id=job.submission_id and kind=job.kind;
    exception when others then null; end;
   end if;
  elsif job.last_attempt_at<now()-interval '10 minutes' then
   update bebepunt_private.web_form_outbox set state=case when attempts>=5 then 'failed' else 'queued' end,next_attempt_at=now()+interval '15 minutes' where submission_id=job.submission_id and kind=job.kind;
  end if;
 end loop;
 if not cfg.enabled then return; end if;
 select decrypted_secret into api_key from vault.decrypted_secrets where name='bebepunt_brevo_api_key' limit 1;
 if coalesce(api_key,'')='' then return; end if;
 for job in select o.*,s.category,s.email,s.name,s.message,s.shop_name,s.phone,s.city,s.language
  from bebepunt_private.web_form_outbox o join public.web_submissions s on s.id=o.submission_id
  where o.state='queued' and o.attempts<5 and o.next_attempt_at<=now() order by o.next_attempt_at limit 10 loop
  category_label=case job.category when 'newsletter' then 'Suscripciones / Subscriptions' when 'contact' then 'Contacto / Contact' else 'Consultas de tiendas / Retailer enquiries' end;
  if job.kind='notify' then
   endpoint='https://api.brevo.com/v3/smtp/email';
   payload=jsonb_build_object('sender',jsonb_build_object('name','BEBEPUNT Web','email',cfg.sender),
    'to',jsonb_build_array(jsonb_build_object('email',cfg.recipient)),
    'replyTo',jsonb_build_object('email',job.email),
    'tags',jsonb_build_array('web-'||job.category),
    'subject','BEBEPUNT · '||category_label,
    'textContent','Categoría / Category: '||category_label||E'\nReferencia / Reference: '||job.submission_id||E'\nNombre / Name: '||job.name||E'\nEmail: '||job.email||E'\nTienda / Shop: '||job.shop_name||E'\nTeléfono / Phone: '||job.phone||E'\nCiudad / City: '||job.city||E'\n\n'||job.message||case when job.category='newsletter' then E'\n\nSolicitud recibida. La suscripción requiere confirmación por correo. / Request received. Email confirmation is required.' else '' end);
  else
   target_list=case job.category when 'newsletter' then cfg.newsletter_list_id when 'contact' then cfg.contact_list_id else cfg.retailer_list_id end;
   if target_list is null then continue; end if;
   if job.category='newsletter' then
    template=case job.language when 'en' then cfg.doi_template_en else cfg.doi_template_es end;
    if template is null then continue; end if;
    endpoint='https://api.brevo.com/v3/contacts/doubleOptinConfirmation';
    payload=jsonb_build_object('email',job.email,'includeListIds',jsonb_build_array(target_list),'templateId',template,'redirectionUrl',rtrim(cfg.site_url,'/')||'/newsletter-confirmada.html');
   else
    endpoint='https://api.brevo.com/v3/contacts';
    -- Service enquiry lists are NOT newsletter consent. Do not reset unsubscribe flags.
    payload=jsonb_build_object('email',job.email,'listIds',jsonb_build_array(target_list),'updateEnabled',true);
   end if;
  end if;
  req_id=net.http_post(url:=endpoint,headers:=jsonb_build_object('Content-Type','application/json','api-key',api_key),body:=payload,timeout_milliseconds:=10000);
  update bebepunt_private.web_form_outbox set state='sending',attempts=attempts+1,request_id=req_id,last_attempt_at=now() where submission_id=job.submission_id and kind=job.kind;
 end loop;
end;$fn$;
revoke all on function bebepunt_private.process_web_forms() from public,anon,authenticated;
select cron.schedule('bebepunt-web-forms','* * * * *','select bebepunt_private.process_web_forms()');
commit;

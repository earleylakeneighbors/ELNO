-- Email announcement blast audit + per-recipient delivery status

create table if not exists public.email_blast_batches (
  id uuid primary key default gen_random_uuid(),
  send_token uuid not null unique,
  preset text not null,
  subject text not null,
  recipient_count integer not null default 0,
  sent_count integer not null default 0,
  failed_count integer not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists email_blast_batches_created_at_idx
  on public.email_blast_batches (created_at desc);

create table if not exists public.email_blast_deliveries (
  id uuid primary key default gen_random_uuid(),
  batch_id uuid not null references public.email_blast_batches (id) on delete cascade,
  subscriber_id text,
  email text not null,
  recipient_name text not null default '',
  status text not null check (status in ('sent', 'failed')),
  error_message text,
  resend_id text,
  retry_count integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists email_blast_deliveries_batch_id_idx
  on public.email_blast_deliveries (batch_id);

alter table public.email_blast_batches enable row level security;
alter table public.email_blast_deliveries enable row level security;

drop policy if exists "Admins read email blast batches" on public.email_blast_batches;
create policy "Admins read email blast batches"
  on public.email_blast_batches for select
  using (public.is_admin());

drop policy if exists "Admins read email blast deliveries" on public.email_blast_deliveries;
create policy "Admins read email blast deliveries"
  on public.email_blast_deliveries for select
  using (public.is_admin());
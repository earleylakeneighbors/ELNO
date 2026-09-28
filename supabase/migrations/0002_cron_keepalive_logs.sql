-- Cron keep-alive audit log (writes via service role only)

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles p
    where p.id = auth.uid() and p.role = 'admin'
  );
$$;

create table if not exists public.cron_keepalive_logs (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  success boolean not null,
  authorized boolean not null,
  has_row boolean,
  detail text
);

create index if not exists cron_keepalive_logs_created_at_idx
  on public.cron_keepalive_logs (created_at desc);

alter table public.cron_keepalive_logs enable row level security;

drop policy if exists "Admins read keepalive logs" on public.cron_keepalive_logs;
create policy "Admins read keepalive logs"
  on public.cron_keepalive_logs for select
  using (public.is_admin());

create table public.signup_notify_settings (
  id text primary key default 'default' check (id = 'default'),
  signup_notify_email text not null,
  updated_at timestamptz not null default now()
);

insert into public.signup_notify_settings (id, signup_notify_email)
values ('default', 'admin@earleylakeneighbors.org');

alter table public.signup_notify_settings enable row level security;

create policy "Admins read signup notify settings"
  on public.signup_notify_settings for select
  using (public.is_admin());

create policy "Admins update signup notify settings"
  on public.signup_notify_settings for update
  using (public.is_admin());

-- Earley Lake Neighborhood Organization — initial schema
-- Applied via Supabase MCP / CLI

create extension if not exists "pgcrypto";

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text not null,
  full_name text,
  role text not null default 'member' check (role in ('admin', 'member')),
  created_at timestamptz not null default now()
);

create table if not exists public.subscribers (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  first_name text not null,
  last_name text,
  street_address text,
  interests text,
  consent boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists subscribers_email_idx on public.subscribers (email);
create index if not exists subscribers_created_at_idx on public.subscribers (created_at desc);

create table if not exists public.events (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  description text not null,
  location text not null,
  start_at timestamptz not null,
  end_at timestamptz,
  image_url text,
  status text not null default 'draft' check (status in ('draft', 'published', 'archived')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists events_status_start_idx on public.events (status, start_at);
create index if not exists events_slug_idx on public.events (slug);

create table if not exists public.news_posts (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  excerpt text not null,
  content text not null,
  featured_image_url text,
  author_id uuid references public.profiles (id) on delete set null,
  status text not null default 'draft' check (status in ('draft', 'published', 'archived')),
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists news_posts_status_published_idx on public.news_posts (status, published_at desc);
create index if not exists news_posts_slug_idx on public.news_posts (slug);

create table if not exists public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  phone text,
  subject text not null,
  message text not null,
  status text not null default 'unread' check (status in ('unread', 'read', 'replied', 'archived')),
  created_at timestamptz not null default now()
);

create index if not exists contact_messages_status_created_idx on public.contact_messages (status, created_at desc);

create table if not exists public.media (
  id uuid primary key default gen_random_uuid(),
  file_path text not null,
  public_url text not null,
  filename text not null,
  caption text,
  uploaded_by uuid references public.profiles (id) on delete set null,
  featured boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists media_featured_created_idx on public.media (featured, created_at desc);

-- Helper: admin check via profiles.role (not user_metadata)
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

alter table public.profiles enable row level security;
alter table public.subscribers enable row level security;
alter table public.events enable row level security;
alter table public.news_posts enable row level security;
alter table public.contact_messages enable row level security;
alter table public.media enable row level security;

-- Profiles
create policy "Users can read own profile"
  on public.profiles for select
  using (auth.uid() = id or public.is_admin());

create policy "Admins can update profiles"
  on public.profiles for update
  using (public.is_admin());

-- Subscribers: no public read; inserts via service role / server action
create policy "Admins manage subscribers"
  on public.subscribers for all
  using (public.is_admin())
  with check (public.is_admin());

-- Events: public can read published/archived
create policy "Public read published events"
  on public.events for select
  using (status in ('published', 'archived'));

create policy "Admins manage events"
  on public.events for all
  using (public.is_admin())
  with check (public.is_admin());

-- News
create policy "Public read published news"
  on public.news_posts for select
  using (status = 'published');

create policy "Admins manage news"
  on public.news_posts for all
  using (public.is_admin())
  with check (public.is_admin());

-- Contact messages: admin only (inserts via service role)
create policy "Admins manage messages"
  on public.contact_messages for all
  using (public.is_admin())
  with check (public.is_admin());

-- Media: public can read; admins write
create policy "Public read media"
  on public.media for select
  using (true);

create policy "Admins manage media"
  on public.media for all
  using (public.is_admin())
  with check (public.is_admin());

-- Prevent public RPC access to SECURITY DEFINER helper
revoke execute on function public.is_admin() from anon, authenticated, public;
grant execute on function public.is_admin() to service_role;

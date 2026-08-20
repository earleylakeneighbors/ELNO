# Earley Lake Neighborhood Organization

Official community website and admin platform for **Earley Lake Neighborhood Organization** (Minnesota, USA).

This release is a **frontend-first MVP** with a polished public site, admin UI, and mock data layer. Supabase schema and client stubs are included so you can connect a real project when the org account is ready.

## Stack

- Next.js (App Router) + TypeScript
- Tailwind CSS + shadcn-style UI primitives
- Zod validation + Server Actions
- Supabase-ready (PostgreSQL, Auth, Storage, RLS) — not required to run locally yet

## Quick start

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Admin

1. Configure Supabase env vars (see below).
2. Create an admin user in **Admin → User Management** (or via Supabase Auth + a `profiles` row with `role = 'admin'`).
3. Visit [http://localhost:3000/admin/login](http://localhost:3000/admin/login) and sign in with that account.

## Environment variables

Copy `.env.example` to `.env.local`:

| Variable | Purpose |
|----------|---------|
| `NEXT_PUBLIC_SITE_URL` | Canonical site URL (SEO, sitemap) |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Public anon key |
| `SUPABASE_SERVICE_ROLE_KEY` | Server-only key (never `NEXT_PUBLIC_`) |
| `RESEND_API_KEY` | Resend API key for transactional email (server-only) |
| `RESEND_FROM_EMAIL` | Optional verified From address |

Until Supabase is configured, the app uses `src/lib/data` mock repositories.

## What was built

### Public site

- `/` — full-bleed hero, events, get involved, news, gallery, email CTA
- `/about` — story, mission, community, involvement (editable placeholders marked)
- `/events`, `/events/[slug]` — upcoming/past events + Event schema JSON-LD
- `/news`, `/news/[slug]` — announcements
- `/join` — email list signup (Zod + honeypot + rate limit)
- `/contact` — contact form
- SEO: metadata, Open Graph, sitemap, robots, Organization schema

### Admin

- Dashboard stats
- Subscribers (search, delete, CSV export)
- Events CRUD (draft / published / archived)
- News CRUD
- Messages (read / replied / archive)
- Gallery + media library (mock URLs until Storage)
- Settings (social URLs left blank until real links exist)

### Design assets

Generated images live in `public/images/` (logo mark, hero, community, events, gallery).

## Connecting Supabase (when ready)

1. Create a Supabase project for the organization.
2. Run [`supabase/migrations/0001_initial.sql`](supabase/migrations/0001_initial.sql) in the SQL editor (or via Supabase CLI).
3. Create an Auth user for the admin, then insert a `profiles` row with `role = 'admin'`.
4. Create a public Storage bucket named `media` (image MIME types, size limits).
5. Set env vars in `.env.local` and Vercel.
6. Swap mock calls in `src/lib/data` to use `src/lib/supabase/server.ts` / `browser.ts`.
7. Replace stub login with Supabase Auth (email magic link or password).

Public form inserts for `subscribers` and `contact_messages` should use the **service role on the server** (or a secure RPC), not the anon key with open insert policies.

## Vercel deployment

1. Push the repo to GitHub.
2. Import the project in Vercel.
3. Set environment variables from `.env.example`.
4. Deploy. Set `NEXT_PUBLIC_SITE_URL` to the production domain.

### Domain / DNS

Point your domain’s DNS to Vercel (A/CNAME as shown in the Vercel domain settings). Add the same domain in Supabase Auth redirect URLs when Auth is enabled.

## Placeholders to replace

- `[Editable]` copy on About and event pages
- Contact email and social URLs in Admin → Settings
- Exact event addresses / meeting points
- Stub admin credentials → real Supabase Auth
- Mock media URLs → Supabase Storage uploads

## Future features (architected, not built)

Donations, dues, memberships, event registration, volunteer signup, email campaigns, resource library, polls, neighborhood directory.

## Scripts

```bash
npm run dev
npm run build
npm run start
npm run lint
```

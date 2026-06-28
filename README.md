# Flight School

React/Vite cockpit dashboard for CYYJ ground school notes, tasks, flashcards, weather, PSTAR practice, and admin/student profiles.

## Local Development

```bash
pnpm install
pnpm dev
```

## Build

```bash
pnpm build
```

## Supabase

Create `.env.local` from `.env.example`:

```env
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
SUPABASE_SECRET_KEY=
VITE_ADMIN_PASSWORD_HASH=
ADMIN_PASSWORD=
```

Run `supabase/secure-auth-migration.sql` in the Supabase SQL Editor to enable Supabase Auth, per-user storage, and Row Level Security. See `SECURE_SETUP.md` for the activation steps.

For invite-only email login, password recovery, and migrating existing accounts without changing their user IDs, see `STANDARD_LOGIN_SETUP.md`. This upgrade does not require another SQL migration.

## Deploy

Vercel settings:

- Build command: `pnpm build`
- Output directory: `dist`
- Environment variables:
  - `VITE_SUPABASE_URL`
  - `VITE_SUPABASE_ANON_KEY`
  - `SUPABASE_SECRET_KEY`
  - `ADMIN_PASSWORD`

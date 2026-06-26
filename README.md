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
```

Run `supabase/schema.sql` in the Supabase SQL Editor before using cloud sync.

## Deploy

Vercel settings:

- Build command: `pnpm build`
- Output directory: `dist`
- Environment variables:
  - `VITE_SUPABASE_URL`
  - `VITE_SUPABASE_ANON_KEY`

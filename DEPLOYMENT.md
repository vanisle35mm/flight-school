# Flight School Permanent Deployment

## Current Backend Milestone

The app now supports optional Supabase cloud sync.

Without Supabase keys, it behaves like the current local app and uses `groundschool_v496`.

With Supabase keys, it:

1. loads the online app state from Supabase on startup
2. keeps localStorage as a backup
3. saves changes back to Supabase after edits
4. shows cloud status in the cockpit topbar

## Supabase

1. Create a Supabase project.
2. Run `supabase/schema.sql` in Supabase SQL Editor.
3. Copy the project URL and anon key.
4. Run:

```powershell
.\Configure-Supabase.ps1
```

This creates `.env.local`:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_ADMIN_PASSWORD_HASH=your-admin-password-sha256-hash
ADMIN_PASSWORD=your-admin-password
```

5. Restart the app.

## Hosting

Use Vercel or Netlify.

Build command:

```bash
pnpm build
```

Publish directory:

```text
dist
```

Environment variables to add in the hosting dashboard:

```text
VITE_SUPABASE_URL
VITE_SUPABASE_ANON_KEY
ADMIN_PASSWORD
```

## Important Security Upgrade

This milestone is online persistence, not final production authentication.

Before broad release, add:

- Supabase Auth
- real student/admin sign-in
- per-user row-level security
- profiles table with roles
- per-user tables instead of a shared app-state row

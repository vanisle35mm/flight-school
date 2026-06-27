# Flight School Deployment

## Hosting

Vercel settings:

- Build command: `pnpm build`
- Output directory: `dist`

Environment variables:

```text
VITE_SUPABASE_URL
VITE_SUPABASE_ANON_KEY
SUPABASE_SECRET_KEY
ADMIN_PASSWORD
```

`SUPABASE_SECRET_KEY` is server-only. Never prefix it with `VITE_`, commit it, or place it in browser code.

## Secure Backend

The production app uses:

- Supabase Auth for passwords and sessions
- `groundschool_profiles` for names and roles
- `groundschool_user_data` for isolated student records
- Row Level Security so students can access only their own row
- Vercel server functions for admin-only account creation, password resets, and deletion

Follow `SECURE_SETUP.md` once per Supabase project. The first secure admin login migrates the existing shared data automatically. Existing student passwords must then be reset by the admin because password hashes cannot safely be transferred into Supabase Auth.

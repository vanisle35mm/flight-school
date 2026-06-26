# Flight School Supabase Setup

This is the first permanent backend milestone. It stores the current Flight School app state online so users and data can survive browser/device changes.

## 1. Create Supabase Project

1. Go to Supabase and create a new project.
2. Open SQL Editor.
3. Paste and run `supabase/schema.sql`.

## 2. Add App Keys

Run:

```powershell
.\Configure-Supabase.ps1
```

Paste the Supabase project URL and anon key when prompted.

The script creates `.env.local`:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

Restart the app after saving `.env.local`.

Optional desktop helper:

```powershell
.\Create-Supabase-Shortcut.ps1
```

## 3. What Syncs Online

The table `groundschool_app_state` stores:

- users
- admin/student roles
- lessons/classes
- notes
- lesson flashcards
- tasks
- PSTAR history and missed IDs
- dashboard tile layout

The app still keeps `groundschool_v496` in localStorage as a backup and migration source.

## 4. Security Note

This first backend milestone uses public test policies so the current app can sync without rewriting login yet.

Before sharing broadly, the next backend milestone should add Supabase Auth and row-level security:

- Admins can see all users and all data.
- Students can only see their own lessons, notes, cards, tasks, and attempts.
- PSTAR questions remain globally readable.
- Profile roles are enforced by the database, not by the browser.

## 5. Next Milestone

Replace the app-level first-name login with Supabase Auth:

- email/password or magic-link login
- `profiles` table with `role`
- per-user tables for classes, flashcards, tasks, and PSTAR attempts
- migration button to move `groundschool_v496` local data into the authenticated account

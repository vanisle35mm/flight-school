# Turn On Secure Student Accounts

Do these steps once. Existing lessons, notes, cards, tasks, and PSTAR history are migrated automatically.

## 1. Run The Secure Database Setup

1. Open your Supabase project.
2. Open **SQL Editor**.
3. Open `supabase/secure-auth-migration.sql` on this computer.
4. Copy the SQL contents into Supabase and click **Run**.

The warning about destructive operations is expected: the script removes anonymous access to the old shared data row. It does not delete that row or its data.

## 2. Create The Server Secret

1. In Supabase, open **Settings > API Keys**.
2. Under **Secret keys**, create or copy a key beginning with `sb_secret_`.
3. Do not send this key in chat and do not put it in a variable beginning with `VITE_`.

## 3. Add It To Vercel

1. Open the Flight School project in Vercel.
2. Open **Settings > Environment Variables**.
3. Add:

```text
Name: SUPABASE_SECRET_KEY
Value: your sb_secret_ key
Environments: Production and Preview
```

4. Redeploy the latest Flight School deployment.

## 4. Migrate Existing Accounts

1. Open the live app.
2. Log in as admin with the same admin name and `ADMIN_PASSWORD` you already use.
3. The first secure login creates the Supabase admin account and migrates every existing user automatically.
4. Open **User Console**.
5. Use **Set Password** once for each migrated student.

After this, students use their first name and new password. Students can access only their own data; the admin can access all student records.

Students can later change their own password from **Account** in the app sidebar.

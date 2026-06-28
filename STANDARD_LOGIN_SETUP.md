# Turn On Standard Email Login

The app remains backward-compatible while accounts move from first-name login to email login. Existing users, roles, lessons, notes, cards, scores, tasks, airports, and dashboard layouts keep their current Supabase user IDs.

## 1. Set The Live App URL

1. Open the Supabase project.
2. Open **Authentication > URL Configuration**.
3. Set **Site URL** to the live Flight School Vercel URL.
4. Add the same Vercel URL under **Redirect URLs**.
5. Keep `http://127.0.0.1:5173` as an additional redirect only for local testing.

## 2. Connect Email Delivery

1. Open **Project Settings > Authentication > SMTP Settings** in Supabase.
2. Enable custom SMTP.
3. Enter the SMTP details from the selected email provider.
4. Set the sender name to `Flight School`.
5. Send a test invitation to an address you control.

Supabase's default mail sender is intended for limited testing. A custom SMTP sender is required before inviting real students.

## 3. Move The Admin Account

1. Sign in using **Use first-name login**.
2. Open **Admin > Users**.
3. Enter the admin's real email under **Account email**.
4. Select **Attach Email**.
5. Open the setup email and create a private password.
6. Sign in through the main email login form.

## 4. Move Existing Students

For each existing student:

1. Enter their email under **Account email**.
2. Select **Attach Email**.
3. The student opens the email and creates their password.
4. Their existing Flight School data opens under the same account.

The old first-name login remains available during this transition.

## 5. Invite New Students

Use **Admin > Users > Add captain**. Enter the student's first name and email, then select **Send Invite**. New students create their own password, choose their home airport, and enter an empty private dashboard.

## Password Recovery

Users select **Forgot password?** on the login screen. The reset email returns them to Flight School, where they choose a new password. Admins can also send a reset email from the User Console without seeing or choosing the user's password.

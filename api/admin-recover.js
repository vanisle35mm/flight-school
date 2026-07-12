import { createServerClients, normalizeLoginName, verifyConfiguredAdminPassword } from '../server/supabaseAdmin.js';

const normalizeEmail = (value) => String(value ?? '').trim().toLowerCase();
const isValidEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

export default async function handler(request, response) {
  response.setHeader('Cache-Control', 'no-store');
  if (request.method !== 'POST') {
    response.status(405).json({ ok: false, reason: 'method-not-allowed' });
    return;
  }

  const clients = createServerClients();
  if (!clients) {
    response.status(503).json({ ok: false, reason: 'Secure accounts are not configured.' });
    return;
  }

  const body = typeof request.body === 'object' && request.body ? request.body : {};
  const email = normalizeEmail(body.email);
  const password = typeof body.password === 'string' ? body.password : '';
  if (!isValidEmail(email) || !password) {
    response.status(200).json({ ok: false, reason: 'Enter your admin email and password.' });
    return;
  }
  if (!verifyConfiguredAdminPassword(password)) {
    response.status(200).json({ ok: false, reason: 'Admin password is incorrect.' });
    return;
  }

  try {
    const { data: profile, error: profileError } = await clients.admin
      .from('groundschool_profiles')
      .select('id,first_name,login_name,role,requires_password_reset')
      .eq('role', 'admin')
      .limit(1)
      .maybeSingle();
    if (profileError) throw profileError;
    if (!profile) {
      response.status(200).json({ ok: false, reason: 'Admin profile not found. Run the first secure admin migration first.' });
      return;
    }

    const firstName = profile.first_name || email.split('@')[0];
    const { error: updateAuthError } = await clients.admin.auth.admin.updateUserById(profile.id, {
      email,
      password,
      email_confirm: true,
      app_metadata: { role: 'admin' },
      user_metadata: { first_name: firstName }
    });
    if (updateAuthError) throw updateAuthError;

    const { error: updateProfileError } = await clients.admin
      .from('groundschool_profiles')
      .update({
        login_name: normalizeLoginName(email),
        requires_password_reset: false
      })
      .eq('id', profile.id);
    if (updateProfileError) throw updateProfileError;

    const { data: signInData, error: signInError } = await clients.publicClient.auth.signInWithPassword({
      email,
      password
    });
    if (signInError || !signInData.session) throw signInError ?? new Error('Recovered account could not sign in.');

    response.status(200).json({
      ok: true,
      accessToken: signInData.session.access_token,
      refreshToken: signInData.session.refresh_token
    });
  } catch (error) {
    console.error('Admin account recovery failed.', error);
    response.status(400).json({ ok: false, reason: error?.message ?? 'Admin recovery failed.' });
  }
}

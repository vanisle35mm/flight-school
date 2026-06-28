import { createServerClients, emptyUserPayload, normalizeLoginName, requireAdmin } from '../server/supabaseAdmin.js';

const PLACEHOLDER_EMAIL_DOMAIN = '@users.flightschool.app';
const normalizeEmail = (value) => String(value ?? '').trim().toLowerCase();
const isValidEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
const isRealEmail = (value) => isValidEmail(value) && !value.endsWith(PLACEHOLDER_EMAIL_DOMAIN);

const getRedirectTo = (request, requestedRedirect) => {
  const requestOrigin = typeof request.headers?.origin === 'string' ? request.headers.origin : '';
  try {
    const requested = new URL(String(requestedRedirect ?? ''));
    if (['http:', 'https:'].includes(requested.protocol) && (!requestOrigin || requested.origin === requestOrigin)) return requested.origin;
  } catch {
    // Use the request origin or deployed host below.
  }
  if (requestOrigin) return requestOrigin;
  const host = request.headers?.['x-forwarded-host'] ?? request.headers?.host;
  const protocol = request.headers?.['x-forwarded-proto'] ?? 'https';
  return host ? `${protocol}://${host}` : undefined;
};

const sendPasswordSetupEmail = async (clients, email, redirectTo) => {
  const { error } = await clients.publicClient.auth.resetPasswordForEmail(email, { redirectTo });
  if (error) throw error;
};

export default async function handler(request, response) {
  response.setHeader('Cache-Control', 'no-store');
  if (!['GET', 'POST'].includes(request.method)) {
    response.status(405).json({ ok: false });
    return;
  }

  const clients = createServerClients();
  if (!clients) {
    response.status(503).json({ ok: false, reason: 'secure-not-configured' });
    return;
  }
  const adminContext = await requireAdmin(request, clients);
  if (!adminContext) {
    response.status(403).json({ ok: false, reason: 'forbidden' });
    return;
  }

  if (request.method === 'GET') {
    const { data, error } = await clients.admin.auth.admin.listUsers({ page: 1, perPage: 1000 });
    if (error) {
      response.status(400).json({ ok: false, accounts: [], reason: error.message });
      return;
    }
    response.status(200).json({
      ok: true,
      accounts: data.users.map((user) => ({
        id: user.id,
        email: user.email ?? '',
        invitedAt: user.invited_at ?? undefined,
        lastSignInAt: user.last_sign_in_at ?? undefined,
        emailConfirmedAt: user.email_confirmed_at ?? undefined
      }))
    });
    return;
  }

  const body = typeof request.body === 'object' && request.body ? request.body : {};
  const action = body.action;
  const redirectTo = getRedirectTo(request, body.redirectTo);
  try {
    if (action === 'create') {
      const firstName = typeof body.firstName === 'string' ? body.firstName.trim() : '';
      const email = normalizeEmail(body.email);
      if (!firstName || !isRealEmail(email)) throw new Error('Enter the student name and a valid email address.');

      const { data: inviteData, error: inviteError } = await clients.admin.auth.admin.inviteUserByEmail(email, {
        redirectTo,
        data: { first_name: firstName }
      });
      if (inviteError || !inviteData.user) throw inviteError ?? new Error('Supabase did not create the invitation.');
      const user = inviteData.user;

      try {
        await clients.admin.auth.admin.updateUserById(user.id, { app_metadata: { role: 'student' } });
        const { error: profileError } = await clients.admin.from('groundschool_profiles').insert({
          id: user.id,
          first_name: firstName,
          login_name: `${normalizeLoginName(firstName)} ${user.id.slice(0, 8)}`,
          role: 'student',
          requires_password_reset: true
        });
        if (profileError) throw profileError;
        const { error: dataError } = await clients.admin.from('groundschool_user_data').insert({ user_id: user.id, data: emptyUserPayload() });
        if (dataError) throw dataError;
      } catch (error) {
        await clients.admin.auth.admin.deleteUser(user.id);
        throw error;
      }
      response.status(200).json({ ok: true, userId: user.id });
      return;
    }

    const userId = typeof body.userId === 'string' ? body.userId : '';
    if (!userId) throw new Error('User not found.');
    const { data: targetProfile, error: targetError } = await clients.admin
      .from('groundschool_profiles')
      .select('id,first_name,login_name,role')
      .eq('id', userId)
      .maybeSingle();
    if (targetError || !targetProfile) throw targetError ?? new Error('User not found.');

    if (action === 'attach-email') {
      const email = normalizeEmail(body.email);
      if (!isRealEmail(email)) throw new Error('Enter a valid personal email address.');
      const { error: updateAuthError } = await clients.admin.auth.admin.updateUserById(userId, {
        email,
        email_confirm: true,
        user_metadata: { first_name: targetProfile.first_name }
      });
      if (updateAuthError) throw updateAuthError;
      await sendPasswordSetupEmail(clients, email, redirectTo);
      const { error: profileError } = await clients.admin
        .from('groundschool_profiles')
        .update({ requires_password_reset: true })
        .eq('id', userId);
      if (profileError) throw profileError;
      response.status(200).json({ ok: true });
      return;
    }

    if (action === 'send-password-reset') {
      const { data: authUserData, error: authUserError } = await clients.admin.auth.admin.getUserById(userId);
      if (authUserError || !authUserData.user) throw authUserError ?? new Error('Auth account not found.');
      const email = normalizeEmail(authUserData.user.email);
      if (!isRealEmail(email)) throw new Error('Attach a personal email address first.');
      await sendPasswordSetupEmail(clients, email, redirectTo);
      response.status(200).json({ ok: true });
      return;
    }

    // Kept during the transition so an older open browser tab cannot strand a user.
    if (action === 'reset-password') {
      const password = typeof body.password === 'string' ? body.password : '';
      if (targetProfile.role !== 'student') throw new Error('Admin passwords are managed by the account owner.');
      if (password.length < 6) throw new Error('Passwords must be at least 6 characters.');
      const { error } = await clients.admin.auth.admin.updateUserById(userId, { password });
      if (error) throw error;
      await clients.admin.from('groundschool_profiles').update({ requires_password_reset: false }).eq('id', userId);
      response.status(200).json({ ok: true });
      return;
    }

    if (action === 'rename') {
      const firstName = typeof body.firstName === 'string' ? body.firstName.trim() : '';
      if (!firstName) throw new Error('First name cannot be blank.');
      const { error } = await clients.admin.from('groundschool_profiles').update({ first_name: firstName }).eq('id', userId);
      if (error) throw error;
      await clients.admin.auth.admin.updateUserById(userId, { user_metadata: { first_name: firstName } });
      response.status(200).json({ ok: true });
      return;
    }

    if (action === 'delete') {
      if (targetProfile.role === 'admin' || userId === adminContext.authUser.id) throw new Error('The admin account cannot be deleted here.');
      const { error } = await clients.admin.auth.admin.deleteUser(userId);
      if (error) throw error;
      response.status(200).json({ ok: true });
      return;
    }

    response.status(400).json({ ok: false, reason: 'unknown-action' });
  } catch (error) {
    console.error('Secure user administration failed.', error);
    response.status(400).json({ ok: false, reason: error?.message ?? 'User administration failed.' });
  }
}

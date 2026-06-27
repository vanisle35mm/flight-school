import { createAuthUser, createServerClients, emptyUserPayload, normalizeLoginName, requireAdmin } from '../server/supabaseAdmin.js';

export default async function handler(request, response) {
  response.setHeader('Cache-Control', 'no-store');
  if (request.method !== 'POST') {
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

  const body = typeof request.body === 'object' && request.body ? request.body : {};
  const action = body.action;
  try {
    if (action === 'create') {
      const firstName = typeof body.firstName === 'string' ? body.firstName.trim() : '';
      const loginName = normalizeLoginName(firstName);
      const password = typeof body.password === 'string' ? body.password : '';
      if (!firstName || password.length < 6) throw new Error('Enter a name and a password of at least 6 characters.');
      const { data: duplicate } = await clients.admin.from('groundschool_profiles').select('id').eq('login_name', loginName).maybeSingle();
      if (duplicate) throw new Error('That first name is already in use.');

      const { user } = await createAuthUser(clients.admin, { firstName, password, role: 'student', requiresPasswordReset: false });
      const { error: profileError } = await clients.admin.from('groundschool_profiles').insert({
        id: user.id,
        first_name: firstName,
        login_name: loginName,
        role: 'student',
        requires_password_reset: false
      });
      if (profileError) throw profileError;
      const { error: dataError } = await clients.admin.from('groundschool_user_data').insert({ user_id: user.id, data: emptyUserPayload() });
      if (dataError) throw dataError;
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

    if (action === 'reset-password') {
      const password = typeof body.password === 'string' ? body.password : '';
      if (targetProfile.role !== 'student') throw new Error('Admin passwords are managed in Vercel.');
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
      const { error } = await clients.admin.from('groundschool_profiles').update({
        first_name: firstName,
        login_name: normalizeLoginName(firstName)
      }).eq('id', userId);
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

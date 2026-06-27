import { createAuthUser, createServerClients, legacyUserPayload, normalizeLoginName, randomTemporaryPassword, verifyConfiguredAdminPassword } from '../server/supabaseAdmin.js';

const PROFILE_SELECT = 'id,first_name,login_name,role,requires_password_reset';

const migrateLegacyUsers = async (clients, adminAuthUser, adminFirstName, adminLoginName) => {
  const { data: legacyRow } = await clients.admin
    .from('groundschool_app_state')
    .select('data')
    .eq('id', 'primary')
    .maybeSingle();
  const legacyRoot = legacyRow?.data && typeof legacyRow.data === 'object' ? legacyRow.data : {};
  const legacyUsers = Object.values(legacyRoot.users ?? {});
  const legacyAdmin = legacyUsers.find((user) => user?.role === 'admin') ?? {};

  const { error: adminProfileError } = await clients.admin.from('groundschool_profiles').upsert({
    id: adminAuthUser.id,
    first_name: adminFirstName,
    login_name: adminLoginName,
    role: 'admin',
    requires_password_reset: false
  });
  if (adminProfileError) throw adminProfileError;

  const { error: adminDataError } = await clients.admin.from('groundschool_user_data').upsert({
    user_id: adminAuthUser.id,
    data: legacyUserPayload(legacyAdmin, legacyRoot)
  });
  if (adminDataError) throw adminDataError;

  const usedLoginNames = new Set([adminLoginName]);
  let migratedStudents = 0;
  for (const legacyStudent of legacyUsers.filter((user) => user?.role === 'student')) {
    const firstName = String(legacyStudent.firstName ?? 'Student').trim() || 'Student';
    const baseLoginName = normalizeLoginName(firstName);
    let loginName = baseLoginName;
    let suffix = 2;
    while (usedLoginNames.has(loginName)) loginName = `${baseLoginName} ${suffix++}`;
    usedLoginNames.add(loginName);

    try {
      const { user } = await createAuthUser(clients.admin, {
        firstName,
        password: randomTemporaryPassword(),
        role: 'student',
        requiresPasswordReset: true
      });
      const { error: profileError } = await clients.admin.from('groundschool_profiles').insert({
        id: user.id,
        first_name: firstName,
        login_name: loginName,
        role: 'student',
        requires_password_reset: true
      });
      if (profileError) throw profileError;
      const { error: dataError } = await clients.admin.from('groundschool_user_data').insert({
        user_id: user.id,
        data: legacyUserPayload(legacyStudent, legacyRoot)
      });
      if (dataError) throw dataError;
      migratedStudents += 1;
    } catch (error) {
      console.error(`Could not migrate student ${firstName}.`, error);
    }
  }
  return migratedStudents;
};

export default async function handler(request, response) {
  response.setHeader('Cache-Control', 'no-store');
  if (request.method !== 'POST') {
    response.status(405).json({ ok: false, mode: 'secure' });
    return;
  }

  const clients = createServerClients();
  if (!clients) {
    response.status(200).json({ ok: false, mode: 'legacy', reason: 'secure-not-configured' });
    return;
  }

  const body = typeof request.body === 'object' && request.body ? request.body : {};
  const firstName = typeof body.firstName === 'string' ? body.firstName.trim() : '';
  const loginName = normalizeLoginName(firstName);
  const password = typeof body.password === 'string' ? body.password : '';
  const role = body.role === 'admin' ? 'admin' : 'student';
  if (!loginName || !password) {
    response.status(200).json({ ok: false, mode: 'secure', reason: 'incorrect' });
    return;
  }

  let profile;
  try {
    const profileResult = await clients.admin
      .from('groundschool_profiles')
      .select(PROFILE_SELECT)
      .eq('login_name', loginName)
      .eq('role', role)
      .maybeSingle();

    if (profileResult.error) {
      const missingSecureSchema = profileResult.error.code === '42P01' || profileResult.error.message?.includes('schema cache');
      response.status(200).json({ ok: false, mode: missingSecureSchema ? 'legacy' : 'secure', reason: missingSecureSchema ? 'secure-not-configured' : 'unavailable' });
      return;
    }
    profile = profileResult.data;

    if (!profile && role === 'admin' && verifyConfiguredAdminPassword(password)) {
      const { data: existingAdmin, error: existingAdminError } = await clients.admin
        .from('groundschool_profiles')
        .select('id')
        .eq('role', 'admin')
        .limit(1)
        .maybeSingle();
      if (existingAdminError) throw existingAdminError;
      if (!existingAdmin) {
        const { user } = await createAuthUser(clients.admin, {
          firstName,
          password,
          role: 'admin',
          requiresPasswordReset: false
        });
        const migratedStudents = await migrateLegacyUsers(clients, user, firstName, loginName);
        profile = { id: user.id, first_name: firstName, login_name: loginName, role: 'admin', requires_password_reset: false };
        console.info(`Flight School secure migration created ${migratedStudents} student accounts.`);
      }
    }

    if (!profile) {
      response.status(200).json({ ok: false, mode: 'secure', reason: 'incorrect' });
      return;
    }
    if (profile.requires_password_reset) {
      response.status(200).json({ ok: false, mode: 'secure', reason: 'password-reset-required' });
      return;
    }

    const { data: authUserData, error: authUserError } = await clients.admin.auth.admin.getUserById(profile.id);
    if (authUserError || !authUserData.user?.email) throw authUserError ?? new Error('Auth account not found.');

    const { data: signInData, error: signInError } = await clients.publicClient.auth.signInWithPassword({
      email: authUserData.user.email,
      password
    });
    if (signInError || !signInData.session) {
      response.status(200).json({ ok: false, mode: 'secure', reason: 'incorrect' });
      return;
    }

    response.status(200).json({
      ok: true,
      mode: 'secure',
      accessToken: signInData.session.access_token,
      refreshToken: signInData.session.refresh_token,
      profile
    });
  } catch (error) {
    console.error('Secure Flight School login failed.', error);
    response.status(503).json({ ok: false, mode: 'secure', reason: 'unavailable' });
  }
}

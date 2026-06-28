import { createServerClients, getBearerToken } from '../server/supabaseAdmin.js';

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

  const token = getBearerToken(request);
  const { data: authData, error: authError } = await clients.admin.auth.getUser(token);
  if (authError || !authData.user) {
    response.status(401).json({ ok: false, reason: 'Your secure session expired.' });
    return;
  }

  const action = request.body?.action;
  if (action !== 'complete-password-setup') {
    response.status(400).json({ ok: false, reason: 'unknown-action' });
    return;
  }

  const { error } = await clients.admin
    .from('groundschool_profiles')
    .update({ requires_password_reset: false })
    .eq('id', authData.user.id);
  if (error) {
    response.status(400).json({ ok: false, reason: error.message });
    return;
  }
  response.status(200).json({ ok: true });
}

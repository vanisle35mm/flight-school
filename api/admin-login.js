import { createHash } from 'node:crypto';

const hashPassword = (password) => createHash('sha256').update(password, 'utf8').digest('hex');

export default async function handler(request, response) {
  response.setHeader('Cache-Control', 'no-store');

  if (request.method !== 'POST') {
    response.status(405).json({ ok: false, configured: false });
    return;
  }

  const adminPassword = process.env.ADMIN_PASSWORD ?? '';
  const adminPasswordHash = (process.env.ADMIN_PASSWORD_HASH ?? process.env.VITE_ADMIN_PASSWORD_HASH ?? '').trim().toLowerCase();
  const configured = Boolean(adminPassword || adminPasswordHash);

  if (!configured) {
    response.status(200).json({ ok: false, configured: false });
    return;
  }

  const body = typeof request.body === 'object' && request.body ? request.body : {};
  const password = typeof body.password === 'string' ? body.password : '';
  const hashedPassword = hashPassword(password);
  const ok = (adminPasswordHash && hashedPassword === adminPasswordHash) || (adminPassword && password === adminPassword);

  response.status(200).json({ ok, configured: true });
}

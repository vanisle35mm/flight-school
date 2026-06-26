import { pbkdf2Sync, timingSafeEqual } from 'node:crypto';

const passwordMatches = (password, storedHash) => {
  const [algorithm, iterationValue, saltValue, hashValue] = storedHash.split('$');
  const iterations = Number(iterationValue);
  if (algorithm !== 'pbkdf2' || !Number.isInteger(iterations) || iterations < 1 || !saltValue || !hashValue) return false;

  try {
    const expectedHash = Buffer.from(hashValue, 'base64');
    const actualHash = pbkdf2Sync(password, Buffer.from(saltValue, 'base64'), iterations, expectedHash.length, 'sha256');
    return actualHash.length === expectedHash.length && timingSafeEqual(actualHash, expectedHash);
  } catch {
    return false;
  }
};

export default async function handler(request, response) {
  response.setHeader('Cache-Control', 'no-store');

  if (request.method !== 'POST') {
    response.status(405).json({ ok: false, configured: false, reason: 'unavailable' });
    return;
  }

  const supabaseUrl = (process.env.SUPABASE_URL ?? process.env.VITE_SUPABASE_URL ?? '').replace(/\/$/, '');
  const supabaseKey = process.env.SUPABASE_ANON_KEY ?? process.env.VITE_SUPABASE_ANON_KEY ?? '';
  if (!supabaseUrl || !supabaseKey) {
    response.status(200).json({ ok: false, configured: false, reason: 'unavailable' });
    return;
  }

  const body = typeof request.body === 'object' && request.body ? request.body : {};
  const firstName = typeof body.firstName === 'string' ? body.firstName.trim().toLowerCase() : '';
  const password = typeof body.password === 'string' ? body.password : '';
  if (!firstName || !password) {
    response.status(200).json({ ok: false, configured: true, reason: 'incorrect' });
    return;
  }

  try {
    const cloudResponse = await fetch(`${supabaseUrl}/rest/v1/groundschool_app_state?id=eq.primary&select=data`, {
      headers: {
        apikey: supabaseKey,
        Authorization: `Bearer ${supabaseKey}`
      }
    });

    if (!cloudResponse.ok) throw new Error(`Supabase returned ${cloudResponse.status}`);
    const rows = await cloudResponse.json();
    const users = Object.values(rows?.[0]?.data?.users ?? {});
    const user = users.find((candidate) => candidate?.role === 'student' && candidate?.firstName?.trim().toLowerCase() === firstName);

    if (!user) {
      response.status(200).json({ ok: false, configured: true, reason: 'not-found' });
      return;
    }
    if (!user.passwordHash) {
      response.status(200).json({ ok: false, configured: true, reason: 'password-not-set' });
      return;
    }

    const ok = passwordMatches(password, user.passwordHash);
    response.status(200).json({ ok, configured: true, userId: ok ? user.id : undefined, reason: ok ? undefined : 'incorrect' });
  } catch (error) {
    console.error('Student login failed.', error);
    response.status(503).json({ ok: false, configured: false, reason: 'unavailable' });
  }
}

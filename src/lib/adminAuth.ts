const configuredAdminPasswordHash = (import.meta.env.VITE_ADMIN_PASSWORD_HASH ?? '').trim().toLowerCase();
const localAdminPasswordDisabled = import.meta.env.DEV;

type AdminPasswordResult = {
  ok: boolean;
  configured: boolean;
};

const hashPassword = async (password: string) => {
  const bytes = new TextEncoder().encode(password);
  const digest = await crypto.subtle.digest('SHA-256', bytes);
  return Array.from(new Uint8Array(digest))
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('');
};

export const isAdminPasswordConfigured = () => true;
export const isAdminPasswordRequired = () => !localAdminPasswordDisabled;

export const verifyAdminPassword = async (password: string): Promise<AdminPasswordResult> => {
  if (localAdminPasswordDisabled) return { ok: true, configured: true };
  if (!password) return { ok: false, configured: true };

  try {
    const response = await fetch('/api/admin-login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password })
    });

    const result = await response.json() as Partial<AdminPasswordResult>;
    if (typeof result.ok === 'boolean' && typeof result.configured === 'boolean') {
      return { ok: result.ok, configured: result.configured };
    }
  } catch {
    // Local Vite dev does not run Vercel functions. Fall back to the older local hash path.
  }

  if (!configuredAdminPasswordHash || !crypto?.subtle) return { ok: false, configured: false };
  return { ok: await hashPassword(password) === configuredAdminPasswordHash, configured: true };
};

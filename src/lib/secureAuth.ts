import { supabase } from './supabaseClient';

export type SecureLoginResult = {
  ok: boolean;
  mode: 'secure' | 'legacy';
  reason?: 'incorrect' | 'password-reset-required' | 'secure-not-configured' | 'unavailable';
};

export const signInSecurely = async (firstName: string, password: string, role: 'admin' | 'student'): Promise<SecureLoginResult> => {
  if (!supabase) return { ok: false, mode: 'legacy', reason: 'secure-not-configured' };

  try {
    const response = await fetch('/api/auth-login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ firstName, password, role })
    });
    const result = await response.json() as SecureLoginResult & { accessToken?: string; refreshToken?: string };
    if (result.mode !== 'secure') return result;
    if (!result.ok || !result.accessToken || !result.refreshToken) return result;

    const { error } = await supabase.auth.setSession({
      access_token: result.accessToken,
      refresh_token: result.refreshToken
    });
    return error ? { ok: false, mode: 'secure', reason: 'unavailable' } : { ok: true, mode: 'secure' };
  } catch {
    return { ok: false, mode: 'legacy', reason: 'secure-not-configured' };
  }
};

export const runSecureAdminAction = async (body: Record<string, unknown>): Promise<{ ok: boolean; reason?: string }> => {
  if (!supabase) return { ok: false, reason: 'Secure accounts are not configured.' };
  const { data } = await supabase.auth.getSession();
  const accessToken = data.session?.access_token;
  if (!accessToken) return { ok: false, reason: 'Admin session expired. Please log in again.' };

  try {
    const response = await fetch('/api/admin-users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`
      },
      body: JSON.stringify(body)
    });
    return await response.json() as { ok: boolean; reason?: string };
  } catch {
    return { ok: false, reason: 'The user service could not be reached.' };
  }
};

export const signOutSecurely = async () => {
  if (supabase) await supabase.auth.signOut({ scope: 'local' });
};

export const changeSecurePassword = async (password: string): Promise<{ ok: boolean; reason?: string }> => {
  if (!supabase) return { ok: false, reason: 'Secure accounts are not configured.' };
  const { error } = await supabase.auth.updateUser({ password });
  return error ? { ok: false, reason: error.message } : { ok: true };
};

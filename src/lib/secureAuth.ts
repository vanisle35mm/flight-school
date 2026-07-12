import { supabase } from './supabaseClient';

export type SecureLoginResult = {
  ok: boolean;
  mode: 'secure' | 'legacy';
  reason?: 'incorrect' | 'password-reset-required' | 'secure-not-configured' | 'unavailable';
};

export type SecureEmailLoginResult = {
  ok: boolean;
  reason?: string;
};

export type SecureAccountDirectoryEntry = {
  id: string;
  email: string;
  invitedAt?: string;
  lastSignInAt?: string;
  emailConfirmedAt?: string;
};

const getAccessToken = async () => {
  if (!supabase) return '';
  const { data } = await supabase.auth.getSession();
  return data.session?.access_token ?? '';
};

export const signInWithEmail = async (email: string, password: string): Promise<SecureEmailLoginResult> => {
  if (!supabase) return { ok: false, reason: 'Email login is not configured.' };
  const { error } = await supabase.auth.signInWithPassword({ email: email.trim().toLowerCase(), password });
  return error ? { ok: false, reason: 'Email or password is incorrect.' } : { ok: true };
};

export const recoverAdminAccount = async (email: string, password: string): Promise<SecureEmailLoginResult> => {
  if (!supabase) return { ok: false, reason: 'Email login is not configured.' };
  try {
    const response = await fetch('/api/admin-recover', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const result = await response.json() as SecureEmailLoginResult & { accessToken?: string; refreshToken?: string };
    if (!result.ok || !result.accessToken || !result.refreshToken) return { ok: false, reason: result.reason ?? 'Admin recovery failed.' };
    const { error } = await supabase.auth.setSession({
      access_token: result.accessToken,
      refresh_token: result.refreshToken
    });
    return error ? { ok: false, reason: error.message } : { ok: true };
  } catch {
    return { ok: false, reason: 'Admin recovery could not be reached.' };
  }
};

export const requestSecurePasswordReset = async (email: string): Promise<SecureEmailLoginResult> => {
  if (!supabase) return { ok: false, reason: 'Email login is not configured.' };
  const { error } = await supabase.auth.resetPasswordForEmail(email.trim().toLowerCase(), {
    redirectTo: window.location.origin
  });
  return error ? { ok: false, reason: error.message } : { ok: true };
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
  const accessToken = await getAccessToken();
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

export const getSecureAccountDirectory = async (): Promise<{ ok: boolean; accounts: SecureAccountDirectoryEntry[]; reason?: string }> => {
  if (!supabase) return { ok: false, accounts: [], reason: 'Secure accounts are not configured.' };
  const accessToken = await getAccessToken();
  if (!accessToken) return { ok: false, accounts: [], reason: 'Admin session expired. Please log in again.' };
  try {
    const response = await fetch('/api/admin-users', {
      headers: { Authorization: `Bearer ${accessToken}` }
    });
    return await response.json() as { ok: boolean; accounts: SecureAccountDirectoryEntry[]; reason?: string };
  } catch {
    return { ok: false, accounts: [], reason: 'The user service could not be reached.' };
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

export const completeSecurePasswordSetup = async (password: string): Promise<{ ok: boolean; reason?: string }> => {
  if (!supabase) return { ok: false, reason: 'Secure accounts are not configured.' };
  const passwordResult = await changeSecurePassword(password);
  if (!passwordResult.ok) return passwordResult;
  const accessToken = await getAccessToken();
  if (!accessToken) return { ok: false, reason: 'Your secure session expired. Open the email link again.' };
  try {
    const response = await fetch('/api/account', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`
      },
      body: JSON.stringify({ action: 'complete-password-setup' })
    });
    return await response.json() as { ok: boolean; reason?: string };
  } catch {
    return { ok: false, reason: 'Your password changed, but account setup could not be completed. Please try again.' };
  }
};

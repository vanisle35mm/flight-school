import type { GroundSchoolUser } from '../types';
import { verifyPassword } from './passwordHash';

export type StudentPasswordResult = {
  ok: boolean;
  configured: boolean;
  userId?: string;
  reason?: 'not-found' | 'password-not-set' | 'incorrect' | 'unavailable';
};

export const verifyStudentPassword = async (
  firstName: string,
  password: string,
  localUser?: GroundSchoolUser
): Promise<StudentPasswordResult> => {
  try {
    const response = await fetch('/api/student-login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ firstName, password })
    });

    const result = await response.json() as Partial<StudentPasswordResult>;
    if (typeof result.ok === 'boolean' && typeof result.configured === 'boolean') {
      return result as StudentPasswordResult;
    }
  } catch {
    // Local Vite does not run Vercel functions, so use the locally loaded profile.
  }

  if (!localUser) return { ok: false, configured: true, reason: 'not-found' };
  if (!localUser.passwordHash) return { ok: false, configured: true, reason: 'password-not-set' };
  if (!crypto?.subtle) return { ok: false, configured: false, reason: 'unavailable' };

  const passwordMatches = await verifyPassword(password, localUser.passwordHash);
  return {
    ok: passwordMatches,
    configured: true,
    userId: localUser.id,
    reason: passwordMatches ? undefined : 'incorrect'
  };
};

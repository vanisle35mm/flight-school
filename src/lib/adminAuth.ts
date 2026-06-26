const configuredAdminPasswordHash = (import.meta.env.VITE_ADMIN_PASSWORD_HASH ?? '').trim().toLowerCase();

const hashPassword = async (password: string) => {
  const bytes = new TextEncoder().encode(password);
  const digest = await crypto.subtle.digest('SHA-256', bytes);
  return Array.from(new Uint8Array(digest))
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('');
};

export const isAdminPasswordConfigured = () => configuredAdminPasswordHash.length > 0;

export const verifyAdminPassword = async (password: string) => {
  if (!isAdminPasswordConfigured() || !password || !crypto?.subtle) return false;
  return hashPassword(password) === configuredAdminPasswordHash;
};

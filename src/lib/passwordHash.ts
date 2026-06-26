const PASSWORD_HASH_ITERATIONS = 210_000;

const encodeBase64 = (bytes: Uint8Array) => btoa(Array.from(bytes, (byte) => String.fromCharCode(byte)).join(''));
const decodeBase64 = (value: string) => Uint8Array.from(atob(value), (character) => character.charCodeAt(0));

const derivePasswordHash = async (password: string, salt: Uint8Array, iterations: number) => {
  const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(password), 'PBKDF2', false, ['deriveBits']);
  const bits = await crypto.subtle.deriveBits(
    { name: 'PBKDF2', hash: 'SHA-256', salt: salt as BufferSource, iterations },
    key,
    256
  );
  return new Uint8Array(bits);
};

export const hashPassword = async (password: string) => {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const hash = await derivePasswordHash(password, salt, PASSWORD_HASH_ITERATIONS);
  return `pbkdf2$${PASSWORD_HASH_ITERATIONS}$${encodeBase64(salt)}$${encodeBase64(hash)}`;
};

export const verifyPassword = async (password: string, storedHash: string) => {
  const [algorithm, iterationValue, saltValue, hashValue] = storedHash.split('$');
  const iterations = Number(iterationValue);
  if (algorithm !== 'pbkdf2' || !Number.isInteger(iterations) || iterations < 1 || !saltValue || !hashValue) return false;

  try {
    const expectedHash = decodeBase64(hashValue);
    const actualHash = await derivePasswordHash(password, decodeBase64(saltValue), iterations);
    if (actualHash.length !== expectedHash.length) return false;
    return actualHash.every((byte, index) => byte === expectedHash[index]);
  } catch {
    return false;
  }
};

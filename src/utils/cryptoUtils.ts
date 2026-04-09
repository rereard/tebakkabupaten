/**
 * Derives an AES-GCM key from a static passphrase.
 * NOTE: This is client-side obfuscation only — the key is visible in the
 * bundle. Its purpose is to discourage casual tampering of localStorage
 * game history, NOT to provide real cryptographic security.
 */
const getKey = async (): Promise<CryptoKey> => {
  const text = 'iawljavmavjeawjefssafdsfwasfffsvsawdwvdfswfwsbde';
  const encoder = new TextEncoder();
  return crypto.subtle.digest("SHA-256", encoder.encode(text)).then((hash) =>
    crypto.subtle.importKey("raw", hash, { name: "AES-GCM" }, false, ["encrypt", "decrypt"])
  );
};

// Encrypt a JSON object
export const encryptJSON = async (data: object): Promise<string> => {
  const key = await getKey();
  const encodedData = new TextEncoder().encode(JSON.stringify(data));
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const encryptedData = await crypto.subtle.encrypt({ name: "AES-GCM", iv }, key, encodedData);
  return btoa(String.fromCharCode(...iv, ...new Uint8Array(encryptedData)));
};

// Decrypt a JSON object
export const decryptJSON = async (ciphertext: string): Promise<object | null> => {
  try {
    const key = await getKey();
    const dataBytes = new Uint8Array(atob(ciphertext).split("").map((c) => c.charCodeAt(0)));
    const iv = dataBytes.slice(0, 12);
    const encryptedData = dataBytes.slice(12);
    const decryptedData = await crypto.subtle.decrypt({ name: "AES-GCM", iv }, key, encryptedData);
    return JSON.parse(new TextDecoder().decode(decryptedData));
  } catch {
    return null;
  }
};

// Hash the key name using SHA-256
export const encryptKey = async (key: string): Promise<string> => {
  const hash = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(key));
  return btoa(String.fromCharCode(...new Uint8Array(hash)));
};
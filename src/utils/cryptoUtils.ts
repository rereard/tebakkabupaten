// Generate a unique device fingerprint for key encryption
const getDeviceFingerprint = async (): Promise<CryptoKey> => {
  const text = `${navigator.userAgent}-${screen.width}x${screen.height}-${Intl.DateTimeFormat().resolvedOptions().timeZone}`;
  const encoder = new TextEncoder();
  return crypto.subtle.digest("SHA-256", encoder.encode(text)).then((hash) =>
    crypto.subtle.importKey("raw", hash, { name: "AES-GCM" }, false, ["encrypt", "decrypt"])
  );
};

// Generate or retrieve the encryption key (encrypted with the fingerprint)
export const getEncryptionKey = async (): Promise<CryptoKey> => {
  let storedKey = localStorage.getItem("encryptedEncryptionKey");

  if (!storedKey) {
    const newKey = await crypto.subtle.generateKey({ name: "AES-GCM", length: 256 }, true, ["encrypt", "decrypt"]);
    const fingerprint = await getDeviceFingerprint();
    const encryptedKey = await crypto.subtle.encrypt({ name: "AES-GCM", iv: new Uint8Array(12) }, fingerprint, await crypto.subtle.exportKey("raw", newKey));
    localStorage.setItem("encryptedEncryptionKey", btoa(String.fromCharCode(...new Uint8Array(encryptedKey))));
    return newKey;
  }

  try {
    const fingerprint = await getDeviceFingerprint();
    const encryptedKeyBytes = new Uint8Array(atob(storedKey).split("").map((c) => c.charCodeAt(0)));
    const decryptedKey = await crypto.subtle.decrypt({ name: "AES-GCM", iv: new Uint8Array(12) }, fingerprint, encryptedKeyBytes);
    return crypto.subtle.importKey("raw", decryptedKey, { name: "AES-GCM" }, true, ["encrypt", "decrypt"]);
  } catch {
    console.error("Failed to decrypt the stored encryption key.");
    return getEncryptionKey(); // Regenerate the key if decryption fails
  }
};

// Encrypt a JSON object
export const encryptJSON = async (data: object): Promise<string> => {
  const key = await getEncryptionKey();
  const encodedData = new TextEncoder().encode(JSON.stringify(data));
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const encryptedData = await crypto.subtle.encrypt({ name: "AES-GCM", iv }, key, encodedData);
  return btoa(String.fromCharCode(...iv, ...new Uint8Array(encryptedData)));
};

// Decrypt a JSON object
export const decryptJSON = async (ciphertext: string): Promise<object | null> => {
  try {
    const key = await getEncryptionKey();
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
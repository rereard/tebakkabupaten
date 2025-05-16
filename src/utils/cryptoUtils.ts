// Generate a unique device fingerprint for key encryption
const getKey = async (): Promise<CryptoKey> => {
  const text = 'iawljavmavjeawjefssafdsfwasfffsvsawdwvdfswfwsbde';
  const encoder = new TextEncoder();
  return crypto.subtle.digest("SHA-256", encoder.encode(text)).then((hash) =>
    crypto.subtle.importKey("raw", hash, { name: "AES-GCM" }, false, ["encrypt", "decrypt"])
  );
};

// // Generate or retrieve the encryption key (encrypted with the fingerprint)
// export const getEncryptionKey = async (): Promise<any> => {
//   let storedKey = localStorage.getItem("encryptedEncryptionKey");
//   if (!storedKey) {
//     const newKey = await crypto.subtle.generateKey({ name: "AES-GCM", length: 256 }, true, ["encrypt", "decrypt"]);
//     const fingerprint = await getKey();
//     const rawKey = await crypto.subtle.exportKey("raw", newKey);
//     const iv = crypto.getRandomValues(new Uint8Array(12));
//     const encryptedKey = await crypto.subtle.encrypt({ name: "AES-GCM", iv }, fingerprint, rawKey);
//     const combined = new Uint8Array(iv.length + encryptedKey.byteLength);
//     combined.set(iv);
//     combined.set(new Uint8Array(encryptedKey), iv.length);
//     localStorage.setItem("encryptedEncryptionKey", btoa(String.fromCharCode(...combined)));
//     return newKey;
//   }

//   const newKey = await crypto.subtle.generateKey({ name: "AES-GCM", length: 256 }, true, ["encrypt", "decrypt"]);
//   const rawKey = await crypto.subtle.exportKey("raw", newKey);
//   const iv = crypto.getRandomValues(new Uint8Array(12));

//   try {
//     const fingerprint = await getKey();
//     const combined = new Uint8Array(atob(storedKey).split("").map(c => c.charCodeAt(0)));
//     // console.log("fingerprint", fingerprint);
//     const iv = combined.slice(0, 12);
//     const encryptedData = combined.slice(12);
//     const decryptedKey = await crypto.subtle.decrypt({ name: "AES-GCM", iv }, fingerprint, encryptedData);
//     // const encryptedKeyBytes = new Uint8Array(atob(storedKey).split("").map((c) => c.charCodeAt(0)));
//     // console.log("encryptedKeyBytes", encryptedKeyBytes);
//     // const decryptedKey = await crypto.subtle.decrypt({ name: "AES-GCM", iv: new Uint8Array(12) }, fingerprint, encryptedKeyBytes);
//     return crypto.subtle.importKey("raw", decryptedKey, { name: "AES-GCM" }, true, ["encrypt", "decrypt"]);
//   } catch (e) {
//     console.error("Failed to decrypt the stored encryption key.");
//     console.log("e", e);
//     return []
//   }
// };

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
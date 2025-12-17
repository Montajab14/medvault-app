declare global {
  interface Window {
    argon2: any;
  }
}

/**
 * Hashage du password pour authentification (côté frontend)
 */
export async function hashPasswordForAuth(password: string): Promise<string> {
  const authSalt = generateSalt();
  
  const result = await window.argon2.hash({
    pass: password,
    salt: authSalt,
    time: 3,
    mem: 65536,
    parallelism: 1,
    hashLen: 32,
    type: window.argon2.ArgonType.Argon2id,
  });
 
  return result.hashHex as string;
}

/**
 * 1. Génération d'un salt cryptographiquement sûr (16 bytes)
 */
export function generateSalt(): Uint8Array {
  return crypto.getRandomValues(new Uint8Array(16));
}

/**
 * 2. Dérivation de la Master Key avec Argon2id
 * Password + Salt → Argon2 → Master Key (32 bytes)
 */
export async function deriveMasterKey(
  password: string,
  salt: Uint8Array,
): Promise<Uint8Array> {
  const result = await window.argon2.hash({
    pass: password,
    salt,
    time: 3,
    mem: 65536,
    parallelism: 1,
    hashLen: 32,
    type: window.argon2.ArgonType.Argon2id,
  });

  return result.hash as Uint8Array;
}

/**
 * 3. Chiffrement AES-GCM
 * Données en clair → AES-GCM (avec Master Key) → Blob chiffré Base64
 */
export async function encryptData(
  data: object,
  masterKey: Uint8Array,
): Promise<string> {
  const jsonString = JSON.stringify(data);
  const encoder = new TextEncoder();
  const dataBytes = encoder.encode(jsonString);

  const cryptoKey = await crypto.subtle.importKey(
    'raw',
    masterKey.buffer as ArrayBuffer,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt']
  );

  const iv = crypto.getRandomValues(new Uint8Array(12));

  const encryptedBuffer = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    cryptoKey,
    dataBytes
  );

  const encryptedBytes = new Uint8Array(encryptedBuffer);
  const combined = new Uint8Array(iv.length + encryptedBytes.length);
  combined.set(iv, 0);
  combined.set(encryptedBytes, iv.length);

  return btoa(String.fromCharCode(...combined));
}

/**
 * 4. Déchiffrement AES-GCM
 * Blob chiffré Base64 → AES-GCM (avec Master Key) → Données en clair
 */
export async function decryptData(
  encryptedBase64: string,
  masterKey: Uint8Array,
): Promise<object> {
  const combined = Uint8Array.from(atob(encryptedBase64), c => c.charCodeAt(0));

  const iv = combined.slice(0, 12);
  const encryptedBytes = combined.slice(12);

  const cryptoKey = await crypto.subtle.importKey(
    'raw',
    masterKey.buffer as ArrayBuffer,
    { name: 'AES-GCM', length: 256 },
    false,
    ['decrypt']
  );

  const decryptedBuffer = await crypto.subtle.decrypt(
    { name: 'AES-GCM', iv },
    cryptoKey,
    encryptedBytes
  );

  const decoder = new TextDecoder();
  const jsonString = decoder.decode(decryptedBuffer);
  return JSON.parse(jsonString);
}

/**
 * Helper : Conversion Uint8Array → Base64 (pour stocker le salt en BDD)
 */
export function saltToBase64(salt: Uint8Array): string {
  return btoa(String.fromCharCode(...salt));
}

/**
 * Helper : Conversion Base64 → Uint8Array (pour récupérer le salt de la BDD)
 */
export function base64ToSalt(base64: string): Uint8Array {
  return Uint8Array.from(atob(base64), c => c.charCodeAt(0));
}
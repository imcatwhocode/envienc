import {
  CipherGCMTypes, CipherKey, createCipheriv, randomBytes, createDecipheriv, pbkdf2Sync,
} from 'crypto';

export type EncryptResult = {
  iv: Buffer;
  authTag: Buffer;
  ciphertext: Buffer;
};

/**
 * Cipher to use.
 * Prefer GCM ciphers for authenticated encryption
 */
const CIPHER: CipherGCMTypes = 'aes-256-gcm';

/**
 * Number of KDF iterations
 */
const KDF_ITERATIONS = 1000;

/**
 * Size of derived key
 */
const KDF_SIZE = 32;

/**
 * KDF digest
 */
const KDF_DIGEST = 'sha256';

/**
 * Perform KDF on password to derieve encryption key
 * @param password User-selected password
 * @param salt Salt (must be at least 16 bytes)
 * @returns Encryption key
 */
export function deriveKey(password: string, salt: string): CipherKey {
  return pbkdf2Sync(password, salt, KDF_ITERATIONS, KDF_SIZE, KDF_DIGEST);
}

/**
 * Encrypts data
 * @param key Encryption key
 * @param plaintext Plaintext (unencrypted) data
 * @returns Generated IV and encrypted data
 */
export function encrypt(key: CipherKey, plaintext: Buffer): EncryptResult {
  const iv = randomBytes(16);
  const cipher = createCipheriv(CIPHER, key, iv);
  const ciphertext = Buffer.concat([cipher.update(plaintext), cipher.final()]);
  const authTag = cipher.getAuthTag();
  return {
    iv,
    authTag,
    ciphertext,
  };
}

/**
 * Decrypts data
 * @param key Encryption key
 * @param ciphertext Encrypted data
 * @param iv Initialization vector
 * @returns Plaintext (unencrypted) data
 */
export function decrypt(key: CipherKey, ciphertext: Buffer, iv: Buffer, authTag: Buffer): Buffer {
  const decipher = createDecipheriv(CIPHER, key, iv);
  decipher.setAuthTag(authTag);
  return Buffer.concat([decipher.update(ciphertext), decipher.final()]);
}

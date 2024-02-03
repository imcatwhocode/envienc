import { CipherKey } from 'crypto';
import { decrypt, deriveKey, encrypt, EncryptResult } from './crypto';
import { Data, GenericMetadata, KeyedDecryptor, KeyedEncryptor } from './types';

export type Encoded = string;
export type Decoded = EncryptResult & {
  format?: FormatNumber;
};

/**
 * Envienc format number
 */
export enum FormatNumber {
  V1 = '',
  V2 = '$EE2$',
}

/**
 * Encodes encryption result & parameters to safe string
 * @param params Ciphertext and parameters
 * @returns Encoded ciphertext
 */
function encode(params: Decoded): string {
  let format = '';
  if (params.format !== FormatNumber.V1) {
    // Add version prefix for format v2 and above
    format = `${params.format ?? FormatNumber.V2}:`;
  }

  const encoding = params.format === FormatNumber.V1 ? 'hex' : 'base64';
  return `${format}${params.iv.toString(encoding)}:${params.authTag.toString(encoding)}:${params.ciphertext.toString(encoding)}`;
}

/**
 * Decodes safe string to encryption result parameters
 * @param encoded Encoded ciphertext
 * @returns Ciphertext and parameters
 */
function decode(encoded: Encoded): Decoded {
  let format: FormatNumber = FormatNumber.V1;

  // Decode parameters
  const params = encoded.trim().split(':');

  // Check is first parameter is version number
  if (params[0] === '$EE2$') {
    params.shift();
    format = FormatNumber.V2;
  }

  const encoding = format === FormatNumber.V1 ? 'hex' : 'base64';
  const [iv, authTag, ciphertext] = params.map((value) =>
    Buffer.from(value, encoding),
  );
  return { iv, authTag, ciphertext };
}

/**
 * Encrypts the given data using the provided key and metadata.
 * @param key The cipher key to use for encryption.
 * @param data The data to encrypt.
 * @param metadata The metadata to include in the encrypted data.
 * @returns The encrypted data as a string.
 */
function encryptor(
  key: CipherKey,
  data: Data,
  metadata?: GenericMetadata,
): string {
  const plaintext = JSON.stringify({ d: data, m: metadata ?? {} });
  const encrypted = encrypt(key, Buffer.from(plaintext));
  return encode(encrypted);
}

/**
 * Decrypts an encoded ciphertext using the provided key.
 * @param key The key used for decryption.
 * @param encodedCiphertext The encoded ciphertext to be decrypted.
 * @returns An object containing the decrypted data and metadata.
 */
function decryptor(key: CipherKey, encodedCiphertext: string) {
  const { ciphertext, iv, authTag, format } = decode(encodedCiphertext);

  const plaintext = decrypt(key, ciphertext, iv, authTag);
  if (format === FormatNumber.V1) {
    return { data: plaintext.toString(), metadata: {} };
  }

  const { d, m } = JSON.parse(plaintext.toString());
  return {
    data: d as string,
    metadata: m as GenericMetadata,
  };
}

/**
 * Derives encryption key from password and salt, and returns keyed encryptor and decryptor
 * @param password User-provided password
 * @param salt Salt
 * @returns Keyed decryptor and encryptor
 */
export function ignite(
  password: string,
  salt: string,
): {
  encryptor: KeyedEncryptor;
  decryptor: KeyedDecryptor;
} {
  const key = deriveKey(password, salt);

  return {
    encryptor: encryptor.bind(null, key),
    decryptor: decryptor.bind(null, key),
  };
}

import { EncryptResult } from './encryption';

export type Encoded = string;
export type Decoded = EncryptResult;

/**
 * Encodes encryption result & parameters to safe string
 * @param params Ciphertext & IV
 * @returns Encrypted string
 */
export function encode(params: Decoded): Encoded {
  return `${params.iv.toString('hex')}:${params.authTag.toString('hex')}:${params.ciphertext.toString('hex')}`;
}

/**
 * Decodes safe string to encryption result parameters
 * @param encoded Safe string
 * @returns Ciphertext & IV
 */
export function decode(encoded: Encoded): Decoded {
  const [iv, authTag, ciphertext] = encoded
    .trim()
    .split(':')
    .map(c => Buffer.from(c, 'hex'));
  return { iv, authTag, ciphertext };
}

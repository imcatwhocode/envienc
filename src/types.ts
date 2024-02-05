export type EncryptFile = (file: string, encryptor: KeyedEncryptor) => string;
export type DecryptFile = (file: string, decryptor: KeyedDecryptor) => string;

export interface Parser {
  encryptFile: EncryptFile;
  decryptFile: DecryptFile;
}

/**
 * Additional options retrieved from comments in the file by Parser
 */
export interface ParserCommentOpts {
  /**
   * Disables encryption of the particular node
   */
  noEncrypt?: boolean;
}

/**
 * Type representing generic metadata object for Envienc v2 format
 */
export type GenericMetadata = Record<string, unknown>;

/**
 * Type representing generic data entry
 */
export type Data = string | true;

/**
 * Encrypts data and metadata
 * @param data - Configuration value
 * @param metadata - Metadata related to this value
 * @returns Encrypted & encoded string
 */
export type KeyedEncryptor = (data: Data, metadata?: GenericMetadata) => string;

/**
 * Decrypts data and metadata
 * @param encodedCiphertext - Encrypted & encoded string
 * @returns Configuration value and metadata
 */
export type KeyedDecryptor = (encodedCiphertext: string) => {
  data: Data;
  metadata: GenericMetadata;
};

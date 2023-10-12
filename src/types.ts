export type EncryptFile = (file: string, encryptor: KeyedEncryptor) => string;
export type DecryptFile = (file: string, decryptor: KeyedDecryptor) => string;

export type Parser = {
  encryptFile: EncryptFile,
  decryptFile: DecryptFile
};

/**
 * Type representing generic metadata object for Envienc v2 format
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type GenericMetadata = Record<string, any>;

/**
 * Type representing generic data entry
 */
export type Data = string | true;

/**
 * Encrypts data and metadata
 * @param data Configuration value
 * @param metadata Metadata related to this value
 * @returns Encrypted & encoded string
 */
export type KeyedEncryptor = (data: Data, metadata?: GenericMetadata) => string;

/**
 * Decrypts data and metadata
 * @param encodedCiphertext Encrypted & encoded string
 * @returns Configuration value and metadata
 */
export type KeyedDecryptor = (encodedCiphertext: string) => {
  data: Data,
  metadata: GenericMetadata
};

import type { DecryptFile, EncryptFile } from '../../types';

const PARSER_REGEXP =
  /(?<begin>^|\n)(?:#(?:[ \t]*)(?<comment>@envienc no-encrypt)(?:\n))?(?<key>(?!#)[^\n=]+)=(?<value>[^\n]*)/g;

const encryptFile: EncryptFile = (file, encryptor) => {
  return file.replaceAll(
    PARSER_REGEXP,
    (
      substring: string,
      begin: string,
      comment: string,
      key: string,
      value: string,
    ) => {
      // If skip comment is present, do not encrypt
      if (comment) {
        return substring;
      }

      return `${begin}${key}=${encryptor(value) as string}`;
    },
  );
};

const decryptFile: DecryptFile = (file, decryptor) => {
  return file.replaceAll(
    PARSER_REGEXP,
    (
      substring: string,
      begin: string,
      comment: string,
      key: string,
      value: string,
    ) => {
      // Skip if comment is present or the value's preamble not found
      if (comment || !value.startsWith('$EE2$')) {
        return substring;
      }

      return `${begin}${key}=${decryptor(value).data as string}`;
    },
  );
};

export { encryptFile, decryptFile };

import type { DecryptFile, EncryptFile } from '../../types';

const DEFINE_REGEX =
  /^(?<define>\s*#define\s+\S+\s+)(?<comment>(?:\/\*\s+@envienc\s+no-encrypt\s+\*\/\s+)?)(?<content>(?:.*?\\(?<line>\n|\r\n))*.*?)$/gm;

const ENCRYPTED_DEFINE_REGEX =
  /^(?<define>\s*#define\s+\S+\s+)(?<ciphertext>"\$EE2\$.*?")$/gm;

export const encryptFile: EncryptFile = (file, encryptor) =>
  file.replace(
    DEFINE_REGEX,
    (match, prefixGroup: string, disableGroup: string, dataGroup: string) => {
      if (disableGroup !== '') {
        return match;
      }
      return `${prefixGroup}${JSON.stringify(encryptor(dataGroup))}`;
    },
  );

export const decryptFile: DecryptFile = (file, decryptor) =>
  file.replace(
    ENCRYPTED_DEFINE_REGEX,
    (_, prefixGroup: string, dataGroup: string) => {
      const unarmored = JSON.parse(dataGroup) as unknown;
      if (typeof unarmored !== 'string') {
        throw new Error('Invalid ciphertext');
      }

      return `${prefixGroup}${decryptor(unarmored).data}`;
    },
  );

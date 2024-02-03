import {DecryptFile, EncryptFile} from '../../types';

const DEFINE_REGEX = /^(\s*#define\s+\S+\s+)((?:\/\*\s+@envienc\s+no-encrypt\s+\*\/\s+)?)((?:.*?\\(\n|\r\n))*.*?)$/gm;

const ENCRYPTED_DEFINE_REGEX = /^(\s*#define\s+\S+\s+)("\$EE2\$(?:.*?)")$/gm;

const encryptFile: EncryptFile = (file, encryptor) => file
  .replace(DEFINE_REGEX, (match, prefixGroup, disableGroup, dataGroup) => {
    if (disableGroup !== '') {
      return match;
    }
    return `${prefixGroup}${JSON.stringify(encryptor(dataGroup))}`;
  });

const decryptFile: DecryptFile = (file, decryptor) => file
  .replace(ENCRYPTED_DEFINE_REGEX, (match, prefixGroup, dataGroup) => {
    return `${prefixGroup}${decryptor(JSON.parse(dataGroup)).data}`;
  });

export default {
  encryptFile,
  decryptFile,
};

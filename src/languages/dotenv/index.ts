import { shouldSkip } from '../../flags';
import { DecryptFile, EncryptFile } from '../../types';
import {
  EnvTreeNode, parse, stringify, RESERVED_KEYS,
} from './parser';

export type Metadata = {
  multilineMode?: 'RESOLVE' | 'ESCAPE',
  followedByNewline?: boolean,
};

const encryptFile: EncryptFile = (file, encryptor) => {
  const content = parse(file);

  // Encrypt each node
  const nodes = Object
    .entries(content)
    .map(([key, value]) => {
      // Skip reserved keys
      if (RESERVED_KEYS.includes(key)) {
        return [key, value];
      }

      const node = value as EnvTreeNode;
      if (node.comments && shouldSkip(...node.comments)) {
        return [key, node];
      }

      return [
        key,
        {
          ...node,
          // Encrypt value
          value: encryptor(node.value, {
            multilineMode: node.multilineMode,
            followedByNewline: node.followedByNewline,
          }),
        },
      ];
    });

  return stringify(Object.fromEntries(nodes));
};

const decryptFile: DecryptFile = (file, decryptor) => {
  const content = parse(file);

  // Decrypt each node
  const nodes = Object
    .entries(content)
    .map(([key, entry]) => {
      // Skip reserved keys
      if (RESERVED_KEYS.includes(key)) {
        return [key, entry];
      }

      const node = entry as EnvTreeNode;
      if (node.comments && shouldSkip(...node.comments)) {
        return [key, node];
      }

      const { data, metadata } = decryptor(node.value as string);
      const meta = metadata as Metadata;
      return [
        key,
        {
          ...node,
          value: data,
          // Fallback to "ESCAPE" mode if not specified
          multilineMode: meta?.multilineMode ?? 'ESCAPE',
          followedByNewline: meta?.followedByNewline,
        },
      ];
    });

  return stringify(Object.fromEntries(nodes));
};

export default { encryptFile, decryptFile };

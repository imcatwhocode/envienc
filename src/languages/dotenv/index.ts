import { shouldSkip } from '../../flags';
import type { DecryptFile, EncryptFile } from '../../types';
import type { EnvTree, EnvTreeNode } from './parser';
import { parse, stringify, RESERVED_KEYS } from './parser';

export interface Metadata {
  multilineMode?: 'RESOLVE' | 'ESCAPE';
  followedByNewline?: boolean;
}

const encryptFile: EncryptFile = (file, encryptor) => {
  const content = parse(file);

  // Encrypt each node
  const nodes = Object.entries(content).map<[string, EnvTreeNode]>(
    ([key, value]) => {
      // Skip reserved keys
      if (RESERVED_KEYS.includes(key)) {
        return [key, value];
      }

      const node = value;
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
          }) as string,
        },
      ];
    },
  );

  return stringify(Object.fromEntries(nodes));
};

const decryptFile: DecryptFile = (file, decryptor) => {
  const content = parse(file);

  // Decrypt each node
  const nodes = Object.entries(content).map<[string, EnvTreeNode]>(
    ([key, entry]) => {
      // Skip reserved keys
      if (RESERVED_KEYS.includes(key)) {
        return [key, entry];
      }

      const node = entry;
      if (node.comments && shouldSkip(...node.comments)) {
        return [key, node];
      }

      const { data, metadata } = decryptor(node.value as string);
      const meta = metadata as Metadata;
      return [
        key,
        {
          ...node,
          value: data as string,
          // Fallback to "ESCAPE" mode if not specified
          multilineMode: meta.multilineMode ?? 'ESCAPE',
          followedByNewline: meta.followedByNewline ?? false,
        },
      ];
    },
  );

  return stringify(Object.fromEntries(nodes) as EnvTree);
};

export { encryptFile, decryptFile };

import type YAML from 'yaml';
import { isAlias, isCollection, isPair, isScalar } from 'yaml';
import { shouldSkip } from '../../flags';
import type { Data, DecryptFile, EncryptFile } from '../../types';
import { parse, stringify } from './parser';

/**
 * Traverses a YAML tree and applies a callback to each scalar node.
 * @param cb - The callback to apply to each scalar node.
 * @param node - The YAML node to traverse.
 */
const traverse = (cb: (input: string) => Data, node?: YAML.Node): void => {
  // Skip empty nodes
  if (!node) {
    return;
  }

  // Skip nodes flagged with `no-encrypt`
  if (shouldSkip(node.commentBefore, node.comment)) {
    return;
  }

  // Skip aliases
  if (isAlias(node)) {
    // Do nothing with aliases
    return;
  }

  // Encrypt scalars
  if (isScalar(node)) {
    // Reassigning the value is the intended way to mutate the tree

    node.value = cb(node.value as string);
    return;
  }

  // Traverse into Pairs' values
  if (isPair(node)) {
    const pair = node as YAML.Pair<YAML.Scalar, YAML.Node>;

    // For Pair, we need to check both key and value comments for flags
    if (shouldSkip(pair.key.comment, pair.key.commentBefore)) {
      return;
    }

    traverse(cb, pair.value ?? undefined);
    return;
  }

  // Traverse into Collections' items
  if (isCollection(node)) {
    // That's OK to use for-of on this data structure

    for (const pair of node.items) {
      traverse(cb, pair as YAML.Node);
    }
  }
};

const encryptFile: EncryptFile = (file, encryptor) => {
  const tree = parse(file);
  if (!tree.contents) {
    return stringify(tree);
  }

  traverse(encryptor, tree.contents as YAML.Node);
  return stringify(tree);
};

const decryptFile: DecryptFile = (file, decryptor) => {
  const tree = parse(file);
  if (!tree.contents) {
    return stringify(tree);
  }

  traverse(
    (input: string) => decryptor(input).data,
    tree.contents as YAML.Node,
  );
  return stringify(tree);
};

export { encryptFile, decryptFile };

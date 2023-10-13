import YAML, {
  isAlias, isCollection, isPair, isScalar, Scalar,
} from 'yaml';
import { shouldSkip } from '../../flags';
import { Data, DecryptFile, EncryptFile } from '../../types';
import { parse, stringify } from './parser';

/**
 * Traverses a YAML tree and applies a callback to each scalar node.
 * @param cb The callback to apply to each scalar node.
 * @param node The YAML node to traverse.
 */
const traverse = (cb: (input: string) => Data, node?: YAML.Node) => {
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
    // eslint-disable-next-line no-param-reassign
    (node as Scalar).value = cb(node.value as string);
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
    // eslint-disable-next-line no-restricted-syntax
    for (const pair of node.items) { traverse(cb, pair as YAML.Node); }
  }
};

const encryptFile: EncryptFile = (file, encryptor) => {
  const tree = parse(file);
  traverse(encryptor, tree.contents);
  return stringify(tree);
};

const decryptFile: DecryptFile = (file, decryptor) => {
  const tree = parse(file);
  const decrypt = (input: string) => decryptor(input).data;

  traverse(decrypt, tree.contents);
  return stringify(tree);
};

export default { encryptFile, decryptFile };

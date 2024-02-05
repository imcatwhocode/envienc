import { generate } from 'peggy';
import type { Data } from '../../types';
import { grammar } from './grammar';

const parser = generate(grammar);

/**
 * Some utility data returned by the parser is not needed in the final result.
 */
export const RESERVED_KEYS = ['__orphanComments'];

/**
 * Type represents different approaches to newline handling.
 * - `RESOLVE` - newlines are resolved as is
 * - `ESCAPE` - newlines are escaped with backslash (`\n`)
 */
export type MultilineMode = 'RESOLVE' | 'ESCAPE';

/**
 * Dotenv file tree node
 */
export interface EnvTreeNode {
  comments?: string[];
  value: Data;
  multilineMode?: MultilineMode;
  followedByNewline: boolean;
}

/**
 * Dotenv file tree
 */
export type EnvTree = Record<string, EnvTreeNode>;

/**
 * Parses .env file into a dotenv file tree
 * @param content - Raw dotenv content
 * @returns Dotenv tree
 */
const parse = (content: string): EnvTree => parser.parse(content) as EnvTree;

/**
 * Stringifies a Dotenv tree into a .env file contents
 * @param content - Dotenv file tree
 * @returns Raw dotenv content
 */
const stringify = (content: EnvTree): string => {
  const nodes = Object.entries(content).filter(
    ([key]) => !RESERVED_KEYS.includes(key),
  );

  const entries = nodes.map(([key, value]) => {
    let entry = '';
    const trailing = value.followedByNewline ? '\n' : '';

    // Comments
    if (value.comments?.length) {
      // Only add leading "#" to non-empty comments
      entry += value.comments.map((c) => (c.length ? `#${c}` : '')).join('\n');
      entry += '\n';
    }

    // Key
    entry += key;

    // Flag value
    if (value.value === true) {
      entry += '=';
      return entry + trailing;
    }

    // Value w/out multiline
    if (!value.multilineMode) {
      entry += `="${value.value}"`;
      return entry + trailing;
    }

    // Multiline value
    if (value.multilineMode === 'RESOLVE') {
      // For "RESOLVE" mode, put newlines as is
      entry += `="${value.value.replace(/\\n/gm, '\n')}"`;
      return entry + trailing;
    }

    // For "ESCAPE" mode, escape newlines with backslash
    entry += `="${value.value.replace(/\n/gm, '\\n')}"`;
    return entry + trailing;
  });

  // Apply orphan comments
  const orphanComments = content.__orphanComments?.comments;
  if (orphanComments?.length) {
    entries.push(...orphanComments.map((c) => (c.length ? `#${c}` : '')));
  }

  return entries.join('\n');
};

export { parse, stringify };

import { statSync } from 'node:fs';
import { basename } from 'node:path';
import type { GlobOptionsWithFileTypesFalse } from 'glob';
import { globSync } from 'glob';

export type AbstractFind = (
  patterns?: string[],
  opts?: GlobOptionsWithFileTypesFalse,
) => string[];

/**
 * Extension for encrypted files
 */
export const EXTENSION = '.envienc';

/**
 * Default glob covering all dotenvs
 */
export const DEFAULT_DOTENV_GLOB = ['**/.env', '**/.env.*'];

/**
 * Checks is file envienc-rypted
 * @param p - Absolute path
 * @returns True, if file is likely encrypted. False otherwise
 */
const isEncrypted = (p: string): boolean => p.endsWith(EXTENSION);

/**
 * Checks is path refers to a file
 * @param p - Absolute path
 * @returns True, if file. False otherwise.
 */
const isFile = (p: string): boolean => statSync(p).isFile();

/**
 * Performs glob lookup, then returns found paths
 * @param patterns - Globs to search
 * @param exclude - Globs to exclude/ignore
 * @returns Absolute paths to files
 */
export function findEntries(
  patterns: string[],
  opts: GlobOptionsWithFileTypesFalse,
): string[] {
  return globSync(patterns, opts).filter(
    (p) => basename(p) !== '.enviencrc' && isFile(p),
  );
}

/**
 * Performs glob lookup, then returns found paths
 * @param patterns - Globs to search
 * @param exclude - Globs to exclude/ignore
 * @returns Absolute paths to files
 */
const findPlaintext: AbstractFind = (
  patterns = DEFAULT_DOTENV_GLOB,
  opts = {},
) => {
  const paths = findEntries(patterns, opts);
  return paths.filter((p) => !isEncrypted(p));
};

/**
 * Performs glob lookup for encrypted files.
 * **Notice** that these globs should match **unencrypted** files.
 * @param patterns - Globs to search.
 * @param exclude - Globs to exclude/ignore
 * @returns Absolute paths to files
 */
const findEncrypted: AbstractFind = (
  patterns = DEFAULT_DOTENV_GLOB,
  opts = {},
) => {
  const paths = findEntries(
    patterns.map((p) => p.concat(EXTENSION)),
    opts,
  );
  return paths.filter((p) => isEncrypted(p));
};

export { findPlaintext, findEncrypted };

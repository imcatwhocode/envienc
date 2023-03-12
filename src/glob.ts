import { globSync } from 'glob';

/**
 * Extension for encrypted files
 */
export const EXTENSION = '.envienc';

/**
 * Performs glob lookup, then returns found paths
 * @param patterns Globs to search
 * @param exclude Globs to exclude/ignore
 * @returns Absolute paths to files
 */
export function findEntries(patterns: string[], exclude: string[]): string[] {
  return globSync(patterns, { ignore: exclude, absolute: true });
}

/**
 * Performs glob lookup, then returns found paths
 * @param patterns Globs to search
 * @param exclude Globs to exclude/ignore
 * @returns Absolute paths to files
 */
export function findPlaintext(patterns: string[], exclude: string[]): string[] {
  return findEntries(patterns, exclude);
}

/**
 * Performs glob lookup for encrypted files.
 * **Notice** that these globs should match **unencrypted** files.
 * @param patterns Globs to search.
 * @param exclude Globs to exclude/ignore
 * @returns Absolute paths to files
 */
export function findEncrypted(patterns: string[], exclude: string[]): string[] {
  return findEntries(
    patterns.map(p => p.concat(EXTENSION)),
    exclude.map(p => p.concat(EXTENSION)),
  );
}

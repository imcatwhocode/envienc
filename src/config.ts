import { existsSync, readFileSync, writeFileSync } from 'fs';
import { join, resolve } from 'path';

const cwd = process.cwd();

/**
 * Configuration file name
 */
export const CONFIG_NAME = '.enviencrc';

/**
 * Configuration file
 */
export type Config = {
  /**
   * Password salt
   */
  salt: string;

  /**
   * Dotenv globs
   */
  globs?: string[];
};

/**
 * Recursively find config path recursively up
 *
 * Based on https://github.com/mateodelnorte/find-file-recursively-up
 * @returns Path to .enviencrc, or "undefined" if not found
 */
export function findConfigPath(): string | undefined {
  function find(entry: string): string | undefined {
    const path = join(cwd, entry, CONFIG_NAME);
    const exists = existsSync(path);

    if (exists) { return path; }
    if (resolve(cwd, entry) === '/') { return undefined; }
    return find(join('..', entry));
  }
  return find('.');
}

/**
 * Read nearest configuration file
 * @returns Configuration file contents, undefined if file is not found
 */
export function readConfig(): Config | undefined {
  const path = findConfigPath();
  if (!path) { return undefined; }
  return JSON.parse(readFileSync(path, 'utf-8'));
}

/**
 * Writes configuration to file in current location
 * @param config Configuration file contents
 * @returns Path to created configuration file
 */
export function writeConfig(config: Config): string {
  const path = join(cwd, CONFIG_NAME);
  writeFileSync(path, JSON.stringify(config));
  return path;
}

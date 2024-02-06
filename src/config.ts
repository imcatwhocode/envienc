import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { z } from 'zod';

const cwd = process.cwd();

/**
 * Configuration file name
 */
export const CONFIG_NAME = '.enviencrc';

const Config = z.object({
  /**
   * Salt for key derivation from password
   */
  salt: z.string(),
  /**
   * Files globs
   */
  globs: z.array(z.string()).optional(),
});

type Config = z.infer<typeof Config>;

/**
 * Recursively find config path recursively up
 *
 * Based on https://github.com/mateodelnorte/find-file-recursively-up
 * @returns Path to .enviencrc, or undefined if not found
 */
export function findConfigPath(): string | undefined {
  function find(entry: string): string | undefined {
    const path = join(cwd, entry, CONFIG_NAME);
    const exists = existsSync(path);

    if (exists) {
      return path;
    }
    if (resolve(cwd, entry) === resolve(cwd, join('..', entry))) {
      return undefined;
    }
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
  if (!path) {
    return undefined;
  }

  const contents = JSON.parse(readFileSync(path, 'utf-8')) as unknown;
  if (!contents) {
    return undefined;
  }

  return Config.parse(contents);
}

/**
 * Writes configuration to file in current location
 * @param config - Configuration file contents
 * @returns Path to created configuration file
 */
export function writeConfig(config: Config): string {
  const path = join(cwd, CONFIG_NAME);
  writeFileSync(path, JSON.stringify(config));
  return path;
}

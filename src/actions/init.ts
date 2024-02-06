import { writeConfig } from '../config';
import { generateSalt } from '../crypto';
import { logger } from '../output';

/**
 * Implements "init" action
 * @param opts - Arguments
 */
export function initAction({ glob }: { glob?: string[] }): never {
  const path = writeConfig({
    salt: generateSalt(),
    globs: glob,
  });
  logger.info('Created configuration: %s', path);
  process.exit(0);
}

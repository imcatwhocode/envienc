import { writeConfig } from '../config';
import { generateSalt } from '../crypto';
import { out } from '../output';

/**
 * Implements "init" action
 * @param opts Arguments
 */
export default function initAction({ glob }: { glob?: string[] }): never {
  const path = writeConfig({
    salt: generateSalt(),
    globs: glob,
  });
  out('✌️ Created configuration:', path);
  process.exit(0);
}

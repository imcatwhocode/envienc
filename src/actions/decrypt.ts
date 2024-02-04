import { readFileSync, writeFileSync } from 'node:fs';
import { prompt } from 'enquirer';
import { readConfig } from '../config';
import { ignite } from '../encryption';
import { findEncrypted } from '../glob';
import { getParser } from '../languages';
import { logger } from '../output';

/**
 * Implements "decrypt" action
 * @param opts - Arguments
 */
export async function decryptAction(
  globs: string[],
  {
    password: passwordArgument,
    exclude,
  }: { password?: string; exclude?: string },
): Promise<never> {
  const config = readConfig();
  let password = passwordArgument || process.env.ENVIENC_PWD;
  if (!config) {
    logger.error(
      'Configuration file is missing. Initialize first with "envienc init"',
    );
    process.exit(1);
  }

  if (!password) {
    try {
      const input = await prompt<{ password: string }>({
        type: 'password',
        name: 'password',
        message: '🔑 Encryption password:',
      });
      if (!input.password) {
        throw new Error(
          'Password is missing. Provide it via "-p <password>" argument, "ENVIENC_PWD" environment variable or enter manually on prompt.',
        );
      }

      password = input.password;
    } catch (error) {
      logger.error(error);
      process.exit(1);
    }
  }

  if (!config.globs?.length && !globs.length) {
    logger.info('Nothing to decrypt. Skipping...');
    process.exit(0);
  }

  const patterns = [...globs];
  if (config.globs?.length) {
    patterns.push(...config.globs);
  }

  const paths = findEncrypted(patterns, { ignore: exclude });
  if (!paths.length) {
    logger.info('Nothing to decrypt. Skipping...');
    process.exit(0);
  }

  const { decryptor } = ignite(password, config.salt);

  const changes: [string, string][] = paths.map((path) => {
    let contents = readFileSync(path, 'utf-8');
    const { decryptFile } = getParser(path, contents);
    contents = decryptFile(contents, decryptor);
    return [path.split('.').slice(0, -1).join('.'), contents];
  });

  changes.forEach(([path, contents]) => {
    writeFileSync(path, contents, 'utf-8');
    logger.info('✔️ Decrypted:', path);
  });

  logger.info('🎉 Done!');
  process.exit(0);
}

import { readFileSync, writeFileSync } from 'node:fs';
import { prompt } from 'enquirer';
import { readConfig } from '../config';
import { ignite } from '../encryption';
import { EXTENSION, findPlaintext } from '../glob';
import { logger } from '../output';
import { getParser } from '../languages';

/**
 * Implements "encrypt" action
 * @param opts - Arguments
 */
export async function encryptAction(
  globs: string[],
  {
    password: passwordArgument,
    exclude,
  }: { password?: string; exclude?: string },
): Promise<never> {
  const config = readConfig();
  let password =
    passwordArgument ?? process.env.ENVIENC_PASSWORD ?? process.env.ENVIENC_PWD;
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
          'Password is missing. Provide it via "-p <password>" argument, "ENVIENC_PASSWORD" environment variable or enter manually on prompt.',
        );
      }

      password = input.password;
    } catch (error) {
      logger.error(error);
      process.exit(1);
    }
  }

  if (!config.globs?.length && !globs.length) {
    logger.info('Nothing to encrypt. Skipping...');
    process.exit(0);
  }

  const patterns = [...globs];
  if (config.globs?.length) {
    patterns.push(...config.globs);
  }

  const paths = findPlaintext(patterns, { ignore: exclude });
  if (!paths.length) {
    logger.info('Nothing to encrypt. Skipping...');
    process.exit(0);
  }

  const { encryptor } = ignite(password, config.salt);

  const changes: [string, string][] = paths.map((path) => {
    let contents = readFileSync(path, 'utf-8');
    const { encryptFile } = getParser(path, contents);
    contents = encryptFile(contents, encryptor);
    return [path.concat(EXTENSION), contents];
  });

  changes.forEach(([path, contents]) => {
    writeFileSync(path, contents, 'utf-8');
    logger.info('Encrypted: %s', path);
  });

  logger.info('Done!');
  process.exit(0);
}

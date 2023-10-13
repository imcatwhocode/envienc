import { readFileSync, writeFileSync } from 'fs';
import { prompt } from 'enquirer';
import { readConfig } from '../config';
import { ignite } from '../encryption';
import { EXTENSION, findPlaintext } from '../glob';
import { out, err } from '../output';
import { getParser } from '../languages';

/**
 * Implements "encrypt" action
 * @param opts Arguments
 */
export default async function encryptAction(
  globs: string[],
  { password: passwordArgument, exclude }: { password?: string, exclude?: string },
): Promise<never> {
  const config = readConfig();
  let password = passwordArgument || process.env.ENVIENC_PWD;
  if (!config) {
    err('📛 Configuration file is missing. Initialize first with "envienc init"');
    process.exit(1);
  }

  if (!password) {
    try {
      const input = await prompt<{ password: string }>({ type: 'password', name: 'password', message: '🔑 Encryption password:' });
      if (!input.password) {
        throw new Error('Password is missing. Provide it via "-p <password>" argument, "ENVIENC_PWD" environment variable or enter manually on prompt.');
      }

      password = input.password;
    } catch (error) {
      err('📛', error);
      process.exit(1);
    }
  }

  if (!config.globs?.length && !globs?.length) {
    out('⚠️  Nothing to encrypt. Skipping...');
    process.exit(0);
  }

  const patterns = [...config.globs || [], ...globs || []];
  const paths = findPlaintext(patterns, { ignore: exclude });
  if (!paths.length) {
    out('⚠️  Nothing to encrypt. Skipping...');
    process.exit(0);
  }

  const { encryptor } = ignite(password, config.salt);

  const changes: [string, string][] = paths.map(path => {
    let contents = readFileSync(path, 'utf-8');
    const { encryptFile } = getParser(path, contents);
    contents = encryptFile(contents, encryptor);
    return [path.concat(EXTENSION), contents];
  });

  changes.forEach(([path, contents]) => {
    writeFileSync(path, contents, 'utf-8');
    out('✔️  Encrypted:', path);
  });

  out('🎉 Done!');
  process.exit(0);
}

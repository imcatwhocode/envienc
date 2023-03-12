import { CipherKey } from 'crypto';
import { readFileSync, writeFileSync } from 'fs';
import { readConfig } from '../config';
import { decrypt, deriveKey } from '../encryption';
import { findEncrypted } from '../glob';
import { out, err } from '../output';
import { Replacer, replaceValues } from '../tokenizer';
import { decode } from '../encoder';

const decrypter = (encryptionKey: CipherKey): Replacer => (entry, key, value) => {
  const { authTag, iv, ciphertext } = decode(value);
  const decrypted = decrypt(encryptionKey, ciphertext, iv, authTag).toString('utf-8');
  return `${key}=${decrypted}`;
};

/**
 * Implements "decrypt" action
 * @param opts Arguments
 */
export default function decryptAction(
  globs: string[],
  { password: passwordArgument, exclude }: { password?: string, exclude?: string },
): never {
  const config = readConfig();
  const password = passwordArgument || process.env.ENVIENC_PWD;
  if (!config) {
    err('📛 Configuration file is missing. Initialize first with "envienc init"');
    process.exit(1);
  }

  if (!password) {
    err('📛 Password is missing. Provide it via "-p <password>" argument, or "ENVIENC_PWD" environment variable');
    process.exit(1);
  }

  if (!config.globs?.length && !globs?.length) {
    out('⚠️  Nothing to decrypt. Skipping...');
    process.exit(0);
  }

  const patterns = [...config.globs || [], ...globs || []];
  const paths = findEncrypted(patterns, { ignore: exclude });
  if (!paths.length) {
    out('⚠️  Nothing to decrypt. Skipping...');
    process.exit(0);
  }

  const key = deriveKey(password, config.salt);
  const keyedDecryptor = decrypter(key);
  const changes: [string, string][] = paths.map(path => {
    let contents = readFileSync(path, 'utf-8');
    contents = replaceValues(contents, keyedDecryptor);
    return [path.split('.').slice(0, -1).join('.'), contents];
  });

  changes.forEach(([path, contents]) => {
    writeFileSync(path, contents, 'utf-8');
    out('✔️  Decrypted:', path);
  });

  out('🎉 Done!');
  process.exit(0);
}

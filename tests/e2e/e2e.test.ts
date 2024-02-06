/**
 * This is simple test file to test the general functionality of the application.
 * It should be treated as a starting point replaced by more specific tests in future.
 */

import { cp, mkdtemp, readdir, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { basename, resolve } from 'node:path';
import { readFileSync } from 'node:fs';
import { cmd } from './cmd';

const samplesPath = resolve(__dirname, 'samples');
const tempPath = resolve(tmpdir(), 'envienc-test');

beforeAll(async () => {
  await mkdtemp(tempPath);
  await cp(samplesPath, tempPath, { recursive: true });
});

afterAll(() => rm(tempPath, { recursive: true }));

it('decrypts reference files', async () => {
  const result = await cmd(['decrypt', '**/.env*', '**/*.h', '**/*.yml'], {
    cwd: resolve(tempPath, 'encrypted'),
    env: { ENVIENC_PASSWORD: '1234' },
  });

  expect(result.error).toBeFalsy();

  const referencePath = resolve(samplesPath, 'references');
  const files = await readdir(referencePath);

  expect(
    files.every((file) => {
      const decrypted = readFileSync(resolve(tempPath, 'encrypted', file));
      const sample = readFileSync(resolve(referencePath, file));
      return decrypted.equals(sample);
    }),
  ).toBe(true);
});

it('initialize configuration file', async () => {
  const init = await cmd(['init'], {
    cwd: resolve(tempPath, 'references'),
  });

  expect(init.error).toBeFalsy();
  expect(
    readFileSync(resolve(tempPath, 'references', '.enviencrc')),
  ).toBeTruthy();
});

it('encrypts reference files', async () => {
  const result = await cmd(['encrypt', '**/.env*', '**/*.h', '**/*.yml'], {
    cwd: resolve(tempPath, 'references'),
    env: { ENVIENC_PASSWORD: '1234' },
  });

  expect(result.error).toBeFalsy();

  const encryptedPath = resolve(tempPath, 'references');
  const files = (await readdir(encryptedPath)).filter(
    (file) => basename(file) !== '.enviencrc',
  );

  const references = await readdir(resolve(samplesPath, 'references'));

  // We expect to have twice as many files as references: encrypted and decrypted
  expect(files.length).toBe(references.length * 2);
});

it('decrypts encrypted files', async () => {
  // Remove original plaintext files
  const referenceFiles = await readdir(resolve(samplesPath, 'references'));
  await Promise.all(
    referenceFiles.map((file) => rm(resolve(tempPath, 'references', file))),
  );

  const result = await cmd(['decrypt', '**/.env*', '**/*.h', '**/*.yml'], {
    cwd: resolve(tempPath, 'references'),
    env: { ENVIENC_PASSWORD: '1234' },
  });

  expect(result.error).toBeFalsy();

  const encryptedPath = resolve(tempPath, 'references');
  const files = (await readdir(encryptedPath)).filter(
    (file) => basename(file) !== '.enviencrc' && !file.endsWith('.envienc'),
  );

  // Check that decrypted files are the same as references
  expect(
    files.every((file) => {
      const decrypted = readFileSync(resolve(tempPath, 'references', file));
      const sample = readFileSync(resolve(samplesPath, 'references', file));
      return decrypted.equals(sample);
    }),
  ).toBe(true);
});

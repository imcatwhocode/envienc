import { join, resolve } from 'node:path';
import { findPlaintext, findEncrypted } from '../../src/glob';

const initialCwd = process.cwd();

test('enumerates plaintext .env in directory', () => {
  process.chdir(resolve(__dirname, 'dir'));

  const paths = findPlaintext(undefined, { absolute: false });
  process.chdir(initialCwd);

  expect(paths).toEqual([
    '.env',
    'foo/.env.prod',
    'foo/bar/.env.prod',
    'foo/bar/.env',
  ]);
});

test('enumerates encrypted .env in directory', () => {
  process.chdir(resolve(__dirname, 'dir'));

  const paths = findEncrypted(undefined, { absolute: false });
  process.chdir(initialCwd);

  expect(paths).toEqual([
    '.env.envienc',
    'foo/.env.prod.envienc',
    'foo/bar/.env.prod.envienc',
    'foo/bar/.env.envienc',
  ]);
});

test('enumerates custom .env globs correctly', () => {
  process.chdir(resolve(__dirname, 'dir'));

  expect(
    findPlaintext([join(__dirname, 'dir/.env')], { absolute: false }),
  ).toEqual(['.env']);
  expect(
    findPlaintext([join(__dirname, 'dir/.env.*')], { absolute: false }),
  ).toEqual([]);
  expect(
    findPlaintext([join(__dirname, 'dir/**/.env.*')], { absolute: false }),
  ).toEqual(['foo/.env.prod', 'foo/bar/.env.prod']);

  process.chdir(initialCwd);
});

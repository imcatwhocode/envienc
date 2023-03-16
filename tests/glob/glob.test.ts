import { join } from 'path';
import { findPlaintext, findEncrypted } from '../../src/glob';

test('enumerates plaintext .env in directory', () => {
  expect(findPlaintext().length).toEqual(4);

  const paths = findPlaintext(undefined, { absolute: false });
  expect(paths).toEqual([
    'tests/glob/dir/.env',
    'tests/glob/dir/foo/.env.prod',
    'tests/glob/dir/foo/bar/.env.prod',
    'tests/glob/dir/foo/bar/.env',
  ]);
});

test('enumerates encrypted .env in directory', () => {
  expect(findEncrypted().length).toEqual(4);

  const paths = findEncrypted(undefined, { absolute: false });
  expect(paths).toEqual([
    'tests/glob/dir/.env.envienc',
    'tests/glob/dir/foo/.env.prod.envienc',
    'tests/glob/dir/foo/bar/.env.prod.envienc',
    'tests/glob/dir/foo/bar/.env.envienc',
  ]);
});

test('enumerates custom .env globs correctly', () => {
  expect(
    findPlaintext([join(__dirname, 'dir/.env')], { absolute: false }),
  ).toEqual(['tests/glob/dir/.env']);
  expect(
    findPlaintext([join(__dirname, 'dir/.env.*')], { absolute: false }),
  ).toEqual([]);
  expect(
    findPlaintext([join(__dirname, 'dir/**/.env.*')], { absolute: false }),
  ).toEqual([
    'tests/glob/dir/foo/.env.prod',
    'tests/glob/dir/foo/bar/.env.prod',
  ]);
});

import { pseudoRandomBytes } from 'crypto';
import { encrypt, decrypt, deriveKey } from '../../src/encryption';

test('derives key correctly', () => {
  const password = 'foobar';
  const salt = '1234567890abcdef';
  const expectedKey = Buffer.from('893f9f5bd60a8ec7079041ccb6c4991cecd7cc66b6537ee269c7d41b62ab27d6', 'hex');
  expect(deriveKey(password, salt)).toEqual(expectedKey);
});

test('encrypts & decrypts correctly', () => {
  const password = pseudoRandomBytes(16).toString('base64');
  const salt = pseudoRandomBytes(16).toString('hex');
  const random = pseudoRandomBytes(64);
  const key = deriveKey(password, salt);

  const { ciphertext, iv, authTag } = encrypt(key, random);
  const plaintext = decrypt(key, ciphertext, iv, authTag);
  expect(plaintext).toEqual(random);
});

test('decrypts well known data correctly', () => {
  const plaintext = Buffer.from('Hello World', 'utf8');
  const password = 'foobar';
  const salt = '1234567890abcdef';

  const authTag = Buffer.from('c14a5c4d6d51e9ed019f7767ea8bd9db', 'hex');
  const iv = Buffer.from('2ee12d706422f279fc74bf2771ab1605', 'hex');
  const ciphertext = Buffer.from('74cabd9dd34e75a9e099b7', 'hex');

  const key = deriveKey(password, salt);
  const decrypted = decrypt(key, ciphertext, iv, authTag);
  expect(plaintext).toEqual(decrypted);
});

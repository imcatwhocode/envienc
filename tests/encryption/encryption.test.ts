import { pseudoRandomBytes } from 'crypto';
import { encrypt, decrypt, deriveKey } from '../../src/encryption';

test('derives key correctly', () => {
  const password = 'foobar';
  const salt = '1234567890abcdef';
  const expectedKey = Buffer.from('2f95a26c4fbf2b168839985c9f4542161901a0393e5b0a3dd5d03a2912bafead', 'hex');
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

  const authTag = Buffer.from('62b5290d5613c5077017cb99639345e3', 'hex');
  const iv = Buffer.from('49a5189f1859093d3a2d5a1fb17663af', 'hex');
  const ciphertext = Buffer.from('57d9df5f5f0ab80d590942', 'hex');

  const key = deriveKey(password, salt);
  const decrypted = decrypt(key, ciphertext, iv, authTag);
  expect(plaintext).toEqual(decrypted);
});

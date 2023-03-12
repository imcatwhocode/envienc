import { pseudoRandomBytes } from 'crypto';
import { Decoded, encode, decode } from '../../src/encoder';

const decoded: Decoded = {
  iv: pseudoRandomBytes(16),
  authTag: pseudoRandomBytes(16),
  ciphertext: pseudoRandomBytes(128),
};

const wellKnown = {
  encoded: 'dEAdbEeF:aaaabbbb:8BADf00d',
  decoded: {
    iv: Buffer.from('deadbeef', 'hex'),
    authTag: Buffer.from('aaaabbbb', 'hex'),
    ciphertext: Buffer.from('8badf00d', 'hex'),
  },
};

test('encodes & decodes correctly', () => {
  expect(decode(encode(decoded))).toStrictEqual(decoded);
});

test('decodes well-known string correctly', () => {
  expect(decode(wellKnown.encoded)).toStrictEqual(wellKnown.decoded);
});

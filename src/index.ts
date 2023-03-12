import { globSync } from 'glob';
import { readFileSync } from 'fs';
import { pbkdf2Sync } from 'crypto';

// /^[a-zA-Z_]{1,}[a-zA-Z0-9_]{0,}=(.*)$/m

// const globs = globSync('/tmp/aa/**/.env');
// const files = globs.map(path => readFileSync(path, 'utf-8'));

// const file = files[0];

// const replacer = (entireMatch: string, key: string, value: string, offset: number) => `${key}=[ENCRYPTED::${value.substring(0, 5)}]`;

// const f = file.replaceAll(/^([a-zA-Z_]{1,}[a-zA-Z0-9_]{0,})=(.*)$/gm, replacer);

// console.log(f);

console.log(pbkdf2Sync('foobar', '1234567890abcdef', 1000, 32, 'sha256').length);

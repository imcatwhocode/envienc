/* eslint-disable */
const { readFileSync, writeFileSync, chmodSync } = require('fs');
const { join } = require('path');

// Append shebang
const path = join(__dirname, '..', 'dest', 'index.js');
const contents = readFileSync(path, 'utf-8');
writeFileSync(path, `#!/usr/bin/env node\n${contents}`, 'utf-8');

// Set executable chmod
chmodSync(path, 0775);

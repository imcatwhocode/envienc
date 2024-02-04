const { readFileSync, writeFileSync, chmodSync } = require('node:fs');
const { join } = require('node:path');

// Append shebang
const path = join(__dirname, '..', 'dist', 'index.js');
const contents = readFileSync(path, 'utf-8');
writeFileSync(path, `#!/usr/bin/env node\n${contents}`, 'utf-8');

// Set executable chmod
chmodSync(path, 0o775);

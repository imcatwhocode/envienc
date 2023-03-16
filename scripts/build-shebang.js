/* eslint-disable */
const { readFileSync, writeFileSync } = require('fs');
const { join } = require('path');

const path = join(__dirname, '..', 'dest', 'index.js');
const contents = readFileSync(path, 'utf-8');
writeFileSync(path, `#!/usr/bin/env node\n${contents}`, 'utf-8');

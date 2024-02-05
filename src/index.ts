import { program } from 'commander';
import { initAction } from './actions/init';
import { encryptAction } from './actions/encrypt';
import { decryptAction } from './actions/decrypt';

program
  .name('envienc')
  .description(
    '🔐 Tool for configuration file encryption.\n' +
      'Encrypts only values, but not keys. Supports dotenv and YAML.\n' +
      "That's really everything you need to know.",
  );

program
  .command('init')
  .summary('Generates configuration file')
  .option('-g, --glob <glob...>', 'glob matching target files')
  .action(initAction);

program
  .command('encrypt')
  .summary('Encrypts configuration files')
  .argument(
    '[globs...]',
    'Globs to encrypt. If defined, globs from ".enviencrc" will be ignored',
  )
  .option(
    '-p, --password <password>',
    'Encryption password. Alternatively can be supplied via "ENVIENC_PWD" environment variable',
  )
  .option(
    '-e, --exclude [glob]',
    'Excluding glob. Files matched with this glob will be skipped',
  )
  .action(encryptAction);

program
  .command('decrypt')
  .summary('Decrypts configuration files')
  .argument(
    '[globs...]',
    'Globs to encrypt. If defined, globs from ".enviencrc" will be ignored',
  )
  .option(
    '-p, --password <password>',
    'Encryption password. Alternatively can be supplied via "ENVIENC_PWD" environment variable',
  )
  .option(
    '-e, --exclude [glob]',
    'Excluding glob. Files matched with this glob will be skipped',
  )
  .action(decryptAction);

program.parse();

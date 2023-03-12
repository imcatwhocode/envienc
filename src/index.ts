import { program } from 'commander';
import initAction from './actions/init';
import encryptAction from './actions/encrypt';

program
  .name('envienc')
  .description('🔐 Tool for dotenv values encryption');

program
  .command('init')
  .summary('Generates configuration file')
  .option('-g, --glob <glob...>', 'glob matching environment files')
  .action(initAction);

program
  .command('encrypt')
  .summary('Encrypts dotenv values')
  .argument('[globs...]', 'Globs to encrypt. If defined, globs from ".enviencrc" will be ignored')
  .option('-p, --password <password>', 'Encryption password. Alternatively can be supplied via "ENVIENC_PWD" environment variable')
  .option('-e, --exclude [glob]', 'Excluding glob. Files matched with this glob will be skipped')
  .action(encryptAction);

// program
//   .command('decrypt')
//   .description('Decrypts dotenv values')
//   .summary('Encrypts dotenv values')
//   .argument('[globs...]', 'Globs to encrypt. If defined, globs from ".enviencrc" will be ignored')
//   .option('-p, --password <password>', 'Encryption password. Alternatively can be supplied via "ENVIENC_PWD" environment variable')
//   .option('-e, --exclude [glob]', 'Excluding glob. Files matched with this glob will be skipped')
//   .action(decryptAction);

program.parse();

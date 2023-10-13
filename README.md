# envienc

Envienc is a command-line tool for encrypting dotenv and YAML files, while keeping keys,
comments, and overall structure untouched.

It encrypts only the values, leaving the rest of the file intact.

## Installation

You need to have Node.js installed on your system. Then, run the following command:

```bash
# Install envienc globally
npm install -g envienc

# ... or use npx to run it without installing
npx envienc

# ... or install it to your project and run it from there
cd your-project
npm install --save-dev envienc
npx envienc
```

## Quick start

```bash
# First, let's init a new project.
# This will create a .enviencrc file in your project root.
# Using "-g" flag, you can specify globs for dotenv and YAML files.
npx envienc init -g ".env" -g ".env.*" -g "deployments/*.yml"

# Then, add unencrypted files to .gitignore if applicable.
# This will prevent you from accidentally committing unencrypted files.
# Make sure that globs in .gitignore wouldn't match encrypted files with ".envienc" suffix

# Now you can encrypt your files.
npx envienc encrypt

# When you need to decrypt your files, run
npx envienc decrypt

# Help is here anytime you need it
npx envienc --help
```

## Encryption

Under the hood, envienc uses the AES-256-GCM algorithm to encrypt the values.

- To produce the encryption key, it uses the PBKDF2 algorithm with 600,000 iterations.
- Salt for PBKDF2 is generated using Node's built-in CSPRNG via the `crypto.randomBytes()` method.
  Salt is unique per project and stored in `.enviencrc` configuration file.
- Each encrypted value has its own unique IV and auth tag stored with ciphertext.

## Password input

You can provide the password in several ways. The order of precedence is as follows:

1. Using the `--password` option. Please, don't ever do this in production.
2. Using the `ENVIENC_PWD` environment variable.
3. Using the interactive prompt when encrypting or decrypting.

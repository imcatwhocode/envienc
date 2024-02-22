# envienc

Envienc is a command-line tool for encrypting dotenv, YAML and .h/.hpp files, while keeping keys,
comments, and overall structure untouched.

It encrypts only the values, leaving the rest of the file intact.

## Installation

You need to have Node.js installed on your system. Then, run the following commands:

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

## Exceptions

You can skip specific configuration entries from being encrypted.

Use `@envienc no-encrypt` comment:

## For dotenv

```dotenv
# @envienc no-encrypt
PUBLIC_INFO=This variable wouldn't be encrypted

# But this one would
MY_SECRET=hellokitty
```

## For YAML

```yaml
nested:
  - item1:
      # Flag below would prevent encryption of entire "item1" entry
      # @envienc no-encrypt
      key1: value1
      key2: value2
      subitems:
        - subitem1
        - subitem2
  # "item2" will be encrypted as expected
  - item2:
      keyA: valueA
      keyB: valueB

colors:
  red: '#FF0000'
  green: '#00FF00'
  # Flag below would prevent encryption only of "blue" entry
  blue: '#0000FF' # @envienc no-encrypt
  random:
    rgb: [
        128,
        # Flag below would prevent encryption only of "255" value
        255, # @envienc no-encrypt
        64,
      ]
    hex: '#FFFFFF'

# Entire "branding" entry will be kept unencrypted
# @envienc no-encrypt
branding:
  logo_uri: 'https://example.com/logo.png'
  name: 'My App'
  description: 'My App is a great app'
```

## For .H/.HPP

```c
// Will be encrypted
#define SECURE_STUFF "my_sweetest_secret"

// Will not be encrypted
#define NON_SECURE_STUFF /* @envienc no-encrypt */ "not_secret_at_all"
```

## Log

Envienc uses `pino` for logging. By default, output is prettified using `pino-pretty` package.
If you want to output logs in default JSON format, set `LOG_JSON` environment variable to `true`.

```bash
# This will output logs in Pino's default JSON format
LOG_JSON=true npx envienc encrypt
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
2. Using the `ENVIENC_PASSWORD` environment variable.
3. Using the interactive prompt when encrypting or decrypting.

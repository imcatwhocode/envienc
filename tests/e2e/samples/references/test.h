#ifdef MEOW
  #define TEST "SECRET This contents should be encrypted"
  #define TEST_ML "WARNING THIS IS SECRET" \
    "This content" \
    "should be encrypted"

  #define UNSEC /* @envienc no-encrypt */ "Plaintext stuff"
  #define UNSEC_ML /* @envienc no-encrypt */ "This content will be kept" \
    "...and this" \
    "...surely this one too"
#endif
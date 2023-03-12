import { Replacer, replaceValues } from '../../src/tokenizer';

const EMPTY = '';
const EMPTY_NEWLINES = '\n\n\n\n';

const SINGLE_VALUE = 'TEST=foo';
const SINGLE_VALUE_RESULT = 'TEST=[REPLACED]';

const MULTIPLE_VALUES = `TEST=foo

MEOW=bar
`;
const MULTIPLE_VALUES_RESULT = `TEST=[REPLACED]

MEOW=[REPLACED]
`;

const COMMENTS_ONLY = `
# Comment
# TEST=entry
`;

const MULTIPLE_VALUES_COMMENTS = `TEST=foo
# Meow Comment
FOO=barbarbar

# MYTHICAL=QUEST

# Grumpy
# Fox Jumps Over=The
ENV=kfope(!)#(@*)!)$_!@#!_@#)@_@!#::?/
QUEUE=123
`;

const MULTIPLE_VALUES_COMMENTS_RESULT = `TEST=[REPLACED]
# Meow Comment
FOO=[REPLACED]

# MYTHICAL=QUEST

# Grumpy
# Fox Jumps Over=The
ENV=[REPLACED]
QUEUE=[REPLACED]
`;

const replacer: Replacer = (match, key) => `${key}=[REPLACED]`;

test('handle empty dotenv correctly', () => {
  expect(replaceValues(EMPTY, replacer)).toEqual(EMPTY);
});

test('handle empty dotenv with newlines correctly', () => {
  expect(replaceValues(EMPTY_NEWLINES, replacer)).toEqual(EMPTY_NEWLINES);
});

test('handle dotenv with only comments correctly', () => {
  expect(replaceValues(COMMENTS_ONLY, replacer)).toEqual(COMMENTS_ONLY);
});

test('handle single value dotenv correctly', () => {
  expect(replaceValues(SINGLE_VALUE, replacer)).toEqual(SINGLE_VALUE_RESULT);
});

test('handle multiple values dotenv correctly', () => {
  expect(replaceValues(MULTIPLE_VALUES, replacer)).toEqual(MULTIPLE_VALUES_RESULT);
});

test('handle dotenv with multiple values and comments correctly', () => {
  expect(replaceValues(MULTIPLE_VALUES_COMMENTS, replacer))
    .toEqual(MULTIPLE_VALUES_COMMENTS_RESULT);
});

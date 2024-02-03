import { Parser } from '../types';
import dotenv from './dotenv';
import yaml from './yaml';
import cPreprocessor from './c-preprocessor';

/**
 * Simple heuristic to determine if a file is YAML-like.
 * Rules:
 * - Start with optional whitespace
 * - Have non-whitespace, non-hash characters before a colon
 * - Have a colon followed by whitespace and then any character
 */
const YAML_LIKE_REGEX = /^\s*[^#\s]+:\s*.+$/;

/**
 * Simple heuristic to determine if a file is dotenv-like
 */
const DOTENV_LIKE_REGEX = /^[A-Z_]+=.+$/gm;

/**
 * Simple heuristic to determine if a file is a c-preprocessor-like file
 */
const C_PREPROCESSOR_LIKE_REGEX = /^(\s*)#define/gm;

const getParserUsingHeuristics = (name: string, contents: string): Parser => {
  if (contents.match(YAML_LIKE_REGEX)) {
    return yaml;
  }

  if (contents.match(DOTENV_LIKE_REGEX)) {
    return dotenv;
  }

  if (contents.match(C_PREPROCESSOR_LIKE_REGEX)) {
    return cPreprocessor;
  }

  throw new Error(`Could not determine file type: ${name}`);
};

export function getParser(name: string, contents: string): Parser {
  // For encrypted files, drop the envienc extension and dive into recursion
  if (name.endsWith('.envienc')) {
    return getParser(name.split('.')
      .slice(0, -1)
      .join('.'), contents);
  }

  if (name.endsWith('.yml') || name.endsWith('.yaml')) {
    return yaml;
  }

  if (name.startsWith('.env')) {
    return dotenv;
  }

  if (name.endsWith('.h') || name.endsWith('.hpp') || name.endsWith('.h++')) {
    return cPreprocessor;
  }

  return getParserUsingHeuristics(name, contents);
}

export { getParserUsingHeuristics };

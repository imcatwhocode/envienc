import { Parser } from '../types';
import dotenv from './dotenv';
import yaml from './yaml';

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

const getParserUsingHeuristics = (name: string, contents: string): Parser => {
  if (contents.match(YAML_LIKE_REGEX)) {
    return yaml;
  }

  if (contents.match(DOTENV_LIKE_REGEX)) {
    return dotenv;
  }

  throw new Error(`Could not determine file type: ${name}`);
};

export default function getParser(name: string, contents: string): Parser {
  // For encrypted files, drop the envienc extension and dive into recursion
  if (name.endsWith('.envienc')) {
    return getParser(name.split('.').slice(0, -1).join('.'), contents);
  }

  if (name.endsWith('.yml') || name.endsWith('.yaml')) {
    return yaml;
  }

  if (name.startsWith('.env')) {
    return dotenv;
  }

  return getParserUsingHeuristics(name, contents);
}

import type { Document } from 'yaml';
import { parseDocument } from 'yaml';

/* eslint-disable-next-line @typescript-eslint/no-explicit-any -- we don't know input file structure, and don't really care about it */
export type Contents = any;

const parse = (
  content: string,
): Document.Parsed<Contents> | Document<Contents> =>
  parseDocument<Contents>(content);

const stringify = (
  document: Document.Parsed<Contents> | Document<Contents>,
): string => document.toString();

export { parse, stringify };

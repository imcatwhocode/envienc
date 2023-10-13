import { Document, parseDocument } from 'yaml';

/**
 * We don't know (and care) about the contents of the file, so we use `any`.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Contents = any;

const parse = (content: string) => parseDocument<Contents>(content);

const stringify = (
  document: Document.Parsed<Contents, true> | Document<Contents, true>,
) => document.toString();

export { parse, stringify };

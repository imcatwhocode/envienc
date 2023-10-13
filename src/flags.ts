import { ParserCommentOpts } from './types';
import { err } from './output';

/**
 * Parses comments with envienc flags
 * @param comments Comment lines, omitting the leading `#` or other language-specific markers
 * @returns Flags found in the comments
 */
export default function parseCommentFlags(
  ...comments: (string | undefined | null)[]
): ParserCommentOpts {
  const opts: ParserCommentOpts = {};

  comments
    .filter(a => typeof a === 'string' && a.length)
    .map(a => a.trim())
    .filter(a => a.startsWith('@envienc'))
    .forEach(entry => {
      const ruleset = entry.split(' ').slice(1);
      ruleset.forEach(rule => {
        switch (rule) {
          case 'no-encrypt':
            opts.noEncrypt = true;
            break;
          default:
            err('⚠️ Found unsupported comment flag:', rule);
            break;
        }
      });
    });

  return opts;
}

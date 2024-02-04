import type { ParserCommentOpts } from './types';
import { logger } from './output';

/**
 * Parses comments with envienc flags
 * @param comments - Comment lines, omitting the leading `#` or other language-specific markers
 * @returns Flags found in the comments
 */
export function parseCommentFlags(
  ...comments: (string | undefined | null)[]
): ParserCommentOpts {
  const opts: ParserCommentOpts = {};

  comments
    .filter((a): a is string => typeof a === 'string' && a.length > 0)
    .map((a) => a.trim())
    .filter((a) => a.startsWith('@envienc'))
    .forEach((entry) => {
      const ruleset = entry.split(' ').slice(1);
      ruleset.forEach((rule) => {
        switch (rule) {
          case 'no-encrypt':
            opts.noEncrypt = true;
            break;
          default:
            logger.error('Found unsupported comment flag:', rule);
            break;
        }
      });
    });

  return opts;
}

/**
 * Determines whether to skip a node based on its comments.
 * @param comments - Comments associated with the YAML node.
 * @returns Whether to skip the YAML node.
 */
export function shouldSkip(
  ...comments: (string | undefined | null)[]
): boolean {
  const flags = parseCommentFlags(...comments);
  return flags.noEncrypt ?? false;
}

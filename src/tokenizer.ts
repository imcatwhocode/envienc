/**
 * Generic dotenv values replacer
 */
export type Replacer = (entry: string, key: string, value: string) => string;

/**
 * Replaces dotenv values with Replacer function
 * @param text Input dotenv contents
 * @param replacer Values transformation function
 * @returns Dotenv with values replaced
 */
export function replaceValues(dotenv: string, replacer: Replacer): string {
  return dotenv.replaceAll(/^([a-zA-Z_]{1,}[a-zA-Z0-9_]{0,})=(.*)$/gm, replacer);
}

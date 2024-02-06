import type { ExecException, ExecOptions } from 'node:child_process';
import { exec } from 'node:child_process';
import { resolve } from 'node:path';

const executable = resolve(__dirname, '../../dist/index.js');

export interface CommandOutput {
  stdout: string;
  stderr: string;
  code: number;
  error?: ExecException;
}

export function cmd(
  args: string[],
  opts: ExecOptions = {},
): Promise<CommandOutput> {
  const command = `${process.execPath} ${executable} ${args.join(' ')}`;
  return new Promise((res) => {
    exec(
      command,
      opts,
      (error: ExecException | null, stdout: string, stderr: string) => {
        res({
          stdout,
          stderr,
          code: error?.code ?? 0,
          error: error ?? undefined,
        });
      },
    );
  });
}

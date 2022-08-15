import yargs from 'yargs';
import { logLong } from '../../lib/git/log';
import { graphite } from '../../lib/runner';

const args = {} as const;

export const command = 'long';
export const description =
  'Display a graph of the commit ancestry of all branches.';
export const builder = args;
export const aliases = ['l'];
export const canonical = 'log long';

type argsT = yargs.Arguments<yargs.InferredOptionTypes<typeof args>>;
export const handler = async (argv: argsT): Promise<void> => {
  return graphite(argv, canonical, async () => logLong());
};

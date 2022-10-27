import { ExecutorContext, getPackageManagerCommand } from '@nrwl/devkit';
import { getExecOutput, getProjectRoot, startGroup } from '@nx-tools/core';
import { GROUP_PREFIX } from '../../constants';
import { DeployExecutorSchema } from './schema';

export default async function run(options: DeployExecutorSchema, ctx: ExecutorContext): Promise<{ success: true }> {
  const cwd = getProjectRoot(ctx);
  const command = `${getPackageManagerCommand().exec} prisma migrate deploy`;
  const args = getArgs(options);

  startGroup('Deploying Database', GROUP_PREFIX);

  await getExecOutput(command, args, { cwd, ignoreReturnCode: true }).then((res) => {
    if (res.stderr.length > 0 && res.exitCode != 0) {
      throw new Error(`${res.stderr.trim() ?? 'unknown error'}`);
    }
  });

  return { success: true };
}

const getArgs = (options: DeployExecutorSchema): string[] => {
  const args = [];

  if (options?.schema) {
    args.push(`--schema=${options.schema}`);
  }

  return args;
};

import type { Hook } from '@oclif/core';
import { spawn, execSync } from 'child_process';
import { parseCardanoCliVersion } from '../utils/parsing';

const hook: Hook<'command_not_found'> = async function (options) {
  const argv = options.argv ?? [];
  // Commands (basically args that are not options) are joined into options.id, separated by ":"
  const command = options.id.split(':');
  const args = [...command, ...argv];

  // first run cardano-cli --version just to figure out if it is available
  let cardanoCliVersionOutput = '';
  try {
    cardanoCliVersionOutput = execSync('cardano-cli --version', {
      // won't show error message on fail
      stdio: 'pipe',
    }).toString();
  } catch (error) {
    // cardano-cli not available

    if (process.env.NODE_ENV === 'development') {
      // Shown only during development
      console.debug(`Cannot find cardano-cli binary.`, (error as Error).message);
    }

    // In case of error we need to show original command not found msg.
    // For some reason Oclif itself won't show it after defining this hook
    this.error(`Command ${args.join(' ')} not found in blockfrost-cardano-cli.`);
  }

  const version = parseCardanoCliVersion(cardanoCliVersionOutput);

  console.log(
    `Command ${args.join(
      ' ',
    )} not found in blockfrost-cardano-cli. Using installed cardano-cli version ${version.join(
      '.',
    )} instead.`,
  );

  // Looks like Oclif will wait until cardano-cli exits which is perfect
  spawn('cardano-cli', args, {
    stdio: 'inherit',
  });
};

export default hook;

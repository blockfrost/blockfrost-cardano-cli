import { BaseCommand } from '../BaseCommand';
import { stdout } from 'stdout-stderr';
import * as util from 'util';
import * as fs from 'fs';
import * as blockfrostService from '../../services/blockfrost';

import { stringify } from '../../utils/format';
import { TESTNET_MAGIC } from '../../constants';
import { ERROR } from '../../constants/errors';

export class TestCommand extends BaseCommand {
  prettyPrint = (data: any) => {
    console.log(data.payload);
  };

  doWork = async () => {
    const { flags } = await this.parse(TestCommand);
    return {
      payload: 'test complete',
      flags: flags,
    };
  };
}

export class TestClientCommand extends BaseCommand {
  doWork = async () => {
    const { flags } = await this.parse(TestCommand);
    const client = await this.getClient();
    const client2 = await this.getClient();
    const client3 = await this.getClient();
    return 'test complete';
  };
}

describe('BaseCommand', () => {
  const ORIGINAL_ENV = process.env;
  beforeEach(() => {
    jest.resetModules();
    process.env = { ...ORIGINAL_ENV };
  });

  afterAll(() => {
    process.env = ORIGINAL_ENV;
    jest.restoreAllMocks();
  });

  it('should prettyPrint response from doWork', async () => {
    stdout.start();
    await TestCommand.run([]);
    stdout.stop();
    expect(stdout.output.includes('test complete')).toBe(true);
  });

  it('should print raw response from doWork', async () => {
    stdout.start();

    await TestCommand.run(['--json']);

    stdout.stop();

    const output = stdout.output;
    expect(JSON.parse(output)).toMatchObject({
      payload: 'test complete',
    });
  });

  it('should save the response to --out-file', async () => {
    jest.spyOn(fs, 'writeFileSync').mockImplementation((path, data) => {});
    await TestCommand.run(['--out-file', 'filename']);
    expect(fs.writeFileSync).toHaveBeenCalledTimes(1);
    expect(fs.writeFileSync).toHaveBeenCalledWith(
      'filename',
      stringify({
        payload: 'test complete',
        flags: {
          'out-file': 'filename',
        },
      }),
    );
  });

  it('should set --testnet to true if --testnet-magic TESTNET_MAGIC is set', async () => {
    stdout.start();
    await TestCommand.run(['--json', '--testnet-magic', `${TESTNET_MAGIC}`]);
    stdout.stop();
    const output = stdout.output;

    expect(JSON.parse(output).flags.testnet).toBe(true);
  });

  it('should throw on unsupported testnet magic in --testnet-magic', async () => {
    expect(() => TestCommand.run(['--json', '--testnet-magic', '123'])).rejects.toHaveProperty(
      'message',
      ERROR.FLAG_UNSUPPORTED_TESTNET_MAGIC,
    );
  });

  it('should create only one BlockfrostApi instance', async () => {
    process.env.BLOCKFROST_PROJECT_ID_MAINNET = 'mainnet123';
    const spy = jest.spyOn(blockfrostService, 'createBlockfrostClient');
    await TestClientCommand.run([]);
    expect(spy).toHaveBeenCalledTimes(1);
    spy.mockRestore();
  });
});

describe('BaseCommand - 2nd part (runs in series)', () => {
  // process.env cant be isolated across tests running in parallel,
  // but we can put tests in another describe which is run only after previous is finished
  const ORIGINAL_ENV = process.env;
  beforeEach(() => {
    jest.resetModules();
    // reset process.env
    process.env = {};
  });

  afterAll(() => {
    process.env = ORIGINAL_ENV;
  });

  it('should print error when BLOCKFROST_PROJECT_ID_MAINNET is not set', async () => {
    expect(async () => await TestClientCommand.run([])).rejects.toHaveProperty(
      'message',
      util.format(ERROR.ENV_PROJECT_ID_NOT_SET, 'BLOCKFROST_PROJECT_ID_MAINNET'),
    );
    // workaround ReferenceError: You are trying to `import` a file after the Jest environment has been torn down
    await new Promise(resolve => setTimeout(() => resolve(true), 500));
  });

  it('should print error when BLOCKFROST_PROJECT_ID_TESTNET is not set', async () => {
    expect(async () => await TestClientCommand.run(['--testnet'])).rejects.toHaveProperty(
      'message',
      util.format(ERROR.ENV_PROJECT_ID_NOT_SET, 'BLOCKFROST_PROJECT_ID_TESTNET'),
    );
    // workaround ReferenceError: You are trying to `import` a file after the Jest environment has been torn down
    await new Promise(resolve => setTimeout(() => resolve(true), 500));
  });
});

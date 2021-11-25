import { Command, Config, Flags } from '@oclif/core';
import { ERROR } from '../constants/errors';
import { createBlockfrostClient } from '../services/blockfrost';
import { writeToFile } from '../utils/file';
import { stringify } from '../utils/format';
import { CommandDataType } from '../utils/types';
import { BlockFrostAPI, BlockfrostServerError } from '@blockfrost/blockfrost-js';

export abstract class BaseCommand extends Command {
  private client: BlockFrostAPI | null;
  // method that returns data to be printed. Called from run().
  abstract doWork(): Promise<any>;
  // each commands extends this class and can define additional flags
  // without scrict mode disabled calling parseBaseCommand from this class would fail because of unknown flags/arguments
  static strict = false;

  static flags = {
    // common flags
    help: Flags.help({ char: 'h' }),
    testnet: Flags.boolean({ char: 't', description: 'Cardano Testnet' }),
    json: Flags.boolean({ description: 'Always outputs json instead of pretty printed table' }),
    'out-file': Flags.string({
      description: 'Optional output file. Default is to write to stdout.',
    }),
  };

  constructor(argv: string[], config: Config) {
    // errors thrown from constructor won't be caught by catch method
    super(argv, config);
    this.client = null;
  }

  private async parseBaseCommand() {
    return this.parse(BaseCommand);
  }

  async getClient() {
    if (!this.client) {
      const { flags } = await this.parseBaseCommand();
      this.client = createBlockfrostClient(flags.testnet);
    }
    return this.client;
  }

  prettyPrint = (data: CommandDataType<typeof this.doWork>) => {
    this.log(stringify(data));
  };

  async toFile(data: any): Promise<void> {
    const { flags } = await this.parseBaseCommand();

    if (!flags['out-file']) {
      throw new Error(ERROR.FLAG_MISSING_OUT_FILE);
    }
    writeToFile(flags['out-file'], stringify(data));
  }

  async catch(err: Record<string, any>) {
    if (err instanceof BlockfrostServerError) {
      if (err.message.includes('Network token mismatch')) {
        // TODO: probably 2 env vars, one for mainnet, other one for testnet
        this.error(
          'Network token mismatch.\nUse --tesnet or check if environment variable BLOCKFROST_PROJECT_ID is set correctly.',
        );
      }
    }

    return super.catch(err);
  }

  run = async (): Promise<void> => {
    const { flags } = await this.parseBaseCommand();
    const result = await this.doWork();

    if (flags.json) {
      this.log(stringify(result));
    } else {
      this.prettyPrint(result);
    }

    if (flags['out-file']) {
      this.toFile(result);
    }
  };
}

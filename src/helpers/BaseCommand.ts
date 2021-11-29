import * as util from 'util';
import { Command, Config, Flags } from '@oclif/core';
import { BlockFrostAPI, BlockfrostServerError } from '@blockfrost/blockfrost-js';
import { ERROR } from '../constants/errors';
import { createBlockfrostClient } from '../services/blockfrost';
import { writeToFile } from '../utils/file';
import { stringify } from '../utils/format';
import { CommandDataType } from '../utils/types';
import { ENV_VAR_PROJECT_ID, TESTNET_MAGIC } from '../constants';

export abstract class BaseCommand extends Command {
  private client: BlockFrostAPI | null;
  // Method that returns data to be printed to stdout. Will be called from 'run' method.
  abstract doWork(): Promise<any>;
  // Each command extends this class and can define additional flags
  // without strict mode disabled calling 'parseBaseCommand' from within this class would fail because of unknown flags/arguments
  static strict = false;

  static flags = {
    // common flags
    help: Flags.help({ char: 'h' }),
    testnet: Flags.boolean({ char: 't', description: 'Cardano Testnet' }),
    'testnet-magic': Flags.integer({
      hidden: true,
      exclusive: ['testnet'],
    }), // --testnet magic 1097911063 should be a same as using --testnet
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

  private async handleTestnetMagic() {
    const { flags } = await this.parse(BaseCommand);
    // set flags.testnet based on testnet-magic flag if necessary
    const testnetMagic = flags['testnet-magic'];
    if (testnetMagic) {
      if (testnetMagic === TESTNET_MAGIC) {
        if (!flags.testnet) {
          // insert testnet flag and remove --testnet-magic TESTNET_MAGIC
          this.argv.push('--testnet');
          const magicIndex = this.argv.findIndex(a => a === '--testnet-magic');
          this.argv.splice(magicIndex, 2);
          // flags.testnet = true; // probably useless
        }
      } else {
        throw Error(ERROR.FLAG_UNSUPPORTED_TESTNET_MAGIC);
      }
    }
  }

  private async parseBaseCommand() {
    await this.handleTestnetMagic();
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
        const { flags } = await this.parseBaseCommand();
        const envVarName = flags.testnet ? ENV_VAR_PROJECT_ID.TESTNET : ENV_VAR_PROJECT_ID.MAINNET;
        this.error(
          util.format(
            'Network token mismatch.\nUse --tesnet for testnet network or check if environment variable %s is set correctly.',
            envVarName,
          ),
        );
      }
    }

    return super.catch(err);
  }

  run = async (): Promise<BaseCommand> => {
    const { flags } = await this.parseBaseCommand();
    const result = await this.doWork();

    if (flags.json) {
      this.log(stringify(result));
    } else {
      this.prettyPrint(result);
    }

    if (flags['out-file']) {
      await this.toFile(result);
    }
    return this;
  };
}

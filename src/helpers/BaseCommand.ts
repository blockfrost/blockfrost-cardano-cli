import { Command, Config, Flags } from '@oclif/core';
import { ERROR } from '../constants/errors';
import { createBlockfrostClient } from '../services/blockfrost';
import { writeToFile } from '../utils/file';
import { stringify } from '../utils/format';
import { CommandDataType } from '../utils/types';
import { BlockFrostAPI } from '@blockfrost/blockfrost-js';

// interface SubcommandOptions {
//   json?: boolean;
//   testnet?: boolean;
//   address?: string;
//   'tx-file'?: string;
//   'out-file'?: string;
//   'stake-pool-id'?: string;
// }

// interface CommonFlags {
//   json?: boolean;
//   testnet?: boolean;
//   'out-file'?: string;
// }
// interface BaseCommandFlags extends CommonFlags {
//   'stake-pool-id'?: string;
// }

export abstract class BaseCommand extends Command {
  client!: BlockFrostAPI;
  abstract doWork(): Promise<any>;

  static flags = {
    // common flags
    help: Flags.help({ char: 'h' }),
    testnet: Flags.boolean({ char: 't', description: 'Cardano Testnet' }),
    json: Flags.boolean({}),
    'out-file': Flags.string({
      description: 'Optional output file. Default is to write to stdout.',
    }),
    // query pool-parameters
    'stake-pool-id': Flags.string({ description: 'STAKE-POOL-ID' }),
    // query stake-address-info, utxo
    address: Flags.string({ char: 'a', description: 'address' }),
    // transaction submit
    'tx-file': Flags.string({
      char: 'f',
      description: 'Filepath of the transaction you intend to submit.',
    }),
  };

  constructor(argv: string[], config: Config) {
    super(argv, config);
    this.getClient();
  }

  private async getClient() {
    if (!this.client) {
      const { flags } = await this.parseBaseCommand();
      this.client = createBlockfrostClient(flags.testnet);
    }
    return this.client;
  }

  private async parseBaseCommand() {
    return this.parse(BaseCommand);
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

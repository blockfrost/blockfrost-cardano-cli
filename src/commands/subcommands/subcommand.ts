import Command from '@oclif/command';
import { IConfig } from '@oclif/config';
import { ERROR } from '../../constants/errors';
import { createBlockfrostClient } from '../../services/blockfrost';
import { writeToFile } from '../../utils/file';
import { stringify } from '../../utils/format';
import { CommandDataType } from '../../utils/types';

// This is a hacky implementation of git-like subcommands since oclif supports only ":"-delimited topics
// https://oclif.io/docs/topics
interface SubcommandOptions {
  json?: boolean;
  testnet?: boolean;
  address?: string;
  'tx-file'?: string;
}

export abstract class Subcommand extends Command {
  options: SubcommandOptions;
  client: ReturnType<typeof createBlockfrostClient>;
  abstract doWork(): Promise<any>;

  constructor(argv: string[], config: IConfig, options: SubcommandOptions) {
    super(argv, config);
    this.options = options;
    this.client = createBlockfrostClient(this.options.testnet);
  }

  prettyPrint = (data: CommandDataType<typeof this.doWork>) => {
    this.log(stringify(data));
  };

  toFile(data: any): void {
    if (!this.options['out-file']) {
      throw new Error(ERROR.FLAG_MISSING_OUT_FILE);
    }

    writeToFile(this.options['out-file'], stringify(data));
  }

  run = async (): Promise<void> => {
    const result = await this.doWork();

    if (this.options.json) {
      this.log(stringify(result));
    } else {
      this.prettyPrint(result);
    }

    if (this.options['out-file']) {
      this.toFile(result);
    }
  };
}

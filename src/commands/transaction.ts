import { Command, flags } from '@oclif/command';
import { Submit } from './subcommands/transaction/submit';

export default class Transaction extends Command {
  static description = 'submit a transaction to the blockchain';

  //   static examples = [
  //     `$ blockfrost-cardano-cli query
  // hello world from ./src/hello.ts!
  // `,
  //   ];

  static flags = {
    help: flags.help({ char: 'h' }),
    'tx-file': flags.string({
      char: 'f',
      description: 'Filepath of the transaction you intend to submit.',
    }),
    testnet: flags.boolean({ char: 't', description: 'Cardano Testnet' }),
    json: flags.boolean({}),
  };

  static args = [{ name: 'subcommand' }];
  static subcommmands = ['submit'];

  async run() {
    const { args, flags } = this.parse(Transaction);

    switch (args.subcommand) {
      case 'submit': {
        const subcmd = new Submit(this.argv, this.config, flags);
        return subcmd.run();
      }

      default:
        this.log(
          `Unknown subcommand. Available subcommands:\n ${Transaction.subcommmands.join('\n ')}`,
        );
    }
  }
}

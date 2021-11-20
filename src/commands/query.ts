import { Command, flags } from '@oclif/command';
import { PoolParams } from './subcommands/query/pool-params';
import { ProtocolParameters } from './subcommands/query/protocol-parameters';
import { StakeAddressInfo } from './subcommands/query/stake-address-info';
import { StakeDistribution } from './subcommands/query/stake-distribution';
import { StakePools } from './subcommands/query/stake-pools';
import { Tip } from './subcommands/query/tip';
import { Utxo } from './subcommands/query/utxo';

export default class Query extends Command {
  static description = 'query the Cardano Blockchain';

  //   static examples = [
  //     `$ blockfrost-cardano-cli query
  // hello world from ./src/hello.ts!
  // `,
  //   ];

  static flags = {
    help: flags.help({ char: 'h' }),
    address: flags.string({ char: 'a', description: 'address' }),
    testnet: flags.boolean({ char: 't', description: 'Cardano Testnet' }),
    json: flags.boolean({}),
    'out-file': flags.string({description: 'Optional output file. Default is to write to stdout.' }),
    'stake-pool-id': flags.string({description: 'STAKE-POOL-ID' }),
  };

  static args = [{ name: 'subcommand' }];
  static subcommmands = [
    'protocol-parameters',
    'tip',
    'stake-distribution',
    'stake-address-info',
    'utxo',
  ];

  async run() {
    const { args, flags } = this.parse(Query);

    switch (args.subcommand) {
      case 'tip': {
        const subcmd = new Tip(this.argv, this.config, flags);
        return subcmd.run();
      }

      case 'protocol-parameters': {
        const subcmd = new ProtocolParameters(this.argv, this.config, flags);
        return subcmd.run();
      }

      case 'stake-address-info': {
        const subcmd = new StakeAddressInfo(this.argv, this.config, flags);
        return subcmd.run();
      }

      case 'stake-distribution': {
        const subcmd = new StakeDistribution(this.argv, this.config, flags);
        return subcmd.run();
      }

      case 'utxo': {
        const subcmd = new Utxo(this.argv, this.config, flags);
        return subcmd.run();
      }

      case 'stake-pools': {
        const subcmd = new StakePools(this.argv, this.config, flags);
        return subcmd.run();
      }
      case 'pool-params': {
        const subcmd = new PoolParams(this.argv, this.config, flags);
        return subcmd.run();
      }

      default:
        this.log(`Unknown subcommand. Available subcommands:\n ${Query.subcommmands.join('\n ')}`);
    }
  }
}

import { Flags } from '@oclif/core';
import { stringToBigInt } from '../../utils/format';
import { BaseCommand } from '../../helpers/base-command';

// cardano-cli response
// [
//   {
//       "address": "stake_test1ur858q6wc5c04kzm3hgl2cc2405ulnh8c4kn7elnltpg4jcag92hz",
//       "rewardAccountBalance": 0,
//       "delegation": "pool1690l4lveymsl3af4n5ny7ggkcvp9mdnl6qyqas3r8y5k6lwenhk"
//   }
// ]

export class StakeAddressInfo extends BaseCommand {
  static flags = {
    ...BaseCommand.flags,
    address: Flags.string({ description: 'address', required: true }),
  };

  doWork = async () => {
    const { flags } = await this.parse(StakeAddressInfo);
    const client = await this.getClient();

    const account = await client.accounts(flags.address);
    const response = [
      {
        address: account.stake_address,
        rewardAccountBalance: stringToBigInt(account.withdrawable_amount),
        delegation: account.pool_id,
      },
    ];
    return response;
  };
}

import { ERROR } from '../../../constants/errors';
import { stringToBigInt } from '../../../utils/format';
import { Subcommand } from '../subcommand';

// cardano-cli response
// [
//   {
//       "address": "stake_test1ur858q6wc5c04kzm3hgl2cc2405ulnh8c4kn7elnltpg4jcag92hz",
//       "rewardAccountBalance": 0,
//       "delegation": "pool1690l4lveymsl3af4n5ny7ggkcvp9mdnl6qyqas3r8y5k6lwenhk"
//   }
// ]

export class StakeAddressInfo extends Subcommand {
  doWork = async () => {
    if (!this.options.address) {
      throw new Error(ERROR.FLAG_MISSING_ADDRESS);
    }
    const account = await this.client.accounts(this.options.address);
    const response = [{
      address: account.stake_address,
      rewardAccountBalance: stringToBigInt(account.withdrawable_amount), // verify?
      delegation: account.pool_id,
    }];
    return response;
  };
}

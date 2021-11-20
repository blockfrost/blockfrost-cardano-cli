import * as CardanoWasm from '@emurgo/cardano-serialization-lib-nodejs';
import { ERROR } from '../../../constants/errors';
import { stringToBigInt } from '../../../utils/format';
import { Subcommand } from '../subcommand';

// cardano-cli response
// {
//   "poolParams": {
//       "publicKey": "93df3363e855480c133c86951650c5a30ee4370d09d4c90c85e9dc06",
//       "cost": 450000000,
//       "metadata": {
//           "hash": "b7ca9e9f5a122ae0fcd1c66882c40a7ba59bddf37e93b0d56ab5a488d1a7887c",
//           "url": "https://bit.ly/3owXToG"
//       },
//       "vrf": "91b5d9f738c1c3a53ded97f40d7cb80e3258af5f11f3038be4f0d044a28f310f",
//       "owners": [
//           "40606ac48f449e0c0a8d78e159c3e12aae7db5d88fa91137ee9baf1f"
//       ],
//       "pledge": 300000000,
//       "rewardAccount": {
//           "network": "Testnet",
//           "credential": {
//               "key hash": "40606ac48f449e0c0a8d78e159c3e12aae7db5d88fa91137ee9baf1f"
//           }
//       },
//       "margin": 4.0e-2,
//       "relays": [
//           {
//               "single host address": {
//                   "IPv6": null,
//                   "port": 3001,
//                   "IPv4": "81.132.130.160"
//               }
//           }
//       ]
//   },
//   "futurePoolParams": null,
//   "retiring": null
// }

// {
//   "active_size": 0,
//   "active_stake": "0",
//   "blocks_minted": 0,
//   "declared_pledge": "300000000",
//   "fixed_cost": "450000000",
//   "hex": "93df3363e855480c133c86951650c5a30ee4370d09d4c90c85e9dc06",
//   "live_delegators": 1,
//   "live_pledge": "297636887",
//   "live_saturation": 0.0000035365548130069436,
//   "live_size": 1.942108500439328e-8,
//   "live_stake": "297636887",
//   "margin_cost": 0.04,
//   "owners": [
//       "stake_test1upqxq6ky3azfurq234uwzkwruy42uld4mz86jyfha6d678c6wdsfa"
//   ],
//   "pool_id": "pool1j00nxclg24yqcyeus623v5x95v8wgdcdp82vjry9a8wqv9dskru",
//   "registration": [
//       "2e3ea11bb1e930dae874d46f2a4109d14b7567ef934a16a4cdcc5162f1570497"
//   ],
//   "retirement": [],
//   "reward_account": "stake_test1upqxq6ky3azfurq234uwzkwruy42uld4mz86jyfha6d678c6wdsfa",
//   "vrf_key": "91b5d9f738c1c3a53ded97f40d7cb80e3258af5f11f3038be4f0d044a28f310f"
// }

export class PoolParams extends Subcommand {
  doWork = async () => {
    if (!this.options['stake-pool-id']) {
      throw new Error(ERROR.FLAG_MISSING_STAKE_POOL_ID);
    }
    const pool = await this.client.poolsById(this.options['stake-pool-id']);
    const metadata = await this.client.poolMetadata(this.options['stake-pool-id']);
    const relays = await this.client.poolsByIdRelays(this.options['stake-pool-id']);

    const addr = CardanoWasm.Address.from_bech32(pool.reward_account);
    const rewardAddr = CardanoWasm.RewardAddress.from_address(addr);
    const keyhashBytes = rewardAddr?.payment_cred().to_keyhash()?.to_bytes();
    if (!keyhashBytes) throw Error(`Invalid keyhash for ${pool.reward_account}`);
    let rewardAddrKeyHash = Buffer.from(keyhashBytes).toString('hex');

    console.log('hex', rewardAddrKeyHash);
    return {
      poolParams: {
        publicKey: pool.hex,
        cost: stringToBigInt(pool.fixed_cost),
        metadata: {
          hash: metadata.hash,
          url: metadata.url,
        },
        vrf: pool.vrf_key,
        owners: pool.owners.map(o => {
          const addr = CardanoWasm.Address.from_bech32(o);
          const rewardAddr = CardanoWasm.RewardAddress.from_address(addr);
          const keyhashBytes = rewardAddr?.payment_cred().to_keyhash()?.to_bytes();
          if (!keyhashBytes) throw Error(`Invalid keyhash for ${pool.reward_account}`);

          const keyHashHex = Buffer.from(keyhashBytes).toString('hex');
          return keyHashHex;
        }),
        pledge: stringToBigInt(pool.declared_pledge),
        rewardAccount: {
          network: pool.reward_account.startsWith('stake_test1') ? 'Testnet' : 'Mainnet',
          credential: {
            'key hash': rewardAddrKeyHash,
          },
        },
        margin: pool.margin_cost,
        relays: relays.map(r => ({
          'single host address': {
            IPv6: r.ipv6,
            port: r.port,
            IPv4: r.ipv4,
          },
        })),
      },
      futurePoolParams: null, // ?
      retiring: null, // ?
    };
  };
}

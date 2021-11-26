import { Flags } from '@oclif/core';
import {
  bech32ToHex,
  getNetworkFromRewardAccount,
  stringToBigInt,
  transformPoolRelays,
  transformPoolUpdateCert,
} from '../../utils/format';
import { Awaited } from '../../utils/types';
import { BaseCommand } from '../../helpers/BaseCommand';
import { ERROR } from '../../constants/errors';

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

// cardano-cli query pool-params --stake-pool-id 7a7da8ff324477745ba248ead217741cc69b0eee94ba2e536c368503 --testnet-magic 1097911063
// {
//     "poolParams": null,
//     "futurePoolParams": null,
//     "retiring": null
// }

export class PoolParams extends BaseCommand {
  static flags = {
    ...BaseCommand.flags,
    'stake-pool-id': Flags.string({ description: 'STAKE-POOL-ID', required: true }),
  };

  doWork = async () => {
    const { flags } = await this.parse(PoolParams);
    const client = await this.getClient();

    let retirementEpoch = null;
    let futurePoolParams = null;
    let updateCert: Awaited<ReturnType<typeof client.txsPoolUpdates>>[number] | null = null;

    const [latestEpoch, pool, metadata, relays, poolUpdates] = await Promise.all([
      client.epochsLatest(),
      client.poolsById(flags['stake-pool-id']),
      client.poolMetadata(flags['stake-pool-id']),
      client.poolsByIdRelays(flags['stake-pool-id']),
      client.poolsByIdUpdates(flags['stake-pool-id']),
    ]);

    // futurePoolParams from update cert
    if (poolUpdates.length > 0) {
      const maybeUpdateCerts = await client.txsPoolUpdates(
        poolUpdates[poolUpdates.length - 1].tx_hash,
      );
      updateCert = maybeUpdateCerts[maybeUpdateCerts.length - 1];
      if (updateCert && updateCert.active_epoch > latestEpoch.epoch) {
        futurePoolParams = transformPoolUpdateCert(pool.hex, updateCert);
      }
    }

    // retiring epoch
    const retirementTxhash = pool.retirement[pool.retirement.length - 1];
    const registrationTxHash = pool.registration[pool.registration.length - 1];
    if (retirementTxhash && registrationTxHash) {
      const [retirementTx, registrationTx] = await Promise.all([
        client.txs(retirementTxhash),
        client.txs(registrationTxHash),
      ]);

      if (
        (retirementTx.block_height === registrationTx.block_height &&
          retirementTx.index > registrationTx.index) ||
        retirementTx.block_height > registrationTx.block_height
      ) {
        const retirements = await client.txsPoolRetires(retirementTxhash);
        retirementEpoch = retirements[retirements.length - 1].retiring_epoch;
      }
    }

    const rewardAddrKeyHash = bech32ToHex(pool.reward_account, true);

    return {
      poolParams: {
        publicKey: pool.hex,
        cost: stringToBigInt(pool.fixed_cost),
        metadata: {
          hash: metadata.hash,
          url: metadata.url,
        },
        vrf: pool.vrf_key,
        owners: pool.owners.map(o => bech32ToHex(o, true)),
        pledge: stringToBigInt(pool.declared_pledge),
        rewardAccount: {
          network: getNetworkFromRewardAccount(pool.reward_account),
          credential: {
            'key hash': rewardAddrKeyHash,
          },
        },
        margin: pool.margin_cost,
        relays: transformPoolRelays(relays),
      },
      futurePoolParams,
      retiring: retirementEpoch,
    };
  };
}

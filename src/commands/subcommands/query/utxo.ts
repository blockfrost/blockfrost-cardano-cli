/* eslint-disable camelcase */
import { Responses } from '@blockfrost/blockfrost-js';
import { cli } from 'cli-ux';
import { ERROR } from '../../../constants/errors';
import { assetsToPolicies, parseAsset } from '../../../utils/parsing';
import { Subcommand } from '../subcommand';

// cardano-cli response
// TxHash                                 TxIx        Amount
// --------------------------------------------------------------------------------------
// 5d78b544e73b691dd4d6a35fc951b05d6f411499a94362ba85851987d6911976     1        2732158602 lovelace + TxOutDatumNone

// TxHash                                 TxIx        Amount
// --------------------------------------------------------------------------------------
// 6f1b5b3a27cca7ab18eb2c1331520c8a39115bb9e952c7ab3b5a969db6aeb2b4     0        1500000 lovelace + 20 4ef8525f365560af6b685169cac4c86acdd122d683d3400f6ca23467.0504030201 + TxOutDatumNone
// ae03bfd7b583392884b6b5a76481d7e5e9ea7c232d0d27475c58fb4c8c3e6146     1        345047752 lovelace + 5 2e2f143b3ccbe339145183dc2a799a469e92ab56e0d5b0bd04f54f15.48616c6c6f + 30 34250edd1e9836f5378702fbf9416b709bc140e04f668cc355208518 + 39000 34250edd1e9836f5378702fbf9416b709bc140e04f668cc355208518.414441 + 6370 34250edd1e9836f5378702fbf9416b709bc140e04f668cc355208518.4154414441636f696e + 5000 34250edd1e9836f5378702fbf9416b709bc140e04f668cc355208518.4861707079414441 + 18 34250edd1e9836f5378702fbf9416b709bc140e04f668cc355208518.5465737431 + 20 34250edd1e9836f5378702fbf9416b709bc140e04f668cc355208518.5465737432 + 10 34250edd1e9836f5378702fbf9416b709bc140e04f668cc355208518.5465737433 + 1000 4ef8525f365560af6b685169cac4c86acdd122d683d3400f6ca23467.0001020304 + 980 4ef8525f365560af6b685169cac4c86acdd122d683d3400f6ca23467.0504030201 + 27 9c3f26285634740a52c31e5fcd0686fe51a0acb2dbcd9e565d96b736 + 15 ecd07b4ef62f37a68d145de8efd60c53d288dd5ffc641215120cc3db + TxOutDatumNone

// --out-file
// {
//   "17990929a7f143d9ab7a7390522e7ba6689d3c5770e77b3eebc9c3098c6d9dab#0": {
//       "address": "addr_test1qpjputy7h5crx67ddqq0mctfq65anqr8c5slkv4h38lkkd8r4mmzqnk963v2ctk5es6dt34tqk5l6lxchkup0mnfzdesglvywz",
//       "value": {
//           "1cdf9d5eefbc56128137129afc692145783402a3def7bb27da4028a7": {
//               "434f494e": 5000000
//           },
//           "lovelace": 4000000
//       }
//   },
//   "fd38ad68a6216125ffc0ecb46a49c9d4f95d105218a1ec5de9d57df7fe23141d#0": {
//       "address": "addr_test1qpjputy7h5crx67ddqq0mctfq65anqr8c5slkv4h38lkkd8r4mmzqnk963v2ctk5es6dt34tqk5l6lxchkup0mnfzdesglvywz",
//       "value": {
//           "1cdf9d5eefbc56128137129afc692145783402a3def7bb27da4028a7": {
//               "434f494e": 10000000
//           },
//           "lovelace": 2000000
//       }
//   },
//   "de5132133cdb2d3db05382cecd9df84a6e428760209f703c89e561850c095c00#0": {
//       "address": "addr_test1qpjputy7h5crx67ddqq0mctfq65anqr8c5slkv4h38lkkd8r4mmzqnk963v2ctk5es6dt34tqk5l6lxchkup0mnfzdesglvywz",
//       "value": {
//           "1cdf9d5eefbc56128137129afc692145783402a3def7bb27da4028a7": {
//               "434f494e": 5000000
//           },
//           "lovelace": 3000000
//       }
//   }
// }

// blockfrost-cli response
// TxHash                                                           TxIx   Amount
// ──────────────────────────────────────────────────────────────── ────── ────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
// 6f1b5b3a27cca7ab18eb2c1331520c8a39115bb9e952c7ab3b5a969db6aeb2b4 0      1500000 lovelace + 20 4ef8525f365560af6b685169cac4c86acdd122d683d3400f6ca23467.0504030201
// ae03bfd7b583392884b6b5a76481d7e5e9ea7c232d0d27475c58fb4c8c3e6146 1      345047752 lovelace + 5 2e2f143b3ccbe339145183dc2a799a469e92ab56e0d5b0bd04f54f15.48616c6c6f + 30 34250edd1e9836f5378702fbf9416b709bc140e04f668cc355208518 + 39000 34250edd1e9836f5378702fbf9416b709bc140e04f668cc355208518.414441 + 6370 34250edd1e9836f5378702fbf9416b709bc140e04f668cc355208518.4154414441636f696e + 5000 34250edd1e9836f5378702fbf9416b709bc140e04f668cc355208518.4861707079414441 + 18 34250edd1e9836f5378702fbf9416b709bc140e04f668cc355208518.5465737431 + 20 34250edd1e9836f5378702fbf9416b709bc140e04f668cc355208518.5465737432 + 10 34250edd1e9836f5378702fbf9416b709bc140e04f668cc355208518.5465737433 + 1000 4ef8525f365560af6b685169cac4c86acdd122d683d3400f6ca23467.0001020304 + 980 4ef8525f365560af6b685169cac4c86acdd122d683d3400f6ca23467.0504030201 + 27 9c3f26285634740a52c31e5fcd0686fe51a0acb2dbcd9e565d96b736 + 15 ecd07b4ef62f37a68d145de8efd60c53d288dd5ffc641215120cc3db


type Data = {address: string; utxo: Responses['address_utxo_content']}
export class Utxo extends Subcommand {
  prettyPrint = (res: Data) => {
    this.log();
    cli.table(
      res.utxo,
      {
        tx_hash: {
          header: 'TxHash',
          minWidth: 30,
        },
        tx_index: {
          header: 'TxIx',
          minWidth: 7,
        },
        amount: {
          header: 'Amount',
          get: row =>
            row.amount
              .map(a => {
                const { policyId, assetName } = parseAsset(a.unit);
                return `${a.quantity} ${policyId}${assetName ? `.${assetName}` : ''}`;
              })
              .join(' + '),
        },
      },
      { printLine: this.log, 'no-truncate': true },
    );
    this.log();
  };

  toFile(res: Data): void {
    const dumpObj: {
      [k: string]: { address: string; value: ReturnType<typeof assetsToPolicies> };
    } = {};
    res.utxo.forEach(u => {
      dumpObj[u.tx_hash] = {
        address: res.address,
        value: assetsToPolicies(u.amount),
      };
    });
    super.toFile(dumpObj);
  };

  doWork = async (): Promise<Data> => {
    if (!this.options.address) {
      throw new Error(ERROR.FLAG_MISSING_ADDRESS);
    }
    const address = this.options.address;
    const utxo = await this.client.addressesUtxosAll(address, { order: 'desc' });

    return {
      utxo,
      address,
    };
  };
}

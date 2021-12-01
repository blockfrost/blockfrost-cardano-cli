/* eslint-disable camelcase */
import * as fs from 'fs';
import { stdout } from 'stdout-stderr';
import * as blockfrostService from '../../../services/blockfrost';
import { stringify } from '../../../utils/format';
import { Utxo } from '../utxo';

const address =
  'addr_test1qrdx08c0mexd5y0pn3ug0j9k2z2myneqcl7xq7yap8hzl5hdc55q34v2ggxw9hea4rr3rry933a2zdh60v43h237s8ksdhw5yh';
const utxos = [
  {
    tx_hash: '284939d755a0e4545120a16b8b7b819c4623c1ee9d37c188ee0d8f3ad352e251',
    tx_index: 0,
    output_index: 0,
    amount: [
      {
        unit: 'lovelace',
        quantity: '1000000',
      },
      {
        unit: '1cdf9d5eefbc56128137129afc692145783402a3def7bb27da4028a7434f494e',
        quantity: '2',
      },
      {
        unit: '1cdf9d5eefbc56128137129afc692145783402a3def7bb27da4028a7434f494f',
        quantity: '3',
      },
    ],
    block: '15580d878bca7a8d13254dd1d056303299f007f9a0b74a42418b7a73d29ca3a3',
    data_hash: null,
  },
];

let mockedAdressesUtxosAll: any;
describe('query utxo', () => {
  beforeEach(() => {
    mockedAdressesUtxosAll = jest.fn((_address: string) => {
      return utxos;
    });

    jest
      .spyOn(blockfrostService, 'createBlockfrostClient')
      // @ts-ignore partial mock
      .mockImplementation((_testnet?: boolean) => {
        return {
          addressesUtxosAll: mockedAdressesUtxosAll,
        };
      });
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should print raw response', async () => {
    stdout.start();
    await Utxo.run(['--address', address, '--json']);
    stdout.stop();

    expect(mockedAdressesUtxosAll).toHaveBeenCalledTimes(1);

    const output = stdout.output;
    expect(JSON.parse(output)).toMatchObject({
      utxo: utxos,
      address: address,
    });
    jest.resetAllMocks();
  });

  it('should print pretty response', async () => {
    stdout.start();
    await Utxo.run(['--address', address]);
    stdout.stop();

    expect(mockedAdressesUtxosAll).toHaveBeenCalledTimes(1);

    const output = stdout.output;
    expect(output).toMatchSnapshot();
    jest.resetAllMocks();
  });

  it('should save the response to --out-file', async () => {
    jest.spyOn(fs, 'writeFileSync').mockImplementation((_path, _data) => {
      // do nothing
    });
    await Utxo.run(['--address', address, '--out-file', 'filename']);
    expect(fs.writeFileSync).toHaveBeenCalledTimes(1);

    // could be replaced with expect(fs.writeFileSync).toMatchSnapshot() if we find it too verbose
    expect(fs.writeFileSync).toHaveBeenLastCalledWith(
      'filename',
      stringify({
        '284939d755a0e4545120a16b8b7b819c4623c1ee9d37c188ee0d8f3ad352e251': {
          address:
            'addr_test1qrdx08c0mexd5y0pn3ug0j9k2z2myneqcl7xq7yap8hzl5hdc55q34v2ggxw9hea4rr3rry933a2zdh60v43h237s8ksdhw5yh',
          value: {
            lovelace: 1000000,
            '1cdf9d5eefbc56128137129afc692145783402a3def7bb27da4028a7': {
              '434f494e': 2,
              '434f494f': 3,
            },
          },
        },
      }),
    );
  });
});

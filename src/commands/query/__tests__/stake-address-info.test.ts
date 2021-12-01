/* eslint-disable camelcase */
import { stdout } from 'stdout-stderr';
import * as blockfrostService from '../../../services/blockfrost';
import { StakeAddressInfo } from '../stake-address-info';

describe('query stake-address-info', () => {
  it('should print stake-address-info', async () => {
    const fakeAccount = {
      stake_address: 'stake1uyfz49rtntfa9h0s98f6s28sg69weemgjhc4e8hm66d5yacalmqha',
      active: true,
      active_epoch: 224,
      controlled_amount: '40',
      rewards_sum: '82472',
      withdrawals_sum: '82432',
      reserves_sum: '0',
      treasury_sum: '0',
      withdrawable_amount: '40',
      pool_id: 'pool1c89d4drtwn0048mekkdkzllz559ahnntxelyw2mppxnmc36hjlx',
    };

    const mockedAccounts = jest.fn((_address: string) => {
      return fakeAccount;
    });

    jest
      .spyOn(blockfrostService, 'createBlockfrostClient')
      // @ts-ignore partial mock
      .mockImplementation((_testnet?: boolean) => {
        return {
          accounts: mockedAccounts,
        };
      });
    stdout.start();
    await StakeAddressInfo.run([
      '--address',
      'stake1uyfz49rtntfa9h0s98f6s28sg69weemgjhc4e8hm66d5yacalmqha',
    ]);
    stdout.stop();

    expect(mockedAccounts).toHaveBeenCalledTimes(1);

    const output = stdout.output;
    expect(JSON.parse(output)).toMatchObject([
      {
        address: 'stake1uyfz49rtntfa9h0s98f6s28sg69weemgjhc4e8hm66d5yacalmqha',
        rewardAccountBalance: 40,
        delegation: 'pool1c89d4drtwn0048mekkdkzllz559ahnntxelyw2mppxnmc36hjlx',
      },
    ]);
    jest.resetAllMocks();
  });
});

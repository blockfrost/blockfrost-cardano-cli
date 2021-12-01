import { stdout } from 'stdout-stderr';
import * as blockfrostService from '../../../services/blockfrost';
import { StakePools } from '../stake-pools';

describe('query tip', () => {
  it('should print latest block', async () => {
    const fakePools = [
      'pool1qqyjr9pcrv97gwrueunug829fs5znw6p2wxft3fvqkgu5f4qlrg',
      'pool1qqfnw2fwajdnam7xsqhhrje5cgd8jcltzfrx655rd23eqlxjfef',
      'pool1qquwwu6680fr72y4779r2kpc7mxtch8rp2uhuqcc7v9p6q4f7ph',
      'pool1qptl80vq84xm28pt3t2lhpfzqag28csjhktxz5k6a74n260clmt',
    ];

    const mockedPoolsAll = jest.fn(() => {
      return fakePools;
    });

    jest
      .spyOn(blockfrostService, 'createBlockfrostClient')
      // @ts-ignore partial mock
      .mockImplementation((_testnet?: boolean) => {
        return {
          poolsAll: mockedPoolsAll,
        };
      });
    stdout.start();
    await StakePools.run([]);
    stdout.stop();

    expect(mockedPoolsAll).toHaveBeenCalledTimes(1);

    const output = stdout.output;
    expect(output).toBe(`${fakePools.join('\n')}\n`);
    jest.resetAllMocks();
  });
});

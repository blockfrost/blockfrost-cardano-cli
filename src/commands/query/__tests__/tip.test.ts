import * as path from 'path';
import { stdout } from 'stdout-stderr';
import * as blockfrostService from '../../../services/blockfrost';
import { Tip } from '../tip';

describe('query tip', () => {
  it('should print latest block', async () => {
    const fakeBlock = {
      epoch: 169,
      hash: '20e300831de50acf6a07d8df023454381d5eb3e6fdf93f9f8f694ae0db355355',
      slot: 43037061,
      height: 3088166,
    };

    const mockedBlocksLatest = jest.fn(() => {
      return fakeBlock;
    });

    jest
      .spyOn(blockfrostService, 'createBlockfrostClient')
      // @ts-ignore partial mock
      .mockImplementation((testnet?: boolean) => {
        return {
          blocksLatest: mockedBlocksLatest,
        };
      });
    stdout.start();
    await Tip.run([]);
    stdout.stop();

    expect(mockedBlocksLatest).toHaveBeenCalledTimes(1);

    const output = stdout.output;
    expect(JSON.parse(output)).toMatchObject({
      epoch: fakeBlock.epoch,
      hash: fakeBlock.hash,
      slot: fakeBlock.slot,
      block: fakeBlock.height,
      era: 'Alonzo',
      syncProgress: '100.00',
    });
    jest.resetAllMocks();
  });
});

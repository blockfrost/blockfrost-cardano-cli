import * as path from 'path';
import { stdout } from 'stdout-stderr';
import * as blockfrostService from '../../../services/blockfrost';
import { Submit } from '../submit';

describe('transaction submit', () => {
  it('should read tx from file and submit it via client.txSubmit', async () => {
    const files = ['txFile1', 'txFile2'];
    for (let i = 0; i < files.length; i++) {
      const filename = path.join(__dirname, `../__fixtures__/${files[i]}`);
      const mockedTxSubmit = jest.fn((tx: any) => {
        return 'txHash';
      });
      // Mocking fs breaks test. for now using real files from __fixtures__ folder
      // TypeError: The "code" argument must be of type string. Received undefined
      // const readFileSyncMock = jest.spyOn(fs, 'readFileSync');
      jest
        .spyOn(blockfrostService, 'createBlockfrostClient')
        // @ts-ignore partial mock
        .mockImplementation((testnet?: boolean) => {
          return {
            txSubmit: mockedTxSubmit,
          };
        });
      stdout.start();
      await Submit.run(['--tx-file', filename]);
      stdout.stop();

      // read file
      // expect(readFileSyncMock).toHaveBeenCalledTimes(1);
      // expect(readFileSyncMock).toHaveBeenCalledWith(filename, 'utf-8');

      // call txSubmit
      expect(mockedTxSubmit).toHaveBeenCalledTimes(1);
      expect(mockedTxSubmit).toHaveBeenCalledWith('testtransaction');

      const output = stdout.output.split('\n');
      expect(output[0]).toBe('Transaction successfully submitted.');
      jest.resetAllMocks();
    }
  });
});

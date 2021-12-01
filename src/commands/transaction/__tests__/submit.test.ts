import { BlockFrostAPI } from '@blockfrost/blockfrost-js';
import * as path from 'path';
import * as nock from 'nock';
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

  it('should read tx from file and throw after pushing the tx', async () => {
    jest.restoreAllMocks(); // restores createBlockfrostClient if mocked from other tests

    jest
      .spyOn(blockfrostService, 'createBlockfrostClient')
      .mockImplementation((testnet?: boolean) => {
        // omit check for missing env variable for project id
        return new BlockFrostAPI({
          projectId: 'testnet123',
          isTestnet: Boolean(testnet),
        });
      });

    nock('https://cardano-testnet.blockfrost.io:443', { encodedQueryParams: true })
      .post('/api/v0/tx/submit')
      .reply(
        400,
        {
          error: 'Bad Request',
          message:
            '"transaction read error RawCborDecodeError [DecoderErrorDeserialiseFailure \\"Byron Tx\\" (DeserialiseFailure 0 \\"end of input\\"),DecoderErrorDeserialiseFailure \\"Shelley Tx\\" (DeserialiseFailure 0 \\"end of input\\"),DecoderErrorDeserialiseFailure \\"Shelley Tx\\" (DeserialiseFailure 0 \\"end of input\\"),DecoderErrorDeserialiseFailure \\"Shelley Tx\\" (DeserialiseFailure 0 \\"end of input\\"),DecoderErrorDeserialiseFailure \\"Shelley Tx\\" (DeserialiseFailure 0 \\"end of input\\")]"',
          status_code: 400,
        },
        [
          'Date',
          'Wed, 01 Dec 2021 10:14:37 GMT',
          'Content-Type',
          'application/octet-stream',
          'Transfer-Encoding',
          'chunked',
          'Connection',
          'close',
          'vary',
          'Origin',
          'access-control-allow-origin',
          '*',
          'cf-cache-status',
          'DYNAMIC',
          'expect-ct',
          'max-age=604800, report-uri="https://report-uri.cloudflare.com/cdn-cgi/beacon/expect-ct"',
          'report-to',
          '{"endpoints":[{"url":"https:\\/\\/a.nel.cloudflare.com\\/report\\/v3?s=KqrAxNfliO9QMiBxu62YRXHh%2BoiZaqhhQgjC3dPWNE%2F9rKzEwAW%2FkIVIiDxU9YcxMVvq2LkSF88TS%2BBZSqF6lZPoNyw3WE9Q1ga4hOv0mjMThp1HA%2FMHPbyKf2D5gDIBH6HnSYFYqezUjGqFnBLxc7P6j6zQXg%3D%3D"}],"group":"cf-nel","max_age":604800}',
          'nel',
          '{"success_fraction":0,"report_to":"cf-nel","max_age":604800}',
          'Server',
          'cloudflare',
          'CF-RAY',
          '6b6b8cb13ba8278c-PRG',
        ],
      );

    // Mocking fs breaks test. for now using real files from __fixtures__ folder
    // TypeError: The "code" argument must be of type string. Received undefined
    // const readFileSyncMock = jest.spyOn(fs, 'readFileSync');
    const filename = path.join(__dirname, `../__fixtures__/txFile1`);

    stdout.start();
    // nock.recorder.rec();
    expect(
      async () => await Submit.run(['--testnet', '--tx-file', filename]),
    ).rejects.toHaveProperty(
      'message',
      'Command failed: transaction read error RawCborDecodeError [DecoderErrorDeserialiseFailure \\"Byron Tx\\" (DeserialiseFailure 0 \\"end of input\\"),DecoderErrorDeserialiseFailure \\"Shelley Tx\\" (DeserialiseFailure 0 \\"end of input\\"),DecoderErrorDeserialiseFailure \\"Shelley Tx\\" (DeserialiseFailure 0 \\"end of input\\"),DecoderErrorDeserialiseFailure \\"Shelley Tx\\" (DeserialiseFailure 0 \\"end of input\\"),DecoderErrorDeserialiseFailure \\"Shelley Tx\\" (DeserialiseFailure 0 \\"end of input\\")]',
    );
    // nock.restore();
    stdout.stop();

    const output = stdout.output;
    expect(output.includes('Transaction successfully submitted')).toBe(false);
    // workaround ReferenceError: You are trying to `import` a file after the Jest environment has been torn down
    await new Promise(resolve => setTimeout(() => resolve(true), 500));
  });
});

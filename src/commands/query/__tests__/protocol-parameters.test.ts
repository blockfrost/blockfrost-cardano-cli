import { BlockFrostAPI } from '@blockfrost/blockfrost-js';
import { stdout } from 'stdout-stderr';
import * as nock from 'nock';
import { ProtocolParameters } from '../protocol-parameters';
import * as blockfrostService from '../../../services/blockfrost';

describe('query protocol-parameters', () => {
  beforeEach(() => {
    jest
      .spyOn(blockfrostService, 'createBlockfrostClient')
      .mockImplementation((testnet?: boolean) => {
        // omit check for missing env variable for project id
        return new BlockFrostAPI({
          projectId: 'testnet123',
          isTestnet: Boolean(testnet),
        });
      });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });
  it('should print protocol parameters', async () => {
    nock('https://cardano-testnet.blockfrost.io:443', { encodedQueryParams: true })
      .get('/api/v0/epochs/latest')
      .reply(
        200,
        [
          '1f8b080000000000000364cb5b0ac2301046e1bdfccf79c84c93c9349b2935462c5e5adaa908e2de4545047dfd0ee7863a8d658f4c891c16eb67eb6c385564922669222171a8e7ed57b5f1cd4b77c3bc58b7398ee5f0fba8c3b1ff8fcaea95bdc3dbcbb89e0d9958223bd8f5031ab4158771b56935641033b7c23144afc9b76d82c3aed605192cec8934854070e88b0d97da2dd61feaf30b51223712c993b2b0e2fe000000ffff03009ccf1ea6f0000000',
        ],
        [
          'Date',
          'Tue, 30 Nov 2021 14:01:08 GMT',
          'Content-Type',
          'application/json; charset=utf-8',
          'Transfer-Encoding',
          'chunked',
          'Connection',
          'close',
          'vary',
          'Origin',
          'access-control-allow-origin',
          '*',
          'CF-Cache-Status',
          'DYNAMIC',
          'Expect-CT',
          'max-age=604800, report-uri="https://report-uri.cloudflare.com/cdn-cgi/beacon/expect-ct"',
          'Report-To',
          '{"endpoints":[{"url":"https:\\/\\/a.nel.cloudflare.com\\/report\\/v3?s=K2cfsyngRUL%2BV1IpjhdEp66qcrMUXSGB2pbgGXKE493jTsZpi9QnTDQRTs7JUg6TvODY%2FeyR6qh9cZjTbZQ9U%2B%2FBPJ3hoLl%2BnFuAzlnBqygHzGEJxfHvIxPO3gP5qa817RLv1XYEiZTM%2BTn49Y6Q"}],"group":"cf-nel","max_age":604800}',
          'NEL',
          '{"success_fraction":0,"report_to":"cf-nel","max_age":604800}',
          'Server',
          'cloudflare',
          'CF-RAY',
          '6b649b211f8a412c-PRG',
          'Content-Encoding',
          'gzip',
        ],
      );

    nock('https://cardano-testnet.blockfrost.io:443', { encodedQueryParams: true })
      .get('/api/v0/epochs/171/parameters')
      .reply(
        200,
        [
          '1f8b080000000000000374525b8ee4200cbc8bbfd1cabc920c97413471d4d92180083d9399d1de7d45d28f48abe5cb54952d5cc50f504efe0a86f79cc132473b11590746a9d7f502866b2d87a6709bbd84e4dfed3a7f13985ef66238e0badd31dec9419da55772239507cb1119bcd3971d29a775ae6040e07e80414e299c088df8a4c82e6e03c30706d1a65cc1e836c92118fc2519946b6a15a26450ddadd582c1489e622d2eccabab738a36bbe21630c880b65a9c6d6cca5f60e22d0406b9a49a7c0a7671bf53b11f54c07467788e0f180f876e754b60402a350838a07d0b9fd6bae3af15628a9ec0c070f16e42aea424de759d103d0a253c971dea6954ca5d7c3f29312129372ae9f438bd4dd39b175a7be4b41b55664f76a165df59f7fd035a2be5c307c45ef06736b41d6ae05ce8fb7b5e54eb5a1b8978b2fc15e1b35bff877d0c50ff0cf870e11efdde0c0c7c0ac1552a2ed84ca5e5d33e181ef21339c77cab2b18d95ae6b836f56eb7fd4c657c7afee72f000000ffff0300bff77694c5020000',
        ],
        [
          'Date',
          'Tue, 30 Nov 2021 14:01:08 GMT',
          'Content-Type',
          'application/json; charset=utf-8',
          'Transfer-Encoding',
          'chunked',
          'Connection',
          'close',
          'vary',
          'Origin',
          'access-control-allow-origin',
          '*',
          'CF-Cache-Status',
          'DYNAMIC',
          'Expect-CT',
          'max-age=604800, report-uri="https://report-uri.cloudflare.com/cdn-cgi/beacon/expect-ct"',
          'Report-To',
          '{"endpoints":[{"url":"https:\\/\\/a.nel.cloudflare.com\\/report\\/v3?s=0gGjoDXDT6BSYgcRLV54F9BweO9VT3nhJCKN8%2FsMDUWKkmz3Z9R0drnJn9yZ6Upqg%2Bn6fqP0qJ5hQqLJhlmuzot80XDrX6IsE%2BRdJ9eBhtyVXuQMA%2FCd%2FHg%2Fvfw0NfSE95a8JI%2FXPlDJdhD%2FLPGv"}],"group":"cf-nel","max_age":604800}',
          'NEL',
          '{"success_fraction":0,"report_to":"cf-nel","max_age":604800}',
          'Server',
          'cloudflare',
          'CF-RAY',
          '6b649b21ee674126-PRG',
          'Content-Encoding',
          'gzip',
        ],
      );

    stdout.start();
    // nock.recorder.rec();
    await ProtocolParameters.run(['--testnet']);
    // nock.restore();
    stdout.stop();

    const output = stdout.output;
    console.log(output);
    expect(JSON.parse(output)).toMatchObject({
      txFeePerByte: 44,
      minUTxOValue: 34482,
      decentralization: 0,
      utxoCostPerWord: 34482,
      stakePoolDeposit: 500000000,
      poolRetireMaxEpoch: 18,
      extraPraosEntropy: null,
      collateralPercentage: 150,
      stakePoolTargetNum: 500,
      maxBlockBodySize: 73728,
      minPoolCost: 340000000,
      maxTxSize: 16384,
      treasuryCut: 0.2,
      maxBlockExecutionUnits: {
        memory: 50000000,
        steps: 40000000000,
      },
      maxCollateralInputs: 3,
      maxValueSize: 5000,
      maxBlockHeaderSize: 1100,
      maxTxExecutionUnits: {
        memory: 11250000,
        steps: 10000000000,
      },
      costModels: {},
      protocolVersion: {
        minor: 0,
        major: 6,
      },
      txFeeFixed: 155381,
      stakeAddressDeposit: 2000000,
      monetaryExpansion: 0.003,
      poolPledgeInfluence: 0.3,
      executionUnitPrices: {
        priceSteps: 0.0000721,
        priceMemory: 0.0577,
      },
    });
  });
});

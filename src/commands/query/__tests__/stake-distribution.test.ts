/* eslint-disable camelcase */
import { BlockFrostAPI } from '@blockfrost/blockfrost-js';
import * as fs from 'fs';
import { stdout } from 'stdout-stderr';
import * as blockfrostService from '../../../services/blockfrost';
import { StakeDistribution } from '../stake-distribution';
// import * as nock from 'nock';
// import path = require('path');
import { loadRecord } from './__mocks__/stake-distribution-nock.test';

describe('query stake-distribution', () => {
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

  it('should print raw response', async () => {
    stdout.start();
    loadRecord();
    // uncomment this to export nock record (don't forget to remove createBlockfrostClient mock from beforeEach)
    // after export wrap the output in export const loadRecord = () => {...}
    // nock.recorder.rec({
    //   use_separator: false,
    //   logging: content =>
    //     fs.appendFileSync(path.join(__dirname, `../__mocks__/stake-distribution-nock.test.ts`), content),
    // });
    await StakeDistribution.run(['--testnet', '--json']);
    // nock.restore();
    stdout.stop();

    const output = stdout.output;
    console.log('output', output);

    const poolForSanityCheck = 'pool1luenk0hazsrdj2ah6dakhv4w70xs3v46zu3zh8sdfdqav0j07un';
    const result = JSON.parse(output);
    const pool = result.find((p: any) => p.pool_id === poolForSanityCheck);
    expect(pool).toMatchObject({
      pool_id: 'pool1luenk0hazsrdj2ah6dakhv4w70xs3v46zu3zh8sdfdqav0j07un',
      numerator: 2106917892,
      denominator: 14706196085570308,
    });
    expect(result).toMatchSnapshot();
  });

  it('should print pretty response', async () => {
    loadRecord();

    stdout.start();
    await StakeDistribution.run(['--testnet']);
    stdout.stop();

    const output = stdout.output;
    expect(output).toMatchSnapshot();
  });

  it('should save the response to --out-file', async () => {
    loadRecord();

    jest.spyOn(fs, 'writeFileSync').mockImplementation((_path, _data) => {
      // do nothing
    });
    await StakeDistribution.run(['--testnet', '--out-file', 'filename']);
    expect(fs.writeFileSync).toHaveBeenCalledTimes(1);

    expect(fs.writeFileSync).toMatchSnapshot();
  });
});

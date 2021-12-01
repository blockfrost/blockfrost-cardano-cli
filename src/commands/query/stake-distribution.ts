/* eslint-disable camelcase */
import { Responses } from '@blockfrost/blockfrost-js';
import BigNumber from 'bignumber.js';
import { cli } from 'cli-ux';
import { BaseCommand } from '../../helpers/base-command';

// cardano-cli response
// PoolId                                 Stake frac
// ------------------------------------------------------------------------------
// pool1qqyjr9pcrv97gwrueunug829fs5znw6p2wxft3fvqkgu5f4qlrg   2.495e-3
// pool1qqfnw2fwajdnam7xsqhhrje5cgd8jcltzfrx655rd23eqlxjfef   1.044e-6
// pool1qquwwu6680fr72y4779r2kpc7mxtch8rp2uhuqcc7v9p6q4f7ph   3.730e-8
// pool1qptl80vq84xm28pt3t2lhpfzqag28csjhktxz5k6a74n260clmt   3.852e-8
// pool1qzlk4mdgauljhk9eq4m6jmxtjyyeyjgjj0wk7vfmvwxrx22ljgs   2.482e-3
// pool1qrfa3jrqptfj0kg5pef7fup6ta70pdf7e7vjcgpxtrtsvxxf7ze   1.181e-10
// pool1qrazx9r2jtepdefa7h830az933vexudt9rpn0t2vky95k5k97my   4.974e-5
// pool1qy2fm6lxgaxltgvylq955vfz6md9njs42ghld9l0ekr6uf8fr07   1.019e-7
// pool1q9ss9dxccvlh5289evsp63f5qxhn0d30kpvcpufeh9q37ua5nhu   1.983e-7
// pool1q9n8adj6d8wzf69smatx0dnwmlj2lkrgnl28p0pu8fkl5rg4e2l   1.228e-8
// pool1q8we0kpchnqkgnxypudv0jc08mdzcx6k748a3mtceku3c9434xw   0.000e0
// pool1qgh2hsuwtwpff5lvspyfrl2lkth4jvpdm3trfp7qvm22guzl8kc   3.396e-8
// pool1qfyqv9s5nz3y2j9xezk0l3m0ss3fff68yxsnltgu3wtes7mdjrs   3.207e-8
// pool1qf7aaelmav0w2t9rdhl9ukf0eg6p9pa00gfk8wqxh3dmj253kpw   1.891e-10
// pool1q0fyxxrkqn2nly6k7llj859gaxuzrnlvqgdu9z8c5g2mw33mt7l   1.354e-8
// pool1q0umnwuvj6menpj49z64fr4hf2z7qwnme28c87tyss7zc7y3c5e   1.247e-3
// pool1qsk7fjjum8epms73qnwtcyknx3judv8pjvegaqrjxq7sy3jql4c   1.235e-8
// pool1qjgxukyy69a5xhne2ah94eg908d9xtts4l2agah3mplxz5mghds   1.235e-8
// pool1qjgjxwfft3rtcws7jmu4w45wuvw4nszef5ha8ww6rz8fcku85ql   1.140e-7
// pool1qkqjpm5gcvc5v9d3zypx3k2czdv2d6ppak07cy80dvfuzz73srr   1.232e-8
// pool1qe2xp6946xefvrncclmgyu665jgw5q3rd8e2cwc8t03xk6u5dux   8.424e-8
// pool1qetu0yrnjgmuythwjcu3ec0c9s553prj8npwjyxl0xtzc8euhr0   1.230e-8
// pool1qeenfmpee93g6sr25pcfg0xntclcruykrl33308448435nc3gq4   3.712e-8
// pool1q6alnxr3qgx53qv8f73dvkvnwn0r8mvm48zvqz663h75qmvlpgs   7.943e-4

// --out-file
// {
//   "pool1hp3cuutearry4h7edgk0d07nju7tx3fc229tcfghk72jg4nyah4": {
//       "numerator": 248812147,
//       "denominator": 20150911152895487
//   },
//   "pool1jjdryjzekxcrd8aj7y7fwga6wqg806gl4luem2zmeu3rkap77jp": {
//       "numerator": 10521397235776,
//       "denominator": 20150911152895487
//   },
//   ...

type Data = {
  pool_id: string;
  numerator: BigInt;
  denominator: BigInt;
};
export class StakeDistribution extends BaseCommand {
  prettyPrint = (res: Data[]) => {
    const calculatedData = res.map(stake => ({
      pool_id: stake.pool_id,
      frac: new BigNumber(stake.numerator.toString())
        .div(stake.denominator.toString())
        .toExponential(3),
    }));
    this.log();
    try {
      cli.table(
        calculatedData,
        {
          pool_id: {
            header: 'PoolId',
            minWidth: 30,
          },
          frac: {
            header: 'Stake frac',
          },
        },
        { printLine: console.log, 'no-truncate': true },
      );
    } catch (error) {
      console.error(error);
    }

    this.log();
  };

  async toFile(data: Data[]): Promise<void> {
    const stakePerPool: Record<
      string,
      {
        numerator: BigInt;
        denominator: BigInt;
      }
    > = {};
    data.forEach(stake => {
      stakePerPool[stake.pool_id] = {
        numerator: stake.numerator,
        denominator: stake.denominator,
      };
    });
    super.toFile(stakePerPool);
  }

  doWork = async () => {
    const client = await this.getClient();

    const pools = await client.poolsAll();
    const allStakes: {
      pool_id: string;
      pool_hex: string;
      live_stake: BigInt;
    }[] = [];
    const SMALL_BATCH = 10;
    const LARGE_BATCH = 100;
    let batch_size = LARGE_BATCH;
    let stakesSum = BigInt(0);

    const getPromiseBundle = (startIndex: number, batchSize: number) => {
      const promises = [...Array.from({ length: batchSize }).keys()].map(i => {
        const poolId = pools[startIndex + i];
        return poolId ? client.poolsById(poolId) : undefined;
      });
      return promises.filter(p => Boolean(p)) as unknown as Responses['pool'][];
    };

    // cli.action.start('Fetching pools');
    const progressBar = cli.progress({
      format: '{value}/{total} pools {bar}',
      barCompleteChar: '\u2588',
      barIncompleteChar: '\u2591',
    });
    progressBar.start(pools.length, 0);
    // Blockfrost API allows burst of 500 request, then we can only make 10 requests per second
    for (let i = 0; i < pools.length; i += batch_size) {
      // this.log(`Fetching pools ${i + batch_size}/${pools.length}`);
      const promiseSlice = getPromiseBundle(i, batch_size);
      if (batch_size === SMALL_BATCH) {
        // wait 1 second before each small batch
        // eslint-disable-next-line no-await-in-loop
        await new Promise(resolve => {
          setTimeout(() => resolve(true), 1000);
        });
      }

      // eslint-disable-next-line no-await-in-loop
      const partialResults = await Promise.all(promiseSlice);
      progressBar.update(i);
      partialResults.forEach(res => {
        const liveStake = BigInt(res.live_stake);
        allStakes.push({
          pool_id: res.pool_id,
          pool_hex: res.hex,
          live_stake: liveStake,
        });
        stakesSum += liveStake;
      });
      if (i >= 400) {
        // after 400 request switch to small batch
        batch_size = SMALL_BATCH;
      }
    }

    // cli.action.stop();
    progressBar.stop();

    const formattedStakes = allStakes
      // sort by pool hex
      .sort((a, b) =>
        new BigNumber('0x' + a.pool_hex, 16).comparedTo(new BigNumber('0x' + b.pool_hex, 16)),
      )
      .map(stake => ({
        pool_id: stake.pool_id,
        numerator: stake.live_stake,
        denominator: stakesSum,
      }));
    return formattedStakes;
  };
}

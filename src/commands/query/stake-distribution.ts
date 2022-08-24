/* eslint-disable camelcase */
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
  numerator: bigint;
  denominator: bigint;
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
      { printLine: line => this.log(line), 'no-truncate': true },
    );

    this.log();
  };

  async toFile(data: Data[]): Promise<void> {
    const stakePerPool: Record<
      string,
      {
        numerator: bigint;
        denominator: bigint;
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

    const poolsExtended = await client.poolsExtendedAll({ batchSize: 50 });

    let stakesSum = BigInt(0);
    const allStakes = poolsExtended.map(res => {
      const liveStake = BigInt(res.live_stake);
      stakesSum += liveStake;
      return {
        pool_id: res.pool_id,
        pool_hex: res.hex,
        live_stake: liveStake,
      };
    });

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

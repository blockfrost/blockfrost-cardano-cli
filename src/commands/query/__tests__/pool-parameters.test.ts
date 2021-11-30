import { stdout } from 'stdout-stderr';
import { PoolParams } from '../pool-parameters';
import * as nock from 'nock';

describe('query pool-parameters', () => {
  it('should print pool parameters (with futurePoolParams)', async () => {
    nock('https://cardano-testnet.blockfrost.io:443', { encodedQueryParams: true })
      .get('/api/v0/pools/a5a3ce765f5162548181a44d1ff8c8f8c50018cca59acc0b70a85a41/metadata')
      .reply(
        200,
        [
          '1f8b0800000000000003748f5b6ac3301045b712e6db71244b234bde422914b28032d64871e2672c25b829dd7b69f2ddbf73e1c0e57cc332cfc3e799a17992c45edd6e74192aa75cbcde17549b1aeaed34ac8f74ddb63bf67cf78f31e985bf1edd369a4b8402bab0410384a47ca80d4694a6426da595a435cb18adb7d17a14425aef091d792fda5a9045d2120ab8ad0334d0e5bc348743a5ca4ae952baba34ee30f6693f864c4c99f642c8f292e6e9ef9352070db0b324546b899ca9d80a94924d85c670ac286a8914d9b52c14a3f26d2b8835d6848a957632d61a0ac867df87151a787f3b4201138de13576c74c7dd87dccf3000570487e3d2ff93c4fd0400e294f21efd253595e4a378f61a153f8a7057e7e010000ffff0300f124613870010000',
        ],
        [
          'Date',
          'Tue, 30 Nov 2021 13:23:01 GMT',
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
          '{"endpoints":[{"url":"https:\\/\\/a.nel.cloudflare.com\\/report\\/v3?s=yA3gu8x%2BBIIg0kfpFwaEnORtAxUHm4PT%2BlycPGDHwfVViDyqQZ%2Fk8%2FD9WtSajwiI9Q2gCeAnZS%2B%2Fk7oIllftslrkC4ovmc%2BQynP92qErgaic8Yc%2FhJZa3TvG%2BQLeWYZczzunw%2BdRvvCqXL5rYoGA"}],"group":"cf-nel","max_age":604800}',
          'NEL',
          '{"success_fraction":0,"report_to":"cf-nel","max_age":604800}',
          'Server',
          'cloudflare',
          'CF-RAY',
          '6b64634b4e314132-PRG',
          'Content-Encoding',
          'gzip',
        ],
      );

    nock('https://cardano-testnet.blockfrost.io:443', { encodedQueryParams: true })
      .get('/api/v0/pools/a5a3ce765f5162548181a44d1ff8c8f8c50018cca59acc0b70a85a41/updates')
      .query({ page: '1', count: '100', order: 'asc' })
      .reply(
        200,
        [
          '1f8b08000000000000039cd03d6a23400c40e1bb4ced62a4d1afaf1242d0489a8d9b2c382e0221774fbbe5e2137cbcf7f23d1e5f6feff1f93eaee3e41140e24d878bd253f870b848e52a565f4851bc8f3019eb7404e609b4918bdc9ac76564df1f6fb78feaaf719d9711f9b8fdfd18d771ef3fb7cf47dfbbc6cfe55f73b670968b10f39633bdcf62615d21a77bee49e00c92d41deaa63ca3a9d965e7325af68ca97319824c0c31e82aaa3295505d82967e32117423d97205d0452c56c8ed9cec0b9eea64da666bcb648ede70e47446b3c0d2eabd5b0b676044f2cc30c5606ba8b0a37dd0139f7a2be8a9cd1262d6de678ae8dab98f20706f84d9d36501e55e6717a18b2e2904f29eedff69befe020000ffff0300cd88071745020000',
        ],
        [
          'Date',
          'Tue, 30 Nov 2021 13:23:01 GMT',
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
          '{"endpoints":[{"url":"https:\\/\\/a.nel.cloudflare.com\\/report\\/v3?s=Wr3PKpmkgW67pWbxXpzKzKmnpwA2z3k3AYFPbS8Dpd6Kj6z69BaQVOTDc%2F9OPD6uuXsNSp%2F5KdcB2InGfkcb%2BFt2T4BY%2BDKnxBFs%2BS3ALS3HRMzcuGmyGFUSnMx8Z1aW4ZcxLX2R9Rc%2Blw%2FJAnU7"}],"group":"cf-nel","max_age":604800}',
          'NEL',
          '{"success_fraction":0,"report_to":"cf-nel","max_age":604800}',
          'Server',
          'cloudflare',
          'CF-RAY',
          '6b64634b5bb7f9e2-PRG',
          'Content-Encoding',
          'gzip',
        ],
      );

    nock('https://cardano-testnet.blockfrost.io:443', { encodedQueryParams: true })
      .get('/api/v0/epochs/latest')
      .reply(
        200,
        [
          '1f8b080000000000000364cb416ac3301046e1bbfc6b2d34a3cc68a4cb18c795a9b11387781c0221770f6d298566fb3dde03edb20e9fa8942960f3feea9d4fa7864a9ab26552d28076fef8534b317deb385d37ef8ecb3accff1f0b58faf7689c4d720cf8f161ddcf8e4a2ca6017eff054b256ac0bafb6577541093484c1ccb210be5121130b6b6a182a594c2aa393202fac1a75beb36efe7f6f51d4485930a453256363c5f000000ffff030095f31ccbf0000000',
        ],
        [
          'Date',
          'Tue, 30 Nov 2021 13:23:01 GMT',
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
          '{"endpoints":[{"url":"https:\\/\\/a.nel.cloudflare.com\\/report\\/v3?s=aPaDMYJB%2FVfrHLdI62xKOkLWRxfHYvfCuJQdBiN6fNsI01zuVOUD91jtAhVQY%2F3ZZsMqHIUF1agpj9ISocS0OaLlLHkdUiGXLJbNQkdhHyXuAlFB10Tsx0UtOwTO0%2Bu059vqCT2kW495jO%2FKhLDQ"}],"group":"cf-nel","max_age":604800}',
          'NEL',
          '{"success_fraction":0,"report_to":"cf-nel","max_age":604800}',
          'Server',
          'cloudflare',
          'CF-RAY',
          '6b64634b4a0a410e-PRG',
          'Content-Encoding',
          'gzip',
        ],
      );

    nock('https://cardano-testnet.blockfrost.io:443', { encodedQueryParams: true })
      .get('/api/v0/pools/a5a3ce765f5162548181a44d1ff8c8f8c50018cca59acc0b70a85a41/relays')
      .reply(
        200,
        [
          '1f8b08000000000000038aae56ca2c283351b2523232d6333236d133b434d733b354d201099b2959e595e6e4e828a5e4152331e38b8bca60dc82fca212252b530303c3da5800000000ffff03008082177d4c000000',
        ],
        [
          'Date',
          'Tue, 30 Nov 2021 13:23:01 GMT',
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
          '{"endpoints":[{"url":"https:\\/\\/a.nel.cloudflare.com\\/report\\/v3?s=aeIi%2Bfv6Cq3TSbOgxUJGyTtezwEZmOjRovIHxVwCeiHUoC%2BzCpGxAdh0jdClU10%2FcXVHBvkfHowUFWCA1Okyw7IaC8Vk5XxhZZf1N5kVbniSx9BbNpPPozPUs6hZ3053hV7uJB%2BPd%2B6LrRNORM%2B1"}],"group":"cf-nel","max_age":604800}',
          'NEL',
          '{"success_fraction":0,"report_to":"cf-nel","max_age":604800}',
          'Server',
          'cloudflare',
          'CF-RAY',
          '6b64634b4b0c4108-PRG',
          'Content-Encoding',
          'gzip',
        ],
      );

    nock('https://cardano-testnet.blockfrost.io:443', { encodedQueryParams: true })
      .get('/api/v0/pools/a5a3ce765f5162548181a44d1ff8c8f8c50018cca59acc0b70a85a41')
      .reply(
        200,
        [
          '1f8b0800000000000003a452cb6e23390cfc179d8d05299114e55f0906861e94e3b86d27dd6dbbedc1fcfba0339b09b0d7d5895015aa8a8f9feefd72197687e6b69f15f2315caff96df029a4fe717be7b084212efb617c4e1fcb72e363bbd5e769a2f7f678be2e2779eb6ee35e6d715b9739876a51b8338a675254cc440d7bd7aa5d2b03a0d69a39e55aa144c8ca99d06ddc6decbba33ddcd641849643c0e0810d9192921948d78c35a7d40d4b89be11a31a34a0868a5c0a562da55125b77165b8d4e3b43b1dceb335b70da21b371c6eb69be67c34b775e8812130784d3eaef67fd0c3d3dc16fe0180289a80bc57882946f55f8c3c5fc73c1f2ee795871430a62004013105fe62351b6c9fe7cb38b96dd8b85ce7ff78936ac224ea03b86ffcdb5d7df4417c0c6bf731e2c635ab431eadedde076bfb552631fc7d5f0dfc051110918010d8af0339e5717f38efea659a3f2dc2c6f5c362eddf1f17e85b69b47b1edb2ed77ab99e57f033f86eb669c6ebf33e3ffc745afacce48ff6761c6cb0b14e6d793c8d1ef774bc5febed34d3c7d0de3e5ea5a5693d8fcbfd6ceb345efebfd88f35e1fe30cd5f7b7871bd76414f5ca873a39aea7a803989b41a1ac7143ce5c6a50b937284e49119908ae746498dddc68109d7964488b94887643db0700c59ba1914204c8c52c92cc7a491211b192729352805751b1721a847019f45d15aa3d6344a8e3188d79a7aad1e63f1a42145c41888459b674b5c39055c533015d5500498b315ecd2ad6663c1109b9562b179c83ee7ca50b3469f590d5bd61eadfb54fdda88f854a3b16451b5641d446228b574f1c8563c82419280544be8a5914f1283348f940c2cfd99ef7c18ed64ebf65f7efcfa0d',
          '0000ffff030079260c8c23040000',
        ],
        [
          'Date',
          'Tue, 30 Nov 2021 13:23:01 GMT',
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
          '{"endpoints":[{"url":"https:\\/\\/a.nel.cloudflare.com\\/report\\/v3?s=EWs6%2FpOPi5xEYlYHigGkvXlZ69xIl7J2Dd2cZCAEsaa4QxjBlTN88mNDHsu4Q3ZrvpEwu%2B0s6haDz6xas4rzuZvTghalIfRGj59KKrvzq%2BKtxhDLnxbY3vblDN%2B9AfxntD5xGazC8LUM6HfVQJLd"}],"group":"cf-nel","max_age":604800}',
          'NEL',
          '{"success_fraction":0,"report_to":"cf-nel","max_age":604800}',
          'Server',
          'cloudflare',
          'CF-RAY',
          '6b64634b4f674126-PRG',
          'Content-Encoding',
          'gzip',
        ],
      );

    nock('https://cardano-testnet.blockfrost.io:443', { encodedQueryParams: true })
      .get(
        '/api/v0/txs/0629c7e56a688e9ef06673bcbf6215eb210e096314cb3fbd4296736d2149e0e9/pool_updates',
      )
      .reply(
        200,
        [
          '1f8b0800000000000003a491dd8ae3300c855fa5e83ad3dab19dc67e856161612e872538963249e3fc3476d2a465df7d49677f58d8bbd59574f4213847ef0f7034c5a2e99156302c8171187cd1209867c7552be6d95e7caa85aeaecba8c42afc79fdf0d33d5cd775512d2eeede0539e276afd72ebb5490c03255454b1b1860678656082e52a68873a97349c4b22ab7dc59ad2be265794e512a9e13432691e75c9525777959a2741212183de1078101add8ef82043a3b7d347de18610c1b023130954cd4af8530121ffb013ddec8485756e98fb7d19a26da98814229fefb7b8a5a15baba864dad2a5f5e4697201d7ed4e72bbe9f636bba58bf2eaf172ad33d4613739dc7a9a0298f7ff3ff62d818ea2451b2d9807cc930703758ca3399d52714c853c727d3e66fad4b5e1e517fac2183f5ec2d04302b50d3518409d5b26cadc5a9da59833c53966a9ca32ac525b49ae6c85ba442650095796cca25467ab040aa97975dee38e8d6b6902035f5edf2081de76f4391cde769b87afc3e02101a4e0a6668ccdd08381dd7b4ff1f04ce2307e22f5d0d1689faffb9717f8beffc5db6dcff001cdb84830f03792ec7206a69fbdff211da594bc6224667c7151198c5b905f54a264656a6060581baba394985c9259961a9f5a909f9ca16465686e521b0b000000ffff0300582d2286e9020000',
        ],
        [
          'Date',
          'Tue, 30 Nov 2021 13:23:01 GMT',
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
          '{"endpoints":[{"url":"https:\\/\\/a.nel.cloudflare.com\\/report\\/v3?s=By0ulWSudQcMk61xvffV5rE6KMbk1OXKImPSXkv7Gp4eXNubTInsAE1mlRXxiqWysfM2dhQeVCpmHZHLgO7lN%2F48xacprikAwC95PGSqFwGwTd0kvrdDx%2Bzjvv9AB4oc2jsk9VjgzEs%2FT6GIZmCU"}],"group":"cf-nel","max_age":604800}',
          'NEL',
          '{"success_fraction":0,"report_to":"cf-nel","max_age":604800}',
          'Server',
          'cloudflare',
          'CF-RAY',
          '6b64634c58e54138-PRG',
          'Content-Encoding',
          'gzip',
        ],
      );

    stdout.start();
    // nock.recorder.rec();
    await PoolParams.run([
      '--testnet',
      '--stake-pool-id',
      'a5a3ce765f5162548181a44d1ff8c8f8c50018cca59acc0b70a85a41',
    ]);
    // nock.restore();
    stdout.stop();

    const output = stdout.output;
    expect(JSON.parse(output)).toMatchObject({
      poolParams: {
        publicKey: 'a5a3ce765f5162548181a44d1ff8c8f8c50018cca59acc0b70a85a41',
        cost: 340000000,
        metadata: {
          hash: 'd98a03b8aa962d80511d62566df2af415afd9bd03d53cbb0ad457a53d3491f74',
          url: 'http://23.234.197.69/mks-metadata-001.json',
        },
        vrf: '070da3313205e114984ee06f8a1ca99fe1bb72d4518e0d04d1815bb1c8bbd4c4',
        owners: ['9cb22a1b32574aaad995bf9fe478834c4166a4716cee619b5d41f6c8'],
        pledge: 950000000000,
        rewardAccount: {
          network: 'Testnet',
          credential: {
            'key hash': '9cb22a1b32574aaad995bf9fe478834c4166a4716cee619b5d41f6c8',
          },
        },
        margin: 0.03,
        relays: [
          {
            'single host address': {
              IPv6: null,
              port: 5001,
              IPv4: '23.234.197.69',
            },
          },
        ],
      },
      futurePoolParams: {
        publicKey: 'a5a3ce765f5162548181a44d1ff8c8f8c50018cca59acc0b70a85a41',
        cost: '340000000',
        metadata: {
          hash: 'd98a03b8aa962d80511d62566df2af415afd9bd03d53cbb0ad457a53d3491f74',
          url: 'http://23.234.197.69/mks-metadata-001.json',
        },
        vrf: '070da3313205e114984ee06f8a1ca99fe1bb72d4518e0d04d1815bb1c8bbd4c4',
        owners: ['9cb22a1b32574aaad995bf9fe478834c4166a4716cee619b5d41f6c8'],
        pledge: 950000000000,
        rewardAccount: {
          network: 'Testnet',
          credential: {
            'key hash': '9cb22a1b32574aaad995bf9fe478834c4166a4716cee619b5d41f6c8',
          },
        },
        margin: 0.03,
        relays: [
          {
            'single host address': {
              IPv6: null,
              port: 5001,
              IPv4: '23.234.197.69',
            },
          },
        ],
      },
      retiring: null,
    });
    // await new Promise(resolve => {
    //   setTimeout(() => resolve(true), 500);
    // });
  });
});

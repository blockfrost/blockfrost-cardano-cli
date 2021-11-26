export const bech32ToHex = [
  {
    description: 'Testnet address',
    stripPrefix: false,
    data: 'addr1qx7ay9achkszevnkfnzk450q3lq70wetn3m34pkr340vyaws4dsc4x2tj40vqypwyl75ehkhf4kegl90gxz47psf7dns58yqpa',
    result:
      '01bdd217b8bda02cb2764cc56ad1e08fc1e7bb2b9c771a86c38d5ec275d0ab618a994b955ec0102e27fd4cded74d6d947caf41855f0609f367',
  },
  {
    description: 'Mainnet address',
    stripPrefix: false,
    data: 'addr1vy740r73x2w3du2xxt76cs4hdml4zw2c5h7tddcyf3jauys9tyns4',
    result: '613d578fd1329d16f14632fdac42b76eff513958a5fcb6b7044c65de12',
  },
  {
    description: 'Testnet address',
    stripPrefix: true,
    data: 'addr_test1qpmtp5t0t5y6cqkaz7rfsyrx7mld77kpvksgkwm0p7en7qum7a589n30e80tclzrrnj8qr4qvzj6al0vpgtnmrkkksnqd8upj0',
    result:
      '76b0d16f5d09ac02dd1786981066f6fedf7ac165a08b3b6f0fb33f039bf76872ce2fc9debc7c431ce4700ea060a5aefdec0a173d8ed6b426',
  },
  {
    description: 'Testnet stake address',
    stripPrefix: true,
    data: 'stake_test1urw3nu0jaxhlnw5heuhp48cgqfwpu9tdup6ay2kfnfmdjcc98fh89',
    result: 'dd19f1f2e9aff9ba97cf2e1a9f08025c1e156de075d22ac99a76d963',
  },
  {
    description: 'mainnet stake address',
    stripPrefix: true,
    data: 'stake1u89hxtuxvfdqda90w2aw2mluxcsgyctfe2lz52n986lrc2cumssr9',
    result: 'cb732f86625a06f4af72bae56ffc3620826169cabe2a2a653ebe3c2b',
  },
  {
    description: 'Testnet pool',
    stripPrefix: false,
    data: 'pool1weu4vlg9t8knma7t2j5y3w2k3vzdr9mtnynd2jhfalwn76nwh48',
    result: '7679567d0559ed3df7cb54a848b9568b04d1976b9926d54ae9efdd3f',
  },
];

export const stripQuotes = [
  {
    description: 'Strip quotes around string',
    data: '"abcde"',
    result: 'abcde',
  },
  {
    description: 'Strip quotes around multiline string',
    data: '"abcd "e" \nfg"hi"',
    result: 'abcd "e" \nfg"hi',
  },
  {
    description: 'Strip quotes on non-string value',
    data: { a: 2 },
    result: { a: 2 },
  },
];

export const getNetworkFromRewardAccount = [
  {
    description: 'getNetworkFromRewardAccount Mainnet account',
    data: 'stake1uyqgnh98k99vknl7yl60le3dtcj0ha5vdjmnegr2ha9aqggcjvclw',
    result: 'Mainnet',
  },
  {
    description: 'getNetworkFromRewardAccount Testnet account',
    data: 'stake_test1uzwty2smxft542kejklelercsdxyze4yw9kwucvmt4qldjqh6d9sf',
    result: 'Testnet',
  },
];

export const stringify = [
  {
    description: '(safe stable) stringify',
    data: {
      z: [1, 2, 3],
      a: 'a',
      b: 1,
      c: {
        bc: BigInt('90071992547409910000'),
        ab: 2,
      },
    },
    result: `{
    \"z\": [
        1,
        2,
        3
    ],
    \"a\": \"a\",
    \"b\": 1,
    \"c\": {
        \"bc\": 90071992547409910000,
        \"ab\": 2
    }
}`,
  },
];

export const transformPoolRelays = [
  {
    description: 'single host address',
    data: [
      {
        ipv4: '64.227.109.12',
        ipv6: null,
        dns: null,
        dns_srv: null,
        port: 3000,
      },
    ],
    result: [
      {
        'single host address': {
          IPv4: '64.227.109.12',
          IPv6: null,
          port: 3000,
        },
      },
    ],
  },
  {
    description: 'single host name',
    data: [
      {
        ipv4: null,
        ipv6: null,
        dns: 'relays.testnet.stakenuts.com',
        dns_srv: null,
        port: 3001,
      },
    ],
    result: [
      {
        'single host name': {
          dnsName: 'relays.testnet.stakenuts.com',
          port: 3001,
        },
      },
    ],
  },
];

export const transformPoolUpdateCert = [
  {
    description: 'transformPoolUpdateCert',
    data: {
      poolHex: 'a5a3ce765f5162548181a44d1ff8c8f8c50018cca59acc0b70a85a41',
      cert: {
        cert_index: 0,
        pool_id: 'pool15k3uuajl2939fqvp53x3l7xglrzsqxxv5kdvczms4pdyzhxm6jf',
        vrf_key: '070da3313205e114984ee06f8a1ca99fe1bb72d4518e0d04d1815bb1c8bbd4c4',
        pledge: '900000000000',
        margin_cost: 0.03,
        fixed_cost: '340000000',
        reward_account: 'stake_test1uzwty2smxft542kejklelercsdxyze4yw9kwucvmt4qldjqh6d9sf',
        owners: ['stake_test1uzwty2smxft542kejklelercsdxyze4yw9kwucvmt4qldjqh6d9sf'],
        metadata: {
          url: 'http://23.234.197.69/mks-metadata-001.json',
          hash: 'd98a03b8aa962d80511d62566df2af415afd9bd03d53cbb0ad457a53d3491f74',
          ticker: 'MKS',
          name: 'MKS Stake Pool',
          description: 'testnet stake pool',
          homepage: 'http://23.234.197.69',
        },
        relays: [
          {
            ipv4: '23.234.197.69',
            ipv6: null,
            dns: null,
            dns_srv: null,
            port: 5001,
          },
        ],
        active_epoch: 173,
      },
    },
    result: {
      cost: '340000000',
      margin: 0.03,
      metadata: {
        hash: 'd98a03b8aa962d80511d62566df2af415afd9bd03d53cbb0ad457a53d3491f74',
        url: 'http://23.234.197.69/mks-metadata-001.json',
      },
      owners: ['9cb22a1b32574aaad995bf9fe478834c4166a4716cee619b5d41f6c8'],
      pledge: BigInt(900000000000),
      publicKey: 'a5a3ce765f5162548181a44d1ff8c8f8c50018cca59acc0b70a85a41',
      relays: [{ 'single host address': { IPv4: '23.234.197.69', IPv6: null, port: 5001 } }],
      rewardAccount: {
        credential: { 'key hash': '9cb22a1b32574aaad995bf9fe478834c4166a4716cee619b5d41f6c8' },
        network: 'Testnet',
      },
      vrf: '070da3313205e114984ee06f8a1ca99fe1bb72d4518e0d04d1815bb1c8bbd4c4',
    },
  },
];

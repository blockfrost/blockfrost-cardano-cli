import { Responses } from '@blockfrost/blockfrost-js';
import { bech32 } from 'bech32';
import sStringify from 'safe-stable-stringify';

export const stringToBigInt = (value: string | null) => (value ? BigInt(value) : value);

export const stringify = (obj: any) => sStringify(obj, undefined, 4); // safe-stable-stringify properly stringifies BigInt

export const stripQuotes = (str: string) => {
  if (typeof str === 'string' && str[0] === '"' && str[str.length - 1] === '"') {
    return str.slice(1, -1);
  }

  return str;
};

export const bech32ToHex = (bech32Addr: string, stripPrefix = false) => {
  const decodedWords = bech32.decode(bech32Addr, 1000);
  const payload = bech32.fromWords(decodedWords.words);
  const keyHashHex = Buffer.from(payload)
    .toString('hex')
    .slice(stripPrefix ? 2 : 0); // first byte is prefix
  return keyHashHex;
};

export const transformPoolRelays = (relays: Responses['pool_relays']) =>
  relays.map(r =>
    r.dns
      ? {
          'single host name': {
            port: r.port,
            dnsName: r.dns,
          },
        }
      : {
          'single host address': {
            IPv6: r.ipv6,
            port: r.port,
            IPv4: r.ipv4,
          },
        },
  );

export const transformPoolUpdateCert = (
  poolHex: string,
  cert: Responses['tx_content_pool_certs'][number],
) => {
  return {
    publicKey: poolHex,
    cost: cert.fixed_cost,
    metadata: {
      hash: cert.metadata?.hash,
      url: cert.metadata?.url,
    },
    vrf: cert.vrf_key,
    owners: cert.owners.map(o => bech32ToHex(o, true)),
    pledge: stringToBigInt(cert.pledge),
    rewardAccount: {
      network: getNetworkFromRewardAccount(cert.reward_account),
      credential: {
        'key hash': bech32ToHex(cert.reward_account, true),
      },
    },
    margin: cert.margin_cost,
    relays: transformPoolRelays(cert.relays),
  };
};

export const getNetworkFromRewardAccount = (rewardAccount: string) =>
  rewardAccount.startsWith('stake_test1') ? 'Testnet' : 'Mainnet';

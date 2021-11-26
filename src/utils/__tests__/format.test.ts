import * as format from '../format';
import * as fixtures from '../__fixtures__/format';

describe('format', () => {
  fixtures.bech32ToHex.forEach(f => {
    test(f.description, () => {
      const res = format.bech32ToHex(f.data, f.stripPrefix);

      expect(res).toBe(f.result);
    });
  });

  fixtures.stripQuotes.forEach(f => {
    test(f.description, () => {
      // @ts-ignore
      const res = format.stripQuotes(f.data);

      if (typeof f.result === 'object') {
        expect(res).toMatchObject(f.result);
      } else {
        expect(res).toBe(f.result);
      }
    });
  });

  fixtures.stringify.forEach(f => {
    test(f.description, () => {
      const res = format.stringify(f.data);

      expect(res).toBe(f.result);
    });
  });

  fixtures.getNetworkFromRewardAccount.forEach(f => {
    test(f.description, () => {
      const res = format.getNetworkFromRewardAccount(f.data);

      expect(res).toBe(f.result);
    });
  });

  fixtures.transformPoolRelays.forEach(f => {
    test(f.description, () => {
      const res = format.transformPoolRelays(f.data);

      expect(res).toMatchObject(f.result);
    });
  });

  test('stringToBigInt', () => {
    expect(format.stringToBigInt(null)).toBeNull;
    expect(format.stringToBigInt('123')).toBe(BigInt(123));
    expect(format.stringToBigInt('90071992547409910')).toBe(BigInt('90071992547409910'));
  });

  fixtures.transformPoolUpdateCert.forEach(f => {
    test(f.description, () => {
      const res = format.transformPoolUpdateCert(f.data.poolHex, f.data.cert);
      expect(res).toMatchObject(f.result);
    });
  });
});

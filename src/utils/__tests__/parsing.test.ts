import * as parsing from '../parsing';
import * as fixtures from '../__fixtures__/parsing';

describe('parsing', () => {
  fixtures.parseAsset.forEach(f => {
    test(f.description, () => {
      const res = parsing.parseAsset(f.data);
      expect(res).toMatchObject(f.result);
    });
  });

  fixtures.isJsonString.forEach(f => {
    test(f.description, () => {
      const res = parsing.isJsonString(f.data);
      expect(res).toBe(f.result);
    });
  });

  fixtures.assetsToPolicies.forEach(f => {
    test(f.description, () => {
      const res = parsing.assetsToPolicies(f.data);
      expect(res).toMatchObject(f.result);
    });
  });
});

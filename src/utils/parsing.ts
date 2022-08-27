import { stringToBigInt } from './format';

export const parseAsset = (
  hex: string,
): {
  policyId: string;
  assetName: string;
} => {
  const policyIdSize = 56;
  const policyId = hex.slice(0, policyIdSize);
  const assetNameInHex = hex.slice(policyIdSize);

  return {
    policyId,
    assetName: assetNameInHex,
  };
};

export const isJsonString = (str: string) => {
  try {
    JSON.parse(str);
  } catch {
    return false;
  }

  return true;
};

export const assetsToPolicies = (assets: { quantity: string; unit: string }[]) => {
  // Example output
  //   {
  //     "85be0612bc25a9a238b03b32f36b0c679d2d4cea63ff284989e20c4aab6d5933#0": {
  //         "address": "addr_test1qpk3nptn9v6wv5eec4q3tdmjq074svs6jdp5dhglnrtm9lcg9ltteln2y73vzf9knvpn2uacu7v6wxqlgxg84937kq7qwvj3f5",
  //         "value": {
  //             "dca984a3ab2c7b9691de0cf0e09227e19c06b2899500ed8e9279ab32": {
  //                 "": 500
  //             },
  //             "lovelace": 2700000
  //         }
  //     }
  // }
  const policies: { [k: string]: any } = {};
  for (const asset of assets) {
    if (asset.unit === 'lovelace') {
      policies.lovelace = stringToBigInt(asset.quantity);
    } else {
      const { policyId, assetName } = parseAsset(asset.unit);
      if (!policies[policyId]) {
        policies[policyId] = {};
      }

      policies[policyId][assetName] = stringToBigInt(asset.quantity);
    }
  }

  return policies;
};

export const parseCardanoCliVersion = (versionOutput: string) => {
  const versionRe = new RegExp(/cardano-cli (\d+)\.(\d+)\.(\d+)/);
  const version = (versionOutput.match(versionRe) ?? [])
    .slice(1)
    .map((t: string) => Number.parseInt(t, 10));
  return version;
};

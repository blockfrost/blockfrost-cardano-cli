export const parseAsset = [
  {
    description: 'Token with asset name',
    data: '00000002df633853f6a47465c9496721d2d5b1291b8398016c0e87ae6e7574636f696e',
    result: {
      policyId: '00000002df633853f6a47465c9496721d2d5b1291b8398016c0e87ae',
      assetName: '6e7574636f696e',
    },
  },
  {
    description: 'Token without asset name',
    data: '9b9ddbada8dc9cd08509ed660d5b3a65da8f36178def7ced99fa0333',
    result: {
      policyId: '9b9ddbada8dc9cd08509ed660d5b3a65da8f36178def7ced99fa0333',
      assetName: '',
    },
  },
];

export const isJsonString = [
  {
    description: 'isJsonString 1',
    data: '{aaaaaa',
    result: false,
  },
  {
    description: 'isJsonString 2',
    data: '{"a": 2}',
    result: true,
  },
];

export const assetsToPolicies = [
  {
    description: 'isJsonString 1',
    data: [
      {
        unit: '9b9ddbada8dc9cd08509ed660d5b3a65da8f36178def7ced99fa0333',
        quantity: '10',
      },
      {
        unit: '00000002df633853f6a47465c9496721d2d5b1291b8398016c0e87ae6e7574636f696e',
        quantity: '11',
      },
      {
        unit: '00000002df633853f6a47465c9496721d2d5b1291b8398016c0e87ae6e7574636f696f',
        quantity: '12',
      },
      {
        unit: 'lovelace',
        quantity: '1',
      },
    ],
    result: {
      lovelace: BigInt(1),
      '00000002df633853f6a47465c9496721d2d5b1291b8398016c0e87ae': {
        '6e7574636f696e': BigInt(11),
        '6e7574636f696f': BigInt(12),
      },
      '9b9ddbada8dc9cd08509ed660d5b3a65da8f36178def7ced99fa0333': { '': BigInt(10) },
    },
  },
];

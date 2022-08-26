export const NETWORK_MAGIC = {
  mainnet: 764824073,
  testnet: 1097911063,
  preprod: 1,
  preview: 2,
} as const;
export const ENV_VAR_PROJECT_ID = {
  mainnet: 'BLOCKFROST_PROJECT_ID_MAINNET',
  testnet: 'BLOCKFROST_PROJECT_ID_TESTNET',
  preview: 'BLOCKFROST_PROJECT_ID_PREVIEW',
  preprod: 'BLOCKFROST_PROJECT_ID_PREPROD',
};

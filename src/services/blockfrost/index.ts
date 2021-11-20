import { BlockFrostAPI } from '@blockfrost/blockfrost-js';

export const createBlockfrostClient = (testnet?: boolean) => {
  const projectId = process.env.BLOCKFROST_PROJECT_ID;

  if (!projectId) {
    throw new Error('Environment variable BLOCKFROST_PROJECT_ID not set');
  }

  return new BlockFrostAPI({
    projectId,
    isTestnet: Boolean(testnet),
  });
};

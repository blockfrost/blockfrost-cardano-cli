import { BlockFrostAPI } from '@blockfrost/blockfrost-js';
import { ERROR } from '../../constants/errors';

export const createBlockfrostClient = (testnet?: boolean) => {
  const projectId = process.env.BLOCKFROST_PROJECT_ID;

  if (!projectId) {
    throw new Error(ERROR.ENV_PROJECT_ID_NOT_SET);
  }

  return new BlockFrostAPI({
    projectId,
    isTestnet: Boolean(testnet),
  });
};

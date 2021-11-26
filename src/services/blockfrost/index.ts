import { BlockFrostAPI } from '@blockfrost/blockfrost-js';
import { ERROR } from '../../constants/errors';
import * as util from 'util';
import { ENV_VAR_PROJECT_ID } from '../../constants';

export const createBlockfrostClient = (testnet?: boolean) => {
  const envVarName = testnet ? ENV_VAR_PROJECT_ID.TESTNET : ENV_VAR_PROJECT_ID.MAINNET;
  const projectId = process.env[envVarName];

  if (!projectId) {
    throw new Error(util.format(ERROR.ENV_PROJECT_ID_NOT_SET, envVarName));
  }

  return new BlockFrostAPI({
    projectId,
    isTestnet: Boolean(testnet),
  });
};

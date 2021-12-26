import { BlockFrostAPI } from '@blockfrost/blockfrost-js';
import { ERROR } from '../../constants/errors';
import { format } from 'util';
import { ENV_VAR_PROJECT_ID } from '../../constants';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const packageJson = require('../../../package.json');

export const createBlockfrostClient = (testnet?: boolean) => {
  const envVarName = testnet ? ENV_VAR_PROJECT_ID.TESTNET : ENV_VAR_PROJECT_ID.MAINNET;
  const projectId = process.env[envVarName];

  if (!projectId) {
    throw new Error(format(ERROR.ENV_PROJECT_ID_NOT_SET, envVarName));
  }

  const userAgent = `${packageJson.name}@${packageJson.version}`;

  return new BlockFrostAPI({
    projectId,
    isTestnet: Boolean(testnet),
    userAgent,
  });
};

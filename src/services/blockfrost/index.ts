import { BlockFrostAPI } from '@blockfrost/blockfrost-js';
import { ERROR } from '../../constants/errors';
import { format } from 'util';
import { ENV_VAR_PROJECT_ID } from '../../constants';
import { CardanoNetwork } from '@blockfrost/blockfrost-js/lib/types';
const packageJson = require('../../../package.json');

export const createBlockfrostClient = (network?: CardanoNetwork) => {
  const envVarName = network ? ENV_VAR_PROJECT_ID[network] : ENV_VAR_PROJECT_ID.mainnet;
  const projectId = process.env[envVarName];

  if (!projectId) {
    throw new Error(format(ERROR.ENV_PROJECT_ID_NOT_SET, envVarName));
  }

  const userAgent = `${packageJson.name}@${packageJson.version}`;

  return new BlockFrostAPI({
    projectId,
    network,
    userAgent,
  });
};

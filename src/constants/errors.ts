export const ERROR = {
  FLAG_MISSING_ADDRESS: 'Missing flag: --address',
  FLAG_MISSING_TX_FILE: 'Missing flag: --tx-file',
  FLAG_MISSING_OUT_FILE: 'Missing flag: --out-file',
  FLAG_MISSING_STAKE_POOL_ID: 'Missing flag: --stake-pool-id',
  FILE_CANNOT_READ: 'Cannot read a file',
  TX_FILE_UNKNOWN_FORMAT: 'Unknown transaction file format.',
  FILE_WRITE_FAIL: `Failed to write to a file`,
} as const;

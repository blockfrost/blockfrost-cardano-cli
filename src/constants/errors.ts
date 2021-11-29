export const ERROR = {
  FLAG_UNSUPPORTED_TESTNET_MAGIC: `Unsupported testnet magic.`,
  FLAG_MISSING_OUT_FILE: 'Missing flag: --out-file',
  FILE_CANNOT_READ: 'Cannot read a file',
  TX_FILE_UNKNOWN_FORMAT: 'Unknown transaction file format.',
  FILE_WRITE_FAIL: `Failed to write to a file`,
  ENV_PROJECT_ID_NOT_SET: `Environment variable %s not set`,
} as const;

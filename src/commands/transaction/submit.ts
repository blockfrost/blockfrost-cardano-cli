import { Flags } from '@oclif/core';
import { BlockfrostClientError, BlockfrostServerError } from '@blockfrost/blockfrost-js';
import { readFileSync } from 'fs';
import { ERROR } from '../../constants/errors';
import { stripQuotes } from '../../utils/format';
import { isJsonString } from '../../utils/parsing';
import { BaseCommand } from '../../helpers/base-command';

// cardano-cli doesn't support --out-file flag with transaction submit command, we do
// The file will contain txHash (txid) of the transaction
export class Submit extends BaseCommand {
  static flags = {
    ...BaseCommand.flags,
    'tx-file': Flags.string({
      char: 'f',
      description: 'Filepath of the transaction you intend to submit.',
      required: true,
    }),
  };

  readFromFile = (filepath: string): string => {
    const data = readFileSync(filepath, 'utf-8');
    if (!data) {
      throw new Error(`${ERROR.FILE_CANNOT_READ} ${filepath}`);
    }

    const trimmedData = data.trim();
    const isJson = isJsonString(trimmedData);

    if (!isJson) {
      return trimmedData;
    }

    const tx: string | Record<'cborHex', string> = JSON.parse(trimmedData);
    if (
      typeof tx === 'object' &&
      tx !== null &&
      'cborHex' in tx &&
      typeof tx.cborHex === 'string'
    ) {
      return tx.cborHex;
    }

    throw new Error(ERROR.TX_FILE_UNKNOWN_FORMAT);
  };

  prettyPrint = (_data: string) => {
    this.log('Transaction successfully submitted.');
  };

  doWork = async () => {
    const { flags } = await this.parse(Submit);
    const client = await this.getClient();

    const transaction = this.readFromFile(flags['tx-file']);
    try {
      const response = await client.txSubmit(transaction);
      return response;
    } catch (error) {
      if (error instanceof BlockfrostServerError || error instanceof BlockfrostClientError) {
        this.error(`Command failed: ${stripQuotes(error.message)}`); // matching cardano-cli (if we want really 1:1 output  compatibility we should use this.log which doesn't add visuals in front of error message) and exit the process manually)
      } else {
        throw error;
      }
    }
  };
}

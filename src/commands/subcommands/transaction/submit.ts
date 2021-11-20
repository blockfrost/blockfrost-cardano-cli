import { BlockfrostClientError, BlockfrostServerError } from '@blockfrost/blockfrost-js';
import { readFileSync } from 'fs';
import { ERROR } from '../../../constants/errors';
import { stripQuotes } from '../../../utils/format';
import { isJsonString } from '../../../utils/parsing';
import { Subcommand } from '../subcommand';

export class Submit extends Subcommand {
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
    if (typeof tx === 'object' && tx !== null) {
      if ('cborHex' in tx && typeof tx.cborHex === 'string') {
        return tx.cborHex;
      }
    }
    throw new Error(ERROR.TX_FILE_UNKNOWN_FORMAT);
  };

  prettyPrint = (data: string) => {
    this.log('Transaction successfully submitted.');
  };

  doWork = async () => {
    if (!('tx-file' in this.options) || !this.options['tx-file']) {
      this.log(ERROR.FLAG_MISSING_TX_FILE);
      return;
    }

    const transaction = this.readFromFile(this.options['tx-file']);
    try {
      const response = await this.client.txSubmit(transaction);
      return response;
    } catch (err) {
      if (err instanceof BlockfrostServerError || err instanceof BlockfrostClientError) {
        this.log(`Command failed: ${stripQuotes(err.message)}`); // matching cardano-cli
      } else {
        throw err;
      }
    }
  };
}

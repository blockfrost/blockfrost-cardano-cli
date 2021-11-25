import { BaseCommand } from '../../helpers/BaseCommand';

// cardano-cli response
// {
//     "epoch": 169,
//     "hash": "20e300831de50acf6a07d8df023454381d5eb3e6fdf93f9f8f694ae0db355355",
//     "slot": 43037061,
//     "block": 3088166,
//     "era": "Alonzo",
//     "syncProgress": "100.00"
// }

// interface TipResponse {
//   epoch: number | null;
//   hash: string;
//   slot: number | null;
//   block: number | null;
//   era: string;
//   syncProgress: '100.00';
// }

export class Tip extends BaseCommand {
  doWork = async () => {
    const latestBlock = await this.client.blocksLatest();
    const response = {
      epoch: latestBlock.epoch,
      hash: latestBlock.hash,
      slot: latestBlock.slot,
      block: latestBlock.height,
      era: 'Alonzo',
      syncProgress: '100.00',
    };
    return response;
  };
}

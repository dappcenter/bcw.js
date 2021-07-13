import { INetwork } from 'src/types';
import { BncClient } from '@binance-chain/javascript-sdk';
import { BbcSdk } from 'src/send/prepareForBbc/bbcSdk';

export interface IPrepareToTransferOnBbc {
  network: INetwork;
  amount: string;
  from: string;
  to: string;
  asset: string;
  memo?: string;
  sequence?: number;
}

export const prepareToTransferOnBbc = async (data: IPrepareToTransferOnBbc) => {
  const { network } = data;
  const { chainType } = network;

  if (chainType !== 'bbc') {
    throw new Error('Not support for Non-BBC network');
  }

  const bbc = new BbcSdk({ network });
  const { transfer: fee } = await bbc.getGasPrice();

  return {
    fee,
    send: async (privateKey: string) => {
      const client = new BncClient(network.url);
      client.setPrivateKey(privateKey);
      await client.initChain();
      const { result } = await client.transfer(
        data.from,
        data.to,
        data.amount,
        data.asset,
        data.memo,
        data.sequence,
      );

      return { transactionHash: result[0].hash };
    },
  };
};

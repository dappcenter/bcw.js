import { TypedTransaction } from '@ethereumjs/tx';
import { PromiEvent, TransactionReceipt } from 'web3-core';

export type IChainType = 'bsc' | 'bbc' | 'eth';

export type INetwork = {
  url: string;
  chainType: IChainType;
  baseChain?: string;
  hardfork?: string;
};

export type IAsset = {
  networkSymbol?: string;
  decimals?: number;
  contractAddress?: string;
};

export interface ITxData {
  from: string;
  to: string;
  value: string;
  gasPrice?: string;
  gasLimit?: string;
  data?: string;
  nonce?: number;
  privateKey: string;
  network: INetwork;
  asset?: IAsset;
}

export interface ITxReceipt {
  tx: TypedTransaction;
  fee: string;
  signedTx: string;
  send: (tx: string) => PromiEvent<TransactionReceipt>;
}

import { TypedTransaction } from '@ethereumjs/tx';
import { Transaction as BbcTransaction } from '@binance-chain/javascript-sdk';

export type IChainType = 'bsc' | 'bbc' | 'eth';

export type INetwork = {
  url: string;
  chainType: IChainType;
  baseChain?: string;
  hardfork?: string;
};

export type IAsset = {
  networkSymbol: string;
  decimals: number;
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
  network: INetwork;
  asset: IAsset;
}

export interface IBbcTxData extends ITxData {
  memo?: string;
}

export interface IGasLimit {
  to: string;
  data?: string;
  network: INetwork;
  asset: IAsset;
}

export type ISign = {
  signedTx: string;
  signedApprovalTx?: string;
};

export interface ITxReceipt {
  tx: TypedTransaction | BbcTransaction;
  approvalTx?: TypedTransaction | BbcTransaction;
  fee: string;
  sign: (privateKey: string) => ISign;
  send: (tx: ISign) => Promise<{ transactionHash: string }>;
}

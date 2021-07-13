import { TypedTransaction } from '@ethereumjs/tx';
import { Transaction as BbcTransaction, types } from '@binance-chain/javascript-sdk';

export type IChainType = 'bsc' | 'bbc' | 'eth';
export const NETWORK_IDS = [
  'bbc-mainnet',
  'bsc-mainnet',
  'eth-mainnet',
  'bbc-testnet',
  'bsc-testnet',
  'ropsten-testnet',
] as const;

export type INetworkId = typeof NETWORK_IDS[number];
export const CHAIN_IDS = [
  'bsc',
  'chapel',
  'Binance-Chain-Tigris',
  'Binance-Chain-Ganges',
  '1',
  '3',
] as const;

export type IChainId = typeof CHAIN_IDS[number];

export type INetwork = {
  url: string;
  id?: INetworkId;
  chainId?: IChainId;
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
  asset?: IAsset;
}

export interface IBbcTxData extends ITxData {
  memo?: string;
  message?: types.BaseMsg;
  fee?: string;
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
  gasPrice?: string;
  gasLimit?: string;
  approvalTx?: TypedTransaction | BbcTransaction;
  fee: string;
  sign: (privateKey: string) => ISign;
  send: (tx: ISign) => Promise<{ transactionHash: string }>;
}

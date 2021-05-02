import { Transaction } from 'ethereumjs-tx';
import { Transaction as BcTranaction } from '@binance-chain/javascript-sdk';

export enum DerivationPath {
  BBC = `44'/714'/0'/0/`,
  BSC = `m/44'/60'/0'/0/`,
}

export const ACCOUNT_TYPES = ['local', 'ledger', 'imported'] as const;
export type AccountType = typeof ACCOUNT_TYPES[number];

export const WALLET_STATE_VERSIONS = ['v1'] as const;
export type WalletStateVersion = typeof WALLET_STATE_VERSIONS[number];

export type AccountAddress = {
  privateKey: string;
  type: AddressType;
  address: string;
};

interface AccountCommon {
  type: AccountType;
  id: string;
  name: string;
  mnemonic: string | null;
  hdPath?: string;
  accountIndex?: number;
  addresses: AccountAddress[];
}

export interface AccountLocal extends AccountCommon {
  type: 'local' | 'imported';
  id: string;
  name: string;
  mnemonic: string | null;
  isDeprecated: boolean;
  addresses: AccountAddress[];
  email?: string;
}

export interface AccountLedger extends AccountCommon {
  type: 'ledger';
  id: string;
  name: string;
  mnemonic: null;
  isDeprecated: boolean;
  hdPath: string;
  accountIndex: number;
  addresses: AccountAddress[];
}

export type Account = AccountLocal | AccountLedger;

export const ADDRESS_TYPES = ['bbc-mainnet', 'bbc-testnet', 'eth'] as const;
export type AddressType = typeof ADDRESS_TYPES[number];

export type Location = { pathname: string; state?: any; timestamp: string }; // eslint-disable-line @typescript-eslint/no-explicit-any

export interface BcwWalletState {
  version: 'v2';
  accounts: Account[];
  location?: Location;
}

export type SendFundsReturnType = {
  amount: string;
  fee: string;
  feeNetworkSymbol: string;
  send: (tx?: string, approval?: string) => Promise<{ transactionHash: string }>;
  transaction?: Transaction | string | BcTranaction;
  approvalTransaction?: Transaction;
};

export type PrepareSendTransactionReturnType = {
  nonce: string;
  gasPrice: string;
  estimateGas: string;
  fee: string; // calculated human readable fee (estimatedGas * gasPrice)
  method?: string; // the contract method resolved from data field, we only support resolving tokenHub&bep20 contract for now
};

export interface LedgerAccount {
  address: string;
  index: number;
  balance: number;
}

export enum LedgerHdPathType {
  LedgerLive = `m/44'/60'/0'/0/0`,
  Legacy = `m/44'/60'/0'`,
  BBC = `44/714/0/0/0`,
}

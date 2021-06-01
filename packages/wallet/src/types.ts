export enum DerivationPath {
  BBC = `44'/714'/0'/0/`,
  BSC = `m/44'/60'/0'/0/`,
}

export enum EACCOUNT_TYPES {
  LOCAL = 'local',
  LEDGER = 'ledger',
  IMPORTED = 'imported',
}

export const WALLET_STATE_VERSIONS = ['v1'] as const;
export type WalletStateVersion = typeof WALLET_STATE_VERSIONS[number];

export type AccountAddress = {
  privateKey: string;
  type: EADDRESS_TYPES;
  address: string;
};

interface AccountCommon {
  type: EACCOUNT_TYPES;
  id: string;
  name: string;
  mnemonic: string | null;
  hdPath?: string;
  accountIndex?: number;
  addresses: AccountAddress[];
}

export interface AccountLocal extends AccountCommon {
  type: EACCOUNT_TYPES.LOCAL | EACCOUNT_TYPES.IMPORTED;
  id: string;
  name: string;
  mnemonic: string | null;
  isDeprecated: boolean;
  addresses: AccountAddress[];
  email?: string;
}

export interface AccountLedger extends AccountCommon {
  type: EACCOUNT_TYPES.LEDGER;
  id: string;
  name: string;
  mnemonic: null;
  isDeprecated: boolean;
  hdPath: string;
  accountIndex: number;
  addresses: AccountAddress[];
}

export type Account = AccountLocal | AccountLedger;

export enum EADDRESS_TYPES {
  BBC_MAINNET = 'bbc-mainnet',
  BBC_TESTNET = 'bbc_testnet',
  ETH = 'eth',
}

export type Location = { pathname: string; state?: any; timestamp: string }; // eslint-disable-line @typescript-eslint/no-explicit-any

export interface BcwWalletState {
  version: 'v2';
  accounts: Account[];
  location?: Location;
}

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

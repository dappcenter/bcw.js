import { INetwork } from '../src';

// networks
export const BSC_TESTNET_NETWORK: INetwork = {
  chainType: 'bsc',
  url: 'https://data-seed-prebsc-2-s2.binance.org:8545',
};
export const BBC_TESTNET_NETWORK: INetwork = {
  chainType: 'bbc',
  url: 'https://testnet-dex-asiapacific.binance.org',
};

// accounts
export const BSC_ACCOUNT = {
  address: '0xFBC7c1f58DAb89a8eE702DB1CBB49363db42E497',
  privateKey: '0eb0f7ef45b9e7870b452fd66d20438493a9b439f98ca49ae9519a3b34dda066',
};
export const BBC_ACCOUNT = {
  address: 'tbnb1zzt7zg7j40cq0yy4ef2dx3nsns8csp4pgc4vd5',
  privateKey: 'df3256c2f00ee8578a2633f3d8341c3e41b8ab4387ebe7b2589635ef91492cb1',
};

// assets
export const BNB_ASSET = {
  networkSymbol: 'BNB',
  decimals: 18,
  contractAddress: '0x0000000000000000000000000000000000000000',
};
export const BUSD_ASSET = {
  networkSymbol: 'BUSD',
  decimals: 18,
  contractAddress: '0xed24fc36d5ee211ea25a80239fb8c4cfd80f12ee',
};

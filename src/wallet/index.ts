import * as bip39 from 'bip39';

import { AccountAddress, AccountLocal } from '../types';
import { BcwWalletState } from '../types';
import { buildId, getPrivateKeysFromMnemonic } from './utils';
import { buildAddressFromKey } from './buildAddressFromKey';

export const createBcwWallet = async ({
  mnemonicLength = 128,
  mnemonic,
}: {
  mnemonicLength?: 128 | 256;
  mnemonic?: string;
}) => {
  const wallet: BcwWalletState = {
    version: 'v2',
    accounts: [],
  };

  mnemonic = mnemonic || bip39.generateMnemonic(mnemonicLength);
  const defaultAccount = await generateLocalAccount({
    mnemonic,
    accountIndex: 0,
  });
  wallet.accounts.push(defaultAccount);

  return wallet;
};

export const generateLocalAccount = async ({
  mnemonic,
  accountName = 'Account 0',
  accountIndex,
}: {
  mnemonic: string;
  accountName?: string;
  accountIndex: number;
}) => {
  if (!mnemonic) {
    throw new Error('Invalid mnemonic');
  }

  const keys = getPrivateKeysFromMnemonic({ mnemonic, index: accountIndex });

  const account: AccountLocal = {
    type: 'local',
    name: accountName,
    id: await buildId({ privateKey: keys.bbc }),
    mnemonic,
    isDeprecated: false,
    addresses: [
      {
        type: 'bbc-testnet',
        privateKey: keys.bbc,
        address: buildAddressFromKey({
          privateKey: keys.bbc,
          addressType: 'bbc-testnet',
        }),
      },
      {
        type: 'bbc-mainnet',
        privateKey: keys.bbc,
        address: buildAddressFromKey({
          privateKey: keys.bbc,
          addressType: 'bbc-mainnet',
        }),
      },
      {
        type: 'eth',
        privateKey: keys.eth,
        address: buildAddressFromKey({
          privateKey: keys.eth,
          addressType: 'eth',
        }),
      },
    ],
  };

  return account;
};

export const generateImportedAccount = async ({
  privateKey,
  accountName = 'Account 0',
}: {
  privateKey: string;
  accountName?: string;
}) => {
  if (!privateKey) {
    throw new Error('Invalid private key');
  }

  const addresses: AccountAddress[] = [
    {
      type: 'bbc-testnet',
      privateKey,
      address: buildAddressFromKey({ privateKey, addressType: 'bbc-testnet' }),
    },
    {
      type: 'bbc-mainnet',
      privateKey,
      address: buildAddressFromKey({ privateKey, addressType: 'bbc-mainnet' }),
    },
    {
      type: 'eth',
      privateKey,
      address: buildAddressFromKey({ privateKey, addressType: 'eth' }),
    },
  ];

  const importedAccount: AccountLocal = {
    type: 'imported',
    name: accountName,
    id: await buildId({
      privateKey,
    }),
    mnemonic: null,
    isDeprecated: false,
    addresses,
  };

  return importedAccount;
};

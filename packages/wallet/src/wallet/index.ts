import * as bip39 from 'bip39';

import { AccountAddress, AccountLocal, EACCOUNT_TYPES, EADDRESS_TYPES } from '../types';
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
    type: EACCOUNT_TYPES.LOCAL,
    name: accountName,
    id: await buildId({ privateKey: keys.bbc }),
    mnemonic,
    isDeprecated: false,
    addresses: [
      {
        type: EADDRESS_TYPES.BBC_TESTNET,
        privateKey: keys.bbc,
        address: buildAddressFromKey({
          privateKey: keys.bbc,
          addressType: EADDRESS_TYPES.BBC_TESTNET,
        }),
      },
      {
        type: EADDRESS_TYPES.BBC_MAINNET,
        privateKey: keys.bbc,
        address: buildAddressFromKey({
          privateKey: keys.bbc,
          addressType: EADDRESS_TYPES.BBC_MAINNET,
        }),
      },
      {
        type: EADDRESS_TYPES.ETH,
        privateKey: keys.eth,
        address: buildAddressFromKey({
          privateKey: keys.eth,
          addressType: EADDRESS_TYPES.ETH,
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
      type: EADDRESS_TYPES.BBC_TESTNET,
      privateKey,
      address: buildAddressFromKey({ privateKey, addressType: EADDRESS_TYPES.BBC_TESTNET }),
    },
    {
      type: EADDRESS_TYPES.BBC_MAINNET,
      privateKey,
      address: buildAddressFromKey({ privateKey, addressType: EADDRESS_TYPES.BBC_MAINNET }),
    },
    {
      type: EADDRESS_TYPES.ETH,
      privateKey,
      address: buildAddressFromKey({ privateKey, addressType: EADDRESS_TYPES.ETH }),
    },
  ];

  const importedAccount: AccountLocal = {
    type: EACCOUNT_TYPES.IMPORTED,
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

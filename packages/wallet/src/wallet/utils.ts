import { utils } from '@binance-chain/javascript-sdk';
import * as bip39 from 'bip39';
import { crypto as bCrypto } from '@binance-chain/javascript-sdk';
import * as ethers from 'ethers';

import { BcwWalletState, DerivationPath } from '../types';
import { buildAddressFromKey } from './buildAddressFromKey';

export function generateNewAccountName(wallet: BcwWalletState) {
  const indexes: number[] = [];
  wallet.accounts.forEach((it) => {
    const matches = it.name.match(/Account (\d+)/i);
    if (!matches) return;

    indexes.push(Number.parseInt(matches[1], 10));
  });

  return `Account ${indexes.length}`;
}

export async function buildId({ privateKey }: { privateKey: string }) {
  return utils.sha3(buildAddressFromKey({ privateKey, addressType: 'bbc-mainnet' }));
}

export const getPrivateKeysFromMnemonic = ({
  mnemonic,
  index = 0,
}: {
  mnemonic: string;
  index?: number;
}) => {
  if (!bip39.validateMnemonic(mnemonic)) {
    throw new Error('Invalid mnemonic');
  }

  return {
    bbc: bCrypto.getPrivateKeyFromMnemonic(mnemonic, true, index),
    eth: ethers.Wallet.fromMnemonic(mnemonic, DerivationPath.BSC + index).privateKey,
  } as const;
};

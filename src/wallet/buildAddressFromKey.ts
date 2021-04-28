import Web3 from 'web3';
import { crypto } from '@binance-chain/javascript-sdk';

import type { AddressType } from '../types';

const buildForEth = ({ privateKey }: { privateKey: string }) => {
  const web3 = new Web3(new Web3.providers.HttpProvider(''));
  const { address } = web3.eth.accounts.privateKeyToAccount(privateKey);
  return address;
};

const buildForBbc = ({
  privateKey,
  addressType,
}: {
  privateKey: string;
  addressType: AddressType;
}) => {
  return crypto.getAddressFromPrivateKey(
    privateKey,
    addressType === 'bbc-testnet' ? 'tbnb' : 'bnb',
  );
};

export const buildAddressFromKey = ({
  privateKey,
  addressType,
}: {
  privateKey: string;
  addressType: AddressType;
}): string => {
  if (addressType !== 'eth') return buildForBbc({ privateKey, addressType });
  return buildForEth({ privateKey });
};

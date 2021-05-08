import Web3 from 'web3';
import { crypto } from '@binance-chain/javascript-sdk';

import { EADDRESS_TYPES } from '../types';

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
  addressType: EADDRESS_TYPES;
}) => {
  return crypto.getAddressFromPrivateKey(
    privateKey,
    addressType === EADDRESS_TYPES.BBC_TESTNET ? 'tbnb' : 'bnb',
  );
};

export const buildAddressFromKey = ({
  privateKey,
  addressType,
}: {
  privateKey: string;
  addressType: EADDRESS_TYPES;
}): string => {
  if (addressType !== EADDRESS_TYPES.ETH) return buildForBbc({ privateKey, addressType });
  return buildForEth({ privateKey });
};

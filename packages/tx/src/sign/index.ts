import { IChainType } from 'src/types';
import { signMessageSecp256k1, getSecp256k1PublicKey } from './bbc';
import { getEthPublicKey, signMessage } from './bsc';

export interface IRequestSign {
  privateKey: string;
  message: string;
  networkType: IChainType;
}

export const requestSign = (data: IRequestSign) => {
  const { networkType } = data;

  if (networkType === 'bbc') {
    return {
      signature: signMessageSecp256k1(data),
      publicKey: getSecp256k1PublicKey(data),
    };
  }

  return {
    publicKey: getEthPublicKey(data),
    signature: signMessage(data),
  };
};

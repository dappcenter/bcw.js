import { ITxData } from 'src/types';
import { prepareForBscOrEth } from './prepareForBscOrEth';
import { prepareForBbc } from './prepareForBbc';
import { prepareForBscToBbc } from './prepareForBscToBbc';
import { isBbcAddress } from 'src/utils';

export const prepareToSendTx = (txData: ITxData) => {
  const { network, to } = txData;
  const { chainType } = network;

  if (chainType === 'bbc') {
    return prepareForBbc(txData);
  }

  if (chainType === 'bsc' && isBbcAddress(to)) {
    return prepareForBscToBbc(txData);
  }

  return prepareForBscOrEth(txData);
};

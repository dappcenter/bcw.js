import { ITxData } from 'src/types';
import { prepareForBscOrEth } from './prepareForBscOrEth';
import { prepareForBbc } from './prepareForBbc';
import { prepareForBscToBbc } from './prepareForBscToBbc';

export const prepareToSendTx = (txData: ITxData) => {
  const { network, to } = txData;
  const { chainType } = network;

  if (chainType === 'bbc') {
    return prepareForBbc(txData);
  }

  if (chainType === 'bsc' && /^t?bnb/.test(to)) {
    return prepareForBscToBbc(txData);
  }

  return prepareForBscOrEth(txData);
};

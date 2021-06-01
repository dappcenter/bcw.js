import { ITxData } from 'src/types';
import { prepareForBbcToBsc } from './prepareForBbcToBsc';
import { prepareForBscOrEth } from './prepareForBscOrEth';
import { prepareForBbc } from './prepareForBbc';
import { prepareForBscToBbc } from './prepareForBscToBbc';

export const prepareToSendTx = (txData: ITxData) => {
  const { network, to } = txData;
  const { chainType } = network;

  if (chainType === 'bbc') {
    if (/^0x/.test(to)) {
      return prepareForBbcToBsc(txData);
    }

    return prepareForBbc(txData);
  }

  if (chainType === 'bsc' && /^t?bnb/.test(to)) {
    return prepareForBscToBbc(txData);
  }

  return prepareForBscOrEth(txData);
};

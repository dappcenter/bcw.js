import { ITxData } from 'src/types';

const prepareApprove = (txData: ITxData) => {
  const { network } = txData;
  const { chainType } = network;

  if (chainType === 'bbc') {
    console.log('Not support for BBC network');
    return;
  }
};

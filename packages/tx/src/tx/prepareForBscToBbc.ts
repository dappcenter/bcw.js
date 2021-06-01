import { ITxData, ITxReceipt } from 'src/types';

export const prepareForBscToBbc = (txData: ITxData): Promise<ITxReceipt> => {
  console.log(txData, 'Not implement');
  return {} as Promise<ITxReceipt>;
};

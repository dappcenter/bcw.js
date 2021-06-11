import Big, { BigSource } from 'big.js';

export const formatAmount = (value: BigSource, decimals: string | number | undefined) => {
  return new Big(value).times(`1e${decimals || 18}`).toFixed();
};

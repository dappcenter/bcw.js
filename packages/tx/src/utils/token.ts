import { IChainType } from 'src/types';

type INativeToken = {
  chainType: IChainType;
  networkSymbol: string;
  isContract?: boolean;
};

export const isNativeToken = ({ chainType, networkSymbol, isContract }: INativeToken) => {
  if (isContract) return false;

  const symbol = networkSymbol.toUpperCase();
  return (symbol === 'BNB' && chainType === 'bsc') || (symbol === 'ETH' && chainType === 'eth');
};

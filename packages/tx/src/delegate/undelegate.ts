import { types } from '@binance-chain/javascript-sdk';
import Big from 'big.js';
import { INetwork, IChainId } from '../types';
import { prepareForBbc } from 'src/send/prepareForBbc';
import { BBC_BASE_DECIMAIL } from '../constants';
import { BbcSdk } from '../send/prepareForBbc/bbcSdk';

export interface IPrepareToUndelegate {
  network: INetwork;
  address: string;
  validatorAddress: string;
  amount: string;
  sideChainId: IChainId;
}

export const prepareToUndelegate = async (data: IPrepareToUndelegate) => {
  const { network, amount, sideChainId } = data;
  const symbol = 'BNB';

  const bbc = new BbcSdk({ network });
  const fee = await (await bbc.getGasPrice()).undelegate;

  const message = new types.BscUndelegateMsg({
    delegator_addr: data.address,
    validator_addr: data.validatorAddress,
    amount: {
      denom: symbol,
      amount: Number(new Big(amount).mul(BBC_BASE_DECIMAIL).toString()),
    },
    side_chain_id: sideChainId,
  });

  return await prepareForBbc({
    from: data.address,
    to: '',
    fee,
    network,
    value: amount,
    message,
    asset: {
      networkSymbol: symbol,
      decimals: 18,
    },
  });
};

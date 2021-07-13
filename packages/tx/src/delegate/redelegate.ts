import { types } from '@binance-chain/javascript-sdk';
import Big from 'big.js';
import { INetwork, IChainId } from '../types';
import { prepareForBbc } from 'src/send/prepareForBbc';
import { BBC_BASE_DECIMAIL } from '../constants';
import { BbcSdk } from '../send/prepareForBbc/bbcSdk';

export interface IPrepareToRedelegate {
  network: INetwork;
  address: string;
  originalValidatorAddress: string;
  newValidatorAddress: string;
  amount: string;
  sideChainId: IChainId;
}

export const prepareToRedelegate = async (data: IPrepareToRedelegate) => {
  const { network, amount, sideChainId } = data;
  const symbol = 'BNB';

  const bbc = new BbcSdk({ network });
  const fee = await (await bbc.getGasPrice()).redelegate;

  const message = new types.BscReDelegateMsg({
    delegator_addr: data.address,
    validator_src_addr: data.originalValidatorAddress,
    validator_dst_addr: data.newValidatorAddress,
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

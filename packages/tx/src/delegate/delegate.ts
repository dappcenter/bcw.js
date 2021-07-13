import { types } from '@binance-chain/javascript-sdk';
import Big from 'big.js';
import { INetwork, IChainId, IAsset } from '../types';
import { prepareForBbc } from 'src/send/prepareForBbc';
import { BBC_BASE_DECIMAIL } from '../constants';
import { BbcSdk } from '../send/prepareForBbc/bbcSdk';
import { prepareForBscToBbc } from '../send/prepareForBscToBbc';
import Web3 from 'web3';

export interface IPrepareToDelegate {
  network: INetwork;
  address: string;
  validatorAddress: string;
  amount: string;
  /**
   * bbc-mainnet -> bsc-mainnet chainId: bsc
   * bbc-testnet -> bsc-testnet chainId: chapel
   * e.g. if you select network is bbc-mainnet, that sideChainId should be bsc-mainet's chainId
   */
  sideChainId: IChainId;
}

export interface IPrepareToDelegateOnBsc extends IPrepareToDelegate {
  bbcNetwork: INetwork;
  bbcAddress: string;
  asset: IAsset;
}

const _getMessage = (data: IPrepareToDelegate) => {
  const { sideChainId, amount } = data;
  const symbol = 'BNB';

  const message = new types.BscDelegateMsg({
    delegator_addr: data.address,
    validator_addr: data.validatorAddress,
    delegation: {
      denom: symbol,
      amount: Number(new Big(amount).mul(BBC_BASE_DECIMAIL).toString()),
    },
    side_chain_id: sideChainId,
  });
  return message;
};

export const prepareToDelegateOnBsc = async (data: IPrepareToDelegateOnBsc) => {
  const { network, amount } = data;
  const bbc = new BbcSdk({ network: data.bbcNetwork });
  const delegateFee = await (await bbc.getGasPrice()).delegate;
  const { fee: transferFee, sign } = await prepareForBscToBbc({
    network,
    from: data.address,
    to: data.bbcAddress,
    value: amount,
    asset: data.asset,
  });
  const fee = new Big(delegateFee).add(transferFee).toFixed();

  return {
    fee,
    send: async (bbcPrivateKey: string, bscPrivateKey: string) => {
      const sendPromise = new Promise((resolve) => {
        const web3 = new Web3(new Web3.providers.HttpProvider(network.url));
        const sent = web3.eth.sendSignedTransaction(sign(bscPrivateKey).signedTx);

        return sent.on('receipt', (receipt) => resolve(receipt.transactionHash));
      });
      const timeoutPromise = new Promise((resolve) =>
        setTimeout(() => resolve('TIME_OUT'), 180000),
      );

      return Promise.race([sendPromise, timeoutPromise]).then(async (result) => {
        if (result === 'TIME_OUT') {
          throw new Error(
            'The request is time out. Please wait for BNB to arrive at your BC account. If you wish to continue staking BNB, switch to "Binance Chain" network, then send delegate transaction again.',
          );
        }

        // start delegate
        const { send: delegate, sign: _sign } = await prepareForBbc({
          from: data.bbcAddress || '',
          to: data.validatorAddress,
          fee,
          network: data.bbcNetwork,
          value: data.amount,
          message: _getMessage({ ...data, address: data.bbcAddress }),
          asset: data.asset,
        });
        return delegate(_sign(bbcPrivateKey));
      });
    },
  };
};

export const prepareToDelegateOnBbc = async (data: IPrepareToDelegate) => {
  const { network, amount } = data;
  const symbol = 'BNB';

  const bbc = new BbcSdk({ network });
  const fee = await (await bbc.getGasPrice()).delegate;

  return await prepareForBbc({
    from: data.address,
    to: data.validatorAddress,
    fee,
    network,
    value: amount,
    message: _getMessage(data),
    asset: {
      networkSymbol: symbol,
      decimals: 18,
    },
  });
};

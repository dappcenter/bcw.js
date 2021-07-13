import { BncClient, Transaction, types } from '@binance-chain/javascript-sdk';
import Big from 'big.js';
import { IBbcTxData, ITxReceipt, ISign } from 'src/types';
import { BBC_BASE_DECIMAIL, BBC_SOURCE_CODE } from 'src/constants';
import { isBscAddress } from 'src/utils/address';
import { BbcSdk } from './bbcSdk';
import { INetwork } from '../../types/index';

const _getBbcMessage = (txData: IBbcTxData) => {
  const outputs: types.SignInputOutput[] = [
    {
      address: txData.from,
      coins: [
        {
          denom: txData.asset?.networkSymbol as string,
          amount: Number(new Big(txData.value).mul(BBC_BASE_DECIMAIL).toString()),
        },
      ],
    },
  ];

  return new types.SendMsg(txData.from, outputs);
};

const _getBbcToBscMessage = (txData: IBbcTxData) => {
  const expireTime = (() => {
    const d = new Date(Date.now());
    d.setMinutes(d.getMinutes() + 60);
    return d.getTime();
  })();
  const transferOut = new types.TransferOutMsg({
    from: txData.from,
    to: txData.to,
    expire_time: expireTime,
    amount: { denom: txData.asset?.networkSymbol as string, amount: txData.value },
  });
  return transferOut;
};

const _buildTx = async ({
  message,
  from,
  network,
  memo,
}: {
  message: types.BaseMsg;
  from: string;
  network: INetwork;
  memo?: string;
}) => {
  const bbc = new BbcSdk({ network });
  const [account, nodeInfo] = await Promise.all([bbc.getAccount(from), bbc.getNodeInfo()]);
  const txParams = {
    chainId: nodeInfo.node_info.network,
    accountNumber: account.account_number,
    sequence: account.sequence,
    baseMsg: message,
    memo: memo ?? '',
    source: BBC_SOURCE_CODE,
  };

  if (__DEV__) console.log('txParams: ', txParams);
  return new Transaction(txParams);
};

export const prepareForBbc = async (txData: IBbcTxData): Promise<ITxReceipt> => {
  const { network } = txData;
  const client = new BncClient(network.url);
  await client.initChain();

  const isBsc = isBscAddress(txData.to);
  const message = txData.message || (isBsc ? _getBbcToBscMessage(txData) : _getBbcMessage(txData));
  const tx = await _buildTx({ message, from: txData.from, network });

  const fee = await (async () => {
    if (txData.fee) return txData.fee;
    const bbc = new BbcSdk({ network });
    const fees = await bbc.getGasPrice();
    return isBsc ? fees.transferToBsc : fees.transfer;
  })();

  return {
    tx,
    fee,
    sign: (privateKey: string) => {
      return {
        signedTx: tx.sign(privateKey).serialize(),
      };
    },
    send: async (tx: ISign) => {
      type IResult = { ok: boolean; hash: string; log: string; code: number } | undefined;
      const result = (await client.sendRawTransaction(tx.signedTx)).result[0] as IResult;

      if (!result || !result.ok) {
        throw new Error(`Transaction failed: ${result?.code}: ${result?.log}`);
      }
      return { transactionHash: result.hash };
    },
  };
};

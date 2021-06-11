import { BncClient, Transaction, types } from '@binance-chain/javascript-sdk';
import Big from 'big.js';
import { IBbcTxData, ITxReceipt, ISign } from 'src/types';
import { BBC_BASE_DECIMAIL, BBC_SOURCE_CODE } from 'src/constants';
import { isBscAddress } from 'src/utils/address';
import { BbcSdk } from './bbcSdk';

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

export const prepareForBbc = async (txData: IBbcTxData): Promise<ITxReceipt> => {
  const { network } = txData;
  const client = new BncClient(network.url);
  await client.initChain();

  const bbc = new BbcSdk({ network });
  const isBsc = isBscAddress(txData.to);
  const message = isBsc ? _getBbcToBscMessage(txData) : _getBbcMessage(txData);
  const [fees, account, nodeInfo] = await Promise.all([
    bbc.getGasPrice(),
    bbc.getAccount(txData.from),
    bbc.getNodeInfo(),
  ]);

  const txParams = {
    chainId: nodeInfo.node_info.network,
    accountNumber: account.account_number,
    sequence: account.sequence,
    baseMsg: message,
    memo: txData.memo ?? '',
    source: BBC_SOURCE_CODE,
  };

  const tx = new Transaction(txParams);

  return {
    tx,
    fee: isBsc ? fees.crossTransferFee : fees.bbcFee,
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

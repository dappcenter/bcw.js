import { ITxData, ITxReceipt } from 'src/types';
import { decode } from 'bech32-buffer';
import Web3 from 'web3';
import Big from 'big.js';

import { tokenHubAbi, tokenHubContractAddress } from './abis/tokenHub';
import { bep20Abi } from './abis/bep20';
import { formatAmount } from '../utils';
import { prepareForBscOrEth } from './prepareForBscOrEth';
import { TypedTransaction } from '@ethereumjs/tx';
import { ISign } from '../types/index';
import { BSC_TO_BBC_GAS_LIMIT } from '../constants/index';

const _buildApprovalTx = async (txData: ITxData) => {
  const { network, asset, value: amount } = txData;
  const contractAddress = asset?.contractAddress as string;

  if (asset?.networkSymbol === 'BNB') {
    console.debug('No need for any approval for BNB');
    return;
  }

  if (!contractAddress) {
    throw new Error(`Asset "${asset?.networkSymbol} does not have a contract address"`);
  }

  const web3 = new Web3(new Web3.providers.HttpProvider(network.url));
  const bep20Contract = new web3.eth.Contract(bep20Abi, contractAddress);

  const allowanceABI = bep20Contract.methods
    .allowance(txData.from, tokenHubContractAddress)
    .encodeABI();

  const allowance = await (async () => {
    const result = await web3.eth.call({
      from: txData.from,
      to: contractAddress,
      value: '0',
      data: allowanceABI,
    });
    return new Big(web3.utils.fromWei(web3.utils.hexToNumberString(result))).toString();
  })();

  if (new Big(allowance).gte(amount)) {
    console.debug({ allowance, amount }, 'Amount is within allowance');
    return;
  }

  if (__DEV__)
    console.debug({ allowance, amount }, 'Amount is not within allowance. Approval is needed.');

  const maxAmount = web3.utils.toHex(formatAmount(new Big(amount).mul(10 ** 2), asset?.decimals));
  const approvedABI = bep20Contract.methods.approve(tokenHubContractAddress, maxAmount).encodeABI();

  return prepareForBscOrEth({
    ...txData,
    value: '0',
    to: contractAddress,
    data: approvedABI,
  });
};

export const prepareForBscToBbc = async (txData: ITxData): Promise<ITxReceipt> => {
  const { network, asset } = txData;
  const web3 = new Web3(new Web3.providers.HttpProvider(network.url));
  const decodeTo = `0x${Buffer.from(decode(txData.to).data).toString('hex')}`;

  const tokenHubContract = new web3.eth.Contract(tokenHubAbi, tokenHubContractAddress);
  const relayFeeWei = await tokenHubContract.methods.getMiniRelayFee().call();
  const approvalTx = await _buildApprovalTx(txData);

  const amountWei = formatAmount(txData.value, asset?.decimals);
  const expireTime = (() => {
    const d = new Date(Date.now());
    d.setMinutes(d.getMinutes() + 60);
    return d.getTime();
  })();

  const value = web3.utils.fromWei(
    new Big(relayFeeWei).add(asset?.networkSymbol === 'BNB' ? amountWei : 0).toString(),
  );
  const nonce = approvalTx ? (approvalTx?.tx as TypedTransaction).nonce.toNumber() + 1 : 0;
  const transferOutTx = await prepareForBscOrEth({
    ...txData,
    nonce,
    data: tokenHubContract.methods
      .transferOut(asset?.contractAddress, decodeTo, web3.utils.toHex(amountWei), expireTime)
      .encodeABI(),
    to: tokenHubContractAddress,
    value,
    gasLimit: approvalTx ? BSC_TO_BBC_GAS_LIMIT.toString() : undefined,
  });

  const fee = new Big(transferOutTx.fee)
    .add(approvalTx?.fee ?? 0)
    .add(web3.utils.fromWei(relayFeeWei))
    .toFixed();

  return {
    fee,
    gasLimit: transferOutTx.gasLimit,
    gasPrice: new Big(fee)
      .div((transferOutTx.tx as TypedTransaction).gasLimit.toString())
      .toFixed(),
    approvalTx: approvalTx?.tx,
    tx: transferOutTx.tx,
    sign: (privateKey: string) => {
      return {
        signedTx: transferOutTx.sign(privateKey).signedTx,
        signedApprovalTx: approvalTx?.sign(privateKey).signedTx,
      };
    },
    send: async (tx: ISign) => {
      if (tx.signedApprovalTx) {
        await web3.eth.sendSignedTransaction(tx.signedApprovalTx);
      }
      return web3.eth.sendSignedTransaction(tx.signedTx);
    },
  };
};

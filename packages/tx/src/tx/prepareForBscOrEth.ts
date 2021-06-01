import Web3 from 'web3';
import { TransactionFactory } from '@ethereumjs/tx';
import ethCommon from '@ethereumjs/common';
import Big from 'big.js';
import ert20TokenAbi from 'human-standard-token-abi';
import { cloneDeep } from 'lodash';

import { ITxData, ITxReceipt } from 'src/types';

export const ESTIMATE_GAS_MULTIPLIER = 3;

type ISendTxOption = {
  isNativeToken?: boolean;
};

const _prepareToSendTx = async (
  txData: ITxData,
  { isNativeToken }: ISendTxOption = {},
): Promise<ITxReceipt> => {
  const { network, from, privateKey, asset } = txData;
  const web3 = new Web3(new Web3.providers.HttpProvider(network.url));
  const value = new Big(txData.value).times(`1e${asset?.decimals || 18}`);
  const gasPrice = txData.gasPrice
    ? await web3.utils.toWei(txData.gasPrice, 'Gwei')
    : await web3.eth.getGasPrice();

  const txParam = {
    to: txData.to,
    gasPrice: web3.utils.toHex(gasPrice),
    value: web3.utils.toHex(value.toString()),
    gasLimit: txData.gasLimit || (isNativeToken ? '21000' : txData.gasLimit),
    data: txData.data || '',
    nonce: await web3.eth.getTransactionCount(from, 'pending'),
  };

  // GasLimit
  if (!txParam.gasLimit) {
    txParam.gasLimit = Math.ceil(
      (await web3.eth.estimateGas(txParam)) * ESTIMATE_GAS_MULTIPLIER,
    ).toString();
  }
  txParam.gasLimit = web3.utils.toHex(txParam.gasLimit as string);

  // Transfer to non-nativeToken coins
  if (!isNativeToken) {
    if (!asset?.contractAddress)
      throw new Error(`Asset "${asset?.networkSymbol} does not have a contract address"`);

    const contract = new web3.eth.Contract(ert20TokenAbi, asset?.contractAddress);
    const data = contract.methods.transfer(txData.to, txParam.value).encodeABI();

    txParam.data = web3.utils.toHex(data);
    txParam.to = asset?.contractAddress;
    txParam.value = web3.utils.toHex(0);
  }

  const common = ethCommon.forCustomChain(
    network.baseChain || 'mainnet',
    { url: network.url },
    network.hardfork || 'chainstart',
  );
  const tx = TransactionFactory.fromTxData(txParam, { common });

  const _privateKey = Buffer.from(privateKey, 'hex');
  const signedTx = tx.sign(_privateKey);
  const serializedTx = signedTx.serialize();

  return {
    tx,
    fee: web3.utils.fromWei(tx.gasPrice.mul(tx.gasLimit)),
    signedTx: `0x${serializedTx.toString('hex')}`,
    send: (tx: string) => web3.eth.sendSignedTransaction(tx),
  };
};

export const prepareForBscOrEth = (txData: ITxData): Promise<ITxReceipt> => {
  const { network, asset } = txData;
  const _txData = cloneDeep(txData);
  const option = {
    isNativeToken: ['BNB', 'ETH'].includes(asset?.networkSymbol?.toUpperCase() || ''),
  };

  if (network.chainType === 'eth') {
    _txData.network.hardfork = network.hardfork || 'homestead';
  }

  return _prepareToSendTx(txData, option);
};

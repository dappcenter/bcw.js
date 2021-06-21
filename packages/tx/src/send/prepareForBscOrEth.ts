import Web3 from 'web3';
import { TransactionFactory } from '@ethereumjs/tx';
import ethCommon from '@ethereumjs/common';
import ert20TokenAbi from 'human-standard-token-abi';
import { cloneDeep } from 'lodash';

import { ISign, ITxData, ITxReceipt } from 'src/types';
import { formatAmount } from 'src/utils';
import { ESTIMATE_GAS_MULTIPLIER, DEFAULT_GAS_LIMIT } from 'src/constants';

type ISendTxOption = {
  isNativeToken?: boolean;
};

const _prepareToSendTx = async (
  txData: ITxData,
  { isNativeToken }: ISendTxOption = {},
): Promise<ITxReceipt> => {
  const { network, from, asset } = txData;
  const web3 = new Web3(new Web3.providers.HttpProvider(network.url));
  const value = formatAmount(txData.value, asset?.decimals);
  const gasPrice = txData.gasPrice
    ? await web3.utils.toWei(txData.gasPrice, 'Gwei')
    : await web3.eth.getGasPrice();

  const txParam = {
    from: txData.from,
    to: txData.to,
    gasPrice: web3.utils.toHex(gasPrice),
    value: web3.utils.toHex(value),
    gasLimit: txData.gasLimit ?? (isNativeToken ? DEFAULT_GAS_LIMIT : ''),
    data: txData.data || '',
    nonce: txData.nonce || (await web3.eth.getTransactionCount(from, 'pending')),
  };

  // Transfer to non-nativeToken coins
  if (!isNativeToken && !txData.data) {
    if (!asset?.contractAddress)
      throw new Error(`Asset "${asset?.networkSymbol} does not have a contract address"`);

    const contract = new web3.eth.Contract(ert20TokenAbi, asset?.contractAddress);
    const data = contract.methods.transfer(txData.to, txParam.value).encodeABI();

    txParam.data = web3.utils.toHex(data);
    txParam.to = asset?.contractAddress;
    txParam.value = web3.utils.toHex(0);
  }

  // GasLimit
  if (!txParam.gasLimit) {
    txParam.gasLimit = Math.ceil(
      (await web3.eth.estimateGas(txParam)) * ESTIMATE_GAS_MULTIPLIER,
    ).toString();
  }
  txParam.gasLimit = web3.utils.toHex(txParam.gasLimit as string);

  if (__DEV__) {
    console.debug('txParam: ', txParam);
  }

  const common = ethCommon.forCustomChain(
    network.baseChain || 'mainnet',
    { url: network.url },
    network.hardfork || 'chainstart',
  );
  const tx = TransactionFactory.fromTxData(txParam, { common });

  return {
    tx,
    fee: web3.utils.fromWei(tx.gasPrice.mul(tx.gasLimit)),
    gasLimit: tx.gasLimit.toString(),
    gasPrice: web3.utils.fromWei(tx.gasPrice),
    sign: (privateKey: string) => {
      const _privateKey = Buffer.from(privateKey, 'hex');
      const signedTx = tx.sign(_privateKey);
      const serializedTx = signedTx.serialize();

      return {
        signedTx: `0x${serializedTx.toString('hex')}`,
      };
    },
    send: (tx: ISign) => web3.eth.sendSignedTransaction(tx.signedTx),
  };
};

export const prepareForBscOrEth = (txData: ITxData): Promise<ITxReceipt> => {
  const { network, asset } = txData;
  const _txData = cloneDeep(txData);
  const assetSymbol = asset?.networkSymbol?.toUpperCase() || '';
  const option = {
    isNativeToken:
      (!txData.data && assetSymbol === 'BNB' && network.chainType === 'bsc') ||
      (assetSymbol === 'ETH' && network.chainType === 'eth'),
  };

  if (network.chainType === 'eth') {
    _txData.network.hardfork = network.hardfork || 'homestead';
  }

  return _prepareToSendTx(txData, option);
};

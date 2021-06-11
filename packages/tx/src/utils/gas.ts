import { ITxData } from 'src/types';
import Web3 from 'web3';
import ert20TokenAbi from 'human-standard-token-abi';
import { ESTIMATE_GAS_MULTIPLIER } from 'src/constants';
import { formatAmount } from 'src/utils/formatAmount';
import { isNativeToken } from 'src/utils/token';

export const getGasLimit = async (txData: ITxData) => {
  const { network, asset } = txData;
  const { chainType, url } = network || {};

  if (chainType === 'bbc') {
    console.debug('Not support for BBC network');
    return;
  }

  const _isNative = isNativeToken({
    chainType,
    networkSymbol: asset.networkSymbol,
    isContract: !!txData.data,
  });
  const web3 = new Web3(new Web3.providers.HttpProvider(url));

  if (!_isNative) {
    if (!asset?.contractAddress)
      throw new Error(`Asset "${asset?.networkSymbol} does not have a contract address"`);

    const value = web3.utils.toHex(formatAmount(txData.value, asset?.decimals));
    const contract = new web3.eth.Contract(ert20TokenAbi, asset?.contractAddress);
    const data = contract.methods.transfer(txData.to, value).encodeABI();
    txData.data = data;
  }

  const gasLimit = await web3.eth.estimateGas({
    to: txData.to,
    data: txData.data,
  });

  if (_isNative) return gasLimit;
  return gasLimit * ESTIMATE_GAS_MULTIPLIER;
};

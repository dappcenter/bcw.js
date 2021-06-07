import { INetwork, prepareToSendTx } from '../src';
import { IBbcTxData } from '../src/types/index';

const BSC_TESTNET_NETWORK: INetwork = {
  chainType: 'bbc',
  url: 'https://testnet-dex-asiapacific.binance.org',
};
const PRIVATE_KEYS = {
  bsc: 'd2924a28df49b148e0dfbd1e5558913507e07c9a289c292cc50cea7f6b5f68fc',
};
const BSC_BNB_DATA: IBbcTxData = {
  from: 'tbnb1sndxdzsg42jg8lc0hehx8dzzpyfxrvq937mt0w',
  to: 'tbnb1x2d9sjleufa7ueve3y5n7a7c6hs8k8r8mx5rdh',
  value: '0.002',
  network: BSC_TESTNET_NETWORK,
  asset: {
    networkSymbol: 'BNB',
    decimals: 18,
  },
  memo: 'test',
};

describe('prepareForBbc', () => {
  it('Send BNB on BBC', async () => {
    const { sign, send } = await prepareToSendTx(BSC_BNB_DATA);
    const result = await send(sign(PRIVATE_KEYS.bsc));

    expect(result).toHaveProperty('transactionHash');
  });

  it('Transfer BNB from BBC to BSC', async () => {
    const { sign, send } = await prepareToSendTx({
      ...BSC_BNB_DATA,
      to: '0xb38784c5Ebd7c41aB3708dbD96e12dce967Ece49',
    });
    const result = await send(sign(PRIVATE_KEYS.bsc));

    expect(result).toHaveProperty('transactionHash');
  });
});

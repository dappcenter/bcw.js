import { getGasLimit } from 'src/utils';
import { BSC_TESTNET_NETWORK, BSC_ACCOUNT, BNB_ASSET, BUSD_ASSET } from './mock';

describe('getGasLimit', () => {
  it('Get native token gas limit', async () => {
    const gasLimit = await getGasLimit({
      network: BSC_TESTNET_NETWORK,
      to: BSC_ACCOUNT.address,
      asset: BNB_ASSET,
      value: '1',
      from: BSC_ACCOUNT.address,
    });

    expect(gasLimit).toEqual(21000);
  });

  it('Get BUSD gas limit', async () => {
    const gasLimit = await getGasLimit({
      network: BSC_TESTNET_NETWORK,
      to: BSC_ACCOUNT.address,
      asset: BUSD_ASSET,
      from: BSC_ACCOUNT.address,
      value: '1000000',
    });

    console.log(gasLimit);
  });
});

import { prepareToSendTx, INetwork, ITxData } from '../src';

const BSC_TESTNET_NETWORK: INetwork = {
  chainType: 'bsc',
  url: 'https://data-seed-prebsc-2-s2.binance.org:8545',
};
const BSC_BNB_DATA: ITxData = {
  from: '0xFBC7c1f58DAb89a8eE702DB1CBB49363db42E497',
  to: '0x63E5D0da38AAd993fa6b486174373e5315038130',
  value: '0.002',
  privateKey: '0eb0f7ef45b9e7870b452fd66d20438493a9b439f98ca49ae9519a3b34dda066',
  network: BSC_TESTNET_NETWORK,
  asset: {
    networkSymbol: 'BNB',
    decimals: 18,
  },
};
const BSC_BUSD_DATA: ITxData = {
  from: '0xFBC7c1f58DAb89a8eE702DB1CBB49363db42E497',
  to: '0x63E5D0da38AAd993fa6b486174373e5315038130',
  value: '0.001',
  privateKey: '0eb0f7ef45b9e7870b452fd66d20438493a9b439f98ca49ae9519a3b34dda066',
  network: BSC_TESTNET_NETWORK,
  asset: {
    networkSymbol: 'BUSD',
    decimals: 18,
    contractAddress: '0xed24fc36d5ee211ea25a80239fb8c4cfd80f12ee',
  },
};

const knownTxRegExp = /(already known)|(known transaction)/;

describe('prepareForBscOrEth', () => {
  it('Sign transaction', async () => {
    const { signedTx } = await prepareToSendTx(BSC_BNB_DATA);

    expect(signedTx).toMatch(/0x\w+/);
  });

  it('Transfer BNB on BSC', async () => {
    try {
      const { signedTx, fee, send } = await prepareToSendTx(BSC_BNB_DATA);
      const result = await send(signedTx);

      expect(result).toHaveProperty('transactionHash');
      expect(fee).toMatch('0.00021'); // 210000 Gwei
    } catch (error) {
      expect(error.message).toMatch(knownTxRegExp);
    }
  });

  it('Transfer BUSD on BSC', async () => {
    try {
      const { signedTx, send } = await prepareToSendTx(BSC_BUSD_DATA);
      const result = await send(signedTx);

      expect(result).toHaveProperty('transactionHash');
    } catch (error) {
      expect(error.message).toMatch(knownTxRegExp);
    }
  });

  it('Transfer BNB on BSC, Use custom gas', async () => {
    try {
      const { signedTx, send } = await prepareToSendTx({
        ...BSC_BNB_DATA,
        gasPrice: '10',
        gasLimit: '42000',
      });
      const result = await send(signedTx);

      expect(result).toHaveProperty('transactionHash');
    } catch (error) {
      expect(error.message).toMatch(knownTxRegExp);
    }
  });
});

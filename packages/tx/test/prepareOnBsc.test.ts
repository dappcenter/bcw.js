import { prepareToSendTx, INetwork, ITxData } from '../src';

const BSC_TESTNET_NETWORK: INetwork = {
  chainType: 'bsc',
  url: 'https://data-seed-prebsc-2-s2.binance.org:8545',
};
const PRIVATE_KEYS = {
  bsc: '0eb0f7ef45b9e7870b452fd66d20438493a9b439f98ca49ae9519a3b34dda066',
};

/** ON BSC */
const BNB_ON_BSC: ITxData = {
  from: '0xFBC7c1f58DAb89a8eE702DB1CBB49363db42E497',
  to: '0x63E5D0da38AAd993fa6b486174373e5315038130',
  value: '0.002',
  network: BSC_TESTNET_NETWORK,
  asset: {
    networkSymbol: 'BNB',
    decimals: 18,
  },
};
const BUSD_ON_BSC: ITxData = {
  ...BNB_ON_BSC,
  value: '0.001',
  asset: {
    networkSymbol: 'BUSD',
    decimals: 18,
    contractAddress: '0xed24fc36d5ee211ea25a80239fb8c4cfd80f12ee',
  },
};

/** From BSC to BBC  */
const BNB_FROM_BSC_TO_BBC: ITxData = {
  from: '0xFBC7c1f58DAb89a8eE702DB1CBB49363db42E497',
  to: 'tbnb1zzt7zg7j40cq0yy4ef2dx3nsns8csp4pgc4vd5',
  value: '0.002',
  network: BSC_TESTNET_NETWORK,
  asset: {
    networkSymbol: 'BNB',
    decimals: 18,
    contractAddress: '0x0000000000000000000000000000000000000000',
  },
};
const BUSD_FROM_BSC_TO_BBC: ITxData = {
  from: '0xFBC7c1f58DAb89a8eE702DB1CBB49363db42E497',
  to: 'tbnb1zzt7zg7j40cq0yy4ef2dx3nsns8csp4pgc4vd5',
  value: '0.001',
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
    const { sign } = await prepareToSendTx(BNB_ON_BSC);

    const signedTx = sign(PRIVATE_KEYS.bsc).signedTx;
    expect(signedTx).toMatch(/0x\w+/);
  });

  it('Transfer BNB on BSC', async () => {
    try {
      const { sign, send } = await prepareToSendTx(BNB_ON_BSC);
      const result = await send(sign(PRIVATE_KEYS.bsc));

      expect(result).toHaveProperty('transactionHash');
    } catch (error) {
      expect(error.message).toMatch(knownTxRegExp);
    }
  });

  it('Transfer BUSD on BSC', async () => {
    try {
      const { sign, send } = await prepareToSendTx(BUSD_ON_BSC);
      const result = await send(sign(PRIVATE_KEYS.bsc));

      expect(result).toHaveProperty('transactionHash');
    } catch (error) {
      expect(error.message).toMatch(knownTxRegExp);
    }
  });

  it('Transfer BNB on BSC, Use custom gas', async () => {
    try {
      const { sign, send } = await prepareToSendTx({
        ...BNB_ON_BSC,
        gasPrice: '15',
        gasLimit: '42000',
      });
      const result = await send(sign(PRIVATE_KEYS.bsc));

      expect(result).toHaveProperty('transactionHash');
    } catch (error) {
      expect(error.message).toMatch(knownTxRegExp);
    }
  });
});

describe('prepareForBscToBbc', () => {
  it('Transfer BNB from BSC to BBC', async () => {
    const { sign, send, fee } = await prepareToSendTx(BNB_FROM_BSC_TO_BBC);

    if (__DEV__) console.log('fee: ', fee);
    const result = await send(sign(PRIVATE_KEYS.bsc));
    expect(result).toHaveProperty('transactionHash');
  });

  it('Transfer BUSD from BSC to BBC', async () => {
    const { sign, send, fee } = await prepareToSendTx(BUSD_FROM_BSC_TO_BBC);
    const result = await send(sign(PRIVATE_KEYS.bsc));

    if (__DEV__) console.log('fee: ', fee);
    expect(result).toHaveProperty('transactionHash');
  });
});

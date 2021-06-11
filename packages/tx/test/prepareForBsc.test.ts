import { prepareToSendTx } from '../src';

import { BSC_TESTNET_NETWORK, BSC_ACCOUNT, BNB_ASSET, BBC_ACCOUNT, BUSD_ASSET } from './mock';

const knownTxRegExp = /(already known)|(known transaction)/;

describe('prepareForBscOrEth', () => {
  it('BSC -> BSC: Transfer BNB', async () => {
    try {
      const { sign, send } = await prepareToSendTx({
        network: BSC_TESTNET_NETWORK,
        from: BSC_ACCOUNT.address,
        to: BSC_ACCOUNT.address,
        value: '0.001',
        asset: BNB_ASSET,
      });

      const result = await send(sign(BSC_ACCOUNT.privateKey));

      expect(result).toHaveProperty('transactionHash');
    } catch (error) {
      expect(error.message).toMatch(knownTxRegExp);
    }
  });

  it('BSC -> BSC: Transfer BUSD', async () => {
    try {
      const { sign, send } = await prepareToSendTx({
        network: BSC_TESTNET_NETWORK,
        from: BSC_ACCOUNT.address,
        to: BSC_ACCOUNT.address,
        value: '0.001',
        asset: BUSD_ASSET,
      });

      const result = await send(sign(BSC_ACCOUNT.privateKey));

      expect(result).toHaveProperty('transactionHash');
    } catch (error) {
      expect(error.message).toMatch(knownTxRegExp);
    }
  });

  it('BSC -> BSC: Transfer BNB, Use custom gas', async () => {
    try {
      const { sign, send } = await prepareToSendTx({
        network: BSC_TESTNET_NETWORK,
        from: BSC_ACCOUNT.address,
        to: BSC_ACCOUNT.address,
        value: '0.001',
        asset: BNB_ASSET,
        gasPrice: '15',
        gasLimit: '42000',
      });
      const result = await send(sign(BSC_ACCOUNT.privateKey));

      expect(result).toHaveProperty('transactionHash');
    } catch (error) {
      expect(error.message).toMatch(knownTxRegExp);
    }
  });
});

describe('prepareForBscToBbc', () => {
  // BSC network
  it('BSC -> BBC: Transfer BNB', async () => {
    const { sign, send } = await prepareToSendTx({
      network: BSC_TESTNET_NETWORK,
      from: BSC_ACCOUNT.address,
      to: BBC_ACCOUNT.address,
      value: '0.001',
      asset: BNB_ASSET,
    });

    const result = await send(sign(BSC_ACCOUNT.privateKey));
    expect(result).toHaveProperty('transactionHash');
  });

  it('BSC -> BBC: Transfer BUSD', async () => {
    const { sign, send } = await prepareToSendTx({
      network: BSC_TESTNET_NETWORK,
      from: BSC_ACCOUNT.address,
      to: BBC_ACCOUNT.address,
      value: '0.001',
      asset: BUSD_ASSET,
    });
    const result = await send(sign(BSC_ACCOUNT.privateKey));

    expect(result).toHaveProperty('transactionHash');
  });

  it('BSC -> BBC: Transfer BNB, Use custom gas', async () => {
    try {
      const { sign, send } = await prepareToSendTx({
        network: BSC_TESTNET_NETWORK,
        from: BSC_ACCOUNT.address,
        to: BBC_ACCOUNT.address,
        value: '0.001',
        asset: BNB_ASSET,
        gasPrice: '15',
        gasLimit: '42000',
      });
      const result = await send(sign(BSC_ACCOUNT.privateKey));

      expect(result).toHaveProperty('transactionHash');
    } catch (error) {
      expect(error.message).toMatch(knownTxRegExp);
    }
  });
});

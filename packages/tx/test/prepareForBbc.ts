import { prepareToSendTx } from '../src';
import { IBbcTxData } from '../src/types/index';

import { BBC_TESTNET_NETWORK, BBC_ACCOUNT, BSC_ACCOUNT, BNB_ASSET, BUSD_ASSET } from './mock';

export default () =>
  describe('prepareForBbc', () => {
    it('BBC -> BBC: Transfer BNB', async () => {
      const { sign, send } = await prepareToSendTx({
        network: BBC_TESTNET_NETWORK,
        from: BBC_ACCOUNT.address,
        to: BBC_ACCOUNT.address,
        value: '0.001',
        asset: BNB_ASSET,
        memo: 'test-bnb',
      } as IBbcTxData);
      const result = await send(sign(BBC_ACCOUNT.privateKey));

      expect(result).toHaveProperty('transactionHash');
    });

    it('BBC -> BBC: Transfer BUSD', async () => {
      const { sign, send } = await prepareToSendTx({
        network: BBC_TESTNET_NETWORK,
        from: BBC_ACCOUNT.address,
        to: BBC_ACCOUNT.address,
        value: '0.001',
        asset: {
          ...BUSD_ASSET,
          networkSymbol: 'BUSD-BAF',
        },
        memo: 'test-bbc-busd',
      } as IBbcTxData);
      const result = await send(sign(BBC_ACCOUNT.privateKey));

      expect(result).toHaveProperty('transactionHash');
    });

    it('BBC -> BSC: Transfer BUSD', async () => {
      const { sign, send } = await prepareToSendTx({
        network: BBC_TESTNET_NETWORK,
        from: BBC_ACCOUNT.address,
        to: BSC_ACCOUNT.address,
        value: '0.001',
        asset: BNB_ASSET,
        memo: 'test-bsc-busd',
      } as IBbcTxData);
      const result = await send(sign(BBC_ACCOUNT.privateKey));

      expect(result).toHaveProperty('transactionHash');
    });
  });

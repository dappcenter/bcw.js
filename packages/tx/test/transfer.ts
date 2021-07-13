import { BBC_TESTNET_NETWORK, BBC_ACCOUNT } from './mock';
import { prepareToTransferOnBbc } from '../src';

export default () =>
  describe('Transfer', () => {
    it('transfer on BBC', async () => {
      const { send } = await prepareToTransferOnBbc({
        network: BBC_TESTNET_NETWORK,
        from: BBC_ACCOUNT.address,
        to: BBC_ACCOUNT.address,
        amount: '0.001',
        asset: 'BNB',
        memo: 'test-bnb',
      });

      const result = await send(BBC_ACCOUNT.privateKey);

      expect(result).toHaveProperty('transactionHash');
    });
  });

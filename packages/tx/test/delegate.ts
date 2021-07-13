import { prepareToDelegateOnBbc, prepareToRedelegate, prepareToUndelegate } from '../src';
import {
  BBC_TESTNET_NETWORK,
  BBC_ACCOUNT,
  BSC_TESTNET_NETWORK,
  BSC_ACCOUNT,
  BNB_ASSET,
} from './mock';
import { prepareToDelegateOnBsc } from '../src';

const validatorAddress = 'bva1pnww8kx30sz4xfcqvn8wjhrn796nf4dq77hcpa';
const reValidatorAddress = 'bva10npy5809y303f227g4leqw7vs3s6ep5ul26sq2';

export default () =>
  describe('Delegate', () => {
    it('delegate on BBC', async () => {
      expect.hasAssertions();

      const { sign, send } = await prepareToDelegateOnBbc({
        network: BBC_TESTNET_NETWORK,
        address: BBC_ACCOUNT.address,
        validatorAddress,
        amount: '1',
        sideChainId: 'chapel',
      });
      const result = await send(sign(BBC_ACCOUNT.privateKey));

      expect(result).toHaveProperty('transactionHash');
    });

    it('delegate on BSC', async () => {
      expect.hasAssertions();

      try {
        const { send, fee: totalFee } = await prepareToDelegateOnBsc({
          bbcNetwork: BBC_TESTNET_NETWORK,
          bbcAddress: BBC_ACCOUNT.address,
          network: BSC_TESTNET_NETWORK,
          address: BSC_ACCOUNT.address,
          validatorAddress,
          amount: '1',
          sideChainId: 'chapel',
          asset: BNB_ASSET,
        });

        const result = await send(BBC_ACCOUNT.privateKey, BSC_ACCOUNT.privateKey);

        console.log('fee: ', totalFee);
        expect(result).toHaveProperty('transactionHash');
      } catch (error) {
        expect(error.message).toMatch('insufficient funds for transfer');
      }
    });

    it('redelegate on BBC', async () => {
      expect.hasAssertions();

      const { sign, send } = await prepareToRedelegate({
        network: BBC_TESTNET_NETWORK,
        address: BBC_ACCOUNT.address,
        originalValidatorAddress: validatorAddress,
        newValidatorAddress: reValidatorAddress,
        amount: '2',
        sideChainId: 'chapel',
      });
      const result = await send(sign(BBC_ACCOUNT.privateKey));

      expect(result).toHaveProperty('transactionHash');
    });

    it('undelegate on BBC', async () => {
      expect.hasAssertions();

      const { sign, send } = await prepareToUndelegate({
        network: BBC_TESTNET_NETWORK,
        address: BBC_ACCOUNT.address,
        validatorAddress: reValidatorAddress,
        amount: '2',
        sideChainId: 'chapel',
      });
      const result = await send(sign(BBC_ACCOUNT.privateKey));

      expect(result).toHaveProperty('transactionHash');
    });
  });

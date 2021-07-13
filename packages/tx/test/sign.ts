import { requestSign } from '../src';
import { BBC_ACCOUNT, BSC_ACCOUNT } from './mock';

export default () =>
  describe('requestSign', () => {
    it('requestSign on BBC', () => {
      const sign = requestSign({
        message: '123',
        privateKey: BBC_ACCOUNT.privateKey,
        networkType: 'bbc',
      });

      console.log(sign);
    });

    it('requestSign on BSC', () => {
      const sign = requestSign({
        message: '123',
        privateKey: BSC_ACCOUNT.privateKey,
        networkType: 'bsc',
      });

      console.log(sign);
    });
  });

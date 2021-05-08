import { wallet } from '@binancechain/bcw';

it('create wallet', async () => {
  const res = await wallet.createBcwWallet({ mnemonicLength: 128 });
  expect(res.accounts[0].addresses.length).toEqual(3);
});

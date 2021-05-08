import { createBcwWallet } from '@binancechain/bcw';

it('create wallet', async () => {
  const wallet = await createBcwWallet({ mnemonicLength: 128 });
  expect(wallet.accounts[0].addresses.length).toEqual(3);
});

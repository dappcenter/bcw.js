import { createBcwWallet, generateLocalAccount } from '@binancechain/wallet';

const memonic = 'ivory solution equal bonus bicycle genre toilet crouch room weasel ride rose';
const defaultBscAddress = '0xFBC7c1f58DAb89a8eE702DB1CBB49363db42E497';
const generatedAddress = '0x63E5D0da38AAd993fa6b486174373e5315038130';

describe('bcw', () => {
  it('create wallet', async () => {
    const wallet = await createBcwWallet({ mnemonicLength: 128 });
    expect(wallet.accounts[0].addresses.length).toEqual(3);
  });

  it('recover wallet from memonic', async () => {
    const wallet = await createBcwWallet({
      mnemonicLength: 128,
      mnemonic: memonic,
    });

    expect(wallet.accounts[0].addresses[2].address).toEqual(defaultBscAddress);
  });

  it('generate local account', async () => {
    const account = await generateLocalAccount({
      mnemonic: memonic,
      accountIndex: 1,
    });

    expect(account.addresses[2].address).toEqual(generatedAddress);
  });
});

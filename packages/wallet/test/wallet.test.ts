import {
  createBcwWallet,
  generateLocalAccount,
  generateImportedAccount,
} from '@binance-chain/wallet';

// Test account
const memonic = 'ivory solution equal bonus bicycle genre toilet crouch room weasel ride rose';
const defaultBscAddress = '0xFBC7c1f58DAb89a8eE702DB1CBB49363db42E497';
const account2Address = '0x63E5D0da38AAd993fa6b486174373e5315038130';
const bbcAddress = 'bnb1zzt7zg7j40cq0yy4ef2dx3nsns8csp4pxdugd9';
const privateKey = 'df3256c2f00ee8578a2633f3d8341c3e41b8ab4387ebe7b2589635ef91492cb1';

describe('bcw', () => {
  it('create wallet', async () => {
    const wallet = await createBcwWallet({ mnemonicLength: 128 });

    console.log(JSON.stringify(wallet));
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

    expect(account.addresses[2].address).toEqual(account2Address);
  });

  it('imported account by privateKey', async () => {
    const account = await generateImportedAccount({
      privateKey: privateKey,
      accountName: 'Imported Account',
    });

    expect(account.addresses[1].address).toEqual(bbcAddress);
  });
});

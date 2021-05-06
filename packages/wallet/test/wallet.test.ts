import { createBcwWallet, generateLocalAccount } from '../src/wallet';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({
  path: path.resolve(__dirname + '/.env'),
});

const memonic = process.env.menmonic || '';
const generatedAddress = process.env.generatedAddress || '';
const defaultBscAddress = process.env.defaultBscAddress || '';

describe('bcw', () => {
  it('create wallet', async () => {
    const wallet = await createBcwWallet({ mnemonicLength: 128 });
    expect(wallet.accounts[0].addresses.length).toEqual(3);
  });

  it('recover wallet', async () => {
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

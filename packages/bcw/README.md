# BCW

## Installing

```sh
yarn install @binance-chain/bcw -S
```

## Usage

```ts
import { wallet } from '@binance-chain/bcw';
const res = await wallet.createBcwWallet({ mnemonicLength: 128 });

// transaction
import { tx } from '@binance-chain/bcw';

const BSC_BNB_DATA = {
  from: 'your address',
  to: 'your address',
  value: '0.002',
  privateKey: 'your private key',
  network: {
    chainType: 'bsc',
    url: 'https://data-seed-prebsc-2-s2.binance.org:8545',
  },
  asset: {
    networkSymbol: 'BNB',
    decimals: 18,
  },
};

const { signedTx, fee, tx, send } = await tx.prepareToSendTx(BSC_BNB_DATA);
// Before send transaction, please make sure YourBalance > fee + BSC_BNB_DATA.value.
const result = await send(signedTx);
```

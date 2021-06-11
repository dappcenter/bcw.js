# Transaction

## Usage

### Basic

```jsx
import { tx } from '@binance-chain/bcw';

const PRIVATE_KEY = 'Your private key';
const BSC_BNB_DATA = {
  from: 'your address',
  to: 'your address',
  value: '0.002',
  network: {
    chainType: 'bsc',
    url: 'https://data-seed-prebsc-2-s2.binance.org:8545',
  },
  asset: {
    networkSymbol: 'BNB',
    decimals: 18,
  },
};

const { sign, fee, send } = await tx.prepareToSendTx(BSC_BNB_DATA);
// Before send transaction, please make sure YourBalance > fee + BSC_BNB_DATA.value.
const result = await send(sign(PRIVATE_KEY));
```

### Custom gas fee

```jsx
const { sign, send } = await prepareToSendTx({
  ...BSC_BNB_DATA,
  gasPrice: '10', // unit: GWei
  gasLimit: '42000',
});
const result = await send(sign(PRIVATE_KEYS.bsc));
```

### Get gas limit

```jsx
import { tx } from '@binance-chain/bcw';

const gas = await tx.getGasLimit(BSC_BNB_DATA);
```

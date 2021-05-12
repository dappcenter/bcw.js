# BCW

> A complete Binance Chain wallet implementation and utilities in TypeScript.

It includes the following core components:

- [wallet](./packages/wallet): Key management for Binance Chain Wallet
- [transaction](./packages/transaction): Some utils related to transactions
- Comming soon...

## Installing

```sh
yarn install @binance-chain/bcw -S
```

## Usage

```ts
import { wallet } from '@binance-chain/bcw';
const res = await wallet.createBcwWallet({ mnemonicLength: 128 });
```

## Contributing

1. Fork repo and clone
2. `yarn bootstrap`
3. Submit PR with fork mode
4. On your PR, submit a `/release` comment to release a beta version to test your package
5. Once your PR is merged, the bot will automatically create a `release` PR, after the team member
   merges the PR, the publish process will be triggered automatically

Tips:

- This project enforces conventional commit messages via commitlint. See this
  [summary](https://www.conventionalcommits.org/en/v1.0.0/#summary) for more information on how to
  write a commit message that follows the rules.

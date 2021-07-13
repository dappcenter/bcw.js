// import delegate from './delegate';
import transferOnBbc from './transfer';
import prepareForBbc from './prepareForBbc';
import { prepareForBscOrEth, prepareForBscToBbc } from './prepareForBsc';
import sign from './sign';

sign();

// For bbc
describe('Test on BBC', () => {
  prepareForBbc();
  // delegate();
  transferOnBbc();
});

// For bsc
describe('Test on BSC', () => {
  prepareForBscOrEth();
  prepareForBscToBbc();
});

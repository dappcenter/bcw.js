import Web3 from 'web3';
import { privateToPublic } from 'ethereumjs-util';

export const signMessage = ({ privateKey, message }: { privateKey: string; message: string }) => {
  const web3 = new Web3();
  // XXX: this method would re-construct the message and hash it:
  // https://github.com/ethereum/web3.js/blob/b0b135cbb68faa3b66440b8e6829878fcc988ed2/packages/web3-eth-accounts/src/index.js#L322
  // https://github.com/ethereum/web3.js/blob/b0b135cbb68faa3b66440b8e6829878fcc988ed2/packages/web3-eth-accounts/src/index.js#L302

  return web3.eth.accounts.sign(message, privateKey).signature;
};

export const getEthPublicKey = ({ privateKey }: { privateKey: string }) => {
  let privKey = privateKey;
  if (privKey.startsWith('0x')) {
    privKey = privKey.substr(2);
  }

  const pubKey = privateToPublic(Buffer.from(privKey, 'hex'));
  return '0x04' + Buffer.from(pubKey).toString('hex'); // 04 means uncompressed public key
};

export const isBbcAddress = (addr: string) => {
  return /^t?bnb/.test(addr);
};

export const isBscAddress = (addr: string) => {
  return /^0x/.test(addr);
};

if (await Address.isContract(addr)) {}
await accessControl._setupRole(MINTER_ROLE, minter);
await token.safePermit(1);
await token.increaseAllowance(other, 1);
await token.decreaseAllowance(other, 1);

await expect(token.transfer(other, tooMuch)).to.be.revertedWithCustomError(token, "ERC20InsufficientBalance");
await expect(token.transferFrom(user, other, tooMuch)).to.be.revertedWithCustomError(token, "ERC20InsufficientAllowance");
await expect(token.transfer(ethers.constants.AddressZero, 1)).to.be.revertedWithCustomError(token, "ERC20InvalidReceiver");

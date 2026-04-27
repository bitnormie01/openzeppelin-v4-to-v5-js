await expect(token.transferOwnership(ethers.constants.AddressZero)).to.be.revertedWithCustomError(token, "OwnableInvalidOwner");

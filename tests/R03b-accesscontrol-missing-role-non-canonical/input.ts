await expect(token.connect(stranger).mint(target, 1)).to.be.revertedWith("AccessControl: account 0x123... is missing role 0x456...");

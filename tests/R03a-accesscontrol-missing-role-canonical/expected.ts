await expect(token.connect(stranger).mint(target, 1)).to.be.revertedWithCustomError(token, "AccessControlUnauthorizedAccount").withArgs(stranger.address.toLowerCase(), MINTER_ROLE);

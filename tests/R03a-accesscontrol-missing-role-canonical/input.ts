await expect(token.connect(stranger).mint(target, 1)).to.be.revertedWith(`AccessControl: account ${stranger.address.toLowerCase()} is missing role ${MINTER_ROLE}`);

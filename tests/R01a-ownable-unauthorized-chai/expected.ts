await expect(token.connect(attacker).transferOwnership(other.address)).to.be.revertedWithCustomError(token, "OwnableUnauthorizedAccount");

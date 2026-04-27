expect(token.connect(attacker).transferOwnership(other.address)).to.eventually.be.revertedWithCustomError(token, "OwnableUnauthorizedAccount");

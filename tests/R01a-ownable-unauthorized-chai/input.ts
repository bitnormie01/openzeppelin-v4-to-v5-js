await expect(token.connect(attacker).transferOwnership(other.address)).to.be.revertedWith("Ownable: caller is not the owner");

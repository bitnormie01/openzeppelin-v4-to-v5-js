await expect(token.transfer(other, 1)).to.be.revertedWith("Pausable: paused");
await expect(token.transfer(other, 1)).to.be.revertedWith("Pausable: not paused");

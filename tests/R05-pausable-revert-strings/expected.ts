await expect(token.transfer(other, 1)).to.be.revertedWithCustomError(token, "EnforcedPause");
await expect(token.transfer(other, 1)).to.be.revertedWithCustomError(token, "ExpectedPause");

await expect(token.transfer(other, tooMuch)).to.be.revertedWith("ERC20: transfer amount exceeds balance");
await expect(token.transferFrom(user, other, tooMuch)).to.be.revertedWith("ERC20: insufficient allowance");
await expect(token.transfer(ethers.constants.AddressZero, 1)).to.be.revertedWith("ERC20: transfer to the zero address");

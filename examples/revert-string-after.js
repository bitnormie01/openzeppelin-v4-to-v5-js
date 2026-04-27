const { expect } = require("chai");

describe("Token Transfer", function () {
  it("should revert if user has insufficient balance", async function () {
    const amount = ethers.utils.parseEther("1000");
    await expect(
      token.connect(user).transfer(recipient.address, amount)
    ).to.be.revertedWithCustomError(token, "ERC20InsufficientBalance");
  });

  it("should revert on zero address transfer", async function () {
    await expect(
      token.connect(user).transfer(ethers.constants.AddressZero, 100)
    ).to.be.revertedWithCustomError(token, "ERC20InvalidReceiver");
  });
});

const { expect } = require("chai");

describe("Access Control", function () {
  it("should revert if user lacks MINTER_ROLE", async function () {
    const MINTER_ROLE = ethers.utils.id("MINTER_ROLE");
    
    await expect(
      contract.connect(stranger).mint(recipient, 100)
    ).to.be.revertedWithCustomError(contract, "AccessControlUnauthorizedAccount").withArgs(stranger.address.toLowerCase(), MINTER_ROLE);
  });
});

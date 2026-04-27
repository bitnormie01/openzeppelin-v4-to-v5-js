const { expect } = require("chai");

describe("Access Control", function () {
  it("should revert if user lacks MINTER_ROLE", async function () {
    const MINTER_ROLE = ethers.utils.id("MINTER_ROLE");
    
    await expect(
      contract.connect(stranger).mint(recipient, 100)
    ).to.be.revertedWith(
      `AccessControl: account ${stranger.address.toLowerCase()} is missing role ${MINTER_ROLE}`
    );
  });
});

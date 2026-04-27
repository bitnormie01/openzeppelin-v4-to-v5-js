const { expectRevert } = require("@openzeppelin/test-helpers");
// TODO(oz-v5): @openzeppelin/test-helpers does not natively support v5 custom errors.
// The codemod has rewritten this to chai's revertedWithCustomError; ensure your project
// uses @nomicfoundation/hardhat-chai-matchers (or hardhat-waffle).
await expect(token.connect(attacker).transferOwnership(other.address)).to.be.revertedWithCustomError(token, "OwnableUnauthorizedAccount");

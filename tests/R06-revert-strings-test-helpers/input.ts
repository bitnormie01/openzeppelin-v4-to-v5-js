const { expectRevert } = require("@openzeppelin/test-helpers");
await expectRevert(token.connect(attacker).transferOwnership(other.address), "Ownable: caller is not the owner");

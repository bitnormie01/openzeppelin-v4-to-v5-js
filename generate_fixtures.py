import os

def create_fixture(name, input_content, expected_content, readme_content, ext="ts"):
    d = os.path.join("tests", name)
    os.makedirs(d, exist_ok=True)
    with open(os.path.join(d, f"input.{ext}"), "w") as f:
        f.write(input_content)
    with open(os.path.join(d, f"expected.{ext}"), "w") as f:
        f.write(expected_content)
    with open(os.path.join(d, "README.md"), "w") as f:
        f.write(readme_content)

# R01-canonical
create_fixture(
    "R01a-ownable-unauthorized-chai",
    'await expect(token.connect(attacker).transferOwnership(other.address)).to.be.revertedWith("Ownable: caller is not the owner");\n',
    'await expect(token.connect(attacker).transferOwnership(other.address)).to.be.revertedWithCustomError(token, "OwnableUnauthorizedAccount");\n',
    "Rule ID: R01 ownable-unauthorized-revert-string-chai\nKind: deterministic-rewrite\nVariant: canonical chai await form\nExpected: Rewrites to revertedWithCustomError with contract handle inferred from promise, omitting withArgs."
)

# R01-eventually as JS variant
create_fixture(
    "R01b-ownable-unauthorized-chai-js-variant",
    'expect(token.connect(attacker).transferOwnership(other.address)).to.eventually.be.revertedWith("Ownable: caller is not the owner");\n',
    'expect(token.connect(attacker).transferOwnership(other.address)).to.eventually.be.revertedWithCustomError(token, "OwnableUnauthorizedAccount");\n',
    "Rule ID: R01 ownable-unauthorized-revert-string-chai\nKind: deterministic-rewrite\nVariant: eventually chai form (JS test)\nExpected: Rewrites eventually.be.revertedWith to eventually.be.revertedWithCustomError.",
    "js"
)

# R01-negation (negative test)
create_fixture(
    "R01c-ownable-unauthorized-chai-negation",
    'expect(p).to.not.be.revertedWith("Ownable: caller is not the owner");\n',
    'expect(p).to.not.be.revertedWith("Ownable: caller is not the owner");\n',
    "Rule ID: R01 ownable-unauthorized-revert-string-chai\nKind: deterministic-rewrite (negative test)\nVariant: chained negation (.to.not.be)\nExpected: Leaves unchanged."
)

# R02
create_fixture(
    "R02-ownable-invalid-owner",
    'await expect(token.transferOwnership(ethers.constants.AddressZero)).to.be.revertedWith("Ownable: new owner is the zero address");\n',
    'await expect(token.transferOwnership(ethers.constants.AddressZero)).to.be.revertedWithCustomError(token, "OwnableInvalidOwner");\n',
    "Rule ID: R02 ownable-invalid-owner-revert-string-chai\nKind: deterministic-rewrite\nVariant: canonical chai await form\nExpected: Rewrites to OwnableInvalidOwner."
)

# R03a-canonical-template
create_fixture(
    "R03a-accesscontrol-missing-role-canonical",
    'await expect(token.connect(stranger).mint(target, 1)).to.be.revertedWith(`AccessControl: account ${stranger.address.toLowerCase()} is missing role ${MINTER_ROLE}`);\n',
    'await expect(token.connect(stranger).mint(target, 1)).to.be.revertedWithCustomError(token, "AccessControlUnauthorizedAccount").withArgs(stranger.address.toLowerCase(), MINTER_ROLE);\n',
    "Rule ID: R03 accesscontrol-missing-role-revert-string-chai\nKind: deterministic-rewrite\nVariant: canonical template-literal form\nExpected: Rewrites to AccessControlUnauthorizedAccount WITH .withArgs statically resolved from template literal placeholders."
)

# R03b-non-canonical
create_fixture(
    "R03b-accesscontrol-missing-role-non-canonical",
    'await expect(token.connect(stranger).mint(target, 1)).to.be.revertedWith("AccessControl: account 0x123... is missing role 0x456...");\n',
    '// TODO(oz-v5): replace with revertedWithCustomError(<contract>, "AccessControlUnauthorizedAccount").withArgs(<account>, <role>);\nawait expect(token.connect(stranger).mint(target, 1)).to.be.revertedWith("AccessControl: account 0x123... is missing role 0x456...");\n',
    "Rule ID: R03 accesscontrol-missing-role-revert-string-chai\nKind: warn-with-todo\nVariant: non-canonical string literal form\nExpected: Prepends TODO comment without modifying the assertion."
)

# R04-erc20
create_fixture(
    "R04-erc20-revert-strings",
    '''await expect(token.transfer(other, tooMuch)).to.be.revertedWith("ERC20: transfer amount exceeds balance");
await expect(token.transferFrom(user, other, tooMuch)).to.be.revertedWith("ERC20: insufficient allowance");
await expect(token.transfer(ethers.constants.AddressZero, 1)).to.be.revertedWith("ERC20: transfer to the zero address");
''',
    '''await expect(token.transfer(other, tooMuch)).to.be.revertedWithCustomError(token, "ERC20InsufficientBalance");
await expect(token.transferFrom(user, other, tooMuch)).to.be.revertedWithCustomError(token, "ERC20InsufficientAllowance");
await expect(token.transfer(ethers.constants.AddressZero, 1)).to.be.revertedWithCustomError(token, "ERC20InvalidReceiver");
''',
    "Rule ID: R04 erc20-revert-strings-chai\nKind: deterministic-rewrite\nVariant: multiple common ERC20 revert strings\nExpected: Rewrites to corresponding ERC6093 custom errors."
)

# R05-pausable
create_fixture(
    "R05-pausable-revert-strings",
    '''await expect(token.transfer(other, 1)).to.be.revertedWith("Pausable: paused");
await expect(token.transfer(other, 1)).to.be.revertedWith("Pausable: not paused");
''',
    '''await expect(token.transfer(other, 1)).to.be.revertedWithCustomError(token, "EnforcedPause");
await expect(token.transfer(other, 1)).to.be.revertedWithCustomError(token, "ExpectedPause");
''',
    "Rule ID: R05 pausable-revert-strings-chai\nKind: deterministic-rewrite\nVariant: both paused and not paused states\nExpected: Rewrites to EnforcedPause and ExpectedPause custom errors."
)

# R06-test-helpers
create_fixture(
    "R06-revert-strings-test-helpers",
    '''const { expectRevert } = require("@openzeppelin/test-helpers");
await expectRevert(token.connect(attacker).transferOwnership(other.address), "Ownable: caller is not the owner");
''',
    '''const { expectRevert } = require("@openzeppelin/test-helpers");
// TODO(oz-v5): @openzeppelin/test-helpers does not natively support v5 custom errors.
// The codemod has rewritten this to chai's revertedWithCustomError; ensure your project
// uses @nomicfoundation/hardhat-chai-matchers (or hardhat-waffle).
await expect(token.connect(attacker).transferOwnership(other.address)).to.be.revertedWithCustomError(token, "OwnableUnauthorizedAccount");
''',
    "Rule ID: R06 revert-strings-test-helpers\nKind: deterministic-rewrite\nVariant: expectRevert with Ownable string\nExpected: Rewrites to chai revertedWithCustomError form."
)

# R07-deploy-warn
create_fixture(
    "R07a-ownable-deploy-missing-initial-owner",
    'const t = await TokenFactory.deploy();\n',
    '// TODO(oz-v5): Ownable v5 requires constructor(address initialOwner). Add the initial owner address.\nconst t = await TokenFactory.deploy();\n',
    "Rule ID: R07 ownable-deploy-missing-initial-owner\nKind: warn-with-todo\nVariant: zero-arg deploy\nExpected: Prepends TODO comment."
)

# R07-deploy-negative
create_fixture(
    "R07b-ownable-deploy-missing-initial-owner-negative",
    'const t = await TokenFactory.deploy(initialOwner);\n',
    'const t = await TokenFactory.deploy(initialOwner);\n',
    "Rule ID: R07 ownable-deploy-missing-initial-owner\nKind: negative\nVariant: non-zero arg deploy\nExpected: Leaves unchanged."
)

# R08-role-hash
create_fixture(
    "R08-role-hash-literal-warn",
    '''keccak256("MINTER_ROLE");
ethers.utils.id("MINTER_ROLE");
const MINTER_ROLE = "0x9f2df0fed2c77648de5860a4cc508cd0818c85b8b8a1ab4ceeef8d981c8956a6";
''',
    '''// TODO(oz-v5): verify role hash. Precomputed hex; ensure preimage matches the role
// string used in the v5 contract (keccak256("MINTER_ROLE")). Consider replacing with
// ethers.utils.id("MINTER_ROLE") for self-documentation.
keccak256("MINTER_ROLE");
// TODO(oz-v5): verify role hash. Precomputed hex; ensure preimage matches the role
// string used in the v5 contract (keccak256("MINTER_ROLE")). Consider replacing with
// ethers.utils.id("MINTER_ROLE") for self-documentation.
ethers.utils.id("MINTER_ROLE");
// TODO(oz-v5): verify role hash. Precomputed hex; ensure preimage matches the role
// string used in the v5 contract (keccak256("MINTER_ROLE")). Consider replacing with
// ethers.utils.id("MINTER_ROLE") for self-documentation.
const MINTER_ROLE = "0x9f2df0fed2c77648de5860a4cc508cd0818c85b8b8a1ab4ceeef8d981c8956a6";
''',
    "Rule ID: R08 role-hash-literal-warn\nKind: warn-with-todo\nVariant: three trigger forms\nExpected: Prepends TODO comment to each."
)

# R09-hook-rename
create_fixture(
    "R09-hook-rename-references",
    '''// We override _beforeTokenTransfer here
it("calls _beforeTokenTransfer", async () => {
    await mock.callStatic._beforeTokenTransfer();
});
''',
    '''// TODO(oz-v5): _beforeTokenTransfer / _afterTokenTransfer hooks are removed in v5.
// Use _update instead. ERC721 _update has no `from` arg.
// We override _beforeTokenTransfer here
// TODO(oz-v5): _beforeTokenTransfer / _afterTokenTransfer hooks are removed in v5.
// Use _update instead. ERC721 _update has no `from` arg.
it("calls _beforeTokenTransfer", async () => {
    // TODO(oz-v5): _beforeTokenTransfer / _afterTokenTransfer hooks are removed in v5.
// Use _update instead. ERC721 _update has no `from` arg.
    await mock.callStatic._beforeTokenTransfer();
});
''',
    "Rule ID: R09 hook-rename-references\nKind: warn-with-todo\nVariant: comment, string literal, and identifier\nExpected: Prepends TODO comment to each matching line."
)

# R10-removed-symbols
create_fixture(
    "R10-removed-symbols-warn",
    '''if (await Address.isContract(addr)) {}
await accessControl._setupRole(MINTER_ROLE, minter);
await token.safePermit(1);
await token.increaseAllowance(other, 1);
await token.decreaseAllowance(other, 1);
''',
    '''// TODO(oz-v5): Address.isContract removed in v5 (ambiguous semantics).
// Replace with explicit code-size check or remove the guard.
if (await Address.isContract(addr)) {}
// TODO(oz-v5): _setupRole was removed; use _grantRole on the v5 contract instead.
await accessControl._setupRole(MINTER_ROLE, minter);
// TODO(oz-v5): safePermit was removed in v5.
await token.safePermit(1);
// TODO(oz-v5): increaseAllowance was removed in v5; rewrite the test to use approve() with the new value.
await token.increaseAllowance(other, 1);
// TODO(oz-v5): decreaseAllowance was removed in v5; rewrite the test to use approve() with the new value.
await token.decreaseAllowance(other, 1);
''',
    "Rule ID: R10 removed-symbols-warn\nKind: warn-with-todo\nVariant: isContract, _setupRole, safePermit, increaseAllowance, decreaseAllowance\nExpected: Prepends specific TODO comment to each."
)

# R11-import-path
create_fixture(
    "R11a-import-path-shifts",
    'await ethers.getContractFactory("@openzeppelin/contracts/token/ERC20/extensions/draft-ERC20Permit.sol:ERC20Permit");\n',
    'await ethers.getContractFactory("@openzeppelin/contracts/token/ERC20/extensions/ERC20Permit.sol:ERC20Permit");\n',
    "Rule ID: R11 import-path-shifts\nKind: deterministic-rewrite\nVariant: draft- prefix removal\nExpected: Path rewritten without draft- prefix."
)

# R11-import-path-negative
create_fixture(
    "R11b-import-path-shifts-negative",
    'await ethers.getContractFactory("@openzeppelin/contracts/utils/Address.sol:Address");\n',
    'await ethers.getContractFactory("@openzeppelin/contracts/utils/Address.sol:Address");\n',
    "Rule ID: R11 import-path-shifts\nKind: negative\nVariant: non-renamed path\nExpected: Leaves unchanged."
)

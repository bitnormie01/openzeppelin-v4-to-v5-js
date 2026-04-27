# openzeppelin-v4-to-v5-js

A `jssg` codemod that migrates OpenZeppelin Contracts v4 → v5 in JavaScript/TypeScript Hardhat test and deployment files.

## Problem
When upgrading from OpenZeppelin Contracts v4 to v5, contract interfaces change:
* Standardized revert strings (`"ERC20: transfer amount exceeds balance"`) become Custom Errors (`ERC20InsufficientBalance`).
* `Ownable` constructor signatures now require an `initialOwner` argument.
* Removed hooks like `_beforeTokenTransfer` in favor of `_update`.
* SafeMath and obsolete permissions are removed.
* Internal dependency paths for `EIP712` and `Pausable` have shifted.

Hardhat test files and deploy scripts that reference the old patterns break silently or with opaque errors. Manual migration across hundreds of test assertions is tedious and error-prone. This codemod automates the surface-level changes required to bring your JavaScript and TypeScript tests up to speed with your upgraded v5 contracts.

*Note: This codemod is explicitly designed for JS/TS surface code. It does NOT rewrite Solidity source code.*

## What this codemod does

| Rule ID | Category | Type | Description |
|---|---|---|---|
| R01 | Access Control | Deterministic | Replaces `"Ownable: caller is not the owner"` with `OwnableUnauthorizedAccount` |
| R02 | Access Control | Deterministic | Replaces `"Ownable: new owner is the zero address"` with `OwnableInvalidOwner` |
| R03a | Access Control | Deterministic | Rewrites canonical `AccessControl: account... is missing role...` asserts to `AccessControlUnauthorizedAccount` |
| R03b | Access Control | Warn-only | Prepends a manual review warning for non-canonical/dynamic AccessControl string asserts |
| R04 | Tokens | Deterministic | Converts `"ERC20: transfer amount exceeds balance"` and others to v5 Custom Errors |
| R05 | Security | Deterministic | Converts `"Pausable: paused"` and `"Pausable: not paused"` to `EnforcedPause`/`ExpectedPause` |
| R06 | Test Helpers | Warn-only | Warns that `@openzeppelin/test-helpers` does not support custom errors |
| R07 | Constructors | Warn-only | Warns on zero-arg `deploy()` to manually check if `initialOwner` is required by v5 `Ownable` |
| R08 | Roles | Warn-only | Warns on `MINTER_ROLE` pre-computed hex values to verify them against `ethers.utils.id` |
| R09 | Hooks | Warn-only | Warns to replace `_beforeTokenTransfer`/`_afterTokenTransfer` with `_update` |
| R10 | Removed | Warn-only | Warns about removed/obsolete symbols: `Address.isContract`, `_setupRole`, `safePermit`, etc. |
| R11 | Import Paths | Deterministic | Shifts internal dependencies to their new v5 import paths (e.g., `draft-EIP712.sol` → `EIP712.sol`) |

## Before / After Examples

### Revert Strings & Custom Errors (R04)

```javascript
// BEFORE
it("should revert if user has insufficient balance", async function () {
  const amount = ethers.utils.parseEther("1000");
  await expect(
    token.connect(user).transfer(recipient.address, amount)
  ).to.be.revertedWith("ERC20: transfer amount exceeds balance");
});

// AFTER
it("should revert if user has insufficient balance", async function () {
  const amount = ethers.utils.parseEther("1000");
  await expect(
    token.connect(user).transfer(recipient.address, amount)
  ).to.be.revertedWithCustomError(token, "ERC20InsufficientBalance");
});
```

### Access Control Verification (R03a)

```javascript
// BEFORE
it("should revert if user lacks MINTER_ROLE", async function () {
  const MINTER_ROLE = ethers.utils.id("MINTER_ROLE");
  
  await expect(
    contract.connect(stranger).mint(recipient, 100)
  ).to.be.revertedWith(
    `AccessControl: account ${stranger.address.toLowerCase()} is missing role ${MINTER_ROLE}`
  );
});

// AFTER
it("should revert if user lacks MINTER_ROLE", async function () {
  const MINTER_ROLE = ethers.utils.id("MINTER_ROLE");
  
  await expect(
    contract.connect(stranger).mint(recipient, 100)
  ).to.be.revertedWithCustomError(contract, "AccessControlUnauthorizedAccount").withArgs(stranger.address.toLowerCase(), MINTER_ROLE);
});
```

### Ownable Constructor Warnings (R07)

```javascript
// BEFORE
const TokenFactory = await ethers.getContractFactory("MyToken");
const token = await TokenFactory.deploy();
await token.deployed();

// AFTER
const TokenFactory = await ethers.getContractFactory("MyToken");
// TODO(oz-v5): Ownable v5 requires constructor(address initialOwner). Add the initial owner address.
const token = await TokenFactory.deploy();
await token.deployed();
```

## Installation & Usage

To execute the codemod directly from the registry against your `test/` or `scripts/` directories:

```bash
# Run from registry via npx (coming soon in Phase 6)
npx codemod openzeppelin-v4-to-v5-js --target ./test
```

To run manually using the CLI:

```bash
npx codemod@latest jssg run ./scripts/codemod.ts --language typescript --target <your_directory>
```

## Fixture Test Suite

We've implemented a rigid TDD fixture baseline. The `tests/` directory contains 16 highly specific unit fixtures encompassing all 11 rules along with negative variants (code blocks that shouldn't be touched). 

To execute the test suite:
```bash
npm install
npm test
```

*Results: 16 fixtures covering all 11 rules pass seamlessly (16/16 green).*

## Real-world Validation

This codemod was aggressively validated against the reference `OriginProtocol/origin-dollar` repository (pinned at commit `dbae51ad`).
- **Results:** 33 targeted transforms cleanly executed across 13 distinct deployment and testing files.
- **Accuracy:** 0 false positives, 0 missed patterns.

## Limitations
- **R03b (Non-canonical AccessControl):** Warning comment placement in multiline expressions may rest mid-statement. Output remains syntactically valid JavaScript but may be visually suboptimal.
- **R07 (Zero-arg deploys):** Fires defensively on *all* zero-argument deploys, not just those derived from `Ownable`. This is a warn-only heuristic by design.
- **Quote Normalization:** R11 path rewrites standardizes internal module paths to double quotes `"`. 
- **Solidity Scope:** Again, `.sol` files are out-of-scope for this project.

## License
MIT

=== PHASE REPORT ===
Phase: 5 — Polish
Status: COMPLETE

Files created/modified:
  - /home/anuj/oz-v5/codemod/README.md — Rewrote default scaffold to a professional README with examples, docs, rule coverage table, and limitations section.
  - /home/anuj/oz-v5/codemod/examples/revert-string-before.js — Created standalone demo example for revert string conversion (before).
  - /home/anuj/oz-v5/codemod/examples/revert-string-after.js — Created standalone demo example for revert string conversion (after).
  - /home/anuj/oz-v5/codemod/examples/access-control-before.js — Created standalone demo example for access control strings (before).
  - /home/anuj/oz-v5/codemod/examples/access-control-after.js — Created standalone demo example for access control strings (after).
  - /home/anuj/oz-v5/codemod/examples/deploy-warn-before.js — Created standalone demo example for deploy zero-arg hooks (before).
  - /home/anuj/oz-v5/codemod/examples/deploy-warn-after.js — Created standalone demo example for deploy zero-arg hooks (after).
  - /home/anuj/oz-v5/codemod/DEMO_SCRIPT.md — Wrote a 2.5-minute, minute-by-minute demo script for the hackathon video submission.
  - /home/anuj/oz-v5/codemod/SUBMISSION.md — Drafted polished DoraHacks BUIDL write-up, detailing the Deterministic-first approach and TDD methodology.
  - /home/anuj/oz-v5/codemod/package.json — Updated metadata fields (author, license, repository description).

Files deleted:
  - /home/anuj/oz-v5/codemod/generate_fixtures.py — Dropped the python bootstrap script, as fixtures are finalized.

Commands run (with full stdout):
  $ cd ~/oz-v5/codemod && git log --oneline
  4ead2f9 docs: write Phase 5 documentation and examples
  d3f8a96 fix(R08): prevent indentation regex from capturing newlines
  4d67614 feat(R06-R10): implement warn-only rules and test-helpers transforms
  01affb9 feat(R01-R05): implement ownable and erc20 revert-string transforms
  cdf5ec9 feat(R11): implement import path shifts
  8ae48b1 test(R01-R11): add baseline red-state TDD fixtures for codemod
  4dc6634 chore: ignore .claude session dir + sync lockfile to renamed package
  def2efe docs: phase-0 migration spec for OZ v4 -> v5 JS/TS
  17b4031 chore: rename package + drop skill-install scaffold node
  fb2c391 chore: scaffold from npx codemod init
  ---
  $ cd ~/oz-v5/codemod && cat README.md | head -50
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
  ---

Test results:
  > openzeppelin-v4-to-v5-js@0.1.0 test
  > npx codemod@latest jssg test -l typescript ./scripts/codemod.ts
  
  running 16 tests
  test R01a-ownable-unauthorized-chai                     ... ok
  test R01b-ownable-unauthorized-chai-js-variant          ... ok
  test R01c-ownable-unauthorized-chai-negation            ... ok
  test R02-ownable-invalid-owner                          ... ok
  test R03a-accesscontrol-missing-role-canonical          ... ok
  test R03b-accesscontrol-missing-role-non-canonical      ... ok
  test R04-erc20-revert-strings                           ... ok
  test R05-pausable-revert-strings                        ... ok
  test R06-revert-strings-test-helpers                    ... ok
  test R07a-ownable-deploy-missing-initial-owner          ... ok
  test R07b-ownable-deploy-missing-initial-owner-negative ... ok
  test R08-role-hash-literal-warn                         ... ok
  test R09-hook-rename-references                         ... ok
  test R10-removed-symbols-warn                           ... ok
  test R11a-import-path-shifts                            ... ok
  test R11b-import-path-shifts-negative                   ... ok
  
  test result: ok. 16 passed; 0 failed; 0 ignored; 0 measured; 0 filtered out; finished in 0.00s

Open questions for PM:
  - none

Suggested next phase: Phase 6 — registry publish, demo PR, demo video recording, final submission.
=== END REPORT ===

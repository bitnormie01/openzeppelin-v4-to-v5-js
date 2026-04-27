=== PHASE REPORT ===
Phase: 1 — Fixtures-first (red baseline)
Status: COMPLETE

Fixture-discovery findings:
  - jssg test discovers fixtures by: looking for subdirectories in the `tests/` directory that contain `input` and `expected` files. Each subdirectory corresponds to an independent test.
  - File extensions tested (.js, .ts): Both `.js` and `.ts` work as expected and are picked up by the test runner regardless of the `-l typescript` flag in the npm script.
  - Naming convention used: The directory name becomes the name of the test. E.g., `tests/R01a-ownable-unauthorized-chai` runs a test named `R01a-ownable-unauthorized-chai`.

Files created/modified:
  - generate_fixtures.py — script to generate all phase 1 test fixture folders and files.
  - tests/R01a-ownable-unauthorized-chai/input.ts (and expected.ts, README.md) — canonical chai form for R01.
  - tests/R01b-ownable-unauthorized-chai-js-variant/input.js (and expected.js, README.md) — JS variant for R01 to verify .js support.
  - tests/R01c-ownable-unauthorized-chai-negation/input.ts (and expected.ts, README.md) — negative test for R01 to ensure `.not.be.revertedWith` is untouched.
  - tests/R02-ownable-invalid-owner/input.ts (and expected.ts, README.md) — canonical chai form for R02.
  - tests/R03a-accesscontrol-missing-role-canonical/input.ts (and expected.ts, README.md) — canonical template literal form for R03.
  - tests/R03b-accesscontrol-missing-role-non-canonical/input.ts (and expected.ts, README.md) — warn-only fallback for R03.
  - tests/R04-erc20-revert-strings/input.ts (and expected.ts, README.md) — test covering multiple ERC20 v4 revert strings mapping to ERC6093 errors.
  - tests/R05-pausable-revert-strings/input.ts (and expected.ts, README.md) — test covering both paused and not paused pausable errors.
  - tests/R06-revert-strings-test-helpers/input.ts (and expected.ts, README.md) — test ensuring expectRevert gets replaced with chai inverted form.
  - tests/R07a-ownable-deploy-missing-initial-owner/input.ts (and expected.ts, README.md) — zero-arg deploy flag test.
  - tests/R07b-ownable-deploy-missing-initial-owner-negative/input.ts (and expected.ts, README.md) — negative test for deploys that already have arguments.
  - tests/R08-role-hash-literal-warn/input.ts (and expected.ts, README.md) — warn-only test for role-hash literals.
  - tests/R09-hook-rename-references/input.ts (and expected.ts, README.md) — warn-only test for hook rename references.
  - tests/R10-removed-symbols-warn/input.ts (and expected.ts, README.md) — warn-only test for removed symbols.
  - tests/R11a-import-path-shifts/input.ts (and expected.ts, README.md) — path rewriting deterministic test.
  - tests/R11b-import-path-shifts-negative/input.ts (and expected.ts, README.md) — negative test for unrelated path rewriting.

Files deleted:
  - tests/fixtures/input.js — scaffold placeholder test input.
  - tests/fixtures/expected.js — scaffold placeholder test expected.

Commands run (with full stdout):
  $ npx codemod@latest jssg test --help
  Need to install the following packages:
  codemod@1.8.3
  Ok to proceed? (y) y

  Usage: jssg test [options] <CODEMOD_FILE> [TEST_DIRECTORY]

  Run codemod test fixtures

  Arguments:
    <CODEMOD_FILE>    Path to the codemod file to test
    [TEST_DIRECTORY]  Test directory containing test fixtures (default: tests)

  Options:
    -l, --language <LANGUAGE>            Language to process (can be specified in config file)
        --filter <FILTER>                Run only tests matching the pattern
    -u, --update-snapshots               Update expected outputs with actual results
    -v, --verbose                        Show detailed output for each test
        --sequential                     Run tests sequentially instead of in parallel
        --max-threads <MAX_THREADS>      Maximum number of concurrent test threads
        --fail-fast                      Stop on first test failure
        --watch                          Watch for file changes and re-run tests
        --reporter <REPORTER>            Output format (console, json, terse) [default: console]
        --timeout <TIMEOUT>              Test timeout in seconds (default: 30) [default: 30]
        --ignore-whitespace              Ignore whitespace differences in comparisons
        --context-lines <CONTEXT_LINES>  Number of context lines in diff output (default: 3) [default: 3]
        --expect-errors <EXPECT_ERRORS>  Test patterns that are expected to produce errors (comma-separated)
        --strictness <LEVEL>             Comparison strictness level: strict (string equality), cst (compare CSTs), ast (compare ASTs, ignores formatting), loose (compare AST, ignores ordering) [default: strict]
        --disable-analytics              Disable telemetry
        --semantic-workspace             Enable workspace-wide semantic analysis for cross-file references. For directory snapshot tests, the workspace root is automatically set to the test fixture's temporary directory
        --allow-fs                       Allow fs access
        --allow-fetch                    Allow fetch access
        --allow-child-process            Allow child process access
    -h, --help                           Print help
  ---
  $ cd ~/oz-v5/codemod && ls -la tests/
  total 72
  drwxr-xr-x 18 anuj anuj 4096 Apr 27 13:13 .
  drwxr-xr-x  9 anuj anuj 4096 Apr 27 13:13 ..
  drwxr-xr-x  2 anuj anuj 4096 Apr 27 13:13 R01a-ownable-unauthorized-chai
  drwxr-xr-x  2 anuj anuj 4096 Apr 27 13:13 R01b-ownable-unauthorized-chai-js-variant
  drwxr-xr-x  2 anuj anuj 4096 Apr 27 13:13 R01c-ownable-unauthorized-chai-negation
  drwxr-xr-x  2 anuj anuj 4096 Apr 27 13:13 R02-ownable-invalid-owner
  drwxr-xr-x  2 anuj anuj 4096 Apr 27 13:13 R03a-accesscontrol-missing-role-canonical
  drwxr-xr-x  2 anuj anuj 4096 Apr 27 13:13 R03b-accesscontrol-missing-role-non-canonical
  drwxr-xr-x  2 anuj anuj 4096 Apr 27 13:13 R04-erc20-revert-strings
  drwxr-xr-x  2 anuj anuj 4096 Apr 27 13:13 R05-pausable-revert-strings
  drwxr-xr-x  2 anuj anuj 4096 Apr 27 13:13 R06-revert-strings-test-helpers
  drwxr-xr-x  2 anuj anuj 4096 Apr 27 13:13 R07a-ownable-deploy-missing-initial-owner
  drwxr-xr-x  2 anuj anuj 4096 Apr 27 13:13 R07b-ownable-deploy-missing-initial-owner-negative
  drwxr-xr-x  2 anuj anuj 4096 Apr 27 13:13 R08-role-hash-literal-warn
  drwxr-xr-x  2 anuj anuj 4096 Apr 27 13:13 R09-hook-rename-references
  drwxr-xr-x  2 anuj anuj 4096 Apr 27 13:13 R10-removed-symbols-warn
  drwxr-xr-x  2 anuj anuj 4096 Apr 27 13:13 R11a-import-path-shifts
  drwxr-xr-x  2 anuj anuj 4096 Apr 27 13:13 R11b-import-path-shifts-negative
  ---
  $ cd ~/oz-v5/codemod && find tests -type f | sort
  tests/R01a-ownable-unauthorized-chai/README.md
  tests/R01a-ownable-unauthorized-chai/expected.ts
  tests/R01a-ownable-unauthorized-chai/input.ts
  tests/R01b-ownable-unauthorized-chai-js-variant/README.md
  tests/R01b-ownable-unauthorized-chai-js-variant/expected.js
  tests/R01b-ownable-unauthorized-chai-js-variant/input.js
  tests/R01c-ownable-unauthorized-chai-negation/README.md
  tests/R01c-ownable-unauthorized-chai-negation/expected.ts
  tests/R01c-ownable-unauthorized-chai-negation/input.ts
  tests/R02-ownable-invalid-owner/README.md
  tests/R02-ownable-invalid-owner/expected.ts
  tests/R02-ownable-invalid-owner/input.ts
  tests/R03a-accesscontrol-missing-role-canonical/README.md
  tests/R03a-accesscontrol-missing-role-canonical/expected.ts
  tests/R03a-accesscontrol-missing-role-canonical/input.ts
  tests/R03b-accesscontrol-missing-role-non-canonical/README.md
  tests/R03b-accesscontrol-missing-role-non-canonical/expected.ts
  tests/R03b-accesscontrol-missing-role-non-canonical/input.ts
  tests/R04-erc20-revert-strings/README.md
  tests/R04-erc20-revert-strings/expected.ts
  tests/R04-erc20-revert-strings/input.ts
  tests/R05-pausable-revert-strings/README.md
  tests/R05-pausable-revert-strings/expected.ts
  tests/R05-pausable-revert-strings/input.ts
  tests/R06-revert-strings-test-helpers/README.md
  tests/R06-revert-strings-test-helpers/expected.ts
  tests/R06-revert-strings-test-helpers/input.ts
  tests/R07a-ownable-deploy-missing-initial-owner/README.md
  tests/R07a-ownable-deploy-missing-initial-owner/expected.ts
  tests/R07a-ownable-deploy-missing-initial-owner/input.ts
  tests/R07b-ownable-deploy-missing-initial-owner-negative/README.md
  tests/R07b-ownable-deploy-missing-initial-owner-negative/expected.ts
  tests/R07b-ownable-deploy-missing-initial-owner-negative/input.ts
  tests/R08-role-hash-literal-warn/README.md
  tests/R08-role-hash-literal-warn/expected.ts
  tests/R08-role-hash-literal-warn/input.ts
  tests/R09-hook-rename-references/README.md
  tests/R09-hook-rename-references/expected.ts
  tests/R09-hook-rename-references/input.ts
  tests/R10-removed-symbols-warn/README.md
  tests/R10-removed-symbols-warn/expected.ts
  tests/R10-removed-symbols-warn/input.ts
  tests/R11a-import-path-shifts/README.md
  tests/R11a-import-path-shifts/expected.ts
  tests/R11a-import-path-shifts/input.ts
  tests/R11b-import-path-shifts-negative/README.md
  tests/R11b-import-path-shifts-negative/expected.ts
  tests/R11b-import-path-shifts-negative/input.ts
  ---
  $ cd ~/oz-v5/codemod && npm test

  > openzeppelin-v4-to-v5-js@0.1.0 test
  > npx codemod@latest jssg test -l typescript ./scripts/codemod.ts
  
  Need to install the following packages:
  codemod@1.8.3
  Ok to proceed? (y) y
   
  running 16 tests
  test R01a-ownable-unauthorized-chai                     ... FAILED
  test R01b-ownable-unauthorized-chai-js-variant          ... FAILED
  test R01c-ownable-unauthorized-chai-negation            ... ok
  test R02-ownable-invalid-owner                          ... FAILED
  test R03a-accesscontrol-missing-role-canonical          ... FAILED
  test R03b-accesscontrol-missing-role-non-canonical      ... FAILED
  test R04-erc20-revert-strings                           ... FAILED
  test R05-pausable-revert-strings                        ... FAILED
  test R06-revert-strings-test-helpers                    ... FAILED
  test R07a-ownable-deploy-missing-initial-owner          ... FAILED
  test R07b-ownable-deploy-missing-initial-owner-negative ... ok
  test R08-role-hash-literal-warn                         ... FAILED
  test R10-removed-symbols-warn                           ... FAILED
  test R11a-import-path-shifts                            ... FAILED
  test R11b-import-path-shifts-negative                   ... ok
  test R09-hook-rename-references                         ... FAILED
  
  failures:
  
  ---- R01a-ownable-unauthorized-chai ----
  Output mismatch for test 'R01a-ownable-unauthorized-chai':
  -await expect(token.connect(attacker).transferOwnership(other.address)).to.be.revertedWithCustomError(token, "OwnableUnauthorizedAccount");
  +await expect(token.connect(attacker).transferOwnership(other.address)).to.be.revertedWith("Ownable: caller is not the owner");
  
  ---- R01b-ownable-unauthorized-chai-js-variant ----
  Output mismatch for test 'R01b-ownable-unauthorized-chai-js-variant':
  -expect(token.connect(attacker).transferOwnership(other.address)).to.eventually.be.revertedWithCustomError(token, "OwnableUnauthorizedAccount");
  +expect(token.connect(attacker).transferOwnership(other.address)).to.eventually.be.revertedWith("Ownable: caller is not the owner");
  
  ---- R02-ownable-invalid-owner ----
  Output mismatch for test 'R02-ownable-invalid-owner':
  -await expect(token.transferOwnership(ethers.constants.AddressZero)).to.be.revertedWithCustomError(token, "OwnableInvalidOwner");
  +await expect(token.transferOwnership(ethers.constants.AddressZero)).to.be.revertedWith("Ownable: new owner is the zero address");
  
  ---- R03a-accesscontrol-missing-role-canonical ----
  Output mismatch for test 'R03a-accesscontrol-missing-role-canonical':
  -await expect(token.connect(stranger).mint(target, 1)).to.be.revertedWithCustomError(token, "AccessControlUnauthorizedAccount").withArgs(stranger.address.toLowerCase(), MINTER_ROLE);
  +await expect(token.connect(stranger).mint(target, 1)).to.be.revertedWith(`AccessControl: account ${stranger.address.toLowerCase()} is missing role ${MINTER_ROLE}`);
  
  ---- R03b-accesscontrol-missing-role-non-canonical ----
  Output mismatch for test 'R03b-accesscontrol-missing-role-non-canonical':
  -// TODO(oz-v5): replace with revertedWithCustomError(<contract>, "AccessControlUnauthorizedAccount").withArgs(<account>, <role>);
   await expect(token.connect(stranger).mint(target, 1)).to.be.revertedWith("AccessControl: account 0x123... is missing role 0x456...");
  
  ---- R04-erc20-revert-strings ----
  Output mismatch for test 'R04-erc20-revert-strings':
  -await expect(token.transfer(other, tooMuch)).to.be.revertedWithCustomError(token, "ERC20InsufficientBalance");
  -await expect(token.transferFrom(user, other, tooMuch)).to.be.revertedWithCustomError(token, "ERC20InsufficientAllowance");
  -await expect(token.transfer(ethers.constants.AddressZero, 1)).to.be.revertedWithCustomError(token, "ERC20InvalidReceiver");
  +await expect(token.transfer(other, tooMuch)).to.be.revertedWith("ERC20: transfer amount exceeds balance");
  +await expect(token.transferFrom(user, other, tooMuch)).to.be.revertedWith("ERC20: insufficient allowance");
  +await expect(token.transfer(ethers.constants.AddressZero, 1)).to.be.revertedWith("ERC20: transfer to the zero address");
  
  ---- R05-pausable-revert-strings ----
  Output mismatch for test 'R05-pausable-revert-strings':
  -await expect(token.transfer(other, 1)).to.be.revertedWithCustomError(token, "EnforcedPause");
  -await expect(token.transfer(other, 1)).to.be.revertedWithCustomError(token, "ExpectedPause");
  +await expect(token.transfer(other, 1)).to.be.revertedWith("Pausable: paused");
  +await expect(token.transfer(other, 1)).to.be.revertedWith("Pausable: not paused");
  
  ---- R06-revert-strings-test-helpers ----
  Output mismatch for test 'R06-revert-strings-test-helpers':
   const { expectRevert } = require("@openzeppelin/test-helpers");
  -// TODO(oz-v5): @openzeppelin/test-helpers does not natively support v5 custom errors.
  -// The codemod has rewritten this to chai's revertedWithCustomError; ensure your project
  -// uses @nomicfoundation/hardhat-chai-matchers (or hardhat-waffle).
  -await expect(token.connect(attacker).transferOwnership(other.address)).to.be.revertedWithCustomError(token, "OwnableUnauthorizedAccount");
  +await expectRevert(token.connect(attacker).transferOwnership(other.address), "Ownable: caller is not the owner");
  
  ---- R07a-ownable-deploy-missing-initial-owner ----
  Output mismatch for test 'R07a-ownable-deploy-missing-initial-owner':
  -// TODO(oz-v5): Ownable v5 requires constructor(address initialOwner). Add the initial owner address.
   const t = await TokenFactory.deploy();
  
  ---- R08-role-hash-literal-warn ----
  Output mismatch for test 'R08-role-hash-literal-warn':
  -// TODO(oz-v5): verify role hash. Precomputed hex; ensure preimage matches the role
  -// string used in the v5 contract (keccak256("MINTER_ROLE")). Consider replacing with
  -// ethers.utils.id("MINTER_ROLE") for self-documentation.
   keccak256("MINTER_ROLE");
  -// TODO(oz-v5): verify role hash. Precomputed hex; ensure preimage matches the role
  -// string used in the v5 contract (keccak256("MINTER_ROLE")). Consider replacing with
  -// ethers.utils.id("MINTER_ROLE") for self-documentation.
   ethers.utils.id("MINTER_ROLE");
  -// TODO(oz-v5): verify role hash. Precomputed hex; ensure preimage matches the role
  -// string used in the v5 contract (keccak256("MINTER_ROLE")). Consider replacing with
  -// ethers.utils.id("MINTER_ROLE") for self-documentation.
   const MINTER_ROLE = "0x9f2df0fed2c77648de5860a4cc508cd0818c85b8b8a1ab4ceeef8d981c8956a6";
  
  ---- R10-removed-symbols-warn ----
  Output mismatch for test 'R10-removed-symbols-warn':
  -// TODO(oz-v5): Address.isContract removed in v5 (ambiguous semantics).
  -// Replace with explicit code-size check or remove the guard.
   if (await Address.isContract(addr)) {}
  -// TODO(oz-v5): _setupRole was removed; use _grantRole on the v5 contract instead.
   await accessControl._setupRole(MINTER_ROLE, minter);
  -// TODO(oz-v5): safePermit was removed in v5.
   await token.safePermit(1);
  -// TODO(oz-v5): increaseAllowance was removed in v5; rewrite the test to use approve() with the new value.
   await token.increaseAllowance(other, 1);
  -// TODO(oz-v5): decreaseAllowance was removed in v5; rewrite the test to use approve() with the new value.
   await token.decreaseAllowance(other, 1);
  
  ---- R11a-import-path-shifts ----
  Output mismatch for test 'R11a-import-path-shifts':
  -await ethers.getContractFactory("@openzeppelin/contracts/token/ERC20/extensions/ERC20Permit.sol:ERC20Permit");
  +await ethers.getContractFactory("@openzeppelin/contracts/token/ERC20/extensions/draft-ERC20Permit.sol:ERC20Permit");
  
  ---- R09-hook-rename-references ----
  Output mismatch for test 'R09-hook-rename-references':
  -// TODO(oz-v5): _beforeTokenTransfer / _afterTokenTransfer hooks are removed in v5.
  -// Use _update instead. ERC721 _update has no `from` arg.
   // We override _beforeTokenTransfer here
  -// TODO(oz-v5): _beforeTokenTransfer / _afterTokenTransfer hooks are removed in v5.
  -// Use _update instead. ERC721 _update has no `from` arg.
   it("calls _beforeTokenTransfer", async () => {
  -    // TODO(oz-v5): _beforeTokenTransfer / _afterTokenTransfer hooks are removed in v5.
  -// Use _update instead. ERC721 _update has no `from` arg.
       await mock.callStatic._beforeTokenTransfer();
   });
  
  failures:
      R01a-ownable-unauthorized-chai
      R01b-ownable-unauthorized-chai-js-variant
      R02-ownable-invalid-owner
      R03a-accesscontrol-missing-role-canonical
      R03b-accesscontrol-missing-role-non-canonical
      R04-erc20-revert-strings
      R05-pausable-revert-strings
      R06-revert-strings-test-helpers
      R07a-ownable-deploy-missing-initial-owner
      R08-role-hash-literal-warn
      R10-removed-symbols-warn
      R11a-import-path-shifts
      R09-hook-rename-references
  
  test result: FAILED. 3 passed; 13 failed; 0 ignored; 0 measured; 0 filtered out; finished in 0.00s
  ---
  $ cd ~/oz-v5/codemod && git log --oneline
  8ae48b1 (HEAD -> main) test(R01-R11): add baseline red-state TDD fixtures for codemod
  4dc6634 chore: ignore .claude session dir + sync lockfile to renamed package
  def2efe docs: phase-0 migration spec for OZ v4 -> v5 JS/TS
  17b4031 chore: rename package + drop skill-install scaffold node
  fb2c391 chore: scaffold from npx codemod init
  ---
  $ cd ~/oz-v5/codemod && git diff --stat HEAD~1 HEAD -- tests/
   tests/R01a-ownable-unauthorized-chai/README.md                       |  4 ++++
   tests/R01a-ownable-unauthorized-chai/expected.ts                     |  1 +
   tests/R01a-ownable-unauthorized-chai/input.ts                        |  1 +
   tests/R01b-ownable-unauthorized-chai-js-variant/README.md            |  4 ++++
   tests/R01b-ownable-unauthorized-chai-js-variant/expected.js          |  1 +
   tests/R01b-ownable-unauthorized-chai-js-variant/input.js             |  1 +
   tests/R01c-ownable-unauthorized-chai-negation/README.md              |  4 ++++
   tests/R01c-ownable-unauthorized-chai-negation/expected.ts            |  1 +
   tests/R01c-ownable-unauthorized-chai-negation/input.ts               |  1 +
   tests/R02-ownable-invalid-owner/README.md                            |  4 ++++
   tests/R02-ownable-invalid-owner/expected.ts                          |  1 +
   tests/R02-ownable-invalid-owner/input.ts                             |  1 +
   tests/R03a-accesscontrol-missing-role-canonical/README.md            |  4 ++++
   tests/R03a-accesscontrol-missing-role-canonical/expected.ts          |  1 +
   tests/R03a-accesscontrol-missing-role-canonical/input.ts             |  1 +
   tests/R03b-accesscontrol-missing-role-non-canonical/README.md        |  4 ++++
   tests/R03b-accesscontrol-missing-role-non-canonical/expected.ts      |  2 ++
   tests/R03b-accesscontrol-missing-role-non-canonical/input.ts         |  1 +
   tests/R04-erc20-revert-strings/README.md                             |  4 ++++
   tests/R04-erc20-revert-strings/expected.ts                           |  3 +++
   tests/R04-erc20-revert-strings/input.ts                              |  3 +++
   tests/R05-pausable-revert-strings/README.md                          |  4 ++++
   tests/R05-pausable-revert-strings/expected.ts                        |  2 ++
   tests/R05-pausable-revert-strings/input.ts                           |  2 ++
   tests/R06-revert-strings-test-helpers/README.md                      |  4 ++++
   tests/R06-revert-strings-test-helpers/expected.ts                    |  5 +++++
   tests/R06-revert-strings-test-helpers/input.ts                       |  2 ++
   tests/R07a-ownable-deploy-missing-initial-owner/README.md            |  4 ++++
   tests/R07a-ownable-deploy-missing-initial-owner/expected.ts          |  2 ++
   tests/R07a-ownable-deploy-missing-initial-owner/input.ts             |  1 +
   tests/R07b-ownable-deploy-missing-initial-owner-negative/README.md   |  4 ++++
   tests/R07b-ownable-deploy-missing-initial-owner-negative/expected.ts |  1 +
   tests/R07b-ownable-deploy-missing-initial-owner-negative/input.ts    |  1 +
   tests/R08-role-hash-literal-warn/README.md                           |  4 ++++
   tests/R08-role-hash-literal-warn/expected.ts                         | 12 ++++++++++++
   tests/R08-role-hash-literal-warn/input.ts                            |  3 +++
   tests/R09-hook-rename-references/README.md                           |  4 ++++
   tests/R09-hook-rename-references/expected.ts                         | 10 ++++++++++
   tests/R09-hook-rename-references/input.ts                            |  4 ++++
   tests/R10-removed-symbols-warn/README.md                             |  4 ++++
   tests/R10-removed-symbols-warn/expected.ts                           | 11 +++++++++++
   tests/R10-removed-symbols-warn/input.ts                              |  5 +++++
   tests/R11a-import-path-shifts/README.md                              |  4 ++++
   tests/R11a-import-path-shifts/expected.ts                            |  1 +
   tests/R11a-import-path-shifts/input.ts                               |  1 +
   tests/R11b-import-path-shifts-negative/README.md                     |  4 ++++
   tests/R11b-import-path-shifts-negative/expected.ts                   |  1 +
   tests/R11b-import-path-shifts-negative/input.ts                      |  1 +
   tests/fixtures/expected.js                                           |  3 ---
   tests/fixtures/input.js                                              |  3 ---
   50 files changed, 148 insertions(+), 6 deletions(-)

Fixture status table (after baseline npm test):
  | Fixture | Kind | Status | Reason |
  | --- | --- | --- | --- |
  | R01a-ownable-unauthorized-chai | deterministic | FAIL | placeholder transform doesn't rewrite |
  | R01b-ownable-unauthorized-chai-js-variant | deterministic | FAIL | placeholder transform doesn't rewrite |
  | R01c-ownable-unauthorized-chai-negation | negative | PASS (incidental) | placeholder leaves unchanged |
  | R02-ownable-invalid-owner | deterministic | FAIL | placeholder transform doesn't rewrite |
  | R03a-accesscontrol-missing-role-canonical | deterministic | FAIL | placeholder transform doesn't rewrite |
  | R03b-accesscontrol-missing-role-non-canonical | warn-with-todo | FAIL | placeholder transform doesn't prepend TODO |
  | R04-erc20-revert-strings | deterministic | FAIL | placeholder transform doesn't rewrite |
  | R05-pausable-revert-strings | deterministic | FAIL | placeholder transform doesn't rewrite |
  | R06-revert-strings-test-helpers | deterministic | FAIL | placeholder transform doesn't rewrite |
  | R07a-ownable-deploy-missing-initial-owner | warn-with-todo | FAIL | placeholder transform doesn't prepend TODO |
  | R07b-ownable-deploy-missing-initial-owner-negative | negative | PASS (incidental) | placeholder leaves unchanged |
  | R08-role-hash-literal-warn | warn-with-todo | FAIL | placeholder transform doesn't prepend TODO |
  | R09-hook-rename-references | warn-with-todo | FAIL | placeholder transform doesn't prepend TODO |
  | R10-removed-symbols-warn | warn-with-todo | FAIL | placeholder transform doesn't prepend TODO |
  | R11a-import-path-shifts | deterministic | FAIL | placeholder transform doesn't rewrite |
  | R11b-import-path-shifts-negative | negative | PASS (incidental) | placeholder leaves unchanged |

Total fixtures: 16
Currently passing (incidentally): 3  ← these MUST be the negative tests; flag any others
Currently failing (expected): 13

Open questions for PM:
  - none

Suggested next phase: Phase 2 — implement deterministic transforms one rule at a time, turn fixture FAIL → PASS, commit per rule.
=== END REPORT ===

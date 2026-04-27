=== PHASE REPORT ===
Phase: 0 — Recon, scaffold cleanup, migration spec
Status: COMPLETE

Files created/modified:
  - .git/** — initialized fresh repo for the codemod project
  - package.json — renamed `Learning` -> `openzeppelin-v4-to-v5-js`, updated description
  - codemod.yaml — same rename + description
  - README.md — replaced placeholder content with one-paragraph description of the codemod
  - workflow.yaml — removed leftover `install-package-skill` scaffold node; only `apply-transforms` remains
  - MIGRATION_RULES.md (new, 393 lines, 11 rules) — main artifact: full v4 -> v5 JS/TS migration spec, citation-backed, with fire-rate table populated against origin-dollar @ pinned SHA
  - reports/phase-0.md (this file)
  - ~/oz-v5/_reference/origin-dollar/** — clone target, checked out at the pinned SHA (read-only inspection from this point on)

Commands run (with full stdout, not summaries):

  $ cd ~/oz-v5/codemod && git log --oneline
  17b4031 chore: rename package + drop skill-install scaffold node
  fb2c391 chore: scaffold from npx codemod init
  ---
  $ cd ~/oz-v5/codemod && cat package.json codemod.yaml workflow.yaml
  {
    "name": "openzeppelin-v4-to-v5-js",
    "version": "0.1.0",
    "description": "jssg codemod that migrates Hardhat JS/TS test and script files from OpenZeppelin Contracts v4 to v5",
    "type": "module",
    "scripts": {
      "test": "npx codemod@latest jssg test -l typescript ./scripts/codemod.ts",
      "check-types": "tsc --noEmit"
    },
    "devDependencies": {
      "@codemod.com/jssg-types": "latest",
      "typescript": "latest"
    }
  }
  schema_version: "1.0"

  name: "openzeppelin-v4-to-v5-js"
  version: "0.1.0"
  description: "jssg codemod that migrates Hardhat JS/TS test and script files from OpenZeppelin Contracts v4 to v5"
  author: "0xjaadu"
  license: "MIT"
  workflow: "workflow.yaml"


  targets:
    languages: ["typescript"]

  keywords: ["transformation", "migration"]

  registry:
    access: "private"
    visibility: "private"

  capabilities: []
  # yaml-language-server: $schema=https://raw.githubusercontent.com/codemod/codemod/refs/heads/main/schemas/workflow.json

  version: "1"

  nodes:
    - id: apply-transforms
      name: Apply AST Transformations
      type: automatic
      steps:
        - name: "Scan typescript files and apply fixes"
          js-ast-grep:
            js_file: scripts/codemod.ts
            language: "typescript"
  ---
  $ cd ~/oz-v5/codemod && wc -l MIGRATION_RULES.md
  393 MIGRATION_RULES.md
  ---
  $ cd ~/oz-v5/codemod && grep -c "^## Rule R" MIGRATION_RULES.md
  11
  ---
  $ git -C ~/oz-v5/_reference/origin-dollar rev-parse HEAD
  dbae51ad8d9f6f2ec24073414e2a6d46716d1ddd
  ---
  $ grep -n openzeppelin ~/oz-v5/_reference/origin-dollar/contracts/package.json
  84:    "@openzeppelin/contracts": "4.4.2",
  85:    "@openzeppelin/defender-sdk": "2.7.0",
  86:    "@openzeppelin/hardhat-upgrades": "1.27.0",
  147:    "@openzeppelin/contracts": "4.4.2"
  ---
  $ cd ~/oz-v5/_reference/origin-dollar/contracts && rg -n 'revertedWith\("Ownable: ' test/ scripts/ deploy/ | head -20
  test/poolBooster/poolBooster.mainnet.fork-test.js:273:      ).to.be.revertedWith("Ownable: caller is not the owner");
  test/strategies/stakingConsolidation.mainnet.fork-test.js:637:        await expect(tx).to.be.revertedWith("Ownable: caller is not the owner");
  test/strategies/stakingConsolidation.mainnet.fork-test.js:1121:        await expect(tx).to.be.revertedWith("Ownable: caller is not the owner");
  test/strategies/stakingConsolidation.mainnet.fork-test.js:1383:        await expect(tx).to.be.revertedWith("Ownable: caller is not the owner");
  ---
  $ cd ~/oz-v5/_reference/origin-dollar/contracts && rg -nc 'expectRevert\(' test/ scripts/ deploy/ || echo "0 matches"
  0 matches
  ---
  $ cd ~/oz-v5/codemod && npm test
  > openzeppelin-v4-to-v5-js@0.1.0 test
  > npx codemod@latest jssg test -l typescript ./scripts/codemod.ts

  npm warn exec The following package was not found and will be installed: codemod@1.8.3

  running 1 test
  test fixtures ... FAILED

  failures:

  ---- fixtures ----
  Output mismatch for test 'fixtures':
  -const oldVariable = "should be const";
  -const anotherVar = 42;
  +const oldVariable = "should be const"
  +const anotherVar = 42
   console.log("debug statement");



  failures:
      fixtures

  test result: FAILED. 0 passed; 1 failed; 0 ignored; 0 measured; 0 filtered out; finished in 0.00s

  exit code: 1
  ---
  (additional fire-rate ripgreps run against origin-dollar — counts pasted below in fire-rate section)

Rule inventory: 11 rules across 6 categories (R01–R11)
Per-category rule count:
  - revert-string (chai):           5  (R01, R02, R03, R04, R05)
  - revert-string (test-helpers):   1  (R06)
  - constructor-arg:                1  (R07)
  - role-hash:                      1  (R08)
  - hook-rename:                    1  (R09)
  - renamed-symbol:                 1  (R10)
  - import-path:                    1  (R11)

Citations sanity check: yes — every rule (R01–R11) has at least one explicit OZ source citation
(release-notes URL anchor, CHANGELOG.md entry, or v5.0.0 source file with the exact `error`/`constructor`
declaration). Where v4 revert strings are quoted, they are sourced directly from v4.4.2 source files. No
uncited rules were included.

Reference repo fire-rate estimates:
  - R01 (Ownable: caller is not the owner): 4 hits
      rg -n -g '*.js' -g '*.ts' 'revertedWith\("Ownable: caller' test/ scripts/ deploy/
  - R02 (Ownable: new owner is the zero address): 0 hits — still shipped (common in non-origin-dollar repos)
  - R03 (AccessControl: account ... is missing role ...): 8 hits, all in test/token/woeth.{arb,base,plume,sonic}.fork-test.js
      rg -n -g '*.js' -g '*.ts' 'AccessControl: account' test/ scripts/ deploy/
  - R04 (ERC20: revert strings): 0 hits — still shipped (common pattern in OZ v4 repos)
  - R05 (Pausable: paused / not paused): 3 hits
      test/strategies/nativeSSVStaking.js:594, test/strategies/compoundingSSVStaking.js:960 + 992
  - R06 (test-helpers expectRevert): 0 hits — origin-dollar uses Waffle chai matchers exclusively. Confirmed.
      Rule still shipped: ubiquitous in older OZ-v4 repos.
  - R07 (zero-arg .deploy()): 10 hits across test/safe-modules/{ousd-rebalancer-module, curve-pool-booster-bribes, merkl-pool-booster-bribes}.js
      Note: warn-only; intentionally over-broad. Many of these factories are *not* Ownable in v5.
  - R08 (precomputed `_ROLE = "0x..."` hex literal): 8 declarations across 4 fixture files
      test/_fixture-{arb,base,plume,sonic}.js — each declares MINTER_ROLE and BURNER_ROLE as 32-byte hex
      Multi-line aware rg: rg -nU --multiline -g '*.js' -g '*.ts' '_ROLE\s*=\s*\n?\s*"0x[0-9a-fA-F]{64}"' test/ scripts/ deploy/
  - R09 (_beforeTokenTransfer / _afterTokenTransfer): 0 hits in JS/TS — still shipped (cheap, comments only)
  - R10 (removed/renamed symbols at JS surface): 0 hits in JS/TS (matches in .sol and .json ABI files are out of scope)
      rg -n -g '*.js' -g '*.ts' '_setupRole|\.isContract\(|_exists\(|safePermit\(|_requireMinted\(|increaseAllowance\(|decreaseAllowance\(' test/ scripts/ deploy/
  - R11 (import-path renames): 0 hits in JS/TS — still shipped (common in repos that hard-code OZ paths)
      rg -n -g '*.js' -g '*.ts' 'draft-ERC20Permit|draft-IERC20Permit|draft-EIP712|security/Pausable|security/ReentrancyGuard|utils/Checkpoints\.sol|AddressUpgradeable|IERC20Upgradeable' test/ scripts/ deploy/

Total rule-firing pattern count on origin-dollar JS/TS surface: ~33 (R01: 4, R03: 8, R05: 3, R07: 10, R08: 8 declarations).
This gives the codemod a meaningful demo footprint on origin-dollar without inflating expectations.

Sanity test (npm test) result: FAIL with exit code 1 (expected — placeholder var->const transform output
emits semicolon-less lines while the expected fixture has semicolons; this is scaffold behavior and is not
a Phase-0 issue. Phase 1 owns fixtures + Phase 2 owns the transform — both will replace these outputs).
First 20 lines of output:
  > openzeppelin-v4-to-v5-js@0.1.0 test
  > npx codemod@latest jssg test -l typescript ./scripts/codemod.ts
  npm warn exec The following package was not found and will be installed: codemod@1.8.3
  running 1 test
  test fixtures ... FAILED

  failures:

  ---- fixtures ----
  Output mismatch for test 'fixtures':
  -const oldVariable = "should be const";
  -const anotherVar = 42;
  +const oldVariable = "should be const"
  +const anotherVar = 42
   console.log("debug statement");

  failures:
      fixtures

  test result: FAILED. 0 passed; 1 failed; 0 ignored; 0 measured; 0 filtered out; finished in 0.00s

Open questions for PM:
  - R03 is currently locked as warn-with-todo per spec. The fire-rate against origin-dollar (8 hits, all
    in the same canonical template-literal form `\`AccessControl: account ${signer.address.toLowerCase()} is missing role ${HEX}\``)
    suggests Phase 2 could safely upgrade R03 to a deterministic rewrite for that exact template-literal
    form, while keeping warn-only for non-canonical variants. Confirm whether to plan this for Phase 2.
  - R07 (zero-arg deploy warn-with-todo) is over-broad — it will tag every zero-arg deploy on origin-dollar's
    safe-modules tests including factories that are not Ownable in v5. Confirm we accept this as the price of
    high recall, or whether to gate on factory name heuristics (e.g. only fire if the factory name regex-
    matches `/Token|Vault|Governor|Ownable|Strategy/`). Current spec says no heuristic; comment-only.
  - The decision to put `Pausable: paused` -> `EnforcedPause` and `Pausable: not paused` -> `ExpectedPause`
    is based on the v5.0.0 source for `contracts/utils/Pausable.sol`. The mapping is unambiguous, but worth
    a sanity check on a real Pausable test before Phase 3 ships.

Suggested next phase: Phase 1: write fixtures (input + expected) for every rule before writing any transform.
=== END REPORT ===

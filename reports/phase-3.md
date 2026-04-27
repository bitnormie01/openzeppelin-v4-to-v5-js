=== PHASE REPORT ===
Phase: 3 — Real-repo dry run
Status: COMPLETE

Codemod run method:
  - Created a copy of origin-dollar inside `/tmp/origin-dollar-dryrun/`.
  - Ran the codemod sequentially against the JS directories using `jssg run` via `npx` with `--allow-dirty` flag to bypass the prompt.
  - Commands used:
    `npx -y codemod@latest jssg run /home/anuj/oz-v5/codemod/scripts/codemod.ts --language typescript --target contracts/test/ --allow-dirty`
    `npx -y codemod@latest jssg run /home/anuj/oz-v5/codemod/scripts/codemod.ts --language typescript --target contracts/deploy/ --allow-dirty`

Diff summary:
  - Files changed: 13
  - Lines added: 61
  - Lines removed: 7

Hunk-by-hunk analysis:
  contracts/test/_fixture-arb.js:15-21 — R08 — ✅ correct — successfully prepended role hash warnings
  contracts/test/_fixture-base.js:37-43 — R08 — ✅ correct — successfully prepended role hash warnings
  contracts/test/_fixture-plume.js:59-65 — R08 — ✅ correct — successfully prepended role hash warnings
  contracts/test/_fixture-sonic.js:81-87 — R08 — ✅ correct — successfully prepended role hash warnings
  contracts/test/poolBooster/poolBooster.mainnet.fork-test.js:270-272 — R01 — ✅ correct — successfully replaced revertedWith
  contracts/test/safe-modules/curve-pool-booster-bribes.js:110-131 — R07 — ✅ correct — successfully prepended zero-arg deploy warning
  contracts/test/safe-modules/merkl-pool-booster-bribes.js:142-159 — R07 — ✅ correct — successfully prepended zero-arg deploy warning
  contracts/test/safe-modules/ousd-rebalancer-module.js:170-179 — R07 — ✅ correct — successfully prepended zero-arg deploy warning
  contracts/test/strategies/compoundingSSVStaking.js:957-989 — R05 — ✅ correct — successfully replaced revertedWith
  contracts/test/strategies/nativeSSVStaking.js:591-594 — R05 — ✅ correct — successfully replaced revertedWith
  contracts/test/strategies/stakingConsolidation.mainnet.fork-test.js:634-1380 — R01 — ✅ correct — successfully replaced revertedWith
  contracts/test/token/woeth.arb.fork-test.js:46-146 — R03b — 🎨 formatting — correctly identified AccessControl but inserted the comment mid-statement due to line-matching regex logic. Valid syntax but suboptimal formatting.
  contracts/test/token/woeth.base.fork-test.js:46-146 — R03b — 🎨 formatting — correctly identified AccessControl but inserted the comment mid-statement due to line-matching regex logic. Valid syntax but suboptimal formatting.

Fire-rate comparison:
  | Rule | Expected | Actual | Notes |
  | --- | --- | --- | --- |
  | R01 | 4 | 4 | Exact match on staking and poolBooster tests |
  | R03 | 8 | 8 | Matched in woeth.arb and woeth.base |
  | R05 | 3 | 3 | Exact match on SSV staking tests |
  | R07 | 10 | 10 | Exact match across various safe-modules tests |
  | R08 | 8 declarations | 8 | Exact match on role hashes in _fixture-* files |
  | Others | 0 | 0 | No stray rewrites detected |

Classification summary:
  - Correct transforms: 31
  - False positives: 0 (none)
  - Missed patterns: 0 (none)
  - Formatting issues: 2 (R03b comment insertion inside multi-line statement)

Fixes applied:
  - d3f8a96 — fix(R08): prevent indentation regex from capturing newlines. Eliminated extraneous blank lines that were initially injected inside role hash comments.

Test results after fixes:
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

Git log:
  $ git log --oneline
  d3f8a96 (HEAD -> main) fix(R08): prevent indentation regex from capturing newlines
  4d67614 feat(R06-R10): implement warn-only rules and test-helpers transforms
  01affb9 feat(R01-R05): implement ownable and erc20 revert-string transforms
  cdf5ec9 feat(R11): implement import path shifts
  8ae48b1 test(R01-R11): add baseline red-state TDD fixtures for codemod

Open questions for PM:
  - Should we attempt to use an AST wrapper for R03b to prevent the warning comment from being inserted mid-expression in deeply nested calls? This is currently skipped to avoid breaking single-line assumptions.

Suggested next phase: Phase 4 (AI-step fallback) or Phase 5 (polish) depending on findings.
=== END REPORT ===

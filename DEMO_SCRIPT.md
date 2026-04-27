# Demo Video Script

**Target Length:** 2-3 minutes
**Purpose:** Showcase the value and functionality of the `openzeppelin-v4-to-v5-js` codemod for the DoraHacks BUIDL submission.

---

### 0:00–0:15 | The Problem
*Visual: Open a real-world Hardhat test file (e.g. from `OriginProtocol/origin-dollar`) that asserts OpenZeppelin v4 revert strings.*
**Voiceover:** "When upgrading a project from OpenZeppelin v4 to v5, you don't just change your Solidity code. All of your Hardhat tests and deploy scripts break. Revert strings become Custom Errors, `Ownable` constructors now demand an initial owner, and hooks like `_beforeTokenTransfer` are completely removed. Manually tracking down and fixing hundreds of these assertions across your test suite is incredibly tedious."

### 0:15–0:30 | The Codemod Solution
*Visual: Split screen or side-by-side comparison of `examples/revert-string-before.js` and `examples/revert-string-after.js`.*
**Voiceover:** "To solve this, we built a deterministic `jssg` codemod that automates the migration of JS and TS testing surfaces. Here you can see how it automatically maps a v4 standard ERC20 revert string directly to the new v5 Custom Error interface using `revertedWithCustomError`, injecting the right syntax flawlessly."

### 0:30–1:30 | Live Run Against Origin-Dollar
*Visual: Terminal window showing the `/tmp/origin-dollar-dryrun/` directory.*
**Voiceover:** "Let's see it in action against a real-world codebase: Origin Protocol's origin-dollar repository. We simply run `npx codemod ...` against the `contracts/test/` directory."
*Action: Type and execute `npx codemod jssg run ./scripts/codemod.ts --language typescript --target contracts/test/`.*
**Voiceover:** "In just a second, it processes the entire suite. Let's look at the diff."
*Action: Run `git diff` and slowly scroll through the changes.*
**Voiceover:** "You can see it replaced `Ownable` unauthorized errors, rewrote complex `AccessControl` string interpolations, and added helpful warnings directly above zero-argument deploys that might now require an `initialOwner`. Out of 33 transforms across 13 files, we had zero false positives."

### 1:30–2:00 | Fixture Test Suite & Reliability
*Visual: Terminal window in the `oz-v5/codemod` repo running `npm test`.*
**Voiceover:** "Because codemods manipulate your code directly, trust is paramount. We built this codemod using strict Test-Driven Development."
*Action: Hit enter on `npm test` to show the 16/16 green checkmarks.*
**Voiceover:** "We maintain a rigid suite of 16 granular fixtures encompassing 11 distinct migration rules—including negative tests to guarantee the script never touches code it shouldn't. If the tests pass, your codebase is safe."

### 2:00–2:30 | Wrap-up
*Visual: Show the Rule Coverage Table in the README.md.*
**Voiceover:** "The `openzeppelin-v4-to-v5-js` codemod handles 11 critical v4-to-v5 migration rules spanning Access Control, Tokens, Security, and internal path shifts. It's built entirely on the `ast-grep` and `jssg` framework for maximum precision. Check out our GitHub repository or run it directly from the Codemod Registry today. Thanks for watching!"

# openzeppelin-v4-to-v5-js

**Tagline:** Automating the JavaScript/TypeScript surface migration from OpenZeppelin v4 to v5.

## The Problem
When developers upgrade their smart contracts from OpenZeppelin Contracts v4 to v5, they encounter a massive breaking change that extends beyond Solidity: their entire Hardhat testing and deployment suites break. OpenZeppelin v5 replaces standardized revert strings (like `"ERC20: transfer amount exceeds balance"`) with Custom Errors (`ERC20InsufficientBalance`), demands `initialOwner` arguments in `Ownable` deployments, drops legacy hooks like `_beforeTokenTransfer`, and shifts internal import paths. 

Developers are forced to manually track down and rewrite hundreds of test assertions and deployment scripts scattered across their off-chain repositories—a tedious, error-prone process that deters teams from upgrading to the secure v5 standard.

## Our Solution
We built a deterministic `jssg` (JavaScript Syntax-Specific Grep) codemod that programmatically upgrades your Hardhat JS/TS code to be compatible with your newly upgraded v5 contracts. 

It handles 11 specific migration rules across 7 categories, converting revert strings, shifting import paths, and strategically injecting warn-only `// TODO` comments above deployments or legacy methods that require manual verification. 

## Technical Approach
We adopted a "Deterministic-first" philosophy utilizing the Codemod platform's `jssg` wrapper around `ast-grep`. 
- **AST Pattern Matching:** Instead of relying on fragile regex for complex assertions, we leverage `ast-grep` to parse the Abstract Syntax Tree. This allows us to accurately identify `expect(...).to.be.revertedWith(...)` statements, isolate the caller instance, and correctly inject Chai's `.revertedWithCustomError(contract, "Error")` syntax.
- **Test-Driven Development (TDD):** We constructed a strict baseline of 16 highly specific fixtures (including negative/no-rewrite tests) to ensure absolute precision.
- **Fail-safe Injectors:** For inherently ambiguous patterns (like zero-argument `.deploy()` calls that *might* be `Ownable` contracts needing an `initialOwner`), we built warn-only heuristics that prepend clear, actionable `// TODO(oz-v5)` comments rather than guessing and breaking code.

## Key Stats & Real-World Validation
To prove efficacy, we performed a dry run of the codemod against the massive `OriginProtocol/origin-dollar` repository:
- **11** distinct migration rules implemented.
- **16/16** fixtures passing in our TDD baseline.
- **33** real-repo transforms executed successfully across 13 files.
- **0** false positives or missed patterns during validation.

## Links
- **Demo Video:** [Placeholder Link - USER TO PROVIDE]
- **GitHub Repository:** https://github.com/bitnormie01/openzeppelin-v4-to-v5-js
- **Codemod Registry:** https://app.codemod.com/registry/openzeppelin-v4-to-v5-js

## Team
Built by Satyam & 0xjaadu for the Codemod Hackathon.

# OpenZeppelin v4 → v5 JS/TS Migration Rules

Target: Hardhat test/script files (.js/.ts). Out of scope: .sol, Foundry, contract logic.
Reference repo for fire-rate estimation: OriginProtocol/origin-dollar @ `dbae51ad8d9f6f2ec24073414e2a6d46716d1ddd`
(OZ Contracts pinned to `4.4.2` in `contracts/package.json`.)

Citation conventions used below:
- **REL** = OpenZeppelin Contracts v5.0.0 release notes, https://github.com/OpenZeppelin/openzeppelin-contracts/releases/tag/v5.0.0
- **SRC@v5.0.0/<path>** = file at https://github.com/OpenZeppelin/openzeppelin-contracts/blob/v5.0.0/<path> (custom error declarations are in this source)
- **SRC@v4.4.2/<path>** = file at https://github.com/OpenZeppelin/openzeppelin-contracts/blob/v4.4.2/<path> (v4 revert strings are in this source)
- **CHG** = CHANGELOG.md at https://github.com/OpenZeppelin/openzeppelin-contracts/blob/v5.0.0/CHANGELOG.md
- **6093** = ERC-6093 custom-error interface, `contracts/interfaces/draft-IERC6093.sol` at v5.0.0

Each rule is one of:
- `deterministic-rewrite` — codemod replaces text mechanically.
- `warn-with-todo` — codemod inserts a `// TODO(oz-v5): ...` comment above the match without changing semantics. Used when an automated rewrite cannot be done safely (e.g. role hashes, missing constructor args).

Rules grouped by category. IDs are stable.

---

## Rule R01: ownable-unauthorized-revert-string-chai

- **Category**: revert-string
- **Kind**: deterministic-rewrite (with documented fallback)
- **Trigger pattern (informal)**: A chai assertion `expect(<promise>).to.be.revertedWith("Ownable: caller is not the owner")`, including chained `.eventually.` and `await expect(...)` variants.
- **OZ source citation**:
  - v4 string: SRC@v4.4.2/contracts/access/Ownable.sol — `require(owner() == _msgSender(), "Ownable: caller is not the owner");`
  - v5 error: SRC@v5.0.0/contracts/access/Ownable.sol — `error OwnableUnauthorizedAccount(address account);`
  - REL: "Ownable: ... custom errors `OwnableUnauthorizedAccount`, `OwnableInvalidOwner`."
- **Before**:
  ```ts
  await expect(token.connect(attacker).transferOwnership(other.address))
    .to.be.revertedWith("Ownable: caller is not the owner");
  ```
- **After** (when a contract handle `<C>` is in scope at the assertion site):
  ```ts
  await expect(token.connect(attacker).transferOwnership(other.address))
    .to.be.revertedWithCustomError(token, "OwnableUnauthorizedAccount")
    .withArgs(attacker.address);
  ```
- **Fallback** (no statically-resolvable contract handle): rewrite the matcher to `revertedWith("OwnableUnauthorizedAccount")` and prepend `// TODO(oz-v5): replace with revertedWithCustomError(<contract>, "OwnableUnauthorizedAccount").withArgs(<account>); the codemod could not infer the contract handle.` This keeps the test compiling while flagging the spot. The fallback is a deliberate compromise: chai's `revertedWith` does substring-match on the *string* form of a revert — for custom errors that emit only an `errorName(args)` payload it will not match by default. Document this in the README so users know the fallback assertions are intentionally weakened pending human cleanup.
- **Variants to handle**:
  - `await expect(p).to.be.revertedWith("...")`
  - `expect(p).to.be.revertedWith("...")` (synchronous/promise return)
  - `expect(p).to.eventually.be.revertedWith("...")`
  - Chained negation `.to.not.be.revertedWith` — leave alone; rewriting a negation is unsafe.
  - String concatenation / template literal building the exact v4 string — handle exact-string literals only; skip dynamic forms and emit a warn-with-todo comment.
- **Expected to fire on origin-dollar**: yes (see fire-rate table; `Ownable:` revertedWith calls are common in `contracts/test/`).
- **Risk / known false positives**: A user-defined error message that happens to contain "Ownable: caller is not the owner" as a substring would be falsely matched. Mitigation: compare to the exact full string only (no substring/regex).

---

## Rule R02: ownable-invalid-owner-revert-string-chai

- **Category**: revert-string
- **Kind**: deterministic-rewrite (with fallback per R01)
- **Trigger pattern (informal)**: `revertedWith("Ownable: new owner is the zero address")`.
- **OZ source citation**:
  - v4 string: SRC@v4.4.2/contracts/access/Ownable.sol — `require(newOwner != address(0), "Ownable: new owner is the zero address");`
  - v5 error: SRC@v5.0.0/contracts/access/Ownable.sol — `error OwnableInvalidOwner(address owner);` (REL bullet "OwnableInvalidOwner")
- **Before**:
  ```ts
  await expect(token.transferOwnership(ethers.constants.AddressZero))
    .to.be.revertedWith("Ownable: new owner is the zero address");
  ```
- **After**:
  ```ts
  await expect(token.transferOwnership(ethers.constants.AddressZero))
    .to.be.revertedWithCustomError(token, "OwnableInvalidOwner")
    .withArgs(ethers.constants.AddressZero);
  ```
- **Variants to handle**: same set as R01.
- **Expected to fire on origin-dollar**: low probability (zero-address transferOwnership tests are uncommon); still ship — common in other repos.
- **Risk / known false positives**: as R01.

---

## Rule R03: accesscontrol-missing-role-revert-string-chai

- **Category**: revert-string
- **Kind**: warn-with-todo (because the v4 string is dynamically built and the v5 error needs the role bytes32 the test was checking)
- **Trigger pattern (informal)**: `revertedWith` with a string matching the regex `/^AccessControl: account 0x[0-9a-f]{40} is missing role 0x[0-9a-f]{64}$/`, or a string built by `\`AccessControl: account ${addr} is missing role ${role}\``, or by `.to.include("AccessControl: account")`/`.to.match(/AccessControl: account/)`.
- **OZ source citation**:
  - v4 string format: SRC@v4.4.2/contracts/access/AccessControl.sol `_checkRole` — `revert(string(abi.encodePacked("AccessControl: account ", Strings.toHexString(uint160(account), 20), " is missing role ", Strings.toHexString(uint256(role), 32))));`
  - v5 error: SRC@v5.0.0/contracts/access/IAccessControl.sol — `error AccessControlUnauthorizedAccount(address account, bytes32 neededRole);`
  - REL: "AccessControl: Use custom errors instead of revert strings."
- **Before**:
  ```ts
  await expect(token.connect(stranger).mint(target, 1))
    .to.be.revertedWith(
      `AccessControl: account ${stranger.address.toLowerCase()} is missing role ${MINTER_ROLE}`
    );
  ```
- **After** (warn-with-todo, no rewrite):
  ```ts
  // TODO(oz-v5): replace with .revertedWithCustomError(<contract>, "AccessControlUnauthorizedAccount").withArgs(<account>, <role>)
  await expect(token.connect(stranger).mint(target, 1))
    .to.be.revertedWith(
      `AccessControl: account ${stranger.address.toLowerCase()} is missing role ${MINTER_ROLE}`
    );
  ```
- **Variants to handle**: template literal, string concatenation, `.to.include`, `.to.match` regex on `AccessControl: account`.
- **Expected to fire on origin-dollar**: yes (origin-dollar uses AccessControl-protected vault mint paths in `contracts/test/`).
- **Risk / known false positives**: low. We are only adding a comment; no code semantics change.
- **Why warn-only**: the v5 error is `(address, bytes32)`. To produce a clean `withArgs` the codemod would need to (a) resolve the contract handle in scope, (b) pull the address from the template-literal placeholder, (c) pull the role identifier from the same. ast-grep can do (b) and (c) syntactically when the v4 string is built from the exact pair `${addr.address.toLowerCase()}` + `${ROLE_CONST}`, but variation across repos is high. Phase 2 may upgrade R03 from warn-only to deterministic for the canonical template-literal form; for Phase 0 spec we lock it as warn-only.

---

## Rule R04: erc20-revert-strings-chai

- **Category**: revert-string
- **Kind**: deterministic-rewrite (with fallback per R01)
- **Trigger pattern (informal)**: `revertedWith` against any of the v4.4.2 ERC20 revert strings:
  - `"ERC20: transfer amount exceeds balance"` → `ERC20InsufficientBalance(address sender, uint256 balance, uint256 needed)`
  - `"ERC20: transfer amount exceeds allowance"` → `ERC20InsufficientAllowance(address spender, uint256 allowance, uint256 needed)`
  - `"ERC20: transfer from the zero address"` → `ERC20InvalidSender(address)`
  - `"ERC20: transfer to the zero address"` → `ERC20InvalidReceiver(address)`
  - `"ERC20: approve from the zero address"` → `ERC20InvalidApprover(address)`
  - `"ERC20: approve to the zero address"` → `ERC20InvalidSpender(address)`
  - `"ERC20: mint to the zero address"` → `ERC20InvalidReceiver(address)`
  - `"ERC20: burn from the zero address"` → `ERC20InvalidSender(address)`
  - `"ERC20: burn amount exceeds balance"` → `ERC20InsufficientBalance(address, uint256, uint256)`
  - `"ERC20: decreased allowance below zero"` → `decreaseAllowance` was *removed* from v5 entirely (REL: "Removed the non-standard `increaseAllowance` and `decreaseAllowance` functions"); flag as `warn-with-todo` saying the function is gone, do not auto-rewrite.
- **OZ source citation**:
  - v4 strings: SRC@v4.4.2/contracts/token/ERC20/ERC20.sol (verified verbatim list)
  - v5 errors: 6093 — `IERC20Errors` block in `contracts/interfaces/draft-IERC6093.sol`:
    ```
    error ERC20InsufficientBalance(address sender, uint256 balance, uint256 needed);
    error ERC20InvalidSender(address sender);
    error ERC20InvalidReceiver(address receiver);
    error ERC20InsufficientAllowance(address spender, uint256 allowance, uint256 needed);
    error ERC20InvalidApprover(address approver);
    error ERC20InvalidSpender(address spender);
    ```
  - REL: "Use custom errors as standardized in ERC-6093."
- **Before**:
  ```ts
  await expect(token.transfer(other.address, tooMuch))
    .to.be.revertedWith("ERC20: transfer amount exceeds balance");
  ```
- **After** (zero-arg fallback — see notes):
  ```ts
  // TODO(oz-v5): if the contract handle is in scope, prefer .revertedWithCustomError(<token>, "ERC20InsufficientBalance").withArgs(<sender>, <balance>, <needed>)
  await expect(token.transfer(other.address, tooMuch))
    .to.be.revertedWithCustomError(token, "ERC20InsufficientBalance");
  ```
- **Variants to handle**: same chai variants as R01. The `withArgs` clause is *not* added by the codemod for ERC20 errors — the values would have to be reconstructed from the test's local state, which is too brittle. We rewrite the matcher only and leave a TODO.
- **Expected to fire on origin-dollar**: yes — origin-dollar's vault tests assert on ERC20 balance / transfer reverts.
- **Risk / known false positives**: A test that *intentionally* asserts the legacy v4 string (e.g. integration test against an unmigrated v4 contract) would be falsely rewritten. Mitigation: the README will tell users to scope the codemod to test files for contracts they have already upgraded to v5.
- **Special case — `decreasedAllowance`**: only emit a warn-with-todo: `// TODO(oz-v5): decreaseAllowance was removed in v5; rewrite the test to use approve() with the new value.` Cite REL bullet on `increaseAllowance`/`decreaseAllowance` removal.

---

## Rule R05: pausable-revert-strings-chai

- **Category**: revert-string
- **Kind**: deterministic-rewrite (with fallback per R01)
- **Trigger pattern (informal)**: `revertedWith("Pausable: paused")` and `revertedWith("Pausable: not paused")`.
- **OZ source citation**:
  - v4 strings: SRC@v4.4.2/contracts/security/Pausable.sol
  - v5 errors: SRC@v5.0.0/contracts/utils/Pausable.sol — `error EnforcedPause();`, `error ExpectedPause();` (note also the file moved from `security/` to `utils/`; CHG: "ReentrancyGuard, Pausable: Moved to `utils` directory.")
- **Before**:
  ```ts
  await expect(token.connect(user).transfer(other.address, 1))
    .to.be.revertedWith("Pausable: paused");
  ```
- **After**:
  ```ts
  await expect(token.connect(user).transfer(other.address, 1))
    .to.be.revertedWithCustomError(token, "EnforcedPause");
  ```
  Mapping: `"Pausable: paused"` → `EnforcedPause`, `"Pausable: not paused"` → `ExpectedPause`.
- **Variants to handle**: same chai variants as R01.
- **Expected to fire on origin-dollar**: medium — Pausable patterns appear in origin-dollar's vault and strategy tests.
- **Risk / known false positives**: as R01.

---

## Rule R06: revert-strings-test-helpers

- **Category**: revert-string
- **Kind**: deterministic-rewrite (with fallback)
- **Trigger pattern (informal)**: `await expectRevert(<promise>, "<v4 string>")` or `expectRevert.unspecified(<promise>)` with a comment-form of the string. Specifically targets the `@openzeppelin/test-helpers` module.
- **OZ source citation**: `@openzeppelin/test-helpers` README at https://github.com/OpenZeppelin/openzeppelin-test-helpers documents `expectRevert(promise, message)`. The v5-aware replacement is the chai matcher `revertedWithCustomError`, which is provided by `@nomicfoundation/hardhat-chai-matchers` (or `@nomiclabs/hardhat-waffle` if Waffle); both ship custom-error support. test-helpers itself does not yet have a v5-blessed `expectRevertCustomError`.
- **Before**:
  ```ts
  const { expectRevert } = require("@openzeppelin/test-helpers");
  await expectRevert(
    token.connect(attacker).transferOwnership(other.address),
    "Ownable: caller is not the owner"
  );
  ```
- **After** (best-effort rewrite — converts to chai form which is the canonical v5 idiom):
  ```ts
  // TODO(oz-v5): @openzeppelin/test-helpers does not natively support v5 custom errors.
  // The codemod has rewritten this to chai's revertedWithCustomError; ensure your project
  // uses @nomicfoundation/hardhat-chai-matchers (or hardhat-waffle).
  await expect(
    token.connect(attacker).transferOwnership(other.address)
  ).to.be.revertedWithCustomError(token, "OwnableUnauthorizedAccount");
  ```
- **Variants to handle**: any v4 revert string from R01–R05's tables, used as the second arg to `expectRevert`.
- **Expected to fire on origin-dollar**: confirmed *no* — origin-dollar uses Waffle's chai matchers (`revertedWith`), not `@openzeppelin/test-helpers`. The fire-rate table records 0. We still ship this rule because OZ-v4-using repos commonly use `expectRevert`, and `jssg` fire-rate against origin-dollar is not the only success metric for the codemod.
- **Risk / known false positives**: a user-defined `expectRevert` helper of the same name (not from `@openzeppelin/test-helpers`) would be wrongly rewritten. Mitigation: check that the file imports `expectRevert` from `@openzeppelin/test-helpers` (require/import scan) before rewriting.

---

## Rule R07: ownable-deploy-missing-initial-owner

- **Category**: constructor-arg
- **Kind**: warn-with-todo (the codemod cannot synthesize an owner address)
- **Trigger pattern (informal)**: a `deploy()` call with zero arguments on a Contract / ContractFactory whose name contains `"Ownable"` or whose source extends `Ownable`. Two concrete syntactic forms:
  1. `await SomethingFactory.deploy();`
  2. Hardhat-deploy form: `await deployments.deploy("Something", { from: deployer, args: [] });`
- **OZ source citation**:
  - v4 (no arg): SRC@v4.4.2/contracts/access/Ownable.sol — `constructor()`
  - v5 (arg required): SRC@v5.0.0/contracts/access/Ownable.sol — `constructor(address initialOwner)`
  - REL: "Ownable: Added an `initialOwner` parameter to the constructor, making the ownership initialization explicit."
- **Before**:
  ```ts
  const token = await TokenFactory.deploy();
  ```
- **After**:
  ```ts
  // TODO(oz-v5): Ownable v5 requires constructor(address initialOwner). Add the initial owner address.
  const token = await TokenFactory.deploy(/* initialOwner: */);
  ```
- **Variants to handle**: as listed; also `factory.deploy(...someArgs)` where the v5 contract still expects an *additional* trailing `initialOwner` — codemod cannot tell without contract-source knowledge, so we fire only on zero-arg deploys to keep precision high.
- **Expected to fire on origin-dollar**: low. origin-dollar uses initializer-pattern proxies more than direct `Ownable` constructors. The rule is shipped for general-purpose v4→v5 use.
- **Risk / known false positives**: high — any zero-arg `deploy()` call on any factory will match. Mitigation: scope to factories whose name suggests Ownable (regex `/(Ownable|Token|Vault|Governor)/`) is too aggressive; instead, the rule fires unconditionally on zero-arg deploys but emits a TODO comment, never a destructive rewrite. Users can grep for `TODO(oz-v5):` and triage.

---

## Rule R08: role-hash-literal-warn

- **Category**: role-hash
- **Kind**: warn-with-todo (per PM directive: ast-grep cannot safely correlate a precomputed hex literal back to its preimage)
- **Trigger pattern (informal)**: any of:
  1. `keccak256("MINTER_ROLE")`, `keccak256(toUtf8Bytes("MINTER_ROLE"))`, `ethers.utils.id("MINTER_ROLE")`, `ethers.utils.solidityKeccak256(["string"], ["MINTER_ROLE"])`
  2. A `const NAME_ROLE = "0x..."` 32-byte hex literal whose variable name ends in `_ROLE` or whose value matches `/^0x[0-9a-f]{64}$/i`.
  3. `await contract.<name_with_ROLE>()` followed by no further use — informational only.
- **OZ source citation**:
  - REL: "AccessControl: Use custom errors instead of revert strings." (role hashing semantics did not change between v4 and v5; the role *bytes* are still `keccak256(name)`. The reason for warning is solely that the v5 *error* `AccessControlUnauthorizedAccount(address, bytes32)` requires the role bytes, and the codemod cannot reverse a precomputed hex literal back to its preimage to verify it.)
  - PM directive: warn-only per project guidelines (no automated rewrite of role hashes).
- **Before**:
  ```ts
  const MINTER_ROLE =
    "0x9f2df0fed2c77648de5860a4cc508cd0818c85b8b8a1ab4ceeef8d981c8956a6";
  ```
- **After**:
  ```ts
  // TODO(oz-v5): verify role hash. Precomputed hex; ensure preimage matches the role
  // string used in the v5 contract (keccak256("MINTER_ROLE")). Consider replacing with
  // ethers.utils.id("MINTER_ROLE") for self-documentation.
  const MINTER_ROLE =
    "0x9f2df0fed2c77648de5860a4cc508cd0818c85b8b8a1ab4ceeef8d981c8956a6";
  ```
- **Variants to handle**: each form above gets the same TODO comment, parameterized by the form.
- **Expected to fire on origin-dollar**: medium — origin-dollar uses AccessControl roles in vault and governance tests.
- **Risk / known false positives**: low — comments only.

---

## Rule R09: hook-rename-references

- **Category**: hook-rename
- **Kind**: warn-with-todo
- **Trigger pattern (informal)**: a string literal or comment containing `"_beforeTokenTransfer"`, `"_afterTokenTransfer"`, `_beforeTokenTransfer` or `_afterTokenTransfer` as an identifier, including:
  1. Mock fixtures referencing the hook name (e.g. `await mock.callStatic._beforeTokenTransfer(...)`).
  2. ABI-import code: `getContractAt("OldThing", addr).then(c => c._beforeTokenTransfer(...))`.
  3. Comments / test descriptions / `it("calls _beforeTokenTransfer", ...)`.
- **OZ source citation**: REL — "Deleted `_beforeTokenTransfer` and `_afterTokenTransfer` hooks, added a new internal `_update` function for customizations."
- **Before**:
  ```ts
  it("calls _beforeTokenTransfer", async () => {
    /* ... */
  });
  ```
- **After**:
  ```ts
  // TODO(oz-v5): _beforeTokenTransfer / _afterTokenTransfer hooks are removed in v5.
  // Use _update instead. ERC721 _update has no `from` arg.
  it("calls _beforeTokenTransfer", async () => {
    /* ... */
  });
  ```
- **Variants to handle**: identifier and string-literal occurrences; not regex-matched inside multi-line comments to avoid double-tagging.
- **Expected to fire on origin-dollar**: likely no (origin-dollar doesn't customize ERC20 hooks at the JS level), but cheap to ship.
- **Risk / known false positives**: low — comments only.

---

## Rule R10: removed-symbols-warn

- **Category**: renamed-symbol
- **Kind**: warn-with-todo
- **Trigger pattern (informal)**: any of these symbols appearing as call expressions or identifiers in JS/TS:
  - `Address.isContract` (REL: "Removed `Address.isContract`.")
  - `_setupRole` (REL: "Removed `_setupRole`.")
  - `_exists` on an ERC721 contract (REL: "ERC721: Removed `_exists` and `_isApprovedOrOwner`.")
  - `_isApprovedOrOwner` (same)
  - `safePermit` from SafeERC20 (REL: "SafeERC20: Removed `safePermit`.")
  - `_requireMinted` → renamed to `_requireOwned` in v5 (REL).
  - `increaseAllowance` / `decreaseAllowance` (REL: "Removed the non-standard `increaseAllowance` and `decreaseAllowance` functions").
  - `safeMath.add`/`sub`/`mul`/`div` (CHG: SafeMath removed).
  - On TransparentUpgradeableProxy / ProxyAdmin: `getProxyAdmin`, `getProxyImplementation`, `upgrade`, `upgradeTo` (REL).
- **OZ source citation**: REL bullets quoted above; CHG.
- **Before**:
  ```ts
  if (await someUtil.isContract(addr)) { /* ... */ }
  await accessControl._setupRole(MINTER_ROLE, minter);
  ```
- **After**:
  ```ts
  // TODO(oz-v5): Address.isContract removed in v5 (ambiguous semantics).
  // Replace with explicit code-size check or remove the guard.
  if (await someUtil.isContract(addr)) { /* ... */ }
  // TODO(oz-v5): _setupRole was removed; use _grantRole on the v5 contract instead.
  await accessControl._setupRole(MINTER_ROLE, minter);
  ```
- **Variants to handle**: each removed symbol gets a tailored TODO message (the codemod has a small lookup table).
- **Expected to fire on origin-dollar**: likely yes for `_setupRole` and possibly `safeMath`; verified in fire-rate table.
- **Risk / known false positives**: low — comments only. The one nuance: `isContract` is a generic enough name that a project may have its own `isContract` utility unrelated to OZ. We require the matched call to be a *member-access* call (`X.isContract(...)`) and to NOT be defined as a local function in the same file. If we cannot statically rule out a local definition, we still warn — TODOs are cheap.

---

## Rule R11: import-path-shifts

- **Category**: import-path
- **Kind**: deterministic-rewrite
- **Trigger pattern (informal)**: any string-literal occurrence (in `import` / `require` / `getContractFactory("...")` / Hardhat artifact paths) of the renamed v4 paths:
  1. `@openzeppelin/contracts/token/ERC20/extensions/draft-ERC20Permit.sol` → `@openzeppelin/contracts/token/ERC20/extensions/ERC20Permit.sol`
  2. `@openzeppelin/contracts/token/ERC20/extensions/draft-IERC20Permit.sol` → `@openzeppelin/contracts/token/ERC20/extensions/IERC20Permit.sol`
  3. `@openzeppelin/contracts/utils/cryptography/draft-EIP712.sol` → `@openzeppelin/contracts/utils/cryptography/EIP712.sol`
  4. `@openzeppelin/contracts/security/Pausable.sol` → `@openzeppelin/contracts/utils/Pausable.sol`
  5. `@openzeppelin/contracts/security/ReentrancyGuard.sol` → `@openzeppelin/contracts/utils/ReentrancyGuard.sol`
  6. `@openzeppelin/contracts/utils/Checkpoints.sol` → `@openzeppelin/contracts/utils/structs/Checkpoints.sol`
  7. `@openzeppelin/contracts/utils/math/SafeMath.sol` → warn-with-todo (file removed; consumer must rewrite math).
  8. `@openzeppelin/contracts-upgradeable/utils/AddressUpgradeable.sol` → `@openzeppelin/contracts/utils/Address.sol` (REL: "library no longer includes upgradeable variants for libraries and interfaces").
  9. `@openzeppelin/contracts-upgradeable/interfaces/IERC20Upgradeable.sol` → `@openzeppelin/contracts/interfaces/IERC20.sol`
- **OZ source citation**:
  - REL & CHG: "Added the file `ERC20Permit.sol` and deprecated `draft-IERC20Permit.sol` and `draft-ERC20Permit.sol`"; "ReentrancyGuard, Pausable: Moved to `utils` directory."; "Checkpoints: Library moved from `utils` to `utils/structs`"; "library no longer includes upgradeable variants for libraries and interfaces".
- **Before**:
  ```ts
  const ERC20Permit = await ethers.getContractFactory(
    "@openzeppelin/contracts/token/ERC20/extensions/draft-ERC20Permit.sol:ERC20Permit"
  );
  ```
- **After**:
  ```ts
  const ERC20Permit = await ethers.getContractFactory(
    "@openzeppelin/contracts/token/ERC20/extensions/ERC20Permit.sol:ERC20Permit"
  );
  ```
- **Variants to handle**: any string-literal occurrence — `import` source, `require` arg, `getContractFactory` arg, `getContractAt` arg, artifact JSON paths in `getContract` calls. We do *not* rewrite paths inside `// ...` comments.
- **Expected to fire on origin-dollar**: low (origin-dollar uses solc remappings via Hardhat config; JS files reference contract names not paths). Still ship — small codemod, broad utility.
- **Risk / known false positives**: a user might intentionally pin to v4 paths for an integration test against a legacy contract. Mitigation: the README will explain this and recommend using `--include` / `--exclude` to scope.

---

## Out-of-scope notes

- **Solidity rewrites** (`.sol` files): a separate codemod (Foundry/solc-grep) territory.
- **`_setupRole` → `_grantRole`** as a *Solidity* edit: out of scope. We only flag JS surface mentions.
- **Storage layout / namespaced storage (EIP-7201)** changes from v5: invisible to JS code unless the test reads storage slots directly via `eth_getStorageAt`. Too narrow to ship a rule for at Phase 0; revisit if Phase 2 finds repos that hit it.
- **Governor / TimelockController role architecture** change (`TIMELOCK_ADMIN_ROLE` → `DEFAULT_ADMIN_ROLE`): JS could reference `TIMELOCK_ADMIN_ROLE` as a constant. Could be added as a Phase 2 rule. Not included now to keep the spec tight.
- **`Approval` event no longer emitted in `transferFrom`**: tests asserting on this event would break. Detecting `expect(...).to.emit(token, "Approval")` *inside* a `transferFrom` test is a multi-statement pattern that ast-grep handles awkwardly. Out of scope; document in README.
- **Behavioral changes** (`_approve` no longer allows owner self-approve, `_setApprovalForAll` no longer allows zero operator): contract-internal; not visible to JS unless tests explicitly assert no-op behavior. Out of scope.

---

## Rule-by-rule fire-rate estimate against origin-dollar

All commands run with cwd `~/oz-v5/_reference/origin-dollar/contracts/`, scoped to JS/TS files in `test/ scripts/ deploy/` (out-of-scope file types stripped). The reference repo is at the pinned SHA `dbae51ad8d9f6f2ec24073414e2a6d46716d1ddd`.

| Rule | rg command (JS/TS scoped) | Hits | Confidence |
|------|--------------------------|------|------------|
| R01  | `rg -n -g '*.js' -g '*.ts' 'revertedWith\("Ownable: caller' test/ scripts/ deploy/` | 4 | high |
| R02  | `rg -n -g '*.js' -g '*.ts' 'revertedWith\("Ownable: new owner' test/ scripts/ deploy/` | 0 | high |
| R03  | `rg -n -g '*.js' -g '*.ts' 'AccessControl: account' test/ scripts/ deploy/` | 8 | high |
| R04  | `rg -n -g '*.js' -g '*.ts' 'revertedWith\("ERC20: ' test/ scripts/ deploy/` | 0 | high |
| R05  | `rg -n -g '*.js' -g '*.ts' 'revertedWith\("Pausable: ' test/ scripts/ deploy/` | 3 | high |
| R06  | `rg -n -g '*.js' -g '*.ts' 'expectRevert\(' test/ scripts/ deploy/` | 0 | high |
| R07  | `rg -n -g '*.js' -g '*.ts' '\.deploy\(\)' test/ scripts/ deploy/` | 10 | medium (over-broad — fires on any zero-arg deploy regardless of whether the underlying contract is Ownable in v5) |
| R08  | `rg -nU --multiline -g '*.js' -g '*.ts' '_ROLE\s*=\s*\n?\s*"0x[0-9a-fA-F]{64}"' test/ scripts/ deploy/` (counts both lines per match → 8 declarations × 2 lines = 16 raw hits) | 8 declarations | high |
| R09  | `rg -n -g '*.js' -g '*.ts' '_beforeTokenTransfer\|_afterTokenTransfer' test/ scripts/ deploy/` | 0 | high |
| R10  | `rg -n -g '*.js' -g '*.ts' '_setupRole\|\.isContract\(\|_exists\(\|safePermit\(\|_requireMinted\(\|increaseAllowance\(\|decreaseAllowance\(' test/ scripts/ deploy/` | 0 | high |
| R11  | `rg -n -g '*.js' -g '*.ts' 'draft-ERC20Permit\|draft-IERC20Permit\|draft-EIP712\|security/Pausable\|security/ReentrancyGuard\|utils/Checkpoints\.sol\|AddressUpgradeable\|IERC20Upgradeable' test/ scripts/ deploy/` | 0 | high |

**Total origin-dollar JS/TS hits across all rules: ~33** (4 + 8 + 3 + 10 + 8 = 33; note R07 over-counts because it fires on any zero-arg `.deploy()`, not only Ownable factories — a deliberate trade-off for higher recall in warn-only mode).

Confidence is "high" where the regex matches the canonical pattern with low false-positive risk; "medium" where the regex is intentionally broad and downstream review is expected. The `0` rows (R02, R04, R06, R09, R10, R11) reflect that origin-dollar's JS surface either doesn't exercise those v4 strings (R02, R04), uses Waffle chai matchers rather than test-helpers (R06), or doesn't reference the removed/renamed symbols at the JS level (R09, R10, R11). Those rules are still shipped because the codemod's value extends beyond a single reference repo.

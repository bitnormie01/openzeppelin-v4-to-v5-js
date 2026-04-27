import type { Codemod } from "codemod:ast-grep";
import type JS from "codemod:ast-grep/langs/javascript";
import type TS from "codemod:ast-grep/langs/typescript";
import type TSX from "codemod:ast-grep/langs/tsx";

type JSOrTS = JS | TS | TSX;

const revertStringMap: Record<string, string> = {
  "Ownable: caller is not the owner": "OwnableUnauthorizedAccount",
  "Ownable: new owner is the zero address": "OwnableInvalidOwner",
  "ERC20: transfer amount exceeds balance": "ERC20InsufficientBalance",
  "ERC20: insufficient allowance": "ERC20InsufficientAllowance",
  "ERC20: transfer amount exceeds allowance": "ERC20InsufficientAllowance",
  "ERC20: transfer from the zero address": "ERC20InvalidSender",
  "ERC20: transfer to the zero address": "ERC20InvalidReceiver",
  "ERC20: approve from the zero address": "ERC20InvalidApprover",
  "ERC20: approve to the zero address": "ERC20InvalidSpender",
  "ERC20: mint to the zero address": "ERC20InvalidReceiver",
  "ERC20: burn from the zero address": "ERC20InvalidSender",
  "ERC20: burn amount exceeds balance": "ERC20InsufficientBalance",
  "Pausable: paused": "EnforcedPause",
  "Pausable: not paused": "ExpectedPause",
};

const getHandle = (promiseText: string): string => {
  const match = promiseText.match(/^[(\s]*([a-zA-Z_$][a-zA-Z0-9_$]*)/);
  return match ? match[1] : "contract";
};

const codemod: Codemod<JSOrTS> = async (root) => {
  let rootNode = root.root();
  let edits = [];

  // R01, R02, R04, R05, R03a
  const revertNodes = rootNode.findAll({
    rule: {
      any: [
        { pattern: "expect($PROMISE).to.be.revertedWith($STR)" },
        { pattern: "expect($PROMISE).to.eventually.be.revertedWith($STR)" }
      ]
    }
  });

  for (const node of revertNodes) {
    const strNode = node.getMatch("STR");
    if (!strNode) continue;
    
    // R03a: AccessControl Canonical
    const textStrNode = strNode.text();
    const acMatch = textStrNode.match(/^`AccessControl: account \$\{(.*?)\} is missing role \$\{(.*?)\}`$/);
    if (acMatch) {
      const promiseText = node.getMatch("PROMISE")?.text() || "";
      const handle = getHandle(promiseText);
      const text = node.text();
      const newText = text.replace(
        /revertedWith\s*\(\s*`.*?`\s*\)/,
        `revertedWithCustomError(${handle}, "AccessControlUnauthorizedAccount").withArgs(${acMatch[1]}, ${acMatch[2]})`
      );
      edits.push(node.replace(newText));
      continue;
    }

    // Default revert string matching
    const strMatch = textStrNode.match(/^["'`](.*)["'`]$/);
    if (!strMatch) continue;
    const errorStr = strMatch[1];
    
    if (revertStringMap[errorStr]) {
      const customError = revertStringMap[errorStr];
      const promiseText = node.getMatch("PROMISE")?.text() || "";
      const handle = getHandle(promiseText);
      const text = node.text();
      const newText = text.replace(
        /revertedWith\s*\(\s*["'`].*?["'`]\s*\)/,
        `revertedWithCustomError(${handle}, "${customError}")`
      );
      edits.push(node.replace(newText));
    }
  }
  
  let source = rootNode.commitEdits(edits);

  // R03b: AccessControl Non-Canonical
  source = source.replace(
    /^([ \t]*)(.*?revertedWith\s*\(\s*["'`].*?AccessControl: account.*?["'`]\s*\).*)$/gm,
    (match, indent, stmt) => {
      if (match.includes("TODO(oz-v5)")) return match;
      return `${indent}// TODO(oz-v5): replace with revertedWithCustomError(<contract>, "AccessControlUnauthorizedAccount").withArgs(<account>, <role>);\n${indent}${stmt}`;
    }
  );

  // R06: test-helpers
  source = source.replace(
    /await\s+expectRevert\s*\(\s*(.*?)\s*,\s*["'`](.*?)["'`]\s*\)/g,
    (match, promiseText, errorStr) => {
      if (revertStringMap[errorStr]) {
        const customError = revertStringMap[errorStr];
        const handle = getHandle(promiseText);
        return `// TODO(oz-v5): @openzeppelin/test-helpers does not natively support v5 custom errors.\n// The codemod has rewritten this to chai's revertedWithCustomError; ensure your project\n// uses @nomicfoundation/hardhat-chai-matchers (or hardhat-waffle).\nawait expect(${promiseText}).to.be.revertedWithCustomError(${handle}, "${customError}")`;
      }
      return match;
    }
  );

  // R07: zero-arg deploy
  source = source.replace(
    /^([ \t]*)(.*?\.deploy\(\)\s*;)/gm,
    (match, indent, stmt) => {
      return `${indent}// TODO(oz-v5): Ownable v5 requires constructor(address initialOwner). Add the initial owner address.\n${indent}${stmt}`;
    }
  );

  // R08: role hash warn
  source = source.replace(
    /^([ \t]*)(keccak256\s*\(\s*["'`].*?_ROLE["'`]\s*\)\s*;)/gm,
    (match, indent, stmt) => `${indent}// TODO(oz-v5): verify role hash. Precomputed hex; ensure preimage matches the role\n${indent}// string used in the v5 contract (keccak256("MINTER_ROLE")). Consider replacing with\n${indent}// ethers.utils.id("MINTER_ROLE") for self-documentation.\n${indent}${stmt}`
  );
  source = source.replace(
    /^([ \t]*)(ethers\.utils\.id\s*\(\s*["'`].*?_ROLE["'`]\s*\)\s*;)/gm,
    (match, indent, stmt) => `${indent}// TODO(oz-v5): verify role hash. Precomputed hex; ensure preimage matches the role\n${indent}// string used in the v5 contract (keccak256("MINTER_ROLE")). Consider replacing with\n${indent}// ethers.utils.id("MINTER_ROLE") for self-documentation.\n${indent}${stmt}`
  );
  source = source.replace(
    /^([ \t]*)(const\s+[A-Z0-9_]+_ROLE\s*=\s*["'`]0x[0-9a-fA-F]{64}["'`]\s*;)/gm,
    (match, indent, stmt) => `${indent}// TODO(oz-v5): verify role hash. Precomputed hex; ensure preimage matches the role\n${indent}// string used in the v5 contract (keccak256("MINTER_ROLE")). Consider replacing with\n${indent}// ethers.utils.id("MINTER_ROLE") for self-documentation.\n${indent}${stmt}`
  );

  // R09: hook rename
  source = source.replace(
    /^([ \t]*)(.*(?:_beforeTokenTransfer|_afterTokenTransfer).*)$/gm,
    (match, indent, stmt) => {
      if (match.includes("TODO(oz-v5)")) return match;
      return `${indent}// TODO(oz-v5): _beforeTokenTransfer / _afterTokenTransfer hooks are removed in v5.\n// Use _update instead. ERC721 _update has no \`from\` arg.\n${indent}${stmt}`;
    }
  );

  // R10: removed symbols
  source = source.replace(
    /^([ \t]*)(.*Address\.isContract.*)$/gm,
    (match, indent, stmt) => {
      if (match.includes("TODO(oz-v5)")) return match;
      return `${indent}// TODO(oz-v5): Address.isContract removed in v5 (ambiguous semantics).\n${indent}// Replace with explicit code-size check or remove the guard.\n${indent}${stmt}`;
    }
  );
  source = source.replace(
    /^([ \t]*)(.*_setupRole.*)$/gm,
    (match, indent, stmt) => {
      if (match.includes("TODO(oz-v5)")) return match;
      return `${indent}// TODO(oz-v5): _setupRole was removed; use _grantRole on the v5 contract instead.\n${indent}${stmt}`;
    }
  );
  source = source.replace(
    /^([ \t]*)(.*safePermit.*)$/gm,
    (match, indent, stmt) => {
      if (match.includes("TODO(oz-v5)")) return match;
      return `${indent}// TODO(oz-v5): safePermit was removed in v5.\n${indent}${stmt}`;
    }
  );
  source = source.replace(
    /^([ \t]*)(.*increaseAllowance.*)$/gm,
    (match, indent, stmt) => {
      if (match.includes("TODO(oz-v5)")) return match;
      return `${indent}// TODO(oz-v5): increaseAllowance was removed in v5; rewrite the test to use approve() with the new value.\n${indent}${stmt}`;
    }
  );
  source = source.replace(
    /^([ \t]*)(.*decreaseAllowance.*)$/gm,
    (match, indent, stmt) => {
      if (match.includes("TODO(oz-v5)")) return match;
      return `${indent}// TODO(oz-v5): decreaseAllowance was removed in v5; rewrite the test to use approve() with the new value.\n${indent}${stmt}`;
    }
  );

  // R11: import-path-shifts
  source = source.replace(
    /["']@openzeppelin\/contracts\/token\/ERC20\/extensions\/draft-ERC20Permit\.sol(:ERC20Permit)?["']/g,
    '"@openzeppelin/contracts/token/ERC20/extensions/ERC20Permit.sol$1"'
  );
  source = source.replace(
    /["']@openzeppelin\/contracts\/token\/ERC20\/extensions\/draft-IERC20Permit\.sol(:IERC20Permit)?["']/g,
    '"@openzeppelin/contracts/token/ERC20/extensions/IERC20Permit.sol$1"'
  );
  source = source.replace(
    /["']@openzeppelin\/contracts\/utils\/cryptography\/draft-EIP712\.sol(:EIP712)?["']/g,
    '"@openzeppelin/contracts/utils/cryptography/EIP712.sol$1"'
  );
  source = source.replace(
    /["']@openzeppelin\/contracts\/security\/Pausable\.sol(:Pausable)?["']/g,
    '"@openzeppelin/contracts/utils/Pausable.sol$1"'
  );
  source = source.replace(
    /["']@openzeppelin\/contracts\/security\/ReentrancyGuard\.sol(:ReentrancyGuard)?["']/g,
    '"@openzeppelin/contracts/utils/ReentrancyGuard.sol$1"'
  );
  source = source.replace(
    /["']@openzeppelin\/contracts\/utils\/Checkpoints\.sol(:Checkpoints)?["']/g,
    '"@openzeppelin/contracts/utils/structs/Checkpoints.sol$1"'
  );
  source = source.replace(
    /["']@openzeppelin\/contracts-upgradeable\/utils\/AddressUpgradeable\.sol(:AddressUpgradeable)?["']/g,
    '"@openzeppelin/contracts/utils/Address.sol$1"'
  );
  source = source.replace(
    /["']@openzeppelin\/contracts-upgradeable\/interfaces\/IERC20Upgradeable\.sol(:IERC20Upgradeable)?["']/g,
    '"@openzeppelin/contracts/interfaces/IERC20.sol$1"'
  );

  return source;
};

export default codemod;

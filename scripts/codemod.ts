import type { Codemod } from "codemod:ast-grep";
import type JS from "codemod:ast-grep/langs/javascript";
import type TS from "codemod:ast-grep/langs/typescript";
import type TSX from "codemod:ast-grep/langs/tsx";

type JSOrTS = JS | TS | TSX;

const codemod: Codemod<JSOrTS> = async (root) => {
  let source = root.root().text();

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

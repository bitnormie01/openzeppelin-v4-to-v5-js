// TODO(oz-v5): Address.isContract removed in v5 (ambiguous semantics).
// Replace with explicit code-size check or remove the guard.
if (await Address.isContract(addr)) {}
// TODO(oz-v5): _setupRole was removed; use _grantRole on the v5 contract instead.
await accessControl._setupRole(MINTER_ROLE, minter);
// TODO(oz-v5): safePermit was removed in v5.
await token.safePermit(1);
// TODO(oz-v5): increaseAllowance was removed in v5; rewrite the test to use approve() with the new value.
await token.increaseAllowance(other, 1);
// TODO(oz-v5): decreaseAllowance was removed in v5; rewrite the test to use approve() with the new value.
await token.decreaseAllowance(other, 1);

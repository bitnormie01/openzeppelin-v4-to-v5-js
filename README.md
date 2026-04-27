# openzeppelin-v4-to-v5-js

A `jssg` (codemod.com JavaScript-AST-grep) codemod that migrates the JavaScript / TypeScript surface of a Hardhat project — tests, deploy scripts, fixtures — from OpenZeppelin Contracts v4.x to v5.0. It rewrites v4 revert-string assertions to the v5 custom-error form, flags constructor-signature changes that need human input (e.g. `Ownable` `initialOwner`), tags role-hash literals for verification, and updates a small set of renamed/removed symbols and import paths. Solidity sources, Foundry tests, and contract logic are out of scope.

## Installation

```bash
# Install from registry
codemod run openzeppelin-v4-to-v5-js

# Or run locally
codemod run -w workflow.yaml
```

## Development

```bash
# Test the transformation
npm test

# Validate the workflow
codemod validate -w workflow.yaml

# Publish to registry
codemod login
codemod publish
```

## License

MIT

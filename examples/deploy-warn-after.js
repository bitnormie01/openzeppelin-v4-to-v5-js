const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);

  const TokenFactory = await ethers.getContractFactory("MyToken");
  
  // Deploy the token
  // TODO(oz-v5): Ownable v5 requires constructor(address initialOwner). Add the initial owner address.
  const token = await TokenFactory.deploy();
  await token.deployed();

  console.log("Token deployed to:", token.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

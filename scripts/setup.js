const hre = require("hardhat");

async function main() {

  console.log("🚀 Starting Cross-Chain Setup...\n");

  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying with:", deployer.address);

  // Deploy TokenA
  const TokenA = await hre.ethers.getContractFactory("TokenA");
  const token = await TokenA.deploy();
  await token.waitForDeployment();

  const tokenAddress = await token.getAddress();
  console.log("✅ TokenA deployed:", tokenAddress);

  // Deploy Lock
  const Lock = await hre.ethers.getContractFactory("Lock");
  const lock = await Lock.deploy(tokenAddress);
  await lock.waitForDeployment();

  const lockAddress = await lock.getAddress();
  console.log("✅ Lock deployed:", lockAddress);

  console.log("\nSetup Complete 🎉");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
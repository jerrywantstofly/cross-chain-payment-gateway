const hre = require("hardhat");

async function main() {

  // 🔹 TokenA address you deployed earlier
  const tokenAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

  const Lock = await hre.ethers.getContractFactory("Lock");
  const lock = await Lock.deploy(tokenAddress);

  await lock.waitForDeployment();

  console.log("Lock contract deployed to:", await lock.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
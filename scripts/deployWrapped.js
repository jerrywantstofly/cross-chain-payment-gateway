const hre = require("hardhat");

async function main() {

  const WrappedToken = await hre.ethers.getContractFactory("WrappedToken");
  const wrapped = await WrappedToken.deploy();

  await wrapped.waitForDeployment();

  console.log("WrappedToken deployed to:", await wrapped.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
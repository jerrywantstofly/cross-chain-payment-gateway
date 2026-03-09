const hre = require("hardhat");
const fs = require("fs");

async function main() {

  console.log("🚀 Starting Cross-Chain Setup...\n");

  const [deployer] = await hre.ethers.getSigners();

  console.log("Deploying with:", deployer.address);

  /*
  --------------------------------
  Deploy TokenA
  --------------------------------
  */

  const TokenA = await hre.ethers.getContractFactory("TokenA");

  const token = await TokenA.deploy();

  await token.waitForDeployment();

  const tokenAddress = await token.getAddress();

  console.log("✅ TokenA deployed:", tokenAddress);


  /*
  --------------------------------
  Deploy Lock Contract
  --------------------------------
  */

  const Lock = await hre.ethers.getContractFactory("Lock");

  const lock = await Lock.deploy(tokenAddress);

  await lock.waitForDeployment();

  const lockAddress = await lock.getAddress();

  console.log("✅ Lock deployed:", lockAddress);


  /*
  --------------------------------
  Save addresses to deployments.json
  --------------------------------
  */

  const deployments = {
    tokenAddress: tokenAddress,
    lockAddress: lockAddress,
    wrappedAddress: tokenAddress
  };

  fs.writeFileSync(
    "deployments.json",
    JSON.stringify(deployments, null, 2)
  );

  console.log("📄 deployments.json updated");


  /*
  --------------------------------
  Copy deployments.json to frontend
  --------------------------------
  */

  fs.writeFileSync(
    "frontend/src/deployments.json",
    JSON.stringify(deployments, null, 2)
  );

  console.log("📄 frontend deployments.json updated");


  /*
  --------------------------------
  Update relayer.js automatically
  --------------------------------
  */

  let relayerCode = fs.readFileSync("relayer.js", "utf8");

  relayerCode = relayerCode.replace(
    /const lockAddress = ".*?"/,
    `const lockAddress = "${lockAddress}"`
  );

  relayerCode = relayerCode.replace(
    /const wrappedAddress = ".*?"/,
    `const wrappedAddress = "${tokenAddress}"`
  );

  fs.writeFileSync("relayer.js", relayerCode);

  console.log("🔧 relayer.js updated automatically");

  console.log("\nSetup Complete 🎉");

}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
const hre = require("hardhat");
const fs = require("fs");

async function main() {

  // Load contract addresses
  const deployments = JSON.parse(
    fs.readFileSync("deployments.json", "utf8")
  );

  const tokenAddress = deployments.tokenAddress;
  const lockAddress = deployments.lockAddress;

  // Receiver on Chain B
  const receiver =
  "0x70997970C51812dc3A010C7d01b50e0d17dc79C8";

  const amount = hre.ethers.parseEther("10");

  console.log("Using addresses:");
  console.log("TokenA:", tokenAddress);
  console.log("Lock:", lockAddress);
  console.log("Receiver:", receiver);
  console.log("Amount:", amount.toString());

  // Connect to contracts
  const token = await hre.ethers.getContractAt(
    "TokenA",
    tokenAddress
  );

  const lock = await hre.ethers.getContractAt(
    "Lock",
    lockAddress
  );

  console.log("\nApproving tokens...");

  const approveTx = await token.approve(lockAddress, amount);
  await approveTx.wait();

  console.log("Tokens approved");

  console.log("\nLocking tokens...");

  const lockTx = await lock.lock(amount, receiver);
  await lockTx.wait();

  console.log("Cross-chain transaction sent!");

}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
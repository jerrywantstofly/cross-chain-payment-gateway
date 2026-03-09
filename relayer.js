const { ethers } = require("ethers");

// ============================
// RPC CONNECTIONS
// ============================

const providerA = new ethers.JsonRpcProvider("http://127.0.0.1:8545");
const providerB = new ethers.JsonRpcProvider("http://127.0.0.1:8546");

// Hardhat account #0 private key
const PRIVATE_KEY =
  "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80";

const wallet = new ethers.Wallet(PRIVATE_KEY, providerB);

// ============================
// CONTRACT ADDRESSES
// ============================

const lockAddress = "0xB7f8BC63BbcaD18155201308C8f3540b07f84F5e";
const wrappedAddress = "0x610178dA211FEF7D417bC0e6FeD39F05609AD788";

// ============================
// CONTRACT ABIs
// ============================

const lockABI = [
  "event TokensLocked(address indexed sender, address indexed receiver, uint256 amount)"
];

const wrappedABI = [
  "function mint(address to, uint256 amount) external"
];

// ============================
// CONTRACT INSTANCES
// ============================

const lockContract = new ethers.Contract(lockAddress, lockABI, providerA);
const wrappedContract = new ethers.Contract(wrappedAddress, wrappedABI, wallet);

// ============================
// RELAYER START
// ============================

console.log("🚀 Relayer started...");
console.log("Listening for cross-chain lock events...\n");

// track last block
let lastCheckedBlock = 0;

// ============================
// EVENT POLLING
// ============================

async function pollEvents() {
  try {

    const currentBlock = await providerA.getBlockNumber();

    if (lastCheckedBlock === 0) {
      lastCheckedBlock = currentBlock;
      return;
    }

    const events = await lockContract.queryFilter(
      lockContract.filters.TokensLocked(),
      lastCheckedBlock + 1,
      currentBlock
    );

    for (const event of events) {

      const { sender, receiver, amount } = event.args;

      console.log("🔔 Cross-chain transfer detected");
      console.log("Sender:", sender);
      console.log("Receiver:", receiver);
      console.log("Amount:", ethers.formatEther(amount), "tokens");
      console.log("Tx Hash:", event.transactionHash);
      console.log("Block:", event.blockNumber);

      // Mint tokens on Chain B
      const tx = await wrappedContract.mint(receiver, amount);
      await tx.wait();

      console.log("✅ Minted on Chain B successfully\n");

    }

    lastCheckedBlock = currentBlock;

  } catch (error) {
    console.error("Relayer error:", error.message);
  }
}

// ============================
// POLL EVERY 2 SECONDS
// ============================

setInterval(pollEvents, 2000);
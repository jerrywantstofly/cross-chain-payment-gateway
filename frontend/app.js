import React, { useState } from "react";
import { ethers } from "ethers";
import deployments from "./deployments.json";

function App() {

  const [account, setAccount] = useState("");
  const [amount, setAmount] = useState("");
  const [receiver, setReceiver] = useState("");
  const [status, setStatus] = useState("");

  const [ethBalance, setEthBalance] = useState("");
  const [tokenBalance, setTokenBalance] = useState("");
  const [wrappedBalance, setWrappedBalance] = useState("");

  const tokenAddress = deployments.tokenAddress;
  const lockAddress = deployments.lockAddress;
  const wrappedAddress = deployments.wrappedAddress;

  const chainBProvider = new ethers.JsonRpcProvider("http://127.0.0.1:8546");

  const tokenABI = [
    "function approve(address spender, uint256 amount) public returns (bool)",
    "function balanceOf(address account) view returns (uint256)"
  ];

  const lockABI = [
    "function lock(uint256 amount, address receiver) public"
  ];

  const wrappedABI = [
    "function balanceOf(address account) view returns (uint256)"
  ];

  // -------------------------
  // Connect Wallet
  // -------------------------
  const connectWallet = async () => {

    if (!window.ethereum) {
      alert("Please install MetaMask");
      return;
    }

    try {

      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: "0x7A69" }]
      });

    } catch {

      await window.ethereum.request({
        method: "wallet_addEthereumChain",
        params: [{
          chainId: "0x7A69",
          chainName: "Hardhat Localhost",
          rpcUrls: ["http://127.0.0.1:8545"],
          nativeCurrency: {
            name: "ETH",
            symbol: "ETH",
            decimals: 18
          }
        }]
      });

    }

    const provider = new ethers.BrowserProvider(window.ethereum);

    const accounts = await provider.send("eth_requestAccounts", []);

    setAccount(accounts[0]);

    loadBalances(accounts[0]);
  };

  // -------------------------
  // Load Balances
  // -------------------------
  const loadBalances = async (wallet) => {

    try {

      const provider = new ethers.BrowserProvider(window.ethereum);

      const ethBal = await provider.getBalance(wallet);

      setEthBalance(parseFloat(ethers.formatEther(ethBal)).toFixed(4));

      const signer = await provider.getSigner();

      const token = new ethers.Contract(tokenAddress, tokenABI, signer);

      const tokenBal = await token.balanceOf(wallet);

      setTokenBalance(parseFloat(ethers.formatEther(tokenBal)).toFixed(4));

      const wrapped = new ethers.Contract(
        wrappedAddress,
        wrappedABI,
        chainBProvider
      );

      const wrappedBal = await wrapped.balanceOf(wallet);

      setWrappedBalance(parseFloat(ethers.formatEther(wrappedBal)).toFixed(4));

    } catch (err) {

      console.log("Balance error:", err);

    }

  };

  // -------------------------
  // Send Cross-chain payment
  // -------------------------
  const sendPayment = async () => {

    try {

      if (!amount || !receiver) {
        alert("Enter amount and receiver address");
        return;
      }

      const provider = new ethers.BrowserProvider(window.ethereum);

      const signer = await provider.getSigner();

      const token = new ethers.Contract(tokenAddress, tokenABI, signer);

      const lock = new ethers.Contract(lockAddress, lockABI, signer);

      const value = ethers.parseEther(amount);

      setStatus("Step 1: Approving tokens...");

      const approveTx = await token.approve(lockAddress, value);

      await approveTx.wait();

      setStatus("Step 2: Locking tokens on Chain A...");

      const lockTx = await lock.lock(value, receiver);

      await lockTx.wait();

      setStatus("Step 3: Waiting for relayer to mint on Chain B...");

      setTimeout(() => {

        loadBalances(account);

        setStatus("Cross-chain transfer complete 🚀");

      }, 3000);

    } catch (err) {

      console.error(err);

      setStatus("Transaction failed ❌");

    }

  };

  return (

    <div style={{ padding: "40px", fontFamily: "Arial" }}>

      <h1>Cross Chain Payment Gateway</h1>

      <br/>

      {!account && (
        <button onClick={connectWallet}>
          Connect Wallet
        </button>
      )}

      {account && (
        <div>

          <p><b>Connected Wallet:</b> {account}</p>

          <p><b>ETH Balance (Chain A):</b> {ethBalance}</p>

          <p><b>TokenA Balance (Chain A):</b> {tokenBalance}</p>

          <p><b>WrappedToken Balance (Chain B):</b> {wrappedBalance}</p>

        </div>
      )}

      <br/>

      <input
        type="text"
        placeholder="Amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />

      <br/><br/>

      <input
        type="text"
        placeholder="Receiver Address (Chain B)"
        value={receiver}
        onChange={(e) => setReceiver(e.target.value)}
      />

      <br/><br/>

      <button onClick={sendPayment}>
        Send Cross-Chain Payment
      </button>

      <br/><br/>

      <h3>Status</h3>

      <p>{status}</p>

    </div>

  );
}

export default App;
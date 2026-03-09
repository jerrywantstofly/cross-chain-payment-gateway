import React, { useState } from "react";
import { ethers } from "ethers";
import deployments from "./deployments.json";
import "./App.css";

function App() {

  const [account, setAccount] = useState("");
  const [amount, setAmount] = useState("");
  const [receiver, setReceiver] = useState("");

  const [ethBalance, setEthBalance] = useState("");
  const [tokenBalance, setTokenBalance] = useState("");
  const [wrappedBalance, setWrappedBalance] = useState("");

  const [step, setStep] = useState(0);
  const [animate, setAnimate] = useState(false);

  const [history, setHistory] = useState([]);

  const [fromChain, setFromChain] = useState("Chain A");
  const [toChain, setToChain] = useState("Chain B");

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

  // -----------------------
  // Connect Wallet
  // -----------------------
  const connectWallet = async () => {

    if (!window.ethereum) {
      alert("Install MetaMask");
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

    watchMint(accounts[0]);

  };

  // -----------------------
  // Load Balances
  // -----------------------
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

      console.log(err);

    }

  };

  // -----------------------
  // Watch mint on Chain B
  // -----------------------
  const watchMint = async (wallet) => {

    const wrapped = new ethers.Contract(
      wrappedAddress,
      wrappedABI,
      chainBProvider
    );

    let previousBalance = await wrapped.balanceOf(wallet);

    setInterval(async () => {

      const newBalance = await wrapped.balanceOf(wallet);

      if (newBalance > previousBalance) {

        setStep(4);

        setAnimate(false);

        loadBalances(wallet);

        previousBalance = newBalance;

      }

    }, 3000);

  };

  // -----------------------
  // Send cross chain payment
  // -----------------------
  const sendPayment = async () => {

    try {

      if (!amount || !receiver) {
        alert("Enter amount and receiver address");
        return;
      }

      setAnimate(true);

      const provider = new ethers.BrowserProvider(window.ethereum);

      const signer = await provider.getSigner();

      const token = new ethers.Contract(tokenAddress, tokenABI, signer);

      const lock = new ethers.Contract(lockAddress, lockABI, signer);

      const value = ethers.parseEther(amount);

      setStep(1);

      const approveTx = await token.approve(lockAddress, value);
      await approveTx.wait();

      setStep(2);

      const lockTx = await lock.lock(value, receiver);
      await lockTx.wait();

      setStep(3);

      setHistory(prev => [
        ...prev,
        {
          amount: amount,
          receiver: receiver,
          time: new Date().toLocaleTimeString()
        }
      ]);

    } catch (err) {

      console.error(err);

    }

  };

  return (

    <div className="container">

      <div className="bridge-card">

        <h1>Cross-Chain Token Bridge</h1>

        {!account && (
          <button onClick={connectWallet}>
            Connect Wallet
          </button>
        )}

        {account && (
          <>
            <p><b>Wallet:</b> {account}</p>

            <div className="balance-box">
              ETH Balance (Chain A): {ethBalance}
            </div>

            <div className="balance-box">
              TokenA Balance (Chain A): {tokenBalance}
            </div>

            <div className="balance-box">
              WrappedToken Balance (Chain B): {wrappedBalance}
            </div>
          </>
        )}

        <label>From</label>

        <select value={fromChain} onChange={(e)=>setFromChain(e.target.value)}>
          <option>Chain A</option>
        </select>

        <label>To</label>

        <select value={toChain} onChange={(e)=>setToChain(e.target.value)}>
          <option>Chain B</option>
        </select>

        <input
          type="text"
          placeholder="Amount"
          value={amount}
          onChange={(e)=>setAmount(e.target.value)}
        />

        <input
          type="text"
          placeholder="Receiver Address"
          value={receiver}
          onChange={(e)=>setReceiver(e.target.value)}
        />

        <button onClick={sendPayment}>
          Send Cross Chain Payment
        </button>

        {/* Bridge animation */}

        <div className="bridge-visual">

          <div className="chain-box">
            Chain A
          </div>

          <div className={`token ${animate ? "animate" : ""}`}></div>

          <div className="chain-box">
            Chain B
          </div>

        </div>

        <h3>Progress</h3>

        <div className="progress-step" style={{color: step>=1 ? "#22c55e":"gray"}}>
          1️⃣ Approve Tokens
        </div>

        <div className="progress-step" style={{color: step>=2 ? "#22c55e":"gray"}}>
          2️⃣ Lock Tokens
        </div>

        <div className="progress-step" style={{color: step>=3 ? "#facc15":"gray"}}>
          3️⃣ Relayer Processing
        </div>

        <h3>Transaction History</h3>

        {history.map((tx,i)=>(
          <div className="history-box" key={i}>
            Sent {tx.amount} → {tx.receiver}
            <br/>
            {tx.time}
          </div>
        ))}

      </div>

    </div>

  );

}

export default App;
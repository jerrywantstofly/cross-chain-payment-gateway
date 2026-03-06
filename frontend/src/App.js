import { useState } from "react";
import { ethers } from "ethers";

const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545");

const PRIVATE_KEY =
"0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80";

const signer = new ethers.Wallet(PRIVATE_KEY, provider);

const tokenAddress = "0xa513E6E4b8f2a923D98304ec87F64353C4D5C853";
const lockAddress = "0x2279B7A0a67DB372996a5FaB50D91eAA73d2eBe6";

const tokenABI = [
"function approve(address spender, uint256 amount) public returns(bool)"
];

const lockABI = [
"function lock(uint256 amount, address receiver)"
];

function App() {

const [receiver, setReceiver] = useState("");
const [amount, setAmount] = useState("");
const [status, setStatus] = useState("");

async function sendPayment() {

try {

setStatus("Approving tokens...");

const token = new ethers.Contract(tokenAddress, tokenABI, signer);
const lock = new ethers.Contract(lockAddress, lockABI, signer);

const value = ethers.parseEther(amount);

const approveTx = await token.approve(lockAddress, value);
await approveTx.wait();

setStatus("Locking tokens on Chain A...");

const tx = await lock.lock(value, receiver);
await tx.wait();

setStatus("Transaction complete. Relayer will mint tokens on Chain B.");

} catch(err) {

console.error(err);
setStatus("Transaction failed");

}

}

return (

<div style={{
fontFamily: "Arial",
padding: "40px",
maxWidth: "600px",
margin: "auto"
}}>

<h1>Cross-Chain Payment Gateway</h1>

<p>Send TokenA from Chain A → Chain B</p>

<input
placeholder="Receiver Address (Chain B)"
value={receiver}
onChange={(e)=>setReceiver(e.target.value)}
style={{
width:"100%",
padding:"10px",
marginTop:"10px"
}}
/>

<br/>

<input
placeholder="Amount"
value={amount}
onChange={(e)=>setAmount(e.target.value)}
style={{
width:"100%",
padding:"10px",
marginTop:"10px"
}}
/>

<br/><br/>

<button
onClick={sendPayment}
style={{
padding:"12px",
width:"100%",
background:"#4CAF50",
color:"white",
border:"none",
fontSize:"16px"
}}
>
Send Cross-Chain Payment
</button>

<p style={{marginTop:"20px"}}>
Status: {status}
</p>

</div>

);

}

export default App;
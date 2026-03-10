
# 1️⃣ Project Overview

The **Cross-Chain Payment Gateway** allows a user to send tokens from **Blockchain A to Blockchain B**.

Because blockchains are **isolated networks**, they cannot communicate directly.
So the project uses a **bridge mechanism**.

The mechanism used is called:

**Lock → Verify → Mint**

Meaning:

1. Tokens are **locked on Chain A**
2. A **relayer detects the transaction**
3. Equivalent tokens are **minted on Chain B**

This allows value to move across different blockchain networks.

---

# 2️⃣ Problem Statement

Different blockchain networks operate independently.

Example:

* Ethereum
* Polygon
* Avalanche
* Solana

Tokens on one chain **cannot be used directly on another chain**.

Example:

```
ETH on Ethereum ❌ cannot directly move to Polygon
```

To solve this problem, **cross-chain bridges** are created.

Your project simulates how real bridges like:

* Wormhole
* LayerZero
* Polygon Bridge

work internally.

---

# 3️⃣ System Architecture

The system contains **five main components**.

```
User (Frontend UI)
        │
        ▼
Lock Contract (Chain A)
        │
        ▼
Relayer Service
        │
        ▼
WrappedToken Contract (Chain B)
        │
        ▼
Receiver Wallet
```

---

# 4️⃣ Blockchain Networks Used

Your project runs **two local blockchains**.

### Chain A

Port:

```
http://127.0.0.1:8545
```

Purpose:

```
Stores original token (TokenA)
Locks tokens
```

---

### Chain B

Port:

```
http://127.0.0.1:8546
```

Purpose:

```
Creates wrapped tokens
Receives cross-chain transfers
```

---

# 5️⃣ Smart Contracts Used

## 1️⃣ TokenA.sol

This is a standard **ERC-20 token**.

Purpose:

```
Represents the original asset on Chain A
```

Functions used:

```
approve()
transfer()
balanceOf()
```

Example:

```
User owns 100 TokenA
```

---

## 2️⃣ Lock.sol

This contract locks tokens before sending them to another chain.

Main function:

```
lock(uint256 amount, address receiver)
```

What happens:

1️⃣ Token is transferred to the contract
2️⃣ Token becomes **locked**
3️⃣ An event is emitted

Example event:

```
Lock(
sender,
receiver,
amount
)
```

This event is very important because the **relayer listens to it**.

---

## 3️⃣ WrappedToken.sol

This contract exists on **Chain B**.

Purpose:

```
Mint equivalent tokens for locked tokens
```

Example:

```
10 TokenA locked
↓
10 WrappedToken minted
```

Function used:

```
mint(receiver, amount)
```

---

# 6️⃣ The Relayer (Bridge Logic)

The **relayer is the heart of the bridge**.

It is a **Node.js script** that connects both chains.

File:

```
relayer.js
```

What it does:

1️⃣ Listens for **Lock events on Chain A**

```
lock(amount, receiver)
```

2️⃣ Reads:

```
sender
receiver
amount
```

3️⃣ Connects to **Chain B**

4️⃣ Calls:

```
WrappedToken.mint(receiver, amount)
```

This creates tokens on Chain B.

---

# 7️⃣ Frontend Application

The frontend is built using:

```
React
Ethers.js
MetaMask
```

The UI allows users to:

1️⃣ Connect wallet
2️⃣ View balances
3️⃣ Enter transfer amount
4️⃣ Enter receiver address
5️⃣ Send cross-chain payment

---

# 8️⃣ Cross-Chain Transaction Flow

When a user sends tokens:

### Step 1 — Connect Wallet

MetaMask connects to **Chain A**.

Example:

```
Wallet:
0xf39Fd6e...
```

---

### Step 2 — Enter Transfer Details

User enters:

```
Amount: 10
Receiver: 0x7099...
```

---

### Step 3 — Approve Tokens

Frontend calls:

```
TokenA.approve(lockAddress, amount)
```

This allows the lock contract to spend tokens.

---

### Step 4 — Lock Tokens

Frontend calls:

```
Lock.lock(amount, receiver)
```

The contract:

```
Transfers tokens to itself
Emits Lock event
```

---

### Step 5 — Relayer Detects Event

Relayer sees:

```
Lock detected
Sender: 0xf39F...
Receiver: 0x7099...
Amount: 10
```

---

### Step 6 — Mint Wrapped Tokens

Relayer sends transaction to Chain B:

```
WrappedToken.mint(receiver, amount)
```

Now receiver gets tokens.

---

### Step 7 — Receiver Balance Updated

Chain B wallet receives:

```
+10 WrappedToken
```

The cross-chain transfer is complete.

---

# 9️⃣ Example Transfer

User sends:

```
10 TokenA
```

Result:

```
Chain A
User balance: -10
Lock contract: +10
```

```
Chain B
Receiver: +10 WrappedToken
```

Total value remains consistent.

---

# 🔟 Scripts Used

| Script           | Purpose               |
| ---------------- | --------------------- |
| setup.js         | Deploy contracts      |
| deployWrapped.js | Deploy wrapped token  |
| send.js          | Test transactions     |
| relayer.js       | Bridge between chains |

---

# 1️⃣1️⃣ Technologies Used

Blockchain:

```
Solidity
Hardhat
Ethereum
```

Backend:

```
Node.js
Relayer script
```

Frontend:

```
React
Ethers.js
MetaMask
```

---

# 1️⃣2️⃣ Advantages

✔ Demonstrates cross-chain interoperability
✔ Secure token locking mechanism
✔ Real-time event monitoring
✔ Simple bridge architecture
✔ MetaMask integration

---

# 1️⃣3️⃣ Limitations

⚠ Centralized relayer
⚠ Only two chains supported
⚠ No cryptographic verification
⚠ Local test networks only

---

# 1️⃣4️⃣ Future Improvements

Possible upgrades:

* decentralized relayers
* multi-chain support
* cryptographic proof verification
* real blockchain deployment
* gas optimization

---


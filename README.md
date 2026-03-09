**Prerequisites + Setup section** 

---

# 1️⃣ Prerequisites

A user cloning your repo needs these installed:

### Node.js

Install **Node.js (v18–v20 recommended)**

Download from:
[https://nodejs.org](https://nodejs.org)

Check installation:

```bash
node -v
npm -v
```

---

### Git

To clone the repository:

```bash
git --version
```

Download if needed:
[https://git-scm.com](https://git-scm.com)

---

# 2️⃣ Clone the Repository

```bash
git clone https://github.com/jerrywantstofly/cross-chain-payment-gateway.git
cd cross-chain-payment-gateway
```

---

# 3️⃣ Install Dependencies

Run:

```bash
npm install
```

This installs everything defined in **package.json**, including:

```text
hardhat
ethers
openzeppelin
```

So **Hardhat gets installed automatically inside the project**.

You do NOT need:

```bash
npm install -g hardhat
```

---



# Cross-Chain Payment Gateway 🚀

A prototype **cross-chain payment system** built using Ethereum smart contracts and a relayer architecture.

This project demonstrates how assets can be **locked on one blockchain and minted on another**, enabling cross-chain transfers.

---

## 🌐 Project Overview

The system simulates a **cross-chain bridge** between two blockchains:

- **Chain A** – Original token network
- **Chain B** – Wrapped token network

When a user sends tokens:

1. Tokens are **locked on Chain A**
2. A **relayer detects the lock event**
3. The relayer **mints wrapped tokens on Chain B**
4. The receiver receives the wrapped tokens

---

## ⚙️ Architecture

```

User (Frontend UI)
│
▼
Lock Contract (Chain A)
│
▼
Relayer Service (Node.js)
│
▼
Wrapped Token Contract (Chain B)

```

---

## 🧱 Tech Stack

**Blockchain**
- Solidity
- Hardhat

**Frontend**
- React
- Ethers.js
- MetaMask

**Backend / Relayer**
- Node.js
- Event listeners

---

## ✨ Features

- Cross-chain token transfer
- Token locking mechanism
- Wrapped token minting
- Event-driven relayer
- MetaMask wallet integration
- Live progress tracking
- Transaction history
- Animated bridge UI

---



## 🚀 Running the Project

### 1️⃣ Start Chain A

```

npx hardhat node --port 8545

```

### 2️⃣ Start Chain B

```

npx hardhat node --port 8546

```

### 3️⃣ Deploy Contracts

```

npx hardhat run scripts/setup.js --network chainA

```

---

### 4️⃣ Start Relayer

```

node relayer.js

```

---

### 5️⃣ Start Frontend

```

cd frontend
npm install
npm start

```

The UI will open at:

```

[http://localhost:3000](http://localhost:3000)

```

---

## 🔄 Cross-Chain Flow

```

User sends tokens
↓
Approve tokens
↓
Tokens locked on Chain A
↓
Relayer detects event
↓
Wrapped tokens minted on Chain B
↓
Receiver gets tokens

```

---

## 📂 Project Structure

```

cross-chain-payment-gateway
│
├── contracts
│ ├── Lock.sol
│ ├── TokenA.sol
│ └── WrappedToken.sol
│
├── scripts
│ ├── setup.js
│ └── send.js
│
├── frontend
│ ├── src
│ │ ├── App.js
│ │ └── App.css
│
├── relayer.js
└── deployments.json

```
# Summary

Someone cloning your repo needs:

| Requirement | Why                                       |
| ----------- | ----------------------------------------- |
| Node.js     | Run Hardhat and scripts                   |
| npm         | Install dependencies                      |
| Git         | Clone the repository                      |
| Hardhat     | Installed automatically via `npm install` |

---

## 🎯 Future Improvements

- Real blockchain networks (Sepolia / Polygon)
- Secure relayer verification
- Gas optimization
- Multi-token bridging
- Decentralized relayer network

---




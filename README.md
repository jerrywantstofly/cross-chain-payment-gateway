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

# 4️⃣ Start the Local Blockchains

Open two terminals.

### Chain A

```bash
npx hardhat node --port 8545
```

### Chain B

```bash
npx hardhat node --port 8546
```

---

# 5️⃣ Deploy Contracts

Open a third terminal:

```bash
npx hardhat run scripts/setup.js --network chainA
```

This will:

```
Deploy TokenA
Deploy Lock
Update deployments.json
Update relayer.js
```

---

# 6️⃣ Start the Relayer

```bash
node relayer.js
```

The relayer listens for cross-chain events.

---

# 7️⃣ Send a Cross-Chain Transaction

```bash
npx hardhat run scripts/send.js --network chainA
```

---

# Full Quick Start

```bash
git clone https://github.com/jerrywantstofly/cross-chain-payment-gateway.git
cd cross-chain-payment-gateway
npm install

npx hardhat node --port 8545
npx hardhat node --port 8546

npx hardhat run scripts/setup.js --network chainA
node relayer.js
npx hardhat run scripts/send.js --network chainA
```

---

# Summary

Someone cloning your repo needs:

| Requirement | Why                                       |
| ----------- | ----------------------------------------- |
| Node.js     | Run Hardhat and scripts                   |
| npm         | Install dependencies                      |
| Git         | Clone the repository                      |
| Hardhat     | Installed automatically via `npm install` |

---

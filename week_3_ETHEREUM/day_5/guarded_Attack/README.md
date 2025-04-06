# Guarded Attack Simulation on Ethereum

This project demonstrates the **deployment of a secure smart contract** (`SecureVault`) and a **malicious attacker contract** (`MaliciousAttacker`) on the Ethereum Sepolia testnet using Hardhat. The goal is to showcase how reentrancy attacks can be mitigated using OpenZeppelin's `ReentrancyGuard` and the Checks-Effects-Interactions (CEI) pattern.

---

## Table of Contents

- [Overview](#overview)
- [Project Structure](#project-structure)
- [Setup Instructions](#setup-instructions)
- [Usage](#usage)
  - [Compile Contracts](#compile-contracts)
  - [Run Tests Locally](#run-tests-locally)
  - [Deploy Contracts to Sepolia Testnet](#deploy-contracts-to-sepolia-testnet)
- [How the Attack Works](#how-the-attack-works)
- [Prevention and Mitigation](#prevention-and-mitigation)

---

## Overview

### Vulnerable Contract
The vulnerable contract (`VulnerableContract`) allows users to deposit and withdraw funds. However, it contains a **reentrancy vulnerability** in its `withdraw` function, allowing attackers to recursively drain funds before the internal balance is updated.

### Secure Contract
The secure contract (`SecureVault`) fixes this vulnerability by:
1. Implementing OpenZeppelin's `ReentrancyGuard`.
2. Following the **Checks-Effects-Interactions (CEI)** pattern.

### Attacker Contract
The attacker contract (`MaliciousAttacker`) attempts to exploit the vulnerable contract by recursively calling its `withdraw` function. However, when targeting the secure contract, the attack fails due to reentrancy protections.

---

## Project Structure

```
.
├── contracts/
│   ├── VulnerableContract.sol   # Vulnerable smart contract
│   ├── SecureVault.sol          # Secure smart contract (protected against reentrancy attacks)
│   ├── MaliciousAttacker.sol    # Attacker smart contract
├── scripts/
│   └── deploy.js                # Deployment script for Sepolia testnet
├── test/
│   └── secure.test.js           # Test file simulating the attack locally
├── hardhat.config.js            # Hardhat configuration file
├── package.json                 # Node.js dependencies
├── .env                         # Environment variables for RPC URL and private key
└── README.md                    # Project documentation
```

---

## Setup Instructions

### Prerequisites

1. **Node.js**: Install Node.js (LTS version recommended, e.g., v18.x or v20.x).
   ```bash
   nvm install 20.12.1
   nvm use 20.12.1
   ```

2. **Hardhat**: Ensure Hardhat is installed.
   ```bash
   npm install --save-dev hardhat @nomicfoundation/hardhat-toolbox dotenv
   ```

3. **Sepolia Testnet Wallet**:
   - Obtain Sepolia ETH from a faucet (e.g., https://sepoliafaucet.com/).
   - Add your private key and RPC URL to a `.env` file:
     ```bash
     SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/YOUR_INFURA_PROJECT_ID
     PRIVATE_KEY=YOUR_PRIVATE_KEY_WITHOUT_0x_PREFIX
     ```

4. **Dependencies**:
   Install all required dependencies:
   ```bash
   npm install
   ```

---

## Usage

### Compile Contracts

Compile the smart contracts using Hardhat:
```bash
npx hardhat compile
```

### Run Tests Locally

Simulate the reentrancy attack locally using Hardhat's test environment:
```bash
npx hardhat test
```

### Deploy Contracts to Sepolia Testnet

Deploy both contracts to Sepolia:
```bash
npx hardhat run scripts/deploy.js --network sepolia
```

Ensure your `hardhat.config.js` is configured with your Sepolia RPC URL and private key.

---

## How the Attack Works

### Vulnerable Contract Workflow:
1. The attacker deposits ETH into the vulnerable contract.
2. The attacker calls their own `attack()` function, which triggers a recursive withdrawal via the fallback function (`receive()`).
3. Each recursive call withdraws ETH until the vulnerable contract's balance reaches zero.

### Secure Contract Workflow:
1. The attacker deposits ETH into the secure contract.
2. The attacker calls their own `attack()` function, but it fails due to OpenZeppelin's `ReentrancyGuard` and CEI protections.
3. The secure contract remains intact, with funds protected.

---

## Prevention and Mitigation

To prevent reentrancy attacks, follow these best practices:

1. **Checks-Effects-Interactions Pattern**:
   Update internal state (e.g., balances) before making external calls.
   
   ```solidity
   function withdraw(uint256 _amount) public {
       require(balances[msg.sender] >= _amount, "Insufficient balance");
       balances[msg.sender] -= _amount; // Update state first!
       (bool success, ) = msg.sender.call{value: _amount}("");
       require(success, "Transfer failed");
   }
   ```

2. **Use OpenZeppelin's ReentrancyGuard**:
   Add a `nonReentrant` modifier to functions susceptible to reentrancy attacks.
   
3. **Avoid `call` for Transfers**:
   Use `transfer` or `send`, which have limited gas stipends and are safer against reentrancy.

4. **Audit Contracts Regularly**:
   Perform security audits to identify vulnerabilities before deploying contracts.

---

## Example Output

When running `npx hardhat test`, you should see output similar to this:

```text
SecureVault Security Test
    ✓ Should protect funds from reentrancy (857ms)

·----------------------------------|---------------------------|-------------|-----------------------------·
|       Solc version: 0.8.24       ·  Optimizer enabled: true  ·  Runs: 200  ·  Block limit: 30000000 gas  │
·----------------------------------|---------------------------|-------------|-----------------------------·

1 passing (862ms)
```

When deploying contracts using `npx hardhat run scripts/deploy.js --network sepolia`, you should see:

```text
Deploying contracts with account: 0x81328BCf53C036F9b903d2Cab2aF9F4eb6A0B201
Account balance: 0.061559647951639565 ETH
VulnerableContract deployed to: 0x123...abc
AttackerContract deployed to: 0x456...def
```

---

## License

This project is licensed under the MIT License.

---
 
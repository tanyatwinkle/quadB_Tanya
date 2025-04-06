# Reentrancy Attack Simulation on Ethereum

This project demonstrates a **reentrancy attack** on a vulnerable smart contract using Solidity and Hardhat. The attacker exploits a flaw in the `VulnerableContract` to drain its funds by recursively calling its `withdraw` function before the contract can update its internal state.

## Table of Contents
- [Overview](#overview)
- [Project Structure](#project-structure)
- [Setup Instructions](#setup-instructions)
- [Usage](#usage)
  - [Compile Contracts](#compile-contracts)
  - [Run Tests](#run-tests)
  - [Deploy Contracts to Sepolia](#deploy-contracts-to-sepolia)
- [How the Attack Works](#how-the-attack-works)
- [Output Example](#output-example)
- [Prevention and Mitigation](#prevention-and-mitigation)

---

## Overview

The project consists of:
1. A **vulnerable contract** (`VulnerableContract`) that allows users to deposit and withdraw funds but is susceptible to reentrancy attacks.
2. An **attacker contract** (`AttackerContract`) that exploits the vulnerability by recursively withdrawing funds until the vulnerable contract is drained.
3. A **test suite** that simulates the attack and validates the results.

---

## Project Structure

```
.
├── contracts/
│   ├── VulnerableContract.sol   # The vulnerable smart contract
│   ├── AttackerContract.sol     # The attacker smart contract
├── scripts/
│   └── deploy.js                # Deployment script for Sepolia network
├── test/
│   └── attack.test.js           # Test file simulating the reentrancy attack
├── hardhat.config.js            # Hardhat configuration file
├── package.json                 # Node.js dependencies
└── README.md                    # Project documentation
```

---

## Setup Instructions

### Prerequisites

1. **Node.js**: Install Node.js (LTS version recommended, e.g., v18.x or v20.x).
   ```bash
   nvm install 18.20.1
   nvm use 18.20.1
   ```

2. **Hardhat**: Ensure Hardhat is installed.
   ```bash
   npm install --save-dev hardhat @nomicfoundation/hardhat-toolbox
   ```

3. **Sepolia Testnet Wallet**:
   - Obtain Sepolia ETH from a faucet (e.g., https://sepoliafaucet.com/).
   - Add your private key to `hardhat.config.js` for deployment.

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

### Run Tests

Simulate the reentrancy attack locally using Hardhat's test environment:
```bash
npx hardhat test
```

### Deploy Contracts to Sepolia

Deploy both contracts to the Sepolia testnet:
```bash
npx hardhat run scripts/deploy.js --network sepolia
```

Ensure your `hardhat.config.js` is configured with your Sepolia RPC URL and private key:
```javascript
module.exports = {
  solidity: "0.8.24",
  networks: {
    sepolia: {
      url: "YOUR_SEPOLIA_RPC_URL",
      accounts: ["YOUR_PRIVATE_KEY_WITHOUT_0x_PREFIX"]
    }
  }
};
```

---

## How the Attack Works

1. **Vulnerability in `VulnerableContract`**:
   - The `withdraw` function sends ETH to the caller before updating its internal balance.
   - This allows an attacker to recursively call `withdraw` and drain funds before their balance is updated.

2. **Attacker Contract Workflow**:
   - The attacker deposits ETH into the vulnerable contract.
   - The attacker calls their own `attack` function, which triggers a recursive withdrawal via the fallback function (`receive()`).
   - Each recursive call withdraws ETH until the vulnerable contract's balance reaches zero.

3. **Result**:
   - The vulnerable contract is drained of all funds.
   - The attacker gains both their initial deposit and all funds from the vulnerable contract.

---

## Output Example

When running `npx hardhat test`, you should see output similar to this:

```text
[Initial Balances]
Vulnerable Contract: 0.0 ETH
Attacker Contract:   0.0 ETH

[After Deposit]
Vulnerable Contract: 1.0 ETH

[Launching Attack]

[Final Balances]
Vulnerable Contract: 0.0 ETH
Attacker Contract:   2.0 ETH


  Reentrancy Attack Simulation
    ✓ Should demonstrate complete fund drainage (847ms)

·----------------------------------|---------------------------|-------------|-----------------------------·
|       Solc version: 0.8.24       ·  Optimizer enabled: true  ·  Runs: 200  ·  Block limit: 30000000 gas  │
·----------------------------------|---------------------------|-------------|-----------------------------·

1 passing (847ms)
```

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

2. **Use a Reentrancy Guard**:
   Use OpenZeppelin's `ReentrancyGuard` to prevent multiple calls to a function in a single transaction.

3. **Avoid `call` for Transfers**:
   Use `transfer` or `send`, which have limited gas stipends and are safer against reentrancy.

4. **Audit Contracts Regularly**:
   Perform security audits to identify vulnerabilities before deploying contracts.

---

## License

This project is licensed under the MIT License.

---
 
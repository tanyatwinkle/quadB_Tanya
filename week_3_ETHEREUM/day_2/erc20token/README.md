# **ERC-20 Token Deployment on Ethereum**

## **Overview**
This project demonstrates how to create, test, and deploy an ERC-20 token on the Ethereum blockchain using Solidity, Hardhat, and OpenZeppelin. The token follows the ERC-20 standard and includes features such as name, symbol, decimals, and an initial supply.

---

## **Features**
- Compliant with the ERC-20 standard.
- Built using OpenZeppelin's audited contract libraries.
- Configurable initial supply.
- Deployable on Ethereum testnets (e.g., Sepolia) or mainnet.
- Includes comprehensive unit tests for functionality validation.

---

## **Prerequisites**
Before starting, ensure you have the following installed:
1. **Node.js**: Use an even-numbered version (e.g., v18.x or v20.x).
   - Install via [Node.js official website](https://nodejs.org/) or using `nvm`:
     ```bash
     nvm install 20
     nvm use 20
     ```
2. **Hardhat**: Installed as part of this project setup.
3. **MetaMask Wallet**: To manage accounts and interact with deployed contracts.
4. **Sepolia Test ETH**: Obtain test ETH from the [Sepolia Faucet](https://sepoliafaucet.com/).

---

## **Setup Instructions**

### 1. Clone the Repository
```bash
git clone 
cd erc20-token
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Create a `.env` file in the root directory and add the following:
```env
ALCHEMY_SEPOLIA_URL="YOUR_ALCHEMY_RPC_URL"
DEPLOYER_PRIVATE_KEY="YOUR_PRIVATE_KEY"
ETHERSCAN_API_KEY="YOUR_ETHERSCAN_API_KEY"
```
Replace placeholders with your actual values:
- `ALCHEMY_SEPOLIA_URL`: Get it from [Alchemy](https://www.alchemy.com/).
- `DEPLOYER_PRIVATE_KEY`: Exported from your MetaMask wallet.
- `ETHERSCAN_API_KEY`: Optional, for contract verification.

---

## **How to Use**

### 1. Compile Contracts
Run the following command to compile Solidity contracts:
```bash
npx hardhat compile
```

### 2. Run Tests
To ensure the contract behaves as expected:
```bash
npx hardhat test
```

### 3. Deploy Contract to Sepolia Testnet
Deploy the ERC-20 token contract:
```bash
npx hardhat run scripts/deploy.js --network sepolia
```

### 4. Verify Deployment on Etherscan (Optional)
Verify the contract source code:
```bash
npx hardhat verify --network sepolia  
```

---

## **Project Structure**
```
erc20-token/
├── contracts/
│   └── MyToken.sol          # ERC-20 Token Contract Code
├── scripts/
│   └── deploy.js            # Deployment Script
├── test/
│   └── MyToken.js           # Unit Tests for Token Contract
├── .env                     # Environment Variables (ignored by Git)
├── hardhat.config.js        # Hardhat Configuration File
├── package.json             # Node.js Dependencies and Scripts
└── README.md                # Project Documentation
```

---

## **Contract Details**
After deployment, your token will have the following properties:
| Property       | Value Example           |
|----------------|-------------------------|
| Name           | `MyToken`               |
| Symbol         | `MYT`                   |
| Decimals       | `18`                    |
| Initial Supply | `1,000,000 MYT`         |

---

## **Testing**
The tests include:
1. Verifying token name and symbol.
2. Ensuring initial supply is assigned to the deployer.
3. Validating token transfers between accounts.
4. Ensuring transfers fail when sender lacks sufficient balance.

Run tests with:
```bash
npx hardhat test
```

Expected output:
```
MyToken Contract
✔ Should set the correct name and symbol (50ms)
✔ Should assign the total supply to the owner (40ms)
✔ Should transfer tokens between accounts (60ms)
✔ Should fail if sender doesn’t have enough tokens (30ms)
✔ Should update balances after transfers (40ms)

5 passing (200ms)
```

---

## **Deployment Output Example**
After running `deploy.js`, you should see output like this:

```
🔨 Deployment Started
=====================
💼 Deployer Address: 0x81328BCf53C036F9b903d2Cab2aF9F4eb6A0B201
⛽ Balance: 0.854327 ETH

✅ Deployment Successful
========================
📜 Contract Address: 0x4F51C5339070cef8208f3932327D4830Ad9A2Cea
🌐 Token Details:
   - Name: MyToken
   - Symbol: MYT

💰 Supply Details:
   - Formatted Supply: 1000000 MYT

🏦 Deployer Token Balance: 1000000 MYT
```

---

## **Resources**
1. [Hardhat Documentation](https://hardhat.org/docs/)
2. [OpenZeppelin Contracts](https://docs.openzeppelin.com/contracts/)
3. [Ethers.js Documentation](https://docs.ethers.io/v6/)
4. [Sepolia Faucet](https://sepoliafaucet.com/)

---

## **License**
This project is licensed under the MIT License.
 
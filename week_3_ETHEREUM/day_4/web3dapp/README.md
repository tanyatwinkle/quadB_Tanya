## **Web3 dApp: Interact with a Smart Contract**

This is a modern, responsive Web3 decentralized application (dApp) built with **React**, **Ethers.js**, and **Hardhat**. The dApp allows users to connect their MetaMask wallet, interact with a smart contract deployed on the Sepolia test network, and update values on the blockchain.

---

### **Features**
- **Wallet Connection**: Connect your MetaMask wallet to the dApp.
- **Smart Contract Interaction**: Update a value stored in the smart contract.
- **Responsive Design**: Fully responsive UI with modern styling.
- **Sepolia Network Support**: Works seamlessly with the Ethereum Sepolia testnet.
- **Error Handling**: Alerts for incorrect network or failed transactions.

---

### **Technologies Used**
- **Frontend**:
  - React.js
  - Ethers.js
  - CSS (modern, responsive design)
- **Backend**:
  - Solidity (Smart Contract)
  - Hardhat (Development Framework)
- **Blockchain**:
  - Ethereum (Sepolia Testnet)

---

### **Project Structure**
```
project/
├── chain/                   # Backend (Hardhat) directory
│   ├── contracts/           # Solidity smart contracts
│   │   └── AdvancedDapp.sol # Example contract
│   ├── scripts/             # Deployment scripts
│   │   └── deploy.js        # Deployment script
│   ├── test/                # Smart contract tests
│   │   └── AdvancedDapp.test.js
│   └── hardhat.config.js    # Hardhat configuration file
│
├── webapp/                  # Frontend (React) directory
│   ├── public/              # Static assets
│   ├── src/                 # Source code for React app
│   │   ├── components/      # Reusable components
│   │   │   ├── WalletButton.jsx
│   │   │   └── ContractInteraction.jsx
│   │   ├── utils/           # Utility files (e.g., ABI)
│   │   │   └── ContractABI.js
│   │   ├── App.jsx          # Main React app file
│   │   └── styles.css       # Global CSS styles
└── README.md                # Project documentation
```

---

### **Getting Started**

#### Prerequisites
1. Install [Node.js](https://nodejs.org/) (LTS version recommended).
2. Install [MetaMask](https://metamask.io/) browser extension.
3. Create an account on [Alchemy](https://www.alchemy.com/) or [Infura](https://infura.io/) for an RPC URL.

#### Clone the Repository
```bash
git clone https://github.com/your-repo/web3-dapp.git
cd web3-dapp
```

---

### **Backend Setup (Hardhat)**

1. Navigate to the `chain` directory:
```bash
cd chain/
```

2. Install dependencies:
```bash
npm install --save-dev hardhat @nomicfoundation/hardhat-toolbox dotenv ethers
```

3. Configure `.env` file:
Create a `.env` file in the `chain` directory and add the following:
```plaintext
ALCHEMY_API_URL=https://eth-sepolia.g.alchemy.com/v2/YOUR_ALCHEMY_API_KEY
SEPOLIA_PRIVATE_KEY=YOUR_WALLET_PRIVATE_KEY
```

4. Compile the smart contract:
```bash
npx hardhat compile
```

5. Deploy the smart contract:
```bash
npx hardhat run scripts/deploy.js --network sepolia
```

6. Note down the deployed contract address from the terminal output.

7. Run tests (optional):
```bash
npx hardhat test
```

---

### **Frontend Setup (React)**

1. Navigate to the `webapp` directory:
```bash
cd webapp/
```

2. Install dependencies:
```bash
npm install react react-dom ethers --save-dev @vitejs/plugin-react vite 
```

3. Configure `ContractABI.js`:
Update the `CONTRACT_ADDRESS` in `src/utils/ContractABI.js` with your deployed contract address from the backend setup.

Example:
```javascript
export const CONTRACT_ADDRESS = "0xYourDeployedContractAddress";
export const CONTRACT_ABI = [
  // Your contract's ABI here...
];
```

4. Start the development server:
```bash
npm start
```

5. Open your browser and navigate to `http://localhost:3000`.

---

### **How to Use**
1. Open the dApp in your browser.
2. Connect your MetaMask wallet by clicking "Connect Wallet."
3. Ensure you are on the Sepolia testnet.
4. Enter a value in the input field and click "Update Value."
5. Confirm the transaction in MetaMask.
6. Wait for confirmation, and you'll see a success message!

---

### **Folder Details**

#### Backend (`chain`)
- `contracts/`: Contains Solidity smart contracts.
- `scripts/`: Deployment scripts.
- `test/`: Mocha/Chai test files for smart contracts.
- `hardhat.config.js`: Hardhat configuration file.

#### Frontend (`webapp`)
- `src/components/`: Reusable React components like WalletButton and ContractInteraction.
- `src/utils/`: Contains utility files like contract ABI and address.
- `styles.css`: Global CSS for styling.

---

### **Screenshots**
#### Homepage:
![Homepage Screenshot](https://via.placeholder.com/800x400?text=Homepet Connected:
![Wallet Connected Screenshot](https://via.placeholder.com/800x400?text=Wallet+Connected+ScreeTroubleshooting**

1. **MetaMask not detected**:
   - Ensure MetaMask is installed in your browser.

2. **Wrong network error**:
   - Switch to Sepolia testnet in MetaMask.

3. **Transaction failed**:
   - Ensure you have Sepolia ETH in your wallet for gas fees.

4. **Frontend not loading**:
   - Check if you’ve started the React development server (`npm start`).

---

### **Future Enhancements**
1. Add support for multiple networks.
2. Display transaction history on the frontend.
3. Implement dark mode toggle.
4. Add unit tests for React components.

---

### **Contributing**
Contributions are welcome! Please fork this repository, create a feature branch, and submit a pull request.

---

### **License**
This project is licensed under the MIT License.
 
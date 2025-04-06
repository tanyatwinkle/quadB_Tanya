## Secure Voting System DApp

---

### **Overview**
The Secure Voting System is a decentralized application (DApp) that allows users to create proposals, vote on them, and view results in a secure and transparent manner using blockchain technology. It ensures that:
- Each voter can only vote once per proposal.
- Voting periods are enforced.
- Results are immutable and verifiable on the blockchain.

This DApp is built with **React**, **Solidity**, and **ethers.js**, and deployed on the **Ethereum blockchain**.

---

### **Features**
1. **Wallet Connection**: Connect your wallet using MetaMask.
2. **Admin Panel**: Create new proposals (admin only).
3. **Voting**: Cast votes securely for active proposals.
4. **Real-time Status**: View voting status and time remaining for each proposal.
5. **Results**: View the results of each proposal after the voting period ends.
6. **Error Handling**: Clear error messages for double voting, expired voting periods, etc.

---

### **Technologies Used**
- **Frontend**: React, Bootstrap
- **Blockchain Interaction**: ethers.js
- **Smart Contract Language**: Solidity
- **Wallet Integration**: MetaMask

---

### **Setup Instructions**

#### Prerequisites
1. Node.js (v16+ recommended)
2. MetaMask browser extension
3. Ethereum test network (e.g., Sepolia)

#### Steps
1. Clone this repository:
   ```bash
   git clone https://github.com/your-repo/secure-voting-dapp.git
   cd secure-voting-dapp
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Deploy the smart contract:
   - Configure your `.env` file with your private key and RPC URL:
     ```
     PRIVATE_KEY=your_private_key
     RPC_URL=https://sepolia.infura.io/v3/YOUR_INFURA_PROJECT_ID
     ```
   - Compile and deploy the contract:
     ```bash
     npx hardhat compile
     npx hardhat run scripts/deploy.js --network sepolia
     ```
   - Note down the deployed contract address.

4. Configure frontend:
   - Open `App.js` and update the `contractAddress` variable with your deployed contract address.

5. Start the frontend:
   ```bash
   npm start
   ```

6. Open your browser and navigate to `http://localhost:3000`.

---

### **Usage**

#### 1. Connect Wallet
- Click on "Connect Wallet" to connect your MetaMask wallet.

#### 2. Create Proposals (Admin Only)
- If you're the contract owner, use the admin panel to create new proposals by providing:
  - Title
  - Description
  - Options (at least two)
  - Voting duration (in minutes)

#### 3. Vote on Proposals
- Select an option for an active proposal and click "Confirm Vote."
- You can only vote once per proposal.

#### 4. View Results
- After voting ends, view the results of each proposal.

---

### **Smart Contract ABI**
The following ABI is used in `App.js` to interact with the smart contract:

```json
[
  {
    "inputs": [],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "anonymous": false,
    "inputs": [
      { "indexed": false, "internalType": "uint256", "name": "id", "type": "uint256" },
      { "indexed": false, "internalType": "string", "name": "title", "type": "string" },
      { "indexed": false, "internalType": "uint256", "name": "endTime", "type": "uint256" }
    ],
    "name": "ProposalCreated",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      { "indexed": false, "internalType": "uint256", "name": "proposalId", "type": "uint256" },
      { "indexed": false, "internalType": "string", "name": "option", "type": "string" },
      { "indexed": false, "internalType": "address", "name": "voter", "type": "address" }
    ],
    "name": "Voted",
    "type": "event"
  },
  {
    ...
```

### **Future Enhancements**
1. Add support for multiple admins.
2. Enable real-time updates using WebSocket or polling.
3. Add user authentication for additional security.
4. Implement gas fee estimation for better user experience.

---

### License
This project is licensed under the MIT License.

---
 
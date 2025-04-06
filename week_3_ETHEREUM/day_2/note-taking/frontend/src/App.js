import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import Header from './Header';
import './App.css';

function App() {
  const [storedNote, setStoredNote] = useState('');
  const [tempNote, setTempNote] = useState('');
  const [inputText, setInputText] = useState('');
  const [account, setAccount] = useState('');
  const [provider, setProvider] = useState(null);
  const [error, setError] = useState('');
  const [showConnectDialog, setShowConnectDialog] = useState(false);

  const contractAddress = "0x84CaC03899435c003Ec4c94802Ea1bb2a58220b7";
  const abi = [
    {
      "inputs": [],
      "name": "storedText",
      "outputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "newText",
          "type": "string"
        }
      ],
      "name": "updateWithMemory",
      "outputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "stateMutability": "pure",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "newText",
          "type": "string"
        }
      ],
      "name": "updateWithStorage",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    }
  ];

  // Check if wallet is already connected on load
  useEffect(() => {
    if (window.ethereum?.selectedAddress) {
      handleConnection();
    }
  }, []);

  // Show confirmation dialog before connecting
  const confirmConnection = () => {
    setShowConnectDialog(true);
  };

  // Handle user's decision in the confirmation dialog
  const handleConnectDecision = async (decision) => {
    setShowConnectDialog(false);
    if (decision) {
      if (!window.ethereum) {
        setError('MetaMask extension not detected');
        return;
      }
      await handleConnection();
    }
  };

  // Connect wallet and initialize provider
  const handleConnection = async () => {
    try {
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      });
      const newProvider = new ethers.BrowserProvider(window.ethereum);
      setAccount(accounts[0]);
      setProvider(newProvider);
      setError('');

      // Add event listeners for account and chain changes
      window.ethereum.on('accountsChanged', (newAccounts) => {
        setAccount(newAccounts[0] || '');
      });

      window.ethereum.on('chainChanged', () => window.location.reload());
    } catch (err) {
      setError('Connection failed: ' + err.message);
    }
  };

  // Update note temporarily (memory)
  async function updateWithMemory() {
    if (!provider) {
      setError('Wallet not connected');
      return;
    }

    try {
      const contract = new ethers.Contract(contractAddress, abi, provider);
      const result = await contract.updateWithMemory(inputText);
      setTempNote(result);
    } catch (err) {
      setError('Memory update failed: ' + err.message);
    }
  }

  // Update note permanently (storage)
  async function updateWithStorage() {
    if (!provider) {
      setError('Wallet not connected');
      return;
    }

    try {
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(contractAddress, abi, signer);
      const tx = await contract.updateWithStorage(inputText);
      await tx.wait();
      
      const updatedNote = await contract.storedText();
      setStoredNote(updatedNote);
    } catch (err) {
      setError('Storage update failed: ' + err.message);
    }
  }

  return (
    <div className="container"> 
      <Header />
      {/* Confirmation Dialog */}
      {showConnectDialog && (
        <div className="confirmation-dialog">
          <div className="dialog-content">
            <h3>Connect Wallet</h3>
            <p>Do you want to connect your wallet to this dApp?</p>
            <div className="dialog-buttons">
              <button
                onClick={() => handleConnectDecision(true)}
                className="btn btn-confirm"
              >
                Yes, Connect
              </button>
              <button
                onClick={() => handleConnectDecision(false)}
                className="btn btn-cancel"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      {account && (
        <div className="connection-status">
          🔗 Connected: {`${account.slice(0, 6)}...${account.slice(-4)}`}
        </div>
      )}

      {!account && (
        <button onClick={confirmConnection} className="connect-wallet-btn">
          Connect Wallet
        </button>
      )}

      {error && <div className="error-message">{error}</div>}

      <div className="main-grid">
        <div className="input-section">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            className="note-input"
            placeholder="Enter new note"
          />
          
          <div className="action-buttons">
            <button 
              onClick={updateWithMemory}
              className="btn btn-memory"
              disabled={!account}
            >
              Update with Memory (Temporary)
            </button>
            
            <button
              onClick={updateWithStorage}
              className="btn btn-storage"
              disabled={!account}
            >
              Update with Storage (Permanent)
            </button>
          </div>
        </div>

        <div className="results-section">
          <h2 className="results-heading">Results</h2>
          <div>
            <div className="result-box">
              <h3 className="result-title">Stored Note (Permanent):</h3>
              <p className="result-content">{storedNote || 'No stored note'}</p>
            </div>
            <div className="result-box">
              <h3 className="result-title">Temporary Note:</h3>
              <p className="result-content">{tempNote || 'No temporary note'}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;

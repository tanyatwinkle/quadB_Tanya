import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import toast, { Toaster } from 'react-hot-toast';
import './App.css'; 

function GasComparator() {
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const contractAddress = "0x70551253b1438Abc2eA7f3A2b15Cd82AE78070De";
  const abi = [
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "uint256",
          "name": "transactionId",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "gasUsed",
          "type": "uint256"
        }
      ],
      "name": "GasUsed",
      "type": "event"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "complexArray",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_count",
          "type": "uint256"
        }
      ],
      "name": "complexTransaction",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_value",
          "type": "uint256"
        }
      ],
      "name": "simpleTransaction",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "simpleValue",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    }
  ];

  const compareGas = async () => {
    try {
      setIsLoading(true);
      setError('');
      
      if (!window.ethereum) {
        throw new Error('Please install MetaMask!');
      }

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(contractAddress, abi, signer);

      // Execute transactions with loading states
      const tx1 = await toast.promise(
        contract.simpleTransaction(42),
        {
          loading: 'Processing Simple Transaction...',
          success: 'Simple Transaction Completed!',
          error: 'Simple Transaction Failed!',
        }
      );

      const receipt1 = await tx1.wait();

      const tx2 = await toast.promise(
        contract.complexTransaction(10),
        {
          loading: 'Processing Complex Transaction...',
          success: 'Complex Transaction Completed!',
          error: 'Complex Transaction Failed!',
        }
      );

      const receipt2 = await tx2.wait();

      setResults([{
        id: 1,
        gas: ethers.formatUnits(receipt1.gasUsed * receipt1.gasPrice, 'gwei'),
        status: '✅',
        txHash: receipt1.hash
      }, {
        id: 2,
        gas: ethers.formatUnits(receipt2.gasUsed * receipt2.gasPrice, 'gwei'),
        status: '✅',
        txHash: receipt2.hash
      }]);

    } catch (err) {
      setError(err.message);
      toast.error(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container">
      <Toaster position="top-right" toastOptions={{
        style: {
          border: '1px solid var(--primary-color)',
          padding: '16px',
          background: 'var(--background-color)',
        },
      }} />
      
      <header className="header">
        <h1>🛢️ Gas Fee Comparator</h1>
        <p>Compare transaction gas costs on Ethereum</p>
      </header>

      <main className="main-content">
        <button 
          className="action-button"
          onClick={compareGas}
          disabled={isLoading}
        >
          {isLoading ? (
            <div className="spinner"></div>
          ) : (
            '🚀 Run Comparison'
          )}
        </button>

        {error && <div className="error-message">{error}</div>}

        <div className="results-grid">
          {results.map(result => (
            <div key={result.id} className="result-card">
              <div className="card-header">
                <span className="transaction-id">#{result.id}</span>
                <span className="status-indicator">{result.status}</span>
              </div>
              <div className="gas-info">
                <span className="gas-label">Gas Fees:</span>
                <span className="gas-amount">{result.gas} ETH</span>
              </div>
              <a 
                href={`https://sepolia.etherscan.io/tx/${result.txHash}`}
                className="tx-link"
                target="_blank"
                rel="noopener noreferrer"
              >
                View on Etherscan
              </a>
            </div>
          ))}
        </div>
      </main>

      <footer className="footer">
        <p>🔗 Connected to Sepolia Testnet</p>
      </footer>
    </div>
  );
}

export default GasComparator;

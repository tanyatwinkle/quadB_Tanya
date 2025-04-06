import React, { useState } from 'react';
import { ethers } from 'ethers';
import { CONTRACT_ADDRESS, CONTRACT_ABI } from '../utils/ContractABI';

const ContractInteraction = ({ signer }) => {
  const [value, setValue] = useState("");

  const updateContractValue = async () => {
    if (!signer?.provider) {
      alert("Wallet not connected properly");
      return;
    }

    try {
      // Verify network
      const network = await signer.provider.getNetwork();
      if (network.chainId !== 11155111n) {
        alert("Switch to Sepolia network");
        return;
      }

      // Create contract instance
      const contract = new ethers.Contract(
        CONTRACT_ADDRESS,
        CONTRACT_ABI,
        signer
      );

      const tx = await contract.updateValue(value);
      await tx.wait();
      alert("Value updated successfully");
    } catch (error) {
      console.error("Transaction failed:", error);
      alert(`Error: ${error.reason || error.message}`);
    }
  };

  return (
    <div className="contract-container">
      <input 
        className="contract-input"
        type="number" 
        placeholder="Enter value" 
        onChange={(e) => setValue(e.target.value)} 
      />
      <button className="update-button" onClick={updateContractValue}>Update Value</button>
      
    </div>
    
    
  );
};

export default ContractInteraction;

import React, { useState } from 'react';
import { ethers } from 'ethers';

const WalletButton = ({ setSigner }) => {
  const [walletAddress, setWalletAddress] = useState("");

  const connectWallet = async () => {
    if (!window.ethereum) return alert("MetaMask required!");

    // Initialize provider properly
    const provider = new ethers.BrowserProvider(window.ethereum);
    await provider.send("eth_requestAccounts", []);

    // Get network before signer
    const network = await provider.getNetwork();
    if (network.chainId !== 11155111n) {
      alert("Switch to Sepolia network");
      return;
    }

    // Get valid signer with attached provider
    const signer = await provider.getSigner();

    setWalletAddress(signer.address);
    setSigner(signer); // Pass full signer object
  };

  return (
    <button className="wallet-button" onClick={connectWallet}>
      {walletAddress ? `Connected: ${walletAddress.slice(0, 6)}...` : 'Connect Wallet'}
    </button>
    
  );
};

export default WalletButton;

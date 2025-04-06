import React, { useState } from 'react';
import WalletButton from './components/WalletButton';
import ContractInteraction from './components/ContractInteraction';
import './styles.css';

const App = () => {
  const [signer, setSigner] = useState(null);

  return (
    <div className="app-container">
      <h1>Web3 dApp</h1>
      
      <WalletButton setSigner={setSigner} />
      <ContractInteraction signer={signer ? signer : null} />
      <div class="loading-spinner"></div>
    </div>
  );
};

export default App;

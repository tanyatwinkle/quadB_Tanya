import React, { useState, useEffect } from 'react';
import { multi_user_counter_backend } from '../../declarations/multi_user_counter_backend';
import './index.scss';
import CounterSection from './components/CounterSection';
import CreatePollSection from './components/CreatePollSection.jsx';
import PollsSection from './components/PollsSection';

function App() {
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // Check if the canister is accessible
    const checkConnection = async () => {
      try {
        await multi_user_counter_backend.get_counter();
        setIsConnected(true);
      } catch (error) {
        console.error("Failed to connect to canister:", error);
        setIsConnected(false);
      }
    };

    checkConnection();
  }, []);

  if (!isConnected) {
    return (
      <div className="container mt-5 text-center">
        <div className="alert alert-warning">
          <h2>Connecting to the Internet Computer...</h2>
          <p>If this message persists, please check your connection to the ICP network.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <header className="text-center mb-5">
        <h1>Multi-User Counter & Voting dApp</h1>
        <p className="lead">Built on the Internet Computer Protocol</p>
      </header>

      <div className="row">
        <div className="col-md-4">
          <CounterSection />
        </div>
        <div className="col-md-8">
          <CreatePollSection />
          <PollsSection />
        </div>
      </div>
    </div>
  );
}

export default App;

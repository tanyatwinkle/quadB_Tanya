// Counter.jsx
import React, { useState, useEffect } from 'react';
import { Actor, HttpAgent } from '@dfinity/agent';
import { idlFactory } from '/home/tanya/quadB_Tanya/day_4/web3-integration/src/declarations/web3-integration-backend';
import './index.scss';

function Counter() {
  const [count, setCount] = useState(null);
  const [actor, setActor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Initialize the actor when component mounts
  useEffect(() => {
    async function initActor() {
      try {
        // Create an agent
        const agent = new HttpAgent({ host: process.env.DFX_NETWORK === 'ic' ? 
          'https://ic0.app' : 'http://localhost:8000' });
        
        // Only fetch the root key in development
        if (process.env.DFX_NETWORK !== 'ic') {
          await agent.fetchRootKey();
        }
        
        // Create an actor
        const counterActor = Actor.createActor(idlFactory, {
          agent,
          canisterId: process.env.CANISTER_ID_COUNTER || process.env.COUNTER_CANISTER_ID,
        });
        
        setActor(counterActor);
        
        // Fetch initial count
        const initialCount = await counterActor.get();
        setCount(Number(initialCount.toString()));
        setLoading(false);
      } catch (err) {
        console.error('Failed to initialize actor:', err);
        setError('Failed to connect to the counter canister');
        setLoading(false);
      }
    }
    
    initActor();
  }, []);

  // Increment counter
  const handleIncrement = async () => {
    if (!actor) return;
    
    try {
      setLoading(true);
      await actor.increment();
      const newCount = await actor.get();
      setCount(Number(newCount.toString()));
      setLoading(false);
    } catch (err) {
      console.error('Failed to increment counter:', err);
      setError('Failed to increment counter');
      setLoading(false);
    }
  };

  // Reset counter to 0
  const handleReset = async () => {
    if (!actor) return;
    
    try {
      setLoading(true);
      // Use the set method from your Rust canister
      await actor.set(BigInt(0));
      const newCount = await actor.get();
      setCount(Number(newCount.toString()));
      setLoading(false);
    } catch (err) {
      console.error('Failed to reset counter:', err);
      setError('Failed to reset counter');
      setLoading(false);
    }
  };

  // Set counter to a specific value
  const handleSetValue = async (value) => {
    if (!actor) return;
    
    try {
      setLoading(true);
      await actor.set(BigInt(value));
      const newCount = await actor.get();
      setCount(Number(newCount.toString()));
      setLoading(false);
    } catch (err) {
      console.error('Failed to set counter value:', err);
      setError('Failed to set counter value');
      setLoading(false);
    }
  };

  if (error) {
    return <div className="counter-error">{error}</div>;
  }

  return (
    <div className="counter-container">
      <h2>ICP Rust Counter</h2>
      
      <div className="counter-display">
        {loading ? (
          <div className="counter-loading">Loading...</div>
        ) : (
          <div className="counter-value">{count}</div>
        )}
      </div>
      
      <div className="counter-controls">
        <button 
          className="counter-button increment" 
          onClick={handleIncrement}
          disabled={loading}
        >
          Increment
        </button>
        
        <button 
          className="counter-button reset" 
          onClick={handleReset}
          disabled={loading}
        >
          Reset
        </button>
      </div>
      
      <div className="counter-set-value">
        <h3>Set Counter Value</h3>
        <div className="preset-values">
          {[5, 10, 42, 100].map(value => (
            <button 
              key={value}
              className="counter-button preset" 
              onClick={() => handleSetValue(value)}
              disabled={loading}
            >
              {value}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Counter;

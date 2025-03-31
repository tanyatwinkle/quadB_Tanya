import React, { useState, useEffect } from 'react';
import { AuthClient } from '@dfinity/auth-client';
import { Actor, HttpAgent } from '@dfinity/agent';
import { idlFactory } from '../../declarations/voting_counter_backend';

import './index.scss';

const App = () => {
  const [authClient, setAuthClient] = useState(null);
  const [identity, setIdentity] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [backendActor, setBackendActor] = useState(null);
  const [counter, setCounter] = useState(0);
  const [allCounters, setAllCounters] = useState([]);
  const [proposals, setProposals] = useState([]);
  const [newProposal, setNewProposal] = useState({ title: '', description: '' });
  const [loading, setLoading] = useState(true);

  // Initialize auth client
  useEffect(() => {
    const initAuth = async () => {
      const client = await AuthClient.create();
      setAuthClient(client);
      
      const isLoggedIn = await client.isAuthenticated();
      setIsAuthenticated(isLoggedIn);
      
      if (isLoggedIn) {
        const identity = client.getIdentity();
        setIdentity(identity);
        initActor(identity);
      }
      
      setLoading(false);
    };
    
    initAuth();
  }, []);

  const initActor = async (identity) => {
    const agent = new HttpAgent({ identity });
    
    // When deploying locally, we need to fetch the root key
    if (process.env.NODE_ENV !== 'production') {
      await agent.fetchRootKey();
    }
    
    const actor = Actor.createActor(idlFactory, {
      agent,
      canisterId: process.env.VOTING_COUNTER_BACKEND_CANISTER_ID,
    });
    
    setBackendActor(actor);
    
    // Load initial data
    await refreshData(actor);
  };

  const refreshData = async (actor) => {
    try {
      const counterValue = await actor.get_counter();
      setCounter(Number(counterValue));
      
      const counters = await actor.get_all_counters();
      setAllCounters(counters);
      
      const allProposals = await actor.get_all_proposals();
      setProposals(allProposals);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const login = async () => {
    await authClient.login({
      identityProvider: process.env.NODE_ENV === 'production' 
        ? 'https://identity.ic0.app' 
        : 'http://localhost:4943?canisterId=rdmx6-jaaaa-aaaaa-aaadq-cai',
      onSuccess: async () => {
        setIsAuthenticated(true);
        const identity = authClient.getIdentity();
        setIdentity(identity);
        await initActor(identity);
      },
    });
  };

  const logout = async () => {
    await authClient.logout();
    setIsAuthenticated(false);
    setIdentity(null);
    setBackendActor(null);
  };

  const incrementCounter = async () => {
    if (!backendActor) return;
    
    try {
      const result = await backendActor.increment_counter();
      setCounter(Number(result));
      await refreshData(backendActor);
    } catch (error) {
      console.error("Error incrementing counter:", error);
    }
  };

  const decrementCounter = async () => {
    if (!backendActor) return;
    
    try {
      const result = await backendActor.decrement_counter();
      setCounter(Number(result));
      await refreshData(backendActor);
    } catch (error) {
      console.error("Error decrementing counter:", error);
    }
  };

  const createProposal = async (e) => {
    e.preventDefault();
    if (!backendActor || !newProposal.title || !newProposal.description) return;
    
    try {
      await backendActor.create_proposal(newProposal.title, newProposal.description);
      setNewProposal({ title: '', description: '' });
      await refreshData(backendActor);
    } catch (error) {
      console.error("Error creating proposal:", error);
    }
  };

  const voteOnProposal = async (proposalId, voteType) => {
    if (!backendActor) return;
    
    try {
      await backendActor.vote(proposalId, voteType);
      await refreshData(backendActor);
    } catch (error) {
      console.error("Error voting on proposal:", error);
    }
  };

  if (loading) {
    return <div className="container">Loading...</div>;
  }

  return (
    <div className="container">
      <header>
        <h1>ICP Voting Counter dApp</h1>
        {!isAuthenticated ? (
          <button onClick={login}>Login</button>
        ) : (
          <button onClick={logout}>Logout</button>
        )}
      </header>

      {isAuthenticated ? (
        <div className="content">
          <section className="counter-section">
            <h2>Your Counter</h2>
            <div className="counter-display">
              <p>Current Value: {counter}</p>
              <div className="counter-buttons">
                <button onClick={incrementCounter}>Increment</button>
                <button onClick={decrementCounter}>Decrement</button>
              </div>
            </div>
          </section>

          <section className="all-counters-section">
            <h2>All User Counters</h2>
            <ul className="counters-list">
              {allCounters.map((userCounter, index) => (
                <li key={index}>
                  User: {userCounter.owner.toString().substring(0, 10)}...
                  Count: {userCounter.count.toString()}
                </li>
              ))}
            </ul>
          </section>

          <section className="proposals-section">
            <h2>Create New Proposal</h2>
            <form onSubmit={createProposal} className="proposal-form">
              <input
                type="text"
                placeholder="Title"
                value={newProposal.title}
                onChange={(e) => setNewProposal({ ...newProposal, title: e.target.value })}
                required
              />
              <textarea
                placeholder="Description"
                value={newProposal.description}
                onChange={(e) => setNewProposal({ ...newProposal, description: e.target.value })}
                required
              />
              <button type="submit">Create Proposal</button>
            </form>

            <h2>All Proposals</h2>
            <div className="proposals-list">
              {proposals.map((proposal) => (
                <div key={proposal.id} className="proposal-card">
                  <h3>{proposal.title}</h3>
                  <p>{proposal.description}</p>
                  <div className="proposal-stats">
                    <p>Status: {proposal.status}</p>
                    <p>Yes Votes: {proposal.yes_votes.toString()}</p>
                    <p>No Votes: {proposal.no_votes.toString()}</p>
                  </div>
                  {proposal.status === 'Active' && (
                    <div className="voting-buttons">
                      <button onClick={() => voteOnProposal(proposal.id, { Yes: null })}>
                        Vote Yes
                      </button>
                      <button onClick={() => voteOnProposal(proposal.id, { No: null })}>
                        Vote No
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        </div>
      ) : (
        <div className="login-prompt">
          <p>Please login to use the application</p>
        </div>
      )}
    </div>
  );
};

export default App;

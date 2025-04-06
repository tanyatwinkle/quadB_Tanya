import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { Container, Row, Col, Card, Button, Form, Alert } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  const [contract, setContract] = useState(null);
  const [proposals, setProposals] = useState([]);
  const [selectedOptions, setSelectedOptions] = useState({});
  const [walletConnected, setWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');
  const [isOwner, setIsOwner] = useState(false);
  const [newProposal, setNewProposal] = useState({ 
    title: '', 
    description: '', 
    options: ['', ''], 
    duration: 60 
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');


  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', handleAccountsChanged);
      checkWalletConnection();
    }
  }, []);

  const checkWalletConnection = async () => {
    if (window.ethereum?.isConnected()) {
      await connectWallet();
    }
  };

  const handleAccountsChanged = (accounts) => {
    if (accounts.length === 0) {
      setWalletConnected(false);
      setWalletAddress('');
    } else {
      connectWallet();
    }
  };

  const connectWallet = async () => {
    try {
      setLoading(true);
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const address = await signer.getAddress();

      setWalletAddress(address);
      setWalletConnected(true);

      const contractAddress = "0xd6Fa3e0705279892c240373ba444717Ba2291899";
      const contractABI = [
        {
          "inputs": [],
          "stateMutability": "nonpayable",
          "type": "constructor"
        },
        {
          "anonymous": false,
          "inputs": [
            {
              "indexed": false,
              "internalType": "uint256",
              "name": "id",
              "type": "uint256"
            },
            {
              "indexed": false,
              "internalType": "string",
              "name": "title",
              "type": "string"
            },
            {
              "indexed": false,
              "internalType": "uint256",
              "name": "endTime",
              "type": "uint256"
            }
          ],
          "name": "ProposalCreated",
          "type": "event"
        },
        {
          "anonymous": false,
          "inputs": [
            {
              "indexed": false,
              "internalType": "uint256",
              "name": "proposalId",
              "type": "uint256"
            },
            {
              "indexed": false,
              "internalType": "string",
              "name": "option",
              "type": "string"
            },
            {
              "indexed": false,
              "internalType": "address",
              "name": "voter",
              "type": "address"
            }
          ],
          "name": "Voted",
          "type": "event"
        },
        {
          "inputs": [
            {
              "internalType": "string",
              "name": "_title",
              "type": "string"
            },
            {
              "internalType": "string",
              "name": "_description",
              "type": "string"
            },
            {
              "internalType": "string[]",
              "name": "_options",
              "type": "string[]"
            },
            {
              "internalType": "uint256",
              "name": "_durationMinutes",
              "type": "uint256"
            }
          ],
          "name": "createProposal",
          "outputs": [],
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "uint256",
              "name": "_proposalId",
              "type": "uint256"
            }
          ],
          "name": "getResults",
          "outputs": [
            {
              "internalType": "string[]",
              "name": "",
              "type": "string[]"
            },
            {
              "internalType": "uint256[]",
              "name": "",
              "type": "uint256[]"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [],
          "name": "owner",
          "outputs": [
            {
              "internalType": "address",
              "name": "",
              "type": "address"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [],
          "name": "proposalCount",
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
              "name": "",
              "type": "uint256"
            }
          ],
          "name": "proposals",
          "outputs": [
            {
              "internalType": "uint256",
              "name": "id",
              "type": "uint256"
            },
            {
              "internalType": "string",
              "name": "title",
              "type": "string"
            },
            {
              "internalType": "string",
              "name": "description",
              "type": "string"
            },
            {
              "internalType": "address",
              "name": "creator",
              "type": "address"
            },
            {
              "internalType": "bool",
              "name": "active",
              "type": "bool"
            },
            {
              "internalType": "uint256",
              "name": "endTime",
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
              "name": "_proposalId",
              "type": "uint256"
            },
            {
              "internalType": "string",
              "name": "_option",
              "type": "string"
            }
          ],
          "name": "vote",
          "outputs": [],
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "address",
              "name": "",
              "type": "address"
            },
            {
              "internalType": "uint256",
              "name": "",
              "type": "uint256"
            }
          ],
          "name": "voters",
          "outputs": [
            {
              "internalType": "bool",
              "name": "",
              "type": "bool"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        }
      ];
      
      const votingContract = new ethers.Contract(contractAddress, contractABI, signer);
      setContract(votingContract);

      const ownerAddress = await votingContract.owner();
      setIsOwner(ownerAddress.toLowerCase() === address.toLowerCase());

      await loadProposals(votingContract);
      
    } catch (error) {
      console.error("Wallet connection failed:", error);
      setError('Failed to connect wallet');
    } finally {
      setLoading(false);
    }
  };

  const loadProposals = async (contract) => {
    try {
      setLoading(true);

      const count = Number(await contract.proposalCount());
      const loadedProposals = [];

      for (let i = 0; i < count; i++) {
        const p = await contract.proposals(i);
        const [options] = await contract.getResults(i);

        loadedProposals.push({
          id: Number(p.id),
          title: p.title,
          description: p.description,
          options: options || [],
          active: p.active,
          endTime: Number(p.endTime) * 1000
        });
      }

      setProposals(loadedProposals);

    } catch (error) {
      console.error("Failed to load proposals:", error);
      setError('Failed to load proposals');
      
    } finally {
      setLoading(false);
    }
  };

  const createProposal = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError('');
      const filteredOptions = newProposal.options.filter(opt => opt.trim() !== '');
      
      if (filteredOptions.length < 2) {
        setError('Minimum 2 options required');
        return;
      }

      const tx = await contract.createProposal(
        newProposal.title,
        newProposal.description,
        filteredOptions,
        newProposal.duration
      );
      
      await tx.wait();
      await loadProposals(contract);
      setNewProposal({ title: '', description: '', options: ['', ''], duration: 60 });
    } catch (error) {
      setError('Failed to create proposal');
      console.error("Proposal creation failed:", error);
    } finally {
      setLoading(false);
    }
  };
  

  const handleVote = async (proposalId) => {
    
    try {
      setLoading(true);
      setError('');
      
      const option = selectedOptions[proposalId];
      if (!option) {
        setError('Please select an option before voting');
        return;
      }

      const tx = await contract.vote(proposalId, option);
      await tx.wait();
      
      // Clear selection after successful vote
      setSelectedOptions(prev => {
        const newState = { ...prev };
        delete newState[proposalId];
        return newState;
      });
      
      await loadProposals(contract);
    }  catch (error) {
      if (error.message.includes("Already voted")) {
        setError('You have already voted on this proposal');
      } else if (error.message.includes("Voting period ended")) {
        setError('Voting period has ended for this proposal');
      } else {
        setError('Voting failed: ' + error.message);
      }
      console.error("Voting failed:", error);
    } finally {
      setLoading(false);
    }
    
  };

  // Updated JSX for proposals rendering
  return (
    <Container className="py-5">
      <h1 className="text-center mb-5">Secure Voting System</h1>
      
      {error && <Alert variant="danger" className="mb-4">{error}</Alert>}
      
      {!walletConnected ? (
        <div className="text-center">
          <Button 
            variant="primary" 
            size="lg" 
            onClick={connectWallet}
            disabled={loading}
          >
            {loading ? 'Connecting...' : 'Connect Wallet'}
          </Button>
          <p className="mt-3">Please connect your wallet to interact with the voting system</p>
        </div>
      ) : (
        <Row> 
          <Col md={4}>
            <Card className="mb-4">
              <Card.Header>Wallet Info</Card.Header>
              <Card.Body>
                <p>Connected: {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}</p>
                {isOwner && <span className="badge bg-success">Admin</span>}
              </Card.Body>
            </Card>

            {isOwner && (
              <Card className="mb-4">
                <Card.Header>Create New Proposal</Card.Header>
                <Card.Body>
                  <Form onSubmit={createProposal}>
                    <Form.Group className="mb-3">
                      <Form.Label>Title</Form.Label>
                      <Form.Control 
                        value={newProposal.title}
                        onChange={e => setNewProposal({...newProposal, title: e.target.value})}
                        required
                      />
                    </Form.Group>
                    
                    <Form.Group className="mb-3">
                      <Form.Label>Description</Form.Label>
                      <Form.Control 
                        as="textarea"
                        value={newProposal.description}
                        onChange={e => setNewProposal({...newProposal, description: e.target.value})}
                        required
                      />
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label>Options (minimum 2)</Form.Label>
                      {newProposal.options.map((opt, i) => (
                        <Form.Control
                          key={i}
                          className="mb-2"
                          value={opt}
                          onChange={e => {
                            const newOptions = [...newProposal.options];
                            newOptions[i] = e.target.value;
                            setNewProposal({...newProposal, options: newOptions});
                          }}
                          required={i < 2}
                        />
                      ))}
                      <Button 
                        variant="secondary" 
                        onClick={() => setNewProposal({...newProposal, options: [...newProposal.options, '']})}
                        disabled={newProposal.options.length >= 5}
                      >
                        Add Option
                      </Button>
                    </Form.Group>

                    <Button 
                      variant="primary" 
                      type="submit"
                      disabled={loading}
                    >
                      {loading ? 'Creating...' : 'Create Proposal'}
                    </Button>
                  </Form>
                </Card.Body>
              </Card>
            )}
          </Col>

          <Col md={8}>
            <h3 className="mb-4">Active Proposals</h3>
            {loading ? (
              <div className="text-center">Loading proposals...</div>
            ) : proposals.length === 0 ? (
              <Alert variant="info">No active proposals found</Alert>
            ) : (
              proposals.map(proposal => (
                <Card key={proposal.id} className="mb-3">
                  <Card.Body>
                    <Card.Title>{proposal.title}</Card.Title>
                    <Card.Subtitle className="mb-2 text-muted">
                      {Date.now() > proposal.endTime ? 
                        'Voting closed' : 
                        `Time remaining: ${Math.max(0, Math.floor((proposal.endTime - Date.now())/60000))} minutes`
                      }
                    </Card.Subtitle>
                    <Card.Text>{proposal.description}</Card.Text>
                    
                    <div className="mb-3">
                      {proposal.options?.map((option, i) => (
                        <Button
                          key={i}
                          variant={
                            selectedOptions[proposal.id] === option 
                              ? 'primary' 
                              : 'outline-primary'
                          }
                          className="me-2 mb-2"
                          onClick={() => setSelectedOptions(prev => ({
                            ...prev,
                            [proposal.id]: option
                          }))}
                          disabled={Date.now() > proposal.endTime}
                        >
                          {option}
                        </Button>
                      ))}
                    </div>

                    <Button 
                      variant="success" 
                      onClick={() => handleVote(proposal.id)}
                      disabled={
                        !selectedOptions[proposal.id] || 
                        loading || 
                        Date.now() > proposal.endTime
                      }
                    >
                      {Date.now() > proposal.endTime ? 
                        'Voting Closed' : 
                        (loading ? 'Processing...' : 'Confirm Vote')
                      }
                    </Button>
                  </Card.Body>
                </Card>
              ))
            )}
          </Col>
        </Row>
      )}
    </Container>
  );
}

export default App;
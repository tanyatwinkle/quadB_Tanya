import React, { useState, useEffect } from 'react';
import { voting_system_backend } from '../../declarations/voting_system_backend';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Row, Col, Card, Button, Form, ListGroup, Badge } from 'react-bootstrap';

function App() {
  const [proposals, setProposals] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [options, setOptions] = useState(['', '']);
  const [selectedProposal, setSelectedProposal] = useState(null);
  const [selectedOption, setSelectedOption] = useState('');
  const [voteResults, setVoteResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchProposals();
  }, []);

  async function fetchProposals() {
    try {
      const result = await voting_system_backend.get_all_proposals();
      console.log("Fetched proposals:", result);
      setProposals(result);
    } catch (error) {
      console.error("Error fetching proposals:", error);
      setError("Failed to load proposals. Please try again.");
    }
  }

  async function createProposal(e) {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const filteredOptions = options.filter(opt => opt.trim() !== '');
      if (filteredOptions.length < 2) {
        alert("Please provide at least two options");
        return;
      }
      
      console.log("Creating proposal with options:", filteredOptions);
      const proposalId = await voting_system_backend.create_proposal(title, description, filteredOptions);
      console.log("Created proposal with ID:", proposalId);
      
      setTitle('');
      setDescription('');
      setOptions(['', '']);
      fetchProposals();
    } catch (error) {
      console.error("Error creating proposal:", error);
      setError("Failed to create proposal. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function vote() {
    if (!selectedProposal || !selectedOption) return;
    
    setLoading(true);
    setError('');
    
    try {
      console.log("Voting on proposal:", selectedProposal.id, "for option:", selectedOption);
      // Use vote instead of cast_vote to match the backend implementation
      const result = await voting_system_backend.vote(BigInt(selectedProposal.id), selectedOption);
      console.log("Vote result:", result);
      
      if (result) {
        await fetchVoteResults(selectedProposal.id);
      } else {
        setError("Vote was not recorded. You may have already voted or the proposal is inactive.");
      }
    } catch (error) {
      console.error("Error voting:", error);
      setError("Failed to cast vote. Please try again.");
    } finally {
      setLoading(false);
    }
  }
  

  async function fetchVoteResults(proposalId) {
    try {
      // Convert proposal ID to BigInt for proper handling with Candid
      const results = await voting_system_backend.get_vote_results(BigInt(proposalId));
      console.log("Vote results:", results);
      setVoteResults(results);
    } catch (error) {
      console.error("Error fetching vote results:", error);
      setError("Failed to load voting results.");
    }
  }

  async function endProposal(proposalId) {
    setLoading(true);
    setError('');
    
    try {
      console.log("Ending proposal:", proposalId);
      // Convert proposal ID to BigInt for proper handling with Candid
      const result = await voting_system_backend.end_proposal(BigInt(proposalId));
      console.log("End proposal result:", result);
      
      if (result) {
        await fetchProposals();
        if (selectedProposal && selectedProposal.id === proposalId) {
          // Update the selected proposal to reflect its ended status
          setSelectedProposal({...selectedProposal, active: false});
          await fetchVoteResults(proposalId);
        }
      } else {
        setError("Failed to end proposal. You may not be the creator.");
      }
    } catch (error) {
      console.error("Error ending proposal:", error);
      setError("Failed to end proposal. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  function handleOptionChange(index, value) {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  }

  function addOption() {
    setOptions([...options, '']);
  }

  function selectProposal(proposal) {
    console.log("Selected proposal:", proposal);
    setSelectedProposal(proposal);
    setSelectedOption('');
    setError('');
    fetchVoteResults(proposal.id);
  }

  return (
    <Container className="py-5">
      <h1 className="text-center mb-5">Decentralized Voting System</h1>
      
      {error && (
        <div className="alert alert-danger mb-4" role="alert">
          {error}
        </div>
      )}
      
      <Row>
        <Col md={6}>
          <Card className="mb-4">
            <Card.Header as="h5">Create New Proposal</Card.Header>
            <Card.Body>
              <Form onSubmit={createProposal}>
                <Form.Group className="mb-3">
                  <Form.Label>Title</Form.Label>
                  <Form.Control 
                    type="text" 
                    value={title} 
                    onChange={(e) => setTitle(e.target.value)} 
                    required
                  />
                </Form.Group>
                
                <Form.Group className="mb-3">
                  <Form.Label>Description</Form.Label>
                  <Form.Control 
                    as="textarea" 
                    rows={3} 
                    value={description} 
                    onChange={(e) => setDescription(e.target.value)} 
                    required
                  />
                </Form.Group>
                
                <Form.Group className="mb-3">
                  <Form.Label>Options</Form.Label>
                  {options.map((option, index) => (
                    <Form.Control 
                      key={index}
                      className="mb-2"
                      type="text" 
                      value={option} 
                      onChange={(e) => handleOptionChange(index, e.target.value)} 
                      placeholder={`Option ${index + 1}`}
                      required={index < 2}
                    />
                  ))}
                  <Button variant="secondary" size="sm" onClick={addOption} className="mb-3">
                    Add Option
                  </Button>
                </Form.Group>
                
                <Button variant="primary" type="submit" disabled={loading}>
                  {loading ? 'Creating...' : 'Create Proposal'}
                </Button>
              </Form>
            </Card.Body>
          </Card>
          
          <Card>
            <Card.Header as="h5">All Proposals</Card.Header>
            {proposals.length === 0 ? (
              <Card.Body>
                <p className="text-center text-muted">No proposals yet. Create one to get started!</p>
              </Card.Body>
            ) : (
              <ListGroup variant="flush">
                {proposals.map(proposal => (
                  <ListGroup.Item 
                    key={proposal.id.toString()} 
                    action 
                    onClick={() => selectProposal(proposal)}
                    active={selectedProposal && selectedProposal.id === proposal.id}
                  >
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <h6>{proposal.title}</h6>
                        <small>{proposal.options.length} options</small>
                      </div>
                      <Badge bg={proposal.active ? "success" : "secondary"}>
                        {proposal.active ? "Active" : "Ended"}
                      </Badge>
                    </div>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            )}
          </Card>
        </Col>
        
        <Col md={6}>
          {selectedProposal ? (
            <Card>
              <Card.Header as="h5">{selectedProposal.title}</Card.Header>
              <Card.Body>
                <Card.Text>{selectedProposal.description}</Card.Text>
                
                {selectedProposal.active ? (
                  <Form>
                    <Form.Group className="mb-3">
                      <Form.Label>Cast Your Vote</Form.Label>
                      {selectedProposal.options.map((option, index) => (
                        <Form.Check
                          key={index}
                          type="radio"
                          id={`option-${index}`}
                          label={option}
                          name="voteOption"
                          value={option}
                          onChange={() => setSelectedOption(option)}
                          checked={selectedOption === option}
                        />
                      ))}
                    </Form.Group>
                    
                    <div className="d-flex gap-2 mb-4">
                      <Button 
                        variant="primary" 
                        onClick={vote} 
                        disabled={!selectedOption || loading}
                      >
                        {loading ? 'Voting...' : 'Vote'}
                      </Button>
                      
                      <Button 
                        variant="danger" 
                        onClick={() => endProposal(selectedProposal.id)} 
                        disabled={loading}
                      >
                        {loading ? 'Processing...' : 'End Proposal'}
                      </Button>
                    </div>
                  </Form>
                ) : (
                  <div className="alert alert-info mb-4">
                    This proposal has ended and is no longer accepting votes.
                  </div>
                )}
                
                <h5 className="mt-4">Results</h5>
                {voteResults.length === 0 ? (
                  <p className="text-muted">No votes have been cast yet.</p>
                ) : (
                  <ListGroup>
                    {voteResults.map((result, index) => (
                      <ListGroup.Item key={index} className="d-flex justify-content-between align-items-center">
                        {result.option}
                        <Badge bg="primary" pill>
                          {result.votes.toString()} votes
                        </Badge>
                      </ListGroup.Item>
                    ))}
                  </ListGroup>
                )}
              </Card.Body>
            </Card>
          ) : (
            <Card className="text-center">
              <Card.Body>
                <p className="text-muted mt-4 mb-4">Select a proposal to view details and vote</p>
              </Card.Body>
            </Card>
          )}
        </Col>
      </Row>
    </Container>
  );
}

export default App;

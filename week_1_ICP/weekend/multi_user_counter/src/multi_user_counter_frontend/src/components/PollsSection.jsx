import React, { useState, useEffect } from 'react';
import { multi_user_counter_backend } from '../../../declarations/multi_user_counter_backend';

function PollsSection() {
  const [polls, setPolls] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [votingStatus, setVotingStatus] = useState({});
  const handleResetVote = async (pollId) => {
    try {
      const result = await multi_user_counter_backend.reset_vote(BigInt(pollId));
      if ('Ok' in result) {
        // Show success message
        setVotingStatus(prev => ({ ...prev, [pollId]: 'reset' }));
        // Refresh polls
        fetchPolls();
        
        // Clear message after 3 seconds
        setTimeout(() => {
          setVotingStatus(prev => {
            const newStatus = { ...prev };
            delete newStatus[pollId];
            return newStatus;
          });
        }, 3000);
      } else if ('Err' in result) {
        setVotingStatus(prev => ({ ...prev, [pollId]: `error: ${result.Err}` }));
      }
    } catch (err) {
      console.error("Error resetting vote:", err);
      setVotingStatus(prev => ({ ...prev, [pollId]: `error: ${err.message}` }));
    }
  };
  
  
  useEffect(() => {
    fetchPolls();
    
    // Listen for poll creation events
    window.addEventListener('pollCreated', fetchPolls);
    
    return () => {
      window.removeEventListener('pollCreated', fetchPolls);
    };
  }, []);

  const fetchPolls = async () => {
    setIsLoading(true);
    setError('');
    try {
      const result = await multi_user_counter_backend.get_polls();
      setPolls(result);
    } catch (err) {
      console.error("Error fetching polls:", err);
      setError('Failed to load polls. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVote = async (pollId, optionId) => {
    setVotingStatus(prev => ({ ...prev, [pollId]: 'voting' }));
    try {
      const result = await multi_user_counter_backend.vote(BigInt(pollId), BigInt(optionId));
      if ('Ok' in result) {
        // Update the poll in the local state
        setPolls(polls.map(poll => 
          poll.id === pollId ? result.Ok : poll
        ));
        setVotingStatus(prev => ({ ...prev, [pollId]: 'success' }));
        
        // Clear success message after 3 seconds
        setTimeout(() => {
          setVotingStatus(prev => {
            const newStatus = { ...prev };
            delete newStatus[pollId];
            return newStatus;
          });
        }, 3000);
      } else if ('Err' in result) {
        setVotingStatus(prev => ({ ...prev, [pollId]: `error: ${result.Err}` }));
      }
    } catch (err) {
      console.error("Error voting:", err);
      setVotingStatus(prev => ({ ...prev, [pollId]: `error: ${err.message}` }));
    }
  };

  const calculatePercentage = (votes, totalVotes) => {
    if (totalVotes === 0) return 0;
    return (votes / totalVotes) * 100;
  };

  if (isLoading && polls.length === 0) {
    return (
      <div className="card">
        <div className="card-header">Available Polls</div>
        <div className="card-body text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3">Loading polls...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card">
        <div className="card-header">Available Polls</div>
        <div className="card-body">
          <div className="alert alert-danger">{error}</div>
          <button className="btn btn-outline-primary" onClick={fetchPolls}>
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="card-header d-flex justify-content-between align-items-center">
        <span>Available Polls</span>
        <button 
          className="btn btn-sm btn-outline-primary" 
          onClick={fetchPolls}
          disabled={isLoading}
        >
          {isLoading ? 'Refreshing...' : 'Refresh'}
        </button>
      </div>
      <div className="card-body">
        {polls.length === 0 ? (
          <div className="text-center py-5">
            <p className="text-muted">No polls available. Create one!</p>
          </div>
        ) : (
          <div className="polls-container">
            {polls.map(poll => {
              const totalVotes = poll.options.reduce((sum, opt) => sum + Number(opt.votes), 0);
              
              return (
                <div key={poll.id} className="poll-item mb-4 p-3 border rounded"> 
                {votingStatus[poll.id] === 'reset' && (
                  <div className="alert alert-info py-2">Vote reset successfully!</div>
            )}
                <button 
                className="btn btn-outline-secondary btn-sm"
                onClick={() => handleResetVote(poll.id)}
                > Reset My Vote
                </button>
                

                  <h3 className="h5 mb-3">{poll.name}</h3>
                  <p className="text-muted small">Total votes: {totalVotes}</p>
                  
                  {votingStatus[poll.id] === 'success' && (
                    <div className="alert alert-success py-2">Vote recorded successfully!</div>
                  )}
                  
                  {votingStatus[poll.id] && votingStatus[poll.id].startsWith('error') && (
                    <div className="alert alert-danger py-2">{votingStatus[poll.id].substring(7)}</div>
                  )}
                  
                  <div className="options-list">
                    {poll.options.map(option => {
                      const percentage = calculatePercentage(Number(option.votes), totalVotes);
                      
                      return (
                        <div key={option.id} className="poll-option">
                          <div className="d-flex justify-content-between w-100">
                            <div className="option-label">
                              <label className="form-check-label">
                                <input 
                                  type="radio" 
                                  name={`poll-${poll.id}`} 
                                  className="form-check-input me-2"
                                  onChange={() => handleVote(poll.id, option.id)}
                                  disabled={votingStatus[poll.id] === 'voting'}
                                />
                                {option.name}
                              </label>
                            </div>
                            <div className="option-stats text-end">
                              <span className="badge bg-primary">{Number(option.votes)} votes</span>
                              <span className="ms-2">{percentage.toFixed(1)}%</span>
                            </div>
                          </div>
                          <div 
                            className="poll-option-bar mt-1" 
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default PollsSection;


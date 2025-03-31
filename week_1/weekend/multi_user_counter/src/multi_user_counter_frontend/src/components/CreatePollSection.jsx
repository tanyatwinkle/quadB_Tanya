import React, { useState } from 'react';
import { multi_user_counter_backend } from '../../../declarations/multi_user_counter_backend';

function CreatePollSection() {
  const [pollName, setPollName] = useState('');
  const [options, setOptions] = useState(['', '']);
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState('');

  const handleAddOption = () => {
    setOptions([...options, '']);
  };

  const handleOptionChange = (index, value) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const handleRemoveOption = (index) => {
    if (options.length <= 2) {
      setError('A poll must have at least two options');
      return;
    }
    
    const newOptions = options.filter((_, i) => i !== index);
    setOptions(newOptions);
    setError('');
  };

  const handleCreatePoll = async (e) => {
    e.preventDefault();
    setError('');

    // Validate inputs
    if (!pollName.trim()) {
      setError('Please enter a poll name');
      return;
    }

    const validOptions = options.filter(opt => opt.trim() !== '');
    if (validOptions.length < 2) {
      setError('Please provide at least two valid options');
      return;
    }

    setIsCreating(true);
    try {
      await multi_user_counter_backend.create_poll(pollName, validOptions);
      // Reset form
      setPollName('');
      setOptions(['', '']);
      // Trigger refresh of polls list (you could use a context or prop function here)
      window.dispatchEvent(new CustomEvent('pollCreated'));
    } catch (error) {
      console.error("Error creating poll:", error);
      setError('Failed to create poll. Please try again.');
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="card mb-4">
      <div className="card-header">Create a New Poll</div>
      <div className="card-body">
        {error && <div className="alert alert-danger">{error}</div>}
        
        <form onSubmit={handleCreatePoll}>
          <div className="mb-3">
            <label htmlFor="pollName" className="form-label">Poll Name</label>
            <input
              type="text"
              className="form-control"
              id="pollName"
              value={pollName}
              onChange={(e) => setPollName(e.target.value)}
              placeholder="Enter poll name"
              required
            />
          </div>
          
          <div className="mb-3">
            <label className="form-label">Options</label>
            {options.map((option, index) => (
              <div key={index} className="input-group mb-2">
                <input
                  type="text"
                  className="form-control"
                  value={option}
                  onChange={(e) => handleOptionChange(index, e.target.value)}
                  placeholder={`Option ${index + 1}`}
                  required
                />
                <button 
                  type="button" 
                  className="btn btn-outline-danger"
                  onClick={() => handleRemoveOption(index)}
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
          
          <div className="mb-3">
            <button 
              type="button" 
              className="btn btn-outline-secondary me-2"
              onClick={handleAddOption}
            >
              Add Option
            </button>
            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={isCreating}
            >
              {isCreating ? 'Creating...' : 'Create Poll'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreatePollSection;

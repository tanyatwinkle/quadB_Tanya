import React, { useState, useEffect } from 'react';
import { multi_user_counter_backend } from '../../../declarations/multi_user_counter_backend';

function CounterSection() {
  const [counterValue, setCounterValue] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchCounter();
  }, []);

  const fetchCounter = async () => {
    try {
      const value = await multi_user_counter_backend.get_counter();
      setCounterValue(Number(value));
    } catch (error) {
      console.error("Error fetching counter:", error);
    }
  };

  const handleIncrement = async () => {
    setIsLoading(true);
    try {
      const newValue = await multi_user_counter_backend.increment();
      setCounterValue(Number(newValue));
    } catch (error) {
      console.error("Error incrementing counter:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="card">
      <div className="card-header">Your Personal Counter</div>
      <div className="card-body text-center">
        <div className="counter-value mb-3">{counterValue}</div>
        <button 
          className="btn btn-primary" 
          onClick={handleIncrement}
          disabled={isLoading}
        >
          {isLoading ? 'Processing...' : 'Increment'}
        </button>
      </div>
    </div>
  );
}

export default CounterSection;

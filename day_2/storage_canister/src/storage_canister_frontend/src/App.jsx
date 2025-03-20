// App.jsx
import { useState, useEffect } from 'react';
import { storage_canister_backend } from '/home/tanya/quadB_Tanya/day_2/storage_canister/src/declarations/storage_canister_backend';
import './index.scss';

function App() {
  const [data, setData] = useState('');
  const [storedData, setStoredData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('');

  const fetchData = async () => {
    setLoading(true);
    try {
      const result = await storage_canister_backend.retrieve();
      if (result.length > 0) {
        setStoredData(result[0]);
      } else {
        setStoredData(null);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setStatus(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const storeData = async () => {
    if (!data.trim()) {
      setStatus('Please enter some data to store');
      return;
    }

    setLoading(true);
    setStatus('Storing data...');
    
    try {
      const result = await storage_canister_backend.store(data);
      if (result) {
        setStatus('Data stored successfully!');
        setData('');
        fetchData();
      } else {
        setStatus('Failed to store data');
      }
    } catch (error) {
      console.error("Error storing data:", error);
      setStatus(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const formatDate = (timestamp) => {
    if (!timestamp) return '';
    return new Date(Number(timestamp) / 1000000).toLocaleString();
  };

  return (
    <div className="container">
      <h1>ICP Data Storage</h1>
      
      <div className="card">
        <h2>Store New Data</h2>
        <textarea
          value={data}
          onChange={(e) => setData(e.target.value)}
          placeholder="Enter data to store..."
          disabled={loading}
        />
        <button onClick={storeData} disabled={loading}>
          {loading ? 'Processing...' : 'Store Data'}
        </button>
        {status && <p className="status">{status}</p>}
      </div>

      <div className="card">
        <h2>Retrieved Data</h2>
        {loading ? (
          <p>Loading...</p>
        ) : storedData ? (
          <div className="data-display">
            <p><strong>Content:</strong></p>
            <div className="content-box">{storedData.content}</div>
            <p><strong>Timestamp:</strong> {formatDate(storedData.timestamp)}</p>
          </div>
        ) : (
          <p>No data stored yet</p>
        )}
        <button onClick={fetchData} disabled={loading}>
          Refresh Data
        </button>
      </div>
    </div>
  );
}

export default App;

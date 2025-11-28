import React, { useState } from 'react';

function GreenRouteDemo() {
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleClick = () => {
    setLoading(true);
    setResult(null);
    setError('');

    const url = `http://localhost:8080/route?origin=${origin}&destination=${destination}`;
    fetch(url)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data) => {
        if (data.content.startsWith('Error') || data.content.startsWith('No routes')) {
            setError(data.content);
            setResult(null);
        } else {
            setResult(data);
        }
      })
      .catch((error) => {
        console.error('Error:', error);
        setError('Error fetching data. Is the backend running?');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div>
      <h2>Green Route Demo</h2>
      <p>Find the shortest route by distance to save fuel.</p>
      <div>
        <label htmlFor="origin">Origin:</label>
        <input
          type="text"
          id="origin"
          value={origin}
          onChange={(e) => setOrigin(e.target.value)}
          placeholder="e.g., San Francisco, CA"
        />
      </div>
      <div>
        <label htmlFor="destination">Destination:</label>
        <input
          type="text"
id="destination"
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
          placeholder="e.g., Los Angeles, CA"
        />
      </div>
      <button onClick={handleClick} disabled={loading}>
        {loading ? 'Finding Route...' : 'Get Green Route'}
      </button>
      
      {error && <div style={{ color: 'red', marginTop: '10px' }}>{error}</div>}

      {result && (
        <div id="result" style={{ marginTop: '20px' }}>
          <h3>Best Route Found:</h3>
          <p><strong>Route:</strong> {result.content}</p>
          <p><strong>Distance:</strong> {result.distance}</p>
          <p><strong>Duration:</strong> {result.duration}</p>
          <p><strong>Fuel Used:</strong> {result.fuelUsed}</p>
        </div>
      )}
    </div>
  );
}

export default GreenRouteDemo;

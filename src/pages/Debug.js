// src/pages/Debug.js
import React, { useEffect, useState } from 'react';

const Debug = () => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log("Starting fetch to /api/products...");
    
    fetch('https://celestialcentral.vercel.app/api/products')
      .then((response) => {
        console.log("Response received:", response);
        
        if (!response.ok) {
          throw new Error(`Network response was not ok: ${response.statusText}`);
        }
        return response.json();
      })
      .then((data) => {
        console.log("Data fetched successfully:", data);
        setData(data);
        setError(null); // Clear any previous errors
      })
      .catch((err) => {
        console.error("Fetch error:", err);
        setError(err.message);
        setData(null); // Clear any previous data
      });
  }, []);

  return (
    <div>
      <h1>Debug Page</h1>
      {error ? (
        <div style={{ color: 'red' }}>Error: {error}</div>
      ) : data ? (
        <div>
          <h2>Fetched Data:</h2>
          <pre>{JSON.stringify(data, null, 2)}</pre>
        </div>
      ) : (
        <p>Loading data...</p>
      )}
    </div>
  );
};

export default Debug;

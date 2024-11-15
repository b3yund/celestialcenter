// src/pages/CheckedOut.js
import React, { useEffect, useState, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import fetchData from '../utils/fetchData';
import { AuthContext } from '../AuthContext';

const Checkedout = () => {
    const { isAuthenticated, user } = useContext(AuthContext);
    const [licenses, setLicenses] = useState([]);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const location = useLocation();
  
    const BACKEND_URL = 'https://celestialcentral-835108787508.us-central1.run.app/'; // Replace with deployed backend URL
    const queryParams = new URLSearchParams(location.search);
    const sessionId = queryParams.get('session_id');
  
    useEffect(() => {
      if (!isAuthenticated || !user) {
        navigate('/login');
        return;
      }
  
      if (!sessionId) {
        setError('No session ID found. Unable to verify purchase.');
        return;
      }
  
      const fetchLicenses = async () => {
        try {
          const data = await fetchData(`${BACKEND_URL}/api/licenses/${user.id}`);
          setLicenses(data);
          setError(null);
        } catch (err) {
          console.error('Error fetching licenses:', err);
          setError(err.message);
          setLicenses([]);
        }
      };
      fetchLicenses();
    }, [isAuthenticated, user, navigate, sessionId]);
  
    return (
      <div>
        <h1>Thank you for your purchase!</h1>
        {error ? (
          <div style={{ color: 'red' }}>{error}</div>
        ) : (
          licenses.map((license) => (
            <div key={license.licenseKey}>
              <h2>License Key: {license.licenseKey}</h2>
              <p>Uses Remaining: {license.usesRemaining}</p>
              <h3>Purchased Products:</h3>
              <ul>
                {license.items.map((item) => (
                  <li key={item.productId}>
                    <h4>{item.name}</h4>
                  </li>
                ))}
              </ul>
            </div>
          ))
        )}
      </div>
    );
  };
  

export default Checkedout;

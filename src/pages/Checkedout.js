// src/pages/CheckedOut.js
import React, { useEffect, useState, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import fetchData from '../utils/fetchData';
import { AuthContext } from '../AuthContext';

const Checkedout = () => {
    const { isAuthenticated, user } = useContext(AuthContext);
    const [licenses, setLicenses] = useState([]);
    const [licenseError, setLicenseError] = useState(null);
    const [cartError, setCartError] = useState(null);
    const navigate = useNavigate();
    const location = useLocation();
  
    const BACKEND_URL = 'https://celestialcentral-835108787508.us-central1.run.app'; // Replace with your deployed backend URL
    const queryParams = new URLSearchParams(location.search);
    const sessionId = queryParams.get('session_id');
  
    useEffect(() => {
      // Redirect to login if not authenticated
      if (!isAuthenticated || !user) {
        navigate('/login');
        return;
      }
  
      // Display error if no session ID is found
      {/*if (!sessionId) {
        setLicenseError('No session ID found. Unable to verify purchase.');
        return;
      }*/}
  
      // Function to fetch licenses
      const fetchLicenses = async () => {
        try {
          const data = await fetchData(`${BACKEND_URL}/api/licenses/${user.id}`);
          setLicenses(data);
          setLicenseError(null);
        } catch (err) {
          console.error('Error fetching licenses:', err);
          setLicenseError('Failed to fetch licenses. Please contact support.');
          setLicenses([]);
        }
      };
  
      // Function to clear the cart
      const clearCart = async () => {
        try {
          const response = await fetch(`${BACKEND_URL}/api/cart/clear`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId: user.id }),
          });
  
          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to clear cart');
          }
  
          console.log('Cart successfully cleared');
          setCartError(null);
        } catch (err) {
          console.error('Error clearing cart:', err);
          setCartError('Failed to clear cart. Please contact support.');
        }
      };
  
      // Execute both functions independently
      fetchLicenses();
      clearCart();
    }, [isAuthenticated, user, navigate, sessionId]);
  
    return (
      <div className="checkedout-container" style={styles.container}>
        <h1>Thank you for your purchase!</h1>
        
        {/* Display License Information */}
        {licenseError ? (
          <div className="error-message" style={styles.error}>
            {licenseError}
          </div>
        ) : licenses.length > 0 ? (
          licenses.map((license) => (
            <div key={license.licenseKey} className="license-details" style={styles.license}>
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
        ) : (
          !licenseError && <p>Loading your licenses...</p>
        )}
  
        {/* Display Cart Clearing Status */}
        {cartError ? (
          <div className="error-message" style={styles.error}>
            {cartError}
          </div>
        ) : (
          <div className="success-message" style={styles.success}>
            Your cart has been cleared.
          </div>
        )}
  
        <button
          onClick={() => navigate('/')}
          className="return-home-button"
          style={styles.button}
        >
          Return to Home
        </button>
      </div>
    );
  };
export default Checkedout;
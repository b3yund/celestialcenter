import React, { useEffect, useState, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import fetchData from '../utils/fetchData';
import { AuthContext } from '../AuthContext';

const Checkedout = () => {
  const { isAuthenticated, user } = useContext(AuthContext);
  const [licenses, setLicenses] = useState([]);
  const [licenseError, setLicenseError] = useState(null);
  const [cartError, setCartError] = useState(null);
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();

  const BACKEND_URL = 'https://celestialcentral-835108787508.us-central1.run.app'; // Replace with your deployed backend URL
  const queryParams = new URLSearchParams(location.search);
  const sessionId = queryParams.get('session_id');

  useEffect(() => {
    if (!isAuthenticated || !user) {
      navigate('/login');
      return;
    }

    // Function to fetch licenses
    const fetchLicenses = async () => {
      try {
        const data = await fetchData(`${BACKEND_URL}/api/licenses/${user.id}`);
        setLicenses(data);
        setLicenseError(null);

        // Fetch products for each license
        const productPromises = data.flatMap((license) =>
          license.items.map((item) =>
            fetchData(`${BACKEND_URL}/api/products/${item.productId}`)
          )
        );

        const downloadedProducts = await Promise.all(productPromises);
        setProducts(downloadedProducts);
      } catch (err) {
        console.error('Error fetching licenses or products:', err);
        setLicenseError('Failed to fetch licenses or products. Please contact support.');
        setLicenses([]);
        setProducts([]);
      }
    };

    // Function to clear the cart
    const clearCart = async () => {
      try {
        const data = await fetchData(`${BACKEND_URL}/api/cart/clear`, {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: user.id }),
        });

        console.log('Cart successfully cleared:', data);
        setCartError(null);
      } catch (err) {
        console.error('Error clearing cart:', err.message || err);
        setCartError(err.message || 'Failed to clear cart. Please contact support.');
      }
    };

    // Execute both functions
    fetchLicenses();
    clearCart();
  }, [isAuthenticated, user, navigate, sessionId, BACKEND_URL]);

  return (
    <div className="checkedout-container">
      <h1>Thank you for your purchase!</h1>

      {/* Display License Information */}
      {licenseError ? (
        <div className="error-message" style={{ color: 'red' }}>{licenseError}</div>
      ) : licenses.length > 0 ? (
        licenses.map((license) => (
          <div key={license.licenseKey} className="license-details">
            <h2>License Key: {license.licenseKey}</h2>
            <p>Uses Remaining: {license.usesRemaining}</p>
            <h3>Purchased Products:</h3>
            <ul>
              {license.items.map((item) => (
                <li key={item.productId}>
                  <h4>{item.name}</h4>
                  <a
                    href={`${BACKEND_URL}/api/products/${item.productId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Download {item.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))
      ) : (
        !licenseError && <p>Loading your licenses...</p>
      )}

      {/* Display Cart Clearing Status */}
      {cartError && (
        <div className="error-message" style={{ color: 'red' }}>
          {cartError}
        </div>
      )}

      {!licenseError && !cartError && (
        <div className="success-message" style={{ color: 'green' }}>
          Your cart has been cleared.
        </div>
      )}

      <button onClick={() => navigate('/')} className="return-home-button" style={{ marginTop: '20px' }}>
        Return to Home
      </button>
    </div>
  );
};

export default Checkedout;

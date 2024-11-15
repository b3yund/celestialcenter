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
  
    // Function to fetch the cart and create licenses
    const createLicenses = async () => {
      try {
        // Fetch the cart data
        const cartData = await fetchData(`${BACKEND_URL}/api/cart/${user.id}`);
  
        if (!cartData || cartData.length === 0) {
          console.log('Cart is empty. Skipping license creation.');
          setLicenseError('Your cart is empty. No licenses created.');
          return;
        }
  
        // Create licenses for the cart products
        const licenseResponse = await fetchData(`${BACKEND_URL}/api/licenses`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: user.id, products: cartData }),
        });
  
        console.log('Licenses created successfully:', licenseResponse);
        setLicenseError(null);
  
        // Fetch products for the created licenses
        const productPromises = licenseResponse.licenses.flatMap((license) =>
          license.products.map((product) =>
            fetchData(`${BACKEND_URL}/api/products/${product.id}`)
          )
        );
  
        const downloadedProducts = await Promise.all(productPromises);
        setProducts(downloadedProducts);
      } catch (err) {
        console.error('Error creating licenses or fetching products:', err.message || err);
        setLicenseError('Failed to create licenses or fetch products. Please contact support.');
        setProducts([]);
      }
    };
  
    // Function to clear the cart
    const clearCart = async () => {
      try {
        const clearCartResponse = await fetchData(`${BACKEND_URL}/api/cart/clear`, {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: user.id }),
        });
  
        console.log('Cart successfully cleared:', clearCartResponse);
        setCartError(null);
      } catch (err) {
        console.error('Error clearing cart:', err.message || err);
        setCartError('Failed to clear cart. Please contact support.');
      }
    };
  
    // Execute the license creation first, then clear the cart
    const processCheckout = async () => {
      await createLicenses();
      await clearCart();
    };
  
    processCheckout();
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

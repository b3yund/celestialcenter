import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import fetchData from '../utils/fetchData';
import { AuthContext } from '../AuthContext';
import '../styles/Checkedout.css';

const Checkedout = () => {
  const { isAuthenticated, user } = useContext(AuthContext);
  const [licenses, setLicenses] = useState([]);
  const [licenseError, setLicenseError] = useState(null);
  const [cartError, setCartError] = useState(null);
  const [downloadStatus, setDownloadStatus] = useState({});
  const navigate = useNavigate();
  
  const BACKEND_URL = 'https://celestialcentral-835108787508.us-central1.run.app';

  const downloadProduct = async (productId, productName) => {
    try {
      setDownloadStatus(prev => ({ ...prev, [productId]: 'downloading' }));
      
      const response = await fetch(`${BACKEND_URL}/api/products/${productId}/download`);
      if (!response.ok) throw new Error('Download failed');
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = productName;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      setDownloadStatus(prev => ({ ...prev, [productId]: 'completed' }));
    } catch (error) {
      console.error('Download error:', error);
      setDownloadStatus(prev => ({ ...prev, [productId]: 'failed' }));
    }
  };

  useEffect(() => {
    if (!isAuthenticated || !user) {
      navigate('/login');
      return;
    }

    const createLicensesAndClearCart = async () => {
      try {
        const cartItems = await fetchData(`${BACKEND_URL}/api/cart/${user.id}`);
        if (!cartItems || cartItems.length === 0) {
          setLicenseError('Your cart is empty');
          return;
        }

        const licenseResponse = await fetchData(`${BACKEND_URL}/api/licenses`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: user.id,
            products: cartItems.map(item => ({
              id: item.productId,
              name: item.name,
              quantity: item.quantity
            }))
          })
        });
        console.log('Licenses created:', licenseResponse);

        const userLicenses = await fetchData(`${BACKEND_URL}/api/licenses/${user.id}`);
        console.log('User licenses fetched:', userLicenses);
        setLicenses(userLicenses.licenses);

        // Initialize download status for all products
        const initialStatus = {};
        cartItems.forEach(item => {
          initialStatus[item.productId] = 'pending';
        });
        setDownloadStatus(initialStatus);

        // Clear cart after everything is set up
        await fetchData(`${BACKEND_URL}/api/cart/clear`, {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: user.id })
        });
        console.log('Cart cleared successfully');

      } catch (error) {
        console.error('Checkout process error:', error);
        setLicenseError('Failed to process checkout. Please contact support.');
      }
    };

    createLicensesAndClearCart();
  }, [isAuthenticated, user, navigate, BACKEND_URL]);

  return (
    <div className="checkedout-container">
      <h1>Thank you for your purchase!</h1>

      {licenseError ? (
        <div className="error-message">{licenseError}</div>
      ) : (
        <div className="licenses-container">
          {licenses.map(license => (
            <div key={license.licenseKey} className="license-card">
              <h2>{license.name}</h2>
              <p><strong>License Key:</strong> {license.licenseKey}</p>
              <p><strong>Uses Remaining:</strong> {license.usesRemaining}</p>
              
              {/* Add console log to debug */}
              {console.log('License data:', license)}
              {console.log('Download status:', downloadStatus[license.productId])}

              <button 
                className={`download-button ${downloadStatus[license.productId] || ''}`}
                onClick={() => downloadProduct(license.productId, license.name)}
                disabled={downloadStatus[license.productId] === 'downloading'}
              >
                {downloadStatus[license.productId] === 'downloading' ? 'Downloading...' : 
                 downloadStatus[license.productId] === 'completed' ? 'Downloaded' : 
                 'Download Product'}
              </button>
            </div>
          ))}
        </div>
      )}

      <button className="home-button" onClick={() => navigate('/')}>
        Return Home
      </button>
    </div>
  );
};

export default Checkedout;

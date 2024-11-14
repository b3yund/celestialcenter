// src/pages/Product.js
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../styles/Product.css';

const Product = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [product, setProduct] = useState(null);
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
        setProducts(data);
        setError(null); // Clear any previous errors

        // Find and set the specific product if an ID is provided
        if (id !== undefined) {
          const foundProduct = data.find((p) => p.id === parseInt(id, 10));
          setProduct(foundProduct);
        }
      })
      .catch((err) => {
        console.error("Fetch error:", err);
        setError(err.message);
        setProducts([]); // Clear previous data
        setProduct(null); // Clear selected product
      });
  }, [id]);

  if (error) {
    return <div style={{ color: 'red' }}>Error: {error}</div>;
  }

  if (id === undefined) {
    // Display a list of products if no specific product ID is provided
    return (
      <div className="product-list">
        <h1>Products</h1>
        <ul>
          {products.map((product) => (
            <li key={product.id} onClick={() => navigate(`/product/${product.id}`)}>
              <h2>{product.name}</h2>
              <p>{product.description}</p>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  if (!product) return <div>Product not found</div>;

  // Display individual product details if a specific ID is provided
  return (
    <div className="product-detail">
      <h2>{product.name}</h2>
      <p>{product.description}</p>
      <button onClick={() => navigate('/products')}>Back to Products</button>
    </div>
  );
};

export default Product;

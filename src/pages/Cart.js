// src/pages/Cart.js
import React from 'react';
import products from '../data/products';
import '../styles/Cart.css';

// Mock cart data referencing product IDs and quantities
const cartItems = [
  { productId: 0, quantity: 2 },
  { productId: 1, quantity: 1 },
  { productId: 2, quantity: 3 },
];

const Cart = () => {
  // Calculate total cost of the cart
  const calculateTotal = () => 
    cartItems.reduce((total, item) => {
      const product = products.find((p) => p.id === item.productId);
      return total + (product ? product.price * item.quantity : 0);
    }, 0).toFixed(2);

  return (
    <div className="cart-container">
      <h1>Your Cart</h1>
      {cartItems.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <ul>
          {cartItems.map((item) => {
            const product = products.find((p) => p.id === item.productId);
            if (!product) return null; // Skip if product is not found

            return (
              <li key={product.id}>
                <h2>{product.name}</h2>
                <p>Quantity: {item.quantity}</p>
                <p>Price: ${product.price.toFixed(2)}</p>
                <p>Subtotal: ${(product.price * item.quantity).toFixed(2)}</p>
              </li>
            );
          })}
        </ul>
      )}
      <h3>Total: ${calculateTotal()}</h3>
    </div>
  );
};

export default Cart;

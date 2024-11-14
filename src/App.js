// src/App.js
import React, { useState } from 'react';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { CSSTransition, SwitchTransition } from 'react-transition-group';
import Home from './pages/Home';
import Product from './pages/Product';
import Cart from './pages/Cart';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Debug from './pages/Debug'; // Import Debug component
import BackgroundVideo from './components/BackgroundVideo';
import './styles/App.css';
import './styles/Transitions.css';

const App = () => {
  const location = useLocation();
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Mock authentication state

  return (
    <div className="app-container">
      {/* Persistent Background Video */}
      <BackgroundVideo />

      {/* Transition Group for Page Transitions */}
      <SwitchTransition mode="out-in">
        <CSSTransition
          key={location.pathname} // Unique key for each route
          classNames="fade"       // Base class for transitions
          timeout={{
            enter: 1500, // 1s delay + 0.5s fade-in
            exit: 500,   // 0.5s fade-out
          }}
          unmountOnExit
          appear                   // Apply appear transition on initial load
        >
          <div className="page-content">
            <Routes location={location}>
              <Route path="/" element={<Home />} />
              <Route path="/products" element={<Product />} />
              <Route path="/product/:id" element={<Product />} />
              <Route 
                path="/cart" 
                element={isAuthenticated ? <Cart /> : <Navigate to="/login" replace />} 
              />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/debug" element={<Debug />} />
            </Routes>
          </div>
        </CSSTransition>
      </SwitchTransition>
    </div>
  );
};

export default App;

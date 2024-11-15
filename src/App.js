// src/App.js
import React, { useContext } from 'react';
import { Routes, Route, useLocation, Navigate, HashRouter as Router } from 'react-router-dom';
import { CSSTransition, SwitchTransition } from 'react-transition-group';
import Home from './pages/Home';
import Product from './pages/Product';
import Cart from './pages/Cart';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Checkout from './pages/Checkout';
import Checkedout from './pages/Checkedout';
import Debug from './pages/Debug';
import NotFound from './pages/NotFound'; // Optional: Create a NotFound component for undefined routes
import BackgroundVideo from './components/BackgroundVideo';
import { AuthProvider, AuthContext } from './AuthContext'; // Import AuthContext and AuthProvider
import './styles/App.css';
import './styles/Transitions.css';

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <AnimatedRoutes />
      </Router>
    </AuthProvider>
  );
};

const AnimatedRoutes = () => {
  const location = useLocation();
  const { isAuthenticated } = useContext(AuthContext);

  return (
    <div className="app-container">
      <BackgroundVideo />
      <SwitchTransition mode="out-in">
        <CSSTransition
          key={location.pathname}
          classNames="fade"
          timeout={{ enter: 1500, exit: 500 }}
          unmountOnExit
          appear
        >
          <div className="page-content">
            <Routes location={location}>
              <Route path="/" element={<Home />} />
              <Route path="/products" element={<Product />} />
              <Route path="/product/:id" element={<Product />} />
              <Route
                path="/cart"
                element={
                  isAuthenticated ? <Cart /> : <Navigate to="/login" replace />
                }
              />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/checkedout" element={<Checkedout />} />
              <Route path="/debug" element={<Debug />} />
              <Route path="*" element={<NotFound />} /> {/* Handle undefined routes */}
            </Routes>
          </div>
        </CSSTransition>
      </SwitchTransition>
    </div>
  );
};

export default App;

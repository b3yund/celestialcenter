// src/App.js
import React from 'react';
import {
  BrowserRouter as Router,
  useLocation,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import { CSSTransition, SwitchTransition } from 'react-transition-group';
import Home from './pages/Home';
import Product from './pages/Product';
import Cart from './pages/Cart';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Checkout from './pages/Checkout';
import Checkedout from './pages/Checkedout';
import Debug from './pages/Debug';
import BackgroundVideo from './components/BackgroundVideo';
import { AuthProvider, AuthContext } from './AuthContext'; // Import AuthContext and AuthProvider
import './styles/App.css';
import './styles/Transitions.css';

const AppContent = () => {
  const location = useLocation();

  return (
    <AuthProvider>
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
              <AuthContext.Consumer>
                {({ isAuthenticated }) => (
                  <Routes location={location}>
                    <Route path="/" element={<Home />} />
                    <Route path="/products" element={<Product />} />
                    <Route path="/product/:id" element={<Product />} />
                    <Route path="/cart" element={isAuthenticated ? <Cart /> : <Navigate to="/login" replace />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<Signup />} />
                    <Route path="/checkout" element={<Checkout />} />
                    <Route path="/checkedout" element={<Checkedout />} />
                    <Route path="/debug" element={<Debug />} />
                  </Routes>
                )}
              </AuthContext.Consumer>
            </div>
          </CSSTransition>
        </SwitchTransition>
      </div>
    </AuthProvider>
  );
};

const App = () => (
  <Router basename="/celestialcenter">
    <AppContent />
  </Router>
);
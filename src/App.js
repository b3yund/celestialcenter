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
// ... other imports
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
                    {/* ... other routes */}
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

export default App;

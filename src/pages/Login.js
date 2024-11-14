import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Login.css';

const Login = () => {
  return (
    <div className="login-container">
      <h1>Login</h1>
      <form>
        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input id="email" type="email" placeholder="Enter your email" required />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <input id="password" type="password" placeholder="Enter your password" required />
        </div>
        <button type="submit">Login</button>
      </form>
      <p>
        First time? <Link to="/signup">Create an account</Link>
      </p>
    </div>
  );
};

export default Login;

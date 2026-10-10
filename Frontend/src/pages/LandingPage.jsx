import React from 'react';
import { Link } from 'react-router-dom';
import '../App.css';

const Landing = () => {
  return (
    <div 
      className="center-container" 
      style={{ 
        backgroundImage: `url('https://images.unsplash.com/photo-1617788138017-80ad40651399?q=80&w=1920&auto=format&fit=crop')` // Modern Electric Vehicle (EV) image
      }}
    >
      <div className="overlay"></div>
      
      <div className="card-box">
        <h1 style={{ color: '#1a1a1a', marginBottom: '10px', fontSize: '24px' }}>Welcome to Doc Verification</h1>
        <p style={{ color: '#666', fontSize: '14px', marginBottom: '30px' }}>
          Secure and fast document processing portal for electric vehicle fleet and infrastructure records.
        </p>

        <Link to="/login" className="btn-primary">
          Login to Account
        </Link>

        <Link to="/register" className="btn-secondary">
          Register New Account
        </Link>
      </div>
    </div>
  );
};

export default Landing;
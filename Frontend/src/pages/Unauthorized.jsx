import React from 'react';
import { useNavigate } from 'react-router-dom';

const Unauthorized = () => {
  const navigate = useNavigate();
  const userRole = localStorage.getItem('role');

  const handleGoBack = () => {
    // Send them back to their appropriate dashboard based on their role
    if (userRole === 'admin') {
      navigate('/admin', { replace: true });
    } else if (userRole === 'user') {
      navigate('/dashboard', { replace: true });
    } else {
      navigate('/login', { replace: true });
    }
  };

  return (
    <div style={{ maxWidth: '500px', margin: '80px auto', textAlign: 'center', padding: '20px', border: '1px solid #ff4d4f', borderRadius: '5px' }}>
      <h2 style={{ color: '#ff4d4f' }}>Access Denied</h2>
      <p>Sorry, you do not have the required permissions to view this page.</p>
      <p style={{ color: '#666', fontSize: '14px' }}>
        If you think this is a mistake, please log in with an authorized account.
      </p>

      <button 
        onClick={handleGoBack}
        style={{ marginTop: '15px', padding: '10px 20px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
      >
        Go Back to Home
      </button>
    </div>
  );
};

export default Unauthorized;
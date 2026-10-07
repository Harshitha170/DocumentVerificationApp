import React from 'react';
import { useNavigate } from 'react-router-dom';

const LogoutButton = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // 1. Clear the token and role from localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('role');

    // 2. Redirect the user to the login page and replace history so they can't go back
    navigate('/login', { replace: true });
  };

  return (
    <button 
      onClick={handleLogout} 
      style={{ padding: '8px 16px', backgroundColor: '#ff4d4f', color: '#white', border: 'none', cursor: 'pointer' }}
    >
      Logout
    </button>
  );
};

export default LogoutButton;
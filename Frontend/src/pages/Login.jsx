import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';

const Login = () => {
  const [credentials, setCredentials] = useState({ mobile: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

 const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await API.post('/auth/login', credentials);
      
      // 1. Extract fields correctly from response data
      const token = response.data.token;
      const role = response.data.user?.role;
      const userName = response.data.user?.userName || response.data.user?.name; 
      const customId = response.data.customId || response.data.user?.customId;

      // 2. Store them securely in localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('role', role);
      
      if (userName) {
        localStorage.setItem('userName', userName);
      }
      if (customId) {
        localStorage.setItem('customId', customId);
      }

      // 3. Redirect based on user role
      if (role === 'admin') {
        navigate('/admin', { replace: true });
      } else {
        navigate('/dashboard', { replace: true });
      }

    } catch (err) {
      setError(err.response?.data?.message || "Invalid credentials or server error.");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px', border: '1px solid #ccc' }}>
      <h2>Login to Document Verification</h2>
      
      <form onSubmit={handleLogin}>
        <div style={{ marginBottom: '15px' }}>
          <label>Mobile Number: </label><br />
          <input 
            type="text" 
            name="mobile" 
            value={credentials.mobile} 
            onChange={handleChange} 
            placeholder="Enter your mobile number"
            required 
            style={{ width: '100%', padding: '8px' }}
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label>Password: </label><br />
          <input 
            type="password" 
            name="password" 
            value={credentials.password} 
            onChange={handleChange} 
            required 
            style={{ width: '100%', padding: '8px' }}
          />
        </div>

        {error && <p style={{ color: 'red' }}>{error}</p>}

        <button type="submit" disabled={loading} style={{ width: '100%', padding: '10px' }}>
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </div>
  );
};

export default Login;
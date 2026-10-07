import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../services/api.js';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    mobile: '',
    age: '',
    gender: 'Male',
    password: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      // Calls your backend: POST /api/auth/register
      const response = await API.post('/auth/register', formData);
      setMessage(response.data.message || 'Registration successful! Redirecting to login...');
      
      // Successfully registered — redirect to login page after 1.5 seconds
      setTimeout(() => {
        navigate('/login');
      }, 1500);

    } catch (err) {
      console.error("Registration error:", err);
      setMessage(err.response?.data?.message || 'Registration failed. Please check your details.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '30px auto', padding: '25px', border: '1px solid #ccc', borderRadius: '8px', fontFamily: 'Arial, sans-serif', background: '#fff' }}>
      <h3 style={{ textAlign: 'center', marginBottom: '20px' }}>Register for Document Verification</h3>
      
      <form onSubmit={handleRegister}>
        <div style={{ marginBottom: '12px' }}>
          <label>Full Name / Username:</label><br />
          <input 
            type="text" 
            name="username" 
            value={formData.username} 
            onChange={handleChange} 
            required 
            style={{ width: '100%', padding: '8px', marginTop: '4px', boxSizing: 'border-box' }}
          />
        </div>

        <div style={{ marginBottom: '12px' }}>
          <label>Email (Required):</label><br />
          <input 
            type="email" 
            name="email" 
            value={formData.email} 
            onChange={handleChange} 
            required 
            style={{ width: '100%', padding: '8px', marginTop: '4px', boxSizing: 'border-box' }}
          />
        </div>

        <div style={{ marginBottom: '12px' }}>
          <label>Mobile Number:</label><br />
          <input 
            type="text" 
            name="mobile" 
            value={formData.mobile} 
            onChange={handleChange} 
            required 
            style={{ width: '100%', padding: '8px', marginTop: '4px', boxSizing: 'border-box' }}
          />
        </div>

        <div style={{ marginBottom: '12px' }}>
          <label>Age:</label><br />
          <input 
            type="number" 
            name="age" 
            value={formData.age} 
            onChange={handleChange} 
            style={{ width: '100%', padding: '8px', marginTop: '4px', boxSizing: 'border-box' }}
          />
        </div>

        <div style={{ marginBottom: '12px' }}>
          <label>Gender:</label><br />
          <select 
            name="gender" 
            value={formData.gender} 
            onChange={handleChange} 
            style={{ width: '100%', padding: '8px', marginTop: '4px', boxSizing: 'border-box' }}
          >
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label>Password:</label><br />
          <input 
            type="password" 
            name="password" 
            value={formData.password} 
            onChange={handleChange} 
            required 
            style={{ width: '100%', padding: '8px', marginTop: '4px', boxSizing: 'border-box' }}
          />
        </div>

        {message && (
          <p style={{ color: message.includes('successful') ? 'green' : 'red', fontSize: '14px', textAlign: 'center', marginBottom: '15px' }}>
            {message}
          </p>
        )}

        <button 
          type="submit" 
          disabled={loading} 
          style={{ width: '100%', padding: '10px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
        >
          {loading ? 'Registering...' : 'Register'}
        </button>
      </form>

      <p style={{ marginTop: '20px', textAlign: 'center', fontSize: '14px' }}>
        Already have an account?{' '}
        <Link to="/login" style={{ color: '#007bff', textDecoration: 'underline' }}>
          Login here
        </Link>
      </p>
    </div>
  );
};

export default Register;
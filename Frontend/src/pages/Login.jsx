import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Box, 
  Card, 
  CardContent, 
  TextField, 
  Button, 
  Typography, 
  Alert 
} from '@mui/material';
import API from '../services/api';
import '../App.css';

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
      
      const token = response.data.token;
      const role = response.data.user?.role;
      const userName = response.data.user?.userName || response.data.user?.name; 
      const customId = response.data.customId || response.data.user?.customId;

      localStorage.setItem('token', response.data.token);
      localStorage.setItem('role', response.data.user?.role);
      
      if (userName) localStorage.setItem('userName', userName);
      if (customId) localStorage.setItem('customId', customId);

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
    <Box 
      className="center-container"
      sx={{ 
        backgroundImage: `url('https://images.unsplash.com/photo-1617788138017-80ad40651399?q=80&w=1920&auto=format&fit=crop')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        position: 'relative'
      }}
    >
      <Box className="overlay" sx={{ position: 'absolute', inset: 0, bgcolor: 'rgba(0,0,0,0.5)' }} />

      <Card 
        elevation={6}
        sx={{ 
          position: 'relative', 
          zIndex: 1, 
          maxWidth: 420, 
          width: '100%', 
          p: 4, 
          borderRadius: 3,
          boxShadow: '0 8px 32px rgba(0,0,0,0.2)'
        }}
      >
        <CardContent sx={{ p: 0 }}>
          <Typography variant="h5" fontWeight="bold" align="center" gutterBottom>
            Welcome Back
          </Typography>
          <Typography variant="body2" color="text.secondary" align="center" sx={{ mb: 3 }}>
            Login to access your verification dashboard
          </Typography>
          
          <Box component="form" onSubmit={handleLogin} autoComplete="off" noValidate>
            <TextField
              fullWidth
              label="Mobile Number"
              name="mobile"
              variant="outlined"
              size="small"
              value={credentials.mobile}
              onChange={handleChange}
              required
              sx={{ mb: 2 }}
              inputProps={{ autoComplete: 'off' }}
            />

            <TextField
              fullWidth
              label="Password"
              name="password"
              type="password"
              variant="outlined"
              size="small"
              value={credentials.password}
              onChange={handleChange}
              required
              sx={{ mb: 2 }}
              inputProps={{ autoComplete: 'new-password' }}
            />

            {error && (
              <Alert severity="error" sx={{ mb: 2, fontSize: '13px' }}>
                {error}
              </Alert>
            )}

            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={loading}
              sx={{ mt: 1, mb: 2, py: 1.2, fontWeight: 'bold', textTransform: 'none' }}
            >
              {loading ? 'Logging in...' : 'Login'}
            </Button>
          </Box>

          <Typography variant="body2" align="center" color="text.secondary">
            Don't have an account?{' '}
            <Link to="/register" style={{ color: '#1976d2', textDecoration: 'none', fontWeight: 'bold' }}>
              Register here
            </Link>
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Login;
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Box, 
  Card, 
  CardContent, 
  TextField, 
  Button, 
  Typography, 
  Alert, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem 
} from '@mui/material';
import API from '../services/api';
import '../App.css';

const Register = () => {
  const [formData, setFormData] = useState({
    userName: '',
    mobile: '',
    email: '',
    password: '',
    gender: 'Male'
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await API.post('/auth/register', formData);
      navigate('/login', { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed. Please try again.");
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
        position: 'relative',
        py: 4
      }}
    >
      <Box className="overlay" sx={{ position: 'absolute', inset: 0, bgcolor: 'rgba(0,0,0,0.5)' }} />

      <Card 
        elevation={6}
        sx={{ 
          position: 'relative', 
          zIndex: 1, 
          maxWidth: 440, 
          width: '100%', 
          p: 4, 
          borderRadius: 3,
          boxShadow: '0 8px 32px rgba(0,0,0,0.2)'
        }}
      >
        <CardContent sx={{ p: 0 }}>
          <Typography variant="h5" fontWeight="bold" align="center" gutterBottom>
            Create Account
          </Typography>
          <Typography variant="body2" color="text.secondary" align="center" sx={{ mb: 3 }}>
            Register for the Document Verification Portal
          </Typography>
          
          <Box component="form" onSubmit={handleRegister} autoComplete="off" noValidate>
            <TextField
              fullWidth
              label="Full Name"
              name="userName"
              variant="outlined"
              size="small"
              value={formData.userName}
              onChange={handleChange}
              required
              sx={{ mb: 2 }}
              inputProps={{ autoComplete: 'off' }}
            />

            <TextField
              fullWidth
              label="Mobile Number"
              name="mobile"
              variant="outlined"
              size="small"
              value={formData.mobile}
              onChange={handleChange}
              required
              sx={{ mb: 2 }}
              inputProps={{ autoComplete: 'off' }}
            />

            <TextField
              fullWidth
              label="Email Address"
              name="email"
              type="email"
              variant="outlined"
              size="small"
              value={formData.email}
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
              value={formData.password}
              onChange={handleChange}
              required
              sx={{ mb: 2 }}
              inputProps={{ autoComplete: 'new-password' }}
            />

            <FormControl fullWidth size="small" sx={{ mb: 2 }}>
              <InputLabel id="gender-label">Gender</InputLabel>
              <Select
                labelId="gender-label"
                name="gender"
                value={formData.gender}
                label="Gender"
                onChange={handleChange}
              >
                <MenuItem value="Male">Male</MenuItem>
                <MenuItem value="Female">Female</MenuItem>
                <MenuItem value="Other">Other</MenuItem>
              </Select>
            </FormControl>

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
              {loading ? 'Registering...' : 'Register'}
            </Button>
          </Box>

          <Typography variant="body2" align="center" color="text.secondary">
            Already have an account?{' '}
            <Link to="/login" style={{ color: '#1976d2', textDecoration: 'none', fontWeight: 'bold' }}>
              Login here
            </Link>
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Register;
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Box, 
  Container, 
  Grid, 
  Typography, 
  Paper, 
  Button, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem, 
  Chip, 
  CircularProgress,
  Divider
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import DescriptionIcon from '@mui/icons-material/Description';
import FlashOnIcon from '@mui/icons-material/FlashOn';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import API from '../services/api.js';

const AssetDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [asset, setAsset] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [duration, setDuration] = useState('1week'); // '1week' or '2weeks'

  useEffect(() => {
    const fetchAssetDetails = async () => {
      try {
        const response = await API.get(`/assets/${id}`);
        setAsset(response.data);
      } catch (err) {
        console.error('Error fetching asset details:', err);
        setError(err.response?.data?.message || 'Failed to load asset details.');
      } finally {
        setLoading(false);
      }
    };

    fetchAssetDetails();
  }, [id]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error || !asset) {
    return (
      <Container maxWidth="md" sx={{ mt: 5 }}>
        <Typography color="error" variant="h6" align="center">{error || 'Asset not found.'}</Typography>
        <Box sx={{ textAlign: 'center', mt: 2 }}>
          <Button startIcon={<ArrowBackIcon />} onClick={() => navigate(-1)} variant="outlined">
            Back to Dashboard
          </Button>
        </Box>
      </Container>
    );
  }

  // Calculate pricing based on duration choice
  const rentPrice = duration === '1week' ? 2200 : 4000;
  const isAvailable = asset.status === 'Available';

  // Format file URLs to point to Express backend static path
  const getFullUrl = (path) => {
    if (!path) return '';
    if (path.startsWith('http')) return path;
    return `http://localhost:5000${path.startsWith('/') ? '' : '/'}${path}`;
  };

  const handleRentNow = () => {
    navigate('/payment', {
      state: {
        assetId: asset._id,
        customAssetId: asset.assetId,
        title: asset.title,
        duration: duration === '1week' ? '1 Week' : '2 Weeks',
        amount: rentPrice,
        image: asset.image
      }
    });
  };

  return (
    <Container maxWidth="lg" sx={{ py: 5 }}>
      <Button 
        startIcon={<ArrowBackIcon />} 
        onClick={() => navigate(-1)} 
        sx={{ mb: 3, textTransform: 'none', fontWeight: 'bold' }}
      >
        Back to Dashboard
      </Button>

      <Paper sx={{ p: 4, borderRadius: 3, border: '1px solid #e2e8f0', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
        <Grid container spacing={4}>
          {/* LEFT SIDE: Asset Image */}
          <Grid item xs={12} md={6}>
            <Box 
              sx={{ 
                width: '100%', 
                height: 380, 
                borderRadius: 2, 
                overflow: 'hidden', 
                bgcolor: '#f8fafc',
                border: '1px solid #e2e8f0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <img 
                src={getFullUrl(asset.image)} 
                alt={asset.title} 
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </Box>
          </Grid>

          {/* RIGHT SIDE: Details & Controls */}
          <Grid item xs={12} md={6} sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 'bold' }}>
                  ID: {asset.assetId}
                </Typography>
                <Chip 
                  label={asset.status || 'Available'} 
                  color={isAvailable ? 'success' : 'error'} 
                  size="small" 
                  sx={{ fontWeight: 'bold' }}
                />
              </Box>

              <Typography variant="h5" fontWeight="bold" sx={{ mb: 2, color: '#1e293b' }}>
                {asset.title}
              </Typography>

              <Box sx={{ display: 'flex', gap: 3, mb: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CalendarTodayIcon fontSize="small" color="action" />
                  <Typography variant="body2" color="text.secondary">
                    Manufactured: <strong>{new Date(asset.manufacturedDate).toLocaleDateString()}</strong>
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <FlashOnIcon fontSize="small" color="action" />
                  <Typography variant="body2" color="text.secondary">
                    Battery: <strong>{asset.batteryType}</strong>
                  </Typography>
                </Box>
              </Box>

              <Divider sx={{ my: 2 }} />

              {/* Duration & Price Selector */}
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" fontWeight="bold" sx={{ mb: 1 }}>
                  Select Rental Options
                </Typography>
                <FormControl fullWidth size="small">
                  <InputLabel id="duration-select-label">Rental Duration</InputLabel>
                  <Select
                    labelId="duration-select-label"
                    value={duration}
                    label="Rental Duration"
                    onChange={(e) => setDuration(e.target.value)}
                  >
                    <MenuItem value="1week">1 Week — ₹2,200 INR</MenuItem>
                    <MenuItem value="2weeks">2 Weeks — ₹4,000 INR</MenuItem>
                  </Select>
                </FormControl>
              </Box>

              {/* Price Calculation Display */}
              <Box sx={{ mb: 3, p: 2, bgcolor: '#f1f5f9', borderRadius: 2 }}>
                <Typography variant="caption" color="text.secondary">Total Payable Amount</Typography>
                <Typography variant="h4" fontWeight="bold" color="primary.main">
                  ₹{rentPrice.toLocaleString()} <Typography component="span" variant="body2" color="text.secondary">INR</Typography>
                </Typography>
              </Box>

              {/* View Admin Uploaded Specs/Info Document */}
              {asset.document && (
                <Box sx={{ mb: 3 }}>
                  <Button 
                    href={getFullUrl(asset.document)} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    startIcon={<DescriptionIcon />}
                    variant="outlined" 
                    color="info"
                    size="small"
                    sx={{ textTransform: 'none', fontWeight: 'bold' }}
                  >
                    View Vehicle Documentation / Specs (PDF)
                  </Button>
                </Box>
              )}
            </Box>

            {/* RENT Button */}
            <Button 
              onClick={handleRentNow} 
              disabled={!isAvailable} 
              variant="contained" 
              size="large" 
              fullWidth
              sx={{ py: 1.5, textTransform: 'none', fontWeight: 'bold', fontSize: '1rem', borderRadius: 2 }}
            >
              {isAvailable ? 'RENT NOW' : 'Currently Unavailable'}
            </Button>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default AssetDetailsPage;
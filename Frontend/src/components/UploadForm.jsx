import React, { useState } from 'react';
import { Box, TextField, Button, Typography, Alert } from '@mui/material';
import API from '../services/api.js';

const AdminAssetUpload = ({ onAssetUploaded }) => {
  const [assetId, setAssetId] = useState('');
  const [title, setTitle] = useState('');
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setMessage({ text: 'Please select a file to upload.', type: 'error' });
      return;
    }

    setLoading(true);
    setMessage({ text: '', type: '' });

    const formData = new FormData();
    formData.append('file', file); 
    formData.append('assetId', assetId);
    formData.append('title', title);

    try {
      await API.post('/assets', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      setMessage({ text: 'Asset uploaded successfully!', type: 'success' });
      setAssetId('');
      setTitle('');
      setFile(null);
      
      if (onAssetUploaded) onAssetUploaded();
    } catch (err) {
      setMessage({ text: err.response?.data?.message || 'Failed to upload asset.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
<Box component="form" onSubmit={handleSubmit} sx={{ maxWidth: 500, p: 3, bgcolor: '#fff', borderRadius: 2, border: '1px solid #e2e8f0' }}>
  <Typography variant="h6" fontWeight="bold" gutterBottom>Upload New EV Asset</Typography>
  
  <Box sx={{ mb: 2 }}>
    <TextField 
      fullWidth 
      size="small"
      label="Asset ID (e.g., EV-SPEC-101)" 
      value={assetId} 
      onChange={(e) => setAssetId(e.target.value)} 
      required 
    />
  </Box>

  <Box sx={{ mb: 2 }}>
    <TextField 
      fullWidth 
      size="small"
      label="Title / Description" 
      value={title} 
      onChange={(e) => setTitle(e.target.value)} 
      required 
    />
  </Box>

  <Box sx={{ mb: 2 }}>
    <Typography variant="body2" fontWeight="600" sx={{ mb: 1 }}>Select Document / PDF</Typography>
    <input 
      type="file" 
      onChange={(e) => setFile(e.target.files[0])} 
      required 
    />
  </Box>

  {message.text && (
    <Alert severity={message.type} sx={{ mb: 2 }}>
      {message.text}
    </Alert>
  )}

  <Button type="submit" disabled={loading} variant="contained" fullWidth sx={{ textTransform: 'none', fontWeight: 'bold' }}>
    {loading ? 'Uploading Asset...' : 'Publish Asset'}
  </Button>
</Box>
);
};

export default AdminAssetUpload;
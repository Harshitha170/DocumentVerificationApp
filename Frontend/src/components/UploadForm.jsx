import React, { useState } from 'react';
import API from '../services/api';

const UploadForm = ({ onUploadSuccess }) => {
  const [title, setTitle] = useState('');
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Handle file input changes
  const handleFileChange = (e) => {
    setFile(e.target.files[0]); // Grab the first selected file
  };

  
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setErrorMessage("Please select a file to upload.");
      return;
    }

    setUploading(true);
    setErrorMessage('');

    // Create a FormData object to send binary files alongside text data
    const formData = new FormData();
    formData.append('title', title);
    formData.append('document', file); // 'document' matches the backend upload field name

    try {
      const response = await API.post('/documents/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data', // Tells Axios/Backend to expect a file
        },
      });

      alert("Upload successful!");
      setTitle('');
      setFile(null);
      
      // If the parent dashboard passed a callback function, call it to refresh the list!
      if (onUploadSuccess) {
        onUploadSuccess(response.data);
      }

    } catch (error) {
      setErrorMessage("Upload failed: " + (error.response?.data?.message || error.message));
    } finally {
      setUploading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Document Title: </label>
        <input 
          type="text" 
          placeholder="e.g., ID Proof" 
          value={title} 
          onChange={(e) => setTitle(e.target.value)} 
          required
        />
      </div>

      <div style={{ marginTop: '10px' }}>
        <label>Select File: </label>
        <input 
          type="file" 
          onChange={handleFileChange} 
          accept=".pdf,.jpg,.png"
          required
        />
      </div>

      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}

      <button type="submit" disabled={uploading} style={{ marginTop: '10px' }}>
        {uploading ? 'Uploading...' : 'Submit Document'}
      </button>
    </form>
  );
};

export default UploadForm;
import React, { useState, useRef } from 'react';
import API from '../services/api.js';

const UploadForm = ({ onUploadSuccess }) => {
  const [docType, setDocType] = useState('Aadhar');
  const [file, setFile] = useState(null);
  const [uploadedTypes, setUploadedTypes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  
  // Ref for the file input element to clear it after upload
  const fileInputRef = useRef(null);
  
  // Ref to track the active timeout so we can clear it if a new upload starts
  const timeoutRef = useRef(null);

  const allDocTypes = ['Aadhar', 'Pan', 'DL'];
  const availableOptions = allDocTypes.filter(type => !uploadedTypes.includes(type));

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) {
      alert('Please select a file to upload.');
      return;
    }

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    setLoading(true);
    setMessage('');

    const formData = new FormData();
    formData.append('file', file);
    formData.append('docType', docType);

    try {
      await API.post('/documents/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      setMessage(`${docType} uploaded successfully!`);
      setUploadedTypes([...uploadedTypes, docType]);
      setFile(null);

      // Clear the file input visually in the browser DOM
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      timeoutRef.current = setTimeout(() => {
        setMessage('');
      }, 5000);

      const remaining = availableOptions.filter(t => t !== docType);
      if (remaining.length > 0) {
        setDocType(remaining[0]);
      }

      if (onUploadSuccess) onUploadSuccess();

    } catch (err) {
      setMessage(err.response?.data?.message || 'Upload failed.');
    } finally {
      setLoading(false);
    }
  };

  const isComplete = uploadedTypes.length === 3;

  return (
    <div style={{ maxWidth: '450px', margin: '20px auto', padding: '20px', border: '1px solid #ccc', borderRadius: '5px' }}>
      <h3>Upload Verification Documents</h3>

      {isComplete ? (
        <div style={{ padding: '15px', backgroundColor: '#e6ffed', color: '#27ae60', textAlign: 'center', borderRadius: '4px' }}>
          <strong>All documents uploaded successfully!</strong> Submitted for verification.
        </div>
      ) : (
        <form onSubmit={handleUpload}>
          <div style={{ marginBottom: '15px' }}>
            <label>Select Document Type:</label><br />
            <select 
              value={docType} 
              onChange={(e) => setDocType(e.target.value)} 
              style={{ width: '100%', padding: '8px', marginTop: '5px' }}
            >
              {availableOptions.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label>Select File:</label><br />
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileChange} 
              required 
              style={{ width: '100%', marginTop: '5px' }}
            />
          </div>

          {message && <p style={{ color: message.includes('successfully') ? 'green' : 'red' }}>{message}</p>}

          <button 
            type="submit" 
            disabled={loading} 
            style={{ width: '100%', padding: '10px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px' }}
          >
            {loading ? 'Uploading...' : `Upload ${docType}`}
          </button>
        </form>
      )}

      <div style={{ marginTop: '15px', fontSize: '14px', color: '#666' }}>
        <strong>Uploaded:</strong> {uploadedTypes.length > 0 ? uploadedTypes.join(', ') : 'None yet'} (3 required)
      </div>
    </div>
  );
};

export default UploadForm;
import React, { useState, useEffect } from 'react';
import API from '../services/api.js';
import UploadForm from '../components/UploadForm.jsx';
import LogoutButton from '../components/LogoutButton.jsx';

const UserDashboard = () => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch user-specific documents
  const fetchUserDocuments = async () => {
    try {
      const response = await API.get('/documents/me');
      setDocuments(response.data);
    } catch (error) {
      console.error("Failed to fetch your documents:", error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserDocuments();
  }, []);

  // Automatically refresh the list when a new document is successfully uploaded
  const handleUploadSuccess = (newDoc) => {
    setDocuments((prevDocs) => [newDoc, ...prevDocs]); // Adds the new doc to the top of the list
    
  };

  if (loading) return <p>Loading dashboard...</p>;

  return (
    <div style={{ padding: '20px' }}>
      {/* Top Header Section with Logout */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div>
          <h1>User Dashboard</h1>
          <p style={{ margin: 0 }}>Upload your verification documents and track their approval status.</p>
        </div>
        <LogoutButton />
      </div>

      {/* Upload Section (passing the success callback down) */}
      <div style={{ marginBottom: '30px', border: '1px solid #ccc', padding: '15px' }}>
        <h3>Upload New Document</h3>
        <UploadForm onUploadSuccess={handleUploadSuccess} />
      </div>

      {/* Document History List Section */}
      <div style={{ border: '1px solid #ccc', padding: '15px' }}>
        <h3>Your Uploaded Documents</h3>
        {documents.length === 0 ? (
          <p>No documents uploaded yet.</p>
        ) : (
          <ul>
             {Array.isArray(documents) && documents
  .filter(doc => doc && typeof doc === 'object') //  Filters out undefined, null, or non-object items
  .map((doc) => (
    <div key={doc._id}>
      <h4>{doc.docType}</h4>
      <p>Status: {doc.status}</p>
    </div>
  ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default UserDashboard;
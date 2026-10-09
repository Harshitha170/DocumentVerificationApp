import React, { useState, useEffect } from 'react';
import API from '../services/api.js';
import UploadForm from '../components/UploadForm.jsx';
import LogoutButton from '../components/LogoutButton.jsx';
import Navbar from '../components/Navbar.jsx';

const UserDashboard = () => {
  const [documents, setDocuments] = useState([]);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch both user profile and documents data
  const fetchDashboardData = async () => {
    try {
      // 1. Fetch user profile to get customId and username
      const userRes = await API.get('/users/me');
      setUserProfile(userRes.data);
      
      // Also cache customId in localStorage for quick persistence across refreshes
      if (userRes.data?.customId) {
        localStorage.setItem('customId', userRes.data.customId);
      }

      // 2. Fetch user documents
      const docRes = await API.get('/documents/me');
      setDocuments(docRes.data);
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleUploadSuccess = (newDoc) => {
    // Refresh documents list after a successful upload or update
    fetchDashboardData(); 
  };

  if (loading) return <p>Loading dashboard...</p>;

  // Check if all 3 document types have been uploaded
  const allDocumentsUploaded = ['Aadhaar', 'Pan', 'DL'].every(type => 
    documents.some(doc => doc && doc.docType === type)
  );

  return (
    <div>
      {/* Pass customId and userName down to the Navbar */}
      <Navbar 
        customId={userProfile?.customId || localStorage.getItem('customId')} 
        userName={userProfile?.userName || userProfile?.name || 'User'} 
      />
      
      <div style={{ padding: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div>
            <h1>User Dashboard</h1>
            <p style={{ margin: 0 }}>Upload your verification documents and track their approval status.</p>
          </div>
          <LogoutButton />
        </div>

        {/* Conditional Upload Section or Success Box */}
        {allDocumentsUploaded ? (
          <div style={{ marginBottom: '30px', border: '1px solid #4caf50', padding: '15px', backgroundColor: '#e8f5e9', borderRadius: '4px' }}>
            <h3 style={{ color: '#2e7d32', margin: '0 0 5px 0' }}>All Documents Uploaded!</h3>
            <p style={{ margin: 0 }}>You have successfully submitted all required verification documents. Our team is reviewing them.</p>
          </div>
        ) : (
          <div style={{ marginBottom: '30px', border: '1px solid #ccc', padding: '15px' }}>
            <h3>Upload New Document</h3>
            <UploadForm onUploadSuccess={handleUploadSuccess} />
          </div>
        )}

        {/* Document History List Section */}
        <div style={{ border: '1px solid #ccc', padding: '15px' }}>
          <h3>Your Uploaded Documents</h3>
          {documents.length === 0 ? (
            <p>No documents uploaded yet.</p>
          ) : (
            <ul>
               {Array.isArray(documents) && documents
                .filter(doc => doc && typeof doc === 'object')
                .map((doc) => (
                  <div key={doc._id} style={{ marginBottom: '10px', padding: '8px', borderBottom: '1px solid #eee' }}>
                    <h4>{doc.docType}</h4>
                    <p>Status: <span style={{ fontWeight: 'bold', color: doc.status === 'Approved' ? 'green' : doc.status === 'Rejected' ? 'red' : 'orange' }}>{doc.status}</span></p>
                  </div>
                ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
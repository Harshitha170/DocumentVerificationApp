import React, { useState, useEffect } from 'react';
import API from '../services/api.js';
import LogoutButton from '../components/LogoutButton.jsx';

const AdminDashboard = () => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null); // Track which doc is being updated

  // Fetch pending documents for admin review
  const fetchPendingDocs = async () => {
    try {
      const response = await API.get('/admin/pending-documents');
      setDocuments(response.data);
    } catch (error) {
      console.error("Failed to fetch pending documents:", error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingDocs();
  }, []);

  // Handle Approve / Reject Actions
  const handleUpdateStatus = async (documentId, status) => {
    setActionLoading(documentId);
    try {
      // Assuming your backend endpoint looks like this: /admin/documents/:id/status
      await API.put(`/admin/documents/${documentId}/status`, { status });
      
      // Refresh the list after successful update
      setDocuments(documents.filter(doc => doc._id !== documentId && doc.id !== documentId));
    } catch (error) {
      alert("Failed to update document status: " + (error.response?.data?.message || error.message));
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) return <p>Loading Admin Dashboard...</p>;

  return (
    <div style={{ padding: '20px' }}>
      {/* Top Header Section with Logout */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2>Admin Dashboard - Pending Reviews</h2>
        <LogoutButton />
      </div>

      <hr />

      {/* Documents List Section */}
      {documents.length === 0 ? (
        <p>No pending documents to review.</p>
      ) : (
        documents.map(doc => {
          const docId = doc._id || doc.id;
          return (
            <div key={docId} style={{ marginBottom: '15px', padding: '15px', border: '1px solid #ccc', borderRadius: '5px' }}>
              <p><strong>Document Type:</strong> {doc.docType || doc.title}</p>
              <p><strong>Submitted By:</strong> {doc.userId?.email || 'Unknown User'}</p>
              <p><strong>Status:</strong> {doc.status}</p>
              
              {/* Action Buttons */}
              <div style={{ marginTop: '10px' }}>
                <button 
                  onClick={() => handleUpdateStatus(docId, 'approved')}
                  disabled={actionLoading === docId}
                  style={{ marginRight: '10px', backgroundColor: 'green', color: 'white', padding: '5px 10px', border: 'none', cursor: 'pointer' }}
                >
                  {actionLoading === docId ? 'Processing...' : 'Approve'}
                </button>

                <button 
                  onClick={() => handleUpdateStatus(docId, 'rejected')}
                  disabled={actionLoading === docId}
                  style={{ backgroundColor: 'red', color: 'white', padding: '5px 10px', border: 'none', cursor: 'pointer' }}
                >
                  {actionLoading === docId ? 'Processing...' : 'Reject'}
                </button>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
};

export default AdminDashboard;
import React, { useState, useEffect } from 'react';
import API from '../services/api.js';
import LogoutButton from '../components/LogoutButton.jsx';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchAdminData = async () => {
    try {
      const response = await API.get('/admin/documents');
      setUsers(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      console.error("Failed to fetch admin data:", err);
      setError(err.response?.data?.message || 'Failed to load admin dashboard queue.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const handleStatusUpdate = async (documentId, status, rejectedReason = '') => {
    try {
      await API.patch(`/admin/documents/${documentId}`, { status, rejectedReason });
      alert(`Document marked as ${status}! Email notification sent.`);
      fetchAdminData(); // Refresh list
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update document status.');
    }
  };

  if (loading) return <div style={{ padding: '20px', textAlign: 'center' }}>Loading Admin Dashboard...</div>;

  return (
    <div style={{ maxWidth: '1000px', margin: '20px auto', padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      {/* Top Header Section with Logout */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2>Admin Dashboard - Document Verification Queue</h2>
        <LogoutButton />
      </div>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {users.length === 0 ? (
        <p style={{ textAlign: 'center', color: '#666' }}>No users or documents found to review.</p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px' }}>
          <thead>
            <tr style={{ backgroundColor: '#f8f9fa', borderBottom: '2px solid #dee2e6', textAlign: 'left' }}>
              <th style={{ padding: '12px', border: '1px solid #dee2e6' }}>User Unique ID</th>
              <th style={{ padding: '12px', border: '1px solid #dee2e6' }}>Email</th>
              <th style={{ padding: '12px', border: '1px solid #dee2e6' }}>Mobile</th>
              <th style={{ padding: '12px', border: '1px solid #dee2e6' }}>Documents & Status</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id} style={{ borderBottom: '1px solid #dee2e6' }}>
                <td style={{ padding: '12px', border: '1px solid #dee2e6', fontSize: '13px', wordBreak: 'break-all' }}>
                  {user.customId || user._id}
                </td>
                <td style={{ padding: '12px', border: '1px solid #dee2e6' }}>{user.email}</td>
                <td style={{ padding: '12px', border: '1px solid #dee2e6' }}>{user.mobile}</td>
                <td style={{ padding: '12px', border: '1px solid #dee2e6' }}>
                  {user.documents && user.documents.length > 0 ? (
                    user.documents.map((doc) => (
                      <div key={doc._id} style={{ marginBottom: '10px', padding: '8px', background: '#fdfdfd', border: '1px solid #eee', borderRadius: '4px' }}>
                        <strong>{doc.docType}</strong> — Status: <span style={{ color: doc.status === 'Approved' ? 'green' : doc.status === 'Rejected' ? 'red' : 'orange' }}>{doc.status}</span>
                        <div style={{ marginTop: '5px' }}>
                          <a href={doc.fileUrl} target="_blank" rel="noreferrer" style={{ marginRight: '10px', fontSize: '14px' }}>View File</a>
                          {doc.status === 'Pending' && (
                            <>
                              <button 
                                onClick={() => handleStatusUpdate(doc._id, 'Approved')}
                                style={{ marginRight: '5px', padding: '3px 8px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '3px', cursor: 'pointer' }}
                              >
                                Approve
                              </button>
                              <button 
                                onClick={() => {
                                  const reason = prompt("Enter rejection reason:");
                                  if (reason) handleStatusUpdate(doc._id, 'Rejected', reason);
                                }}
                                style={{ padding: '3px 8px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '3px', cursor: 'pointer' }}
                              >
                                Reject
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <span style={{ color: '#888', fontStyle: 'italic' }}>No documents uploaded yet</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AdminDashboard;
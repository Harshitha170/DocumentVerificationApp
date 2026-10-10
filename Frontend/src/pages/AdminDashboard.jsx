import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api.js';
import LogoutButton from '../components/LogoutButton.jsx';
import '../App.css';

const AdminDashboard = () => {
  const navigate = useNavigate();

  // Instant protection check on component mount/refresh
  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');

    if (!token || role !== 'admin') {
      navigate('/login', { replace: true });
    }
  }, [navigate]);

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('all-docs');

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Asset Management Form State
  const [assetData, setAssetData] = useState({ assetId: '', title: '' });
  const [assetFile, setAssetFile] = useState(null);
  const [assetLoading, setAssetLoading] = useState(false);
  const [assetMessage, setAssetMessage] = useState('');
  const [assets, setAssets] = useState([]);

  const adminName = localStorage.getItem('userName') || 'Admin';

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

  const fetchAssets = async () => {
    try {
      const res = await API.get('/assets');
      setAssets(res.data);
    } catch (err) {
      console.error("Error fetching assets", err);
    }
  };

  useEffect(() => {
    fetchAdminData();
    fetchAssets();
  }, []);

  const handleStatusUpdate = async (documentId, status, rejectedReason = '') => {
    try {
      await API.patch(`/admin/documents/${documentId}`, { status, rejectedReason });
      alert(`Document marked as ${status}! Email notification sent.`);
      fetchAdminData(); 
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update document status.');
    }
  };

  const handleAssetSubmit = async (e) => {
    e.preventDefault();
    setAssetLoading(true);
    setAssetMessage('');

    const formData = new FormData();
    formData.append('assetId', assetData.assetId);
    formData.append('title', assetData.title);
    if (assetFile) {
      formData.append('file', assetFile);
    }

    try {
      await API.post('/assets', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setAssetMessage('Asset uploaded successfully!');
      setAssetData({ assetId: '', title: '' });
      setAssetFile(null);
      fetchAssets();
    } catch (err) {
      setAssetMessage(err.response?.data?.message || 'Failed to upload asset.');
    } finally {
      setAssetLoading(false);
    }
  };

  if (loading) return <div style={{ padding: '20px', textAlign: 'center' }}>Loading Admin Dashboard...</div>;

  const filteredUsers = users.map(user => {
    if (activeTab === 'pending-docs') {
      const pendingDocs = user.documents?.filter(doc => doc.status === 'Pending') || [];
      return { ...user, documents: pendingDocs };
    }
    return user;
  }).filter(user => activeTab !== 'pending-docs' || (user.documents && user.documents.length > 0));

  return (
    <div className="app-layout">
      {/* Sidebar with Hamburger */}
      <div className={`sidebar ${sidebarOpen ? '' : 'closed'}`}>
        <div className="sidebar-header">
          {sidebarOpen && <span>Admin Portal</span>}
          <button className="hamburger-btn" style={{ color: '#fff' }} onClick={() => setSidebarOpen(!sidebarOpen)}>
            ☰
          </button>
        </div>
        <ul className="sidebar-menu">
          <li>
            <a href="#all-docs" onClick={() => setActiveTab('all-docs')} className={`sidebar-item ${activeTab === 'all-docs' ? 'active' : ''}`}>
              📁 {sidebarOpen && 'All Documents'}
            </a>
          </li>
          <li>
            <a href="#pending-docs" onClick={() => setActiveTab('pending-docs')} className={`sidebar-item ${activeTab === 'pending-docs' ? 'active' : ''}`}>
              ⏳ {sidebarOpen && 'Pending Docs'}
            </a>
          </li>
          <li>
            <a href="#assets" onClick={() => setActiveTab('assets')} className={`sidebar-item ${activeTab === 'assets' ? 'active' : ''}`}>
              📦 {sidebarOpen && 'Assets Management'}
            </a>
          </li>
        </ul>
      </div>

      {/* Main Content Area */}
      <div className="main-content">
        <div className="topbar">
        
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <span style={{ fontWeight: '600', color: '#1e293b' }}>👤 {adminName} (Admin)</span>
            <LogoutButton />
          </div>
        </div>

        <div className="content-body">
          {error && <p style={{ color: 'red' }}>{error}</p>}

          {(activeTab === 'all-docs' || activeTab === 'pending-docs') && (
            <div>
              <h2>{activeTab === 'all-docs' ? 'All User Documents Queue' : 'Pending Verification Documents'}</h2>
              <p style={{ color: '#64748b', marginBottom: '20px' }}>Review user submissions and manage approvals or rejections.</p>

              {filteredUsers.length === 0 ? (
                <p style={{ textAlign: 'center', color: '#666', padding: '30px' }}>No documents found to review.</p>
              ) : (
                <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px', background: '#fff' }}>
                  <thead>
                    <tr style={{ backgroundColor: '#f8f9fa', borderBottom: '2px solid #dee2e6', textAlign: 'left' }}>
                      <th style={{ padding: '12px', border: '1px solid #dee2e6' }}>User Unique ID</th>
                      <th style={{ padding: '12px', border: '1px solid #dee2e6' }}>Email</th>
                      <th style={{ padding: '12px', border: '1px solid #dee2e6' }}>Mobile</th>
                      <th style={{ padding: '12px', border: '1px solid #dee2e6' }}>Documents & Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map((user) => (
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
                            <span style={{ color: '#888', fontStyle: 'italic' }}>No documents uploaded</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}

          {activeTab === 'assets' && (
            <div>
              <h2>EV Assets Management</h2>
              <p style={{ color: '#64748b', marginBottom: '20px' }}>Upload vehicle info guides, specs, or images to display on all user dashboards.</p>
              
              <div style={{ background: '#fff', padding: '20px', borderRadius: '8px', border: '1px solid #e2e8f0', maxWidth: '600px', marginBottom: '25px' }}>
                <h3>Add New Asset</h3>
                <form onSubmit={handleAssetSubmit} autoComplete="off">
                  <div style={{ marginBottom: '12px' }}>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '5px' }}>Asset ID</label>
                    <input 
                      type="text" 
                      value={assetData.assetId} 
                      onChange={(e) => setAssetData({ ...assetData, assetId: e.target.value })} 
                      placeholder="e.g. EV-SPEC-01" 
                      required 
                      style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px', boxSizing: 'border-box' }}
                    />
                  </div>
                  <div style={{ marginBottom: '12px' }}>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '5px' }}>Asset Title / Info</label>
                    <input 
                      type="text" 
                      value={assetData.title} 
                      onChange={(e) => setAssetData({ ...assetData, title: e.target.value })} 
                      placeholder="e.g. Fleet Vehicle Compliance Guide" 
                      required 
                      style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px', boxSizing: 'border-box' }}
                    />
                  </div>
                  <div style={{ marginBottom: '15px' }}>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '5px' }}>Upload File (PDF / Image)</label>
                    <input 
                      type="file" 
                      onChange={(e) => setAssetFile(e.target.files[0])} 
                      accept=".pdf,image/*" 
                      required 
                    />
                  </div>
                  {assetMessage && <p style={{ color: assetMessage.includes('success') ? 'green' : 'red', fontSize: '13px' }}>{assetMessage}</p>}
                  <button type="submit" disabled={assetLoading} className="btn-primary" style={{ marginTop: 0 }}>
                    {assetLoading ? 'Uploading Asset...' : 'Upload Asset'}
                  </button>
                </form>
              </div>

              <h3>Published Assets List</h3>
              {assets.length === 0 ? (
                <p style={{ color: '#666' }}>No assets uploaded yet.</p>
              ) : (
                <ul>
                  {assets.map((asset) => (
                    <li key={asset._id} style={{ marginBottom: '8px' }}>
                      <strong>{asset.assetId}</strong>: {asset.title} {asset.fileUrl && <a href={asset.fileUrl} target="_blank" rel="noreferrer">[View]</a>}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
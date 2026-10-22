import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Box, 
  Drawer, 
  Toolbar, 
  Typography, 
  IconButton, 
  List, 
  ListItemButton, 
  ListItemIcon, 
  ListItemText, 
  Paper, 
  Divider,
  Menu,
  MenuItem,
  Avatar,
  Button,
  TextField,
  Alert
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import FolderSharedIcon from '@mui/icons-material/FolderShared';
import DescriptionIcon from '@mui/icons-material/Description';
import AssignmentIcon from '@mui/icons-material/Assignment';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';
import API from '../services/api.js';

const drawerWidth = 260;

const AdminDashboard = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');

    if (!token || role?.toLowerCase() !== 'admin') {
      navigate('/login', { replace: true });
    }
  }, [navigate]);

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('all-docs');

  const [anchorEl, setAnchorEl] = useState(null);
  const openMenu = Boolean(anchorEl);

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Updated Asset Form State
  const [assetData, setAssetData] = useState({ 
    assetId: '', 
    title: '', 
    batteryType: '', 
    manufacturedDate: '', 
    status: 'Available' 
  });
  const [assetImage, setAssetImage] = useState(null);
  const [assetDocument, setAssetDocument] = useState(null);
  const [assetLoading, setAssetLoading] = useState(false);
  const [assetMessage, setAssetMessage] = useState('');
  const [assets, setAssets] = useState([]);

  const [adminName, setAdminName] = useState(localStorage.getItem('userName') || 'Admin');
  const [passwords, setPasswords] = useState({ currentPassword: '', newPassword: '' });
  const [settingsMessage, setSettingsMessage] = useState({ text: '', type: '' });
  const [settingsLoading, setSettingsLoading] = useState(false);

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

  const handleProfileClick = (event) => setAnchorEl(event.currentTarget);
  const handleProfileClose = () => setAnchorEl(null);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login', { replace: true });
  };

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

    if (!assetImage || !assetDocument) {
      setAssetMessage('Please select both an asset image and an asset document.');
      setAssetLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append('assetId', assetData.assetId.trim());
    formData.append('title', assetData.title.trim());
    formData.append('batteryType', assetData.batteryType.trim());
    formData.append('manufacturedDate', assetData.manufacturedDate);
    formData.append('status', assetData.status);
    formData.append('image', assetImage);
    formData.append('document', assetDocument);

    try {
      await API.post('/assets', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setAssetMessage('Asset uploaded successfully!');
      setAssetData({ assetId: '', title: '', batteryType: '', manufacturedDate: '', status: 'Available' });
      setAssetImage(null);
      setAssetDocument(null);
      // Reset HTML file inputs
      e.target.reset();
      fetchAssets();
    } catch (err) {
      setAssetMessage(err.response?.data?.message || 'Failed to upload asset.');
    } finally {
      setAssetLoading(false);
    }
  };

  const handleSettingsUpdate = async (e) => {
    e.preventDefault();
    setSettingsLoading(true);
    setSettingsMessage({ text: '', type: '' });

    try {
      await API.put('/auth/profile', {
        name: adminName,
        currentPassword: passwords.currentPassword || undefined,
        newPassword: passwords.newPassword || undefined
      });
      localStorage.setItem('userName', adminName);
      setSettingsMessage({ text: 'Admin settings updated successfully!', type: 'success' });
      setPasswords({ currentPassword: '', newPassword: '' });
    } catch (err) {
      setSettingsMessage({ text: err.response?.data?.message || 'Failed to update settings.', type: 'error' });
    } finally {
      setSettingsLoading(false);
    }
  };

  if (loading) return <Box sx={{ p: 4, textAlign: 'center' }}><Typography>Loading Admin Dashboard...</Typography></Box>;

  const filteredUsers = users.map(user => {
    if (activeTab === 'pending-docs') {
      const pendingDocs = user.documents?.filter(doc => doc.status === 'Pending') || [];
      return { ...user, documents: pendingDocs };
    }
    return user;
  }).filter(user => activeTab !== 'pending-docs' || (user.documents && user.documents.length > 0));

  return (
    <Box sx={{ display: 'flex', bgcolor: '#f8fafc', minHeight: '100vh' }}>
      <Drawer
        variant="permanent"
        sx={{
          width: sidebarOpen ? drawerWidth : 70,
          flexShrink: 0,
          '& .MuiDrawer-paper': { 
            width: sidebarOpen ? drawerWidth : 70, 
            boxSizing: 'border-box', 
            bgcolor: '#1e293b', 
            color: '#fff',
            transition: 'width 0.3s ease',
            overflowX: 'hidden',
            borderRight: 'none'
          },
        }}
        open={sidebarOpen}
      >
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', px: 2, borderBottom: '1px solid #334155' }}>
          {sidebarOpen && <Typography variant="h6" fontWeight="bold">Admin Portal</Typography>}
          <IconButton sx={{ color: '#fff' }} onClick={() => setSidebarOpen(!sidebarOpen)}>
            <MenuIcon />
          </IconButton>
        </Toolbar>

        <List sx={{ px: 1, mt: 2 }}>
          <ListItemButton 
            selected={activeTab === 'all-docs'}
            onClick={() => setActiveTab('all-docs')}
            sx={{ borderRadius: 2, mb: 1, '&.Mui-selected': { bgcolor: '#334155' } }}
          >
            <ListItemIcon sx={{ color: '#94a3b8', minWidth: 40 }}><DescriptionIcon /></ListItemIcon>
            {sidebarOpen && <ListItemText primary="All Documents" />}
          </ListItemButton>

          <ListItemButton 
            selected={activeTab === 'pending-docs'}
            onClick={() => setActiveTab('pending-docs')}
            sx={{ borderRadius: 2, mb: 1, '&.Mui-selected': { bgcolor: '#334155' } }}
          >
            <ListItemIcon sx={{ color: '#94a3b8', minWidth: 40 }}><AssignmentIcon /></ListItemIcon>
            {sidebarOpen && <ListItemText primary="Pending Docs" />}
          </ListItemButton>

          <ListItemButton 
            selected={activeTab === 'assets'}
            onClick={() => setActiveTab('assets')}
            sx={{ borderRadius: 2, mb: 1, '&.Mui-selected': { bgcolor: '#334155' } }}
          >
            <ListItemIcon sx={{ color: '#94a3b8', minWidth: 40 }}><FolderSharedIcon /></ListItemIcon>
            {sidebarOpen && <ListItemText primary="Assets Management" />}
          </ListItemButton>

          <ListItemButton 
            selected={activeTab === 'admin-settings'}
            onClick={() => setActiveTab('admin-settings')}
            sx={{ borderRadius: 2, '&.Mui-selected': { bgcolor: '#334155' } }}
          >
            <ListItemIcon sx={{ color: '#94a3b8', minWidth: 40 }}><SettingsIcon /></ListItemIcon>
            {sidebarOpen && <ListItemText primary="Admin Settings" />}
          </ListItemButton>
        </List>
      </Drawer>

      <Box component="main" sx={{ flexGrow: 1, p: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', mb: 4 }}>
          <IconButton onClick={handleProfileClick} sx={{ p: 0 }}>
            <Avatar sx={{ bgcolor: '#d32f2f', width: 40, height: 40, fontWeight: 'bold' }}>
              {adminName.charAt(0).toUpperCase()}
            </Avatar>
          </IconButton>

          <Menu
            anchorEl={anchorEl}
            open={openMenu}
            onClose={handleProfileClose}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            slotProps={{
              paper: {
                sx: { width: 220, mt: 1.5, p: 1, boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }
              }
            }}
          >
            <Box sx={{ px: 2, py: 1.5 }}>
              <Typography variant="subtitle1" fontWeight="bold">{adminName}</Typography>
              <Typography variant="caption" color="text.secondary">Role: Administrator</Typography>
            </Box>
            <Divider sx={{ my: 1 }} />
            <MenuItem onClick={() => { setActiveTab('admin-settings'); handleProfileClose(); }} sx={{ gap: 1.5, borderRadius: 1 }}>
              <SettingsIcon fontSize="small" color="action" /> Admin Settings
            </MenuItem>
            <MenuItem onClick={handleLogout} sx={{ gap: 1.5, borderRadius: 1, color: 'error.main' }}>
              <LogoutIcon fontSize="small" color="error" /> Logout
            </MenuItem>
          </Menu>
        </Box>

        <Box>
          {error && <Typography color="error" sx={{ mb: 2 }}>{error}</Typography>}

          {(activeTab === 'all-docs' || activeTab === 'pending-docs') && (
            <Box>
              <Typography variant="h4" fontWeight="bold" gutterBottom>
                {activeTab === 'all-docs' ? 'All User Documents Queue' : 'Pending Verification Documents'}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Review user submissions and manage approvals or rejections.
              </Typography>

              {filteredUsers.length === 0 ? (
                <Paper sx={{ p: 4, textAlign: 'center', borderRadius: 2, border: '1px solid #e2e8f0' }}>
                  <Typography variant="body2" color="text.secondary">No documents found to review.</Typography>
                </Paper>
              ) : (
                <Paper sx={{ p: 3, borderRadius: 2, border: '1px solid #e2e8f0', overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr style={{ backgroundColor: '#f8fafc', borderBottom: '2px solid #e2e8f0', textAlign: 'left' }}>
                        <th style={{ padding: '12px', borderBottom: '1px solid #e2e8f0' }}>User Unique ID</th>
                        <th style={{ padding: '12px', borderBottom: '1px solid #e2e8f0' }}>Email</th>
                        <th style={{ padding: '12px', borderBottom: '1px solid #e2e8f0' }}>Mobile</th>
                        <th style={{ padding: '12px', borderBottom: '1px solid #e2e8f0' }}>Documents & Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredUsers.map((user) => (
                        <tr key={user._id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                          <td style={{ padding: '12px', fontSize: '13px', wordBreak: 'break-all' }}>
                            {user.customId || user._id}
                          </td>
                          <td style={{ padding: '12px' }}>{user.email}</td>
                          <td style={{ padding: '12px' }}>{user.mobile}</td>
                          <td style={{ padding: '12px' }}>
                            {user.documents && user.documents.length > 0 ? (
                              user.documents.map((doc) => (
                                <Box key={doc._id} sx={{ mb: 1.5, p: 1.5, background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 2 }}>
                                  <Typography variant="body2" fontWeight="bold">{doc.docType}</Typography>
                                  <Typography variant="caption" color="text.secondary">Status: {doc.status}</Typography>
                                  <Box sx={{ mt: 1, display: 'flex', gap: 1, alignItems: 'center' }}>
                                    <Button href={doc.fileUrl} target="_blank" rel="noreferrer" size="small" variant="text" sx={{ p: 0, minWidth: 'auto', textTransform: 'none' }}>
                                      View File →
                                    </Button>
                                    {doc.status === 'Pending' && (
                                      <>
                                        <Button 
                                          onClick={() => handleStatusUpdate(doc._id, 'Approved')}
                                          size="small" 
                                          variant="contained" 
                                          color="success"
                                          sx={{ py: 0.5, px: 1.5, minWidth: 'auto', fontSize: '12px' }}
                                        >
                                          Approve
                                        </Button>
                                        <Button 
                                          onClick={() => {
                                            const reason = prompt("Enter rejection reason:");
                                            if (reason) handleStatusUpdate(doc._id, 'Rejected', reason);
                                          }}
                                          size="small" 
                                          variant="contained" 
                                          color="error"
                                          sx={{ py: 0.5, px: 1.5, minWidth: 'auto', fontSize: '12px' }}
                                        >
                                          Reject
                                        </Button>
                                      </>
                                    )}
                                  </Box>
                                </Box>
                              ))
                            ) : (
                              <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>No documents uploaded</Typography>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </Paper>
              )}
            </Box>
          )}

          {activeTab === 'assets' && (
            <Box>
              <Typography variant="h4" fontWeight="bold" gutterBottom>
                EV Assets Management
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Upload vehicle details, specs, images, and documents to display on user dashboards.
              </Typography>
              
              <Paper sx={{ p: 3, mb: 4, borderRadius: 2, border: '1px solid #e2e8f0', maxWidth: 600 }}>
                <Typography variant="h6" fontWeight="bold" gutterBottom>Add New Asset</Typography>
                <form onSubmit={handleAssetSubmit} autoComplete="off">
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" fontWeight="600" sx={{ mb: 1 }}>Asset ID</Typography>
                    <input 
                      type="text" 
                      value={assetData.assetId} 
                      onChange={(e) => setAssetData({ ...assetData, assetId: e.target.value })} 
                      placeholder="e.g. EV-SPEC-01" 
                      required 
                      style={{ width: '100%', padding: '10px', border: '1px solid #cbd5e1', borderRadius: '6px', boxSizing: 'border-box' }}
                    />
                  </Box>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" fontWeight="600" sx={{ mb: 1 }}>Asset Title / Info</Typography>
                    <input 
                      type="text" 
                      value={assetData.title} 
                      onChange={(e) => setAssetData({ ...assetData, title: e.target.value })} 
                      placeholder="e.g. Ather 450X Gen 3" 
                      required 
                      style={{ width: '100%', padding: '10px', border: '1px solid #cbd5e1', borderRadius: '6px', boxSizing: 'border-box' }}
                    />
                  </Box>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" fontWeight="600" sx={{ mb: 1 }}>Battery Type</Typography>
                    <input 
                      type="text" 
                      value={assetData.batteryType} 
                      onChange={(e) => setAssetData({ ...assetData, batteryType: e.target.value })} 
                      placeholder="e.g. Lithium-ion 3.7 kWh" 
                      required 
                      style={{ width: '100%', padding: '10px', border: '1px solid #cbd5e1', borderRadius: '6px', boxSizing: 'border-box' }}
                    />
                  </Box>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" fontWeight="600" sx={{ mb: 1 }}>Manufactured Date</Typography>
                    <input 
                      type="date" 
                      value={assetData.manufacturedDate} 
                      onChange={(e) => setAssetData({ ...assetData, manufacturedDate: e.target.value })} 
                      required 
                      style={{ width: '100%', padding: '10px', border: '1px solid #cbd5e1', borderRadius: '6px', boxSizing: 'border-box' }}
                    />
                  </Box>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" fontWeight="600" sx={{ mb: 1 }}>Availability Status</Typography>
                    <select 
                      value={assetData.status} 
                      onChange={(e) => setAssetData({ ...assetData, status: e.target.value })}
                      style={{ width: '100%', padding: '10px', border: '1px solid #cbd5e1', borderRadius: '6px', boxSizing: 'border-box', backgroundColor: '#fff' }}
                    >
                      <option value="Available">Available</option>
                      <option value="NotAvailable">NotAvailable</option>
                    </select>
                  </Box>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" fontWeight="600" sx={{ mb: 1 }}>Upload Asset Image</Typography>
                    <input 
                      type="file" 
                      onChange={(e) => setAssetImage(e.target.files[0])} 
                      accept="image/*" 
                      required 
                    />
                  </Box>
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="body2" fontWeight="600" sx={{ mb: 1 }}>Upload Vehicle Document (PDF)</Typography>
                    <input 
                      type="file" 
                      onChange={(e) => setAssetDocument(e.target.files[0])} 
                      accept=".pdf,application/pdf" 
                      required 
                    />
                  </Box>
                  {assetMessage && <Typography color={assetMessage.includes('success') ? 'success.main' : 'error.main'} variant="body2" sx={{ mb: 2 }}>{assetMessage}</Typography>}
                  <Button type="submit" disabled={assetLoading} variant="contained" sx={{ textTransform: 'none', fontWeight: 'bold' }}>
                    {assetLoading ? 'Uploading Asset...' : 'Upload Asset'}
                  </Button>
                </form>
              </Paper>

              <Typography variant="h6" fontWeight="bold" gutterBottom>Published Assets List</Typography>
              {assets.length === 0 ? (
                <Typography variant="body2" color="text.secondary">No assets uploaded yet.</Typography>
              ) : (
                <List sx={{ bgcolor: '#fff', borderRadius: 2, border: '1px solid #e2e8f0', p: 2 }}>
                  {assets.map((asset) => {
                    const docPath = asset.document || asset.fileUrl;
                    return (
                      <Box key={asset._id} sx={{ py: 1.5, borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Box>
                          <Typography variant="body2"><strong>{asset.assetId}</strong>: {asset.title}</Typography>
                          <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                            Battery: {asset.batteryType || 'N/A'} | Status: {asset.status || 'Available'}
                          </Typography>
                        </Box>
                        {docPath && (
                          <Button 
                            href={
                              docPath.startsWith('http') 
                                ? docPath 
                                : `http://localhost:5000${docPath.startsWith('/') ? '' : '/'}${docPath}`
                            } 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            variant="text" 
                            size="small"
                            sx={{ textTransform: 'none', fontWeight: 'bold' }}
                          >
                            View Document →
                          </Button>
                        )}
                      </Box>
                    );
                  })}
                </List>
              )}
            </Box>
          )}

          {activeTab === 'admin-settings' && (
            <Box>
              <Typography variant="h4" fontWeight="bold" gutterBottom>
                Admin Settings
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Manage your administrative account details and credentials.
              </Typography>

              <Paper sx={{ p: 4, borderRadius: 2, border: '1px solid #e2e8f0', maxWidth: 600 }}>
                <form onSubmit={handleSettingsUpdate}>
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="body2" fontWeight="600" sx={{ mb: 1 }}>Display Name</Typography>
                    <TextField 
                      fullWidth 
                      size="small"
                      value={adminName} 
                      onChange={(e) => setAdminName(e.target.value)} 
                      required 
                    />
                  </Box>

                  <Divider sx={{ my: 3 }} />

                  <Typography variant="h6" fontWeight="bold" gutterBottom>Change Password</Typography>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" fontWeight="600" sx={{ mb: 1 }}>Current Password</Typography>
                    <TextField 
                      fullWidth 
                      type="password"
                      size="small"
                      value={passwords.currentPassword} 
                      onChange={(e) => setPasswords({ ...passwords, currentPassword: e.target.value })} 
                      placeholder="Enter current password"
                    />
                  </Box>
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="body2" fontWeight="600" sx={{ mb: 1 }}>New Password</Typography>
                    <TextField 
                      fullWidth 
                      type="password"
                      size="small"
                      value={passwords.newPassword} 
                      onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })} 
                      placeholder="Enter new password"
                    />
                  </Box>

                  {settingsMessage.text && (
                    <Alert severity={settingsMessage.type} sx={{ mb: 2 }}>
                      {settingsMessage.text}
                    </Alert>
                  )}

                  <Button type="submit" disabled={settingsLoading} variant="contained" sx={{ textTransform: 'none', fontWeight: 'bold' }}>
                    {settingsLoading ? 'Saving Changes...' : 'Save Settings'}
                  </Button>
                </form>
              </Paper>
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default AdminDashboard;
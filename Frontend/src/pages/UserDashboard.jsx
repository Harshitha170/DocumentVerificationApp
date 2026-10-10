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
  Grid, 
  Card, 
  CardContent, 
  Chip, 
  Divider,
  Menu,
  MenuItem,
  Avatar,
  Button
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import DescriptionIcon from '@mui/icons-material/Description';
import FolderSharedIcon from '@mui/icons-material/FolderShared';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';
import API from '../services/api.js';
import UploadForm from '../components/UploadForm.jsx';

const drawerWidth = 260;

const UserDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('docs');
  
  // Profile Menu Anchor State
  const [anchorEl, setAnchorEl] = useState(null);
  const openMenu = Boolean(anchorEl);

  const [documents, setDocuments] = useState([]);
  const [assets, setAssets] = useState([]);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  const fetchDashboardData = async () => {
    try {
      const userRes = await API.get('/users/me');
      setUserProfile(userRes.data);
      
      if (userRes.data?.customId) {
        localStorage.setItem('customId', userRes.data.customId);
      }
      
      const fetchedName = userRes.data?.userName || userRes.data?.name;
      if (fetchedName && !fetchedName.toLowerCase().includes('admin')) {
        localStorage.setItem('userName', fetchedName);
      }

      const docRes = await API.get('/documents/me');
      setDocuments(docRes.data);

      const assetRes = await API.get('/assets');
      setAssets(assetRes.data);
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Strict username resolution: Prefers database name, ignores admin names and mobile numbers
  const storedName = localStorage.getItem('userName');
  const profileName = userProfile?.userName || userProfile?.name;

  let rawName = 'User';
  if (profileName && !profileName.toLowerCase().includes('admin')) {
    rawName = profileName;
  } else if (storedName && !storedName.toLowerCase().includes('admin')) {
    rawName = storedName;
  }
  const userName = rawName;
  const customId = userProfile?.customId || localStorage.getItem('customId') || 'N/A';

  const handleProfileClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login', { replace: true });
  };

  if (loading) return <Box sx={{ p: 4, textAlign: 'center' }}><Typography>Loading dashboard...</Typography></Box>;

  // Bulletproof case-insensitive check for uploaded documents
  const requiredTypes = ['aadhaar', 'pan', 'dl'];
  const allDocumentsUploaded = requiredTypes.every(reqType => 
    documents.some(doc => {
      if (!doc || !doc.docType) return false;
      const typeStr = doc.docType.toLowerCase().trim();
      if (reqType === 'aadhaar') return typeStr.includes('aadhaar') || typeStr.includes('adhar');
      if (reqType === 'pan') return typeStr.includes('pan');
      if (reqType === 'dl') return typeStr.includes('dl') || typeStr.includes('driving');
      return false;
    })
  );

  return (
    <Box sx={{ display: 'flex', bgcolor: '#f8fafc', minHeight: '100vh' }}>
      
      {/* SIDEBAR WITH HAMBURGER INSIDE HEADER */}
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
          {sidebarOpen && <Typography variant="h6" fontWeight="bold">User Portal</Typography>}
          <IconButton sx={{ color: '#fff' }} onClick={() => setSidebarOpen(!sidebarOpen)}>
            <MenuIcon />
          </IconButton>
        </Toolbar>

        <List sx={{ px: 1, mt: 2 }}>
          <ListItemButton 
            selected={activeTab === 'docs'}
            onClick={() => setActiveTab('docs')}
            sx={{ borderRadius: 2, mb: 1, '&.Mui-selected': { bgcolor: '#334155' } }}
          >
            <ListItemIcon sx={{ color: '#94a3b8', minWidth: 40 }}><DescriptionIcon /></ListItemIcon>
            {sidebarOpen && <ListItemText primary="Uploaded Docs" />}
          </ListItemButton>

          <ListItemButton 
            selected={activeTab === 'assets'}
            onClick={() => setActiveTab('assets')}
            sx={{ borderRadius: 2, '&.Mui-selected': { bgcolor: '#334155' } }}
          >
            <ListItemIcon sx={{ color: '#94a3b8', minWidth: 40 }}><FolderSharedIcon /></ListItemIcon>
            {sidebarOpen && <ListItemText primary="EV Assets" />}
          </ListItemButton>
        </List>
      </Drawer>

      {/* MAIN CONTENT AREA */}
      <Box component="main" sx={{ flexGrow: 1, p: 4 }}>
        
        {/* TOP BAR WITH PROFILE DROPDOWN ICON */}
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', mb: 4 }}>
          <IconButton onClick={handleProfileClick} sx={{ p: 0 }}>
            <Avatar sx={{ bgcolor: '#1976d2', width: 40, height: 40, fontWeight: 'bold' }}>
              {userName.charAt(0).toUpperCase()}
            </Avatar>
          </IconButton>

          {/* USER PROFILE DROPDOWN MENU */}
          <Menu
            anchorEl={anchorEl}
            open={openMenu}
            onClose={handleProfileClose}
            onClick={handleProfileClose}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            PaperProps={{
              sx: { width: 220, mt: 1.5, p: 1, boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }
            }}
          >
            <Box sx={{ px: 2, py: 1.5 }}>
              <Typography variant="subtitle1" fontWeight="bold">{userName}</Typography>
              <Typography variant="caption" color="text.secondary">ID: {customId}</Typography>
            </Box>
            <Divider sx={{ my: 1 }} />
            <MenuItem onClick={() => alert('Profile settings coming soon!')} sx={{ gap: 1.5, borderRadius: 1 }}>
              <SettingsIcon fontSize="small" color="action" /> Profile Settings
            </MenuItem>
            <MenuItem onClick={handleLogout} sx={{ gap: 1.5, borderRadius: 1, color: 'error.main' }}>
              <LogoutIcon fontSize="small" color="error" /> Logout
            </MenuItem>
          </Menu>
        </Box>

        {/* TAB CONTENTS */}
        {activeTab === 'docs' && (
          <Box>
            <Typography variant="h4" fontWeight="bold" gutterBottom>
              Document Verification
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Upload your verification documents and track their approval status.
            </Typography>

            {allDocumentsUploaded ? (
              <Paper sx={{ p: 3, mb: 4, bgcolor: '#e8f5e9', border: '1px solid #4caf50', borderRadius: 2 }}>
                <Typography variant="h6" color="#2e7d32" fontWeight="bold" gutterBottom>
                  All Documents Uploaded!
                </Typography>
                <Typography variant="body2">
                  You have successfully submitted all required verification documents. Our team is reviewing them.
                </Typography>
              </Paper>
            ) : (
              <Paper sx={{ p: 3, mb: 4, borderRadius: 2, border: '1px solid #e2e8f0' }}>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  Upload New Document
                </Typography>
                <UploadForm onUploadSuccess={fetchDashboardData} />
              </Paper>
            )}

            <Paper sx={{ p: 3, borderRadius: 2, border: '1px solid #e2e8f0' }}>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Your Uploaded Documents
              </Typography>
              {documents.length === 0 ? (
                <Typography variant="body2" color="text.secondary">No documents uploaded yet.</Typography>
              ) : (
                documents.filter(doc => doc && typeof doc === 'object').map((doc) => (
                  <Box key={doc._id} sx={{ py: 1.5, borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="subtitle1" fontWeight="500">{doc.docType}</Typography>
                    <Chip 
                      label={doc.status} 
                      size="small" 
                      color={doc.status === 'Approved' ? 'success' : doc.status === 'Rejected' ? 'error' : 'warning'} 
                    />
                  </Box>
                ))
              )}
            </Paper>
          </Box>
        )}

        {activeTab === 'assets' && (
          <Box>
            <Typography variant="h4" fontWeight="bold" gutterBottom>
              EV Assets & Guidelines
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Access official documents, vehicle information specs, and media uploaded by the administrator.
            </Typography>

            {assets.length === 0 ? (
              <Typography variant="body2" color="text.secondary">No assets available right now.</Typography>
            ) : (
              <Grid container spacing={3}>
                {assets.map((asset) => (
                  <Grid item xs={12} sm={6} md={4} key={asset._id}>
                    <Card sx={{ height: '100%', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                      <CardContent>
                        <Chip label={asset.assetId} size="small" sx={{ fontWeight: 'bold', mb: 1 }} />
                        <Typography variant="h6" gutterBottom>{asset.title}</Typography>
                        {asset.fileUrl && (
                          <Button 
                            href={asset.fileUrl} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            variant="text" 
                            size="small"
                            sx={{ mt: 1, textTransform: 'none', fontWeight: 'bold' }}
                          >
                            View / Download File →
                          </Button>
                        )}
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            )}
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default UserDashboard;
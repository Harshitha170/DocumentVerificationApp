import React, { useState } from 'react';
import { AppBar, Toolbar, Avatar, Typography, Menu, MenuItem, Box, Divider } from '@mui/material';

const Navbar = ({ customId }) => {
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);

    const handleAvatarClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    // Grab the stored username from localStorage (fallback to 'User' if it doesn't exist)
    const storedUserName = localStorage.getItem('userName') || 'User';

    return (
        <AppBar position="sticky" sx={{ backgroundColor: '#1976d2' }}>
            <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
                
                {/* Left side */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Typography variant="h6" component="div">
                        Document Verification Portal
                    </Typography>
                    {customId && (
                        <Typography variant="subtitle2" sx={{ backgroundColor: 'rgba(255,255,255,0.2)', padding: '2px 8px', borderRadius: '4px' }}>
                            ID: {customId}
                        </Typography>
                    )}
                </Box>
                
                {/* Right side: Avatar & Dropdown */}
                <Box>
                    <Avatar 
                        onClick={handleAvatarClick} 
                        sx={{ cursor: 'pointer', bgcolor: '#ff5722', fontWeight: 'bold' }}
                    >
                        {storedUserName.charAt(0).toUpperCase()}
                    </Avatar>

                    <Menu
                        anchorEl={anchorEl}
                        open={open}
                        onClose={handleMenuClose}
                        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                    >
                        {/* HERE IS WHERE YOU PUT IT: */}
                        <MenuItem disabled sx={{ opacity: '1 !important', color: '#000', fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>
                            {storedUserName}
                        </MenuItem>
                        <Divider />
                        <MenuItem onClick={handleMenuClose}>Profile Settings</MenuItem>
                        <MenuItem onClick={handleMenuClose}>Logout</MenuItem>
                    </Menu>
                </Box>

            </Toolbar>
        </AppBar>
    );
};

export default Navbar;
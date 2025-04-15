import React from 'react';
import { AppBar, Toolbar, Typography, IconButton, Avatar } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { useAuth } from '../../context/AuthContext';

const AdminAppBar = ({ drawerWidth, handleDrawerToggle }) => {
  const { user } = useAuth();

  return (
    <AppBar
      position="fixed"
      sx={{
        width: { sm: `calc(100% - ${drawerWidth}px)` },
        ml: { sm: `${drawerWidth}px` },
      }}
    >
      <Toolbar>
        <IconButton
          color="inherit"
          aria-label="open drawer"
          edge="start"
          onClick={handleDrawerToggle}
          sx={{ mr: 2, display: { sm: 'none' } }}
        >
          <MenuIcon />
        </IconButton>
        <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
          Admin Dashboard
        </Typography>
        {user && (
          <Avatar sx={{ bgcolor: 'secondary.main' }}>
            {user.name.charAt(0).toUpperCase()}
          </Avatar>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default AdminAppBar;

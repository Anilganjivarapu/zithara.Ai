import React, { useState } from 'react';
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
  CssBaseline,
  IconButton,
  Avatar,
  Tooltip
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  ShoppingCart as ProductsIcon,
  Receipt as OrdersIcon,
  Chat as ChatsIcon,
  Brightness4 as Brightness4Icon,
  Brightness7 as Brightness7Icon,
  Logout as LogoutIcon
} from '@mui/icons-material';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ThemeProvider } from '@mui/material/styles';
import { lightTheme, darkTheme } from '../../theme';

const drawerWidth = 240;

const UserLayout = ({ darkMode, toggleTheme }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const menuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: 'dashboard' },
    { text: 'Products', icon: <ProductsIcon />, path: 'products' },
    { text: 'Orders', icon: <OrdersIcon />, path: 'orders' },
    { text: 'Chat', icon: <ChatsIcon />, path: 'chat' }
  ];

  return (
    <ThemeProvider theme={darkMode ? darkTheme : lightTheme}>
      <Box sx={{ display: 'flex' }}>
        <CssBaseline />
        <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
          <Toolbar>
            <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
              User Dashboard
            </Typography>
            <Tooltip title="Toggle light/dark theme">
              <IconButton color="inherit" onClick={toggleTheme} sx={{ mr: 2 }}>
                {darkMode ? <Brightness7Icon /> : <Brightness4Icon />}
              </IconButton>
            </Tooltip>
            <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
              {user?.name?.charAt(0)}
            </Avatar>
            <Tooltip title="Logout">
              <IconButton color="inherit" onClick={handleLogout}>
                <LogoutIcon />
              </IconButton>
            </Tooltip>
          </Toolbar>
        </AppBar>
        <Drawer
          variant="permanent"
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' },
          }}
        >
          <Toolbar />
          <Box sx={{ overflow: 'auto' }}>
            <List>
              {menuItems.map((item) => (
                <ListItem 
                  button 
                  key={item.text}
                  selected={location.pathname.includes(item.path)}
                  onClick={() => navigate(`/user/${item.path}`)}
                >
                  <ListItemIcon>{item.icon}</ListItemIcon>
                  <ListItemText primary={item.text} />
                </ListItem>
              ))}
            </List>
          </Box>
        </Drawer>
        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
          <Toolbar />
          <Outlet />
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default UserLayout;

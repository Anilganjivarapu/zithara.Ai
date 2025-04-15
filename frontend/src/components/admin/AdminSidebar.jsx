import React from 'react';
import { 
  Drawer, 
  Box, 
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  ShoppingCart as OrdersIcon,
  Chat as ChatIcon,
  Settings as SettingsIcon
} from '@mui/icons-material';
import { Link } from 'react-router-dom';

const drawerWidth = 240;

const AdminSidebar = ({ mobileOpen, handleDrawerToggle }) => {
  const drawer = (
    <Box>
      <Toolbar />
      <Divider />
      <List>
        {[
          { text: 'Dashboard', icon: <DashboardIcon />, path: '/admin/dashboard' },
          { text: 'Users', icon: <PeopleIcon />, path: '/admin/users' },
          { text: 'Orders', icon: <OrdersIcon />, path: '/admin/orders' },
          { text: 'Chats', icon: <ChatIcon />, path: '/admin/chats' },
          { text: 'Settings', icon: <SettingsIcon />, path: '/admin/settings' }
        ].map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton component={Link} to={item.path}>
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <Box
      component="nav"
      sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
    >
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', sm: 'none' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
        }}
      >
        {drawer}
      </Drawer>
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', sm: 'block' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
        }}
        open
      >
        {drawer}
      </Drawer>
    </Box>
  );
};

export default AdminSidebar;

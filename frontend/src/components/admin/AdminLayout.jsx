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
  Divider,
  styled,
  useTheme
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  ShoppingCart as ProductsIcon,
  People as UsersIcon,
  Receipt as OrdersIcon,
  Chat as ChatsIcon,
  Menu as MenuIcon,
  Logout as LogoutIcon
} from '@mui/icons-material';
import { useNavigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const drawerWidth = 280;

const StyledListItem = styled(ListItem)(({ theme, selected }) => ({
  borderRadius: theme.shape.borderRadius,
  margin: theme.spacing(0, 2),
  padding: theme.spacing(1, 2),
  '&.Mui-selected': {
    backgroundColor: theme.palette.primary.light,
    color: theme.palette.primary.main,
    '& .MuiListItemIcon-root': {
      color: theme.palette.primary.main,
    },
  },
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
  },
}));

const AdminLayout = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: 'dashboard' },
    { text: 'Products', icon: <ProductsIcon />, path: 'products' },
    { text: 'Orders', icon: <OrdersIcon />, path: 'orders' },
    { text: 'Users', icon: <UsersIcon />, path: 'users' },
    { text: 'Chats', icon: <ChatsIcon />, path: 'chats' }
  ];

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleLogout = async () => {
    await logout(navigate);
  };

  const drawer = (
    <Box sx={{ 
      display: 'flex',
      flexDirection: 'column',
      height: '100%'
    }}>
      <Toolbar sx={{ 
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 3,
        bgcolor: 'primary.main',
        color: 'primary.contrastText'
      }}>
        <Typography variant="h6" noWrap fontWeight="bold">
          Admin Dashboard
        </Typography>
      </Toolbar>
      <Divider />
      <List>
        {menuItems.map((item) => (
          <StyledListItem 
            button 
            key={item.text}
            selected={location.pathname.includes(item.path)}
            onClick={() => navigate(`/admin/${item.path}`)}
          >
            <ListItemIcon>
              {item.icon}
            </ListItemIcon>
            <ListItemText 
              primary={item.text} 
              primaryTypographyProps={{ fontWeight: 'medium' }}
            />
          </StyledListItem>
        ))}
      </List>
      <Box sx={{ mt: 'auto', p: 2 }}>
        <Divider />
        <StyledListItem button onClick={handleLogout}>
          <ListItemIcon>
            <LogoutIcon />
          </ListItemIcon>
          <ListItemText 
            primary="Logout" 
            primaryTypographyProps={{ fontWeight: 'medium' }}
          />
        </StyledListItem>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
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
          <Box sx={{ 
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '100%'
          }}>
            <Typography variant="h6" noWrap>
              {menuItems.find(item => 
                location.pathname.includes(item.path)
              )?.text || 'Dashboard'}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Avatar sx={{ 
                width: 32, 
                height: 32,
                mr: 1,
                bgcolor: 'primary.main'
              }}>
                {user?.name?.charAt(0)}
              </Avatar>
              <Typography variant="body2">
                {user?.name}
              </Typography>
            </Box>
          </Box>
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
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
      <Box
        component="main"
        sx={{ 
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          mt: 8
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
};

export default AdminLayout;

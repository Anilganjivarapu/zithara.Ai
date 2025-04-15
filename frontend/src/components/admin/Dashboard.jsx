import React from 'react';
import { Box, Typography, Grid } from '@mui/material';
import StatCards from './StatCards';
import ProductStats from './ProductStats';
import UserList from './UserList';
import RecentOrders from './RecentOrders';
import RecentChats from './RecentChats';

const Dashboard = () => {
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Admin Dashboard
      </Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <StatCards />
          <ProductStats />
        </Grid>
        <Grid item xs={12} md={6}>
          <UserList />
          <RecentOrders />
          <RecentChats />
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;

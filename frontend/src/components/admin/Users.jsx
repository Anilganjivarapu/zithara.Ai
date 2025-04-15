import React from 'react';
import { Box, Typography } from '@mui/material';
import UserList from './UserList';

const Users = () => {
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        User Management
      </Typography>
      <UserList />
    </Box>
  );
};

export default Users;

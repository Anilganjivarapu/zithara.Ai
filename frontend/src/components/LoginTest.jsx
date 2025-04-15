import React from 'react';
import { Box, Button, Typography } from '@mui/material';

const LoginTest = () => {
  console.log('LoginTest component rendering');
  return (
    <Box sx={{ 
      width: '100%',
      height: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'lightblue'
    }}>
      <Typography variant="h4" sx={{ color: 'red' }}>
        LOGIN TEST COMPONENT
      </Typography>
    </Box>
  );
};

export default LoginTest;

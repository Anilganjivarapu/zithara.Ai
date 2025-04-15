import React from 'react';
import { Typography, Box } from '@mui/material';

const TestRender = () => {
  return (
    <Box sx={{ p: 4, backgroundColor: 'red', color: 'white' }}>
      <Typography variant="h4">TEST COMPONENT VISIBLE</Typography>
    </Box>
  );
};

export default TestRender;

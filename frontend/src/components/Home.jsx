import React from 'react';
import { Typography, Button, Container } from '@mui/material';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <Container maxWidth="sm" sx={{ py: 8, textAlign: 'center' }}>
      <Typography variant="h3" gutterBottom>
        Welcome to the Admin Dashboard
      </Typography>
      <Button 
        variant="contained" 
        component={Link} 
        to="/login"
        sx={{ mt: 3 }}
      >
        Login
      </Button>
    </Container>
  );
};

export default Home;

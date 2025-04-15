import { Outlet } from 'react-router-dom';
import { Box, Container } from '@mui/material';

const AuthLayout = () => {
  console.log('AuthLayout rendering'); // Debug log
  return (
    <Container maxWidth="sm" sx={{ border: '2px solid green' }}>
      <Box sx={{ py: 8, border: '2px solid yellow' }}>
        <Outlet />
      </Box>
    </Container>
  );
};

export default AuthLayout;

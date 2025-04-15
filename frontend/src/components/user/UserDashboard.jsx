import React from 'react';
import { 
  Box, 
  Typography, 
  Grid,
  Card,
  CardContent,
  Avatar
} from '@mui/material';
import {
  Chat as ChatIcon,
  ShoppingCart as ProductsIcon,
  Receipt as OrdersIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const UserDashboard = () => {
  const navigate = useNavigate();

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        My Dashboard
      </Typography>
      
      <Grid container spacing={3} sx={{ mt: 2 }}>
        {[
          { 
            title: 'Chat', 
            description: 'Connect with support',
            icon: <ChatIcon fontSize="large" />,
            path: 'chat',
            color: 'primary.main'
          },
          { 
            title: 'My Orders', 
            description: 'View order history',
            icon: <OrdersIcon fontSize="large" />,
            path: 'orders',
            color: 'secondary.main'
          },
          { 
            title: 'Products', 
            description: 'Browse products',
            icon: <ProductsIcon fontSize="large" />,
            path: 'products',
            color: 'info.main'
          }
        ].map((item) => (
          <Grid item xs={12} sm={6} md={4} key={item.title}>
            <Card 
              sx={{ 
                height: '100%',
                cursor: 'pointer',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  transition: 'all 0.3s ease'
                }
              }}
              onClick={() => navigate(`/user/${item.path}`)}
            >
              <CardContent>
                <Avatar sx={{ 
                  bgcolor: item.color,
                  mb: 2,
                  width: 56, 
                  height: 56
                }}>
                  {item.icon}
                </Avatar>
                <Typography variant="h6" gutterBottom>
                  {item.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {item.description}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default UserDashboard;

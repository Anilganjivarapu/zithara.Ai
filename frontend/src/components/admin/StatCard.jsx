import React from 'react';
import { Box, Typography, Paper, useTheme } from '@mui/material';

const StatCard = ({ title, value, icon, color }) => {
  const theme = useTheme();

  return (
    <Paper sx={{ 
      p: 3,
      height: '100%',
      borderLeft: `4px solid ${color}`,
      transition: 'transform 0.2s',
      '&:hover': {
        transform: 'translateY(-4px)'
      }
    }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Box>
          <Typography 
            variant="subtitle2" 
            color="text.secondary"
            sx={{ mb: 1 }}
          >
            {title}
          </Typography>
          <Typography variant="h4" sx={{ fontWeight: 700 }}>
            {value}
          </Typography>
        </Box>
        <Box sx={{
          width: 48,
          height: 48,
          borderRadius: '50%',
          bgcolor: color + '20',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: color
        }}>
          {icon}
        </Box>
      </Box>
    </Paper>
  );
};

export default StatCard;

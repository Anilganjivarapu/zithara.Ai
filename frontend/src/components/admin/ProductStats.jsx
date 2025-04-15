import React, { useState, useEffect } from 'react';
import { 
  Card,
  CardHeader,
  CardContent,
  Typography,
  Box,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  Divider
} from '@mui/material';
import axiosInstance from '../../components/axiosInstance';

const ProductStats = () => {
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axiosInstance.get('/api/admin/products/stats');
        setStats(response.data);
      } catch (error) {
        console.error('Error fetching product stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" p={3}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Card>
      <CardHeader 
        title="Product Statistics"
        titleTypographyProps={{ variant: 'h6' }}
      />
      <CardContent>
        <List>
          {stats.map((stat, index) => (
            <React.Fragment key={stat._id}>
              <ListItem>
                <ListItemText
                  primary={stat._id}
                  secondary={
                    <>
                      <Typography component="span" variant="body2">
                        {stat.count} products
                      </Typography>
                      <br />
                      <Typography component="span" variant="body2">
                        Total value: ${stat.totalValue.toFixed(2)}
                      </Typography>
                    </>
                  }
                />
              </ListItem>
              {index < stats.length - 1 && <Divider />}
            </React.Fragment>
          ))}
        </List>
      </CardContent>
    </Card>
  );
};

export default ProductStats;

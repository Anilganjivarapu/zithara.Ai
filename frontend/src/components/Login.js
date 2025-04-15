import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axiosInstance from '../components/axiosInstance';
import { useAuth } from '../context/AuthContext';
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  TextField,
  Typography,
  InputAdornment,
  IconButton,
  Alert
} from '@mui/material';
import {
  Person as PersonIcon,
  Lock as LockIcon,
  Visibility,
  VisibilityOff
} from '@mui/icons-material';

const Login = () => {
  console.log('Login component mounting'); // Debug log
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  // Temporarily disabled auto-redirect for debugging
  // useEffect(() => {
  //   const token = localStorage.getItem('token');
  //   if (token) {
  //     navigate('/dashboard');
  //   }
  // }, [navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation(); // Add this to prevent event bubbling
    setError('');
    
    setLoading(true);

    try {
      // Debug: Log the login data being sent
      console.log('Login data being sent:', {
        email: String(formData.email),
        password: String(formData.password)
      });
      
      const loginData = {
        email: String(formData.email),
        password: String(formData.password)
      };
      
      // Debug: Log the full request details
      console.log('Making request to:', axiosInstance.defaults.baseURL + '/api/auth/login');
      
      const response = await axiosInstance.post('/api/auth/login', loginData);
      
      // Debug: Log the full response
      console.log('Login response:', response);
      
      if (response.data?.success) {
        const { user, token } = response.data;
        
        if (!user || !token) {
          throw new Error('Invalid response format');
        }

        await login({
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          token
        });

        // Redirect based on role
        const redirectPath = user.role === 'admin' 
          ? '/admin/dashboard' 
          : '/user/dashboard';
        navigate(redirectPath);
      } else {
        setError(response.data.message || 'Login failed');
      }
    } catch (err) {
      console.error('Login error:', err);
      const errorData = err.response?.data || {};
      let errorMessage = 'Login failed. Please try again.';
      
      if (errorData.errorType === 'email') {
        errorMessage = 'No account found with this email address';
      } else if (errorData.message) {
        errorMessage = errorData.message;
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ py: 8 }}>
      <Card elevation={3}>
        <CardContent>
          <Typography variant="h4" component="h1" align="center" gutterBottom>
            Sign in to your account
          </Typography>
          
          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          <Box 
            component="form" 
            onSubmit={handleSubmit} 
            sx={{ mt: 2 }}
            noValidate
          >
            <TextField
              fullWidth
              margin="normal"
              label="Email"
              name="email"
              type="email"
              autoComplete="email"
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PersonIcon />
                  </InputAdornment>
                ),
              }}
              placeholder="Email address"
              value={formData.email}
              onChange={handleChange}
            />
            
            <TextField
              fullWidth
              margin="normal"
              label="Password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockIcon />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
            />

            <Button
              fullWidth
              variant="contained"
              type="button"
              disabled={loading}
              sx={{ mt: 3, mb: 2, py: 1.5 }}
              onClick={handleSubmit}
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </Button>

            <Typography variant="body2" align="center">
              Don't have an account?{' '}
              <Link to="/register" style={{ textDecoration: 'none' }}>
                Sign up
              </Link>
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
};

export default Login;
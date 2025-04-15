import React, { useState } from 'react';
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
  MenuItem,
  Alert,
  CircularProgress,
  Grid,
  Divider
} from '@mui/material';
import {
  Person as PersonIcon,
  Email as EmailIcon,
  Lock as LockIcon,
  Visibility,
  VisibilityOff,
  Badge as BadgeIcon
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import axiosInstance from '../components/axiosInstance';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'user',
    showPassword: false
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (prop) => (e) => {
    setFormData({ ...formData, [prop]: e.target.value });
    setError('');
  };

  const validateForm = () => {
    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
      setError('All fields are required');
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const response = await axiosInstance.post('/api/auth/register', {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role
      });
      
      if (response.data.success) {
        setSuccess('Registration successful! Redirecting...');
        await login({
          id: response.data.user._id,
          name: response.data.user.name,
          email: response.data.user.email,
          role: response.data.user.role,
          token: response.data.token
        });
        setTimeout(() => navigate('/dashboard'), 1500);
      } else {
        setError(response.data.message || 'Registration failed');
      }
    } catch (err) {
      console.error('Registration error:', err);
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
      <Card elevation={3} sx={{ borderRadius: 3 }}>
        <CardContent sx={{ p: 4 }}>
          <Box textAlign="center" mb={3}>
            <BadgeIcon color="primary" sx={{ fontSize: 60, mb: 1 }} />
            <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 700 }}>
              Create Your Account
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Join us today and get started
            </Typography>
          </Box>
          
          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}
          {success && (
            <Alert severity="success" sx={{ mb: 3 }}>
              {success}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit} noValidate>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  margin="normal"
                  label="Full Name"
                  variant="outlined"
                  value={formData.name}
                  onChange={handleChange('name')}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PersonIcon color="action" />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  margin="normal"
                  label="Email Address"
                  type="email"
                  variant="outlined"
                  value={formData.email}
                  onChange={handleChange('email')}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <EmailIcon color="action" />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  margin="normal"
                  label="Password"
                  type={formData.showPassword ? 'text' : 'password'}
                  variant="outlined"
                  value={formData.password}
                  onChange={handleChange('password')}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LockIcon color="action" />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setFormData({...formData, showPassword: !formData.showPassword})}
                          edge="end"
                        >
                          {formData.showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    )
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  margin="normal"
                  label="Confirm Password"
                  type={formData.showPassword ? 'text' : 'password'}
                  variant="outlined"
                  value={formData.confirmPassword}
                  onChange={handleChange('confirmPassword')}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LockIcon color="action" />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  select
                  fullWidth
                  margin="normal"
                  label="Account Type"
                  variant="outlined"
                  value={formData.role}
                  onChange={handleChange('role')}
                >
                  <MenuItem value="user">Regular User</MenuItem>
                  <MenuItem value="admin">Administrator</MenuItem>
                </TextField>
              </Grid>
            </Grid>

            <Button
              fullWidth
              type="submit"
              variant="contained"
              size="large"
              disabled={loading}
              sx={{ 
                mt: 3, 
                py: 1.5,
                borderRadius: 2,
                fontSize: '1rem'
              }}
              startIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </Button>
          </Box>

          <Divider sx={{ my: 3 }} />

          <Typography variant="body2" align="center" sx={{ color: 'text.secondary' }}>
            Already have an account?{' '}
            <Link to="/login" style={{ textDecoration: 'none', fontWeight: 600 }}>
              Sign In
            </Link>
          </Typography>
        </CardContent>
      </Card>
    </Container>
  );
};

export default Register;

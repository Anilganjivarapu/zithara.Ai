import axios from 'axios';

// Create axios instance with default config
const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000',
  withCredentials: false,
  timeout: 50000,
  headers: {
    'Content-Type': 'application/json' // Default to JSON
  }
});

// Request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token') || 
                 localStorage.getItem('user')?.token || 
                 localStorage.getItem('admin')?.token;
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    if (process.env.NODE_ENV === 'development') {
      console.log(`Making request to: ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`);
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      switch (error.response.status) {
        case 401:
          // Only clear storage and redirect for auth-related endpoints
          if (error.config.url.includes('/auth/')) {
            localStorage.removeItem('user');
            localStorage.removeItem('admin');
            if (error.response?.data?.shouldRedirect !== false) {
              window.location.href = '/login';
            }
          }
          break;
        case 404:
          console.error('API endpoint not found:', error.config.url);
          break;
        case 500:
          console.error('Server error:', error.config.url);
          break;
        default:
          console.error('API error:', error.message);
      }
    } else if (error.request) {
      console.error('No response received:', error.request);
    } else {
      console.error('Request setup error:', error.message);
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;

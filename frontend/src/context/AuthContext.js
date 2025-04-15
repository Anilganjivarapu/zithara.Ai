import { createContext, useState, useEffect, useContext } from 'react';
import axiosInstance from '../components/axiosInstance';

export const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const login = async (userData) => {
    try {
      localStorage.setItem('token', userData.token);
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
      setIsAuthenticated(true);
      return userData;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const logout = (navigate) => {
    localStorage.removeItem('token');
    setUser(null);
    setIsAuthenticated(false);
    if (navigate) {
      navigate('/auth/login');
    }
  };

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setLoading(false);
      return;
    }

    const verifyAuth = async () => {
      try {
        const response = await axiosInstance.get('/api/auth/verify');
        setUser(response.data.user);
        setIsAuthenticated(true);
        
      } catch (error) {
        console.error('Auth verification error:', error);
        localStorage.removeItem('token');
      } finally {
        setLoading(false);
      }
    };
    verifyAuth();
  }, []);

  if (loading) {
    return null; // Or loading spinner
  }

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

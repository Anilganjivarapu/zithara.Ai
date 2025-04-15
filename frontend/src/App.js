import React, { useState, useMemo } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Login from './components/Login';
import TestRender from './components/TestRender';
import UserLayout from './components/user/UserLayout';
import UserDashboard from './components/user/UserDashboard';
import UserProducts from './components/user/Products';
import UserChat from './components/Chat';
import UserOrders from './components/user/Orders';
import Register from './components/Register';
import { AuthProvider } from './context/AuthContext';
import { lightTheme, darkTheme } from './theme';
import AdminLayout from './components/admin/AdminLayout.js';
import Dashboard from './components/admin/Dashboard';
import ProductList from './components/admin/ProductList';
import UserList from './components/admin/Users';
import Orders from './components/admin/ProductForm'; // Assuming Orders component is ProductForm, adjust if different
import Chats from './components/admin/RecentChats'; // Assuming Chats component is RecentChats, adjust if different

function App() {
  const [darkMode, setDarkMode] = useState(false);

  const theme = useMemo(() => (darkMode ? darkTheme : lightTheme), [darkMode]);

  const toggleTheme = () => {
    setDarkMode(!darkMode);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/login" element={<Login />} />
            <Route path="/auth/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/test" element={<TestRender />} />
            <Route path="/user" element={<UserLayout toggleTheme={toggleTheme} darkMode={darkMode} />}>
              <Route path="dashboard" element={<UserDashboard />} />
              <Route path="products" element={<UserProducts />} />
              <Route path="chat" element={<UserChat />} />
              <Route path="orders" element={<UserOrders />} />
            </Route>
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<Navigate to="dashboard" replace />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="products" element={<ProductList />} />
              <Route path="orders" element={<Orders />} />
              <Route path="users" element={<UserList />} />
              <Route path="chats" element={<Chats />} />
            </Route>
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;

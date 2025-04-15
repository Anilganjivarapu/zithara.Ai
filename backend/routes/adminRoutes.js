import express from 'express';
import {
  getStats,
  getUsers,
  deleteUser,
  getRecentOrders,
  getRecentChats,
  getOrders,
  getChats
} from '../controllers/adminController.js';
import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductStats
} from '../controllers/productController.js';
import { authMiddleware, adminMiddleware } from '../middlewares/auth.js';

const router = express.Router();

// Dashboard analytics
router.get('/stats', adminMiddleware, getStats);
router.get('/product-stats', adminMiddleware, getProductStats);

// Recent activity
router.get('/recent-orders', adminMiddleware, getRecentOrders);
router.get('/recent-chats', adminMiddleware, getRecentChats);

// Full data listings
router.get('/orders', adminMiddleware, getOrders);
router.get('/chats', adminMiddleware, getChats);
router.get('/products', adminMiddleware, getProducts);
router.get('/users', adminMiddleware, getUsers);

// CRUD operations
router.post('/products', adminMiddleware, createProduct);
router.put('/products/:id', adminMiddleware, updateProduct);
router.delete('/products/:id', adminMiddleware, deleteProduct);
router.delete('/users/:id', adminMiddleware, deleteUser);

export default router;

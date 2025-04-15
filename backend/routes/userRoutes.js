import express from 'express';
import { getUserOrders } from '../controllers/userController.js';
import { authMiddleware } from '../middlewares/auth.js';

const router = express.Router();

// Protected user routes
router.get('/orders', authMiddleware, getUserOrders);

export default router;

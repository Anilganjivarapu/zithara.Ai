import express from 'express';
import { getProducts } from '../controllers/productController.js';
import { authMiddleware } from '../middlewares/auth.js';

const router = express.Router();

// Authenticated route to get all products
router.get('/', authMiddleware, getProducts);

export default router;

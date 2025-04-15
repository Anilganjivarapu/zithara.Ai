import express from 'express';
import { register } from '../controllers/authController.js';
import mongoose from 'mongoose';

const router = express.Router();

// Test endpoint
router.get('/test', (req, res) => {
  res.json({
    status: 'API working',
    JWT_SECRET: process.env.JWT_SECRET ? 'configured' : 'missing',
    DB_CONNECTED: mongoose.connection.readyState === 1,
    timestamp: new Date().toISOString()
  });
});

// POST /api/auth/register
router.post('/register', register);

// Add other auth routes here later (login, logout, etc.)

export default router;

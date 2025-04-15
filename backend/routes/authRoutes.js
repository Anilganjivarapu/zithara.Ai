import express from 'express';
import { login, register, verify } from '../controllers/authController.js';

const router = express.Router();

// User authentication routes
router.post('/register', register);
router.post('/login', login);
router.get('/verify', verify);

export default router;

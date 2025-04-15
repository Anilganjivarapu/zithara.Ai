import express from 'express';
import { adminLogin, adminRegister } from '../controllers/authController.js';

const router = express.Router();

// Admin authentication routes
router.post('/register', adminRegister);
router.post('/login', adminLogin);

// Verify the router is properly exported
export default router;

import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import cors from 'cors';
import { chatRouter as chatRoutes } from './routes/chatRoutes.js';
import authRoutes from './routes/authRoutes.js';
import adminAuthRoutes from './routes/adminAuthRoutes.js';

dotenv.config();

const app = express();

// Configure CORS middleware
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
  methods: ['GET','POST','PUT','DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

connectDB();

app.use(express.json());

// Routes
app.use('/api/chat', chatRoutes);
app.use('/api/auth', authRoutes);
import adminRoutes from './routes/adminRoutes.js';

app.use('/api/admin/auth', adminAuthRoutes);
app.use('/api/admin', adminRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

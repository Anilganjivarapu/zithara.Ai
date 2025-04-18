import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import cors from 'cors';
import { chatRouter as chatRoutes } from './routes/chatRoutes.js';
import authRoutes from './routes/authRoutes.js';
import adminAuthRoutes from './routes/adminAuthRoutes.js';

dotenv.config();

const app = express();

// Define allowed origins
const allowedOrigins = [
  'http://localhost:3000', // Local development
  'https://zithara-7cb9872ca-anilganjivarapus-projects.vercel.app', // Vercel frontend
  'https://zithara-ai-beige.vercel.app' // If this is your backend on Render (adjust if necessary)
];

// Configure CORS middleware
app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin like mobile apps or curl
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
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

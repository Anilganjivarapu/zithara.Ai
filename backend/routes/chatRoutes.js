import express from 'express';
console.log('Chat routes module loaded');
import { GoogleGenerativeAI } from '@google/generative-ai';
import authenticate from '../middlewares/auth.js';
import Chat from '../models/Chat.js';

const router = express.Router();
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Get chat history
router.get('/', (req, res, next) => {
  authenticate(req, res, next);
}, async (req, res) => {
  try {
    const chats = await Chat.find({ user: req.user.id })
      .sort({ timestamp: -1 })
      .limit(50);
    
    // Transform to frontend format
    const messages = chats.flatMap(chat => [
      { role: 'user', content: chat.message },
      { role: 'assistant', content: chat.response }
    ]);

    res.json(messages);
  } catch (error) {
    console.error('Error fetching chat history:', error);
    res.status(500).json({ error: 'Failed to fetch chat history' });
  }
});

// Handle new chat messages
router.post('/', 
  express.json(), // Ensure JSON parsing
  (req, res, next) => {
    console.log('Raw request received:', {
      method: req.method,
      url: req.url,
      headers: req.headers,
      rawBody: req.body // Before JSON parsing
    });
    next();
  },
  authenticate, // Proper middleware format
  async (req, res) => {
    console.log('Parsed request body:', req.body);
  try {
    const { message } = req.body;
    
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    // Verify API key is set
    if (!process.env.GEMINI_API_KEY) {
      console.error('GEMINI_API_KEY not configured');
      return res.status(500).json({ error: 'AI service not configured' });
    }

    const model = genAI.getGenerativeModel({ 
      model: 'gemini-1.5-pro-latest'
    });

const result = await model.generateContent({
  contents: [{
    parts: [{
      text: `You are zithara.Ai company AI powered customer query assistant. We specialize in making customized gold jewelry. For product defects or refunds, please contact anilganjivarapu@gmail.com. Respond concisely and much more respectfully and give  clear reasons and answersin the professional way  to: ${message}`
    }]
  }]
});

    const response = await result.response;
    const text = response.text();

    res.json({
      success: true,
      response: text
    });

  } catch (error) {
    const errorInfo = {
      message: error.message,
      type: error.name,
      stack: error.stack,
      apiKeyConfigured: !!process.env.GEMINI_API_KEY,
      model: 'gemini-1.5-pro-latest'
    };
    console.error('Chat processing failed:', errorInfo);
    res.status(500).json({
      status: 'error',
      message: 'Chat processing failed',
      ...(process.env.NODE_ENV === 'development' && { details: errorInfo })
    });
  }
});

// Health check endpoint
router.get('/health', (req, res) => {
  res.status(200).json({ status: 'healthy' });
});

export { router as chatRouter };

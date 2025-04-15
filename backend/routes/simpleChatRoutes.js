import express from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';

const router = express.Router();
const genAI = new GoogleGenerativeAI('AIzaSyD9gnfuYetI_EA7ASBTEQBqOLJxzuefnYc');

// Simple health check
router.get('/simple/health', (req, res) => {
  res.json({ status: 'working', message: 'Simple chat service is healthy' });
});

// Basic chat endpoint
router.post('/simple/chat', async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro-latest' });
    const result = await model.generateContent(message);
    const response = await result.response;
    const text = response.text();

    res.json({
      success: true,
      response: text
    });
  } catch (error) {
    console.error('Simple chat error:', error);
    res.status(500).json({ 
      error: 'Chat failed',
      details: error.message 
    });
  }
});

export { router as simpleChatRouter };

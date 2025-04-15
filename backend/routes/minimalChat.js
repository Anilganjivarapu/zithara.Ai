import express from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';

const router = express.Router();
const genAI = new GoogleGenerativeAI('AIzaSyD9gnfuYetI_EA7ASBTEQBqOLJxzuefnYc');

// Minimal health check
router.get('/minimal/status', (req, res) => {
  res.json({ working: true, message: 'Minimal chat is ready' });
});

// Working chat endpoint
router.post('/minimal/talk', express.text(), async (req, res) => {
  try {
    const { message } = JSON.parse(req.body);
    if (!message) return res.status(400).json({ error: 'No message provided' });

    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro-latest' });
    const result = await model.generateContent(message);
    const response = await result.response;
    
    res.json({
      success: true,
      reply: response.text() 
    });
  } catch (error) {
    console.error('Minimal chat error:', {
      message: error.message,
      stack: error.stack,
      request: req.body
    });
    res.status(500).json({
      error: 'Chat failed',
      details: process.env.NODE_ENV === 'development' ? error.message : null,
      stack: process.env.NODE_ENV === 'development' ? error.stack : null
    });
  }
});

export default router;

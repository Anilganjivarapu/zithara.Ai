import express from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';

const router = express.Router();
const genAI = new GoogleGenerativeAI('AIzaSyD9gnfuYetI_EA7ASBTEQBqOLJxzuefnYc');

// Simple text endpoint
router.post('/basic/chat', express.text(), async (req, res) => {
  try {
    const message = req.body; // Directly use the text body
    
    if (!message || message.trim() === '') {
      return res.status(400).send('Message is required');
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro-latest' });
    const result = await model.generateContent(message);
    const response = await result.response;
    
    res.send(response.text());
  } catch (error) {
    console.error('Basic chat error:', error.message);
    res.status(500).send('Chat failed: ' + error.message);
  }
});

export default router;

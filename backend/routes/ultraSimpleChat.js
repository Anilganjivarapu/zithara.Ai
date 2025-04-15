   import express from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';

const router = express.Router();
const genAI = new GoogleGenerativeAI('AIzaSyD9gnfuYetI_EA7ASBTEQBqOLJxzuefnYc');

// Ultra-simple chat endpoint
router.post('/ultra/chat', express.text(), async (req, res) => {
  try {
    const message = req.body;
    if (!message) return res.status(400).send('Message is required');

    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro-latest' });
    
    // System instruction for the AI
    const systemInstruction = {
      parts: [{
        text: `You are Zithara.ai's AI customer assistant. Key instructions:
        - Identify as Zithara.ai's assistant
        - For returns/issues, direct to: Anil Ganjivarapu (anilganjivarapu@gmail.com)
        - Be professional and concise`
      }],
      role: 'model'
    };

    const chat = model.startChat({
      systemInstruction: systemInstruction,
      generationConfig: {
        maxOutputTokens: 500
      }
    });

    const result = await chat.sendMessage(message);
    const response = await result.response;
    
    res.send(response.text());
  } catch (error) {
    console.error('Ultra simple chat error:', error.message);
    res.status(500).send('Chat failed: ' + error.message);
  }
});

export default router;

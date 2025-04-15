import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini with API key
const genAI = new GoogleGenerativeAI('AIzaSyD9gnfuYetI_EA7ASBTEQBqOLJxzuefnYc');
const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro-latest" });

async function checkAIService() {
  try {
    const response = await fetch('http://localhost:5000/api/ai/health', {
      timeout: 2000
    });
    return response.ok;
  } catch (err) {
    console.log('AI service check failed:', err.message);
    return false;
  }
}

export const chatHealthCheck = async (req, res) => {
  try {
    // Test Gemini API connectivity with a simple request
    const testResult = await model.generateContent({
      contents: [{
        parts: [{text: 'ping'}]
      }]
    });
    const testResponse = await testResult.response;
    
    res.status(200).json({ 
      status: 'success',
      message: 'Chat service and Gemini API are healthy',
      apiStatus: testResponse.candidates?.[0]?.content?.parts?.[0]?.text ? 'operational' : 'partial'
    });
  } catch (err) {
    console.error('Health check failed:', err);
    res.status(503).json({
      status: 'error',
      message: 'Gemini API is unavailable',
      error: err.message,
      apiStatus: 'unavailable'
    });
  }
};

import Chat from '../models/Chat.js';

// Rate limiting (1 request per second max)
let lastRequestTime = 0;

export const handleChatMessage = async (req, res) => {
  try {
    // Basic validation
    if (!req.is('application/json') || !req.body?.message) {
      return res.status(400).json({
        status: 'fail',
        message: 'Invalid request - needs JSON with message field'
      });
    }

    const { message } = req.body;
    
    // Generate response with Gemini
    const prompt = `You are Zithara.ai customer query assistant. 
    We specialize in customized jewelry. Respond professionally to customer queries.
    Current query: ${message}
    
    For returns/exchanges, provide this email: anilganjivarapu@gmail.com
    Keep responses concise and helpful.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const reply = response.text();

    // Save to database
    const chat = await Chat.create({
      user: req.user?.id || 'anonymous',
      message,
      response: reply
    });

    // Ensure consistent response format
    const responseData = {
      status: 'success',
      data: {
        reply: chat.response,
        timestamp: chat.timestamp,
        messageId: chat._id
      }
    };
    console.log('Sending response:', responseData);
    return res.json(responseData);

    } catch (err) {
      console.error('Chat processing failed:', {
        message: err.message,
        stack: err.stack,
        request: {
          method: req.method,
          url: req.originalUrl,
          body: req.body
        }
      });

      // Handle specific error cases
      let errorMessage = 'Failed to process your message';
      if (err.message.includes('API_KEY_INVALID')) {
        errorMessage = 'Invalid API configuration';
      } else if (err.message.includes('fetch failed')) {
        errorMessage = 'Connection to AI service failed';
      }

      return res.status(500).json({
        status: 'error',
        message: errorMessage,
        details: process.env.NODE_ENV === 'development' ? {
          error: err.message,
          type: err.name
        } : undefined
      });
  }
};

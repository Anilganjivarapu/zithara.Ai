import Chat from '../models/Chat.js';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const sendMessage = async (req, res) => {
  try {
    const { message } = req.body;
    if (!message?.trim()) {
      return res.status(400).json({ error: 'Message cannot be empty' });
    }

    // Check for duplicate message
    const lastMessage = await Chat.findOne(
      { userId: req.user._id },
      { messages: { $slice: -1 } }
    );
    
    if (lastMessage?.messages[0]?.content === message) {
      return res.json({ 
        reply: "You already asked that. How else can I help?",
        isDuplicate: true 
      });
    }

    // Generate response with enhanced error handling
    let reply;
    console.log('Attempting to generate content with message:', message);
    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro-latest' });
      console.log('Model initialized successfully');
      
      const result = await model.generateContent(message);
      console.log('Content generated, getting response text');
      
      reply = (await result.response).text();
      console.log('Successfully got response:', reply.substring(0, 50) + '...');
    } catch (apiError) {
      console.error('Full Gemini API Error:', {
        message: apiError.message,
        stack: apiError.stack,
        response: apiError.response?.data
      });
      throw new Error(`Gemini API failed: ${apiError.message}`);
    }

    // Save conversation if we got a valid response
    await Chat.updateOne(
      { userId: req.user._id },
      { 
        $push: { 
          messages: {
            $each: [
              { role: 'user', content: message },
              { role: 'assistant', content: reply }
            ]
          }
        } 
      },
      { upsert: true }
    );

    console.log('Chat response:', { reply });
    return res.json({ reply });

  } catch (error) {
    console.error('Chat processing error:', {
      error: error.message,
      stack: error.stack,
      requestBody: req.body,
      user: req.user._id
    });

    // More detailed fallback responses
    const fallbackResponses = {
      api: "Our AI assistant is currently unavailable. Please try again later.",
      general: "Sorry, I'm having trouble processing your request. Please try again.",
      validation: "Your message couldn't be processed. Please rephrase and try again."
    };

    let fallback = fallbackResponses.general;
    if (error.message.includes('Gemini API')) fallback = fallbackResponses.api;
    if (error.message.includes('empty')) fallback = fallbackResponses.validation;
    
    return res.status(500).json({ 
      status: "error",
      message: fallback,
      errorDetails: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

export const getMessages = async (req, res) => {
  try {
    const chat = await Chat.findOne({ userId: req.user._id });
    return res.json(chat?.messages || []);
  } catch (error) {
    console.error('Error getting messages:', error);
    return res.status(500).json({ error: 'Failed to load messages' });
  }
};

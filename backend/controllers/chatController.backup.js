// backend/controllers/chatController.js

import axios from 'axios';
import Chat from '../models/Chat.js';
import User from '../models/User.js';
import Product from '../models/Product.js';
import Order from '../models/Order.js';

import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const envPath = path.join(__dirname, '../.env');
console.log('Controller directory:', __dirname);
console.log('Loading .env from:', envPath);
console.log('File exists:', (await import('fs')).existsSync(envPath));
try {
  dotenv.config({ path: envPath });
  console.log('Successfully loaded .env file');
} catch (err) {
  console.error('Failed to load .env file:', err);
  process.exit(1);
}

// Debug all environment variables (redacting sensitive values)
console.log('All environment variables:', {
  ...process.env,
  GEMINI_API_KEY: process.env.GEMINI_API_KEY ? '***CONFIGURED***' : 'MISSING',
  JWT_SECRET: process.env.JWT_SECRET ? '***CONFIGURED***' : 'MISSING',
  MONGODB_URI: process.env.MONGODB_URI ? '***CONFIGURED***' : 'MISSING'
});

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
if (!GEMINI_API_KEY) {
  console.error('Current .env file content:');
  try {
    const fs = await import('fs');
    const envContent = fs.readFileSync(path.resolve(__dirname, '../../.env'), 'utf8');
    console.log(envContent.replace(/=(.*)/g, '=***REDACTED***'));
  } catch (err) {
    console.error('Could not read .env file:', err);
  }
  process.exit(1);
}
if (!GEMINI_API_KEY) {
  console.error('FATAL: Missing Gemini API key. Please:');
  console.error('1. Add GEMINI_API_KEY to your .env file');
  console.error('2. Restart your server');
  process.exit(1);
}
console.log('Gemini API key configured successfully');

export const sendMessage = async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) {
      return res.status(400).json({ message: 'Message is required' });
    }

    const user = await User.findById(req.user._id);
    const products = await Product.find().limit(5);
    const orders = await Order.find({ user: req.user._id })
      .populate('items.product', 'name price')
      .sort({ createdAt: -1 })
      .limit(3);

    const productList = products.map(p => (
      `• ${p.name} - $${p.price}\nDescription: ${p.description}`
    )).join('\n');

    const orderList = orders.map(o => {
      const itemsList = o.items.map(item => 
        `  - ${item.product.name} (Qty: ${item.quantity}, Price: $${item.price})`
      ).join('\n');
      
      return `Order ID: ${o._id}
Status: ${o.status}
Items:\n${itemsList}
Total: $${o.totalAmount}
`;
    }).join('\n\n') || "No recent orders found.";

    const userContext = `
Customer Details:
Name: ${user.name}
Email: ${user.email}
Role: ${user.role}

Top Products:
${productList}

Recent Orders:
${orderList}
`;

    const systemPrompt = `
You are a polite, knowledgeable customer query assistant for an e-commerce website.
Your job is to help the customer with product details, order updates, refund policies, or return issues.

When discussing orders:
- Always mention product names, quantities, and prices
- Show order status and total amount
- Format all prices with $ symbol
- Use bullet points for listing items

Never talk like an AI. Be natural and helpful.
If the user says "Hi", greet back and offer help.
Only talk about things relevant to their shopping experience.

Here's the customer and product context:
${userContext}

Now respond to this query: "${message}"
`;

    // Find existing chat or create a new one
    let chat = await Chat.findOne({ userId: req.user._id });
    if (!chat) {
      chat = new Chat({ userId: req.user._id, messages: [] });
    }

    // Add user message
    chat.messages.push({
      role: 'user',
      content: message
    });

    const promptContent = {
      contents: [
        {
          role: 'user',
          parts: [{ text: systemPrompt }]
        }
      ]
    };

    console.log('Using Gemini API key:', GEMINI_API_KEY ? '***REDACTED***' : 'NOT FOUND');
    if (!GEMINI_API_KEY) {
      console.error('Gemini API key missing in environment variables');
      throw new Error('Chat service configuration error');
    }

    try {
      // Check for duplicate message
      const lastUserMessage = await Chat.findOne(
        { userId: req.user._id },
        { messages: { $slice: -1 } }
      );
      
      if (lastUserMessage?.messages[0]?.content === message) {
        return {
          reply: "I already responded to this message. Is there something else I can help with?",
          isDuplicate: true
        };
      }

      // Process message with retry logic
      const maxRetries = 3;
      let retryCount = 0;
      let reply = "Our chat service is currently unavailable. Please try again later.";
      
      while (retryCount < maxRetries) {
        try {
          const generativeAI = await import('@google/generative-ai');
          const genAI = new generativeAI.GoogleGenerativeAI(GEMINI_API_KEY);
          const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro-latest' });
          
          const result = await model.generateContent(promptContent);
          const response = await result.response;
          reply = response.text() || "Sorry, I couldn't process that. Could you rephrase it?";
          
          // Save successful response
          await Chat.updateOne(
            { userId: req.user._id },
            { $push: { messages: { role: 'assistant', content: reply } } },
            { upsert: true }
          );
          break;
        } catch (error) {
          console.error(`Chat attempt ${retryCount + 1} failed:`, error);
          retryCount++;
          if (retryCount < maxRetries) {
            await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, retryCount)));
          }
        }
      }
      
      return { reply };
    } catch (error) {
      console.error('Chat processing error:', error);
      return { 
        reply: "I'm having trouble connecting to the chat service. Please try again later.",
        error: true
      };
            { upsert: true }
          );
          break;
        } catch (error) {
          console.error(`Chat attempt ${retryCount + 1} failed:`, error);
          retryCount++;
          if (retryCount < maxRetries) {
            await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, retryCount)));
          }
        }
      }
    }

    // Add assistant message
    chat.messages.push({
      role: 'assistant',
      content: reply
    });

    // Save the updated chat
    await chat.save();

    res.json({ 
      reply,
      messages: chat.messages 
    });

  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({ message: 'Error processing message', error: error.message });
  }
};

export const getMessages = async (req, res) => {
  try {
    const chat = await Chat.findOne({ userId: req.user._id });
    res.json(chat ? chat.messages : []);
  } catch (error) {
    console.error('Get messages error:', error);
    res.status(500).json({ message: 'Error fetching messages' });
  }
};

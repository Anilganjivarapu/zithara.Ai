import {GoogleGenerativeAI} from '@google/generative-ai';
import dotenv from 'dotenv';
dotenv.config();

async function testGemini() {
  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({model: 'gemini-1.5-pro-latest'});
    const result = await model.generateContent('Hello');
    const response = await result.response;
    console.log('Success:', await response.text());
  } catch (e) {
    console.error('Error:', e.message);
  }
}

testGemini();

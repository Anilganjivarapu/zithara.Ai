import { GoogleGenerativeAI } from '@google/generative-ai';

// Using the API key directly from the environment variable
const API_KEY = "AIzaSyD9gnfuYetI_EA7ASBTEQBqOLJxzuefnYc";
const genAI = new GoogleGenerativeAI(API_KEY);

async function testAPI() {
  try {
    console.log("Testing Gemini API connection...");
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro-latest' });
    const result = await model.generateContent("Hello");
    const response = await result.response;
    console.log("API test successful! Response:", response.text());
  } catch (error) {
    console.error("API test failed. Error details:");
    console.error("Error message:", error.message);
    console.error("Error stack:", error.stack);
    if (error.response) {
      console.error("Status code:", error.response.status);
      console.error("Response data:", error.response.data);
    }
  }
}

testAPI();

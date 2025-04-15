import axios from 'axios';

const API_KEY = "AIzaSyD9gnfuYetI_EA7ASBTEQBqOLJxzuefnYc";
const API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent";

async function testConnectivity() {
  try {
    // Test basic HTTPS connectivity
    console.log("Testing HTTPS connection to Google servers...");
    await axios.get('https://www.google.com');
    console.log("Basic HTTPS test passed");

    // Test API endpoint connectivity
    console.log("Testing API endpoint connectivity...");
    const response = await axios.post(
      `${API_URL}?key=${API_KEY}`,
      {
        contents: [{
          parts: [{
            text: "Hello"
          }]
        }]
      },
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
    
    console.log("API test successful! Response:", response.data);
  } catch (error) {
    console.error("Connectivity test failed:");
    console.error("Error message:", error.message);
    if (error.response) {
      console.error("Status code:", error.response.status);
      console.error("Response data:", error.response.data);
    } else if (error.request) {
      console.error("No response received. Request details:", error.request);
    }
    console.error("Full error:", error);
  }
}

testConnectivity();

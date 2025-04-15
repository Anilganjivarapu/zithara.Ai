import axios from 'axios';

const testGeminiAPI = async () => {
  const payload = {
    contents: [{
      parts: [{
        text: "Test message"
      }]
    }]
  };

  try {
    const response = await axios.post(
      'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=AIzaSyD9gnfuYetI_EA7ASBTEQBqOLJxzuefnYc',
      payload,
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
    console.log('Response from Gemini API:', response.data);
  } catch (error) {
    console.error('Error calling Gemini API:', error.response ? error.response.data : error.message);
  }
};

testGeminiAPI();

import React, { useState, useEffect } from 'react';
import axiosInstance from './axiosInstance';
import { useAuth } from '../context/AuthContext';

const ChatPage = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const { user } = useAuth();

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { role: 'user', content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');

    try {
      const response = await axiosInstance.post('/api/chat', { message: input }, {
        headers: {
          Authorization: `Bearer ${user.token}`
        }
      });
      const assistantMessage = {
        role: 'assistant',
        content: response.data.reply
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Chat API Error:', error);
      setMessages((prev) => [...prev, { role: 'assistant', content: 'Error processing your request' }]);
    }
  };

  return (
    <div>
      <h1>Chat with AI</h1>
      <div>
        {messages.map((msg, index) => (
          <div key={index} className={msg.role === 'user' ? 'user-message' : 'assistant-message'}>
            {msg.content}
          </div>
        ))}
      </div>
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
      />
      <button onClick={handleSend}>Send</button>
    </div>
  );
};

export default ChatPage;

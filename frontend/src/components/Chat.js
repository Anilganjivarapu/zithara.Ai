import React, { useState, useEffect, useRef } from 'react';
import axiosInstance from './axiosInstance';
import { useAuth } from '../context/AuthContext';

const TypingDots = () => {
  const [dotCount, setDotCount] = React.useState(1);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setDotCount(count => (count % 3) + 1);
    }, 500);
    return () => clearInterval(interval);
  }, []);

  return <span>{'.'.repeat(dotCount)}</span>;
};

const getTimeBasedGreeting = (name) => {
  const hour = new Date().getHours();
  let greeting;
  
  if (hour < 12) greeting = 'Good morning';
  else if (hour < 18) greeting = 'Good afternoon';
  else greeting = 'Good evening';
  
  return greeting + ' ' + name + ", I'm your AI-powered customer assistant. How can I help you today?";
};

const Chat = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState([
    { 
      text: getTimeBasedGreeting(user?.name || 'User'),
      sender: 'ai', 
      timestamp: new Date().toISOString()
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);

  const scrollToBottom = () => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    // Add user message
    const userMessage = { 
      text: input, 
      sender: 'user',
      timestamp: new Date().toISOString()
    };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    try {
      // Get AI response
      const response = await axiosInstance.post('/api/chat', 
        { message: input },
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      console.log('API response:', response);

      // Replace fallback message with friendlier text
      let reply = response.data?.response || '';
      if (reply.trim() === 'Sorry, I did not get that.') {
        reply = "I'm not sure I understand. Could you please rephrase?";
      }

      // Add AI response
      const aiMessage = { 
        text: reply,
        sender: 'ai',
        timestamp: new Date().toISOString()
      };
      setMessages(prev => {
        const newMessages = [...prev, aiMessage];
        console.log('Updated messages:', newMessages);
        return newMessages;
      });

    } catch (error) {
      console.error('Chat error:', error);
      setMessages(prev => [...prev, {
        text: 'Sorry, something went wrong. Please try again.',
        sender: 'ai',
        timestamp: new Date().toISOString()
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="chat-container" style={{
      backgroundColor: '#121212',
      color: '#ffffff',
      height: '100vh',
      display: 'flex',
      flexDirection: 'column'
    }}>
      <div className="chat-header" style={{
        padding: '1rem',
        borderBottom: '1px solid #333',
        display: 'flex',
        alignItems: 'center'
      }}>
        <span role="img" aria-label="bot" style={{ fontSize: 32, marginRight: 12 }}>🤖</span>
        <h2 style={{ margin: 0 }}>AI Powered Customer Query Assistant</h2>
        <span style={{ marginLeft: 'auto', color: '#aaa' }}>
          {user?.name || 'User'}
        </span>
      </div>

      <div className="messages" ref={messagesContainerRef} style={{
        flex: 1,
        padding: '1rem',
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column'
      }}>
        {messages.map((msg, i) => (
          <div key={i} style={{
            maxWidth: '80%',
            marginBottom: '1rem',
            padding: '0.75rem 1rem',
            borderRadius: msg.sender === 'user' 
              ? '18px 18px 0 18px' 
              : '18px 18px 18px 0',
            alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
            backgroundColor: msg.sender === 'user' 
              ? '#4a4a4a' 
              : '#2a2a2a',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center'
          }}>
            {msg.sender === 'ai' && (
              <span role="img" aria-label="bot" style={{ fontSize: 20, marginRight: 8 }}>🤖</span>
            )}
            <span style={{ whiteSpace: 'pre-wrap' }}>{msg.text || '[No response]'}</span>
          </div>
        ))}
        {isTyping && (
          <div style={{
            maxWidth: '80%',
            marginBottom: '1rem',
            padding: '0.75rem 1rem',
            borderRadius: '18px 18px 18px 0',
            alignSelf: 'flex-start',
            backgroundColor: '#2a2a2a',
            color: '#aaa',
            display: 'flex',
            alignItems: 'center',
          fontSize: 14,
          fontWeight: 'bold',
          letterSpacing: 4
        }}>
        <TypingDots />
        <span style={{ marginLeft: 8 }}>AI Assistant is typing</span>
      </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSend} style={{
        padding: '1rem',
        borderTop: '1px solid #333',
        display: 'flex'
      }}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
          style={{
            flex: 1,
            padding: '0.75rem',
            borderRadius: '24px',
            border: 'none',
            backgroundColor: '#2a2a2a',
            color: '#ffffff',
            outline: 'none'
          }}
        />
        <button 
          type="submit" 
          disabled={isTyping}
          style={{
            marginLeft: '0.5rem',
            padding: '0 1.5rem',
            borderRadius: '24px',
            border: 'none',
            backgroundColor: '#6200ee',
            color: '#ffffff',
            cursor: 'pointer'
          }}
        >
          Send
        </button>
      </form>
    </div>
  );
};

export default Chat;

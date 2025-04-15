import React, { useState } from 'react';
import axios from 'axios';

const TestLogin = () => {
  const [email, setEmail] = useState('bsai35229@gmail.com');
  const [password, setPassword] = useState('123456');
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log('Sending login request to http://localhost:5000/api/auth/login');
      const res = await axios.post('http://localhost:5000/api/auth/login', {
        email,
        password
      });
      console.log('Login response:', res.data);
      setResponse(res.data);
      setError(null);
    } catch (err) {
      console.error('Login error:', err.response?.data || err.message);
      setError(err.response?.data || { message: err.message });
      setResponse(null);
    }
  };

  return (
    <div style={{ padding: '20px', border: '1px solid #ccc' }}>
      <h2>Test Login Component</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email: </label>
          <input 
            type="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
          />
        </div>
        <div>
          <label>Password: </label>
          <input 
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
          />
        </div>
        <button type="submit">Test Login</button>
      </form>

      {response && (
        <div style={{ marginTop: '20px', color: 'green' }}>
          <h3>Success!</h3>
          <pre>{JSON.stringify(response, null, 2)}</pre>
        </div>
      )}

      {error && (
        <div style={{ marginTop: '20px', color: 'red' }}>
          <h3>Error!</h3>
          <pre>{JSON.stringify(error, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default TestLogin;

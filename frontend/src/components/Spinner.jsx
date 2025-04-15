import React from 'react';

const Spinner = () => (
  <div style={{
    display: 'inline-block',
    width: '20px',
    height: '20px',
    border: '3px solid rgba(255, 255, 255, 0.3)',
    borderRadius: '50%',
    borderTopColor: '#ffffff',
    animation: 'spin 1s ease-in-out infinite'
  }} />
);

export default Spinner;

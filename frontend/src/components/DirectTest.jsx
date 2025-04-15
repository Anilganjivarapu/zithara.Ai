import React from 'react';

const DirectTest = () => {
  console.log('DirectTest component rendering');
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      backgroundColor: 'lime',
      color: 'black',
      fontSize: '3rem',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 9999
    }}>
      DIRECT TEST COMPONENT
    </div>
  );
};

export default DirectTest;

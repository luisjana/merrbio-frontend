// components/CustomButton.js
import React from 'react';

export default function CustomButton({ onClick, children }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: '10px 20px',
        margin: '5px',
        borderRadius: '5px',
        backgroundColor: '#4caf50',
        color: 'white',
        border: 'none',
        cursor: 'pointer',
      }}
    >
      {children}
    </button>
  );
}

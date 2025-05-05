import React from 'react';

export default function BaseButton({ onClick, children, style }) {
  return (
    <button onClick={onClick} style={{ padding: '10px', ...style }}>
      {children}
    </button>
  );
}

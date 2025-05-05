import React from 'react';
import PropTypes from 'prop-types';

export default function GreenButton({ onClick, children }) {
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

GreenButton.propTypes = {
  onClick: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
};

// TextArea.js
import React from 'react';
import './TextArea.css';

const TextArea = ({ text, setText }) => {
  return (
    <textarea
    className="text-area" 
      value={text} 
      onChange={e => setText(e.target.value)}
    //   style={{
    //     // width: `${text.length * 1.618}px`, // Golden ratio
    //     // height: `${text.length * 1.618 / 2}px` // Half of width
    //   }}
    />
  );
};

export default TextArea;

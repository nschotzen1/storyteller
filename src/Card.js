// Card.js
import React, { useState } from 'react';
import './Card.css';

const Card = ({ id, front, back, selected, selectCard, isVisible = true, xp_cost, maintenance_cost, cluster_connections, artistic_influences, universe_specific_rating, general_importance }) => {
  const [cardState, setCardState] = useState('HIDDEN'); // Possible states: HIDDEN, VISIBLE_UNFLIPPED, VISIBLE_FLIPPED

  // Handle card flipping logic
  const handleFlip = () => {
    if (cardState === 'VISIBLE_UNFLIPPED') {
      setCardState('VISIBLE_FLIPPED');
    } else if (cardState === 'VISIBLE_FLIPPED') {
      setCardState('VISIBLE_UNFLIPPED');
    }
  };

  // Handle double-click for card selection
  const handleDoubleClick = (e) => {
    e.stopPropagation(); // Prevent the flip action when clicking
    selectCard(id); // Select this card
  };

  return (
    <div
      className={`card ${cardState.toLowerCase()}${selected ? ' selected' : ''}`}
      style={{
        display: isVisible ? 'block' : 'none',
        transform: selected ? 'scale(1.1) rotateY(20deg)' : 'none',
        opacity: isVisible ? 1 : 0, // Use opacity to hide but maintain layout
        zIndex: selected ? 1000 : 1,
      }}
      onClick={handleFlip}
      onDoubleClick={handleDoubleClick}
    >
      <div className="card-inner">
        <div className="card-face card-front" style={{ backgroundImage: `url(http://localhost:5001${front.url})` }}>
          <div className="card-content" style={{ color: front.fontColor, fontFamily: front.fontName, fontSize: front.fontSize }}>
            {front.title}
          </div>
        </div>
        <div className="card-face card-back" style={{ backgroundImage: `url(http://localhost:5001${back.url})` }}>
          <div className="card-content" style={{ color: back.fontColor, fontFamily: back.fontName, fontSize: back.fontSize }}>
            {back.title}
          </div>
        </div>
      </div>
      <div className="card-properties">
        <span>XP Cost: {xp_cost}</span>
        <span>Maintenance Cost: {maintenance_cost}</span>
        <span>Cluster Connections: {cluster_connections}</span>
        <span>Artistic Influences: {artistic_influences}</span>
        <span>Universe Rating: {universe_specific_rating}</span>
        <span>General Importance: {general_importance}</span>
      </div>
    </div>
  );
};

export default Card;

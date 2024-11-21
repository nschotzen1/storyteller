import React, { useState } from 'react';
import Card from './Card';
import './CardFan.css'; // Ensure you style this appropriately

const CardFan = ({ cards }) => {
  const [selectedCardId, setSelectedCardId] = useState(null);

  const handleSelectCard = (id) => {
    setSelectedCardId(id);
    // Additional logic to filter or sort cards based on selection
  };

  const handleDoubleClick = (id) => {
    // Logic for double click if needed
  };

  const visibleCards = selectedCardId ? cards.filter(card => card.id === selectedCardId || // The selected card
    cards.indexOf(card) <= cards.indexOf(cards.find(c => c.id === selectedCardId)) + 4 && // 4 cards to the right
    cards.indexOf(card) >= cards.indexOf(cards.find(c => c.id === selectedCardId)) - 4 // 4 cards to the left
  ) : cards;

  return (
    <div className="card-fan-container">
      {visibleCards.map((card, index) => (
        <Card
          key={card.id}
          id={card.id}
          front={card.front}
          back={card.back}
          selected={card.id === selectedCardId}
          onSelect={handleSelectCard}
          onDoubleClick={handleDoubleClick}
          style={{
            transform: `translateX(${(index - visibleCards.length / 2) * 30}px) rotate(${(index - visibleCards.length / 2) * 5}deg)`
          }}
        />
      ))}
    </div>
  );
};

export default CardFan;

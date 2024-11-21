// import React, { useState, useEffect } from 'react';
// import './CardDeck.css';

// const CardDeck = () => {
//   const [cards, setCards] = useState([]);
//   const suits = ['Hearts', 'Spades', 'Diamonds', 'Clubs'];

//   // Similar to the randomize function from the original script
//   const randomizeSuit = () => {
//     const suitType = Math.floor(Math.random() * 4);
//     return suits[suitType];
//   };

//   // Initialize cards similar to the for loop in the original script
//   useEffect(() => {
//     const initialCards = Array(10).fill(0).map((_, i) => {
//       const randomRot = -43 + Math.ceil(Math.random() * 3);
//       return {
//         rotation: `rotateX(60deg) rotateY(0deg) rotateZ(${randomRot}deg) translateZ(${i * 3}px)`,
//         isFlipped: false,
//         isRemoved: false
//       };
//     });
//     setCards(initialCards);
//   }, []);

//   const handleCardClick = (index) => {
//     console.log(`Card ${index} clicked`);
//     setCards(prevCards => {
//       const newCards = [...prevCards];
//       newCards[index].isFlipped = !newCards[index].isFlipped;
//       console.log(newCards);
//       if (newCards[index].isFlipped) {
//         newCards[index].isRemoved = true;
//       }
//       return newCards;
//     });
//     randomizeSuit();
//   };

//   return (
//     <div className="cards">
//       {cards.map((card, i) => (
//         <div 
//           key={i} 
//           className={`card ${card.isFlipped ? 'opened' : 'down'} ${card.isRemoved ? 'is-removed' : ''}`} 
//           style={{ transform: card.rotation }}
//           onClick={() => handleCardClick(i)}
//         ></div>
//       ))}
//     </div>
//   );
// }

// export default CardDeck;

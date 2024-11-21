import React, { useEffect, useState } from 'react';
import Card from './Card';
import Chat from './Chat';
import TextArea from './TextArea';
import StoryFragmentComponent from './StoryFragment'
import './CardContainer.css'; 
import './SendButton.css';

const SERVER = 'http://localhost:5001';

const CardContainer = () => {
  const [deckCards, setDeckCards] = useState([]);
  const [isDeckMode, setIsDeckMode] = useState(false);
  const [selectedCardId, setSelectedCardId] = useState(null);
  const [showBookImages, setShowBookImages] = useState(true);
  const [showTextAreas, setShowTextAreas] = useState(true);
  const [showStoryPoints, setShowStoryPoints] = useState(true);
  const [showChat, setShowChat] = useState(true);
  const [cards, setCards] = useState([]);
  const [showNewCards, setShowNewCards] = useState(false);
  const [fade, setFade] = useState(false);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [prefixes, setPrefixes] = useState([]);
  const [selectedPrefix, setSelectedPrefix] = useState("");
  const [userText, setUserText] = useState("");
  const [timer, setTimer] = useState(null);
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedCard, setSelectedCard] = useState(null);
  const [sessionId, setSessionId] = useState(Math.random().toString(36).substring(2, 15));
  const [selectedFragment, setSelectedFragment] = useState(null);
  const [previousFragment, setPreviousFragment] = useState("");
  const [totalStorytellingPoints, setTotalStorytellingPoints] = useState(50);
  const [usedStorytellingPoints, setUsedStorytellingPoints] = useState(0);
  const [fontNames, setFontNames] = useState([]);
  const [mode, setMode] = useState('story'); // Modes: 'story', 'card', 'cardAndStory'

  const toggleDeckMode = (deckId) => {
    if (deckId === selectedCard) {
      setIsDeckMode(false);
      setSelectedCard(null);
      setDeckCards([]);
    } else {
      fetchDeckCards(deckId);
      setSelectedCard(deckId);
      setIsDeckMode(true);
    }
  };

  const fetchDeckCards = async (deckId) => {
    try {
      const response = await fetch(`${SERVER}/api/getEntitiesForTexture`, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ deckId })
      });
      const data = await response.json();
      setDeckCards(data);
    } catch (error) {
      console.error('Error fetching deck cards:', error);
      setDeckCards([]);
    }
  };

  useEffect(() => {
    fetchInitialCards();
  }, []);

  const fetchInitialCards = async () => {
    try {
      const response = await fetch(`${SERVER}/api/cards`);
      const data = await response.json();
      setCards(data);
    } catch (error) {
      console.error('Fetch failed:', error);
    }
  };

  const selectCard = (id) => {
    if (id === selectedCardId) {
      setSelectedCardId(null);
    } else {
      setSelectedCardId(id);
    }
  };

  const useGoogleFont = (fontNames) => {
    useEffect(() => {
      fontNames.forEach(fontName => {
        if (fontName) {
          const link = document.createElement('link');
          link.href = `https://fonts.googleapis.com/css?family=${fontName.replace(' ', '+')}&display=swap`;
          link.rel = 'stylesheet';
          document.head.appendChild(link);
        }
      });
    }, [fontNames]);
  };

  const getPrefixes = async (n = 10) => {
    try {
      const response = await fetch(`${SERVER}/api/prefixes?n=${n}`);
      if (!response.ok) {
        throw new Error('HTTP error ' + response.status);
      }
      const data = await response.json();
      setPrefixes(data);
    } catch (error) {
      console.error('Fetch failed:', error.message);
    }
  };

  useEffect(() => { 
    getPrefixes();
  }, []);

  useEffect(() => {
    const uniqueFontNames = [...new Set(cards.map(card => card.fontName))];
    setFontNames(uniqueFontNames);
  }, [cards]);

  useGoogleFont(fontNames);

  const onSelectFragment = (fragment) => {
    const fragmentPoints = fragment.storytelling_points || 0;
    if (totalStorytellingPoints - usedStorytellingPoints - fragmentPoints >= 0) {
      setUsedStorytellingPoints(currentPoints => currentPoints + fragmentPoints);
      let newText;
      if (previousFragment.trim() && userText.endsWith(previousFragment.trim())) {
        const startIndex = userText.lastIndexOf(previousFragment.trim());
        newText = `${userText.substring(0, startIndex)}${fragment.prefix}`;
      } else {
        newText = userText + (userText.length > 0 ? " " : "") + fragment.prefix;
      }
      setUserText(newText);
      setPreviousFragment(fragment.prefix);
    } else {
      console.log("Not enough storytelling points.");
    }
  };

  const resetTimer = () => {
    setTimer(null);
  };

  const textShadow = '0 0 5px rgba(0,0,0,0.5)';

  const sendText = async (selectedCard) => {
    // Placeholder function for sending text
    console.log('Sending text for card:', selectedCard);
  };

  const concludeScene = async () => {
    // Placeholder function for concluding the scene
    console.log('Concluding scene');
  };

  return (
    <div className="card-container">
      {/* Mode Switch Buttons */}
      <div className="mode-switch-buttons">
        <button className="mode-button" onClick={() => setMode('story')}>Story Mode</button>
        <button className="mode-button" onClick={() => setMode('card')}>Card Mode</button>
        <button className="mode-button" onClick={() => setMode('cardAndStory')}>Card + Story Mode</button>
      </div>

      {/* Conditional Rendering Based on Mode */}
      {mode === 'story' && (
        <>
          {showBookImages && cards.length > 0 && (
            <div className="book-image-container">
              <div className={`book-image fade-out`} style={{ backgroundImage: `url(${SERVER}${cards[currentCardIndex]?.url ?? ''})` }} />
              <div className={`book-image fade-in`} style={{ backgroundImage: `url(${SERVER}${cards[(currentCardIndex + 1) % cards.length]?.url ?? ''})` }} />
            </div>
          )}
          {showTextAreas && Array.isArray(prefixes) && (
            <>
              <div className="left-prefix-container">
                <StoryFragmentComponent
                  fragments={prefixes.slice(0, 3)}
                  onSelectFragment={onSelectFragment}
                  userInput={userText}
                  onChangeInput={(e) => setUserText(e.target.value)}
                  selectedFragment={selectedPrefix}
                  resetTimer={resetTimer}
                  textShadow={textShadow}
                />
              </div>
              <div className="right-prefix-container">
                <StoryFragmentComponent
                  fragments={prefixes.slice(3)}
                  onSelectFragment={onSelectFragment}
                  userInput={userText}
                  onChangeInput={(e) => setUserText(e.target.value)}
                  selectedFragment={selectedPrefix}
                  resetTimer={resetTimer}
                  textShadow={textShadow}
                />
              </div>
            </>
          )}
          {showTextAreas && (
            <div className="text-area-container">
              <TextArea className="text-area" text={userText} setText={setUserText} />
              <button className="send-button" onClick={() => sendText(selectedCard)} disabled={isLoading}>{isLoading ? 'Sending...' : 'Send'}</button>
              <button onClick={concludeScene} disabled={isLoading || !userText.trim()}>{isLoading ? 'Processing...' : 'Conclude Scene'}</button>
            </div>
          )}
          {showStoryPoints && (
            <div className="storytelling-points-display">
              Total Points: {totalStorytellingPoints} <br />
              Used Points: {usedStorytellingPoints} <br />
              Remaining Points: {totalStorytellingPoints - usedStorytellingPoints}
            </div>
          )}
          {showChat && <Chat fragmentText={userText} sessionId={sessionId} />}
        </>
      )}

      {mode === 'card' && cards.length > 0 && (
        <div className="card-mode">
          <div className="card-list">
            {cards.map((card, index) => (
              <Card
                key={index}
                id={card.id}
                front={card.front}
                back={card.back}
                selected={card.id === selectedCardId}
                selectCard={selectCard}
                isVisible={selectedCardId === null || card.id === selectedCardId}
                onClick={() => toggleDeckMode(card.id)}
              />
            ))}
          </div>
        </div>
      )}

      {mode === 'cardAndStory' && cards.length > 0 && (
        <div className="card-and-story-mode">
          <div className="card-list">
            {cards.map((card, index) => (
              <Card
                key={index}
                id={card.id}
                front={card.front}
                back={card.back}
                selected={card.id === selectedCardId}
                selectCard={selectCard}
                isVisible={selectedCardId === null || card.id === selectedCardId}
                onClick={() => toggleDeckMode(card.id)}
              />
            ))}
          </div>
          <div className="chat-container">
            <Chat fragmentText={userText} sessionId={sessionId} />
          </div>
        </div>
      )}

      {error && <div className="error">{error}</div>}
    </div>
  );
};

export default CardContainer;

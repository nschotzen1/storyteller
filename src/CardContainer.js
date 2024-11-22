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
  const [selectedFragment, setSelectedFragment] = useState(null)
  const [previousFragment, setPreviousFragment] = useState("");
  const [totalStorytellingPoints, setTotalStorytellingPoints] = useState(50);
  const [usedStorytellingPoints, setUsedStorytellingPoints] = useState(0);


  const [fontNames, setFontNames] = useState([]);



  const toggleDeckMode = (deckId) => {
    if (deckId === selectedCard) {
      // Exit deck mode
      setIsDeckMode(false);
      setSelectedCard(null);
      setDeckCards([]);
    } else {
      // Enter deck mode
      fetchDeckCards(deckId);
      setSelectedCard(deckId);
      setIsDeckMode(true);
    }
  };

  const fetchDeckCards = async (deckId) => {
    try {
      const response = await fetch(`${SERVER}/api/generateTextures`, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ deckId })
      });
      const data = await response.json();
      setDeckCards(data); // Assume the API returns an array of cards for the deck
    } catch (error) {
      console.error('Error fetching deck cards:', error);
      setDeckCards([]); // Reset on error
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
      setSelectedCardId(null); // Deselect the card if it's the same one
    } else {
      setSelectedCardId(id); // Otherwise, select the new card
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

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await fetch(`${SERVER}/api/cards`);
        if (!response.ok) {
          throw new Error('HTTP error ' + response.status);
        }
        const data = await response.json();
        setCards(data);
      } catch (error) {
        console.error('Fetch failed:', error.message);
      }
    };

    fetchBooks();
  }, []);



useEffect(() => {
  const interval = setInterval(() => {
    setFade(true); // Start fade out
    setTimeout(() => {
      setFade(false); // Reset fade for next image
      setCurrentCardIndex((prevIndex) => (prevIndex + 1) % cards.length);
    }, 1000); // Change book after fade-out, time should match fade effect duration
  }, 10000); // Change book every 10 seconds

  return () => clearInterval(interval);
}, [cards, currentCardIndex]);



const onSelectFragment = (fragment) => {
  const fragmentPoints = fragment.storytelling_points || 0; // Assume this is a numeric value
  // Check if there are enough storytelling points left to select this fragment
  if (totalStorytellingPoints - usedStorytellingPoints - fragmentPoints >= 0) {
    // Deduct the points of the selected fragment from the total
    setUsedStorytellingPoints(currentPoints => currentPoints + fragmentPoints);

    // Your existing logic to handle user text and fragment selection

    // Flag to check if replacement happened
    let didReplace = false;

    // Check if the userText ends with the previousFragment
    if (previousFragment.trim() && userText.endsWith(previousFragment.trim())) {
      // Calculate the start index for replacement
      const startIndex = userText.lastIndexOf(previousFragment.trim());
      // Replace only the last occurrence (suffix)
      const newText = `${userText.substring(0, startIndex)}${fragment.prefix}`; // Ensure you're using fragment.prefix
      setUserText(newText);
      didReplace = true; // Indicate that replacement has occurred
    } else {
      // If not replacing, just append the new fragment
      setUserText(userText + (userText.length > 0 ? " " : "") + fragment.prefix); // Ensure whitespace handling
    }

    // Update previousFragment for next time
    setPreviousFragment(fragment.prefix + (didReplace ? "" : " ")); // Adjust based on whether replacement happened
    startTimer(30); // Start the timer
  } else {
    // Optionally handle the case where there aren't enough points
    console.log("Not enough storytelling points.");
  }
};


  const onChangeInput = (event) => {
    setUserText(event.target.value);
    // Additional logic for input change
  };





  useEffect(() => {
    const fetchCards = async () => {
      try {
        const response = await fetch(`${SERVER}/api/cards`);
        if (!response.ok) {
          throw new Error('HTTP error ' + response.status);
        }
        const data = await response.json();
        setCards(data);
      } catch (error) {
        setError(error.message);
        console.error('Fetch failed:', error.message);
      }
    };

    fetchCards();
  }, []);

  const [textShadow, setTextShadow] = useState('');

  
  const getTextShadow = (time) => {
    if (time > 27) {
      return '0em 0em 0.12em rgba(0,0,0,0.75)'; // Least blur
    } else if (time > 24) {
      return '0em 0em 0.14em rgba(0,0,0,0.75)';
    } else if (time > 21) {
      return '0em 0em 0.16em rgba(0,0,0,0.75)';
    } else if (time > 18) {
      return '0em 0em 0.18em rgba(0,0,0,0.75)';
    } else if (time > 15) {
      return '0em 0em 0.20em rgba(0,0,0,0.75)';
    } else if (time > 12) {
      return '0em 0em 0.21em rgba(0,0,0,0.75)';
    } else if (time > 9) {
      return '0em 0em 0.22em rgba(0,0,0,0.75)';
    } else if (time > 6) {
      return '0em 0em 0.23em rgba(0,0,0,0.75)';
    } else if (time > 3) {
      return '0em 0em 0.24em rgba(0,0,0,0.75)';
    } else {
      return '0em 0em 0.25em rgba(0,0,0,0.75)'; // Most blur
    }
  };
  
  

const startTimer = (duration) => {
  setTimer(duration);
  setTextShadow(getTextShadow(duration)); // Set initial text shadow

  const countdown = setInterval(() => {
    setTimer((prevTime) => {
      if (prevTime === 1) {
        clearInterval(countdown);
        setTextShadow(''); // Clear the text shadow when the timer ends
        return null;
      }

      setTextShadow(getTextShadow(prevTime)); // Update text shadow based on remaining time
      return prevTime - 1;
    });
  }, 1000);
};

  
  const resetTimer = () => {
    clearInterval(timer); // Clear existing timer
    setTimer(null); // Reset timer state
  };
  

  const concludeScene = async () => {
    if (isLoading) return;  // Avoid sending multiple requests at the same time
  
    setLoading(true);
    setError(null);
  
    try {
      const response = await fetch(`${SERVER}/api/generateTextures`, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ userText, selectedCard, sessionId})
      });
  
      if (!response.ok) {
          throw new Error(`HTTP error ${response.status}`);
      }
  
      const data = await response.json();
      setCards(data.cards.map(card => ({
        id: card.id,
        front: {
          url: card.front.url,
          title: card.front.title,
          fontName: card.front.fontName,
          fontSize: card.front.fontSize,
          fontColor: card.front.fontColor,
        },
        back: {
          url: card.back.url,
          title: card.back.title,
          fontName: card.back.fontName,
          fontSize: card.back.fontSize,
          fontColor: card.back.fontColor,
        }
      })));
      setShowNewCards(true);
      setShowBookImages(false);
      setShowTextAreas(false);
      setShowStoryPoints(false);
      setShowChat(false);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };
  
  // Add this function
  const getPrefixes = async (n = 10) => {
    try {
      const response = await fetch(`${SERVER}/api/prefixes?n=${n}`);
      if (!response.ok) {
        throw new Error('HTTP error ' + response.status);
      }
      console.log('RETURNED')
      const data = await response.json();
      console.log(`DATA ${data}`)
      setPrefixes(data);
    } catch (error) {
      console.error('Fetch failed:', error.message);
    }
  };

  const sendText = async (textureId = null) => {
    if (isLoading) return; // Avoid sending multiple requests at the same time

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${SERVER}/api/storytelling`, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ userText, textureId, sessionId })
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`);
      }
      
      const {prefixes, current_narrative} = await response.json();
      console.log('DATA:', prefixes);
      setPrefixes(prefixes);
      setUserText(current_narrative);
      setPreviousFragment('');

    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { 
    getPrefixes();
  }, []);

  useEffect(() => {
    // Extract unique font names from the cards
    const uniqueFontNames = [...new Set(cards.map(card => card.fontName))];
    setFontNames(uniqueFontNames);
  }, [cards]);

  // Call the useGoogleFont hook with the array of font names
  useGoogleFont(fontNames);


  const loadGoogleFont = (fontName) => {
    const link = document.createElement('link');
    link.href = `https://fonts.googleapis.com/css?family=${fontName.replace(' ', '+')}:400,700&display=swap`;
    link.rel = 'stylesheet';
    document.head.appendChild(link);
  };

  const handleSelectCard = (id) => {
    if (selectedCard === id) {
      setSelectedCard(null); // Deselect if the same card is clicked again
    } else {
      setSelectedCard(id); // Set selected card
    }
  };
  
  useEffect(() => {
    prefixes.forEach(prefix => {
      loadGoogleFont(prefix.fontName);
    });
  }, [prefixes]);
  
  console.log(JSON.stringify(prefixes)); 
  return (
    <div className="card-container">
      {cards.length > 0 && showBookImages && (
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
  
      {error && <div className="error">{error}</div>}
  
      {showNewCards && (
        <div className="new-cards-display">
          {!isDeckMode && cards.map((card, index) => (
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
          {isDeckMode && deckCards.map((card, index) => (
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
      )}
      {showNewCards && (<button onClick={() => {
            setShowBookImages(true);
            setShowTextAreas(true);
            setShowStoryPoints(true);
            setShowChat(true);
            setShowNewCards(false);
          }}>Return to Story Mode</button>
        )}
    </div>
    
  );
  


  
  
  
};

export default CardContainer;
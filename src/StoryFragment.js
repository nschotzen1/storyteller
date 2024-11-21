import React from 'react';

class StoryFragmentComponent extends React.Component {
  render() {
    const { fragments, onSelectFragment, userInput, onChangeInput, timer, selectedFragment, textShadow } = this.props;

    return (
      <div className="story-container">
        <div className="prefix-container">
          {fragments.map((fragment, index) => (
            <button
              className={`prefix embossed-text ${fragment === selectedFragment ? 'selected' : ''}`}
              key={index}
              onClick={() => onSelectFragment(fragment)}
              style={{ 
                textShadow: fragment.prefix === selectedFragment ? textShadow : '',
                fontFamily: fragment.fontName,
                fontSize: fragment.fontSize
              }}
            >
              {fragment.prefix}
              {fragment.storytelling_points && (
                <span className="storytelling-points">Points: {fragment.storytelling_points}</span>
              )}
            </button>
          ))}
        </div>
        {/* <UserInputBox 
          value={userInput}
          onChange={onChangeInput}
        />
        <TimerDisplay timeLeft={timer} /> */}
      </div>
    );
  }
}


const UserInputBox = ({ value, onChange }) => (
  <input 
    type="text"
    value={value}
    onChange={onChange}
    className="user-input"
  />
);

const TimerDisplay = ({ timeLeft }) => (
  <div className="timer-display">
    Time left: {timeLeft}
  </div>
);

export default StoryFragmentComponent;
  
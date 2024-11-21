import React, { useState, useEffect, useRef } from 'react';
import DOMPurify from 'dompurify';
import './Chat.css';

function Chat({ fragmentText, sessionId }) {
    const [userInput, setUserInput] = useState('');
    const [messages, setMessages] = useState([]);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSendMessage = async () => {
        const masterName = "YourMasterName";
        const response = await fetch(`http://localhost:5001/chatWithMaster?masterName=${masterName}&userInput=${userInput}&sessionId=${sessionId}&fragmentText=${fragmentText}`);
        const data = await response.json();

        setMessages(prevMessages => [...prevMessages, 
            { sender: 'user', text: userInput }, 
            { sender: 'master', text: data.text }
        ]);

        setUserInput('');
    };

    const createMarkup = (htmlContent) => {
        return { __html: DOMPurify.sanitize(htmlContent) };
    };

    return (
        <div className="chat-container">
            <div className="messages">
                {messages.map((message, index) => (
                    <div key={index} className={`message ${message.sender}`}>
                        <span dangerouslySetInnerHTML={createMarkup(message.text)}></span>
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>
            <div className="input-area">
                <input 
                    value={userInput} 
                    onChange={e => setUserInput(e.target.value)} 
                    placeholder="Type your message..." 
                />
                <button onClick={handleSendMessage}>Send</button>
            </div>
        </div>
    );
}

export default Chat;

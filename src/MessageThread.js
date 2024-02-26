// MessageThread.js
import React, { useState, useEffect } from 'react';

const MessageThread = ({ threadId, addMessage }) => {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');

    useEffect(() => {
        // Fetch messages for threadId here and update state
    }, [threadId]);

    const handleSubmit = (e) => {
        e.preventDefault();
        addMessage(threadId, newMessage);
        setNewMessage('');
        // Optionally refresh messages here
    };

    return (
        <div className="message-thread">
            <ul>
                {messages.map((msg, index) => (
                    <li key={index}>{msg.content}</li>
                ))}
            </ul>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                />
                <button type="submit">Send</button>
            </form>
        </div>
    );
};

export default MessageThread;
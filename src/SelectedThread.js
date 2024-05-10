import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Typography } from '@mui/material';

const SelectedThread = () => {
    const [inputValue, setInputValue] = useState('');
    const [userMessages, setUserMessages] = useState([]);
    const [systemMessages, setSystemMessages] = useState([]);
    const [systemMessageBuffer, setSystemMessageBuffer] = useState('');
    const [threadId, setThreadId] = useState(null);
    const [error, setError] = useState(null);
    const [suggestedQuestions, setSuggestedQuestions] = useState([]);
    const host = process.env.REACT_APP_ENDPOINT;

    useEffect(() => {
        const questions = process.env.REACT_APP_QUESTIONS ? process.env.REACT_APP_QUESTIONS.split(',') : [];
        setSuggestedQuestions(questions);

        let eventSource;
        if (threadId) {
            eventSource = new EventSource(`${host}/stream?threadId=${threadId}`);
            eventSource.onmessage = function (event) {
                const newEvent = JSON.parse(event.data);
                console.log(newEvent); // Log each received event for debugging

                const messageFragment = newEvent.message;

                // Continuously append the new fragment to the existing system messages
                setSystemMessages(prevMessages => {
                    // If there are no previous messages, initialize with the first fragment
                    if (prevMessages.length === 0) {
                        return [messageFragment];
                    } else {
                        // Append the new fragment to the existing (and only) message in the array
                        let updatedMessage = prevMessages[0] + messageFragment;
                        return [updatedMessage]; // Replace the existing message with the updated one
                    }
                });
            };

            eventSource.onerror = function (error) {
                console.error('EventSource failed:', error);
                eventSource.close();
            };

            return () => eventSource.close();
        }
    }, [threadId, host]);

    const ensureThreadId = async () => {
        if (!threadId) {
            try {
                const initialMessage = { role: 'user', content: inputValue };
                const response = await axios.post(`${host}/createThread`, { initialMessage });
                setThreadId(response.data.id);
                return response.data.id;
            } catch (error) {
                console.error('Error creating thread:', error);
                setError('Failed to create thread. Please try again.');
                return null;
            }
        }
        return threadId;
    };

    const handleMessageSubmit = async () => {
        const messageContent = inputValue.trim();
        if (!messageContent) {
            setError('Please enter a message before submitting.');
            return;
        }

        const ensuredThreadId = await ensureThreadId();
        if (!ensuredThreadId) {
            setError('Failed to get or create thread ID.');
            return;
        }

        try {
            await axios.post(`${host}/chat`, {
                message: messageContent,
                threadId: ensuredThreadId
            });
            setUserMessages(prev => [...prev, `You: ${messageContent}`]);
            setInputValue('');  // Clear the input after sending the message
        } catch (error) {
            console.error('Error sending message:', error);
            setError(error.message || 'Failed to send message.');
        }
    };

    const handleSuggestedClick = (question) => {
        setInputValue(question);
    };

    return (
        <div style={{ display: 'flex', fontFamily: 'Arial, sans-serif', color: '#333' }}>
            <div style={{ flex: 1, backgroundColor: '#fff', padding: '20px' }}>
                <Typography variant="body2" style={{ color: 'red', marginBottom: '10px' }}>
                    Disclaimer: This tool is a prototype for testing purposes. The advice provided here is not legal advice and should not be relied upon as such.
                </Typography>
                <h2 style={{ color: '#007bff' }}>Add Message</h2>
                {error && <div style={{ color: 'red' }}>Error: {error}</div>}
                <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    style={{ width: '100%', marginBottom: '10px' }}
                />
                <button onClick={handleMessageSubmit} style={{ display: 'block' }}>
                    Submit
                </button>
                <div>
                    {suggestedQuestions.map((question, index) => (
                        <button key={index} onClick={() => handleSuggestedClick(question)} style={{ margin: '5px', padding: '10px', backgroundColor: '#f0f0f0', border: '1px solid #ccc', borderRadius: '5px', cursor: 'pointer' }}>
                            {question}
                        </button>
                    ))}
                </div>
                <div style={{ marginTop: '20px', backgroundColor: '#f8f8f8', border: '1px solid #ddd', padding: '10px', borderRadius: '5px', minHeight: '50px' }}>
                    <h3>User Messages:</h3>
                    {userMessages.map((msg, index) => (
                        <div key={index} style={{ background: '#e1f5fe', padding: '5px', borderRadius: '5px', marginBottom: '5px' }}>
                            {msg}
                        </div>
                    ))}
                </div>
                <div style={{ marginTop: '20px', backgroundColor: '#e0f7fa', border: '1px solid #ccc', padding: '10px', borderRadius: '5px', minHeight: '50px' }}>
                    <h3>System Responses:</h3>
                    {systemMessages.map((msg, index) => (
                        <div key={index} style={{ background: '#f0f0f0', padding: '5px', borderRadius: '5px', marginBottom: '5px' }}>
                            {msg}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default SelectedThread;

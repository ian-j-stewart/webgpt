import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Typography } from '@mui/material';

const SelectedThread = () => {
    const [inputValue, setInputValue] = useState('');
    const [messages, setMessages] = useState([]);
    const [threadId, setThreadId] = useState(null);
    const [error, setError] = useState(null);
    const [suggestedQuestions, setSuggestedQuestions] = useState([]);
    const [streamActive, setStreamActive] = useState(false);
    const getHost = () => {
        const hostname = window.location.hostname;
        if (hostname.includes('localhost')) {
            return 'http://localhost:3000';
        } else if (hostname.includes('excgpt.vercel.app')) {
            return 'https://webgpt.adaptable.app';
        }
        return process.env.REACT_APP_ENDPOINT; // Fallback if none match
    };

    const host = getHost();
    //console.log(host)

    useEffect(() => {
        setSuggestedQuestions(process.env.REACT_APP_QUESTIONS ? process.env.REACT_APP_QUESTIONS.split(',') : []);
    }, []);

    useEffect(() => {
        let eventSource;
        const connectEventSource = () => {
            if (threadId && streamActive) {
                eventSource = new EventSource(`${host}/stream?threadId=${threadId}`);
                //console.log("EventSource setup initiated.");

                eventSource.onopen = () => console.log("Stream opened.");
                eventSource.onmessage = (event) => {
                    const data = JSON.parse(event.data);
                    if (data.message && data.message !== "Stream completed") {
                        setMessages(prev => {
                            const newMessages = [...prev];
                            const lastMessage = newMessages[newMessages.length - 1];
                            if (lastMessage && lastMessage.role === 'system' && !lastMessage.content.includes(data.message)) {
                                lastMessage.content +=  data.message;
                            } else if (!lastMessage || lastMessage.role !== 'system') {
                                newMessages.push({ role: 'system', content: data.message });
                            }
                            return newMessages;
                        });
                    }
                };
                eventSource.onerror = () => {
                    //console.error("Stream encountered an error. Attempting to reconnect...");
                    eventSource.close();
                    setTimeout(connectEventSource, 5000); // Retry connection after 5 seconds
                    setError('Stream connection failed. Retrying...');
                };
            }
        };

        connectEventSource();
        return () => {
            if (eventSource) eventSource.close();
        };
    }, [threadId, host, streamActive]);

    const ensureThreadId = async () => {
        if (!threadId) {
            try {
                const initialMessage = { role: 'user', content: inputValue };
                const response = await axios.post(`${host}/createThread`, { initialMessage });
                setThreadId(response.data.id);
                setStreamActive(true);  // Activate stream after creating a thread
                return response.data.id;  // Return the thread ID for further use
            } catch (error) {
                //console.error('Error creating thread:', error);
                setError('Failed to create thread. Please try again.');
                return null;  // Return null if the thread creation failed
            }
        }
        return threadId;  // Return existing thread ID if already set
    };

    const handleMessageSubmit = async () => {
        const messageContent = inputValue.trim();
        if (!messageContent) {
            setError('Please enter a message before submitting.');
            return;
        }

        const id = await ensureThreadId();
        if (id) {
            try {
                const response = await axios.post(`${host}/chat`, {
                    message: messageContent,
                    threadId: id
                });
                if (response.status === 200) {  // Check if the POST was successful
                    setMessages(prev => [...prev, { role: 'user', content: `You: ${messageContent}` }]);
                    setInputValue('');
                    setStreamActive(true);  // Re-activate the stream to await system messages
                } else {
                    throw new Error('Failed to submit message.');
                }
            } catch (error) {
                //console.error('Error sending message:', error);
                setError(error.message || 'Failed to send message.');
                setStreamActive(false);  // Deactivate stream on error
            }
        }
    };

    const handleSuggestedClick = (question) => setInputValue(question);

    return (
        <div style={{ display: 'flex', fontFamily: 'Arial, sans-serif', color: '#333' }}>
            <div style={{ flex: 1, backgroundColor: '#fff', padding: '20px' }}>
                <Typography variant="body2" style={{ color: 'red', marginBottom: '10px' }}>
                    Disclaimer: This tool is a prototype for testing purposes. The advice provided here is not legal advice and should not be relied upon as such.
                </Typography>
                <h2 style={{ color: '#007bff' }}>Add Message</h2>
                {error && <div style={{ color: 'red' }}>{error}</div>}
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
                <div style={{ marginTop: '20px' }}>
                    {messages.map((msg, index) => (
                        <div key={index} style={{ background: msg.role === 'user' ? '#e1f5fe' : '#f0f0f0', padding: '5px', borderRadius: '5px', marginBottom: '5px', textAlign: msg.role === 'user' ? 'right' : 'left' }}>
                            {msg.content}
                        </div>
                    )).reverse()}
                </div>
            </div>
        </div>
    );
};

export default SelectedThread;

import React, { useState, useEffect } from 'react';
import axios from 'axios';

const SelectedThread = () => {
    const [inputValue, setInputValue] = useState('');
    const [messages, setMessages] = useState([]);
    const [threadId, setThreadId] = useState(null);
    const [error, setError] = useState(null);
    const [suggestedQuestions, setSuggestedQuestions] = useState([]);
    const host = process.env.REACT_APP_ENDPOINT;

    var initialMessage = ""
    useEffect(() => {
        // Parse suggested questions from the environment variable
        const questions = process.env.REACT_APP_QUESTIONS ? process.env.REACT_APP_QUESTIONS.split(',') : [];
        setSuggestedQuestions(questions);
    }, []);

    // Function to ensure a thread ID is available
    const ensureThreadId = async (inputValue) => {
        if (threadId) return threadId;

        try {
            initialMessage = { role: 'user', content: inputValue };
            const response = await axios.post(`${host}/createThread`, {  });
            setThreadId(response.data.id);

            return response.data.id;
        } catch (error) {
            console.error('Error creating thread:', error);
            setError('Failed to create thread. Please try again.');
            return null;
        }
    };

    // Function to trigger a backend process on the thread

    // Function to fetch the last message from the server
    const fetchLastMessage = async (ensuredThreadId) => {
        try {
            const run = await axios.post(`${host}/run`, { threadId: ensuredThreadId });
            console.log("run result",run)
            await new Promise(resolve => setTimeout(resolve, 15000));
            const response = await axios.get(`${host}/last?threadId=${encodeURIComponent(ensuredThreadId)}`);
            console.log("last message response",response)
            if (response.data && response.data.messsages) {
                const formattedMessages = response.data.messsages
                    .filter(msg => msg.content.length > 0 && msg.content[0].text && msg.content[0].text.value)  // Check if the content array is not empty and has text value
                    .map(msg => ({
                        id: msg.id,
                        role: msg.role,
                        content: msg.content.map(content => content.text.value).join(' ')  // Combine all text content entries into a single string
                    }));
                setMessages(formattedMessages);
                setInputValue('');  // Clear the input after a successful fetch
            } else {
                console.log('No messages data received.');
            }
        } catch (error) {
            console.error('Error fetching last message:', error);
            setError('Failed to fetch last message. Please try again.');
        }
    };

    const handleMessageSubmit = async () => {

        const messageContent = inputValue; // Capture the inputValue at the time of submitting the message
        setError(null);

        if (messageContent == initialMessage) {
            setError('Please enter a message before submitting.');
            return;
        }

        const ensuredThreadId = await ensureThreadId(messageContent);
        if (!ensuredThreadId) {
            setError('Failed to get or create thread ID.');
            return;
        }

        console.log('Ensured Thread ID:', ensuredThreadId); // Debug the thread ID

        // Prevent duplicate submissions by checking the last message
        const lastMessage = messages.length > 0 ? messages[0].content : null;
        if (messageContent === lastMessage) {
            console.log('Duplicate message detected. Submission canceled.');
            return; // Stop the submission of a duplicate message
        }

        // Add the user-submitted message to the messages immediately

        const newUserMessage = {
                id: Date.now(), // Generate a unique ID for the message
                role: 'user',
                content: messageContent // Use the captured messageContent instead of inputValue
            };
        setMessages(prevMessages => [newUserMessage, ...prevMessages]); // Prepend the new message
        setInputValue('');  // Clear the input after adding the message

            // Call the API endpoint to send the message to OpenAI
        try {
            console.log(initialMessage, {role: 'user', content: messageContent})
            if (initialMessage === messageContent) {
                return;
            } else {
                const response = await fetch(`${host}/chat`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({message: messageContent, threadId: ensuredThreadId})  // Properly formatted JSON string
                });
                const responseData = await response.json(); // Convert response to JSON

                if (!response.ok) {
                    throw new Error(responseData.error || 'Failed to send message');
                }
                console.log('Message sent:', responseData);
            }
        } catch (error) {
            console.error('Error sending message:', error);
            setError(error.message || 'Failed to send message.');
        }

        await fetchLastMessage(ensuredThreadId);
    };

    // Handler for clicking a suggested question
    const handleSuggestedClick = (question) => {
        setInputValue(question);
    };

    return (
        <div style={{ display: 'flex', fontFamily: 'Arial, sans-serif', color: '#333' }}>
            <div style={{ flex: 1, backgroundColor: '#fff', padding: '20px' }}>
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
                <ul style={{ listStyleType: 'none', padding: 0 }}>
                    {messages.map((message, index) => (
                        <li key={index} style={{
                            textAlign: message.role === 'user' ? 'left' : 'right',
                            margin: '10px 0',
                            padding: '5px 10px',
                            borderRadius: '10px',
                            background: message.role === 'user' ? '#e1f5fe' : '#e0f7fa',
                            alignSelf: message.role === 'user' ? 'flex-start' : 'flex-end',
                            maxWidth: '80%',
                            marginLeft: message.role === 'user' ? '10px' : 'auto',
                            marginRight: message.role === 'user' ? 'auto' : '10px'
                        }}>
                            {message.content}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default SelectedThread;
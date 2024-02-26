import React, { useState, useEffect } from 'react';
import axios from 'axios';

const SelectedThread = () => {
    const [selectedThread, setSelectedThread] = useState(null);
    const [inputValue, setInputValue] = useState('');
    const [messages, setMessages] = useState([]);
    const [threads, setThreads] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchThreads();
    }, []);

    const fetchThreads = async () => {
        try {
            const response = await axios.get('http://localhost:3001/threads');
            setThreads(response.data);
        } catch (error) {
            console.error('Error fetching threads:', error);
            setError('Failed to fetch threads. Please try again.');
        }
    };

    const handleThreadChange = async (thread) => {
        setSelectedThread(thread);
        setMessages([]); // Clear messages when selecting a new thread
        await listMessages(thread.id); // Fetch messages for the selected thread
    };

    const handleMessageSubmit = async () => {
        try {
            let threadId = null;

            if (!selectedThread) {
                console.log('Creating new thread...');
                const response = await axios.post('http://localhost:3001/createThread', { userId: 1 });
                const newThread = response.data;
                setSelectedThread(newThread);
                threadId = newThread.id;
            } else {
                threadId = selectedThread.id;
            }

            if (!threadId) {
                throw new Error('No thread selected');
            }

            console.log('Submitting message:', inputValue);
            // Optimistically update UI with the new message
            const newMessage = {
                content: inputValue,
                role: 'User', // Assuming the message sender role is 'User'
            };
            setMessages(prevMessages => [...prevMessages, newMessage]);

            await axios.post('http://localhost:3001/chat', {
                userId: 1,
                message: inputValue,
                threadId: threadId,
            });

            // Synchronize the messages with the server state
            await listMessages(threadId);

            setInputValue('');
        } catch (error) {
            console.error('Error submitting message:', error);
            setError('Failed to submit message. Please try again.');
        }
    };

    const listMessages = async (threadId) => {
        try {
            const response = await axios.get(`http://localhost:3001/list-messages/${threadId}`);
            console.log('List of messages:', response.data);
            const messageData = response.data.data.map((message) => ({
                content: message.content[0].text.value,
                role: message.role === 'user' ? 'User' : 'Assistant',
            }));
            setMessages(messageData);
        } catch (error) {
            console.error('Error listing messages:', error);
            setError('Failed to list messages. Please try again.');
        }
    };

    return (
        <div style={{ display: 'flex', fontFamily: 'Arial, sans-serif', color: '#333' }}>
            <div style={{ width: '30%', backgroundColor: '#f5f5f5', padding: '20px' }}>
                <h2 style={{ color: '#007bff' }}>Threads</h2>
                <ul style={{ listStyleType: 'none', padding: 0 }}>
                    {threads.map((thread, index) => (
                        <li key={index} onClick={() => handleThreadChange(thread)} style={{ cursor: 'pointer', marginBottom: '10px', padding: '10px', borderRadius: '5px', backgroundColor: selectedThread && selectedThread.id === thread.id ? '#007bff' : '#fff', color: selectedThread && selectedThread.id === thread.id ? '#fff' : '#333' }}>
                            {thread.id}
                        </li>
                    ))}
                </ul>
            </div>
            <div style={{ flex: 1, backgroundColor: '#fff', padding: '20px' }}>
                <h2 style={{ color: '#007bff' }}>{selectedThread ? `Selected Thread: ${selectedThread.id}` : 'Add Message'}</h2>
                {error && <div style={{ color: 'red' }}>Error: {error}</div>}
                <div style={{ marginBottom: '20px' }}>
                    <input type="text" value={inputValue} onChange={(e) => setInputValue(e.target.value)} style={{ width: '70%', padding: '10px', marginRight: '10px', borderRadius: '5px', border: '1px solid #ccc' }} />
                    <button onClick={handleMessageSubmit} style={{ padding: '10px 20px', backgroundColor: '#007bff', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>Submit</button>
                </div>
                <div>
                    <h3 style={{ color: '#007bff' }}>Message History</h3>
                    <ul style={{ listStyleType: 'none', padding: 0 }}>
                        {messages.map((message, index) => (
                            <li key={index} style={{ marginBottom: '10px', padding: '10px', borderRadius: '5px', backgroundColor: message.role === 'User' ? '#007bff' : '#28a745', color: '#fff', textAlign: message.role === 'User' ? 'right' : 'left' }}>
                                {message.content}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default SelectedThread;

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function ConversationPage() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [userId, setUserId] = useState('');
  const [sessionId, setSessionId] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const storedUserId = localStorage.getItem('user_id');
    const storedSessionId = localStorage.getItem('session_id');
    
    if (storedUserId && storedSessionId) {
      setUserId(storedUserId);
      setSessionId(storedSessionId);
      fetchInitialQuestion(storedUserId, storedSessionId);
    } else {
      setError('Session not found. Please start a new session.');
    }
  }, [navigate]);

  // Fetch the first tutor question with a default answer
  const fetchInitialQuestion = async (user_id, session_id) => {
    setIsLoading(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/get_tutor_question`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          user_id,
          session_id,
          answer: "start the tutoring session"
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || 'Failed to get tutor question');
      }
      
      const data = await response.json();
      if (data.tutor_question) {
        setMessages([{ sender: 'tutor', text: data.tutor_question }]);
      }
    } catch (err) {
      setError(err.message || 'Failed to load tutor question.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading || !userId || !sessionId) {
      if (!userId || !sessionId) setError('Session not initialized. Please start a new session.');
      return;
    }

    // Add user message
    setMessages((prev) => [...prev, { sender: 'user', text: input }]);
    setInput('');
    setIsLoading(true);
    setError(null);

    try {
      // Process answer
      const processResponse = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/process_answer`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          user_id: userId, 
          session_id: sessionId, 
          answer: input
        }),
      });
      
      if (!processResponse.ok) {
        const errorData = await processResponse.json().catch(() => ({}));
        throw new Error(errorData.detail || 'Failed to process answer');
      }
      
      const processData = await processResponse.json();
      
      // Show feedback
      if (processData.feedback) {
        setMessages((prev) => [...prev, { 
          sender: 'tutor', 
          text: processData.feedback
        }]);
      }
      
      // Get next question
      const questionResponse = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/get_tutor_question`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          user_id: userId, 
          session_id: sessionId,
          answer: input // Or use a default string if backend expects it
        }),
      });
      
      if (!questionResponse.ok) {
        const errorData = await questionResponse.json().catch(() => ({}));
        throw new Error(errorData.detail || 'Failed to get next question');
      }
      
      const questionData = await questionResponse.json();
      if (questionData.tutor_question) {
        setMessages((prev) => [...prev, { 
          sender: 'tutor', 
          text: questionData.tutor_question
        }]);
      }
    } catch (err) {
      setError(err.message || 'Failed to process your answer. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleExit = () => {
    if (window.confirm('Are you sure you want to exit the session?')) {
      localStorage.removeItem('user_id');
      localStorage.removeItem('session_id');
      navigate('/');
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <h2>DSA Tutoring Session</h2>
      {error && <div style={{ color: 'red', marginBottom: '10px' }}>{error}</div>}
      <div
        style={{
          border: '1px solid #ccc',
          padding: '10px',
          height: '300px',
          overflowY: 'scroll',
          marginBottom: '10px',
        }}
      >
        {messages.map((msg, idx) => (
          <div
            key={idx}
            style={{
              textAlign: msg.sender === 'tutor' ? 'left' : 'right',
              margin: '5px 0',
            }}
          >
            <b>{msg.sender === 'tutor' ? 'Tutor' : 'You'}:</b> {msg.text}
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit} style={{ display: 'flex', marginBottom: '10px' }}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your answer here"
          required
          disabled={isLoading || !userId || !sessionId}
          style={{ flex: '1', padding: '10px', marginRight: '10px' }}
        />
        <button
          type="submit"
          disabled={isLoading || !userId || !sessionId}
          style={{
            padding: '10px 20px',
            background: '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
          }}
        >
          {isLoading ? 'Sending...' : 'Send'}
        </button>
      </form>
      <button
        onClick={handleExit}
        disabled={isLoading}
        style={{
          padding: '10px 20px',
          background: '#f44336',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          width: '100%',
        }}
      >
        Exit Session
      </button>
    </div>
  );
}

export default ConversationPage;

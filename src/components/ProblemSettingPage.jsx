import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function ProblemSettingPage() {
  const [problem, setProblem] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [userId, setUserId] = useState('');
  const [sessionId, setSessionId] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    async function createSession() {
      try {
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/create_session`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
        });
        if (!response.ok) throw new Error('Failed to create session');
        const data = await response.json();
        setUserId(data.user_id);
        setSessionId(data.session_id);
        localStorage.setItem('user_id', data.user_id);
        localStorage.setItem('session_id', data.session_id);
      } catch (err) {
        setError('Failed to create session. Please refresh the page.');
        console.error('Error creating session:', err);
      }
    }
    createSession();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!problem.trim() || isLoading) return;
    if (!userId || !sessionId) {
      setError('Session not initialized. Please refresh the page.');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/set_problem`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          user_id: userId, 
          session_id: sessionId, 
          problem 
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || 'Failed to set problem');
      }
      
      const data = await response.json();
      navigate('/conversation');
    } catch (err) {
      setError('Failed to set problem. Please try again.');
      console.error('Error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <h2>Set Your DSA Problem</h2>
      {error && <div style={{ color: 'red', marginBottom: '10px' }}>{error}</div>}
      <form onSubmit={handleSubmit} style={{ marginTop: '20px' }}>
        <input
          type="text"
          value={problem}
          onChange={(e) => setProblem(e.target.value)}
          placeholder="Enter your problem"
          required
          disabled={isLoading}
          style={{ width: '100%', padding: '10px', marginBottom: '10px' }}
        />
        <button
          type="submit"
          disabled={isLoading}
          style={{ padding: '10px 20px', background: '#4CAF50', color: 'white', border: 'none', borderRadius: '4px' }}
        >
          {isLoading ? 'Starting...' : 'Start Tutoring'}
        </button>
      </form>
    </div>
  );
}

export default ProblemSettingPage;

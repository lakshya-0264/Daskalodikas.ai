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

      await response.json();
      navigate('/conversation');
    } catch (err) {
      setError('Failed to set problem. Please try again.');
      console.error('Error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 px-4">
      <div className="w-full max-w-lg bg-white p-8 rounded-2xl shadow-2xl flex flex-col gap-6">
        <h2 className="text-2xl font-bold text-center text-gray-800">Set Your DSA Problem</h2>

        {error && (
          <div className="bg-red-100 text-red-700 px-4 py-2 rounded shadow text-sm">
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            value={problem}
            onChange={(e) => setProblem(e.target.value)}
            placeholder="Enter your problem"
            required
            disabled={isLoading}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-50"
          />
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg transition disabled:opacity-50"
          >
            {isLoading ? 'Starting...' : 'Start Tutoring'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default ProblemSettingPage;

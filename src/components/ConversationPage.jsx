import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

function ConversationPage() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [userId, setUserId] = useState('');
  const [sessionId, setSessionId] = useState('');
  const navigate = useNavigate();
  const messagesEndRef = useRef(null);

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
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const fetchInitialQuestion = async (user_id, session_id) => {
    setIsLoading(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/get_tutor_question`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id, session_id, answer: "start the tutoring session" }),
      });

      if (!response.ok) throw new Error('Failed to get tutor question');

      const data = await response.json();
      if (data.tutor_question) {
        setMessages([{ sender: 'tutor', text: data.tutor_question }]);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading || !userId || !sessionId) return;

    setMessages((prev) => [...prev, { sender: 'user', text: input }]);
    const userInput = input;
    setInput('');
    setIsLoading(true);
    setError(null);

    try {
      const processRes = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/process_answer`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: userId, session_id: sessionId, answer: userInput }),
      });

      if (!processRes.ok) throw new Error('Failed to process answer');
      const processData = await processRes.json();

      if (processData.feedback) {
        setMessages((prev) => [...prev, { sender: 'tutor', text: processData.feedback }]);
      }

      const questionRes = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/get_tutor_question`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: userId, session_id: sessionId, answer: userInput }),
      });

      if (!questionRes.ok) throw new Error('Failed to get next question');
      const questionData = await questionRes.json();

      if (questionData.tutor_question) {
        setMessages((prev) => [...prev, { sender: 'tutor', text: questionData.tutor_question }]);
      }
    } catch (err) {
      setError(err.message);
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
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 flex flex-col items-center px-4 py-6">
      <div className="w-full max-w-2xl bg-white shadow-2xl rounded-2xl p-6 flex flex-col gap-4">
        <h2 className="text-2xl font-bold text-center text-gray-800">DSA Tutoring Session</h2>

        {error && (
          <div className="bg-red-100 text-red-700 px-4 py-2 rounded shadow">
            ⚠️ {error}
          </div>
        )}

        <div className="flex-1 h-96 overflow-y-auto border border-gray-300 rounded-lg p-4 space-y-3 bg-gray-50">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex ${
                msg.sender === 'tutor' ? 'justify-start' : 'justify-end'
              }`}
            >
              <div
                className={`max-w-xs md:max-w-md px-4 py-2 rounded-lg shadow ${
                  msg.sender === 'tutor'
                    ? 'bg-blue-100 text-blue-800'
                    : 'bg-green-100 text-green-800'
                }`}
              >
                <span className="font-semibold">
                  {msg.sender === 'tutor' ? 'Tutor' : 'You'}:
                </span>{' '}
                {msg.text}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your answer..."
            disabled={isLoading || !userId || !sessionId}
            className="flex-1 p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <button
            type="submit"
            disabled={isLoading || !userId || !sessionId}
            className="px-5 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition disabled:opacity-50"
          >
            {isLoading ? 'Sending...' : 'Send'}
          </button>
        </form>

        <button
          onClick={handleExit}
          disabled={isLoading}
          className="mt-2 w-full py-3 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg transition disabled:opacity-50"
        >
          Exit Session
        </button>
      </div>
    </div>
  );
}

export default ConversationPage;

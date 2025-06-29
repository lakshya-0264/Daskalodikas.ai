import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Send, 
  Bot, 
  User, 
  LogOut, 
  Loader2, 
  AlertCircle, 
  Brain, 
  Code, 
  MessageCircle, 
  Sparkles,
  ChevronDown,
  Copy,
  ThumbsUp,
  ThumbsDown,
  Zap
} from 'lucide-react';

function ConversationPage() {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [userId, setUserId] = useState('');
  const [sessionId, setSessionId] = useState('');
  const [showExitModal, setShowExitModal] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [messageCount, setMessageCount] = useState(0);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    // Get session data from storage or use demo data if not available
    const storedUserId = window.localStorage?.getItem('user_id');
const storedSessionId = window.localStorage?.getItem('session_id');

if (!storedUserId || !storedSessionId) {
  setError("Session not found. Please start a new session.");
  navigate('/');
  return;
}
    
    setUserId(storedUserId);
    setSessionId(storedSessionId);
    fetchInitialQuestion(storedUserId, storedSessionId);
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchInitialQuestion = async (user_id, session_id) => {
    setIsLoading(true);
    setIsTyping(true);
    
    try {
      // Check if we have a backend URL configured
      const backendUrl = import.meta.env.VITE_BACKEND_URL;
      
      if (backendUrl) {
        // Real API call
        const response = await fetch(`${backendUrl}/get_tutor_question`, {
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
          setMessages([{ 
            sender: 'tutor', 
            text: data.tutor_question,
            timestamp: new Date(),
            id: Date.now()
          }]);
          setMessageCount(1);
        }
      } else {
        // Fallback to demo mode
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        const initialQuestion = "Welcome to your DSA tutoring session! 🚀\n\nLet's start with the basics. Can you explain what Big O notation represents and why it's important in algorithm analysis?\n\nTake your time to think through your answer - I'm here to guide you every step of the way!";
        
        setMessages([{ 
          sender: 'tutor', 
          text: initialQuestion,
          timestamp: new Date(),
          id: Date.now()
        }]);
        setMessageCount(1);
      }
    } catch (err) {
      setError(err.message || 'Failed to load tutor question.');
    } finally {
      setIsLoading(false);
      setIsTyping(false);
    }
  };

  const simulateTyping = (message) => {
    setIsTyping(true);
    const words = message.split(' ');
    let currentText = '';
    let wordIndex = 0;

    const typeInterval = setInterval(() => {
      if (wordIndex < words.length) {
        currentText += (wordIndex > 0 ? ' ' : '') + words[wordIndex];
        setMessages(prev => {
          const newMessages = [...prev];
          if (newMessages.length > 0) {
            newMessages[newMessages.length - 1] = {
              ...newMessages[newMessages.length - 1],
              text: currentText
            };
          }
          return newMessages;
        });
        wordIndex++;
      } else {
        clearInterval(typeInterval);
        setIsTyping(false);
      }
    }, 100);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading || !userId || !sessionId) {
      if (!userId || !sessionId) setError('Session not initialized. Please start a new session.');
      return;
    }

    const userMessage = {
      sender: 'user',
      text: input,
      timestamp: new Date(),
      id: Date.now()
    };

    setMessages(prev => [...prev, userMessage]);
    const currentInput = input;
    setInput('');
    setIsLoading(true);
    setError(null);
    setMessageCount(prev => prev + 1);

    try {
      const backendUrl = import.meta.env.VITE_BACKEND_URL;
      
      if (backendUrl) {
        // Real API calls
        // Process answer
        const processResponse = await fetch(`${backendUrl}/process_answer`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            user_id: userId, 
            session_id: sessionId, 
            answer: currentInput
          }),
        });
        
        if (!processResponse.ok) {
          const errorData = await processResponse.json().catch(() => ({}));
          throw new Error(errorData.detail || 'Failed to process answer');
        }
        
        const processData = await processResponse.json();
        
        // Show feedback with typing effect
        if (processData.feedback) {
          const feedbackMessage = {
            sender: 'tutor',
            text: '',
            timestamp: new Date(),
            id: Date.now() + 1
          };
          
          setMessages(prev => [...prev, feedbackMessage]);
          setMessageCount(prev => prev + 1);
          
          setTimeout(() => {
            simulateTyping(processData.feedback);
          }, 500);
          
          // Wait for typing to finish before getting next question
          await new Promise(resolve => setTimeout(resolve, processData.feedback.split(' ').length * 100 + 1000));
        }
        
        // Get next question
        const questionResponse = await fetch(`${backendUrl}/get_tutor_question`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            user_id: userId, 
            session_id: sessionId,
            answer: currentInput
          }),
        });
        
        if (!questionResponse.ok) {
          const errorData = await questionResponse.json().catch(() => ({}));
          throw new Error(errorData.detail || 'Failed to get next question');
        }
        
        const questionData = await questionResponse.json();
        if (questionData.tutor_question) {
          const questionMessage = {
            sender: 'tutor',
            text: '',
            timestamp: new Date(),
            id: Date.now() + 2
          };
          
          setMessages(prev => [...prev, questionMessage]);
          setMessageCount(prev => prev + 1);
          
          setTimeout(() => {
            simulateTyping(questionData.tutor_question);
          }, 500);
        }
      }
    } catch (err) {
      setError(err.message || 'Failed to process your answer. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleExit = () => {
    setShowExitModal(true);
  };

  const confirmExit = () => {
    // Clear storage if it exists
    if (window.localStorage) {
      window.localStorage.removeItem('user_id');
      window.localStorage.removeItem('session_id');
    }
    
    // In a real app, this would navigate to home page
    navigate('/');
    setShowExitModal(false);
    
    // Reset the component state for demo purposes
    setMessages([]);
    setUserId('');
    setSessionId('');
    setMessageCount(0);
  };

  const copyMessage = (text) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
    }
  };

  const formatMessage = (text) => {
    return text.split('\n').map((line, index) => (
      <span key={index}>
        {line}
        {index < text.split('\n').length - 1 && <br />}
      </span>
    ));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-4000"></div>
      </div>

      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full opacity-20 animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${3 + Math.random() * 4}s`
            }}
          />
        ))}
      </div>

      <div className="relative z-10 flex flex-col h-screen">
        {/* Header */}
        <div className="bg-white/10 backdrop-blur-xl border-b border-white/20 p-6">
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl shadow-lg">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">DSA Tutor Session</h1>
                <div className="text-gray-300 text-sm flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse inline-block"></span>
                  <span>Active • {messageCount} messages</span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full">
                <Zap className="w-4 h-4 text-yellow-400" />
                <span className="text-white text-sm font-medium">AI Powered</span>
              </div>
              <button
                onClick={handleExit}
                disabled={isLoading}
                className="flex items-center gap-2 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-xl transition-colors duration-200 disabled:opacity-50"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:block">Exit</span>
              </button>
            </div>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="max-w-4xl mx-auto w-full px-6 pt-4">
            <div className="p-4 bg-red-500/20 border border-red-500/30 rounded-2xl flex items-center gap-3 animate-shake">
              <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
              <span className="text-red-400 font-medium">{error}</span>
            </div>
          </div>
        )}

        {/* Messages Container */}
        <div className="flex-1 overflow-hidden">
          <div className="h-full max-w-screen mx-auto px-6 py-6">
            <div className="h-full bg-white/5 backdrop-blur-sm rounded-3xl border border-white/10 overflow-hidden">
              <div className="h-full overflow-y-auto p-6 space-y-6" style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(255,255,255,0.3) transparent' }}>
                {messages.length === 0 && !isLoading && (
                  <div className="flex flex-col items-center justify-center h-full text-center animate-fade-in">
                    <div className="p-6 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full mb-6">
                      <MessageCircle className="w-12 h-12 text-purple-400" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2">Welcome to Your Tutoring Session!</h3>
                    <p className="text-gray-400 max-w-md">Your AI tutor is getting ready to help you master Data Structures and Algorithms. Let's begin this journey together!</p>
                  </div>
                )}

                {messages.map((message, index) => (
                  <div
                    key={message.id}
                    className={`flex gap-4 animate-slide-in ${
                      message.sender === 'user' ? 'flex-row-reverse' : 'flex-row'
                    }`}
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    {/* Avatar */}
                    <div className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center shadow-lg ${
                      message.sender === 'tutor' 
                        ? 'bg-gradient-to-r from-purple-500 to-pink-500' 
                        : 'bg-gradient-to-r from-purple-500 to-pink-500'
                    }`}>
                      {message.sender === 'tutor' ? (
                        <Bot className="w-6 h-6 text-white" />
                      ) : (
                        <User className="w-6 h-6 text-white" />
                      )}
                    </div>

                    {/* Message Bubble */}
                    <div className={`flex-1 max-w-3xl ${
                      message.sender === 'user' ? 'items-end' : 'items-start'
                    }`}>
                      <div className={`group relative ${
                        message.sender === 'tutor'
                          ? 'bg-white/10 text-white'
                          : 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                      } backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 hover:bg-white/15 transition-all duration-300`}>
                        
                        {/* Message Header */}
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-sm">
                              {message.sender === 'tutor' ? 'AI Tutor' : 'You'}
                            </span>
                            {message.sender === 'tutor' && (
                              <Sparkles className="w-4 h-4 text-yellow-400" />
                            )}
                          </div>
                          <span className="text-xs text-gray-400">
                            {message.timestamp?.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>

                        {/* Message Content */}
                        <div className="text-base leading-relaxed">
                          {formatMessage(message.text)}
                        </div>

                        {/* Message Actions */}
                        <div className="flex items-center gap-2 mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                          <button
                            onClick={() => copyMessage(message.text)}
                            className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors duration-200"
                            title="Copy message"
                          >
                            <Copy className="w-4 h-4" />
                          </button>
                          {message.sender === 'tutor' && (
                            <>
                              <button className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors duration-200" title="Good response">
                                <ThumbsUp className="w-4 h-4" />
                              </button>
                              <button className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors duration-200" title="Needs improvement">
                                <ThumbsDown className="w-4 h-4" />
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Typing Indicator */}
                {isTyping && (
                  <div className="flex gap-4 animate-slide-in">
                    <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center shadow-lg">
                      <Bot className="w-6 h-6 text-white" />
                    </div>
                    <div className="bg-white/10 rounded-2xl p-6 flex items-center gap-3">
                      <div className="flex gap-1">
                        <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce animation-delay-200"></div>
                        <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce animation-delay-400"></div>
                      </div>
                      <span className="text-gray-400 text-sm">AI Tutor is thinking...</span>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>
            </div>
          </div>
        </div>

        {/* Input Area */}
        <div className="bg-white/10 backdrop-blur-xl border-t border-white/20 p-6">
          <div className="max-w-4xl mx-auto">
            <div className="relative">
              <div className="flex gap-4 bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20 focus-within:ring-2 focus-within:ring-purple-500/50 transition-all duration-300">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleSubmit(e)}
                  placeholder="Share your thoughts, ask questions, or work through the problem..."
                  disabled={isLoading || !userId || !sessionId}
                  className="flex-1 bg-transparent text-white placeholder-gray-400 focus:outline-none text-lg disabled:opacity-50"
                />
                
                <button
                  onClick={handleSubmit}
                  disabled={isLoading || !input.trim() || !userId || !sessionId}
                  className="group relative overflow-hidden bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 disabled:from-gray-600 disabled:to-gray-600 text-white p-3 rounded-xl shadow-lg transition-all duration-300 transform hover:scale-105 disabled:hover:scale-100 disabled:opacity-50"
                >
                  <div className="flex items-center gap-2">
                    {isLoading ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <Send className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
                    )}
                    <span className="hidden sm:block font-medium">
                      {isLoading ? 'Sending...' : 'Send'}
                    </span>
                  </div>
                </button>
              </div>
              
              {/* Character Counter */}
              <div className="absolute -bottom-6 right-2 text-gray-500 text-xs">
                {input.length}/500
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Exit Confirmation Modal */}
      {showExitModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in">
          <div className="bg-white/20 backdrop-blur-xl rounded-3xl p-8 max-w-md mx-4 border border-white/30 animate-zoom-in">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <LogOut className="w-8 h-8 text-red-400" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">End Session?</h3>
              <p className="text-gray-300 mb-6">
                Are you sure you want to exit your tutoring session? Your progress will be saved.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowExitModal(false)}
                  className="flex-1 px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-colors duration-200"
                >
                  Continue Learning
                </button>
                <button
                  onClick={confirmExit}
                  className="flex-1 px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl transition-colors duration-200"
                >
                  Exit Session
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes slide-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes zoom-in {
          from { opacity: 0; transform: scale(0.9); }
          to { opacity: 1; transform: scale(1); }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        
        .animate-slide-in { animation: slide-in 0.5s ease-out; }
        .animate-fade-in { animation: fade-in 0.5s ease-out; }
        .animate-zoom-in { animation: zoom-in 0.3s ease-out; }
        .animate-float { animation: float 3s ease-in-out infinite; }
        .animate-shake { animation: shake 0.5s ease-in-out; }
        
        .animation-delay-200 { animation-delay: 0.2s; }
        .animation-delay-400 { animation-delay: 0.4s; }
        .animation-delay-2000 { animation-delay: 2s; }
        .animation-delay-4000 { animation-delay: 4s; }
        
        /* Custom scrollbar */
        ::-webkit-scrollbar {
          width: 6px;
        }
        
        ::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 3px;
        }
        
        ::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.3);
          border-radius: 3px;
        }
        
        ::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.5);
        }
      `}</style>
    </div>
  );
}

export default ConversationPage;
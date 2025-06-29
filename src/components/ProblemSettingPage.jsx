import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Code, Sparkles, ArrowRight, AlertCircle, Loader2, CheckCircle, Zap, Brain, Target, Rocket } from 'lucide-react';

function ProblemSettingPage() {
  const navigate = useNavigate();
  const [problem, setProblem] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [userId, setUserId] = useState('');
  const [sessionId, setSessionId] = useState('');
  const [sessionReady, setSessionReady] = useState(false);
  const [inputFocused, setInputFocused] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [showSuccess, setShowSuccess] = useState(false);
  const containerRef = useRef(null);

  // Mouse tracking for interactive effects
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setMousePosition({
          x: ((e.clientX - rect.left) / rect.width) * 100,
          y: ((e.clientY - rect.top) / rect.height) * 100,
        });
      }
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('mousemove', handleMouseMove);
      return () => container.removeEventListener('mousemove', handleMouseMove);
    }
  }, []);

  useEffect(() => {
    let mounted = true;
    
    async function createSession() {
      try {
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/create_session`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' }
});
if (!response.ok) throw new Error('Failed to create session');
const data = await response.json();
if (mounted) {
  setUserId(data.user_id);
  setSessionId(data.session_id);
  setSessionReady(true);
  localStorage.setItem('user_id', data.user_id);
  localStorage.setItem('session_id', data.session_id);
}

      } catch (err) {
        if (mounted) {
          setError('Failed to create session. Please refresh the page.');
          console.error('Error creating session:', err);
        }
      }
    }
    
    createSession();
    return () => { mounted = false; };
  }, []);

  const handleSubmit = async (e) => {
    e?.preventDefault();
    if (!problem.trim() || isLoading) return;
    if (!userId || !sessionId) {
      setError('Session not initialized. Please refresh the page.');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      console.log('Submitting with:', { userId, sessionId, problem });
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/set_problem`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: userId,
          session_id: sessionId,
          problem
        })
      });

if (!response.ok) {
  const errorData = await response.json().catch(() => ({}));
  throw new Error(errorData.detail || 'Failed to set problem');
}

setShowSuccess(true);
setTimeout(() => {
  navigate('/conversation');
}, 100);

      
    } catch (err) {
      setError('Failed to set problem. Please try again.');
      console.error('Error:', err);
      setIsLoading(false);
    }
  };

  const suggestions = [
    { text: "Two Sum", icon: Target, color: "from-blue-500 to-cyan-500" },
    { text: "Binary Tree Traversal", icon: Brain, color: "from-green-500 to-emerald-500" },
    { text: "Dynamic Programming", icon: Zap, color: "from-yellow-500 to-orange-500" },
    { text: "Graph Algorithms", icon: Rocket, color: "from-purple-500 to-pink-500" },
    { text: "Sorting & Searching", icon: Target, color: "from-red-500 to-rose-500" }
  ];

  if (showSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-900 via-emerald-900 to-teal-900 flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${1 + Math.random() * 2}s`
              }}
            />
          ))}
        </div>
        
        <div className="text-center z-10 animate-zoom-in">
          <div className="inline-flex items-center justify-center w-32 h-32 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full mb-8 shadow-2xl animate-bounce-slow">
            <CheckCircle className="w-16 h-16 text-white" />
          </div>
          <h2 className="text-6xl font-bold text-white mb-4 animate-glow">Success!</h2>
          <p className="text-2xl text-green-200 mb-8">Initializing your tutoring session...</p>
          <div className="flex justify-center">
            <Loader2 className="w-8 h-8 text-green-400 animate-spin" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      ref={containerRef}
      className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden"
      style={{
        background: `radial-gradient(circle at ${mousePosition.x}% ${mousePosition.y}%, rgba(139, 92, 246, 0.15) 0%, transparent 50%), linear-gradient(135deg, #0f172a 0%, #581c87 50%, #0f172a 100%)`
      }}
    >
      {/* Dynamic background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div 
          className="absolute w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 transition-all duration-1000"
          style={{
            left: `${mousePosition.x * 0.1}%`,
            top: `${mousePosition.y * 0.1}%`,
            transform: `translate(-50%, -50%) scale(${1 + mousePosition.x * 0.001})`
          }}
        />
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-40 animate-float"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-40 animate-float-delayed"></div>
      </div>

      {/* Animated particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            className="absolute animate-float-particle"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 10}s`,
              animationDuration: `${8 + Math.random() * 6}s`
            }}
          >
            <div className="w-2 h-2 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full opacity-60" />
          </div>
        ))}
      </div>

      {/* Main content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-4xl">
          {/* Hero Header */}
          <div className="text-center mb-16 animate-slide-up">
            <div className="relative inline-block mb-8">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full blur-2xl opacity-50 animate-pulse-slow"></div>
              <div className="relative inline-flex items-center justify-center w-24 h-24 bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500 rounded-full shadow-2xl">
                <Code className="w-12 h-12 text-white animate-spin-slow" />
              </div>
            </div>
            
            <h1 className="text-7xl font-bold mb-6 bg-gradient-to-r from-purple-400 via-pink-400 via-blue-400 to-purple-400 bg-clip-text text-transparent animate-gradient-x">
              Daskalodikas.ai
            </h1>
            
            <p className="text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed mb-8">
              Unlock your coding potential with AI-powered tutoring. From algorithms to data structures, 
              we'll guide you through every step of your journey.
            </p>

            {/* Feature highlights */}
            <div className="flex flex-wrap justify-center gap-6 mb-8">
              {[
                { icon: Brain, text: "Smart Learning", color: "text-blue-400" },
                { icon: Zap, text: "Instant Feedback", color: "text-yellow-400" },
                { icon: Target, text: "Targeted Practice", color: "text-green-400" },
                { icon: Rocket, text: "Fast Progress", color: "text-purple-400" }
              ].map((feature, index) => (
                <div key={index} className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full animate-fade-in-up" style={{ animationDelay: `${index * 0.1}s` }}>
                  <feature.icon className={`w-5 h-5 ${feature.color}`} />
                  <span className="text-white font-medium">{feature.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Session Status */}
          <div className="flex items-center justify-center mb-12">
            <div className={`flex items-center gap-3 px-6 py-3 rounded-full transition-all duration-700 backdrop-blur-lg ${
              sessionReady 
                ? 'bg-green-500/20 text-green-400 shadow-lg shadow-green-500/25' 
                : 'bg-yellow-500/20 text-yellow-400 shadow-lg shadow-yellow-500/25'
            }`}>
              {sessionReady ? (
                <>
                  <CheckCircle className="w-5 h-5 animate-pulse" />
                  <span className="font-semibold">AI Tutor Ready</span>
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-ping"></div>
                </>
              ) : (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span className="font-semibold">Initializing AI Tutor...</span>
                </>
              )}
            </div>
          </div>

          {/* Main Interface */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-blue-500/10 rounded-3xl blur-xl"></div>
            <div className="relative bg-white/10 backdrop-blur-2xl rounded-3xl p-10 shadow-2xl border border-white/20 transition-all duration-500 hover:bg-white/15 hover:shadow-purple-500/25 hover:shadow-2xl">
              
              {/* Error Display */}
              {error && (
                <div className="mb-8 p-6 bg-red-500/20 border border-red-500/30 rounded-2xl flex items-center gap-4 animate-shake backdrop-blur-sm">
                  <AlertCircle className="w-6 h-6 text-red-400 flex-shrink-0" />
                  <span className="text-red-400 font-medium text-lg">{error}</span>
                </div>
              )}

              {/* Input Section */}
              <div className="space-y-8">
                <div className="relative group">
                  <div className={`relative transition-all duration-500 ${
                    inputFocused ? 'transform scale-105' : ''
                  }`}>
                    <input
                      type="text"
                      value={problem}
                      onChange={(e) => setProblem(e.target.value)}
                      onFocus={() => setInputFocused(true)}
                      onBlur={() => setInputFocused(false)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
                      placeholder="What DSA problem would you like to master today?"
                      disabled={isLoading || !sessionReady}
                      className="w-full px-8 py-6 bg-white/10 backdrop-blur-sm border-2 border-white/30 rounded-2xl text-white placeholder-gray-400 text-xl font-medium focus:outline-none focus:ring-4 focus:ring-purple-500/50 focus:border-purple-400 transition-all duration-300 disabled:opacity-50"
                    />
                    
                    {/* Dynamic border glow */}
                    {inputFocused && (
                      <div className="absolute inset-0 bg-gradient-to-r from-purple-500/30 via-pink-500/30 to-blue-500/30 rounded-2xl -z-10 blur-lg animate-pulse"></div>
                    )}
                  </div>
                  
                  {/* Character counter */}
                  <div className="absolute -bottom-6 right-2 text-gray-500 text-sm">
                    {problem.length}/100
                  </div>
                </div>

                {/* Popular Problems Grid */}
                {!problem && (
                  <div className="animate-fade-in-up animation-delay-300">
                    <div className="flex items-center gap-3 mb-6">
                      <Sparkles className="w-6 h-6 text-yellow-400" />
                      <h3 className="text-white text-xl font-semibold">Popular Challenges</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {suggestions.map((suggestion, index) => {
                        const IconComponent = suggestion.icon;
                        return (
                          <button
                            key={index}
                            onClick={() => setProblem(suggestion.text)}
                            disabled={isLoading || !sessionReady}
                            className={`group p-6 bg-gradient-to-r ${suggestion.color} rounded-2xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:hover:scale-100`}
                            style={{ animationDelay: `${index * 0.1}s` }}
                          >
                            <div className="flex items-center gap-4">
                              <div className="p-3 bg-white/20 rounded-xl group-hover:bg-white/30 transition-colors duration-300">
                                <IconComponent className="w-6 h-6 text-white" />
                              </div>
                              <span className="text-white font-semibold text-lg">{suggestion.text}</span>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Submit Button */}
                <button
                  onClick={handleSubmit}
                  disabled={isLoading || !sessionReady || !problem.trim()}
                  className="w-full group relative overflow-hidden bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 hover:from-purple-700 hover:via-pink-700 hover:to-blue-700 text-white font-bold py-6 px-10 rounded-2xl shadow-2xl transition-all duration-500 transform hover:scale-105 disabled:opacity-50 disabled:hover:scale-100 disabled:cursor-not-allowed"
                >
                  {/* Animated background */}
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 rounded-2xl blur-lg opacity-75 group-hover:opacity-100 transition-all duration-500 animate-gradient-x"></div>
                  
                  {/* Button content */}
                  <div className="relative flex items-center justify-center gap-4">
                    {isLoading ? (
                      <>
                        <Loader2 className="w-6 h-6 animate-spin" />
                        <span className="text-xl">Launching Your Session...</span>
                        <div className="flex gap-1">
                          {[...Array(3)].map((_, i) => (
                            <div key={i} className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: `${i * 0.1}s` }} />
                          ))}
                        </div>
                      </>
                    ) : (
                      <>
                        <Rocket className="w-6 h-6 transition-transform duration-300 group-hover:rotate-12" />
                        <span className="text-xl">Start Your Journey</span>
                        <ArrowRight className="w-6 h-6 transition-transform duration-300 group-hover:translate-x-2" />
                      </>
                    )}
                  </div>
                </button>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center mt-12 animate-fade-in-up animation-delay-600">
            <p className="text-gray-400 text-lg mb-4">
              Join thousands of developers mastering algorithms with AI guidance
            </p>
            <div className="flex justify-center gap-8 text-sm text-gray-500">
              <span>✨ Personalized Learning</span>
              <span>🚀 Real-time Feedback</span>
              <span>🎯 Interview Ready</span>
            </div>
          </div>
        </div>
      </div>

      {/* Custom Styles */}
      <style>{`
        @keyframes gradient-x {
          0%, 100% { background-size: 200% 200%; background-position: left center; }
          50% { background-size: 200% 200%; background-position: right center; }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
        }
        
        @keyframes float-delayed {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-30px) rotate(-5deg); }
        }
        
        @keyframes float-particle {
          0%, 100% { transform: translateY(0px) translateX(0px) rotate(0deg); opacity: 0.6; }
          25% { transform: translateY(-10px) translateX(5px) rotate(90deg); opacity: 1; }
          50% { transform: translateY(-20px) translateX(-5px) rotate(180deg); opacity: 0.8; }
          75% { transform: translateY(-15px) translateX(10px) rotate(270deg); opacity: 1; }
        }
        
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(50px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-10px); }
          75% { transform: translateX(10px); }
        }
        
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 1; }
        }
        
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        
        @keyframes zoom-in {
          from { opacity: 0; transform: scale(0.5); }
          to { opacity: 1; transform: scale(1); }
        }
        
        @keyframes glow {
          0%, 100% { text-shadow: 0 0 20px rgba(34, 197, 94, 0.5); }
          50% { text-shadow: 0 0 30px rgba(34, 197, 94, 0.8), 0 0 40px rgba(34, 197, 94, 0.3); }
        }
        
        .animate-gradient-x { animation: gradient-x 3s ease infinite; }
        .animate-float { animation: float 6s ease-in-out infinite; }
        .animate-float-delayed { animation: float-delayed 8s ease-in-out infinite; }
        .animate-float-particle { animation: float-particle 10s ease-in-out infinite; }
        .animate-slide-up { animation: slide-up 0.8s ease-out; }
        .animate-fade-in-up { animation: fade-in-up 0.6s ease-out; }
        .animate-shake { animation: shake 0.6s ease-in-out; }
        .animate-spin-slow { animation: spin-slow 8s linear infinite; }
        .animate-pulse-slow { animation: pulse-slow 3s ease-in-out infinite; }
        .animate-bounce-slow { animation: bounce-slow 2s ease-in-out infinite; }
        .animate-zoom-in { animation: zoom-in 0.5s ease-out; }
        .animate-glow { animation: glow 2s ease-in-out infinite; }
        
        .animation-delay-300 { animation-delay: 0.3s; }
        .animation-delay-600 { animation-delay: 0.6s; }
      `}
      </style>
    </div>
  );
}

export default ProblemSettingPage;
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ProblemSettingPage from './components/ProblemSettingPage'; // Updated path
import ConversationPage from './components/ConversationPage';     // Updated path

function App() {
  return (
   <>
      <div className = "text-3xl font-semibold text-center text-red-500">Website is under maintenance.</div>
      <div className = "text-xl text-center">Please wait for new features.</div>
   </>
    // <Router>
    //   <Routes>
    //     <Route path="/" element={<ProblemSettingPage />} />
    //     <Route path="/conversation" element={<ConversationPage />} />
    //     {/* Optional: 404 page */}
    //     <Route path="*" element={<div>Page Not Found</div>} />
    //   </Routes>
    // </Router>
  );
}

export default App;

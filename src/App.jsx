import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ProblemSettingPage from './components/ProblemSettingPage';
import ConversationPage from './components/ConversationPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<ProblemSettingPage />} />
        <Route path="/conversation" element={<ConversationPage />} />
      </Routes>
    </Router>
  );
}

export default App;

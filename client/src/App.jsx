import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Welcome from './pages/Welcome';
import Dashboard from './pages/Dashboard';
import SoloStudy from './pages/SoloStudy';
import GroupStudy from './pages/GroupStudy';
import Tasks from './pages/Tasks';
import Leaderboard from './pages/Leaderboard';
import Chatbot from './pages/Chatbot';
import Settings from './pages/Settings';
import NotFound from './pages/NotFound';
import Navbar from './components/Navbar';

function App() {
  return (
    <div className="min-h-screen bg-background font-sans antialiased">
      <Navbar />
      <main className="container mx-auto p-4 md:p-6">
        <Routes>
          <Route path="/" element={<Welcome />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/solo" element={<SoloStudy />} />
          <Route path="/group" element={<GroupStudy />} />
          <Route path="/tasks" element={<Tasks />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/chatbot" element={<Chatbot />} />
          <Route path="/settings" element={<Settings />} />
          
        </Routes>
      </main>
    </div>
  );
}

export default App;

import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';

export default function Dashboard() {
  const { name, points, studyTime, completedTasks, setName } = useContext(AppContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      setName('');
      navigate('/');
    }
  };

  const studyOptions = [
    {
      id: 'solo',
      title: 'Solo Study',
      description: 'Focus on your own tasks with a timer and AI assistance',
      icon: '🧠',
      color: 'from-indigo-500 to-purple-600',
      path: '/solo'
    },
    {
      id: 'group',
      title: 'Group Study',
      description: 'Join or create a study room with video, audio, and chat',
      icon: '👥',
      color: 'from-purple-500 to-pink-600',
      path: '/group'
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header with Logout */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-indigo-600">Virtual Study Room</h1>
        <button 
          onClick={handleLogout} 
          className="logout-btn"
        >
          <span>Logout</span>
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
            <polyline points="16 17 21 12 16 7"></polyline>
            <line x1="21" y1="12" x2="9" y2="12"></line>
          </svg>
        </button>
      </div>
      
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl p-8 mb-8 shadow-md border border-indigo-100">
        <h1 className="text-3xl font-bold text-gray-800">
          Welcome back, <span className="text-indigo-600">{name || 'Student'}</span>!
        </h1>
        <p className="text-gray-600 mt-2">Ready for another productive study session?</p>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-2xl shadow-md p-6 flex flex-col items-center justify-center transition-all hover:shadow-lg border border-indigo-50">
          <div className="text-4xl mb-3">🏆</div>
          <div className="text-3xl font-bold text-indigo-600">{points}</div>
          <div className="text-gray-500 text-sm font-medium">Total Points</div>
        </div>
        
        <div className="bg-white rounded-2xl shadow-md p-6 flex flex-col items-center justify-center transition-all hover:shadow-lg border border-indigo-50">
          <div className="text-4xl mb-3">⏱️</div>
          <div className="text-3xl font-bold text-purple-600">{Math.floor(studyTime / 60)}h {studyTime % 60}m</div>
          <div className="text-gray-500 text-sm font-medium">Study Time</div>
        </div>
        
        <div className="bg-white rounded-2xl shadow-md p-6 flex flex-col items-center justify-center transition-all hover:shadow-lg border border-indigo-50">
          <div className="text-4xl mb-3">📝</div>
          <div className="text-3xl font-bold text-green-600">{completedTasks}</div>
          <div className="text-gray-500 text-sm font-medium">Tasks Completed</div>
        </div>
        
        <div className="bg-white rounded-2xl shadow-md p-6 flex flex-col items-center justify-center transition-all hover:shadow-lg border border-indigo-50">
          <div className="text-4xl mb-3">🔥</div>
          <div className="text-3xl font-bold text-orange-600">
            <Link to="/leaderboard" className="hover:underline">
              Leaderboard
            </Link>
          </div>
          <div className="text-gray-500 text-sm font-medium">See Rankings</div>
        </div>
      </div>

      {/* Study Options */}
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Study Options</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {studyOptions.map((option) => (
          <div 
            key={option.id}
            className={`bg-gradient-to-r ${option.color} rounded-2xl p-8 text-white shadow-lg hover:shadow-xl transition-all cursor-pointer border border-opacity-20 border-white`}
            onClick={() => navigate(option.path)}
          >
            <div className="flex items-center">
              <div className="text-5xl mr-6">{option.icon}</div>
              <div>
                <h3 className="text-2xl font-bold mb-2">{option.title}</h3>
                <p className="text-white text-opacity-90">{option.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Links */}
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Quick Links</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Link to="/tasks" className="bg-white rounded-xl shadow-sm p-5 text-center transition-all hover:shadow-md hover:translate-y-[-2px]">
          <div className="text-3xl mb-2">📝</div>
          <div className="font-medium">Tasks</div>
        </Link>
        
        <Link to="/leaderboard" className="bg-white rounded-xl shadow-sm p-5 text-center transition-all hover:shadow-md hover:translate-y-[-2px]">
          <div className="text-3xl mb-2">🏆</div>
          <div className="font-medium">Leaderboard</div>
        </Link>
        
        <Link to="/chatbot" className="bg-white rounded-xl shadow-sm p-5 text-center transition-all hover:shadow-md hover:translate-y-[-2px]">
          <div className="text-3xl mb-2">🤖</div>
          <div className="font-medium">AI Assistant</div>
        </Link>
        
        <Link to="/settings" className="bg-white rounded-xl shadow-sm p-5 text-center transition-all hover:shadow-md hover:translate-y-[-2px]">
          <div className="text-3xl mb-2">⚙️</div>
          <div className="font-medium">Settings</div>
        </Link>
      </div>
    </div>
  );
}

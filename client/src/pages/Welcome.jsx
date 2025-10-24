import React, { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';

export default function Welcome() {
  const { name, setName } = useContext(AppContext);
  const [inputName, setInputName] = useState(name || '');
  const navigate = useNavigate();

  useEffect(() => {
    if (name) navigate('/dashboard');
  }, [name, navigate]);

  const handleGetStarted = () => {
    if (!inputName.trim()) return alert('Please enter your name to get started.');
    setName(inputName.trim());
    navigate('/dashboard');
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-indigo-50 to-white p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-10 transform transition-all hover:scale-[1.01] border border-indigo-100">
        <div className="text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
            Virtual Study Room
          </h1>
          <div className="h-1 w-24 bg-gradient-to-r from-indigo-600 to-purple-600 mx-auto mb-6"></div>
          <p className="text-gray-600 mb-8 leading-relaxed">
            Your all-in-one space for focused solo sessions and collaborative group study. Track your progress, connect with peers, and boost your productivity.
          </p>
        </div>
        
        <div className="space-y-6">
          <div className="relative">
            <input 
              value={inputName} 
              onChange={e => setInputName(e.target.value)} 
              onKeyUp={(e) => e.key === 'Enter' && handleGetStarted()} 
              className="w-full p-5 border border-indigo-200 rounded-xl bg-indigo-50 focus:ring-3 focus:ring-indigo-500 focus:border-transparent transition-all text-center text-lg outline-none font-medium" 
              placeholder="Enter your name" 
            />
          </div>
          
          <button 
            onClick={handleGetStarted} 
            className="w-full py-5 px-6 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1 focus:outline-none focus:ring-3 focus:ring-indigo-500 focus:ring-opacity-50 text-lg"
          >
            Get Started
          </button>
        </div>
      </div>
    </div>
  );
}

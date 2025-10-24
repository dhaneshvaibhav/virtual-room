import React, { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';
import { clearAll } from '../utils/storage';

export default function Settings() {
  const { 
    name, 
    setName, 
    theme, 
    setTheme, 
    timerDuration, 
    setTimerDuration 
  } = useContext(AppContext);

  const [newName, setNewName] = useState(name);

  const handleSave = () => {
    setName(newName);
    alert('Settings saved!');
  };

  const handleClearData = () => {
    if (window.confirm('Are you sure you want to clear all your data? This action cannot be undone.')) {
      clearAll();
      window.location.reload();
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <h2 className="text-2xl font-bold mb-6">Settings</h2>

        <div className="space-y-6">
          {/* Name Change */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Your Name</label>
            <input 
              type="text" 
              value={newName} 
              onChange={(e) => setNewName(e.target.value)} 
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Theme Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Theme</label>
            <select 
              value={theme} 
              onChange={(e) => setTheme(e.target.value)} 
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
            >
              <option value="light">Light</option>
              <option value="dark">Dark</option>
            </select>
          </div>

          {/* Timer Duration */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Default Timer Duration (minutes)</label>
            <select 
              value={timerDuration} 
              onChange={(e) => setTimerDuration(parseInt(e.target.value))} 
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
            >
              <option value={15}>15</option>
              <option value={25}>25</option>
              <option value={30}>30</option>
              <option value={45}>45</option>
              <option value={60}>60</option>
            </select>
          </div>

          {/* Save Button */}
          <button 
            onClick={handleSave} 
            className="w-full btn-primary py-3"
          >
            Save Settings
          </button>

          {/* Clear Data */}
          <div className="border-t pt-6 mt-6">
            <h3 className="text-lg font-medium text-red-600">Danger Zone</h3>
            <p className="text-sm text-gray-600 mb-4">Clearing your data will permanently delete your name, points, tasks, and study history.</p>
            <button 
              onClick={handleClearData} 
              className="w-full btn bg-red-600 text-white hover:bg-red-700 py-3"
            >
              Clear All Data
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
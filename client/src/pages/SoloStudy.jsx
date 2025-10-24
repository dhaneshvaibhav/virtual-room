import React, { useContext, useState, useEffect } from 'react';
import { AppContext } from '../context/AppContext';
import AIChatbot from '../components/AIChatbot';
import { getChatbotReply } from '../api/mockAI';

export default function SoloStudy() {
  const { 
    tasks, 
    setTasks, 
    addPoints, 
    timerDuration, 
    setTimerDuration, 
    addStudySession, 
    completeTask 
  } = useContext(AppContext);

  // Timer state
  const [timeLeft, setTimeLeft] = useState(timerDuration * 60);
  const [isActive, setIsActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [sessionCompleted, setSessionCompleted] = useState(false);
  
  // Task management
  const [newTask, setNewTask] = useState('');
  const [activeTasks, setActiveTasks] = useState([]);
  const [completedTasks, setCompletedTasks] = useState([]);
  // Solo chat state (local only)
  const [chatMessages, setChatMessages] = useState([]);
  const [chatNewMessage, setChatNewMessage] = useState('');
  


  // Initialize tasks
  useEffect(() => {
    if (tasks) {
      setActiveTasks(tasks.filter(task => !task.completed));
      setCompletedTasks(tasks.filter(task => task.completed));
    }
  }, [tasks]);

  // Timer logic
  useEffect(() => {
    let interval = null;
    
    if (isActive && !isPaused && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(timeLeft => timeLeft - 1);
      }, 1000);
    } else if (timeLeft === 0 && isActive) {
      setIsActive(false);
      setSessionCompleted(true);
      addPoints(Math.floor(timerDuration / 5)); // Points based on duration
      addStudySession(timerDuration, 'solo', completedTasks.length);
      

    } else {
      clearInterval(interval);
    }
    
    return () => clearInterval(interval);
  }, [isActive, isPaused, timeLeft, timerDuration, addPoints, addStudySession, completedTasks.length]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Timer controls
  const startTimer = () => {
    setIsActive(true);
    setIsPaused(false);
    setSessionCompleted(false);
  };

  const pauseTimer = () => {
    setIsPaused(true);
  };

  const resumeTimer = () => {
    setIsPaused(false);
  };

  const resetTimer = () => {
    setTimeLeft(timerDuration * 60);
    setIsActive(false);
    setIsPaused(false);
    setSessionCompleted(false);
  };

  // Task management
  const handleAddTask = (e) => {
    e.preventDefault();
    if (!newTask.trim()) return;
    
    const task = {
      id: Date.now().toString(),
      content: newTask.trim(),
      completed: false,
      createdAt: new Date().toISOString()
    };
    
    setTasks(prev => [...prev, task]);
    setActiveTasks(prev => [...prev, task]);
    setNewTask('');
  };

  const handleCompleteTask = (taskId) => {
    const updatedTasks = tasks.map(task => 
      task.id === taskId ? { ...task, completed: true } : task
    );
    
    setTasks(updatedTasks);
    setActiveTasks(updatedTasks.filter(task => !task.completed));
    setCompletedTasks(updatedTasks.filter(task => task.completed));
    
    completeTask(taskId);
  };


  // Handle timer duration change
  const handleDurationChange = (e) => {
    const newDuration = parseInt(e.target.value);
    setTimerDuration(newDuration);
    setTimeLeft(newDuration * 60);
  };

  // Solo message send with inline AI reply
  const sendSoloMessage = async (e) => {
    e.preventDefault();
    const msg = chatNewMessage.trim();
    if (!msg) return;
    setChatNewMessage('');
    const ts = new Date().toISOString();
    setChatMessages(prev => [...prev, { sender: 'You', text: msg, timestamp: ts }]);
    try {
      const reply = await getChatbotReply(msg);
      setChatMessages(prev => [...prev, { sender: 'AI', text: reply, timestamp: new Date().toISOString() }]);
    } catch {}
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Solo Study Session</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Column - Timer and Tasks */}
        <div className="lg:col-span-3 space-y-6">
          {/* Timer Section */}
          <div className="card">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-gradient-to-br from-primary-500 to-accent-500 rounded-xl">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h2 className="text-xl font-bold text-primary-700">Focus Timer</h2>
                <p className="text-sm text-secondary-500">Stay focused and productive</p>
              </div>
            </div>
            
            <div className="flex flex-col items-center">
              {/* Round Timer Display */}
              <div className="relative mb-8">
                <div className="w-64 h-64 rounded-full border-8 border-gray-200 flex items-center justify-center bg-white shadow-strong relative overflow-hidden">
                  {/* Background Pattern */}
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 opacity-50"></div>
                  
                  {/* Timer Text */}
                  <div className="text-center relative z-10">
                    <div className="text-6xl font-bold text-gray-800 mb-3 font-mono tracking-wider">
                      {formatTime(timeLeft)}
                    </div>
                    <div className="text-base text-gray-600 font-semibold">
                      {isActive ? (isPaused ? 'PAUSED' : 'RUNNING') : 'READY'}
                    </div>
                  </div>
                  
                  {/* Progress Ring */}
                  {isActive && !isPaused && (
                    <svg className="absolute inset-0 w-64 h-64 transform -rotate-90" viewBox="0 0 100 100">
                      <circle
                        cx="50"
                        cy="50"
                        r="45"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                        className="text-gray-200"
                      />
                      <circle
                        cx="50"
                        cy="50"
                        r="45"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="4"
                        strokeLinecap="round"
                        className="text-blue-500 transition-all duration-1000"
                        strokeDasharray={`${2 * Math.PI * 45}`}
                        strokeDashoffset={`${2 * Math.PI * 45 * (1 - (timeLeft / (timerDuration * 60)))}`}
                      />
                    </svg>
                  )}
                </div>
              </div>
              {/* Visible Countdown Progress Bar */}
              {isActive && !isPaused && (
                <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
                  <div 
                    className="bg-indigo-600 h-2.5 rounded-full transition-all duration-1000" 
                    style={{ width: `${(timeLeft / (timerDuration * 60)) * 100}%` }}
                  ></div>
                </div>
              )}
              
              {/* Timer Controls */}
              <div className="flex justify-center gap-3 mt-6">
                {!isActive && !isPaused && !sessionCompleted && (
                  <button 
                    onClick={startTimer}
                    className="btn btn-primary px-6 py-3 flex items-center gap-2"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polygon points="5 3 19 12 5 21 5 3"></polygon>
                    </svg>
                    Start Focus Session
                  </button>
                )}
                
                {isActive && !isPaused && (
                  <button 
                    onClick={pauseTimer}
                    className="btn btn-secondary px-6 py-3 flex items-center gap-2"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="6" y="4" width="4" height="16"></rect>
                      <rect x="14" y="4" width="4" height="16"></rect>
                    </svg>
                    Pause
                  </button>
                )}
                
                {isActive && isPaused && (
                  <button 
                    onClick={resumeTimer}
                    className="btn btn-primary px-6 py-3 flex items-center gap-2"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polygon points="5 3 19 12 5 21 5 3"></polygon>
                    </svg>
                    Resume
                  </button>
                )}
                
                {(isActive || isPaused || sessionCompleted) && (
                  <button 
                    onClick={resetTimer}
                    className="btn btn-danger px-6 py-3 flex items-center gap-2"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M2.5 2v6h6M21.5 22v-6h-6"></path>
                      <path d="M22 11.5A10 10 0 0 0 3.2 7.2M2 12.5a10 10 0 0 0 18.8 4.2"></path>
                    </svg>
                    Reset
                  </button>
                )}
              </div>
              
              {/* Session Completed Message */}
              {sessionCompleted && (
                <div className="bg-green-50 text-green-700 p-4 rounded-lg mb-4 text-center">
                  <p className="font-medium">Great job! You've completed your study session.</p>
                  <p>You earned {Math.floor(timerDuration / 5)} points!</p>
                </div>
              )}
              
              {/* Timer Duration Selector */}
              <div className="w-full max-w-xs mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Session Duration (minutes):
                </label>
                <select 
                  value={timerDuration} 
                  onChange={handleDurationChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  disabled={isActive || isPaused}
                >
                  <option value="15">15 minutes</option>
                  <option value="25">25 minutes</option>
                  <option value="30">30 minutes</option>
                  <option value="45">45 minutes</option>
                  <option value="60">60 minutes</option>
                </select>
              </div>
            </div>
          </div>
          
          {/* Task Management */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-4">Tasks</h2>
            
            {/* Add Task Form */}
            <form onSubmit={handleAddTask} className="mb-4">
              <div className="flex">
                <input
                  type="text"
                  value={newTask}
                  onChange={(e) => setNewTask(e.target.value)}
                  placeholder="Add a new task..."
                  className="flex-grow p-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white font-medium rounded-r-md"
                >
                  Add
                </button>
              </div>
            </form>
            
            {/* Active Tasks */}
            <div className="mb-6">
              <h3 className="font-medium text-gray-700 mb-2">Current Tasks</h3>
              {activeTasks.length === 0 ? (
                <p className="text-gray-500 text-sm">No active tasks. Add one above!</p>
              ) : (
                <ul className="space-y-2">
                  {activeTasks.map(task => (
                    <li key={task.id} className="flex items-center p-3 bg-gray-50 rounded-md">
                      <input
                        type="checkbox"
                        checked={false}
                        onChange={() => handleCompleteTask(task.id)}
                        className="mr-3 h-5 w-5 text-blue-600"
                      />
                      <span>{task.content}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            
            {/* Completed Tasks */}
            {completedTasks.length > 0 && (
              <div>
                <h3 className="font-medium text-gray-700 mb-2">Completed Tasks</h3>
                <ul className="space-y-2">
                  {completedTasks.map(task => (
                    <li key={task.id} className="flex items-center p-3 bg-gray-50 rounded-md opacity-70">
                      <input
                        type="checkbox"
                        checked={true}
                        readOnly
                        className="mr-3 h-5 w-5 text-green-600"
                      />
                      <span className="line-through">{task.content}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
        
        {/* Right Column - AI Chat Only */}
        <div className="lg:col-span-1">
          <AIChatbot />
        </div>
      </div>
    </div>
  );
}

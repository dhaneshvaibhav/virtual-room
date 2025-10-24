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

  const [timeLeft, setTimeLeft] = useState(timerDuration * 60);
  const [isActive, setIsActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [sessionCompleted, setSessionCompleted] = useState(false);
  const [newTask, setNewTask] = useState('');
  const [activeTasks, setActiveTasks] = useState([]);
  const [completedTasks, setCompletedTasks] = useState([]);
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
      interval = setInterval(() => setTimeLeft(timeLeft => timeLeft - 1), 1000);
    } else if (timeLeft === 0 && isActive) {
      setIsActive(false);
      setSessionCompleted(true);
      addPoints(Math.floor(timerDuration / 5));
      addStudySession(timerDuration, 'solo', completedTasks.length);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isActive, isPaused, timeLeft, timerDuration, addPoints, addStudySession, completedTasks.length]);

  const formatTime = seconds => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const startTimer = () => { setIsActive(true); setIsPaused(false); setSessionCompleted(false); };
  const pauseTimer = () => setIsPaused(true);
  const resumeTimer = () => setIsPaused(false);
  const resetTimer = () => {
    setTimeLeft(timerDuration * 60);
    setIsActive(false);
    setIsPaused(false);
    setSessionCompleted(false);
  };

  const handleAddTask = e => {
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

  const handleCompleteTask = taskId => {
    const updatedTasks = tasks.map(task => task.id === taskId ? { ...task, completed: true } : task);
    setTasks(updatedTasks);
    setActiveTasks(updatedTasks.filter(task => !task.completed));
    setCompletedTasks(updatedTasks.filter(task => task.completed));
    completeTask(taskId);
  };

  const handleDurationChange = e => {
    const newDuration = parseInt(e.target.value);
    setTimerDuration(newDuration);
    setTimeLeft(newDuration * 60);
  };

  const sendSoloMessage = async e => {
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
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Solo Study Session</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Column: Timer & Tasks */}
        <div className="lg:col-span-3 space-y-6">
          {/* Timer Section */}
          <div className="bg-white shadow rounded-xl p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-700">Focus Timer</h2>
                <p className="text-sm text-gray-500">Stay focused and productive</p>
              </div>
            </div>

            <div className="flex flex-col items-center">
              {/* Timer Circle */}
              <div className="relative mb-6">
                <div className="w-64 h-64 rounded-full border-8 border-gray-200 flex items-center justify-center bg-white shadow-lg relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 opacity-50"></div>
                  <div className="text-center relative z-10">
                    <div className="text-6xl font-bold text-gray-800 mb-3 font-mono tracking-wider">{formatTime(timeLeft)}</div>
                    <div className="text-base text-gray-600 font-semibold">{isActive ? (isPaused ? 'PAUSED' : 'RUNNING') : 'READY'}</div>
                  </div>
                  {isActive && !isPaused && (
                    <svg className="absolute inset-0 w-64 h-64 transform -rotate-90" viewBox="0 0 100 100">
                      <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="3" className="text-gray-200" />
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

              {/* Countdown Bar */}
              {isActive && !isPaused && (
                <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
                  <div 
                    className="bg-indigo-600 h-2.5 rounded-full transition-all duration-1000" 
                    style={{ width: `${(timeLeft / (timerDuration * 60)) * 100}%` }}
                  ></div>
                </div>
              )}

              {/* Timer Controls */}
              <div className="flex justify-center gap-3 mt-6 flex-wrap">
                {!isActive && !isPaused && !sessionCompleted && (
                  <button onClick={startTimer} className="px-6 py-3 bg-blue-600 text-white rounded-lg flex items-center gap-2 hover:bg-blue-700 transition">
                    Start
                  </button>
                )}
                {isActive && !isPaused && (
                  <button onClick={pauseTimer} className="px-6 py-3 bg-gray-300 text-gray-700 rounded-lg flex items-center gap-2 hover:bg-gray-400 transition">
                    Pause
                  </button>
                )}
                {isActive && isPaused && (
                  <button onClick={resumeTimer} className="px-6 py-3 bg-blue-600 text-white rounded-lg flex items-center gap-2 hover:bg-blue-700 transition">
                    Resume
                  </button>
                )}
                {(isActive || isPaused || sessionCompleted) && (
                  <button onClick={resetTimer} className="px-6 py-3 bg-red-600 text-white rounded-lg flex items-center gap-2 hover:bg-red-700 transition">
                    Reset
                  </button>
                )}
              </div>

              {sessionCompleted && (
                <div className="bg-green-50 text-green-700 p-4 rounded-lg mt-4 text-center">
                  <p className="font-medium">Great job! Session completed.</p>
                  <p>You earned {Math.floor(timerDuration / 5)} points!</p>
                </div>
              )}
            </div>
          </div>

          {/* Tasks Section */}
          <div className="bg-white shadow rounded-xl p-6">
            <h2 className="text-2xl font-bold mb-4 text-gray-700">Tasks</h2>
            <form onSubmit={handleAddTask} className="flex gap-2 mb-4">
              <input 
                type="text" 
                value={newTask} 
                onChange={e => setNewTask(e.target.value)}
                placeholder="Add a new task..." 
                className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">Add</button>
            </form>

            <ul className="space-y-2">
              {activeTasks.map(task => (
                <li 
                  key={task.id} 
                  className="flex items-center p-3 bg-white rounded-lg shadow-sm hover:shadow-md transition cursor-pointer"
                  onClick={() => handleCompleteTask(task.id)}
                >
                  <input type="checkbox" checked={false} className="mr-3 h-5 w-5 text-blue-600" readOnly />
                  <span className="text-gray-800">{task.content}</span>
                </li>
              ))}
            </ul>

            {completedTasks.length > 0 && (
              <div className="mt-6">
                <h3 className="font-medium text-gray-700 mb-2">Completed Tasks</h3>
                <ul className="space-y-2">
                  {completedTasks.map(task => (
                    <li key={task.id} className="flex items-center p-3 bg-green-50 rounded-lg opacity-80 line-through text-gray-500">
                      <input type="checkbox" checked={true} readOnly className="mr-3 h-5 w-5 text-green-600" />
                      <span>{task.content}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: AI Chat */}
        <div className="bg-white shadow rounded-xl p-6 flex flex-col h-[80vh]">
          <h2 className="text-2xl font-bold mb-4 text-gray-700">AI Study Buddy</h2>
          <div className="flex-1 overflow-y-auto mb-4 space-y-2">
            {chatMessages.map((msg, idx) => (
              <div key={idx} className={`p-2 rounded-lg max-w-xs ${msg.sender === 'You' ? 'bg-blue-100 self-end ml-auto' : 'bg-gray-100 self-start mr-auto'}`}>
                <p className="text-sm">{msg.text}</p>
                <span className="text-xs text-gray-400">{new Date(msg.timestamp).toLocaleTimeString()}</span>
              </div>
            ))}
          </div>

          <form onSubmit={sendSoloMessage} className="flex gap-2">
            <input 
              type="text"
              value={chatNewMessage}
              onChange={e => setChatNewMessage(e.target.value)}
              placeholder="Type a message..."
              className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">Send</button>
          </form>
        </div>
      </div>
    </div>
  );
}

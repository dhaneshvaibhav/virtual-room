import React, { createContext, useEffect, useState } from 'react';
import { loadFromStorage, saveToStorage } from '../utils/storage';

export const AppContext = createContext();

export function AppProvider({ children }) {
  // User information
  const [name, setName] = useState(loadFromStorage('name') || '');
  
  // Study tracking
  const [points, setPoints] = useState(loadFromStorage('points') || 0);
  const [studyTime, setStudyTime] = useState(loadFromStorage('studyTime') || 0);
  const [studyHistory, setStudyHistory] = useState(loadFromStorage('studyHistory') || []);
  
  // Tasks management
  const [tasks, setTasks] = useState(loadFromStorage('tasks') || []);
  const [completedTasks, setCompletedTasks] = useState(loadFromStorage('completedTasks') || 0);
  
  // Group study
  const [groupCode, setGroupCode] = useState('');
  const [activeGroup, setActiveGroup] = useState(null);
  const [groupMembers, setGroupMembers] = useState([]);
  
  // UI preferences
  const [theme, setTheme] = useState(loadFromStorage('theme') || 'light');
  const [timerDuration, setTimerDuration] = useState(loadFromStorage('timerDuration') || 30); // Default 30 minutes
  
  // Persist data to local storage
  useEffect(() => saveToStorage('name', name), [name]);
  useEffect(() => saveToStorage('points', points), [points]);
  useEffect(() => saveToStorage('tasks', tasks), [tasks]);
  useEffect(() => saveToStorage('studyTime', studyTime), [studyTime]);
  useEffect(() => saveToStorage('studyHistory', studyHistory), [studyHistory]);
  useEffect(() => saveToStorage('completedTasks', completedTasks), [completedTasks]);
  useEffect(() => saveToStorage('timerDuration', timerDuration), [timerDuration]);
  useEffect(() => { 
    saveToStorage('theme', theme); 
    document.documentElement.setAttribute('data-theme', theme === 'dark' ? 'dark' : 'light'); 
  }, [theme]);
  
  // Helper functions
  const addPoints = (n) => setPoints(p => p + n);
  
  const addStudySession = (duration, type, tasksDone = 0) => {
    const session = {
      date: new Date().toISOString(),
      duration,
      type, // 'solo' or 'group'
      tasksDone
    };
    setStudyHistory(prev => [...prev, session]);
    setStudyTime(prev => prev + duration);
    addPoints(Math.floor(duration / 5)); // 1 point per 5 minutes of study
  };
  
  const completeTask = (taskId) => {
    setTasks(prev => prev.map(task => 
      task.id === taskId ? { ...task, completed: true } : task
    ));
    setCompletedTasks(prev => prev + 1);
    addPoints(5); // 5 points per completed task
  };
  
  return (
    <AppContext.Provider 
      value={{ 
        name, setName, 
        points, addPoints, setPoints, 
        tasks, setTasks,
        completedTasks, setCompletedTasks, completeTask,
        studyTime, setStudyTime, 
        studyHistory, setStudyHistory, addStudySession,
        groupCode, setGroupCode,
        activeGroup, setActiveGroup,
        groupMembers, setGroupMembers,
        theme, setTheme,
        timerDuration, setTimerDuration
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

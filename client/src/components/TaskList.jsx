import React, { useState } from 'react';

export default function TaskList({ tasks, setTasks }) {
  const [newTask, setNewTask] = useState('');

  const addTask = () => {
    if (!newTask.trim()) return;
    const task = { id: Date.now(), text: newTask.trim(), completed: false };
    setTasks([...tasks, task]);
    setNewTask('');
  };

  const toggleTask = (id) => {
    setTasks(tasks.map(task => task.id === id ? { ...task, completed: !task.completed } : task));
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  return (
    <div className="card">
      <h3 className="text-xl font-semibold mb-4">My Tasks</h3>
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          onKeyUp={(e) => e.key === 'Enter' && addTask()}
          placeholder="Add a new task..."
          className="flex-1 px-3 py-2 border border-input bg-transparent rounded-md"
        />
        <button onClick={addTask} className="btn bg-primary text-primary-foreground hover:bg-primary/90">Add</button>
      </div>

      <ul className="space-y-2">
        {tasks.length === 0 && <p className="text-sm text-muted-foreground text-center py-4">No tasks yet. Add one to get started!</p>}
        {tasks.map(task => (
          <li key={task.id} className="flex items-center justify-between p-2 bg-secondary rounded-md">
            <span
              onClick={() => toggleTask(task.id)}
              className={`cursor-pointer ${task.completed ? 'line-through text-muted-foreground' : ''}`}
            >
              {task.text}
            </span>
            <button
              onClick={() => deleteTask(task.id)}
              className="text-red-500 hover:text-red-700 font-bold px-2"
            >
              &times;
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
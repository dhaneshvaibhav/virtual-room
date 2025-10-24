import React, { useContext } from 'react';
import TaskList from '../components/TaskList';
import { AppContext } from '../context/AppContext';

export default function Tasks() {
  const { tasks, setTasks } = useContext(AppContext);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Task Management</h1>
      <TaskList tasks={tasks} setTasks={setTasks} />
    </div>
  );
}
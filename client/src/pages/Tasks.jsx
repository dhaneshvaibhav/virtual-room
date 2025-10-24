import React, { useContext } from 'react';
import TaskList from '../components/TaskList';
import { AppContext } from '../context/AppContext';

export default function Tasks() {
  const { tasks, setTasks } = useContext(AppContext);

  return (
    <div className="container my-5">
      <div className="card shadow-sm">
        <div className="card-body">
          <h1 className="card-title mb-4">Task Management</h1>
          <TaskList tasks={tasks} setTasks={setTasks} />
        </div>
      </div>
    </div>
  );
}

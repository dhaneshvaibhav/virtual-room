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
      color: 'bg-primary text-white',
      path: '/solo'
    },
    {
      id: 'group',
      title: 'Group Study',
      description: 'Join or create a study room with video, audio, and chat',
      icon: '👥',
      color: 'bg-danger text-white',
      path: '/group'
    }
  ];

  return (
    <div className="container py-5">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="text-primary">Virtual Study Room</h1>
        <button className="btn btn-outline-primary d-flex align-items-center" onClick={handleLogout}>
          Logout
          <i className="bi bi-box-arrow-right ms-2"></i>
        </button>
      </div>

      {/* Welcome Section */}
      <div className="card shadow-sm mb-5">
        <div className="card-body text-center">
          <h2 className="card-title fw-bold">
            Welcome back, <span className="text-primary">{name || 'Student'}</span>!
          </h2>
          <p className="text-muted">Ready for another productive study session?</p>
        </div>
      </div>

      {/* Stats Section */}
      <div className="row g-4 mb-5">
        <div className="col-md-3">
          <div className="card text-center shadow-sm p-4">
            <div className="display-6 mb-2">🏆</div>
            <h3 className="fw-bold text-primary">{points}</h3>
            <p className="text-muted mb-0">Total Points</p>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card text-center shadow-sm p-4">
            <div className="display-6 mb-2">⏱️</div>
            <h3 className="fw-bold text-success">{Math.floor(studyTime / 60)}h {studyTime % 60}m</h3>
            <p className="text-muted mb-0">Study Time</p>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card text-center shadow-sm p-4">
            <div className="display-6 mb-2">📝</div>
            <h3 className="fw-bold text-warning">{completedTasks}</h3>
            <p className="text-muted mb-0">Tasks Completed</p>
          </div>
        </div>

        <div className="col-md-3">
          <Link to="/leaderboard" className="text-decoration-none">
            <div className="card text-center shadow-sm p-4">
              <div className="display-6 mb-2">🔥</div>
              <h3 className="fw-bold text-danger">Leaderboard</h3>
              <p className="text-muted mb-0">See Rankings</p>
            </div>
          </Link>
        </div>
      </div>

      {/* Study Options */}
      <h4 className="fw-bold mb-4">Study Options</h4>
      <div className="row g-4 mb-5">
        {studyOptions.map((option) => (
          <div key={option.id} className="col-md-6">
            <div
              className={`card p-4 shadow-lg ${option.color} cursor-pointer`}
              style={{ cursor: 'pointer' }}
              onClick={() => navigate(option.path)}
            >
              <div className="d-flex align-items-center">
                <div className="display-4 me-3">{option.icon}</div>
                <div>
                  <h5 className="fw-bold">{option.title}</h5>
                  <p className="mb-0">{option.description}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Links */}
      <h4 className="fw-bold mb-3">Quick Links</h4>
      <div className="row g-4">
        <Link to="/tasks" className="col-6 col-md-3 text-decoration-none">
          <div className="card shadow-sm text-center p-4">
            <div className="display-6 mb-2">📝</div>
            <h6 className="fw-semibold mb-0">Tasks</h6>
          </div>
        </Link>

        <Link to="/leaderboard" className="col-6 col-md-3 text-decoration-none">
          <div className="card shadow-sm text-center p-4">
            <div className="display-6 mb-2">🏆</div>
            <h6 className="fw-semibold mb-0">Leaderboard</h6>
          </div>
        </Link>

        <Link to="/chatbot" className="col-6 col-md-3 text-decoration-none">
          <div className="card shadow-sm text-center p-4">
            <div className="display-6 mb-2">🤖</div>
            <h6 className="fw-semibold mb-0">AI Assistant</h6>
          </div>
        </Link>

        <Link to="/settings" className="col-6 col-md-3 text-decoration-none">
          <div className="card shadow-sm text-center p-4">
            <div className="display-6 mb-2">⚙️</div>
            <h6 className="fw-semibold mb-0">Settings</h6>
          </div>
        </Link>
      </div>
    </div>
  );
}

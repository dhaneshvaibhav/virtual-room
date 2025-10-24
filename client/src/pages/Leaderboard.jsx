import React, { useState, useEffect, useContext } from 'react';
import { AppContext } from '../context/AppContext';

export default function Leaderboard() {
  const { name, points } = useContext(AppContext);
  const [users, setUsers] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      const mockUsers = [
        { id: 1, name: 'Alex', points: 320, studyTime: 480, completedTasks: 15, groupSessions: 8, badges: ['time-master', 'task-champion', 'group-leader'] },
        { id: 2, name: 'Taylor', points: 280, studyTime: 420, completedTasks: 12, groupSessions: 6, badges: ['time-master', 'task-champion'] },
        { id: 3, name: 'Jordan', points: 250, studyTime: 360, completedTasks: 10, groupSessions: 5, badges: ['time-master'] },
        { id: 4, name: 'Morgan', points: 220, studyTime: 300, completedTasks: 8, groupSessions: 4, badges: [] },
        { id: 5, name: 'Casey', points: 190, studyTime: 240, completedTasks: 6, groupSessions: 3, badges: [] },
        { id: 6, name, points, studyTime: 180, completedTasks: 5, groupSessions: 2, badges: [] }
      ];

      const sortedUsers = mockUsers.sort((a, b) => b.points - a.points);
      setUsers(sortedUsers);
      setLoading(false);
    }, 1000);
  }, [name, points]);

  const getBadgeIcon = (badge) => {
    switch (badge) {
      case 'time-master': return <span className="text-primary">⏱️</span>;
      case 'task-champion': return <span className="text-success">✅</span>;
      case 'group-leader': return <span className="text-warning">👥</span>;
      default: return <span className="text-secondary">🏅</span>;
    }
  };

  const getBadgeTooltip = (badge) => {
    switch (badge) {
      case 'time-master': return 'Time Master: Studied for more than 5 hours';
      case 'task-champion': return 'Task Champion: Completed more than 10 tasks';
      case 'group-leader': return 'Group Leader: Participated in more than 5 group sessions';
      default: return 'Achievement Badge';
    }
  };

  const getMedal = (index) => {
    switch (index) {
      case 0: return <span className="text-warning" title="1st Place">🏆</span>;
      case 1: return <span className="text-secondary" title="2nd Place">🥈</span>;
      case 2: return <span className="text-warning" title="3rd Place">🥉</span>;
      default: return <span>{index + 1}</span>;
    }
  };

  const filteredUsers = filter === 'all'
    ? users
    : filter === 'friends'
      ? users.filter(user => user.name === name || ['Alex', 'Taylor'].includes(user.name))
      : users.filter(user => user.badges.length > 0);

  return (
    <div className="container my-5">
      <div className="card shadow-sm">
        <div className="card-body">
          <h2 className="card-title mb-4">Leaderboard</h2>

          {/* Filter Tabs */}
         <div className="btn-group mb-4" role="group">
  <button
    type="button"
    className={`btn ${filter === 'all' ? 'btn-primary' : 'btn-outline-primary'}`}
    onClick={() => setFilter('all')}
  >
    All Users
  </button>
  <button
    type="button"
    className={`btn ${filter === 'friends' ? 'btn-primary' : 'btn-outline-primary'}`}
    onClick={() => setFilter('friends')}
  >
    Friends
  </button>
  <button
    type="button"
    className={`btn ${filter === 'badges' ? 'btn-primary' : 'btn-outline-primary'}`}
    onClick={() => setFilter('badges')}
  >
    Badge Holders
  </button>
</div>

          {/* Leaderboard Table */}
          {loading ? (
            <div className="text-center py-5">Loading...</div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover align-middle">
                <thead className="table-light">
                  <tr>
                    <th scope="col">Rank</th>
                    <th scope="col">User</th>
                    <th scope="col">Points</th>
                    <th scope="col">Study Time</th>
                    <th scope="col">Tasks</th>
                    <th scope="col">Badges</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user, index) => (
                    <tr key={user.id} className={user.name === name ? 'table-primary' : ''}>
                      <th scope="row">{getMedal(index)}</th>
                      <td>
                        <div className="d-flex align-items-center">
                          <div className="rounded-circle bg-primary text-white d-flex justify-content-center align-items-center me-3" style={{width: '40px', height: '40px'}}>
                            {user.name.charAt(0)}
                          </div>
                          <div>
                            {user.name} {user.name === name && <span className="badge bg-info text-dark">You</span>}
                          </div>
                        </div>
                      </td>
                      <td>{user.points}</td>
                      <td>{Math.floor(user.studyTime / 60)}h {user.studyTime % 60}m</td>
                      <td>{user.completedTasks}</td>
                      <td>
                        {user.badges.length > 0 ? (
                          user.badges.map((badge, i) => (
                            <span key={i} className="me-2" title={getBadgeTooltip(badge)}>{getBadgeIcon(badge)}</span>
                          ))
                        ) : (
                          <span className="text-muted">No badges yet</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Badge Legend */}
          <div className="mt-4 p-3 bg-light rounded">
            <h5>Badge Achievements</h5>
            <div className="d-flex flex-wrap gap-3 mt-2">
              <div className="d-flex align-items-center">
                <span className="text-primary me-2">⏱️</span>
                <span>Time Master: 5+ hours of study</span>
              </div>
              <div className="d-flex align-items-center">
                <span className="text-success me-2">✅</span>
                <span>Task Champion: 10+ tasks completed</span>
              </div>
              <div className="d-flex align-items-center">
                <span className="text-warning me-2">👥</span>
                <span>Group Leader: 5+ group sessions</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

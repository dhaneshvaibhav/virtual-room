import React, { useState, useEffect, useContext } from 'react';
import { AppContext } from '../context/AppContext';

export default function Leaderboard() {
  const { name, points } = useContext(AppContext);
  const [users, setUsers] = useState([]);
  const [filter, setFilter] = useState('all');

  const [loading, setLoading] = useState(true);

  // Generate mock leaderboard data
  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      const mockUsers = [
        { id: 1, name: 'Alex', points: 320, studyTime: 480, completedTasks: 15, groupSessions: 8, badges: ['time-master', 'task-champion', 'group-leader'] },
        { id: 2, name: 'Taylor', points: 280, studyTime: 420, completedTasks: 12, groupSessions: 6, badges: ['time-master', 'task-champion'] },
        { id: 3, name: 'Jordan', points: 250, studyTime: 360, completedTasks: 10, groupSessions: 5, badges: ['time-master'] },
        { id: 4, name: 'Morgan', points: 220, studyTime: 300, completedTasks: 8, groupSessions: 4, badges: [] },
        { id: 5, name: 'Casey', points: 190, studyTime: 240, completedTasks: 6, groupSessions: 3, badges: [] },
        // Add current user to the leaderboard
        { id: 6, name, points, studyTime: 180, completedTasks: 5, groupSessions: 2, badges: [] }
      ];
      
      // Sort users by points in descending order
      const sortedUsers = mockUsers.sort((a, b) => b.points - a.points);
      setUsers(sortedUsers);
      setLoading(false);
    }, 1000);
  }, [name, points]);

  // Get badge icon based on badge type
  const getBadgeIcon = (badge) => {
    switch (badge) {
      case 'time-master':
        return <span className="text-blue-500">⏱️</span>;
      case 'task-champion':
        return <span className="text-green-500">✅</span>;
      case 'group-leader':
        return <span className="text-purple-500">👥</span>;
      default:
        return <span className="text-gray-500">🏅</span>;
    }
  };

  // Get badge tooltip text
  const getBadgeTooltip = (badge) => {
    switch (badge) {
      case 'time-master':
        return 'Time Master: Studied for more than 5 hours';
      case 'task-champion':
        return 'Task Champion: Completed more than 10 tasks';
      case 'group-leader':
        return 'Group Leader: Participated in more than 5 group sessions';
      default:
        return 'Achievement Badge';
    }
  };

  // Get medal for top 3 users
  const getMedal = (index) => {
    switch (index) {
      case 0:
        return <span className="text-yellow-500 text-xl" title="1st Place">🏆</span>;
      case 1:
        return <span className="text-gray-400 text-xl" title="2nd Place">🥈</span>;
      case 2:
        return <span className="text-amber-700 text-xl" title="3rd Place">🥉</span>;
      default:
        return <span className="text-gray-500 font-bold">{index + 1}</span>;
    }
  };

  // Filter users based on selected filter
  const filteredUsers = filter === 'all' 
    ? users 
    : filter === 'friends' 
      ? users.filter(user => user.name === name || ['Alex', 'Taylor'].includes(user.name))
      : users.filter(user => user.badges.length > 0);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold mb-6">Leaderboard</h2>
        
        {/* Filter tabs */}
        <div className="flex mb-6 border-b">
          <button 
            className={`px-4 py-2 font-medium ${filter === 'all' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600'}`}
            onClick={() => setFilter('all')}
          >
            All Users
          </button>
          <button 
            className={`px-4 py-2 font-medium ${filter === 'friends' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600'}`}
            onClick={() => setFilter('friends')}
          >
            Friends
          </button>
          <button 
            className={`px-4 py-2 font-medium ${filter === 'badges' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600'}`}
            onClick={() => setFilter('badges')}
          >
            Badge Holders
          </button>
        </div>
        
        {/* Leaderboard table */}
        <div className="overflow-x-auto">
          {loading ? (
            <div className="text-center py-8">Loading...</div>
          ) : (
          <table className="min-w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rank</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Points</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Study Time</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tasks</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Badges</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUsers.map((user, index) => (
                <tr key={user.id} className={user.name === name ? 'bg-blue-50' : ''}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {getMedal(index)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">
                        {user.name.charAt(0)}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{user.name}</div>
                        {user.name === name && <div className="text-xs text-blue-500">You</div>}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{user.points}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{Math.floor(user.studyTime / 60)}h {user.studyTime % 60}m</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{user.completedTasks}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex space-x-2">
                      {user.badges.map((badge, i) => (
                        <div key={i} className="tooltip" title={getBadgeTooltip(badge)}>
                          {getBadgeIcon(badge)}
                        </div>
                      ))}
                      {user.badges.length === 0 && (
                        <span className="text-sm text-gray-500">No badges yet</span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          )}
        </div>
        
        {/* Badge explanation */}
        <div className="mt-8 p-4 bg-gray-50 rounded-lg">
          <h3 className="font-medium mb-2">Badge Achievements</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center">
              <span className="text-blue-500 mr-2">⏱️</span>
              <span className="text-sm">Time Master: 5+ hours of study</span>
            </div>
            <div className="flex items-center">
              <span className="text-green-500 mr-2">✅</span>
              <span className="text-sm">Task Champion: 10+ tasks completed</span>
            </div>
            <div className="flex items-center">
              <span className="text-purple-500 mr-2">👥</span>
              <span className="text-sm">Group Leader: 5+ group sessions</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
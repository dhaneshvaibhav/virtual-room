import React from 'react';

export default function RoomSelection({ 
  joinMode, 
  setJoinMode, 
  handleCreateRoom, 
  handleJoinRoom, 
  roomCode, 
  setRoomCode, 
  connectionStatus,
  isCreatingRoom,
  roomError
}) {
  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="flex items-center justify-center gap-3 mb-6">
          <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Group Study Room
            </h2>
            <p className="text-gray-600 mt-1">Connect with up to 3 study partners</p>
          </div>
        </div>
      </div>
      
      
      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-12">
        <button
          onClick={() => {
            setJoinMode(false);
            handleCreateRoom();
          }}
          disabled={isCreatingRoom}
          className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold rounded-xl shadow-medium transition-all duration-200 flex items-center justify-center gap-3 disabled:opacity-50"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          {isCreatingRoom ? 'Creating...' : 'Create Room'}
        </button>
        
        <div className="text-gray-400 font-medium">OR</div>
        
        <button
          onClick={() => setJoinMode(true)}
          className={`w-full sm:w-auto px-8 py-4 font-semibold rounded-xl shadow-medium transition-all duration-200 flex items-center justify-center gap-3 ${
            joinMode 
              ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white' 
              : 'bg-white border-2 border-blue-200 text-blue-600'
          }`}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
          </svg>
          Join Room
        </button>
      </div>
      
      {/* Join Room Form */}
      {joinMode && (
        <div className="max-w-md mx-auto">
          <div className="bg-white rounded-2xl shadow-medium p-8 border border-gray-100">
            <div className="text-center mb-6">
              <h3 className="text-xl font-bold text-gray-800 mb-2">Enter Room Code</h3>
              <p className="text-gray-600 text-sm">Ask your study partner for the room code</p>
            </div>
            
            <div className="space-y-4">
              <div className="relative">
                <input
                  type="text"
                  value={roomCode}
                  onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
                  onKeyDown={(e) => { if (e.key === 'Enter') handleJoinRoom(); }}
                  placeholder="ROOM-XXXXX"
                  className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-center font-mono text-lg"
                />
              </div>
              
              <button
                onClick={handleJoinRoom}
                disabled={!roomCode.trim()}
                className="w-full py-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold rounded-xl shadow-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                </svg>
                Join Room
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

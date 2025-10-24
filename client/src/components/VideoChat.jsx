import React, { useRef, useEffect } from 'react';

export default function VideoChat({ 
  localVideoRef, 
  peers, 
  name, 
  micEnabled, 
  videoEnabled, 
  toggleMic, 
  toggleVideo, 
  startScreenShare,
  pushToTalkStart,
  pushToTalkEnd,
  raiseHand,
}) {
  return (
    <div className="space-y-6">
      {/* Main Video Section */}
      <div className="card p-0 overflow-hidden relative">
        <video 
          ref={localVideoRef} 
          autoPlay 
          muted 
          playsInline 
          className="w-full h-auto aspect-video bg-gradient-to-br from-secondary-100 to-secondary-200" 
        />
        
        {/* Video Overlay Controls - Always Visible */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-4 bg-black/90 backdrop-blur-sm p-4 rounded-2xl border border-white/30 shadow-strong z-10">
          {/* Mic Toggle */}
          <button 
            onClick={toggleMic} 
            className={`rounded-full w-14 h-14 flex items-center justify-center transition-all duration-200 ${
              micEnabled 
                ? "bg-green-600 text-white" 
                : "bg-red-600 text-white"
            }`}
            title={micEnabled ? "Mute microphone" : "Unmute microphone"}
          >
            {micEnabled ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
              </svg>
            )}
          </button>
          
          {/* Video Toggle */}
          <button 
            onClick={toggleVideo} 
            className={`rounded-full w-14 h-14 flex items-center justify-center transition-all duration-200 ${
              videoEnabled 
                ? "bg-green-600 text-white" 
                : "bg-red-600 text-white"
            }`}
            title={videoEnabled ? "Turn off camera" : "Turn on camera"}
          >
            {videoEnabled ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
              </svg>
            )}
          </button>
          
          {/* Screen Share */}
          <button 
            onClick={startScreenShare} 
            className="rounded-full w-14 h-14 flex items-center justify-center bg-blue-600 text-white transition-all duration-200"
            title="Share screen"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </button>
          
          {/* Push to Talk */}
          <button
            onMouseDown={pushToTalkStart}
            onMouseUp={pushToTalkEnd}
            onMouseLeave={pushToTalkEnd}
            onTouchStart={pushToTalkStart}
            onTouchEnd={pushToTalkEnd}
            className="rounded-full h-10 px-3 bg-purple-600 text-white text-xs font-medium transition-all duration-200"
            title="Hold to talk"
          >
            Hold
          </button>
          
          {/* Raise Hand */}
          <button 
            onClick={raiseHand} 
            className="rounded-full w-10 h-10 flex items-center justify-center bg-yellow-600 text-white transition-all duration-200" 
            title="Raise hand"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11.5V14m0-2.5v-6a1.5 1.5 0 113 0m-3 6a1.5 1.5 0 00-3 0v2a7.5 7.5 0 0015 0v-5a1.5 1.5 0 00-3 0m-6-3V11m0-5.5v-1a1.5 1.5 0 013 0v1m0 0V11m0-5.5a1.5 1.5 0 013 0v3m0 0V11" />
            </svg>
          </button>
        </div>
        
        {/* User Name Badge */}
        <div className="absolute top-4 left-4 bg-black/70 backdrop-blur-sm text-white px-3 py-2 text-sm rounded-xl border border-white/20 shadow-medium">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-success-400 rounded-full animate-pulse"></div>
            {name} (You)
          </div>
        </div>
      </div>

      {/* Participants Section */}
      <div className="card">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-gradient-to-br from-primary-500 to-accent-500 rounded-xl">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <div>
            <h3 className="text-xl font-bold text-primary-700">Participants</h3>
            <p className="text-sm text-secondary-500">
              {Object.keys(peers).length + 1}/3 members in room
              {Object.keys(peers).length >= 2 && (
                <span className="ml-2 text-orange-600 font-medium">Room Full</span>
              )}
            </p>
          </div>
        </div>
        
        {Object.keys(peers).length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="p-4 bg-gradient-to-br from-primary-100 to-accent-100 rounded-2xl mb-4">
              <svg className="w-8 h-8 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <p className="text-secondary-500 font-medium">No other participants yet</p>
            <p className="text-sm text-secondary-400">Share the room code to invite others!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(peers).map(([id, info], index) => (
              <div 
                key={id} 
                className="relative border border-secondary-200 rounded-2xl overflow-hidden bg-white shadow-soft hover:shadow-medium transition-all duration-200 animate-slide-up"
                style={{animationDelay: `${index * 0.1}s`}}
              >
                {info?.stream ? (
                  <video 
                    autoPlay 
                    playsInline 
                    ref={(el) => { if (el) el.srcObject = info.stream; }} 
                    className="w-full h-auto aspect-video bg-gradient-to-br from-secondary-100 to-secondary-200" 
                  />
                ) : (
                  <div className="w-full aspect-video flex items-center justify-center bg-gradient-to-br from-secondary-100 to-secondary-200">
                    <div className="text-center">
                      <div className="w-8 h-8 bg-primary-200 rounded-full flex items-center justify-center mx-auto mb-2">
                        <svg className="w-4 h-4 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <p className="text-sm text-secondary-500 font-medium">Connecting...</p>
                    </div>
                  </div>
                )}
                <div className="absolute top-3 left-3 bg-black/70 backdrop-blur-sm text-white px-2 py-1 text-xs rounded-lg border border-white/20">
                  <div className="flex items-center gap-1">
                    <div className="w-1.5 h-1.5 bg-success-400 rounded-full animate-pulse"></div>
                    {info.name || 'Guest'}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

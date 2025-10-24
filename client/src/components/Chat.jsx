import React from 'react';

export default function Chat({ messages, newMessage, setNewMessage, sendMessage, name }) {
  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-gradient-to-br from-primary-500 to-accent-500 rounded-xl">
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        </div>
        <div>
          <h3 className="text-xl font-bold text-primary-700">Group Chat</h3>
          <p className="text-sm text-secondary-500">Share ideas and collaborate</p>
        </div>
      </div>
      
      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto mb-6 space-y-4 pr-2 min-h-0">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center py-8">
            <div className="p-4 bg-gradient-to-br from-primary-100 to-accent-100 rounded-2xl mb-4">
              <svg className="w-8 h-8 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <p className="text-secondary-500 font-medium">No messages yet</p>
            <p className="text-sm text-secondary-400">Start the conversation!</p>
          </div>
        ) : (
          messages.map((msg, idx) => {
            const isOwnMessage = msg.sender === name;
            const isAIMessage = msg.sender === 'AI';
            
            return (
              <div 
                key={idx} 
                className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'} animate-slide-up`}
                style={{animationDelay: `${idx * 0.05}s`}}
              >
                <div className={`max-w-[85%] ${isOwnMessage ? 'order-2' : 'order-1'}`}>
                  {/* Sender Name */}
                  <div className={`text-xs font-semibold mb-1 px-2 ${
                    isOwnMessage 
                      ? 'text-right text-primary-600' 
                      : isAIMessage 
                        ? 'text-left text-accent-600' 
                        : 'text-left text-secondary-600'
                  }`}>
                    {msg.sender ? (msg.sender === name ? 'You' : msg.sender) : 'Unknown'}
                  </div>
                  
                  {/* Message Bubble */}
                  <div className={`relative px-4 py-3 rounded-2xl shadow-soft ${
                    isOwnMessage 
                      ? 'bg-gradient-to-br from-primary-500 to-primary-600 text-white' 
                      : isAIMessage
                        ? 'bg-gradient-to-br from-accent-100 to-accent-200 text-accent-800 border border-accent-200'
                        : 'bg-white text-secondary-700 border border-secondary-200'
                  }`}>
                    <div className="whitespace-pre-wrap break-words">
                      {msg.text || msg.message || msg.content || ''}
                    </div>
                    
                    {/* Timestamp */}
                    <div className={`text-xs mt-2 ${
                      isOwnMessage 
                        ? 'text-primary-100' 
                        : 'text-secondary-400'
                    }`}>
                      {(msg.timestamp || msg.ts) ? new Date(msg.timestamp || msg.ts).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : ''}
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
      
      {/* Message Input */}
      <form onSubmit={sendMessage} className="mt-auto">
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your message..."
              className="w-full px-4 py-3 pr-12 bg-white border border-secondary-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 shadow-soft"
            />
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <svg className="w-5 h-5 text-secondary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <button 
            type="submit"
            className="btn btn-primary px-4 py-3 rounded-xl shadow-medium hover:shadow-strong transition-all duration-200"
            disabled={!newMessage.trim()}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
            </svg>
          </button>
        </div>
      </form>
    </div>
  );
}

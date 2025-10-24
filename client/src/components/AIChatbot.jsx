import React, { useState, useRef, useEffect } from "react";

import { getChatbotReply } from '../api/mockAI';

function generateSampleConversations(total = 60) {
  const samples = [];
  const greets = ["Hi", "Hello", "Hey", "Howdy", "Hi there", "Greetings", "Good day", "Yo"];
  let g = 0;
  for (let i = 0; i < Math.max(1, Math.floor(total / 2)); i++) {
    if (i % 3 === 0) {
      const greet = greets[g++ % greets.length];
      samples.push({ role: 'user', content: greet });
      samples.push({ role: 'assistant', content: `${greet}! Ready to study?` });
    } else {
      const a = 2 + (i % 5);
      const b = 10 + (i % 20);
      samples.push({ role: 'user', content: `What is ${a}+${b}?` });
      samples.push({ role: 'assistant', content: `${a + b}` });
    }
  }
  return samples;
}

export default function AIChatbot({ seedSample = false, seedSampleCount = 60 }) {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Hello! I\'m your AI study buddy. How can I help you today?' }
  ]);
  const [newMessage, setNewMessage] = useState('');
  const chatContainerRef = useRef(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const userMessage = { role: 'user', content: newMessage };
    setMessages(prev => [...prev, userMessage]);

    const aiResponse = await getChatbotReply(newMessage);

    setMessages(prev => [...prev, { role: 'assistant', content: aiResponse }]);
    setNewMessage('');
  };

  // Seed with sample conversations on mount if requested
  useEffect(() => {
    if (seedSample) {
      const seeded = generateSampleConversations(seedSampleCount);
      setMessages(prev => (prev.length <= 1 ? [...prev, ...seeded] : prev));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-gradient-to-br from-accent-500 to-purple-500 rounded-xl">
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
        </div>
        <div>
          <h3 className="text-xl font-bold text-accent-700">AI Study Buddy</h3>
          <p className="text-sm text-secondary-500">Your intelligent learning assistant</p>
        </div>
      </div>
      
      {/* Messages Container */}
      <div 
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto mb-6 space-y-4 pr-2 min-h-0"
      >
        {messages.map((message, index) => {
          const isUser = message.role === 'user';
          
          return (
            <div 
              key={index} 
              className={`flex ${isUser ? 'justify-end' : 'justify-start'} animate-slide-up`}
              style={{animationDelay: `${index * 0.05}s`}}
            >
              <div className={`max-w-[85%] ${isUser ? 'order-2' : 'order-1'}`}>
                {/* Avatar and Name */}
                <div className={`flex items-center gap-2 mb-2 ${isUser ? 'justify-end' : 'justify-start'}`}>
                  {!isUser && (
                    <div className="w-6 h-6 bg-gradient-to-br from-accent-400 to-purple-500 rounded-full flex items-center justify-center">
                      <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                      </svg>
                    </div>
                  )}
                  <span className={`text-xs font-semibold ${
                    isUser ? 'text-primary-600' : 'text-accent-600'
                  }`}>
                    {isUser ? 'You' : 'AI Assistant'}
                  </span>
                </div>
                
                {/* Message Bubble */}
                <div className={`relative px-4 py-3 rounded-2xl shadow-soft ${
                  isUser 
                    ? 'bg-gradient-to-br from-primary-500 to-primary-600 text-white' 
                    : 'bg-gradient-to-br from-accent-50 to-purple-50 text-accent-800 border border-accent-200'
                }`}>
                  <div className="whitespace-pre-wrap break-words">
                    {message.content}
                  </div>
                  
                  {/* AI Thinking Indicator */}
                  {!isUser && index === messages.length - 1 && (
                    <div className="flex items-center gap-1 mt-2">
                      <div className="w-1 h-1 bg-accent-400 rounded-full animate-bounce"></div>
                      <div className="w-1 h-1 bg-accent-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                      <div className="w-1 h-1 bg-accent-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
      
      {/* Input Form */}
      <form onSubmit={handleSendMessage} className="mt-auto">
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Ask me anything about your studies..."
              className="w-full px-4 py-3 pr-12 bg-white border border-secondary-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent transition-all duration-200 shadow-soft"
            />
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <svg className="w-5 h-5 text-secondary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <button 
            type="submit"
            className="btn bg-gradient-to-r from-accent-500 to-purple-500 hover:from-accent-600 hover:to-purple-600 text-white px-4 py-3 rounded-xl shadow-medium hover:shadow-strong transition-all duration-200"
            disabled={!newMessage.trim()}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="22" y1="2" x2="11" y2="13"></line>
              <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
            </svg>
          </button>
        </div>
      </form>
    </div>
  );
}
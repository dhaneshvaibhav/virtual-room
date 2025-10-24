import React, { useState, useRef, useEffect } from "react";
import { getChatbotReply } from "../api/mockAI";

export default function Chatbot() {
  const [msgs, setMsgs] = useState([]);
  const [text, setText] = useState("");
  const historyRef = useRef([]);
  const chatContainerRef = useRef(null);

  async function send() {
    if (!text.trim()) return;
    const userMsg = { id: crypto.randomUUID(), role: "user", text: text.trim() };
    historyRef.current.push(userMsg);

    const thinkingMsg = { id: crypto.randomUUID(), role: "bot", text: "Thinking..." };
    setMsgs((m) => [...m, userMsg, thinkingMsg]);
    setText("");

    try {
      const reply = await getChatbotReply(historyRef.current.map(h => h.text).join("\n"));
      const botReply = { id: thinkingMsg.id, role: "bot", text: reply };
      historyRef.current.push(botReply);
      setMsgs(m => m.map(msg => msg.id === thinkingMsg.id ? botReply : msg));
      speak(reply);
    } catch (err) {
      console.error("AI error", err);
      const errorReply = { id: thinkingMsg.id, role: "bot", text: "Sorry — I couldn't fetch a reply. Try again." };
      setMsgs((m) => m.map(msg => msg.id === thinkingMsg.id ? errorReply : msg));
    }
  }

  function speak(txt) {
    try {
      if ("speechSynthesis" in window) {
        const u = new SpeechSynthesisUtterance(txt);
        u.rate = 1;
        speechSynthesis.cancel();
        speechSynthesis.speak(u);
      }
    } catch (e) { /* ignore */ }
  }

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [msgs]);

  return (
    <div className="max-w-xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">AI Study Buddy</h2>
      <div className="bg-white rounded-xl shadow-lg p-4 flex flex-col gap-3">
        
        {/* Chat Messages */}
        <div 
          ref={chatContainerRef} 
          className="flex flex-col gap-2 max-h-80 overflow-y-auto p-2 bg-gray-50 rounded"
        >
          {msgs.map((m) => (
            <div key={m.id} className={`flex ${m.role === 'bot' ? 'justify-start' : 'justify-end'}`}>
              <div className={`px-4 py-2 rounded-lg max-w-xs break-words
                ${m.role === 'bot' ? 'bg-indigo-100 text-gray-800' : 'bg-blue-600 text-white'}`}>
                <p className="text-sm">{m.text}</p>
              </div>
              {m.role === 'bot' && m.text !== 'Thinking...' && (
                <button 
                  onClick={() => speak(m.text)} 
                  className="ml-2 p-1 text-gray-500 hover:text-gray-700 transition-colors"
                >
                  🔊
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Input Area */}
        <div className="flex gap-2 mt-2">
          <input 
            value={text} 
            onChange={(e) => setText(e.target.value)} 
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Ask me anything about your study..."
            onKeyDown={(e) => e.key === "Enter" && send()}
          />
          <button 
            onClick={send} 
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors font-medium"
          >
            Send
          </button>
        </div>

      </div>
    </div>
  );
}

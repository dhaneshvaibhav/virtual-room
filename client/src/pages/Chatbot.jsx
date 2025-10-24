// client/src/pages/Chatbot.jsx
import React, { useState, useRef } from "react";
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
      setMsgs((m) => {
        const copy = [...m];
        const index = copy.findIndex(msg => msg.id === thinkingMsg.id);
        if (index !== -1) copy[index] = errorReply;
        return copy;
      });
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
    <div>
      <h2 className="text-xl font-semibold mb-3">AI Study Buddy</h2>
      <div className="card">
        <div ref={chatContainerRef} className="space-y-2 max-h-64 overflow-y-auto mb-2 p-2 bg-gray-100 rounded">
          {msgs.map((m, i) => (
            <div key={m.id} className={`flex items-start gap-2 ${m.role === 'bot' ? '' : 'justify-end'}`}>
              <div className={`px-3 py-2 rounded-lg max-w-xs ${m.role === 'bot' ? 'bg-indigo-100 text-gray-800' : 'bg-blue-500 text-white'}`}>
                <p className="text-sm">{m.text}</p>
              </div>
              {m.role === 'bot' && m.text !== 'Thinking...' && (
                <button onClick={() => speak(m.text)} className="p-1 text-gray-500 hover:text-gray-700">🔊</button>
              )}
            </div>
          ))}
        </div>
        
        <div className="flex gap-2">
          <input value={text} onChange={(e) => setText(e.target.value)} className="flex-1 px-2 py-1 border rounded" placeholder="Ask me anything about your study..." />
          <button onClick={send} className="btn bg-blue-600 text-white">Send</button>
        </div>
      </div>
    </div>
  );
}

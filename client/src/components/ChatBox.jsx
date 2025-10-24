import React, { useEffect, useState } from 'react';
export default function ChatBox({ socket, roomCode, name }){
  const key = `chat_${roomCode||'lobby'}`;
  const [msgs, setMsgs] = useState(JSON.parse(localStorage.getItem(key)||'[]'));
  const [text,setText]=useState('');
  useEffect(()=>{ if(!socket) return; const listener=({sender,message})=>{ setMsgs(prev=>{ const next=[...prev,{sender,message}]; localStorage.setItem(key, JSON.stringify(next)); return next; }); }; socket.on('message', listener); return ()=> socket.off('message', listener); }, [socket, key]);
  const send = ()=>{ if(!text.trim()) return; const payload={roomCode, message:text.trim(), sender:name||'Anonymous'}; socket&&socket.emit('message', payload); setText(''); setMsgs(prev=>{ const next=[...prev,{sender:name||'You', message:payload.message}]; localStorage.setItem(key, JSON.stringify(next)); return next; }); };
  return (<div className='card flex flex-col'><div className='flex-1 overflow-y-auto mb-2 space-y-2'>{msgs.map((m,i)=><div key={i} className='text-sm'><strong className='mr-2'>{m.sender}:</strong>{m.message}</div>)}</div><div className='flex gap-2'><input value={text} onChange={e=>setText(e.target.value)} className='flex-1 px-2 py-1 border rounded' placeholder='Message...' /><button onClick={send} className='btn bg-blue-600 text-white'>Send</button></div></div>);
}

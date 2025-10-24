// client/src/pages/GroupStudy.jsx
import React, { useEffect, useRef, useState, useContext } from "react";
import io from "socket.io-client";
import { AppContext } from "../context/AppContext";
import RoomSelection from "../components/RoomSelection";
import VideoChat from "../components/VideoChat";
import Chat from "../components/Chat";
import AIChatbot from '../components/AIChatbot';
import Timer from '../components/Timer';
import { getChatbotReply } from '../api/mockAI';

const SIGNALING_SERVER = import.meta.env.VITE_SIGNALING_SERVER || "http://localhost:4000";

export default function GroupStudy() {
  const { name, addPoints } = useContext(AppContext);
  
  // Connection states
  const [socket, setSocket] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState('disconnected'); // 'disconnected', 'connecting', 'connected'
  
  // Room states
  const [roomCode, setRoomCode] = useState("");
  const [createdCode, setCreatedCode] = useState("");
  const [showRoomSelection, setShowRoomSelection] = useState(true);
  const [joinMode, setJoinMode] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  
  const [isCreatingRoom, setIsCreatingRoom] = useState(false);
  
  const [roomError, setRoomError] = useState(null);
  
  // Media states
  const [peers, setPeers] = useState({}); // peerId -> { stream }
  const localVideoRef = useRef(null);
  const localStreamRef = useRef(null);
  const pcsRef = useRef({}); // RTCPeerConnection per peerId
  const [micEnabled, setMicEnabled] = useState(true);
  const [videoEnabled, setVideoEnabled] = useState(true);
  // removed unused: screenShareEnabled, pushToTalkActive
  const prevMicStateRef = useRef(true);
  // ICE servers
  const iceServersRef = useRef(null);
  
  // Chat states
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const lastSentMsgRef = useRef('');
  const joinedRoomRef = useRef(false);
  // AIChat handled by dedicated component; local aiMessages/newAiMessage removed
  
  // Chat functionality
  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !socket || !roomCode) return;
    const msg = newMessage.trim();
    const payload = { roomCode, message: msg, sender: name || 'Anonymous' };
    // Show locally immediately for better UX
    setMessages(prev => [...prev, { sender: name || 'Anonymous', text: msg, timestamp: Date.now() }]);
    lastSentMsgRef.current = msg;
    socket.emit('message', payload);
    setNewMessage('');
    addPoints(1);
    try {
      const reply = await getChatbotReply(msg);
      setMessages(prev => [...prev, { sender: 'AI', text: reply, timestamp: new Date().toISOString() }]);
    } catch {}
  };
  
  // Handle chat messages
  useEffect(() => {
    if (!socket) return;
    
    socket.on('message', ({ sender, message, ts }) => {
      // Avoid duplicate of the most recent local echo
      const isSelfEcho = sender === (name || 'Anonymous') && message === lastSentMsgRef.current;
      setMessages(prev => isSelfEcho ? prev : [...prev, { sender, text: message, timestamp: ts }]);
    });
    
    socket.on('connect_error', (error) => {
      console.error('Connection error:', error);
      setRoomError('Failed to connect to the server. Please try again later.');
    });
    
    // Handle room errors
    socket.on('room-error', ({ message }) => {
      console.warn('Room error:', message);
      setRoomError(message);
    });
    
    return () => {
      socket.off('message');
      socket.off('connect_error');
      socket.off('room-error');
    };
  }, [socket, name]);

  
  // Load ICE servers from signaling server
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`${SIGNALING_SERVER}/ice-config`);
        const data = await res.json();
        iceServersRef.current = data?.iceServers || null;
      } catch (e) {
        console.warn('Failed to load ICE config', e);
      }
    })();
  }, []);

  // Initialize socket connection
  useEffect(() => {
    const s = io(SIGNALING_SERVER, { transports: ["websocket"] });
    setSocket(s);
    setConnectionStatus('connecting');
    
    s.on('connect', () => {
      setConnectionStatus('connected');
      console.log('Connected to signaling server');
      // If we have a code and room view is active but not joined, join now
      if (roomCode && !showRoomSelection && !joinedRoomRef.current) {
        s.emit('join-room', { roomCode, name }, ({ ok }) => {
          if (ok) joinedRoomRef.current = true;
        });
      }
    });
    
    s.on('disconnect', () => {
      setConnectionStatus('disconnected');
      console.log('Disconnected from signaling server');
    });
    
    return () => {
      try { s.disconnect(); } catch (e) {}
    };
  }, []);

  // Handle signaling for WebRTC
  useEffect(() => {
    if (!socket) return;

    socket.on("signal", async ({ from, signal }) => {
      try {
        if (signal.type === "offer") {
          // incoming offer -> create pc, set remote, add tracks, answer
          const pc = createPeerConnection(from);
          pcsRef.current[from] = pc;
          await pc.setRemoteDescription(signal.sdp);
          if (!localStreamRef.current) await startLocalStream();
          localStreamRef.current.getTracks().forEach((t) => pc.addTrack(t, localStreamRef.current));
          const answer = await pc.createAnswer();
          await pc.setLocalDescription(answer);
          socket.emit("signal", { toId: from, signal: { type: "answer", sdp: pc.localDescription } });
        } else if (signal.type === "answer") {
          const pc = pcsRef.current[from];
          if (pc) await pc.setRemoteDescription(signal.sdp);
        } else if (signal.type === "ice") {
          const pc = pcsRef.current[from];
          if (pc && signal.candidate) {
            try { await pc.addIceCandidate(signal.candidate); } catch (e) { console.warn(e); }
          }
        }
      } catch (err) {
        console.error("signal handler error", err);
      }
    });

    socket.on("user-joined", ({ id, name: who }) => {
      setPeers(prev => ({ ...prev, [id]: { name: who, stream: null } }));
      setTimeout(() => initiateOfferTo(id), 300);
    });

    socket.on("room-update", (ids) => {
      const others = ids.filter((i) => i !== socket.id);
      // remove peers that left
      setPeers((prev) => {
        const next = { ...prev };
        Object.keys(next).forEach((k) => {
          if (!others.includes(k)) delete next[k];
        });
        return next;
      });
    });

    socket.on("user-left", ({ id }) => {
      if (pcsRef.current[id]) {
        try { pcsRef.current[id].close(); } catch {}
        delete pcsRef.current[id];
      }
      setPeers((prev) => {
        const next = { ...prev };
        delete next[id];
        return next;
      });
    });

    return () => {
      socket.off("signal");
      socket.off("user-joined");
      socket.off("room-update");
      socket.off("user-left");
    };
    // eslint-disable-next-line
  }, [socket]);

  async function startLocalStream({ audio = true, video = true } = {}) {
    if (localStreamRef.current) return localStreamRef.current;
    try {
      const s = await navigator.mediaDevices.getUserMedia({ audio, video });
      localStreamRef.current = s;
      if (localVideoRef.current) localVideoRef.current.srcObject = s;
      // set initial mic state from state
      s.getAudioTracks().forEach((t) => (t.enabled = micEnabled));
      s.getVideoTracks().forEach((t) => (t.enabled = videoEnabled));
      return s;
    } catch (e) {
      console.error("getUserMedia failed", e);
      alert("Camera / microphone permission required for group study.");
    }
  }

  function createPeerConnection(peerId) {
    const pc = new RTCPeerConnection(iceServersRef.current ? { iceServers: iceServersRef.current } : undefined);
    pc.onicecandidate = (e) => {
      if (e.candidate) socket.emit("signal", { toId: peerId, signal: { type: "ice", candidate: e.candidate } });
    };
    pc.ontrack = (ev) => {
      setPeers((prev) => ({ ...prev, [peerId]: { ...prev[peerId], stream: ev.streams[0] } }));
    };
    pc.onconnectionstatechange = () => {
      if (pc.connectionState === "failed" || pc.connectionState === "closed" || pc.connectionState === "disconnected") {
        setPeers((prev) => {
          const next = { ...prev };
          delete next[peerId];
          return next;
        });
        if (pcsRef.current[peerId]) {
          try { pcsRef.current[peerId].close(); } catch {}
          delete pcsRef.current[peerId];
        }
      }
    };
    return pc;
  }

  async function initiateOfferTo(peerId) {
    if (!socket) return;
    if (!localStreamRef.current) await startLocalStream();
    const pc = createPeerConnection(peerId);
    pcsRef.current[peerId] = pc;
    localStreamRef.current.getTracks().forEach((t) => pc.addTrack(t, localStreamRef.current));
    const offer = await pc.createOffer();
    await pc.setLocalDescription(offer);
    socket.emit("signal", { toId: peerId, signal: { type: "offer", sdp: pc.localDescription } });
  }

  async function handleCreateRoom() {
    // Always go to room view immediately
    setShowRoomSelection(false);
    setIsCreatingRoom(true);
    let preCode = '';
    // Try HTTP pre-create to get a shareable code instantly
    try {
      const res = await fetch(`${SIGNALING_SERVER}/create-room`, { method: 'POST' });
      const data = await res.json();
      preCode = data?.roomCode || '';
      if (preCode) {
        setCreatedCode(preCode);
        setRoomCode(preCode);
      }
    } catch (e) {
      console.warn('Pre-create via HTTP failed:', e);
    }
    // Fallback: generate a local code to display
    if (!preCode) {
      const localCode = `ROOM-${Math.random().toString(36).substring(2,7).toUpperCase()}`;
      setCreatedCode(localCode);
      setRoomCode(localCode);
    }

    // Join the room via socket if available; otherwise finish
    try {
      await startLocalStream();
      if (socket) {
        if (preCode) {
          socket.emit('join-room', { roomCode: preCode, name }, ({ ok }) => {
            setIsCreatingRoom(false);
            if (ok) joinedRoomRef.current = true;
          });
        } else {
          socket.emit('create-room', ({ roomCode }) => {
            setCreatedCode(roomCode);
            setRoomCode(roomCode);
            joinedRoomRef.current = true;
            setIsCreatingRoom(false);
          });
        }
      } else {
        setIsCreatingRoom(false);
      }
    } catch (err) {
      console.warn('Failed to start local stream or join room:', err);
      setIsCreatingRoom(false);
    }
  }

  async function handleJoinRoom() {
    if (!roomCode.trim()) return alert("Enter room code");
    // Optimistically show the room UI and code
    setCreatedCode(roomCode.trim());
    setShowRoomSelection(false);
    try {
      await startLocalStream();
    } catch {}
    // Try to join via socket if available; if not, join once connected
    if (socket) {
      socket.emit("join-room", { roomCode, name }, ({ ok }) => {
        if (ok) {
          joinedRoomRef.current = true;
        } else {
          console.warn("Join failed; will retry on reconnect");
        }
      });
    }
  }

  async function startScreenShare() {
    try {
      const displayStream = await navigator.mediaDevices.getDisplayMedia({ video: true });
      const track = displayStream.getVideoTracks()[0];
      // replace video sender track for each pc
      for (const id in pcsRef.current) {
        const pc = pcsRef.current[id];
        const senders = pc.getSenders();
        const sender = senders.find((s) => s.track && s.track.kind === "video");
        if (sender) await sender.replaceTrack(track);
      }
      // when user stops sharing, revert to camera
      track.onended = async () => {
        const cam = localStreamRef.current && localStreamRef.current.getVideoTracks()[0];
        if (!cam) return;
        for (const id in pcsRef.current) {
          const pc = pcsRef.current[id];
          const senders = pc.getSenders();
          const sender = senders.find((s) => s.track && s.track.kind === "video");
          if (sender) await sender.replaceTrack(cam);
        }
      };
    } catch (err) {
      console.warn("Screen share cancelled or failed", err);
      alert("Screen share failed or cancelled");
    }
  }

  function toggleMic() {
    if (!localStreamRef.current) return;
    const newMicEnabledState = !micEnabled;
    setMicEnabled(newMicEnabledState);
    localStreamRef.current.getAudioTracks().forEach((t) => (t.enabled = newMicEnabledState));
  }

  function toggleVideo() {
    if (!localStreamRef.current) return;
    const newVideoEnabledState = !videoEnabled;
    setVideoEnabled(newVideoEnabledState);
    localStreamRef.current.getVideoTracks().forEach((t) => (t.enabled = newVideoEnabledState));
  }

  // Push-to-talk controls: hold to enable mic, release to restore
  function pushToTalkStart() {
    if (!localStreamRef.current) return;
    prevMicStateRef.current = micEnabled;
    setMicEnabled(true);
    localStreamRef.current.getAudioTracks().forEach((t) => (t.enabled = true));
  }
  function pushToTalkEnd() {
    if (!localStreamRef.current) return;
    const restore = prevMicStateRef.current;
    setMicEnabled(restore);
    localStreamRef.current.getAudioTracks().forEach((t) => (t.enabled = restore));
  }

  function raiseHand() {
    if (!socket || !roomCode) return;
    const message = `[HAND_RAISE] ${name} raised a hand`;
    socket.emit('message', { roomCode, message, sender: name || 'Anonymous' });
  }

  // removed unused: pushStatsToServer

  // UI
  // Function to copy room code to clipboard
  const copyRoomCode = () => {
    navigator.clipboard.writeText(roomCode).then(() => {
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    });
  };

  return (
    <div>
      {showRoomSelection ? (
        <RoomSelection 
          joinMode={joinMode}
          setJoinMode={setJoinMode}
          handleCreateRoom={handleCreateRoom}
          handleJoinRoom={handleJoinRoom}
          roomCode={roomCode}
          setRoomCode={setRoomCode}
          connectionStatus={connectionStatus}
          isCreatingRoom={isCreatingRoom}
          roomError={roomError}
        />
      ) : (
        <div className="animate-fade-in">
          {/* Header Section */}
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-4">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-to-br from-primary-500 to-accent-500 rounded-2xl shadow-medium">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div>
                <h2 className="text-3xl font-bold bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent">
                  Group Study Room
                </h2>
                <p className="text-secondary-500 mt-1">Collaborate and learn together</p>
              </div>
            </div>
            
            {createdCode && (
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <div className="flex items-center gap-3 bg-white rounded-xl px-4 py-3 shadow-medium border border-primary-200">
                  <div className="text-sm text-secondary-600 font-medium">Room Code:</div>
                  <div className="font-mono bg-gradient-to-r from-primary-100 to-accent-100 px-3 py-1.5 rounded-lg text-primary-700 font-bold text-lg">
                    {createdCode}
                  </div>
                  <button
                    onClick={copyRoomCode}
                    className={`px-3 py-1.5 rounded-lg font-medium text-sm transition-all duration-200 ${
                      copySuccess 
                        ? 'bg-success-100 text-success-700 border border-success-200' 
                        : 'bg-primary-100 text-primary-700 border border-primary-200 hover:bg-primary-200'
                    }`}
                    title="Copy room code"
                  >
                    {copySuccess ? (
                      <div className="flex items-center gap-1">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        Copied!
                      </div>
                    ) : (
                      <div className="flex items-center gap-1">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                        </svg>
                        Copy
                      </div>
                    )}
                  </button>
                </div>
                <button
                  onClick={() => {
                    setShowRoomSelection(true);
                    setRoomCode('');
                    setCreatedCode('');
                  }}
                  className="btn btn-danger flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Leave Room
                </button>
              </div>
            )}
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
            {/* Video Chat Section - Takes 3 columns on xl screens */}
            <div className="xl:col-span-3">
              <VideoChat 
                localVideoRef={localVideoRef}
                peers={peers}
                name={name}
                micEnabled={micEnabled}
                videoEnabled={videoEnabled}
                toggleMic={toggleMic}
                toggleVideo={toggleVideo}
                startScreenShare={startScreenShare}
                pushToTalkStart={pushToTalkStart}
                pushToTalkEnd={pushToTalkEnd}
                raiseHand={raiseHand}
              />
            </div>

            {/* Sidebar - Takes 1 column on xl screens */}
            <div className="xl:col-span-1 space-y-6">
              {/* Timer */}
              <div className="card">
                <Timer initialMinutes={25} compact />
              </div>
              
              {/* Group Chat */}
              <div className="card">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-gradient-to-br from-green-500 to-green-600 rounded-xl">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-green-700">Group Chat</h3>
                    <p className="text-sm text-gray-500">Share ideas and documents</p>
                  </div>
                </div>
                <Chat 
                  messages={messages}
                  newMessage={newMessage}
                  setNewMessage={setNewMessage}
                  sendMessage={sendMessage}
                  name={name}
                />
              </div>
              
              {/* AI Chat */}
              <div className="card">
                <AIChatbot />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

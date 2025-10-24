const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const { getIceServers } = require("./utils/turnConfig");
const app = express();
app.use(cors());
app.use(express.json());
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });
const rooms = {};
const users = {};
app.get("/", (req, res) => res.send("Virtual Study Room signaling server"));
app.get("/ice-config", (req, res) => { res.json({ iceServers: getIceServers() }); });
app.post("/create-room", (req, res) => { const roomCode = "ROOM-" + Math.random().toString(36).substr(2,5).toUpperCase(); rooms[roomCode]=rooms[roomCode]||new Set(); res.json({ roomCode }); });
io.on("connection", (socket) => {
  console.log("Connected:", socket.id);
  socket.on("create-room", (cb)=> {
    const roomCode = "ROOM-" + Math.random().toString(36).substr(2,5).toUpperCase();
    rooms[roomCode] = rooms[roomCode] || new Set();
    rooms[roomCode].add(socket.id);
    socket.join(roomCode);
    users[socket.id] = users[socket.id] || { name: "Anonymous", stats: defaultStats(), roomCode };
    users[socket.id].roomCode = roomCode;
    if (typeof cb === "function") cb({ roomCode });
    io.to(roomCode).emit("room-update", Array.from(rooms[roomCode]));
    io.to(roomCode).emit("leaderboard-update", buildLeaderboardForRoom(roomCode));
  });
  socket.on("join-room", ({ roomCode, name }, cb)=> {
    rooms[roomCode] = rooms[roomCode] || new Set();
    rooms[roomCode].add(socket.id);
    socket.join(roomCode);
    users[socket.id] = users[socket.id] || { name: name || "Anonymous", stats: defaultStats(), roomCode };
    users[socket.id].name = name || users[socket.id].name;
    users[socket.id].roomCode = roomCode;
    io.to(roomCode).emit("user-joined", { id: socket.id, name: users[socket.id].name });
    io.to(roomCode).emit("room-update", Array.from(rooms[roomCode]));
    io.to(roomCode).emit("leaderboard-update", buildLeaderboardForRoom(roomCode));
    if (typeof cb === "function") cb({ ok: true });
  });
  socket.on("leave-room", ({ roomCode })=> {
    if (rooms[roomCode]) {
      rooms[roomCode].delete(socket.id);
      socket.leave(roomCode);
      if (users[socket.id]) users[socket.id].roomCode = null;
      io.to(roomCode).emit("user-left", { id: socket.id });
      io.to(roomCode).emit("room-update", Array.from(rooms[roomCode]));
      io.to(roomCode).emit("leaderboard-update", buildLeaderboardForRoom(roomCode));
    }
  });
  socket.on("signal", ({ toId, signal })=> {
    if (toId) io.to(toId).emit("signal", { from: socket.id, signal });
    else {
      const roomList = Array.from(socket.rooms).filter(r => r !== socket.id);
      if (roomList.length) socket.to(roomList[0]).emit("signal", { from: socket.id, signal });
    }
  });
  socket.on("message", ({ roomCode, message, sender })=> {
    if (!roomCode) roomCode = users[socket.id]?.roomCode;
    if (!roomCode) return;
    io.to(roomCode).emit("message", { sender, message, ts: Date.now() });
  });
  socket.on("update-stats", ({ stats })=> {
    if (!users[socket.id]) users[socket.id] = { name: "Anonymous", stats: defaultStats(), roomCode: null };
    users[socket.id].stats = { ...users[socket.id].stats, ...stats };
    const roomCode = users[socket.id].roomCode;
    if (roomCode) io.to(roomCode).emit("leaderboard-update", buildLeaderboardForRoom(roomCode));
  });
  socket.on("disconnecting", ()=> {
    const joined = Array.from(socket.rooms).filter(r => r !== socket.id);
    joined.forEach(roomCode => {
      if (rooms[roomCode]) {
        rooms[roomCode].delete(socket.id);
        socket.to(roomCode).emit("user-left", { id: socket.id, name: users[socket.id]?.name });
        socket.to(roomCode).emit("room-update", Array.from(rooms[roomCode]));
        socket.to(roomCode).emit("leaderboard-update", buildLeaderboardForRoom(roomCode));
      }
    });
  });
  socket.on("disconnect", ()=> { console.log("Disconnected:", socket.id); });
});
function defaultStats(){ return { xpPoints:0, focusTime:0, tasksCompleted:0, streakDays:0 }; }
function buildLeaderboardForRoom(roomCode){
  const ids = rooms[roomCode] ? Array.from(rooms[roomCode]) : [];
  const list = ids.map(id => {
    const u = users[id] || { name: "Anonymous", stats: defaultStats() };
    return { id, name: u.name || "Anonymous", xpPoints: u.stats?.xpPoints || 0, focusTime: u.stats?.focusTime || 0, tasksCompleted: u.stats?.tasksCompleted || 0, streakDays: u.stats?.streakDays || 0 };
  });
  list.sort((a,b)=> (b.xpPoints - a.xpPoints) || (b.focusTime - a.focusTime));
  return list;
}
const PORT = process.env.PORT || 4000;
server.listen(PORT, ()=> console.log(`Signaling server listening on :${PORT}`));

const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*", // Allow all origins for simplicity. For production, you'd restrict this.
    methods: ["GET", "POST"],
  },
});

const PORT = process.env.PORT || 4000;

app.use(cors());

// In-memory storage
const rooms = {}; // roomCode -> [socket.id, ...]
const userNames = {}; // socket.id -> name
const userStats = {}; // socket.id -> { points, studyTime }

function generateRoomCode() {
  return "ROOM-" + Math.random().toString(36).substring(2, 7).toUpperCase();
}

io.on("connection", (socket) => {
  console.log(`User connected: ${socket.id}`);

  socket.on("create-room", (callback) => {
    const roomCode = generateRoomCode();
    rooms[roomCode] = [socket.id];
    socket.join(roomCode);
    console.log(`Room created: ${roomCode} by ${socket.id}`);
    callback({ roomCode });
  });

  socket.on("join-room", ({ roomCode, name }, callback) => {
    if (rooms[roomCode]) {
      socket.join(roomCode);
      rooms[roomCode].push(socket.id);
      userNames[socket.id] = name;

      // Notify others in the room
      const otherUsers = rooms[roomCode].filter((id) => id !== socket.id);
      socket.to(roomCode).emit("user-joined", { id: socket.id, name });

      // Send existing users to the new user
      const usersInRoom = otherUsers.map(id => ({ id, name: userNames[id] }));
      socket.emit("room-update", usersInRoom.map(u => u.id));

      console.log(`User ${socket.id} (${name}) joined room ${roomCode}`);
      callback({ ok: true });
    } else {
      console.log(`User ${socket.id} failed to join room ${roomCode}`);
      callback({ ok: false });
    }
  });

  socket.on("signal", ({ toId, signal }) => {
    try {
      io.to(toId).emit("signal", { from: socket.id, signal });
    } catch (error) {
      console.error("Error sending signal:", error);
    }
  });

  socket.on("chat-message", ({ roomCode, msg }) => {
    if (rooms[roomCode]) {
      socket.to(roomCode).emit("chat-message", msg);
    }
  });

  socket.on("update-stats", ({ stats }) => {
    userStats[socket.id] = { ...userStats[socket.id], ...stats };
    // Broadcast updated leaderboard to all connected clients
    const leaderboard = Object.entries(userStats).map(([id, data]) => ({
        id,
        name: userNames[id] || 'Anonymous',
        ...data
    })).sort((a, b) => (b.points || 0) - (a.points || 0));
    io.emit("leaderboard-update", leaderboard);
  });

  socket.on("disconnect", () => {
    console.log(`User disconnected: ${socket.id}`);
    let roomToUpdate = null;
    for (const roomCode in rooms) {
      const index = rooms[roomCode].indexOf(socket.id);
      if (index > -1) {
        rooms[roomCode].splice(index, 1);
        if (rooms[roomCode].length === 0) {
          delete rooms[roomCode];
        } else {
          roomToUpdate = roomCode;
        }
        break;
      }
    }

    if (roomToUpdate) {
      io.to(roomToUpdate).emit("user-left", { id: socket.id });
    }

    delete userNames[socket.id];
    delete userStats[socket.id];
  });
});

app.get("/", (req, res) => {
  res.send("Smart Study Hub Signaling Server is running.");
});

server.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
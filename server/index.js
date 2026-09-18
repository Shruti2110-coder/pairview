const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
  },
});

const roomText = {};

function announcePresence(roomId) {
  const room = io.sockets.adapter.rooms.get(roomId);
  const count = room ? room.size : 0;
  io.to(roomId).emit("presence", count);
}

io.on("connection", (socket) => {
  console.log("someone connected:", socket.id);

  socket.on("join-room", (roomId) => {
    socket.join(roomId);
    socket.data.roomId = roomId;

    socket.emit("text-change", roomText[roomId] || "");
    announcePresence(roomId);

    console.log(socket.id, "joined", roomId);
  });

  socket.on("text-change", (nextText) => {
    const roomId = socket.data.roomId;
    if (!roomId) return;

    roomText[roomId] = nextText;
    socket.to(roomId).emit("text-change", nextText);
  });

  socket.on("disconnect", () => {
    console.log("someone left:", socket.id);

    const roomId = socket.data.roomId;
    if (!roomId) return;

    announcePresence(roomId);


    if (!io.sockets.adapter.rooms.get(roomId)) {
      delete roomText[roomId];
      console.log("room emptied, forgot text for", roomId);
    }
  });
});

server.listen(3001, () => {
  console.log("server running on port 3001");
});

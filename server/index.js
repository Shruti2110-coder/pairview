const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const { questions } = require("./questions")

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5174",
  },
});

const roomText = {};
const roomQuestion = {};

function forCandidate(question) {
  const{ solution, hints, ...safe} = question;
  return safe;
}

function announcePresence(roomId) {
  const room = io.sockets.adapter.rooms.get(roomId);
  const count = room ? room.size : 0;
  io.to(roomId).emit("presence", count);
}

io.on("connection", (socket) => {
  console.log("someone connected:", socket.id);

  socket.on("join-room", (roomId) => {
    const before = io.sockets.adapter.rooms.get(roomId);
    const wasEmpty = !before || before.size === 0;

    socket.join(roomId);
    socket.data.roomId = roomId;
    socket.data.role = wasEmpty ? "interviewer" : "candidate";

    if (!roomQuestion[roomId]) {
      roomQuestion[roomId] = questions[0];
      roomText[roomId] = questions[0].starterCode;
    }

    const question = roomQuestion[roomId];

      socket.emit("session-start", {
      role: socket.data.role,
      question:
        socket.data.role === "interviewer"
          ? question
          : forCandidate(question),
    });


    socket.emit("text-change", roomText[roomId] || "");
    announcePresence(roomId);

    console.log(socket.id, "joined", roomId, "as", socket.data.role);
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
      delete roomQuestion[roomId]
      console.log("room emptied, forgot text for", roomId);
    }

    console.log("someone left:", socket.id);
  });
});

server.listen(3001, () => {
  console.log("server running on port 3001");
});

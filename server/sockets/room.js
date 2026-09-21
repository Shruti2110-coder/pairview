const { questions } = require("../questions");
const { roomText, roomQuestion } = require("../store");
const { forCandidate } = require("../utils/sanitize");

function announcePresence(io, roomId) {
  const room = io.sockets.adapter.rooms.get(roomId);
  const count = room ? room.size : 0;
  io.to(roomId).emit("presence", count);
}

function registerRoomHandlers(io, socket) {
  socket.on("join-room", (roomId) => {
    const before = io.sockets.adapter.rooms.get(roomId) || new Set();
    const others = [...before].filter((id) => id !== socket.id);
    const wasEmpty = others.length === 0;

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
        socket.data.role === "interviewer" ? question : forCandidate(question),
    });

    socket.emit("text-change", roomText[roomId] || "");
    announcePresence(io, roomId);

    console.log(socket.id, "joined", roomId, "as", socket.data.role);
  });

  socket.on("disconnect", () => {
    console.log("someone left:", socket.id);

    const roomId = socket.data.roomId;
    if (!roomId) return;

    announcePresence(io, roomId);

    if (!io.sockets.adapter.rooms.get(roomId)) {
      delete roomText[roomId];
      delete roomQuestion[roomId];
      console.log("room emptied:", roomId);
    }
  });
}

module.exports = { registerRoomHandlers };
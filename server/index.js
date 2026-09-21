const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const { registerRoomHandlers } = require("./sockets/room");
const { registerEditorHandlers } = require("./sockets/editor");

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173", "http://localhost:5174"],
  },
});

io.on("connection", (socket) => {
  console.log("someone connected:", socket.id);
  registerRoomHandlers(io, socket);
  registerEditorHandlers(io, socket);
});

server.listen(3001, () => {
  console.log("server running on port 3001");
});
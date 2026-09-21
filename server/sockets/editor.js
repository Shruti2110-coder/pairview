const { roomText } = require("../store");

function registerEditorHandlers(io, socket) {
  socket.on("text-change", (newText) => {
    const roomId = socket.data.roomId;
    if (!roomId) return;

    roomText[roomId] = newText;
    socket.to(roomId).emit("text-change", newText);
  });
}

module.exports = { registerEditorHandlers };
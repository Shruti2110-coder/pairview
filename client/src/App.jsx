import { useState, useEffect } from "react";
import { io } from "socket.io-client";
import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";

const socket = io("http://localhost:3001");

function getRoomId() {
  const params = new URLSearchParams(window.location.search);
  const existing = params.get("room");
  if (existing) return existing;

  const generated = Math.random().toString(36).slice(2, 8).toUpperCase();
  window.history.replaceState({}, "", `?room=${generated}`);
  return generated;
}

const roomId = getRoomId();

function App() {
  const [code, setCode] = useState("");
  const [peers, setPeers] = useState(1);

  useEffect(() => {
    const joinRoom = () => socket.emit("join-room", roomId);

    joinRoom();
    socket.on("connect", joinRoom);

    socket.on("text-change", (newText) => {
      setCode(newText);
    });

    socket.on("presence", (count) => {
      setPeers(count);
    });

    return () => {
      socket.off("connect", joinRoom);
      socket.off("text-change");
      socket.off("presence");
    };
  }, []);

  // CodeMirror hands us the new document as a plain string,
  // not a DOM event — so there's no e.target.value here.
  const handleChange = (value) => {
    setCode(value);
    socket.emit("text-change", value);
  };

  return (
    <div style={{ padding: "40px", maxWidth: "900px", margin: "0 auto" }}>
      <h2>Shared editor</h2>
      <p style={{ fontFamily: "monospace" }}>
        Room: {roomId} ·{" "}
        {peers === 1 ? "waiting for partner" : `${peers} connected`}
      </p>

      <CodeMirror
        value={code}
        height="400px"
        theme="dark"
        extensions={[javascript()]}
        onChange={handleChange}
      />
    </div>
  );
}

export default App;
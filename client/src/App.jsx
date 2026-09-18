import { useState, useEffect, useLayoutEffect, useRef } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:3001");

function getRoomId(){
  const params = new URLSearchParams(window.location.search);
  const existing = params.get("room");
  if(existing) return existing;

  const generated = Math.random().toString(36).slice(2,8).toUpperCase();
  window.history.replaceState({}, "", `?room=${generated}`)
  return generated;
}

const roomId = getRoomId();

// Where should my caret sit after someone else's edit lands?
// Walk the common prefix: an edit before my caret shifts it, one after it
// leaves it alone.
function remapCaret(prev, next, caret){
  let common = 0;
  const max = Math.min(prev.length, next.length);
  while(common < max && prev[common] === next[common]) common++;

  if(caret <= common) return caret;
  return Math.max(common, caret + (next.length - prev.length));
}

function App(){
  const [text, setText] = useState("");
  const[peers, setPeers] = useState(1);

  const textareaRef = useRef(null);
  const caretAfterRender = useRef(null);

  useEffect(() => {

    const joinRoom = () => socket.emit("join-room", roomId);

    joinRoom();
    socket.on("connect", joinRoom)

    socket.on("text-change", (incoming) => {
      setText((prev) => {
        const el = textareaRef.current;
        // Only worth saving a caret if I'm actually typing in the box.
        if(el && document.activeElement === el){
          caretAfterRender.current = remapCaret(prev, incoming, el.selectionStart);
        }
        return incoming;
      });
    });

    socket.on("presence", (count) => {
setPeers(count);
  })

    return() => {
      socket.off("connect", joinRoom);
      socket.off("text-change");
      socket.off("presence");
    };
  }, []);

  // Put the caret back before the browser paints, so it never visibly jumps.
  useLayoutEffect(() => {
    const el = textareaRef.current;
    if(caretAfterRender.current !== null && el){
      el.setSelectionRange(caretAfterRender.current, caretAfterRender.current);
      caretAfterRender.current = null;
    }
  }, [text]);

  const handleChange = (e) =>{
    const newText = e.target.value;
    setText(newText);
    socket.emit("text-change", newText);
  };

  return (
    <div style={{ padding: "40px" }}>
      <h2>Shared editor</h2>
      <p style={{ fontFamily: "monospace" }}>
        Room: {roomId} ·{" "}
        {peers === 1 ? "waiting for partner" : `${peers} connected`}
      </p>
      <textarea
        ref={textareaRef}
        value={text}
        onChange={handleChange}
        rows={15}
        style={{ width: "100%", fontSize: "16px", fontFamily: "monospace" }}
      />
    </div>
  );
}

export default App;

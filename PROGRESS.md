Day 1 — 25 Aug

Built: Express + Socket.io server relaying text between two browsers. React client with a shared textarea. Typing in one window appears in the other, live.

Learned: socket.broadcast.emit sends to everyone except the sender. You have to exclude the sender or their own text gets echoed back and fights with what they're typing — cursor jumps, characters vanish.

Also learned why the socket is created outside the React component: React re-runs the component function on every state change, so io() inside would open a new WebSocket on every keystroke.

Broke: Blank page — useEfffect with three f's. React exports nothing by that name, so it came through as undefined and calling it threw during render. Lesson: a blank React page almost always means a crash, and the browser Console names the culprit.

Next step: Fix socket.io → socket.id on line 15 of server/index.js, then add the join-room handler.

Post: Got two browsers talking to each other today. First time building anything real-time.

Day 2 — 18 Sep

Built: Rooms and presence. The room code comes from ?room=XXXXXX in the URL, generated automatically if there isn't one. Two people on the same code share a document; anyone on a different code is completely isolated from them. The header shows "waiting for partner" or "2 connected". Added cleanup so roomText is deleted when a room empties, instead of leaking memory forever.

Learned: The server stores the room on socket.data.roomId at join time and never trusts the client again. If the client sent a room ID with every message, anyone could type a stranger's room code into their browser console and write into someone else's live session. Establish identity once, then use the server's own record.

Also: socket.to(room) excludes the sender, io.to(room) includes them. Presence uses io.to() because the person who just joined needs the count too.

Broke: Hours lost to typos — rommId vs roomId, text-cahnge vs text-change, and runInNewContext, which VS Code autocomplete inserted on its own. The misspelled event name was the worst: nothing errored, the listener just never fired. Lesson: when a variable name is wrong, Cmd+F for it — one match means you've found the typo in ten seconds.

Also found a reconnection bug. join-room only fired on mount, so after a server restart the socket reconnected but the server had forgotten which room it belonged to. Everything silently stopped working. Fixed by re-emitting join on every connect event. This would hit any real user who lost signal for a few seconds.

Next step: Replace the textarea with CodeMirror.

Post: Added rooms today. Two people with the same link share an editor; everyone else is invisible to them.

Day 3 — 20 Sep

Built: Replaced the textarea with CodeMirror 6 — line numbers, syntax highlighting, dark theme, bracket matching. Sync still works: two windows on the same room code show "2 connected" and text travels live between them. Renamed the project folder to pairview and pushed the whole thing to GitHub with a proper .gitignore.

Learned: CodeMirror's onChange hands you the document as a plain string, not a DOM event — so no e.target.value like a textarea.

Also learned CodeMirror's architecture: the core ships almost nothing and every feature arrives as an extension in an array. That's why javascript() has to be passed explicitly, and why it's a function call rather than a reference — it returns a configured extension. Small core, opt-in features, which is why the bundle stays light compared to Monaco.

Broke: Presence never showed "2 connected" even with matching room codes. No error anywhere — it just silently did nothing. Cause: Vite had moved to port 5174 because 5173 was occupied, but the server's CORS origin only allowed 5173, so the browser was being blocked. Fixed by allowing both ports.

Lesson: a feature doing nothing, with no error message, is usually CORS or a mismatched name — not broken logic. Errors that don't throw are the slowest to find.

Also hit EADDRINUSE repeatedly from orphaned server processes. lsof -ti:3001 | xargs kill -9 clears the port. Installed nodemon as a dev dependency so the server restarts on save instead of needing Ctrl+C every time.

Next step: Install yjs and y-codemirror.next, then replace the manual text-change relay with Yjs so two people can type at the same time without overwriting each other.

Post: Swapped my textarea for a real code editor today. Two browsers, one document, syncing live. Next: making it survive two people typing at once.
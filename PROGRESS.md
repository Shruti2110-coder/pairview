How to restart after a break

Do these four things in order, before writing any code:

Read the last entry in the log below. Only the last one.
Run the app. Server terminal (cd server && node index.js), client terminal (cd client && npm run dev). Confirm it still works.
Read the Next step line from that entry. Do only that.
Don't read the whole log, don't reorganise, don't redesign. Restarting is about momentum, not review.
Entry template

Copy this block for each session.

### Day N — 18 Sep

**Built:** what actually works now that didn't before

**Learned:** one concept, in your own words. Not "used socket.io" —
          "socket.to(room) excludes the sender, io.to(room) doesn't"

**Broke:** the error, and what fixed it

**Next step:** ONE sentence. Specific enough to start without thinking.
           Bad: "work on rooms"
           Good: "add the join-room handler to index.js, server side only"

**Post:** the one line you'd put on X about today
Why each field exists

Built — proves progress to yourself on days it doesn't feel like there was any. Also becomes your resume bullets, written while you remember the details.

Learned — this is the field that makes the project worth doing. In an interview nobody asks what you built; they ask what you understood. Writing the concept in your own words is the test of whether you actually got it.

Broke — your bug log. Interviewers ask "tell me about something that went wrong." Most students have nothing specific. You'll have twenty.

Next step — the single most valuable line in the file. It's the difference between opening the project and knowing what to do, versus opening it and closing it again. Write it while the context is still in your head.

Post — feeds your build-in-public thread, and forces you to name the day's work in plain language.

Rules

One step per session. Not one feature. If rooms take three sessions, that's three entries.

Write the entry even when nothing worked. "Spent two hours, CORS still broken, next step: check the origin string matches Vite's port exactly" is a genuinely useful entry.

Never end a session without the Next step line. This is the rule that protects you from the two-week gap.

The log
Day 1 — 25 Aug

Built: Express + Socket.io server relaying text between two browsers. React client with a shared textarea. Typing in one window appears in the other.

Learned: socket.broadcast.emit sends to everyone except the sender. You have to exclude the sender or their own text gets echoed back and fights with what they're typing.

Broke: Blank page — useEfffect with three f's. React exported nothing by that name, so calling it threw during render. Lesson: a blank React page almost always means a crash, and the browser Console names it.

Next step: Fix socket.io → socket.id on line 15 of server/index.js, then add the join-room handler.

Post: Got two browsers talking to each other today. First time building anything real-time.
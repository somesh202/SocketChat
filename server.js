const express = require("express");
const path = require("path");

const app = express();

// import http and create an express server
const server = require("http").createServer(app);

const io = require("socket.io")(server);

app.use(express.static(path.join(__dirname + "/public")));

io.on("connection", (socket) => {
  // event listener emitting update event for a new user joining the room
  socket.on("newuser", (username) => {
    socket.broadcast.emit("update", username + " joined the conversation");
  });

  // event listener emitting update event for a any user leaving the room

  socket.on("exituser", (username) => {
    socket.broadcast.emit("update", username + " left the conversation");
  });

  // event listener emitting chat event for a message triggered

  socket.on("chat", (mssg) => {
    socket.broadcast.emit("chat", mssg);
  });
});
server.listen(5000, () => {
  console.log("server running at http://localhost:5000");
});

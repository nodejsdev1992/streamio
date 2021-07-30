const { createServer, Server } = require("http");
const express = require("express");
const socketio = require("socket.io");
var app = express();
var httpServer = createServer(app);
const path = require("path");
var io = socketio(httpServer, {
  allowEIO3: true,
  maxHttpBufferSize: 1e7,
  pingTimeout: 30000
});
var intervals = [];
var streamBuffer = [];
io.on("connection", socket => {
  socket.on("publish", data => {
    streamBuffer.push(data);
    // console.log(data);
    // socket.broadcast.emit("videostream",data)
  });
  if (socket.handshake.query.subscriber) {
    var index = 0;
    console.log("subscriber connected");
    var interval = setInterval(function() {
      this.socket = socket;
      if (index < streamBuffer.length) {
        let newIndex =
          index + 50 < streamBuffer.length ? index + 50 : streamBuffer.length;
        this.socket.emit("videostream", streamBuffer.slice(index, newIndex));
        index = newIndex;
        console.log("sending current chunk " + index);
      }
    }, 500);
    intervals.push(interval);
    socket.on("disconnect", function() {
      clearInterval(interval);
    });
  }
  if (socket.handshake.query.publisher) {
    socket.on("disconnect", function() {
      socket.broadcast.emit("streamend", {});
      streamBuffer = [];
      console.log("Publisher disconnected");
      intervals.map(i => {
        clearInterval(i);
      });
      intervals = [];
    });
  }
});
app.use(express.static(path.join(__dirname, "/public")));
httpServer.listen(8080);
console.log("open localhost:8080/[publish|subscribe].html");

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
    setInterval(function() {
      this.socket = socket;
      if (index == 0) {
        this.socket.emit("videostream", streamBuffer);
      } else if (index !== streamBuffer.length) {
        this.socket.emit("videostream", streamBuffer.slice(index));
      }
      index = streamBuffer.length;
      console.log("sending current chunk " + index);
    }, 2000);
  }
});
app.use(express.static(path.join(__dirname, "/public")));
httpServer.listen(8080);

const socket = io("/", { query: { subscriber: true } });
// const remoteStream = new MediaStream();
const remoteVideo = document.getElementById("remote-video");
var mediaSource = new MediaSource();
remoteVideo.src = URL.createObjectURL(mediaSource);
var recordedChunks = [];
var counter = 0;
var url;
var persistentBuffer = [];
mediaSource.addEventListener("sourceopen", function(e) {
  console.log("open");
  mediaSourceBuffer = mediaSource.addSourceBuffer(
    'video/webm;codecs="vp8,opus"'
  );
  var tempBuffer = null;
  socket.on("videostream", data => {
    // if (url) URL.revokeObjectURL(url);
    // console.log("got data");
    // url = URL.createObjectURL(new Blob(data));
    // remoteVideo.src = url;
    // console.log(data);
    data.map(chunk => {
      persistentBuffer.push(chunk);
    });
    if (updatable) {
      updatable = false;
      mediaSourceBuffer.appendBuffer(persistentBuffer.shift());
    }
  });
  mediaSourceBuffer.addEventListener("updateend", function(_) {
    if (persistentBuffer.length > 0) {
      mediaSourceBuffer.appendBuffer(persistentBuffer.shift());
      console.log("smooth");
    } else {
      updatable = true;
      console.log("jitter");
    }
  });
});

var updatable = true;

// remoteVideo.onended = function() {
//   console.log(counter);
//   if (urls.length - 2 > counter) {
//     remoteVideo.src = urls[counter++];
//   }
// };
// function appendBuffer(buffer1, buffer2) {
//   if (!buffer1) {
//     return buffer2;
//   }
//   var tmp = new Uint8Array(buffer1.byteLength + buffer2.byteLength);
//   tmp.set(new Uint8Array(buffer1), 0);
//   tmp.set(new Uint8Array(buffer2), buffer1.byteLength);
//   return tmp;
// }

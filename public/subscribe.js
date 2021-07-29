const socket = io("/", { query: { subscriber: true } });
// const remoteStream = new MediaStream();
const remoteVideo = document.getElementById("remote-video");
var mediaSource = new MediaSource();
remoteVideo.src = URL.createObjectURL(mediaSource);
var recordedChunks = [];
var counter = 0;
var url;
mediaSource.addEventListener("sourceopen", function(e) {
  console.log("open");
  var mediaSourceBuffer = mediaSource.addSourceBuffer(
    'video/webm;codecs="vp8,opus"'
  );
  socket.on("videostream", data => {
    // if (url) URL.revokeObjectURL(url);
    // console.log("got data");
    // url = URL.createObjectURL(new Blob(data));
    // remoteVideo.src = url;
    console.log(data);
    let tempBuffer = appendBuffer(data[0], data[1]);
    for (let i = 2; i < data.length; i++) {
      tempBuffer = appendBuffer(tempBuffer, data[i]);
    }
    console.log(tempBuffer);
    mediaSourceBuffer.appendBuffer(tempBuffer);
  });
});
// remoteVideo.onended = function() {
//   console.log(counter);
//   if (urls.length - 2 > counter) {
//     remoteVideo.src = urls[counter++];
//   }
// };
function appendBuffer(buffer1, buffer2) {
  var tmp = new Uint8Array(buffer1.byteLength + buffer2.byteLength);
  tmp.set(new Uint8Array(buffer1), 0);
  tmp.set(new Uint8Array(buffer2), buffer1.byteLength);
  return tmp;
}

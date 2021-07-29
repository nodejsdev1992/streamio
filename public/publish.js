const socket = io.connect();
const remoteVideo = document.getElementById("remote-video");
var recordedChunks = [];
navigator.mediaDevices
  .getUserMedia({ video: true, audio: true })
  .then(inputMedia => {
    remoteVideo.srcObject = inputMedia;
    console.log("reached");
    const options = { mimeType: "video/webm" };
    const mediaRecorder = new MediaRecorder(inputMedia, options);
    mediaRecorder.addEventListener("dataavailable", function(e) {
      if (e.data.size > 0) {
        recordedChunks.push(e.data);
        socket.emit("publish", e.data);
        console.log(e.data);
      }
    });
    mediaRecorder.addEventListener("stop", function() {
      if (recordedChunks.length > 0) {
        socket.emit("publish", recordedChunks);
        console.log(recordedChunks);
      } else {
        console.log("zero buffer detected");
      }
      recordedChunks = [];
      mediaRecorder.start();
    });
    // setInterval(() => {
    //   mediaRecorder.stop();
    // }, 10000);
    mediaRecorder.start(500);
  });

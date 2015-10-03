var video = document.querySelector("#webcam");
//this just grabs the DOM

navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia || navigator.oGetUserMedia;
//set the getUserMedia function, which may diff across browsers

if (navigator.getUserMedia) {
  navigator.getUserMedia({video: true}, handleVideo, videoError);
}
//tells it to get video from the user. (guessing can also ask for mic?), then handle the video if user grants request, else handles user denial, etc.

function handleVideo(stream) {
  video.src = window.URL.createObjectURL(stream);
};
//this adds the source of the stream (which it turns into URL) to the DOM #videoElement

function videoError(e) {
  alert("Oops, looks like I'm unable to set up your webcam! Reload to try again.");
};

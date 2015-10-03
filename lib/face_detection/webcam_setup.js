( function() {
  window.Bricks = window.Bricks || {};

  Bricks.video = document.querySelector("#webcam");
  //this just grabs the DOM

  navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia || navigator.oGetUserMedia;

  if (navigator.getUserMedia) {
    navigator.getUserMedia({video: true}, handleVideo, videoError);
  }

  function handleVideo(stream) {
    Bricks.video.src = window.URL.createObjectURL(stream);
  };

  function videoError(e) {
    alert("Oops, looks like I'm unable to set up your webcam! Reload to try again.");
  };

}() );


/*
  Tradeoffs between the various video libraries. objectDetect was lightning fast, but only detected 1 face at a time and had a smoothing function built out, more esoteric & fine-tuning, where I wanted to build some of that myself.
  Tracking.js supported multiple face detections in a single frame, a lot more user-friendly and generally seemed more malleable.
*/

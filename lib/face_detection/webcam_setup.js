( function() {
  window.Bricks = window.Bricks || {};

  Bricks.Video = document.querySelector("#webcam");
  //PH** the only value this page of code provides is grabbing the DOM here

  navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia || navigator.oGetUserMedia;

  if (navigator.getUserMedia) {
    navigator.getUserMedia({video: true}, handleVideo, videoError);
  }

  function handleVideo(stream) {
    Bricks.Video.src = window.URL.createObjectURL(stream);
  };

  function videoError(e) {
    alert("Oops, looks like I'm unable to set up your webcam! Reload to try again.");
  };

}() );

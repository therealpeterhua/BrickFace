// ( function() {
//   window.Bricks = window.Bricks || {};
//
//   Bricks.tracker = function(game) {
//     game.movePaddle()
//   };
//
//
// }() );


(function() {
  window.Bricks = window.Bricks || {};

	var video = Bricks.video,
	detector;
		//PH** - detector is returned by ..js/objectdetect.js

	try {
		Bricks.Compatibility.getUserMedia({video: true}, function(stream) {
			try {
				video.src = Bricks.Compatibility.URL.createObjectURL(stream);
			} catch (error) {
				video.src = stream;
			}
			Bricks.Compatibility.requestAnimationFrame(play);
		}, function (error) {
			alert('WebRTC not available');
		});
	} catch (error) {
		alert(error);
	}

  setInterval(Bricks.Compatibility.requestAnimationFrame.bind(this, play), 250);

	function play() {
		// Bricks.Compatibility.requestAnimationFrame(play);
		if (video.paused) video.play();

		if (video.readyState === video.HAVE_ENOUGH_DATA && video.videoWidth > 0) {

          	// Prepare the detector once the video dimensions are known:
          	if (!detector) {
	      		var width = ~~(60 * video.videoWidth / video.videoHeight);
				var height  =60;
	      		detector = new objectdetect.detector(width, height, 1.1, objectdetect.frontalface_alt);
	      	}

        		// Perform the actual detection:
			var coords = detector.detect(video, 1);

			// console.log(coords)
			//PH ** - you'll wanna grab this coord and see what it is... looks like it pulls a range of coordinates out of objectdetect.js
			if (coords[0]) {
				var coord = coords[0];
        console.log([coord[0], coord[1]]);

				// Rescale coordinates from detector to video coordinate space:
				coord[0] *= video.videoWidth / detector.canvas.width;
				coord[1] *= video.videoHeight / detector.canvas.height;
				coord[2] *= video.videoWidth / detector.canvas.width;
				coord[3] *= video.videoHeight / detector.canvas.height;

			} else {
        //handle no faces detected...
			}
		}
	}
}() );

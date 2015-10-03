(function() {
  window.Bricks = window.Bricks || {};

  var FaceDetect = Bricks.FaceDetect = function(game) {
    this.game = game;
    this.video = Bricks.Video;
    this.setupMedia();
    this.detector;
    //PH** the requestAnimationFrame takes a callback -- you can't invoke it, so you must bind arguments to it...
    //PH** - if don't want them to see the camera, can just see the game!
  };

  FaceDetect.OBJECT_TYPE = objectdetect.frontalface_alt;
  FaceDetect.EDGE_GIVE = 0.25;

  FaceDetect.prototype.start = function() {
    this.detectionIntervalId = setInterval(
      Bricks.Compatibility.requestAnimationFrame.bind(
        null, this.play.bind(this)
      ), 250
    );
  };

  FaceDetect.prototype.halt = function() {
    // clearInterval(this.detectionIntervalId);
  }

  FaceDetect.prototype.setupMedia = function() {
    var video = this.video;

  	try {
  		Bricks.Compatibility.getUserMedia({video: true}, function(stream) {
  			try {
  				video.src = Bricks.Compatibility.URL.createObjectURL(stream);
  			} catch (error) {
  				video.src = stream;
  			}
        this.game.setUsingWebcam(true);
  			Bricks.Compatibility.requestAnimationFrame(this.play.bind(this));
  		}.bind(this), function (error) {
  			alert('WebRTC not available');
  		});
  	} catch (error) {
  		alert(error);
  	}
  };

	FaceDetect.prototype.play = function() {
    var video = this.video;

		if (video.paused) {
      video.play();
    }

		if (video.readyState === video.HAVE_ENOUGH_DATA && video.videoWidth > 0) {
      // prepare detector once video dimensions known
      this.checkDetectorSetup();

      //returns array of all faces detected, each face [x, y, width, height]
			var facesDetected = this.detector.detect(video, 1);
      // console.log(facesDetected);
      if (facesDetected.length !== 0) {
        this.handleDetectedFaces(facesDetected);
      }

			if (facesDetected[0]) {
				var coord = facesDetected[0];
        // console.log([coord[0], coord[1]]);

				// Rescale coordinates from detector to video coordinate space:
				coord[0] *= this.video.videoWidth / this.detector.canvas.width;
				coord[1] *= this.video.videoHeight / this.detector.canvas.height;
				coord[2] *= this.video.videoWidth / this.detector.canvas.width;
				coord[3] *= this.video.videoHeight / this.detector.canvas.height;

			} else {
        //PH - handle no faces detected...
			}
		}
	};

  FaceDetect.prototype.checkDetectorSetup = function() {
    if (this.detector) {
      return;
    }
    // scales the detector to width of the video
    var width = ~~(60 * this.video.videoWidth / this.video.videoHeight);
    //PH ^ double NOT bitwise operator. Math.floor() on meth. Strips decimals.
    var height = 60;
    this.detector = new objectdetect.detector(
      width, height, 1.1, FaceDetect.OBJECT_TYPE
    );
  };

  FaceDetect.prototype.handleDetectedFaces = function(faces) {
    var largestFace = this.findLargestFace(faces);
    var coord = largestFace[0] + (largestFace[2] / 2);
    // var adjustedCoord = (
    //   coord * this.video.videoWidth / this.detector.canvas.width
    // );     //converts to video coordinate space;

    //PH**** preprocess it first -- maybe change it to render once every 50 seconds and wait for the other 50/make a new request if it thinks ur face is to the left?

    var scaledCoord = this.scaleForGame(coord);
    this.pushFaceSpotToGame(scaledCoord);
    //PH** -- rehandle the scaled coordinate;
  };

  FaceDetect.prototype.findLargestFace = function(faces) {
    var largestFace = [0, 0, 0, 0];
    var largestArea = 0;
    faces.forEach( function(face) {
      var area = face[2] * face[3];
      if (area > largestArea) {
        largestFace = face;
        largestArea = area;
      }
    });

    return largestFace;
  };

  FaceDetect.prototype.scaleForGame = function(coord) {
    //returns coord as proportion of detector width;
    var coordProportion = coord / this.detector.canvas.width;
    //allows give on edges - can't detect a face with center exactly on edge
    var adjustedCoord = (coordProportion - FaceDetect.EDGE_GIVE) /
                        (1 - (FaceDetect.EDGE_GIVE * 2));
    adjustedCoord = (adjustedCoord < 0 ? 0 : adjustedCoord);
    adjustedCoord = (adjustedCoord > 1 ? 1 : adjustedCoord);
    return adjustedCoord;
  };

  FaceDetect.prototype.pushFaceSpotToGame = function(scaledCoord) {
    this.game.acceptFaceSpot(scaledCoord);
  };

}() );

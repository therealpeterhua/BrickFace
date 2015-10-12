(function() {
  window.Bricks = window.Bricks || {};

  var FaceDetect = Bricks.FaceDetect = function(vCtx, game) {
    this.vCtx = vCtx;
    this.game = game;
    this.video = document.querySelector("#webcam");
    this.smoother = new Bricks.Smoother(FaceDetect.SMOOTH_FRAMES);
    this.setupMedia();
    this.detector;
    this.canvasSetup;
  };

  FaceDetect.SMOOTH_FRAMES = 4;

  FaceDetect.FREQUENCY = 50;    //50ms proved optimal in testing

  FaceDetect.OBJECT_TYPE = objectdetect.frontalface_alt;
  FaceDetect.EDGE_GIVE = 0.25;

  FaceDetect.prototype.start = function() {
    this.detectionIntervalId = setInterval(
      Bricks.Compatibility.requestAnimationFrame.bind(
        null, this.play.bind(this)
      ), FaceDetect.FREQUENCY
    );
  };

  FaceDetect.prototype.halt = function() {
    clearInterval(this.detectionIntervalId);
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
  			alert("I'm unable to set up your webcam!\n\nIf you have Chrome, you may need to click on the red X'd out camera on the right side of the URL bar, next to the star.\n\nReload to try again.");
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
      // prepare drawing board & detector once video dimensions known
      this.checkCanvasSetup();
      this.checkDetectorSetup();

      //returns array of all faces detected, each face [x, y, width, height]
			var facesDetected = this.detector.detect(video, 1);
      if (facesDetected[0]) {
        this.handleDetectedFaces(facesDetected);
      }
		}
	};

  FaceDetect.prototype.checkDetectorSetup = function() {
    if (this.detector) {
      return;
    }
    // scales the detector to width of the video
    var width = ~~(60 * this._videoEl.width() / this._videoEl.height());
    var height = 60;
    this.detector = new objectdetect.detector(
      width, height, 1.1, FaceDetect.OBJECT_TYPE
    );
  };

  FaceDetect.prototype.checkCanvasSetup = function() {
    if (this.canvasSetup) {
      return;
    } else {
      var canvas = $('#webcam-canvas')[0];
      this._videoEl = $('video#webcam');
      canvas.height = this._videoEl.height();
      canvas.width = this._videoEl.width();
      this.canvasSetup = true;
    }
  };

  FaceDetect.prototype.handleDetectedFaces = function(faces) {
    var largestFace = this.findLargestFace(faces);
    this.drawFaceBox(largestFace, false);

    var smoothResult = this.preprocessDetection(largestFace);
    if (!smoothResult) { return; }

    this.drawFaceBox(smoothResult, true);
    var coord = smoothResult[0] + (smoothResult[2] / 2);

    var scaledCoord = this.scaleForGame(coord);
    this.pushFaceSpotToGame(scaledCoord);
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

  FaceDetect.prototype.preprocessDetection = function(face) {
    return this.smoother.smooth(face);
  };

  FaceDetect.prototype.scaleForGame = function(coord) {
    //returns coord as proportion of detector width;
    var coordProportion = coord / this.detector.canvas.width;

    //allows give on edges - can't detect a face centered on edge
    var adjustedCoord = (coordProportion - FaceDetect.EDGE_GIVE) /
                        (1 - (FaceDetect.EDGE_GIVE * 2));
    adjustedCoord = (adjustedCoord < 0 ? 0 : adjustedCoord);
    adjustedCoord = (adjustedCoord > 1 ? 1 : adjustedCoord);
    return adjustedCoord;
  };

  FaceDetect.prototype.pushFaceSpotToGame = function(scaledCoord) {
    this.game.acceptFaceSpot(scaledCoord);
  };

  FaceDetect.prototype.drawFaceBox = function(face, smoothed) {
    canvasCoords = this.scaleToCanvas(face);
    if (smoothed) {
      this.vCtx.strokeStyle = 'blue';
      this.vCtx.lineWidth = 3;
    } else {
      this.vCtx.clearRect(0, 0, this._videoEl.width(), this._videoEl.height());
      this.vCtx.strokeStyle = 'grey';
      this.vCtx.lineWidth = 1;
    }

    this.vCtx.strokeRect( canvasCoords[0], canvasCoords[1],
                        canvasCoords[2], canvasCoords[3] );
  };

  FaceDetect.prototype.scaleToCanvas = function(face) {
    var videoEl = this._videoEl;

    return [
      face[0] * videoEl.width() / this.detector.canvas.width,
      face[1] * videoEl.height() / this.detector.canvas.height,
      face[2] * videoEl.width() / this.detector.canvas.width,
      face[3] * videoEl.height() / this.detector.canvas.height,
    ];
  };

}() );

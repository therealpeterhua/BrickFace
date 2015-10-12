(function() {
  window.Bricks = window.Bricks || {};

  var Smoother = Bricks.Smoother = function(numSmoothedFrames) {
    this.averageQueue = new Bricks.AverageQueue(numSmoothedFrames);
    this.falseDetects = 0;         //# of false detections
  };

  Smoother.MAX_FALSE_DETECTS = 2;
  Smoother.MAX_AREA_DIFF = 1.35;
  Smoother.MAX_POS_DIFF = 10;
  Smoother.MIN_POS_DIFF = 3;

  Smoother.prototype.smooth = function(coord) {
    var smoothedCoord = this.acceptFrameCoord(coord);
    if (smoothedCoord) {
      this.setNewFrame(smoothedCoord);
    }
    return smoothedCoord;
  }

  Smoother.prototype.acceptFrameCoord = function(coord) {
    if (this.passPreprocessing(coord) || this.reachedFalseDetectLimit() ) {
      this.averageQueue.enqueue(coord);     //automatic dequeue
      this.resetFalseDetects();
      return this.averageQueue.avgArr;
    } else {
      this.incrementFalseDetects();
      return false;
    }
  };

  Smoother.prototype.setNewFrame = function(coord) {
    this.currArea = coord[2] * coord[3];
    this.currPos = coord;
  };

  Smoother.prototype.passPreprocessing = function(coord) {
    this.passAreaTest(coord) && this.passPosTest(coord);
  };

  Smoother.prototype.passAreaTest = function(coord) {
    var newArea = coord[2] * coord[3];
    return (newArea <= this.currArea * Smoother.MAX_AREA_DIFF) &&
           (newArea >= this.currArea / Smoother.MAX_AREA_DIFF);
  };

  Smoother.prototype.passPosTest = function(coord) {
    return this.passMaxPosChangeTest(coord) &&
           this.passMinPosChangeTest(coord);
  };

  Smoother.prototype.passMaxPosChangeTest = function(coord) {
    return( Math.abs(coord[0] - this.currPos[0]) < Smoother.MAX_POS_DIFF &&
            Math.abs(coord[1] - this.currPos[1]) < Smoother.MAX_POS_DIFF );
  };

  Smoother.prototype.passMinPosChangeTest = function(coord) {
    return( Math.abs(coord[0] - this.currPos[0]) > Smoother.MIN_POS_DIFF &&
            Math.abs(coord[1] - this.currPos[1]) > Smoother.MIN_POS_DIFF );
  };

  Smoother.prototype.reachedFalseDetectLimit = function() {
    return this.falseDetects === Smoother.MAX_FALSE_DETECTS;
  };

  Smoother.prototype.incrementFalseDetects = function() {
    this.falseDetects++;
  };

  Smoother.prototype.resetFalseDetects = function() {
    this.falseDetects = 0;
  };

}() );

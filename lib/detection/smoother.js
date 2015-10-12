(function() {
  window.Bricks = window.Bricks || {};

  var Smoother = Bricks.Smoother = function(numSmoothedFrames) {
    this.averageQueue = new Bricks.AverageQueue(numSmoothedFrames);
    this.falseDetects = 0;         //# of false detections
  };

  Smoother.MAX_FALSE_DETECTS = 2;

  Smoother.prototype.smooth = function(coord) {
    if (this.passPreProcessing(coord) || this.reachedFalseDetectLimit() ) {
      this.averageQueue.enqueue(coord);     //automatic dequeue
      this.resetFalseDetects();
      return this.averageQueue.avgArr;
    } else {
      this.incrementFalseDetects();
      return false;
    }
  };

  Smoother.prototype.passPreProcessing = function(coord) {
    this.passAreaTest() && this.passPosTest();
  };

  Smoother.prototype.passAreaTest = function() {
    return true;
  };

  Smoother.prototype.passPosTest = function() {
    return true;
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

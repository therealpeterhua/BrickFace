(function() {
  window.Bricks = window.Bricks || {};

  var Smoother = Bricks.Smoother = function(size) {
    this.averageQueue = Bricks.AverageQueue;
    this.fullSize = size;
    this.falseDetects = 0;         //# of false detections
  };

  Smoother.MAX_FALSE_DETECTS = 3;

  Smoother.prototype.smooth = function(coord) {
    this.acceptNewFrame(coord);

  };

  Smoother.prototype.acceptNewFrame = function(coord) {
    if (this.currQueue.length !== this.fullSize) {
      this.averageQueue.push(coord)   //handle this here!!!!
      return;
    }

    if (this.passPreProcessing(coord) || this.reachedFalseDetectLimit() ) {
      this.currQueue.enqueue(coord);
      this.currQueue.dequeue();
      this.resetFalseDetects();
      return
    } else {
      return false;
    }
  };

  Smoother.prototype.passPreProcessing = function(coord) {
    this.passAreaTest() && this.passPosTest();
  };

  Smoother.prototype.passAreaTest = function() {

  };

  Smoother.prototype.passPosTest = function() {

  };

  Smoother.prototype.reachedFalseDetectLimit = function() {
    return this.falseDetects === Smoother.MAX_FALSE_DETECTS;
  };

  Smoother.prototype.resetFalseDetects = function() {
    this.falseDetects = 0;
  };

}() );

(function() {
  window.Bricks = window.Bricks || {};

  var Smoother = Bricks.Smoother = function(size) {
    this.averageQueue = Bricks.AverageQueue;
    this.fullSize = size;
  };

  Smoother.prototype.acceptNewFrame = function(coord) {
    if (this.currQueue.length !== this.fullSize) {
      this.averageQueue.push(coord)   //handle this here!!!!
      return;
    }

    if (this.passPreProcessing(coord)) {
      this.currQueue.enqueue(coord);
      this.currQueue.dequeue();
    }
  };

  Smoother.prototype.passPreProcessing = function(coord) {
    
  };

}() );

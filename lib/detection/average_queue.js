(function() {
  window.Bricks = window.Bricks || {};

  var AverageQueue = Bricks.AverageQueue = function(size) {
    this.currQueue = [];
    this.avgArr = undefined;
    this.maxSize = size;
  };

  AverageQueue.prototype.enqueue = function(array) {
    if (this.currQueue.length === 0) {
      this.currQueue.push(array);
      this.avgArr = array;
    } else {
      this.currQueue.push(array);
      this.addToAverages(array);
      return this;
    }
  };

  AverageQueue.prototype.dequeue = function() {
    var array = this.currQueue.shift();
    this.removeFromAverages(array);
    return array;
  };

  AverageQueue.prototype.addToAverages = function(array) {
    for (var i = 0; i < array.length; i++) {
      this.avgArr[i] += (array[i] / this.maxSize);
    };
  };

  AverageQueue.prototype.removeFromAverages = function(array) {
    for (var i = 0; i < array.length; i++) {
      this.avgArr[i] -= (array[i] / this.maxSize);
    }
  };

  AverageQueue.prototype.average = function() {
    return this.avgArr
  };
}() );

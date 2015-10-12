(function() {
  window.Bricks = window.Bricks || {};

  var AverageQueue = Bricks.AverageQueue = function(size) {
    this.currQueue = [];
    this.avgArr = undefined;
    // this.avgProd = undefined;    //NOTE: you only have to multiply together last 2
    this.maxSize = size;
  };

  //PH** - you need to handle the area
  //PH** - you need to handle avgArr when length is between 0 and this.maxSize

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
    this.avgProd
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

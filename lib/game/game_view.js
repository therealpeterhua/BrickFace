( function() {
  window.Bricks = window.Bricks || {};

  var GameView = Bricks.GameView = function(ctx) {
    this.game = new Bricks.Game(this);
    // leave following line of code here b/c need to turn it off f/ top level
    this.faceDetect = new Bricks.FaceDetect(this.game);
    this.ctx = ctx;
    this.bindKeyHandlers();         //again, may have to move the left-right-listeners
    this.paused = false;
    this.gameOver = false;
  };

  GameView.prototype.start = function() {
    this.gameIntervalId = setInterval(this.stepThruGame.bind(this), 15);
    this.faceDetect.start();
  };

  GameView.prototype.stepThruGame = function() {
    this.game.step();
    this.game.draw(this.ctx);         //ctx is passed thru from the top-level here. Only need the ctx for draw functions
  };

  GameView.prototype.bindKeyHandlers = function() {
    var gameView = this;

    key('space', function() {debugger;});
    key('P', function() {
      gameView.togglePause();
    });
  };

  GameView.prototype.halt = function() {
    clearInterval(this.gameIntervalId);
    this.faceDetect.halt();
  }

  GameView.prototype.togglePause = function() {
    if (this.gameOver) {
      return;
    }

    if (this.paused) {
      this.start();
      this.paused = false;
    } else {
      this.halt();
      this.paused = true;
    }
  };

  GameView.prototype.handleWin = function() {
    this.halt();
    this.gameOver = true;
    alert('You win!');
  };

  GameView.prototype.handleLoss = function() {
    this.halt();
    this.gameOver = true;
    alert('You lose!');
  };
}() );

/*
Node with socket.io
Node sets up the server on back-end, socket.io handles incoming requests from the clients.

Node start === rails s
Server has listeners. When Client starts new player/moves, pushes a request to the server --> socket.io catches it (?), pushes the changed state out to all existing remote clients.

*/

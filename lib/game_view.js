( function() {
  window.Bricks = window.Bricks || {};

  var GameView = Bricks.GameView = function(ctx) {
    this.game = new Bricks.Game(this);
    this.ctx = ctx;
    this.bindKeyHandlers();         //again, may have to move the left-right-listeners
    this.paused = false;
    this.gameOver = false;
  };

  GameView.prototype.start = function() {
    this.intervalId = setInterval(this.stepThruGame.bind(this), 0);
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

  GameView.prototype.togglePause = function() {
    if (this.gameOver) {
      return;
    }

    if (this.paused) {
      this.start();
      this.paused = false;
    } else {
      clearInterval(this.intervalId);
      this.paused = true;
    }
  };

  GameView.prototype.handleWin = function() {
    clearInterval(this.intervalId);
    this.gameOver = true;
    alert('You win!');
  };

  GameView.prototype.handleLoss = function() {
    clearInterval(this.intervalId);
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

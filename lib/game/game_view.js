( function() {
  window.Bricks = window.Bricks || {};

  var GameView = Bricks.GameView = function(ctx, videoCtx) {
    this.game = new Bricks.Game(this);
    // leave following line of code here b/c need to turn it off f/ top level
    this.faceDetect = new Bricks.FaceDetect(videoCtx, this.game);
    this.ctx = ctx;
    this.bindKeyHandlers();         //again, may have to move the left-right-listeners
    this.paused = false;
    this.gameOver = false;
    this.attachListeners();
  };

  GameView.prototype.attachListeners = function() {
    $('div.new-game').on('click', this.startNewGame.bind(this));
  };

  GameView.prototype.startNewGame = function() {
    this.halt();
    this.start();
    this.game.startNew();
    $('div.new-game').addClass('hidden');
    $('div.lose-message').addClass('hidden');
    $('div.win-message').addClass('hidden');
  };

  GameView.prototype.start = function() {
    this.gameIntervalId = setInterval(this.stepThruGame.bind(this), 5);
    this.faceDetect.start();
  };

  GameView.prototype.stepThruGame = function() {
    this.game.step();
    this.game.draw(this.ctx);         //ctx is passed thru from the top-level here. Only need the ctx for draw functions
  };

  GameView.prototype.bindKeyHandlers = function() {
    var gameView = this;

    key('X', function() {debugger;});       //PH** - delete this
    key('P', function(e) {
      e.preventDefault();
      gameView.togglePause();
    });
    key('space', function(e) {
      e.preventDefault();
      this.game.fireBall();
    }.bind(this));
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
    $('div.new-game').removeClass('hidden');
    $('div.win-message').removeClass('hidden');
  };

  GameView.prototype.alertLoss = function() {
    this.halt();
    this.gameOver = true;
    $('div.new-game').removeClass('hidden');
    $('div.lose-message').removeClass('hidden');
  };

}() );

/*
Node with socket.io
Node sets up the server on back-end, socket.io handles incoming requests from the clients.

Node start === rails s
Server has listeners. When Client starts new player/moves, pushes a request to the server --> socket.io catches it (?), pushes the changed state out to all existing remote clients.

*/

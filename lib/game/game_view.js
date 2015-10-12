( function() {
  window.Bricks = window.Bricks || {};

  var GameView = Bricks.GameView = function(ctx, videoCtx) {
    this.game = new Bricks.Game(this);
    this.faceDetect = new Bricks.FaceDetect(videoCtx, this.game);
    this.ctx = ctx;
    this.bindKeyHandlers();
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
    this.game.reset();
    $('div.new-game').addClass('hidden');
    $('div.lose-message').addClass('hidden');
    $('div.win-message').addClass('hidden');
  };

  GameView.prototype.start = function() {
    this.gameIntervalId = setInterval(this.stepThruGame.bind(this), 10);
    this.faceDetect.start();
  };

  GameView.prototype.stepThruGame = function() {
    this.game.step();
    this.game.draw(this.ctx);
  };

  GameView.prototype.bindKeyHandlers = function() {
    var gameView = this;

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

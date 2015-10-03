( function() {    //PH** - remember using the IIFE to create local variables
  window.Bricks = window.Bricks || {};

  var Game = Bricks.Game = function(gameView) {
    this.gameView = gameView;
    this.bricks = [];
    this.addBricks();
    this.ball = this.createNewBall();
    this.paddle = this.createNewPaddle();
    this.usingWebcam = false;
  };

  Game.DIM_X = 405;
  Game.DIM_Y = 600;

  Game.prototype.createNewBall = function() {
    return new Bricks.Ball({
      pos: [250, 480],
      vel: [-1, -1],
      dimX: Game.DIM_X,
      dimY: Game.DIM_Y,
      game: this,
    });
  };

  Game.prototype.createNewPaddle = function() {
    return new Bricks.Paddle({
      pos: [250, 500],
      vel: [0,0],
      dimX: Game.DIM_X,
    });
  };

  Game.prototype.addBricks = function() {
    for (var n = 0; n < 20; n++) {
      var idx = 81 * n;
      var xIdx = (idx) % Game.DIM_X + 3;
      var yIdx = Math.floor(n / 5) * 25 + 5;
      this.bricks.push(new Bricks.Brick({
        pos: [xIdx, yIdx],
        game: this,
      }));
    };
  };

  Game.prototype.setUsingWebcam = function(bool) {
    this.usingWebcam = bool;
    this.paddle.setKeyPressListen(false);
  };

  Game.prototype.allObjects = function() {
    return this.bricks
            .concat([this.ball])
            .concat([this.paddle]);
  };

  Game.prototype.step = function() {
    this.moveObjects();
    this.checkCollisions();
    this.checkWin();
    //I'll also need to check if ball has moved beneath the board
  };

  Game.prototype.moveObjects = function() {
    this.allObjects().forEach( function(object) {
      object.move();
    });
  };

  Game.prototype.acceptFaceSpot = function(scaledCoord) {
    var unscaledCoord = Game.DIM_X * scaledCoord;
    this.paddle.floatTo(unscaledCoord);
  };

  Game.prototype.checkWin = function() {
    if (this.bricks.length === 0) {
      this.gameView.handleWin();
    }
  };

  Game.prototype.checkCollisions = function() {
    this.ball.checkWallHitAndLoss();
    this.paddle.checkBallHit(this.ball);

    this.bricks.forEach( function(brick) {
      brick.checkBallCollision(this.ball);
    }.bind(this));
  };

  Game.prototype.draw = function(ctx) {
    ctx.clearRect(0, 0, Game.DIM_X, Game.DIM_Y);

    this.allObjects().forEach(function(object) {
      object.draw(ctx);
    });
  };

  Game.prototype.removeBrick = function(brick) {
    var brickIdx = this.bricks.indexOf(brick);
    this.bricks.splice(brickIdx, 1);
  };

  Game.prototype.alertLoss = function() {
    this.gameView.handleLoss();
  };

}() );

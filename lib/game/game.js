( function() {    //PH** - remember using the IIFE to create local variables
  window.Bricks = window.Bricks || {};

  var Game = Bricks.Game = function(gameView) {
    this.gameView = gameView;
    this.bricks = [];
    this.addBricks();
    this.paddle = this.createNewPaddle();
    this.ball = this.createNewBall();
    this.started = false;
    this.usingWebcam = false;
    this.lives = 3;
  };

  Game.DIM_X = 405;
  Game.DIM_Y = 600;
  Game.BALL_VEL = [0, -5];

  Game.prototype.createNewBall = function() {
    return new Bricks.Ball({
      pos: [200, 200],
      dimX: Game.DIM_X,
      dimY: Game.DIM_Y,
      game: this,
    });

    this.started = false; //PH** - we can set this later?
  };

  Game.prototype.fireBall = function() {
    if (this.started) {
      return;
    }

    this.ball.vel = Game.BALL_VEL.slice();
    debugger;
    this.started = true;
  };

  Game.prototype.resetBall = function() {
    this.ball.pos = [200, 200];
    this.ball.vel = Bricks.Ball.INITIAL_VEL;
    this.started = false;
  };

  Game.prototype.createNewPaddle = function() {
    return new Bricks.Paddle({
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

    $('strong.lives-left').text(this.lives);
  };

  Game.prototype.removeBrick = function(brick) {
    var brickIdx = this.bricks.indexOf(brick);
    this.bricks.splice(brickIdx, 1);
  };

  Game.prototype.handleLoss = function() {
    this.lives--

    if (this.lives) {
      this.resetBall();
    } else {
      this.gameView.alertLoss();
    }
  };

}() );

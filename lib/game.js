( function() {
  window.Bricks = window.Bricks || {};

  var Game = Bricks.Game = function(gameView) {
    this.gameView = gameView;
    this.bricks = [];
    this.addBricks();
    this.ball = new Bricks.Ball({
      // pos: [223, 465],
      // vel: [2, -2],              //ball flies along paddle
      pos: [250, 447],
      vel: [-2, 2],
      dimX: Game.DIM_X,
      dimY: Game.DIM_Y,
      game: this,
    });
    this.paddle = new Bricks.Paddle({
      pos: [250, 450],
      vel: [0,0],
      dimX: Game.DIM_X,
    });
  };

  Game.DIM_X = 405;
  Game.DIM_Y = 600;

  Game.prototype.addBricks = function() {
    for (var n = 0; n < 20; n++) {
      var idx = 81 * n;
      var xIdx = (idx) % Game.DIM_X + 3;
      var yIdx = Math.floor(n / 5) * 25 + 5;
      this.bricks.push(new Bricks.Brick({
        pos: [xIdx, yIdx],
        game: this,
      }));
    }
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

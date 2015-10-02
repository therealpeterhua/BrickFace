( function() {
  window.Bricks = window.Bricks || {};

  var Game = Bricks.Game = function() {
    this.bricks = [];
    this.addBricks();
    this.ball = new Bricks.Ball({
      // pos: [250, 250],
      // vel: [-10, -7],    //vanishes into upper right corner, weird behavior below paddle
      // vel: [-7, -7],     //vanishes into upper left corner
      radius: 10,         //this should be hardcoded into the ball, just pass the position
      // pos: [240, 585],
      // vel: [10, 7],       //weird bounces
      // pos: [383, 593],
      // vel: [-2, 2],           //causes to disappear in upper right
      // pos: [278, 110],
      // vel: [7, -7],             //disappears to upper right
      pos: [223, 465],
      vel: [2, -2],              //ball flies along paddle
      color: 'white',
      dimX: Game.DIM_X,
      dimY: Game.DIM_Y,
    });
    this.paddle = new Bricks.Paddle({
      pos: [250, 450],
      vel: [0,0],
      width: 100,
      height: 2,
      dimX: Game.DIM_X,
    });
  };

  Game.DIM_X = 400;
  Game.DIM_Y = 600;

  Game.prototype.allObjects = function() {
    return this.bricks
            .concat([this.ball])
            .concat([this.paddle]);
  };

  Game.prototype.step = function() {
    this.moveObjects();
    this.checkCollisions();
    //I'll also need to check if ball has moved beneath the board
  };

  Game.prototype.moveObjects = function() {
    this.allObjects().forEach( function(object) {
      object.move();
    });
  };

  Game.prototype.checkCollisions = function() {
    this.ball.checkWallHit();
    this.paddle.checkBallHit(this.ball);

    this.bricks.forEach( function(brick) {
      brick.checkBallCollision(this.ball);
    }.bind(this));

    //ball only checks for wall collision.
    //bricks check for ball collision -- can tell the ball to handle BrickCollision as well

    //check for collisions among each object -- I'll only need to do this for ball vs. brick, or maybe brick vs. brick

    // game.allObjects().forEach(function(checkObject) {
    //   game.allObjects().forEach(function(otherObject) {
    //     if(checkObject !== otherObject) {
    //       if (checkObject.isCollidedWith(otherObject)) {
    //         checkObject.handleCollision(otherObject);
    //       }
    //     }
    //   });
    // })
  };

  Game.prototype.draw = function(ctx) {
    ctx.clearRect(0, 0, Game.DIM_X, Game.DIM_Y);

    this.allObjects().forEach(function(object) {
      object.draw(ctx);
    });
  };

  Game.prototype.addBricks = function() {

  };

  Game.randomPos = function() {
    // remember brick generation is procedural, not random
  };

}() );

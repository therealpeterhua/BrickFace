( function() {
  window.Bricks = window.Bricks || {};

  var Brick = window.Bricks.Brick = function(options) {
    this.game = options.game;
    this.pos = options.pos;
    this.vel = Brick.vel;
    this.width = Brick.width;
    this.height = Brick.height;
    this.color = Brick.color;

    //PH - you should have broken bricks that display
    this.health = 2;
  };

  //PH**** - gotta put the bricks close together so you can't touch two at once! But you still will... if you get past the original and hit a corner of 3 bricks.

  Brick.vel = [0, 0];
  Brick.color = 'white';
  Brick.height = 20;
  Brick.width = 75;

  //draws onto the board
  Brick.prototype.draw = function(ctx) {
    ctx.fillStyle = this.color;

    ctx.fillRect(
      this.pos[0],
      this.pos[1],
      this.width,
      this.height
    );
  };

  Brick.prototype.move = function () {
    var newX = this.pos[0] + this.vel[0];
    var newY = this.pos[1] + this.vel[1];
    this.pos [newX, newY];      //check for bounces, wrapping here
  };

  //PH** - all this has to be in ball.js??
  Brick.prototype.checkBallCollision = function(ball) {
    //at time of collision, where is the ball's centralposition relative to the brick? If it's below, flip velocity appropriately. If it's both below AND to the right, deal with appropriately (flip twice)
    //You can specify at what point to count as collision...
    if (!this.contactingBrick(ball)) {
      return;
    }

    var flip_y = false, flip_x = false;

    var leftOrRight = this.findHitDirection(ball, 0);
    flip_x = leftOrRight ? true : false;      //string ==> boolean conversion

    var aboveAndBelow = this.findHitDirection(ball, 1);
    flip_y = aboveAndBelow ? true : false;

    if (flip_y && flip_x) {
      // leftOrRight, aboveAndBelow are scales for ball velocity --> so it always flies away from the brick corner
      ball.handleCornerBounce(leftOrRight, aboveAndBelow);
    } else {
      ball.handleBounce(flip_x, flip_y);
    }

    this.game.removeBrick(this);      //WRITE CODE FOR THIS
  };

  Brick.prototype.contactingBrick = function(ball) {
    var x_left_bound = this.pos[0] - ball.radius;
    var x_right_bound = this.pos[0] + this.width + ball.radius;
    var y_upper_bound = this.pos[1] - ball.radius;
    var y_lower_bound = this.pos[1] + this.height + ball.radius;

    return (ball.pos[0] >= x_left_bound && ball.pos[0] <= x_right_bound) &&
           (ball.pos[1] <= y_lower_bound && ball.pos[1] >= y_upper_bound);
  };

  Brick.prototype.findHitDirection = function(ball, posIdx) {
    var checkDim = (posIdx === 0 ? this.width : this.height);

    if (ball.pos[posIdx] < this.pos[posIdx]) {
      return -1;
    } else if (ball.pos[posIdx] > this.pos[posIdx] + checkDim) {
      return 1;
    } else {
      return false;
    }
  };

}() );


// Brick.prototype.brickCollisionSide = function(ball, posIdx) {
//   var testDim;
//   testDim = (posIdx === 1 ? this.height : this.width);
//   return (ball.pos[posIdx] + ball.radius >= this.pos[posIdx] - ball.radius) ||
//          (ball.pos[posIdx] - ball.radius <= this.pos[posIdx] +
//            testDim + ball.radius);
//
//   // return (ball.pos[posIdx] + ball.radius >= this.pos[posIdx] - ball.radius) ||
//   //        (ball.pos[posIdx] - ball.radius <= this.pos[posIdx] +
//   //          testDim + ball.radius);
// };

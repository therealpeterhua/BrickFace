( function() {
  window.Bricks = window.Bricks || {};

  var Brick = window.Bricks.Brick = function(options) {
    this.game = options.game;
    this.pos = options.pos;
    this.vel = Brick.VEL;
    this.width = Brick.WIDTH;
    this.height = Brick.HEIGHT;
    this.color = Brick.COLOR;

    this.health = 2;
  };

  Brick.VEL = [0, 0];
  Brick.COLOR = 'white';
  Brick.WIDTH = 75;
  Brick.HEIGHT = 20;

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
    this.pos [newX, newY];
  };

  Brick.prototype.checkBallCollision = function(ball) {
    if (!this.contactingBrick(ball)) {
      return;
    }

    var flip_y = false, flip_x = false;

    var leftOrRight = this.findHitDirection(ball, 0);
    flip_x = leftOrRight ? true : false;

    var aboveAndBelow = this.findHitDirection(ball, 1);
    flip_y = aboveAndBelow ? true : false;

    if (flip_y && flip_x) {
      ball.handleCornerBounce(leftOrRight, aboveAndBelow);
    } else {
      ball.handleBounce(flip_x, flip_y);
    }

    this.game.removeBrick(this);
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

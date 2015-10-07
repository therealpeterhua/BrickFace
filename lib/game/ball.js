( function() {
  window.Bricks = window.Bricks || {};

  var Ball = window.Bricks.Ball = function(options) {
    this.game = options.game;
    this.pos = options.pos;
    this.vel = Ball.INITIAL_VEL;
    this.radius = Ball.RADIUS;
    this.color = Ball.COLOR;
    this.dimX = options.dimX;
    this.dimY = options.dimY;
  };

  Ball.INITIAL_VEL = [0, 0];
  Ball.RADIUS = 10;
  Ball.COLOR = "white";

  Ball.prototype.draw = function(ctx) {
    ctx.fillStyle = this.color;
    ctx.beginPath();

    ctx.arc(
      this.pos[0],
      this.pos[1],
      this.radius,
      0,            //start and end angels
      2 * Math.PI,  //draws a full circle
      false         //clockwise/anti-clockwise
    )

    ctx.fill();
  };

  Ball.prototype.move = function () {
    var newX = this.pos[0] + this.vel[0];
    var newY = this.pos[1] + this.vel[1];
    this.pos = [newX, newY];
  };

  Ball.prototype.checkWallHitAndLoss = function() {
    this.checkLoss();
    this.checkWallHit();
  };


  Ball.prototype.checkLoss = function() {
    if (this.pos[1] - this.radius > this.dimY) {
      this.game.handleLoss();
    }
  };

  Ball.prototype.checkWallHit = function() {
    var flip_y = false;
    var flip_x = false;

    if ( (this.pos[0] - this.radius <= 0) ||
         (this.pos[0] + this.radius >= this.dimX) ) {
      flip_x = true;
    }

    if (this.pos[1] - this.radius <= 0) {
      flip_y = true;
    }

    this.handleBounce(flip_x, flip_y);
  };

  Ball.prototype.handleBounce = function(flip_x, flip_y) {
    this.handleXBounce(flip_x);
    this.handleYBounce(flip_y);
  };

  Ball.prototype.handleXBounce = function(flip_x) {
    if (!flip_x) {
      this._transitionX = false;
      return;
    }

    if (this._transitionX) {
      return;
    }

    if (flip_x) {
      this.vel[0] *= -1;
      this._transitionX = true;
    }
  };

  Ball.prototype.handleYBounce = function(flip_y) {
    if (!flip_y) {
      this._transitionY = false;
      return;
    }

    if (this._transitionY) {
      return;
    }

    if (flip_y) {
      this.vel[1] *= -1;
      this._transitionY = true;
    }
  };

  Ball.prototype.isTransitioning = function() {
    return this._transitionX || this._transitionY;
  };

  Ball.prototype.handleCornerBounce = function(xScale, yScale) {
    this.vel[0] = Math.abs(this.vel[0]) * xScale;
    this.vel[1] = Math.abs(this.vel[1]) * yScale;
  };

}() );

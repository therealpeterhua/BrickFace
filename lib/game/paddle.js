( function() {
  window.Bricks = window.Bricks || {};

  var Paddle = window.Bricks.Paddle = function(options) {
    this.pos = options.pos;
    this.vel = options.vel; //initializes to 0
    this.width = Paddle.WIDTH;
    this.height = Paddle.HEIGHT;
    this.color = options.color || "white";
    this.dimX = options.dimX;
    this.listenToKeyPresses = true;
    // this.game = options.game;       //it must know the game it's on, if the game will have wrapping function. will i need this?
  };

  Paddle.WIDTH = 100;
  Paddle.HEIGHT = 10;
  Paddle.OFF_SCREEN = 30;
  Paddle.MAX_SPEED = 5;
  Paddle.MAX_DEGREES = 20;
  Paddle.LAG_FRAMES = 7;

  //draws onto the board
  Paddle.prototype.draw = function(ctx) {
    ctx.fillStyle = this.color;

    ctx.beginPath();
    ctx.moveTo(this.pos[0], this.pos[1]);
    ctx.lineTo(this.pos[0] + this.width, this.pos[1]);
    ctx.lineTo(this.pos[0] + this.width - Paddle.OFF_SCREEN,
               this.pos[1] + this.height);
    ctx.lineTo(this.pos[0] + Paddle.OFF_SCREEN,
               this.pos[1] + this.height);
    ctx.closePath();

    ctx.fill();
  };

  Paddle.prototype.move = function () {
    this.checkVelocities();
    var newX = this.pos[0] + this.vel[0];
    var newY = this.pos[1] + this.vel[1];
    // this.ensurePaddleStaysOnScreen();
    this.pos = [newX, newY];      //check for bounces here
  };

  Paddle.prototype.checkVelocities = function () {
    if (this.listenToKeyPresses) {
      this.checkKeysPressed();
    } else {
      var midCoord = this.pos[0] + (this.width / 2);
      if (Math.abs(midCoord - this._targetMidCoord) < 1) {
        this.vel[0] = 0;
      }
    }
  };

  Paddle.prototype.floatTo = function(targetMidCoord) {
    var currentMidCoord = this.pos[0] + (this.width / 2);
    this._targetMidCoord = targetMidCoord;


    var newXVel = (this._targetMidCoord - currentMidCoord) / 15;
    this.vel[0] = newXVel;
  };

  Paddle.prototype.setKeyPressListen = function(bool) {
    this.listenToKeyPresses = bool;
  };

  Paddle.prototype.checkKeysPressed = function() {
    if (!this.listenToKeyPresses) {
      return;
    }

    if (key.isPressed('left')) {
      this.powerPaddle(-1);
    } else if (key.isPressed('right')) {
      this.powerPaddle(1);
    } else {
      this.powerPaddle(0);
    }
  };

  Paddle.prototype.powerPaddle = function(scale) {
    this.vel[0] = Paddle.MAX_SPEED * scale;
  };

  Paddle.prototype.ensurePaddleStaysOnScreen = function() {
    //PH******* allow 30px of give;
    if (this.pos[0] < -Paddle.OFF_SCREEN) {
      this.pos[0] = -Paddle.OFF_SCREEN;
    } else if ((this.pos[0] + this.width) > this.dimX + Paddle.OFF_SCREEN) {
      this.pos[0] = this.dimX - this.width + Paddle.OFF_SCREEN;
    }
  };

  Paddle.prototype.checkBallHit = function(ball) {
    if ( this.ballNotOnPaddle(ball) || this.ballBelowPaddle(ball) ) {
      this._transitionOutOfPaddle = false;
      return;
    }

    if (this._transitionOutOfPaddle) {
      return
    } else {
      this._transitionOutOfPaddle = true;
      //should handle this better before or AFTER the ball hits?
      this.handleBallHit(ball);
      ball.vel[1] *= -1;      //once actually handle ballHit, remove this line
    }
  };

  //it's not on or below the ball...
  Paddle.prototype.ballNotOnPaddle = function(ball) {
    if (ball.pos[1] + ball.radius < this.pos[1]) {

      return true;        //ball hasn't reached paddle's Y coordinate ( ie. it's above the paddle)
      //remember the position is the TOP LEFT of the rectangle
    } else {
      return (ball.pos[0] + ball.radius < this.pos[0]) ||
             (ball.pos[0] - ball.radius > this.pos[0] + this.width);
    }
  };

  Paddle.prototype.ballBelowPaddle = function(ball) {
    return ball.pos[1] >= this.pos[1] + this.height / 2;
    //need a greater than/equal to - else could skate ALONG the paddle.terrible
    //what if you make a thicker paddle?
  };

  Paddle.prototype.handleBallHit = function(ball) {
    var collisionPos = this.findCollisionPos(ball);
    var nudgeScale = this.findNudgeScale(collisionPos);

    var ballSpeed = Math.sqrt( Math.pow(ball.vel[0], 2) +
                               Math.pow(ball.vel[1], 2) );
    var ballDeg = Math.atan2(ball.vel[1], ball.vel[0]) / Math.PI * 180;

    var ballNewDeg = this.findEscapeVector(ballDeg, nudgeScale);
    // console.log(ballNewDeg);
  };

  Paddle.prototype.findCollisionPos = function(ball) {
    var collisionPos = ball.pos[0];
    // if ball hits the paddle on left or right side (ie. center of ball not over paddle), handles as if center has hit the edge
    //PH**** - need to see if we need to take velocity into account. will be weird if paddle moves into ball, and then you hit the ball on the edge...
    if (collisionPos > this.pos[0] + this.width) {
      collisionPos = this.pos[0] + this.width;
    } else if (collisionPos < this.pos[0]) {
      collisionPos = this.pos[0];
    }

    return collisionPos;
  };

  Paddle.prototype.findNudgeScale = function(collisionPos) {
    // scales the collisionPos vs. width of the paddle, -1 to 1, inclusive
    var paddleCollisionSpot = collisionPos - this.pos[0];

    var halfWidth = this.width / 2;
    var scale = ((paddleCollisionSpot - halfWidth) / halfWidth);
    return scale;
  };

  Paddle.prototype.findEscapeVector = function(ballDeg, nudgeScale) {
    var maxDeg = ballDeg < 0 ? 180 - Paddle.MAX_DEGREES : Paddle.MAX_DEGREES;
    var degsToMax = Math.abs(maxDeg - ballDeg);
    var scaledDiff = degsToMax * Math.abs(nudgeScale);
    // console.log('===========');
    // console.log(maxDeg);
    // console.log(degsToMax);

    if (nudgeScale < 0) {
      return ballDeg + scaledDiff;
    } else {
      return ballDeg - scaledDiff;
    }
  };

}() );

( function() {
  window.Bricks = window.Bricks || {};

  var Paddle = window.Bricks.Paddle = function(options) {
    this.pos = Paddle.INITIAL_POS;
    this.vel = options.vel; //initializes to 0
    this.game = options.game;
    this.width = Paddle.WIDTH;
    this.height = Paddle.HEIGHT;
    this.color = options.color || "white";
    this.dimX = options.dimX;
    this.listenToKeyPresses = true;
    this.demoState = true;
  };

  Paddle.INITIAL_POS = [150, 525];
  Paddle.WIDTH = 100;
  Paddle.HEIGHT = 10;
  Paddle.INDENT = 30;
  Paddle.MAX_SPEED = 5;
  Paddle.MAX_DEGREES = [20, 160];
  Paddle.PADDING_FACTOR = 1.6;    //higher #: less paddle effect on trajectory
  Paddle.LAG_FRAMES = 7;

  Paddle.prototype.draw = function(ctx) {
    ctx.fillStyle = this.color;

    ctx.beginPath();
    ctx.moveTo(this.pos[0], this.pos[1]);
    ctx.lineTo(this.pos[0] + this.width, this.pos[1]);
    ctx.lineTo(this.pos[0] + this.width - Paddle.INDENT,
               this.pos[1] + this.height);
    ctx.lineTo(this.pos[0] + Paddle.INDENT,
               this.pos[1] + this.height);
    ctx.closePath();

    ctx.fill();
  };

  Paddle.prototype.move = function () {
    this.checkVelocities();
    this.ensurePaddleStaysOnScreen();
    var newX = this.pos[0] + this.vel[0];
    var newY = this.pos[1] + this.vel[1];
    this.pos = [newX, newY];
    this.checkDemoStateForBall();
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

    //PH** - change here to mirror
    if (key.isPressed('left')) {
      this.powerPaddle(1);
    } else if (key.isPressed('right')) {
      this.powerPaddle(-1);
    } else {
      this.powerPaddle(0);
    }
  };

  Paddle.prototype.powerPaddle = function(scale) {
    this.vel[0] = Paddle.MAX_SPEED * scale;
  };

  Paddle.prototype.checkDemoStateForBall = function() {
    var midPoint = this.pos[0] + this.width / 2;
    if (this.demoState) {
      this.game.matchBallToPaddle(midPoint);
    }
  };

  Paddle.prototype.ensurePaddleStaysOnScreen = function() {
    var midPoint = this.pos[0] + this.width / 2;

    if (midPoint < 0) {
      this.pos[0] = -this.width / 2;
    } else if (midPoint > this.dimX) {
      this.pos[0] = this.dimX - this.width / 2;
    }
  };

  Paddle.prototype.checkBallHit = function(ball) {
    if ( this.demoState || this.ballNotOnPaddle(ball) ) {
      this._transitionOutOfPaddle = false;
      return;
    }

    if (this._transitionOutOfPaddle) {
      return
    } else {
      this._transitionOutOfPaddle = true;
      ball.vel[1] *= -1;
      if (ball.isTransitioning()) {
        return;
      }

      this.handleBallHit(ball);
    }
  };

  Paddle.prototype.ballNotOnPaddle = function(ball) {
    var aboveOrBelow = (ball.pos[1] + ball.radius < this.pos[1]) ||
                       (ball.pos[1] >= this.pos[1] + this.height / 2)
                       //PH** - do we still need this height check?

    if (aboveOrBelow) {
      return true;
    } else {
      return (ball.pos[0] + ball.radius < this.pos[0]) ||
             (ball.pos[0] - ball.radius > this.pos[0] + this.width);
    }
  };

  Paddle.prototype.handleBallHit = function(ball) {
    var collisionPos = this.findCollisionPos(ball);
    var nudgeScale = this.findNudgeScale(collisionPos);

    var ballSpeed = Math.sqrt( Math.pow(ball.vel[0], 2) +
                               Math.pow(ball.vel[1], 2) );
    var ballDeg = Math.atan2(ball.vel[1], ball.vel[0]) / Math.PI * 180;

    var escapeDeg = this.findEscapeDeg(ballDeg, nudgeScale);
    var escapeVel = this.calcEscapeVel(escapeDeg, ballSpeed);
    ball.vel = escapeVel;
  };

  Paddle.prototype.findCollisionPos = function(ball) {
    var collisionPos = ball.pos[0];
    if (collisionPos > this.pos[0] + this.width) {
      collisionPos = this.pos[0] + this.width;
    } else if (collisionPos < this.pos[0]) {
      collisionPos = this.pos[0];
    }

    return collisionPos;
  };

  Paddle.prototype.findNudgeScale = function(collisionPos) {
    var paddleCollisionSpot = collisionPos - this.pos[0];

    var halfWidth = this.width / 2;
    var scale = ((paddleCollisionSpot - halfWidth) / halfWidth);
    return scale;
  };

  Paddle.prototype.findEscapeDeg = function(currDeg, nudgeScale) {
    var nudgeTarget = (nudgeScale < 0 ? Paddle.MAX_DEGREES[1] :
                                        Paddle.MAX_DEGREES[0]);
    var diff = Math.abs(currDeg + nudgeTarget) / Paddle.PADDING_FACTOR;
    return currDeg + diff * nudgeScale;
  };

  Paddle.prototype.calcEscapeVel = function(deg, speed) {
    var radians = deg / 180 * Math.PI;
    var sinResult = Math.sin(radians);
    var tanResult = Math.tan(radians);
    var dy = sinResult * speed;
    var dx = dy / tanResult;
    return [dx, dy];
  };

}() );

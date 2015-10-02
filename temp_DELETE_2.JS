( function() {
  window.Bricks = window.Bricks || {};

  var Ball = window.Bricks.Ball = function(options) {
    this.pos = options.pos;
    this.vel = options.vel; //initializes to 0
    this.radius = options.radius;
    this.color = options.color || "white";
    this.dimX = options.dimX;
    this.dimY = options.dimY;
    // this.game = options.game;       //it must know the game it's on, if the game will have wrapping function. will i need this?
  };

  //draws onto the board
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
    this.pos = [newX, newY];      //check for bounces here
  };

  Ball.prototype.checkWallHit = function() {
    var flip_y = false;
    var flip_x = false;

    if ( (this.pos[0] - this.radius <= 0) ||
         (this.pos[0] + this.radius >= this.dimX) ) {
      flip_x = true;
    }
    if ( (this.pos[1] - this.radius <= 0) ||
         (this.pos[1] + this.radius >= this.dimY) ) {
      flip_y = true;
    }

    this.handleXBounce(flip_x);
    this.handleYBounce(flip_y);
    this.handleWallBounce({ flip_x: flip_x, flip_y: flip_y })
    // else {
    //   this._transitioningOutOfWall = false;
    // }
    //PH**** - you'll have to render fast enough that this doesn't actually run INTO the wall!
  };

  Ball.prototype.handleXBounce = function(flip_x) {
    if (!flip_x) {
      this._transitionX = false;
    }

    if (this._transitionX) {
      return;
    }

    if (flip_x) {
      this.vel[0] *= -1;
      this._transitionX = true;
    }
  }

  //idx below is 0 or 1 -- representing either x or y coordinate to be flipped
  Ball.prototype.handleWallBounce = function(options) {


    if (!options.flip_x && !options.flip_y) {     //need this here, else won't get run
      this._transitioningOutOfWall = false;
      return;
    }

    if (this._transitioningOutOfWall) {
      return;
    }

    console.log('Handling DA BOUNCE')

    if (options.flip_x) {       //hit left or right edges
      this._transitioningX = true;
      this.vel[0] *= -1;
    }

    if (options.flip_y) {
      this._transitioningY = true;
      this.vel[1] *= -1;
    }

    if Object.keys(options).length

    this._transitioningOutOfWall = true;
  };
/*
  Ball.prototype.isCollidedWith = function(otherObject) {
    //rect-circle collision handling here

    var wallHitStatus = this.checkWallHit();
    if (this.wallHitStatus) {
      this.handleCollision(this.wallHitStatus);
    }
  };

  Ball.prototype.handleCollision = function(pos, otherObject) {

    if (typeof otherObject === "Brick") {
      //remove brick
    } else if (typeof otherObject === "Paddle") {
      //prolly don't need anything here
    }
    //bounces in other direction of object it hit
    this.bounce(pos);
  };

  Ball.prototype.bounce = function(pos) {
    //takes point of impact
    //REMEMBER: constant velocity, scale the vectors
    switch(direction) {
      case "up or down":
        this.vel[1] *= -1       // flip y vector if hits on very top or bottom
        //PH**** - this doesn't work. you don't always want it to flip. imagine going down and you get hit by something from behind --- you'll go up again!
        break;
      case "left or right":
        this.vel[0] *= -1       // flip x vector if hits on left or right
    }
  }
*/

}() );

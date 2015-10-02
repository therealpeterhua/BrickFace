( function() {
  window.Bricks = window.Bricks || {};

  var Brick = window.Bricks.Brick = function(options) {
    this.pos = options.pos;
    this.vel = options.vel || [0, 0]; //initializes to 0
    this.width = options.width;
    this.height = options.height;
    this.color = options.color || "white";

    //PH - you should have broken bricks that display
    this.health = 2;
  };

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

  Brick.prototype.checkBallCollision = function(ball) {
    //this is the new thing we're checking for
    //at time of collision, where is the ball's centralposition relative to the brick? If it's below, flip velocity appropriately. If it's both below AND to the right, deal with appropriately (flip twice)
    //You can specify at what point to count as collision...
  };

  Brick.prototype.isCollidedWith = function(ball) {
    //rect-circle collision handling here
    //at time of collision, is
  };

  Brick.prototype.handleCollision = function(otherObject) {
    //presumably, can only be a ball. Or another brick? Maybe later...
    //bounces in other direction of object it hit
  };

  //ducktype the hell outta this thing, use draw, move, etc.

}() );

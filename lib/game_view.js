( function() {
  window.Bricks = window.Bricks || {};

  var GameView = Bricks.GameView = function(ctx) {
    this.game = new Bricks.Game({ctx: ctx});
    this.ctx = ctx;
  }

  GameView.prototype.start = function() {
    this.bindKeyHandlers();         //again, may have to move the left-right-listeners

    setInterval(this.stepThruGame.bind(this), 0);
  };

  GameView.prototype.stepThruGame = function() {
    this.game.step();
    this.game.draw(this.ctx);         //ctx is passed thru from the top-level here. Only need the ctx for draw functions
  }

  GameView.prototype.bindKeyHandlers = function() {
    var gameView = this;

    key('space', function() {debugger;});

    ['left', 'right'].forEach( function(pressed) {
      key(pressed, function() {
        //I may need to move the left-right to be isPressed
        gameView.game.paddle.power(pressed);
      })
    });

  }
}() );

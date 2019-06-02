const Game = function() {
  this.world = new Game.World();
  this.update = function() {
    this.world.update();
  };
};

Game.prototype = {constructor: Game};

Game.World = function(friction = 0.93, gravity = 1.5) {
  this.friction = friction;
  this.gravity = gravity;

  this.player = new Game.World.Player();

  this.columns = 16;
  this.rows = 9;
  this.tile_size = 16;
  this.map = [21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 55, 56, 56, 57, 21, 21, 21, 21, 21, 55, 8, 8, 57, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 28, 26, 21, 21, 21, 107, 108, 21, 109, 110, 21, 21, 21, 21, 21, 21, 28, 26, 21, 21, 122, 123, 124, 21, 125, 126, 21, 21, 1, 2, 2, 2, 39, 41, 2, 2, 2, 2, 2, 2, 2, 2, 2, 3, 17, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 19, 33, 34, 34, 34, 34, 34, 34, 34, 34, 34, 34, 34, 34, 34, 34, 35];
  this.height = this.tile_size * this.rows;
  this.width = this.tile_size * this.columns;
};

Game.World.prototype = {
  constructor: Game.World,

  collideObject: function(object) {

    if (object.x < 0) { object.x = 0; object.velocity_x = 0; }
    else if (object.x + object.width > this.width) { object.x = this.width - object.width; object.velocity_x = 0; }
    if (object.y < 0) { object.y = 0; object.velocity_y = 0; }
    else if (object.y + object.height > this.height) { object.jumping = false; object.y = this.height - object.height; object.velocity_y = 0; }

  },

  update: function() {

    this.player.velocity_y += this.gravity;
    this.player.update();

    this.player.velocity_x *= this.friction;
    this.player.velocity_y *= this.friction;

    this.collideObject(this.player);
  }
};

Game.World.Player = function(x, y) {
  this.color = "#ff0000";
  this.height = 16;
  this.jumping = true;
  this.ducking = false;
  this.velocity_x = 0;
  this.velocity_y = 0;
  this.width = 16;
  this.x = 0;
  this.y = 0;
};

Game.World.Player.prototype = {
  constructor: Game.Player,

  jump: function() {
    if(!this.jumping) {

      this.jumping = true;
      this.velocity_y -= 15;
    }
  },

  moveLeft: function() {
    let velocity = 0.25;
    if(this.ducking) {
      velocity = 0.12;
    }
    this.velocity_x -= velocity;
  },

  moveRight: function() {
    let velocity = 0.25;
    if(this.ducking) {
      velocity = 0.12;
    }
    this.velocity_x += velocity;
  },

  duck: function(keyUp = false) {
    if(!keyUp && !this.jumping) {
      this.ducking = true;
      this.width = 16;
      this.height = 10;
      this.velocity_y += 5;
    } else if(keyUp){
      this.ducking = false;
      this.width = 16;
      this.height = 16;
      this.volicity_y -= 5;
    }
  },

  update: function() {
    this.x += this.velocity_x;
    this.y += this.velocity_y;
  }
};

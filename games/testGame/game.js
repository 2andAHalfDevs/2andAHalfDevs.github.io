const Game = function() {
  this.world = new Game.World();
  this.update = function() {
    this.world.update();
  };
};

Game.prototype = {constructor: Game};

Game.World = function(friction = 0.92, gravity = 1.5) {
  this.collider = new Game.World.Collider();
  this.friction = friction;
  this.gravity = gravity;

  this.tile_set = new Game.World.TileSet(25, 25);
  this.player = new Game.World.Object.Player(100, 16);

  this.columns = 25;
  this.rows = 17;

  this.tile_size = 25;
  this.map = [];
  for(let i = 0; i < this.columns*this.rows; i++) {
    this.map.push(i+1);
  }

  let rawCollision = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 14, 6, 8, 1, 1, 1, 1, 10, 2, 2, 4, 1, 1, 1, 1, 1, 1, 1, 1, 10, 2, 2, 4, 2, 1, 1, 1, 1, 1, 1, 1, 1, 9, 1, 1, 3, 1, 1, 1, 1, 1, 1, 1, 1, 13, 5, 5, 7, 2, 1, 1, 1, 1, 1, 1, 1, 1, 9, 1, 1, 1, 2, 2, 4, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 14, 6, 1, 1, 9, 1, 1, 1, 1, 1, 3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 9, 1, 1, 1, 5, 5, 7, 1, 1, 1, 1, 1, 1, 1, 1, 1, 14, 8, 2, 14, 8, 1, 1, 1, 1, 9, 1, 1, 3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 9, 1, 1, 3, 1, 1, 1, 1, 18, 2, 2, 17, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 2, 2, 1, 1, 1, 1, 4, 1, 1, 18, 1, 1, 1, 1, 17, 1, 1, 10, 2, 2, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 2, 2, 1, 1, 1, 1, 1, 3, 1, 1, 13, 5, 5, 5, 5, 5, 5, 5, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
  this.collision_map = [];

  for(let kms = 0; kms < rawCollision.length; kms++) {
    if(rawCollision !== undefined) {
      let current = rawCollision[kms];
      this.collision_map.push(current - 1);
    } else {
      this.collision_map.push(0);
    }
  }


  this.height = this.tile_set.tile_size * this.rows;
  this.width = this.tile_set.tile_size * this.columns;
};

Game.World.prototype = {
  constructor: Game.World,

  collideObject: function(object) {

    if(object.getLeft() < 0 ) { object.setLeft(0); object.velocity_x = 0; }
    else if(object.getRight() > this.width ) { object.setRight(this.width); object.velocity_x = 0; }
    if(object.getTop() < 0 ) { object.setTop(0); object.velocity_y = 0; }
    else if(object.getBottom() > this.height) { object.setBottom(this.height); object.velocity_y = 0; object.jumping = 0; }

    var bottom, left, right, top, value;

    top = Math.floor(object.getTop() / this.tile_size);
    left = Math.floor(object.getLeft() / this.tile_size);
    value  = this.collision_map[top * this.columns + left];
    this.collider.collide(value, object, left * this.tile_size, top * this.tile_size, this.tile_size);

    top = Math.floor(object.getTop() / this.tile_size);
    right = Math.floor(object.getRight() / this.tile_size);
    value  = this.collision_map[top * this.columns + right];
    this.collider.collide(value, object, right * this.tile_size, top * this.tile_size, this.tile_size);

    bottom = Math.floor(object.getBottom() / this.tile_size);
    right = Math.floor(object.getRight() / this.tile_size);
    value  = this.collision_map[bottom * this.columns + right];
    this.collider.collide(value, object, right * this.tile_size, bottom * this.tile_size, this.tile_size);

    bottom = Math.floor(object.getBottom() / this.tile_size);
    left = Math.floor(object.getLeft() / this.tile_size);
    value  = this.collision_map[bottom * this.columns + left];
    this.collider.collide(value, object, left * this.tile_size, bottom * this.tile_size, this.tile_size);
  },

  update: function() {

    this.player.updatePosition(this.gravity, this.friction);

    this.collideObject(this.player);

    this.player.updateAnimation();
  }
};

Game.World.Collider = function() {
  this.collide = function(value, object, tile_x, tile_y, tile_size) {
    switch(value) {
      case  1: this.collidePlatformTop      (object, tile_y            ); break;
      case  2: this.collidePlatformRight    (object, tile_x + tile_size); break;
      case  3: if (this.collidePlatformTop  (object, tile_y            )) return;
               this.collidePlatformRight    (object, tile_x + tile_size); break;
      case  4: this.collidePlatformBottom   (object, tile_y + tile_size); break;
      case  5: if (this.collidePlatformTop  (object, tile_y            )) return;
               this.collidePlatformBottom   (object, tile_y + tile_size); break;
      case  6: if (this.collidePlatformRight(object, tile_x + tile_size)) return;
               this.collidePlatformBottom   (object, tile_y + tile_size); break;
      case  7: if (this.collidePlatformTop  (object, tile_y            )) return;
               if (this.collidePlatformRight(object, tile_x + tile_size)) return;
               this.collidePlatformBottom   (object, tile_y + tile_size); break;
      case  8: this.collidePlatformLeft     (object, tile_x            ); break;
      case  9: if (this.collidePlatformTop  (object, tile_y            )) return;
               this.collidePlatformLeft     (object, tile_x            ); break;
      case 10: if (this.collidePlatformLeft (object, tile_x            )) return;
               this.collidePlatformRight    (object, tile_x + tile_size); break;
      case 11: if (this.collidePlatformTop  (object, tile_y            )) return;
               if (this.collidePlatformLeft (object, tile_x            )) return;
               this.collidePlatformRight    (object, tile_x + tile_size); break;
      case 12: if (this.collidePlatformLeft (object, tile_x            )) return;
               this.collidePlatformBottom   (object, tile_y + tile_size); break;
      case 13: if (this.collidePlatformTop  (object, tile_y            )) return;
               if (this.collidePlatformLeft (object, tile_x            )) return;
               this.collidePlatformBottom   (object, tile_y + tile_size); break;
      case 14: if (this.collidePlatformLeft (object, tile_x + tile_size)) return;
               if (this.collidePlatformRight(object, tile_x            )) return;
               this.collidePlatformBottom   (object, tile_y + tile_size); break;
      case 15: if (this.collidePlatformTop  (object, tile_y            )) return;
               if (this.collidePlatformLeft (object, tile_x            )) return;
               if (this.collidePlatformRight(object, tile_x + tile_size)) return;
               this.collidePlatformBottom   (object, tile_y + tile_size); break;

      case 16:this.collideLeftSlanted (object, tile_x, tile_y, tile_size);break;
      case 17:this.collideRightSlanted(object, tile_x, tile_y, tile_size);break;

    }
  }
};

Game.World.Collider.prototype = {
  constructor: Game.World.Collider,
  collidePlatformBottom:function(object, tile_bottom) {
    if (object.getTop() < tile_bottom && object.getOldTop() >= tile_bottom) {
      object.setTop(tile_bottom);
      object.velocity_y = 0;
      return true;
    } return false;

  },

  collidePlatformLeft:function(object, tile_left) {
    if (object.getRight() > tile_left && object.getOldRight() <= tile_left) {
      object.setRight(tile_left - 0.01);
      object.velocity_x = 0;
      return true;
    } return false;
  },

  collidePlatformRight:function(object, tile_right) {
    if (object.getLeft() < tile_right && object.getOldLeft() >= tile_right) {
      object.setLeft(tile_right);
      object.velocity_x = 0;
      return true;
    } return false;
  },

  collidePlatformTop:function(object, tile_top) {
    if (object.getBottom() > tile_top && object.getOldBottom() <= tile_top) {
      object.setBottom(tile_top - 0.01);
      object.velocity_y = 0;
      object.jumping    = 0;
      return true;
    } return false;
  },

  collideLeftSlanted: function(object, tile_x, tile_y, tile_size) {
    let current_x = object.x - tile_x;
    let top = 1 * current_x + tile_y;
    if(current_x < 0) {
      object.jumping = 0;
      object.velocity_y = 0;
      object.setBottom(tile_y);
    } else if(object.y + object.height> top && object.getOldBottom() < tile_y + tile_size+2) {
      object.jumping = 0;
      object.velocity_y = 0;
      object.y = top-object.height;
    }
  },

  collideRightSlanted: function(object, tile_x, tile_y, tile_size) {
    let current_x = object.x + object.width - tile_x;
    let top = -1 * current_x + tile_size + tile_y;
    if(current_x > tile_size) {
      object.jumping = 0;
      object.velocity_y = 0;
      object.setBottom(tile_y);
    } else if(object.y + object.height> top && object.getOldBottom() < tile_y + tile_size+2) {
      object.jumping = 0;
      object.velocity_y = 0;
      object.y = top-object.height;
    }
  }
};

Game.World.Object = function(x, y, width, height) {
  this.height = height;
  this.width = width;
  this.x = x;
  this.y = y;
  this.x_old = x;
  this.y_old = y;
};

Game.World.Object.prototype = {
  constructor:Game.World.Object,
  getBottom:   function()  { return this.y     + this.height; },
  getLeft:     function()  { return this.x;                   },
  getRight:    function()  { return this.x     + this.width;  },
  getTop:      function()  { return this.y;                   },
  getOldBottom:function()  { return this.y_old + this.height; },
  getOldLeft:  function()  { return this.x_old;               },
  getOldRight: function()  { return this.x_old + this.width;  },
  getOldTop:   function()  { return this.y_old                },
  setBottom:   function(y) { this.y     = y    - this.height; },
  setLeft:     function(x) { this.x     = x;                  },
  setRight:    function(x) { this.x     = x    - this.width;  },
  setTop:      function(y) { this.y     = y;                  },
  setOldBottom:function(y) { this.y_old = y    - this.height; },
  setOldLeft:  function(x) { this.x_old = x;                  },
  setOldRight: function(x) { this.x_old = x    - this.width;  },
  setOldTop:   function(y) { this.y_old = y;                  }
};

Game.World.Object.Animator = function(frame_set, delay) {
  this.count       = 0;
  this.delay       = (delay >= 1) ? delay : 1;
  this.frame_set   = frame_set;
  this.frame_index = 0;
  this.frame_value = frame_set[0];
  this.mode        = "pause";
};

Game.World.Object.Animator.prototype = {
  constructor: Game.World.Object.Animator,

  animate:function() {
    switch(this.mode) {
      case "loop" : this.loop(); break;
      case "pause":              break;
    }
  },

  changeFrameSet(frame_set, mode, delay = 10, frame_index = 0) {

    if (this.frame_set === frame_set) { return; }
    this.count       = 0;
    this.delay       = delay;
    this.frame_set   = frame_set;
    this.frame_index = frame_index;
    this.frame_value = frame_set[frame_index];
    this.mode        = mode;
  },

  loop:function() {
    this.count ++;

    while(this.count > this.delay) {
      this.count -= this.delay;
      this.frame_index = (this.frame_index < this.frame_set.length - 1) ? this.frame_index + 1 : 0;
      this.frame_value = this.frame_set[this.frame_index];
    }
  }
};

Game.World.Object.Player = function(x, y) {
  Game.World.Object.call(this, 48, 0, 20, 20);
  Game.World.Object.Animator.call(this, Game.World.Object.Player.prototype.frame_sets["stand_right"], 20);
  this.direction_x = 1;
  this.jumping = 1;
  this.ducking = false;
  this.velocity_x = 0;
  this.velocity_y = 0;
};

Game.World.Object.Player.prototype = {
  constructor: Game.World.Object.Player,

  frame_sets: {
    "stand_right": [0],
    "stand_left": [3],
    "move_right": [1, 2],
    "move_left": [4, 5],
    "duck_right": [7],
    "duck_left": [6]
  },

  jump: function() {
    if(this.jumping < 2) {
      this.jumping += 1;
      if(this.jumping === 1) this.velocity_y -= 20;
      if(this.jumping == 2 ) this.velocity_y -= 24;
    }
  },

  moveLeft: function() {
    let velocity = 0.25;
    if(this.ducking) {
      velocity = 0.12;
    }
    this.velocity_x -= velocity;
    this.direction_x = -1;
  },

  moveRight: function() {
    let velocity = 0.25;
    if(this.ducking) {
      velocity = 0.12;
    }
    this.velocity_x += velocity;
    this.direction_x = 1;
  },

  duck: function(keyUp = false) {
    if(!keyUp && !this.jumping) {
      this.ducking = true;
      this.height *= .5;
      this.velocity_y += this.height;
    } else if(keyUp && this.ducking == true) {
      this.ducking = false;
      this.height *= 2;
      this.y -= (this.height * 0.5);
    }
  },

  updateAnimation: function() {
    if(this.direction_x == -1) {
      if(this.ducking) this.changeFrameSet(this.frame_sets["duck_left"], "pause");
      else if(this.velocity_x < -0.3) this.changeFrameSet(this.frame_sets["move_left"], "loop", 10);
      else this.changeFrameSet(this.frame_sets["stand_left"], "pause");
    } else if(this.direction_x == 1) {
      if(this.ducking) this.changeFrameSet(this.frame_sets["duck_right"], "pause");
      else if(this.velocity_x > 0.3) this.changeFrameSet(this.frame_sets["move_right"], "loop", 10);
      else this.changeFrameSet(this.frame_sets["stand_right"], "pause");
    }
    this.animate();
  },

  updatePosition: function(gravity, friction) {
    this.x_old = this.x;
    this.y_old = this.y;
    this.velocity_y += gravity;
    this.x += this.velocity_x;
    this.y += this.velocity_y;
    this.velocity_x *= friction;
    this.velocity_y *= friction;
  }
};

Object.assign(Game.World.Object.Player.prototype, Game.World.Object.prototype);
Object.assign(Game.World.Object.Player.prototype, Game.World.Object.Animator.prototype);
Game.World.Object.Player.prototype.constructor = Game.World.Object.Player;

Game.World.TileSet = function(columns, tile_size) {
  this.columns = columns;
  this.tile_size = tile_size;

  let f = Game.World.TileSet.Frame;

  this.frames = [new f(0, 0, 25, 25, 0, 0),
  new f(0, 0, 25, 25, 0, 0), new f(25, 0, 25, 25, 0, 0),
  new f(50, 0, 25, 25, 0, 0),
  new f(50, 0, 25, 25, 0, 0), new f(75, 0, 25, 25, 0, 0),
  new f(100, 0, 25, 25, 0, -12), new f (125, 0, 25, 25, 0, -12)
  ];
}

Game.World.TileSet.Frame = function(x, y, width, height, offset_x, offset_y) {
  this.x        = x;
  this.y        = y;
  this.width    = width;
  this.height   = height;
  this.offset_x = offset_x;
  this.offset_y = offset_y;
};

Game.World.TileSet.Frame.prototype = { constructor: Game.World.TileSet.Frame };

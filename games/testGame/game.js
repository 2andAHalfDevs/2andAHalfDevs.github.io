const Game = function() {
  this.world = new Game.World();
  this.update = function() {
    this.world.update();
  };
};

Game.prototype = {constructor: Game};

Game.World = function(friction = 0.93, gravity = 1.5) {
  this.collider = new Game.World.Collider();
  this.friction = friction;
  this.gravity = gravity;

  this.player = new Game.World.Player();

  this.columns = 25;
  this.rows = 17;
  this.tile_size = 25;
  this.map = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 95, 96, 97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114, 115, 116, 117, 118, 119, 120, 121, 122, 123, 124, 125, 126, 127, 128, 129, 130, 131, 132, 133, 134, 135, 136, 137, 138, 139, 140, 141, 142, 143, 144, 145, 146, 147, 148, 149, 150, 151, 152, 153, 154, 155, 156, 157, 158, 159, 160, 161, 162, 163, 164, 165, 166, 167, 168, 169, 170, 171, 172, 173, 174, 175, 176, 177, 178, 179, 180, 181, 182, 183, 184, 185, 186, 187, 188, 189, 190, 191, 192, 193, 194, 195, 196, 197, 198, 199, 200, 201, 202, 203, 204, 205, 206, 207, 208, 209, 210, 211, 212, 213, 214, 215, 216, 217, 218, 219, 220, 221, 222, 223, 224, 225, 226, 227, 228, 229, 230, 231, 232, 233, 234, 235, 236, 237, 238, 239, 240, 241, 242, 243, 244, 245, 246, 247, 248, 249, 250, 251, 252, 253, 254, 255, 256, 257, 258, 259, 260, 261, 262, 263, 264, 265, 266, 267, 268, 269, 270, 271, 272, 273, 274, 275, 276, 277, 278, 279, 280, 281, 282, 283, 284, 285, 286, 287, 288, 289, 290, 291, 292, 293, 294, 295, 296, 297, 298, 299, 300, 301, 302, 303, 304, 305, 306, 307, 308, 309, 310, 311, 312, 313, 314, 315, 316, 317, 318, 319, 320, 321, 322, 323, 324, 325, 326, 327, 328, 329, 330, 331, 332, 333, 334, 335, 336, 337, 338, 339, 340, 341, 342, 343, 344, 345, 346, 347, 348, 349, 350, 351, 352, 353, 354, 355, 356, 357, 358, 359, 360, 361, 362, 363, 364, 365, 366, 367, 368, 369, 370, 371, 372, 373, 374, 375, 376, 377, 378, 379, 380, 381, 382, 383, 384, 385, 386, 387, 388, 389, 390, 391, 392, 393, 394, 395, 396, 397, 398, 399, 400, 401, 402, 403, 404, 405, 406, 407, 408, 409, 410, 411, 412, 413, 414, 415, 416, 417, 418, 419, 420, 421, 422, 423, 424, 425];

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


  this.height = this.tile_size * this.rows;
  this.width = this.tile_size * this.columns;
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

    this.player.velocity_y += this.gravity;
    this.player.update();

    this.player.velocity_x *= this.friction;
    this.player.velocity_y *= this.friction;

    this.collideObject(this.player);
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
      case 14: if (this.collidePlatformLeft (object, tile_x            )) return;
               if (this.collidePlatformRight(object, tile_x            )) return;
               this.collidePlatformBottom   (object, tile_y + tile_size); break;
      case 15: if (this.collidePlatformTop  (object, tile_y            )) return;
               if (this.collidePlatformLeft (object, tile_x            )) return;
               if (this.collidePlatformRight(object, tile_x + tile_size)) return;
               this.collidePlatformBottom   (object, tile_y + tile_size); break;
               
      // My own nonstructured/tutorial-induced/pirated code (made from scratch, not guaranteed to work)
    
      case 16: this.collideLeftSlanted (object, tile_x, tile_y, tile_size); break;
      case 17: this.collideRightSlanted(object, tile_x, tile_y, tile_size); break;
    
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



Game.World.Player = function(x, y) {
  Game.World.Object.call(this, 48, 0, 20, 20);
  this.color = "#ff0000";
  this.jumping = 1;
  this.ducking = false;
  this.velocity_x = 0;
  this.velocity_y = 0;
};

Game.World.Player.prototype = {
  constructor: Game.Player,

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
      this.height *= .5;
      this.velocity_y += this.height;
    } else if(keyUp && this.ducking == true) {
      this.ducking = false;
      this.height *= 2;
      this.y -= (this.height * 0.5);
    }
  },

  update: function() {
    this.x_old = this.x;
    this.y_old = this.y;
    this.x += this.velocity_x;
    this.y += this.velocity_y;
  }
};

Object.assign(Game.World.Player.prototype, Game.World.Object.prototype);
Game.World.Player.prototype.constructor = Game.World.Player;

"use strict";

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~Display Class~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//
  function Display() {

    this.dim = [l.map_width * l.tile_size, l.map_height * l.tile_size];

    this.buffer = document.createElement("canvas").getContext("2d");
    this.buffer.canvas.width = this.dim[0];
    this.buffer.canvas.height = this.dim[1];
    this.buffer.imageSmoothingEnabled = false;

    this.canvaswidth=0;
    this.canvasheight=0;

    this.bangalang = () => {
      this.afr = window.requestAnimationFrame(this.bangalang);
      this.curtime = (window.performance.now());
      if(this.curtime - this.oldtime >= 60/1000) {
        this.oldtime = this.curtime;
        g.update();
      }
    };

    this.render = () => {
      let context = document.querySelector("canvas").getContext("2d"); this.context = context;
      this.context = context;
      this.context.canvas.height = this.canvasheight;
      this.context.canvas.width = this.canvaswidth;
      
      this.context.drawImage(this.buffer.canvas, 0, 0, this.buffer.canvas.width, this.buffer.canvas.height, 0, 0, context.canvas.width, context.canvas.height);
    };

    // Don't yell at me, but this is the only code I kinda pirated

    this.resize = function(width, height, height_width_ratio) {
      if (height / width > height_width_ratio) {
        this.canvasheight = width * height_width_ratio;
        this.canvaswidth = width;
      } else {
        this.canvasheight = height;
        this.canvaswidth = height / height_width_ratio;
      }
      var twidth = Math.round(d.canvaswidth / l.map_width*1.75);
      g.oput.setAttribute("style", "width: "+twidth+"px; left: "+((0.5*(document.documentElement.clientWidth))-twidth*0.5)+"px; font-size: "+twidth/2.75+"px;");
    };

  }

  Display.prototype = {
    constructor: Display,
    start: function() {
      this.bg = new Image(); this.bg.src = l.located;

      this.chr = new Image(); this.chr.src = "./djt.png";

      this.bg.addEventListener("load", ()=>{
        var oldtime,afr;
        oldtime = window.performance.now();
        afr = window.requestAnimationFrame(this.bangalang);
        this.resize(document.documentElement.clientWidth - 5, document.documentElement.clientHeight - 5, this.buffer.canvas.height/this.buffer.canvas.width);
        this.oldtime = oldtime;
        this.afr = afr;
      });
    },

    stop: function() {
      window.cancelAnimationFrame(this.afr);
    }
  };
  
  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~Game Class~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//
  
  function Game() {
    
    this.gravity = 0.82;
    this.friction = 0.87;
    
    this.player = new Game.Player();
    this.maxH = d.buffer.canvas.height;
    this.maxW = d.buffer.canvas.width;
    this.oput = document.getElementById("oput");
    
    this.collide = function(object = this.player, tilexy = this.player.tilexy) {
      
      // World Boundaries
      if(object.x < 0) object.x = 0;
      else if(object.x > g.maxW - object.size) object.x = g.maxW - object.size;
      if(object.y <= 0) {object.y = 0; object.vel_y = 0;}
      else if(object.y > g.maxH - object.size) {object.y = g.maxH - object.size; object.vel_y = 0; object.jumping = false;}
      
      this.cmap = l.collisions;
      var tleft = tilexy[0] * l.tile_size, tright = (tilexy[0] * l.tile_size) + l.tile_size, ttop = tilexy[1] * l.tile_size, tbtm = (tilexy[1] * l.tile_size) + l.tile_size;
      
  var pleft = object.x,
      pright = object.x + object.size,
      ptop = object.y,
      pbtm = object.y + object.size;
  
      var cmap = this.cmap, value = this.cmap[tilexy[1] * l.map_width + tilexy[0]] - 1;
      switch(value) {
        case 1: collideTop(); break;
      }
      
      function collideTop() {
        if(pbtm > ttop && object.old_y + object.size <= ttop) {
          object.y = ttop - object.size;
          object.vel_y = 0;
          object.jumping = false;
        }
      }
    };
  }

  Game.prototype = {
    constructor: Game,
    start: function() {
      d.start();
    },

    update: function() {
      d.buffer.drawImage(d.bg, 0, 0, d.dim[0], d.dim[1], 0, 0, d.dim[0], d.dim[1]);
      
      this.player.move();
      
      this.collide();
      
      animate(this.player, this.player.delay);
      this.oput.innerHTML = this.player.tilexy.join(" ");
      
      d.render();
    },
  };
  
  
  Game.Player = function() {
    this.move = function() {
      
      this.tilexy = [(Math.floor((this.x+(0.5*this.size))/l.tile_size)), (Math.ceil((this.y+(0.5*this.size))/l.tile_size))];
      
      if(k.left.keydown) this.vel_x -= (this.step * this.hspeed);
      if(k.right.keydown) this.vel_x += (this.step * this.hspeed);
      if(k.up.keydown && !this.jumping) {this.vel_y -= 14; this.jumping = true;}
      if(k.down.keydown && !this.jumping) {this.ducking = true} else {this.ducking = false}
      

      this.old_x = this.x;
      this.old_y = this.y;
      if(this.old_x !== this.x + Math.round(this.vel_x)) this.vel_x *= g.friction;
      this.vel_y += g.gravity;
      this.x += Math.round(this.vel_x * g.friction);
      this.y += Math.round(this.vel_y);

      if(this.x - this.old_x !== 0) this.direction = (this.x - this.old_x) >= 1 ? 1 : -1;

      this.delay = (this.hspeed != 1) ? 10+(10*this.hspeed) : 10;
      
    };
  };

  Game.Characters = function() {

  };

  Game.Characters.prototype = {
    constructor: Game.Player,
    x: 0, y: 0, old_x: 0, old_y: 0, vel_x: 0, vel_y: 2, tile: [0, 0],
    direction: 1,
    size: 24,
    hspeed: 1,
    jumping: false,
    can_jump: true,
    step: 1,
    frames: {},
    pframe: 0, cframe: 0, fcount: 0,
    fset: null, mframe: null,
  };

  Game.Player.prototype = Game.Characters.prototype;

  Game.Player.prototype.frames = {
    src: "./djt.png",
    size: [25, 25],
    stand_right: [0],
    stand_left: [3],
    move_right: [0, 1],
    move_left: [3, 2],
    duck_right: [5],
    duck_left: [4],
  };

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~Input Manager~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//
  
  function Ctrl() {
    this.up = new Ctrl.InputSwitch();
    this.down = new Ctrl.InputSwitch();
    this.left = new Ctrl.InputSwitch();
    this.right = new Ctrl.InputSwitch();

    this.refresh = function(keycode, type, analog = 1) {
      if(type == "keydown") g.player.hspeed = Math.abs(analog);

      switch(keycode) {
        case 37:
        case 65:
          this.left.inout(type);
          break;
        case 38:
        case 87:
        case 32:
          this.up.inout(type);
          break;
        case 39:
        case 68:
          this.right.inout(type);
          break;
        case 40:
        case 83:
          this.down.inout(type);
      }
    };
  }

  Ctrl.InputSwitch = function() {
    this.keydown = false;
    this.keyup = true;
  };

  Ctrl.InputSwitch.prototype = {
    constructor: Ctrl.InputSwitch,
    inout: function(type) {
      if(type == "keydown") {
        this.keydown = true;
        this.keyup = false;
      } else {
        this.keydown = false;
        this.keyup = true;
      }
    }
  };

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~Gamepad Stuff~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//
  
  var gayfr = "set me";
  var foundControllers = "ongamepadconnect" in window;
  var controllers = [];
  var btimes;
  var vals = []; var axes = [];
    // var vals = "0 ".repeat(18).split(" "); vals.pop(); var axes = "0 ".repeat(4).split(" "); axes.pop();
  function processInput() {

    var p1 = controllers[0];

      for(let i = 0; i < p1.buttons.length; i++) {
        var val = p1.buttons[i];
        var pressed = val == 1.0;
        if (typeof(val) == "object") val = val.value;
        var pct = Math.round(val * 100);
        vals[i] = pressed ? pressed : val;
      }

    let jumpbutton = vals[0] === 0 ? (vals[12] === 0 ? false : true) : true;
    let duckbutton = vals[1] === 0 ? (vals[13] === 0 ? false : true) : true;

    for (let j = 0; j < p1.axes.length; j++) {
    axes[j] = p1.axes[j].toFixed(2);
  }

    if(jumpbutton) {
      k.refresh(32, 'keydown');
    } else if(axes[1] <= -0.2) {
      k.refresh(32, "keydown", axes[1]);
    } else {
      k.refresh(32, 'keyup');
    }


    if(duckbutton) {
      k.refresh(40, 'keydown');
    } else if(axes[1] >= 0.2) {
      k.refresh(40, "keydown", axes[1]);
    } else {
      k.refresh(40, 'keyup');
    }

    if(vals[14] == 1) {
      k.refresh(37, 'keydown');
    } else if(axes[0] < -0.1) {
      k.refresh(37, 'keydown', axes[0]);
    } else {
      k.refresh(37, 'keyup');
    }

    if(vals[15] == 1) {
      k.refresh(39, 'keydown');
    } else if(axes[0] > 0.1) {
      k.refresh(39, 'keydown', axes[0]);
    } else {
      k.refresh(39, 'keyup');
    }
    requestAnimationFrame(updateStatus);
  }


  var attachGamepad = function(e) {
    var gamepad = e.gamepad;
    controllers[gamepad.index] = gamepad;
    window.removeEventListener("keydown", imtoolazy);
    window.removeEventListener("keyup", imtoolazy);
    console.log("Gamepad connected at " + e.gamepad.index);
    updateStatus();
  };

  function findControllers() {
    let gp = navigator.getGamepads ? navigator.getGamepads() : (navigator.webkitGetGamepads ? navigator.webkitGetGamepads() : []);
    for(let i = 0; i < gp.length; i++) {
      if(gp[i]) {
        if(gp[i].index in controllers) controllers[gp[i].index] = gp[i];
        else attachGamepad(gp[i]);
      }
    }
  }

  function updateStatus() {
    if(!foundControllers) findControllers();
    gayfr = requestAnimationFrame(processInput);
  }

  var removeGamepad = function(e) {
    console.log("Gamepad disconnected");
    delete controllers[e.gamepad.index];
    g.player.hspeed = 1;
    cancelAnimationFrame(gayfr);
    window.addEventListener("keydown", imtoolazy);
    window.addEventListener("keyup", imtoolazy);
  };

  function imtoolazy(e) {
    k.refresh(e.keyCode, e.type);
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~Animator~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//
  
  function animate(object = g.player, delay = 10) {
    var prevFramset = object.pframe,
    curFrame = object.cframe,
    fcount = object.fcount,
    frameset = object.fset,
    myframe = object.mframe,
    frames = object.frames,
    dir = object.direction;
    
    if(dir > 0) {
      
      if(object.ducking) {frameset = frames.duck_right}
      else if(Math.round(object.vel_x) > 0) {frameset = frames.move_right;}
      else {frameset = frames.stand_right;}
      
    } else {
      
      if(object.ducking) {frameset = frames.duck_left}
      else if(Math.round(object.vel_x) < 0) {frameset = frames.move_left;}
      else {frameset = frames.stand_left;}
      
    }
    
    if(prevFramset !== frameset) {prevFramset = frameset; curFrame = 0; myframe = frameset[0]; fcount = 0;}
    else if(fcount > delay) {
      if(curFrame == frameset.length - 1) curFrame = 0;
      else curFrame++;
      fcount = 0;
      myframe = frameset[curFrame];
    }
      
    fcount++;
    object.pframe = prevFramset; object.cframe = curFrame; object.fcount = fcount; object.fset = frameset; object.mframe = myframe;
    d.buffer.drawImage(d.chr, myframe * frames.size[0], 0, frames.size[0], frames.size[1], object.x, object.y, object.size, object.size);
    
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//
  
  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~Activation~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//

  // Yeah yeah, I know, letters aren't good variable names, too bad
  var l,d,g,k;
  window.onload = () => {
    fetch('./levels.json')
      .then((r) => {
        return r.json();
      })
      .then((jsn) => {

        l = (jsn).levels[0];

        d = new Display();
        g = new Game();
        k = new Ctrl();
      }).then(()=>{
        console.log("l is the array of levels and their data, g is the game class/object, d is the display object and k is the input manager.");
        console.log("Quick sidenote, you can't mess around with the live code on the main website through the iframe, go to " + document.location.href);
        g.start();
      });

  window.addEventListener("keydown", imtoolazy);
  window.addEventListener("keyup", imtoolazy);
  window.addEventListener("resize", ()=>{d.resize(document.documentElement.clientWidth - 5, document.documentElement.clientHeight - 5, d.buffer.canvas.height/d.buffer.canvas.width)});
  window.addEventListener("gamepadconnected", attachGamepad);
  window.addEventListener("gamepaddisconnected", removeGamepad);
  };

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~          ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//

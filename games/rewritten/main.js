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
      context.canvas.height = this.canvasheight;
      context.canvas.width = this.canvaswidth;
      this.buffer.drawImage(this.bg, 0, 0, this.dim[0], this.dim[1], 0, 0, this.dim[0], this.dim[1]);
      
      g.player.draw();
      context.drawImage(this.buffer.canvas, 0, 0, this.buffer.canvas.width, this.buffer.canvas.height, 0, 0, context.canvas.width, context.canvas.height);
    };
    
    this.drawMe = function(x, y, size) {
      this.buffer.drawImage(this.chr, 0, 0, 25, 25, x, y, size, size);
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
  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~           ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//
  
  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~Game Class~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//
  function Game() {
    this.player = new Game.Player();
    this.maxH = d.buffer.canvas.height;
    this.maxW = d.buffer.canvas.width;
  }
  
  Game.prototype = {
    constructor: Game,
    start: function() {
      d.start();
    },
    
    update: function() {
      this.player.move();
      this.player.draw();
      d.render();
    }
  };
  Game.Player = function() {
    
    this.draw = function() {
      d.drawMe(this.x, this.y, this.size);
    };
    
    this.move = function() {
      var gravity = this.gravity;
      var friction = this.friction; 
      if(k.left.keydown) this.vel_x -= (this.step * this.hspeed);
      if(k.right.keydown) this.vel_x += (this.step * this.hspeed);
      if(k.up.keydown && !this.jumping) {this.vel_y -= 14; this.jumping = true;}
      
      this.old_x = this.x;
      this.old_y = this.y;
      if(this.old_x !== this.x + Math.round(this.vel_x)) this.vel_x *= friction;
      this.vel_y += gravity;
      this.x += Math.round(this.vel_x * friction);
      this.y += Math.round(this.vel_y);
      
      if(this.x <= 0 - this.size + 5) this.x = g.maxW + 5;
      else if(this.x >= g.maxW + 5) this.x = 0 - 5;
      if(this.y <= 0) {this.y = 0; this.vel_y = 0;}
      else if(this.y >= g.maxH - this.size) {this.y = g.maxH - this.size-1; this.vel_y = 0; this.jumping = false;}
    };
  };
  
  Game.Characters = function() {
    
  };
  
  Game.Characters.prototype = {
    constructor: Game.Player,
    x: 0,
    y: 0,
    old_x: 0,
    old_y: 0,
    vel_x: 0,
    vel_y: 0,
    size: 50,
    hspeed: 1,
    jumping: false,
    can_jump: true,
    step: 1,
    gravity: 0.82,
    friction: 0.87,
    frames: {}
  };
  
  Game.Player.prototype = Game.Characters.prototype;
  
  Game.Player.prototype.frames = {
    src: "./djt.png",
    size: [16, 16],
    stand_right: [0],
    stand_left: [3],
    move_right: [0, 1],
    move_left: [2, 3],
  };
  
  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~          ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//
  
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
  
  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~             ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//
  
  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~Animation Class~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//
  
  function Animate(object = g.player) {
    
  }
  
  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~               ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//
  
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
  
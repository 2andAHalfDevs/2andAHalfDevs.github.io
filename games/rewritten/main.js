"use strict";

window.onload = () => {g.start()};

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~Display Class~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//
  function Display() {
    
    this.buffer = document.createElement("canvas").getContext("2d");
    this.buffer.imageSmoothingEnabled = false;
    this.canvaswidth=0;
    this.canvasheight=0;
    
    this.bangalang = () => {
      this.curtime = (window.performance.now());
      
      if(this.curtime - this.oldtime >= 60/1000) {
        this.oldtime = this.curtime;
        frames++;
        g.update();
        this.afr = window.requestAnimationFrame(this.bangalang);
      }
    };
    
    this.render = () => {
      let context = document.querySelector("canvas").getContext("2d"); this.context = context;
      context.canvas.height = this.canvasheight;
      context.canvas.width = this.canvaswidth;
      this.buffer.fillStyle = "blue";
      this.buffer.fillRect(0, 0, this.buffer.canvas.width, this.buffer.canvas.height);
      g.player.draw();
      context.drawImage(this.buffer.canvas, 0, 0, this.buffer.canvas.width, this.buffer.canvas.height, 0, 0, context.canvas.width, context.canvas.height);
    };
    
    this.drawMe = function(x, y, size) {
      this.buffer.fillStyle = "red";
      this.buffer.fillRect(x, y, size, size);
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
    // this.context.imageSmoothingEnabled = false;
  };
    
  }
  
  Display.prototype = {
    constructor: Display,
    start: function() {
      this.oldtime = (window.performance.now());
      this.afr = window.requestAnimationFrame(this.bangalang);
      this.resize(document.documentElement.clientWidth - 5, document.documentElement.clientHeight - 5, this.buffer.canvas.height/this.buffer.canvas.width);
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
    start: function() {d.start()},
    
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
      let step = 3;
      if(k.left.keydown && !k.left.keyup) this.x -= step;
      if(k.right.keydown && !k.right.keyup) this.x += step;
      if(k.up.keydown && !k.up.keyup) this.y -= step;
      if(k.down.keydown && !k.down.keyup) this.y += step;
      
      if(this.x < 0 - this.size + 5) this.x = g.maxW + 5;
      else if(this.x > g.maxW + 5) this.x = 0 - 5;
      if(this.y < 0) this.y = 0;
      else if(this.y > g.maxH - this.size) this.y = g.maxH - this.size;
    };
  };
  
  Game.Player.prototype = {
    constructor: Game.Player,
    x: 0,
    y: 0,
    size: 20,
    speed: 0,
    vel_y: 0,
    jumping: false,
    can_jump: true,
  };
  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~          ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//
  
  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~Input Manager~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//
  function Ctrl() {
    this.up = new Ctrl.InputSwitch();
    this.down = new Ctrl.InputSwitch();
    this.left = new Ctrl.InputSwitch();
    this.right = new Ctrl.InputSwitch();
    
    this.refresh = function(keycode, type) {
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
  
  // Yeah yeah, I know, letters aren't good variable names, too bad
  
  var d = new Display();
  var g = new Game();
  var k = new Ctrl();
  
  function imtoolazy(e) {
    k.refresh(e.keyCode, e.type);
  }
  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~            ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//
  window.addEventListener("keydown", imtoolazy);
  window.addEventListener("keyup", imtoolazy);
  window.addEventListener("resize", ()=>{d.resize(document.documentElement.clientWidth - 5, document.documentElement.clientHeight - 5, d.buffer.canvas.height/d.buffer.canvas.width)});
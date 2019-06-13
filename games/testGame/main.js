window.onload = function() {

  const AssetsManager = function() {
    this.tile_set_image = undefined;
    this.player_image = undefined;
  };

  AssetsManager.prototype = {
    constructor: Game.AssetsManager,
    loadTileSetImage:function(map_url, player_url, callback) {
      this.tile_set_image = new Image();
      this.tile_set_image.addEventListener("load", function(event) {
        callback();
      }, { once: true });
      this.tile_set_image.src = map_url;
      this.player_image = new Image();
      this.player_image.addEventListener("load", function(event) {
        callback();
      }, { once: true });
      this.player_image.src = player_url;
    }
  };

  var keyEvent = function(event) {
    //event.preventDefault();
    gameController.keyEvent(event.type, event.keyCode);
  };

  var resize = function(event) {
    display.resize(document.documentElement.clientWidth - 5, document.documentElement.clientHeight - 5, game.world.height / game.world.width);
    display.render();
  };

  var render = function() {
    display.drawMap(assets_manager.tile_set_image,
    game.world.tile_set.columns, game.world.map, game.world.columns,  game.world.tile_set.tile_size);

    let frame = game.world.tile_set.frames[game.world.player.frame_value];

    display.drawObject(assets_manager.player_image, frame.x, frame.y,game.world.player.x + Math.floor(game.world.player.width * 0.5 - frame.width * 0.5) + frame.offset_x, game.world.player.y + frame.offset_y, frame.width, frame.height);

    display.render();
  };

  var update = function() {
    if(gameController.left.active) {
      game.world.player.moveLeft();
    }

    if(gameController.right.active) {
      game.world.player.moveRight();
    }

    if(gameController.up.active) {
      game.world.player.jump();
      gameController.up.active = false;
    }

    if(gameController.down.active) {
      game.world.player.duck();
      gameController.down.active = false;
    } else if(gameController.down.keyUp) {
      game.world.player.duck(gameController.down.keyUp);
    }
    game.update();
  };

  var gameController = new Controller();
  var assets_manager = new AssetsManager();
  var display = new Display(document.querySelector("canvas"));
  var game = new Game();
  var engine = new Engine(1000/60, render, update);

  display.buffer.canvas.height = game.world.height;
  display.buffer.canvas.width = game.world.width;
  display.buffer.imageSmoothingEnabled = false;

  assets_manager.loadTileSetImage("./maps/desert3.png", "./sprites/djt.png", function() {
    resize();
    engine.start();
  });

  // Gamepad Stuff
  // @LadinoJoseph on twitter | @Joseph-Ladino on Github

  var haveEvents = 'ongamepadconnected' in window;
  var controllers = {};

  var attachGamepad = function(e) {
    var gamepad = e.gamepad;
    controllers[gamepad.index] = gamepad;
    console.log("Gamepad connected at " + e.gamepad.index);
    requestAnimationFrame(updateStatus);
  };

  var removeGamepad = function(e) {
    alert("Gamepad disconnected");
    delete controllers[gamepad.index];
  };

  function updateStatus() {
  if (!haveEvents) {
    scangamepads();
  }

    var i = 0;
    var controller = controllers[0];
    var vals = [];
    var axes = [];
    for (i = 0; i < controller.buttons.length; i++) {
      var val = controller.buttons[i];
      var pressed = val == 1.0;
      if (typeof(val) == "object") {
        pressed = val.pressed;
        val = val.value;
      }
    var pct = Math.round(val * 100);
    let choose = pct > 0 ? "keydown" : "keyup";
    vals[i] = val;
  }
  let jumping = vals[0] === 0 ? (vals[12] === 0 ? false : true) : true;
  let ducking = vals[1] === 0 ? (vals[13] === 0 ? false : true) : true;

  for (i = 0; i < controller.axes.length; i++) {
    axes[i] = controller.axes[i].toFixed(2);
  }

  if(jumping || axes[1] <= -0.5) {
    gameController.keyEvent('keydown', 32);
  } else if(!jumping || axes[1] >= 0.5) {
    gameController.keyEvent('keyup', 32);
  }

  if(ducking || axes[1] >= 0.5) {
    gameController.keyEvent('keydown', 40);
  } else if(!ducking || axes[1] <= -0.5) {
    gameController.keyEvent('keyup', 40);
  }

  if(vals[14] == 1 || axes[0] < -0.15) {
    gameController.keyEvent('keydown', 37);
  } else {
    gameController.keyEvent('keyup', 37);
  }

  if(vals[15] == 1 || axes[0] > 0.15) {
    gameController.keyEvent('keydown', 39);
  } else {
    gameController.keyEvent('keyup', 39);
  }

  requestAnimationFrame(updateStatus);
}

  function scangamepads() {
  var gamepads = navigator.getGamepads ? navigator.getGamepads() : (navigator.webkitGetGamepads ? navigator.webkitGetGamepads() : []);
  for (var i = 0; i < gamepads.length; i++) {
    if (gamepads[i]) {
      if (gamepads[i].index in controllers) {
        controllers[gamepads[i].index] = gamepads[i];
      } else {
        attachGamepad(gamepads[i]);
      }
    }
  }
}

  window.addEventListener("resize", resize);
  window.addEventListener("keydown", keyEvent);
  window.addEventListener("gamepadconnected", attachGamepad);
  window.addEventListener("gamepaddisconnected", removeGamepad);
  window.addEventListener("keyup", keyEvent);

  // Audio Stuff

  var aPlayer = document.getElementById("audioPlayer");
  aPlayer.src = "./songs/desert_theme.mp3";
  setTimeout(function() { aPlayer.play(); }, 1000);
  function loop() {
    if(aPlayer.currentTime >= aPlayer.duration) {
      aPlayer.pause();
      aPlayer.currentTime = 0;
      aPlayer.play();
    }
  }
  setInterval(loop, 1000);
};

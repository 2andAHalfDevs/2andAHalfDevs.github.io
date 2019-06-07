window.onload = function() {

  var keyEvent = function(event) {
    //event.preventDefault();
    controller.keyEvent(event.type, event.keyCode)
  }

  var resize = function(event) {
    display.resize(document.documentElement.clientWidth - 5, document.documentElement.clientHeight - 5, game.world.height / game.world.width);
    display.render();
  };

  var render = function() {
    display.drawMap(game.world.map, game.world.columns);
    display.drawPlayer(game.world.player, game.world.player.color);
    display.render();
  };

  var update = function() {
    if(controller.left.active) {
      game.world.player.moveLeft();
    }

    if(controller.right.active) {
      game.world.player.moveRight();
    }

    if(controller.up.active) {
      game.world.player.jump();
      controller.up.active = false;
    }

    if(controller.down.active) {
      game.world.player.duck();
      controller.down.active = false
    } else if(controller.down.keyUp) {
      game.world.player.duck(controller.down.keyUp);
    };
    game.update();
  };

  var controller = new Controller();
  var display = new Display(document.querySelector("canvas"));
  var game = new Game();
  var engine = new Engine(1000/60, render, update);

  display.buffer.canvas.height = game.world.height;
  display.buffer.canvas.width = game.world.width;

  window.addEventListener("resize", resize);
  window.addEventListener("keydown", keyEvent);
  window.addEventListener("keyup", keyEvent);

  display.tile_sheet.image.addEventListener("load", function(event) {
    resize();
    engine.start();
  }, {once:true});

  display.tile_sheet.image.src = "./maps/desert3noslants.png";

  // Audio Stuff

  var player = document.getElementById("audioPlayer");
  player.src = "./songs/desert_theme.mp3"
  player.play();
  function loop() {
    if(player.currentTime >= player.duration) {
      player.pause();
      player.currentTime = 0;
      player.play();
    }
  }
  setInterval(loop, 1000);
};

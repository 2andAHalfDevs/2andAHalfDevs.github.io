const Controller = function() {

  this.left = new Controller.ButtonInput();
  this.right = new Controller.ButtonInput();
  this.up = new Controller.ButtonInput();
  this.down = new Controller.ButtonInput();

  this.keyEvent = function(type, keyCode) {
    var pressed = (type == "keydown") ? true : false;
    switch (keyCode) {
      case 37:
      case 65:
        this.left.getInput(pressed);
        break;
      case 38:
      case 87:
      case 32:
        this.up.getInput(pressed);
        break;
      case 39:
      case 68:
        this.right.getInput(pressed);
        break;
      case 40:
      case 83:
        this.down.getInput(pressed);
    }
    var keyUp = (type == "keyup") ? true : false;
    if(keyUp) {
      switch (keyCode) {
        case 37:
        case 65:
          this.left.buttonUp(keyUp);
          break;
        case 38:
        case 87:
        case 32:
          this.up.buttonUp(keyUp);
          break;
        case 39:
        case 68:
          this.right.buttonUp(keyUp);
          break;
        case 40:
        case 83:
          this.down.buttonUp(keyUp);
      }
    }
  };
};

Controller.prototype = {constructor: Controller};

Controller.ButtonInput = function() {
  this.active = this.pressed = false;
  this.keyUp = true;
};

Controller.ButtonInput.prototype = {
  constructor: Controller.ButtonInput,
  getInput: function(pressed) {
    if (this.pressed != pressed) this.active = pressed;
    this.pressed = pressed;
    this.keyUp = false;
  },
  buttonUp: function(up) {
    if(up) {
      //this.active = this.pressed = false;
      this.keyUp = true;
    }
  }
};

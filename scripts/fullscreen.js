// @Two&HalfDevs //

/*
  Previous update: Unknown
  Last Updated: June 2, 2019
*/

var fullscreen = {
  enabled: function() {
    if (document.fullscreenEnabled || document.webkitFullscreenEnabled || document.mozFullScreenEnabled || document.msFullscreenEnabled) {
      return true;
    } else {
      return false;
    }
  },

  request: function(element) {
    this.element = element;
    if (this.element.requestFullscreen) {
      this.element.requestFullscreen();
    } else if (this.element.webkitRequestFullscreen) {
      this.element.webkitRequestFullscreen();
    } else if (this.element.mozRequestFullScreen) {
      this.element.mozRequestFullScreen();
    } else if (this.element.msRequestFullscreen) {
      this.element.msRequestFullscreen();
    }
  },

  exit: function() {
    if (document.exitFullscreen) {
	    document.exitFullscreen();
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    } else if (document.mozCancelFullScreen) {
	    document.mozCancelFullScreen();
    } else if (document.msExitFullscreen) {
	    document.msExitFullscreen();
    }
  },

  active: function() {
    if(document.fullscreenElement ||
    document.webkitFullscreenElement ||
    document.mozFullScreenElement ||
    document.msFullscreenElement) {
      return true;
    } else {
      return false;
    }
  }
    /*
      case "element":

      break;
        */
}

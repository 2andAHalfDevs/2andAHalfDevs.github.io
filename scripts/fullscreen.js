// @Two&HalfDevs //

/*
  Previous update: June 2, 2019
  Last Updated: June 4, 2019
*/
window.inFullscreen = false;
(function() {
  document.addEventListener("fullscreenchange", function() {
    window.inFullscreen = window.inFullscreen ? false : true;
  }, false);
  
  document.addEventListener("webkitfullscreenchange", function() {
    window.inFullscreen = window.inFullscreen ? false : true;
  }, false);
  
  document.addEventListener("mozfullscreenchange", function() {
    window.inFullscreen = window.inFullscreen ? false : true;
  }, false);
  
  document.addEventListener("msfullscreenchange", function() {
    window.inFullscreen = window.inFullscreen ? false : true;
  }, false);
})();
<<<<<<< HEAD

var Fullscreen = function() {
  this.using = "";
=======
*/
var fullscreen = {
  using: "", 
>>>>>>> e2dc4b07c65f5687d68e9af502a7bc1e3a40c8ad

  this.enabled = function() {
    if (document.fullscreenEnabled || document.webkitFullscreenEnabled || document.mozFullScreenEnabled || document.msFullscreenEnabled) {
      return true;
    } else {
      return false;
    }
  };

  this.request = function(element) {
    if(element) {
      this.element = element;
      if(this.addedListener < 1) {
        document.addEventListener("fullscreenchange", function() {
          console.log(this.inFullscreen);
          this.inFullscreen = (document.fullscreenElement) ? false : true;
          console.log(this.inFullscreen);
        },false);
        document.addEventListener("webkitfullscreenchange", function() {
          this.inFullscreen = (document.fullscreenElement) ? false : true;
        },false);
        document.addEventListener("mozfullscreenchange", function() {
          this.inFullscreen = (!document.fullscreenElement) ? false : true;
        },false);
        document.addEventListener("msfullscreenchange", function() {
          this.inFullscreen = (!document.fullscreenElement) ? false : true;
        },false);
        this.addedListener = 1;
      }
      if (this.element.requestFullscreen) {
        this.element.requestFullscreen();
      } else if (this.element.webkitRequestFullscreen) {
        this.element.webkitRequestFullscreen();
        this.using = "webkit";
      } else if (this.element.mozRequestFullScreen) {
        this.element.mozRequestFullScreen();
        this.using = "moz";
      } else if (this.element.msRequestFullscreen) {
        this.element.msRequestFullscreen();
        this.using = "ms";
      }
    } else {
      return "Element not specified.";
    }
  };

  this.exit = function() {
    if(document.exitFullscreen) {
      document.exitFullscreen();
    } else if(document.webkitExitFullScreen) {
      document.webkitExitFullScreen();
    } else if(document.mozCancelFullScreen) {
      document.mozCancelFullScreen();
    } else if(document.msExitFullscreen) {
      document.msExitFullscreen();
    }
  };

};
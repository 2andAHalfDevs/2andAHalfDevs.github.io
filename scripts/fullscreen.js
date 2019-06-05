// @Two&HalfDevs //

/*
  Previous update: June 2, 2019
  Last Updated: June 4, 2019
*/

/* this'll be useful whenever I finish updating this script
(function() {

})();

var fullscreen = {
  using: "", */

  enabled: function() {
    if (document.fullscreenEnabled || document.webkitFullscreenEnabled || document.mozFullScreenEnabled || document.msFullscreenEnabled) {
      return true;
    } else {
      return false;
    }
  },

  request: function(element) {
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
  },

  exit: function() {
    if(document.exitFullscreen) {
      document.exitFullscreen();
    } else if(document.webkitExitFullScreen) {
      document.webkitExitFullScreen();
    } else if(document.mozCancelFullScreen) {
      document.mozCancelFullScreen();
    } else if(document.msExitFullscreen) {
      document.msExitFullscreen();
    }
  },

  active: function() {
    let using = this.using;
    if(using === "") {
      console.log(document.fullscreenElement? false : true);
      return document.fullscreenElement? false : true;
    } else if(using == "webkit") {
      return document.webkitIsFullScreen? false : true;
    } else if(using == "moz") {
      return document.mozFullScreen? false : true;
    } else if(using == "ms") {
      return document.msFullscreenElement? false : true;
    }
  }
};

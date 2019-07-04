const Engine = function(fps, update, render) {
  this.time_passed = 0;
  this.afr = undefined;
  this.current_time = 0;
  this.fps = fps;
  this.updated = false;
  this.update = update;
  this.render = render;

  this.run = function(time_stamp) {
    this.time_passed += time_stamp - this.current_time;
    this.current_time = time_stamp;

    if(this.time_passed >= this.fps * 3) {
      this.time_passed = this.fps;
    }

    while(this.time_passed >= this.fps) {
      this.time_passed -= this.fps;
      this.update(time_stamp);
      this.updated = true;
    }

    if(this.updated) {
      this.updated = false;
      this.render(time_stamp);
    }

    this.afr = window.requestAnimationFrame(this.handleRun);
  };

  this.handleRun = (fps) => { this.run(fps); };
};

Engine.prototype = {
  constructor:Engine,

  start: function() {
    this.time_passed = this.fps;
    this.current_time = window.performance.now();
    this.afr = window.requestAnimationFrame(this.handleRun);
  },

  stop: function() {
    winodw.cancelAnimationFrame(this.afr);
  }
};

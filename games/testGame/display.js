const Display = function(canvas) {
  this.buffer = document.createElement("canvas").getContext("2d");
  this.context = canvas.getContext("2d");

  // this.tile_sheet = new Display.TileSheet(25, 25);
  this.drawMap = function(image, image_columns, map, map_columns, tile_size) {
    for(let i = 0; i < map.length; i++) {
      let val = map[i] - 1;
      let ts_x = (val % image_columns) * tile_size;
      let ts_y = Math.floor(val / image_columns) * tile_size;

      let level_x = (i % map_columns) * tile_size;
      let level_y = Math.floor(i / map_columns) * tile_size;
      
      this.buffer.drawImage(image, ts_x, ts_y, tile_size, tile_size, level_x, level_y, tile_size, tile_size);
    }
  };

  this.drawObject = function(image, source_x, source_y, level_x, level_y, width, height) {
    this.buffer.drawImage(image, source_x, source_y, width, height, Math.round(level_x), Math.round(level_y), width, height);
  };

  this.resize = function(width, height, ratio) {
    if(height / width > ratio) {
      this.context.canvas.height = width * ratio;
      this.context.canvas.width = width;
    } else {
      this.context.canvas.height = height;
      this.context.canvas.width = height / ratio;
    }
    this.context.imageSmoothingEnabled = false;
  };
};

Display.prototype = {
  constructor: Display,
  render: function() {
    this.context.drawImage(this.buffer.canvas, 0, 0, this.buffer.canvas.width, this.buffer.canvas.height, 0, 0, this.context.canvas.width, this.context.canvas.height);
  }
};
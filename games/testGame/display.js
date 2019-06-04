const Display = function(canvas) {
  this.buffer = document.createElement("canvas").getContext("2d");
  this.context = canvas.getContext("2d");

  this.tile_sheet = new Display.TileSheet(16, 16);
  this.drawMap = function(map, columns) {
    for(let index = map.length - 1; index > -1; -- index) {
      let val = map[index] - 1;
      let ts_x = (val % this.tile_sheet.columns) * this.tile_sheet.tile_size;
      let ts_y = Math.floor(val / this.tile_sheet.columns) * this.tile_sheet.tile_size;

      let level_x = (index % columns) * this.tile_sheet.tile_size;
      let level_y = Math.floor(index / columns) * this.tile_sheet.tile_size;

      this.buffer.drawImage(this.tile_sheet.image, ts_x, ts_y, this.tile_sheet.tile_size, this.tile_sheet.tile_size, level_x, level_y, this.tile_sheet.tile_size, this.tile_sheet.tile_size);
    }
  };

  this.drawPlayer = function(rectangle, color) {
    this.buffer.fillStyle = color;
    this.buffer.fillRect(Math.round(rectangle.x), Math.round(rectangle.y), rectangle.width, rectangle.height);
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

Display.TileSheet = function(size, columns) {
  this.image = new Image();
  this.tile_size = size;
  this.columns = columns;
};

Display.TileSheet.prototype = {};

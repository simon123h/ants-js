// discretized grid for efficient object collision detection
export default class ObjectMap {
  constructor(res) {
    this.resolution = res; // resolution of the grid in px
    this.memory = new Array();
  }

  // get array of objects at a position (x, y)
  get(x, y) {
    x = Math.floor(x / this.resolution);
    y = Math.floor(y / this.resolution);
    if (typeof this.memory[x] == "undefined" || typeof this.memory[x][y] == "undefined") {
      return new Array();
    }
    return this.memory[x][y];
  }

  // put an object onto the map
  push(x, y, obj) {
    x = Math.floor(x / this.resolution);
    y = Math.floor(y / this.resolution);
    if (typeof this.memory[x] == "undefined") this.memory[x] = new Array();
    if (typeof this.memory[x][y] == "undefined") this.memory[x][y] = new Array();
    this.memory[x][y].push(obj);
  }

  // put an object that spans an area on the map
  pushArea(x, y, width, height, obj) {
    x -= width / 2 - 3;
    y -= height / 2 - 3;
    let xi = Math.floor(x / this.resolution);
    const xMax = Math.floor((x + width) / this.resolution);
    const yMax = Math.floor((y + height) / this.resolution);
    while (xi < xMax) {
      let yi = Math.floor(y / this.resolution);
      while (yi < yMax) {
        if (typeof this.memory[xi] == "undefined") this.memory[xi] = new Array();
        if (typeof this.memory[xi][yi] == "undefined") this.memory[xi][yi] = new Array();
        this.memory[xi][yi].push(obj);
        yi++;
      }
      xi++;
    }
  }

  // rebuild the map
  rebuild(objects) {
    this.memory = new Array();
    for (const obj of objects) {
      if (obj.constructor.name === "Ant") continue;
      this.pushArea(obj.x, obj.y, obj.width || obj.image.width, obj.height || obj.image.height, obj);
    }
  }

  // draw the object map (for debugging purposes)
  draw(context) {
    for (let i = 0; i < this.memory.length; i++) {
      if (typeof this.memory[i] != "undefined")
        for (let j = 0; j < this.memory[i].length; j++) {
          if (typeof this.memory[i][j] != "undefined") context.fillStyle = "#F00";
          else context.fillStyle = "#FFF";
          context.fillRect(i * this.resolution, j * this.resolution, this.resolution, this.resolution);
        }
    }
  }
}

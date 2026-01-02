// discretized grid for efficient object collision detection
import GameObject from "./gameobject";

export default class ObjectMap {
  resolution: number;
  memory: GameObject[][][];

  constructor(res: number) {
    this.resolution = res; // resolution of the grid in px
    this.memory = [];
  }

  // get array of objects at a position (x, y)
  get(x: number, y: number): GameObject[] {
    const xi = Math.floor(x / this.resolution);
    const yi = Math.floor(y / this.resolution);
    if (typeof this.memory[xi] == "undefined" || typeof this.memory[xi][yi] == "undefined") {
      return [];
    }
    return this.memory[xi][yi];
  }

  // put an object onto the map
  push(x: number, y: number, obj: GameObject): void {
    const xi = Math.floor(x / this.resolution);
    const yi = Math.floor(y / this.resolution);
    if (typeof this.memory[xi] == "undefined") this.memory[xi] = [];
    if (typeof this.memory[xi][yi] == "undefined") this.memory[xi][yi] = [];
    this.memory[xi][yi].push(obj);
  }

  // put an object that spans an area on the map
  pushArea(x: number, y: number, width: number, height: number, obj: GameObject): void {
    x -= width / 2 - 3;
    y -= height / 2 - 3;
    let xi = Math.floor(x / this.resolution);
    const xMax = Math.floor((x + width) / this.resolution);
    const yMax = Math.floor((y + height) / this.resolution);
    while (xi < xMax) {
      let yi = Math.floor(y / this.resolution);
      while (yi < yMax) {
        if (typeof this.memory[xi] == "undefined") this.memory[xi] = [];
        if (typeof this.memory[xi][yi] == "undefined") this.memory[xi][yi] = [];
        this.memory[xi][yi].push(obj);
        yi++;
      }
      xi++;
    }
  }

  // rebuild the map
  rebuild(objects: GameObject[]): void {
    this.memory = [];
    for (const obj of objects) {
      if (obj.constructor.name === "Ant") continue;
      this.pushArea(obj.x, obj.y, obj.width || obj.image.width, obj.height || obj.image.height, obj);
    }
  }

  // draw the object map (for debugging purposes)
  draw(context: CanvasRenderingContext2D): void {
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

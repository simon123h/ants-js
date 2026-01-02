// Class for all objects
import Resources from "./resources";

export default class GameObject {
  x: number;
  y: number;
  direction: number;
  image: HTMLImageElement;
  width: number;
  height: number;

  constructor(x?: number, y?: number) {
    this.x = x ?? window.innerWidth * Math.random(); // x position
    this.y = y ?? window.innerHeight * Math.random(); // y position
    this.direction = 0; // orientation (rad)
    this.image = Resources.get("default");
    this.width = 0;
    this.height = 0;
  }

  // called at every step during the game loop
  step(): void {}

  // called if the object is detected by an ant
  detect(_ant: any): void {}
  // called if the object is probed by an ant
  leftProbeDetect(_ant: any): void {}
  rightProbeDetect(_ant: any): void {}

  // draw the object onto the map
  draw(context: CanvasRenderingContext2D): void {
    const w = this.width || this.image.width;
    const h = this.height || this.image.height;
    context.save();
    context.translate(this.x, this.y);
    context.rotate(this.direction);
    context.drawImage(this.image, -w / 2, -h / 2, w, h);
    context.restore();
  }
}

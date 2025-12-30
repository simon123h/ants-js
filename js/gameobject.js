// Class for all objects
import Resources from './resources.js';

export default class GameObject {
  constructor(x, y) {
    this.x = x || window.innerWidth * Math.random(); // x position
    this.y = y || window.innerHeight * Math.random(); // y position
    this.direction = 0; // orientation (rad)
    this.image = Resources.get('default');
    this.width = 0;
    this.height = 0;
  }

  // called at every step during the game loop
  step() {}

  // called if the object is detected by an ant
  detect(ant) {}
  // called if the object is probed by an ant
  leftProbeDetect(ant) {}
  rightProbeDetect(ant) {}

  // draw the object onto the map
  draw(context) {
    const w = this.width || this.image.width;
    const h = this.height || this.image.height;
    context.save();
    context.translate(this.x, this.y);
    context.rotate(this.direction);
    context.drawImage(this.image, -w / 2, -h / 2, w, h);
    context.restore();
  }
}

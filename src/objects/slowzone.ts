import GameObject from "../gameobject";
import Resources from "../resources";

export default class Slowzone extends GameObject {
  factor: number;

  constructor(x?: number, y?: number, width?: number, height?: number, factor: number = 3) {
    super();
    this.x = x || window.innerWidth * Math.random();
    this.y = y || window.innerHeight * Math.random();
    this.image = Resources.get("slowzone");
    this.width = width || 150;
    this.height = height || 150;
    this.factor = factor;
  }

  detect(ant: any): void {
    if (ant.speed == ant.default_speed) {
      setTimeout(function () {
        ant.speed = ant.default_speed;
      }, 400);
      ant.speed = ant.default_speed / this.factor;
    }
  }
}

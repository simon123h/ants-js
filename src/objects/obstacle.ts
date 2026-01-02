import GameObject from "../gameobject";
import Resources from "../resources";

// Class for obstacles
export default class Obstacle extends GameObject {
  constructor(x?: number, y?: number, width?: number, height?: number) {
    super();
    this.x = x || window.innerWidth * Math.random();
    this.y = y || window.innerHeight * Math.random();
    this.image = Resources.get("obstacle");
    this.width = width || 90;
    this.height = height || 500;
  }

  detect(ant: any): void {
    if (ant.collision_timeout <= 10) {
      ant.direction += Math.PI;
      ant.collision_timeout = 10;
    }
  }

  // called when the obstacle is detected by an ant's probes
  leftProbeDetect(ant: any): void {
    if (ant.collision_timeout <= 10) {
      ant.direction += 1;
      ant.collision_timeout = 10;
    }
  }
  rightProbeDetect(ant: any): void {
    if (ant.collision_timeout <= 10) {
      ant.direction -= 1;
      ant.collision_timeout = 10;
    }
  }
}

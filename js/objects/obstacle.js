// Class for obstacles
class Obstacle extends Obj {
  constructor(x, y, width, height) {
    super();
    this.x = x || window.innerWidth * Math.random();
    this.y = y || window.innerHeight * Math.random();
    this.image.src = "res/obstacle.png";
    this.image.width = width || 90;
    this.image.height = height || 500;
  }

  detect(ant) {
    if (ant.collision_timeout <= 10) {
      ant.direction += Math.PI;
      ant.collision_timeout = 10;
    }
  }

  // called when the obstacle is detected by an ant's probes
  leftProbeDetect(ant) {
    if (ant.collision_timeout <= 10) {
      ant.direction += 1;
      ant.collision_timeout = 10;
    }
  }
  rightProbeDetect(ant) {
    if (ant.collision_timeout <= 10) {
      ant.direction -= 1;
      ant.collision_timeout = 10;
    }
  }
}

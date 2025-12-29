import GameObject from "../gameobject.js";
import { game } from "../game.js";

export default class Nest extends GameObject {
  constructor(x, y) {
    super();
    this.x = x || window.innerWidth * Math.random();
    this.y = y || window.innerHeight * Math.random();
    this.image.src = "res/nest.png";
    this.image.width = 120;
    this.image.height = 120;
    this.scentStrength = 2;
  }

  detect(ant) {
    if (ant.collision_timeout <= 0) {
      if (ant.cargo == "sugar") ant.deploy_sugar();
      ant.collision_timeout = 10;
    }
  }

  step() {
    game.scents.nest.push(this.x + (Math.random() - 0.5) * 80, this.y + (Math.random() - 0.5) * 80, this.scentStrength);
  }
}

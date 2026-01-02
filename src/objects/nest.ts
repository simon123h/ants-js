import GameObject from "../gameobject";
import { game } from "../game";
import Resources from "../resources";

export default class Nest extends GameObject {
  scentStrength: number;

  constructor(x?: number, y?: number) {
    super();
    this.x = x || window.innerWidth * Math.random();
    this.y = y || window.innerHeight * Math.random();
    this.image = Resources.get("nest");
    this.width = 120;
    this.height = 120;
    this.scentStrength = 2;
  }

  detect(ant: any): void {
    if (ant.collision_timeout <= 0) {
      if (ant.cargo == "sugar") ant.deploy_sugar();
      ant.collision_timeout = 10;
    }
  }

  step(): void {
    game.scents.nest.push(this.x + (Math.random() - 0.5) * 80, this.y + (Math.random() - 0.5) * 80, this.scentStrength);
  }
}

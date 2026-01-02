import GameObject from "../gameobject";
import { game } from "../game";
import Resources from "../resources";

export default class Sugar extends GameObject {
  max: number;
  amount: number;
  scentStrength: number;

  constructor(x?: number, y?: number) {
    super();
    this.x = x || window.innerWidth * Math.random();
    this.y = y || window.innerHeight * Math.random();
    this.image = Resources.get("sugar");
    this.width = 35;
    this.height = 35;
    this.max = 250;
    this.amount = this.max;
    this.scentStrength = 10;
  }

  detect(ant: any): void {
    if (ant.idle) ant.take_sugar(this);
  }

  step(): void {
    // TODO: do not make this random-based
    // TODO: is this even needed?
    if (Math.random() < 0.1818) game.scents.sugar.push(this.x, this.y, this.scentStrength);
  }

  draw(context: CanvasRenderingContext2D): void {
    super.draw(context);
    context.fillStyle = "#888";
    const perc = ((this.amount / this.max) * 100).toFixed(0);
    context.font = "10px sans-serif";
    context.textAlign = "center";
    context.fillText(`${perc}%`, this.x, this.y - 26);
  }
}

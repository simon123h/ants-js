import GameObject from "../gameobject.js";
import { game } from "../game.js";
import Resources from "../resources.js";

export default class Sugar extends GameObject {
  constructor(x, y) {
    super();
    this.x = x || window.innerWidth * Math.random();
    this.y = y || window.innerHeight * Math.random();
    this.image = Resources.get('sugar');
    this.width = 35;
    this.height = 35;
    this.max = 250;
    this.amount = this.max;
    this.scentStrength = 10;
  }

  detect(ant) {
    if (ant.idle) ant.take_sugar(this);
  }

  step() {
    // TODO: do not make this random-based
    // TODO: is this even needed?
    if (Math.random() < 0.1818) game.scents.sugar.push(this.x, this.y, this.scentStrength);
  }

  draw(context) {
    super.draw(context);
    context.fillStyle = "#888";
    const perc = ((this.amount / this.max) * 100).toFixed(0);
    context.font = "10px sans-serif";
    context.textAlign = "center";
    context.fillText(`${perc}%`, this.x, this.y - 26);
  }
}


class Sugar extends Obj {
  constructor(x, y) {
    super();
    this.x = x || window.innerWidth * Math.random();
    this.y = y || window.innerHeight * Math.random();
    this.image.src = "res/sugar.png";
    this.image.width = 35;
    this.image.height = 35;
    this.max = 250;
    this.amount = this.max;
    this.scentStrength = 10;
  }

  detect(ant) {
    if (ant.idle) ant.take_sugar(this);
  };

  step() {
    // TODO: do not make this random-based
    // TODO: is this even needed?
    if (Math.random() < 0.1818)
      game.scents.sugar.push(this.x, this.y, this.scentStrength);
  };

  draw(context) {
    super.draw(context);
    context.fillStyle = "#888";
    var perc = (this.amount / this.max * 100).toFixed(0);
    context.font = "10px sans-serif";
    context.textAlign = "center";
    context.fillText(`${perc}%`, this.x, this.y - 26);
  }
};

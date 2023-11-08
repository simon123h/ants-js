class Slowzone extends Obj {
  constructor(x, y, width, height) {
    super();
    this.x = x || window.innerWidth * Math.random();
    this.y = y || window.innerHeight * Math.random();
    this.image.src = "res/slowzone.png";
    this.image.width = width || 150;
    this.image.height = height || 150;
  }

  detect(ant) {
    if (ant.speed > 1.1) {
      setTimeout(function () {
        ant.speed = 3;
      }, 400);
      ant.speed = 1;
    }
  };
};

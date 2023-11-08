portals = [];

//Klasse fuer Portale zum Beamen
Portal = function (x, y, width, height) {
  Obj.call(this);

  this.x = x || window.innerWidth * Math.random(); //x-Position [int]
  this.y = y || window.innerHeight * Math.random(); //y-Position [int]
  this.image.src = "res/portal.png";
  this.image.width = width || 40;
  this.image.height = height || 40;
  this.detectable = true;
  this.portId = portals.length;
  portals.push(this);
  objMap.pushArea(this.x, this.y, this.image.width, this.image.height, this);

  this.toString = function () {
    return "Portal #" + this.id;
  };

  this.detect = function (by) {
    if (portals.length > 1 && !by.colliding) {
      var rand = this.portId;
      while (rand == this.portId)
        rand = Math.round(Math.random() * (portals.length - 1));
      by.x = portals[rand].x;
      by.y = portals[rand].y;
      by.colliding = true;
      setTimeout(function () {
        by.colliding = false;
      }, 400 * game.time_scale);
    }
  };

  this.die = function () {
    var index = objs.indexOf(this);
    objs.splice(index, 1);
    index = portals.indexOf(this);
    portals.splice(index, 1);
    objMap.rebuild();
  };
};

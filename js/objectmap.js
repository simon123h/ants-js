//Konstruktor
class ObjectMap {
  constructor(res) {
    // // Attribute // //
    this.resolution = res || 15; //Aufloesung des Rasters in px
    this.memory = new Array(); //Speicher fuer Duftstoffe
  }

  //Punkt auf Karte abfragen
  get(x, y) {
    x = Math.floor(x / this.resolution);
    y = Math.floor(y / this.resolution);
    if (
      typeof this.memory[x] == "undefined" ||
      typeof this.memory[x][y] == "undefined"
    ) {
      return new Array();
    }
    return this.memory[x][y];
  }

  //Punkt auf Karte setzen
  push(x, y, obj) {
    x = Math.floor(x / this.resolution);
    y = Math.floor(y / this.resolution);
    if (typeof this.memory[x] == "undefined") this.memory[x] = new Array();
    if (typeof this.memory[x][y] == "undefined")
      this.memory[x][y] = new Array();
    this.memory[x][y].push(obj);
  }

  //Flaeche auf Karte setzen
  pushArea(x, y, width, height, obj) {
    x -= width / 2 - 3;
    y -= height / 2 - 3;
    var xi = Math.floor(x / this.resolution);
    var xMax = Math.floor((x + width) / this.resolution);
    var yMax = Math.floor((y + height) / this.resolution);
    while (xi < xMax) {
      var yi = Math.floor(y / this.resolution);
      while (yi < yMax) {
        if (typeof this.memory[xi] == "undefined")
          this.memory[xi] = new Array();
        if (typeof this.memory[xi][yi] == "undefined")
          this.memory[xi][yi] = new Array();
        this.memory[xi][yi].push(obj);
        yi++;
      }
      xi++;
    }
  }

  rebuild() {
    this.memory = new Array();
    for (var obj of game.objects) {
      this.pushArea(obj.x, obj.y, obj.image.width, obj.image.height, obj,);
    }
  }
}

//Speicher-Array
monitorAromas = new Array();

//Konstruktor
class Aroma {
  constructor(res, color, max) {
    this.resolution = res; //Aufloesung des Rasters in px
    this.color = color; // color for visualization
    this.max = max; // max value for visualization
    this.memory = new Array(); //Speicher fuer Duftstoffe
    var xMax = window.innerWidth / this.resolution;
    var yMax = window.innerHeight / this.resolution;
    for (var i = 0; i < xMax; i++) {
      this.memory[i] = new Array();
      for (var j = 0; j < yMax; j++) {
        this.memory[i][j] = 0;
      }
    }
  }

  //Wert in Duftstoff-Feld abfragen
  get(x, y, ant) {
    var x = Math.floor(x / this.resolution);
    var y = Math.floor(y / this.resolution);
    if (
      typeof this.memory[x] == "undefined" ||
      typeof this.memory[x][y] == "undefined"
    ) {
      return 0;
    }
    return this.memory[x][y];
  };

  //Wert in Duftstoff-Feld ablegen
  push(x, y, value, radius) {
    var x = Math.floor(x / this.resolution);
    var y = Math.floor(y / this.resolution);
    if (typeof this.memory[x][y] == "undefined") {
      //console.log("AromaException: Memory index out of bound! Tried to access memory["+x+"]["+y+"].");
      return;
    }
    this.memory[x][y] += value;
    if (
      typeof this.memory[x + 1] != "undefined" &&
      typeof this.memory[x + 1][y + 1] != "undefined"
    )
      this.memory[x + 1][y + 1] += value / 3;
    if (
      typeof this.memory[x + 1] != "undefined" &&
      typeof this.memory[x + 1][y] != "undefined"
    )
      this.memory[x + 1][y] += value / 3;
    if (
      typeof this.memory[x + 1] != "undefined" &&
      typeof this.memory[x + 1][y - 1] != "undefined"
    )
      this.memory[x + 1][y - 1] += value / 3;
    if (
      typeof this.memory[x] != "undefined" &&
      typeof this.memory[x][y + 1] != "undefined"
    )
      this.memory[x][y + 1] += value / 3;
    if (
      typeof this.memory[x] != "undefined" &&
      typeof this.memory[x][y - 1] != "undefined"
    )
      this.memory[x][y - 1] += value / 3;
    if (
      typeof this.memory[x - 1] != "undefined" &&
      typeof this.memory[x - 1][y + 1] != "undefined"
    )
      this.memory[x - 1][y + 1] += value / 3;
    if (
      typeof this.memory[x - 1] != "undefined" &&
      typeof this.memory[x - 1][y] != "undefined"
    )
      this.memory[x - 1][y] += value / 3;
    if (
      typeof this.memory[x - 1] != "undefined" &&
      typeof this.memory[x - 1][y - 1] != "undefined"
    )
      this.memory[x - 1][y - 1] += value / 3;
  };

  //Werte in Duftstoff-Feld abklingen lassen
  step() {
    for (var i = 0; i < this.memory.length; i++) {
      for (var j = 0; j < this.memory[i].length; j++) {
        this.memory[i][j] *= 0.996;
        if (this.memory[i][j] < 0.01) this.memory[i][j] = 0;
      }
    }
  };

  // visualize the aroma
  draw(context) {
    for (var i = 0; i < this.memory.length; i++) {
      for (var j = 0; j < this.memory[i].length; j++) {
        var val = this.memory[i][j] / this.max;
        if (val > 1) val = 1;
        context.fillStyle = this.color;
        context.globalAlpha = val * 0.5;
        context.fillRect(
          i * this.resolution,
          j * this.resolution,
          this.resolution,
          this.resolution,
        );
        context.globalAlpha = 1;
      }
    }
  }

};

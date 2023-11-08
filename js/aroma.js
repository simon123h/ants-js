//Speicher-Array
aromas = new Array();
monitorAromas = new Array();

//Konstruktor
Aroma = function (res) {
  aromas.push(this);

  // // Attribute // //
  this.resolution = res || 15; //Aufloesung des Rasters in px [int]
  this.memory = new Array(); //Speicher fuer Duftstoffe [ int[int][int] ]

  // // Main Functions // //

  //Wert in Duftstoff-Feld abfragen
  this.get = function (x, y, ant) {
    var x = Math.floor(x / this.resolution);
    var y = Math.floor(y / this.resolution);
    if (
      typeof this.memory[x] == "undefined" ||
      typeof this.memory[x][y] == "undefined"
    ) {
      //console.log("AromaException: Memory index out bound! Tried to access memory["+x+"]["+y+"].");
      return 0;
    }
    return this.memory[x][y];
  };

  //Wert in Duftstoff-Feld ablegen
  this.push = function (x, y, value, radius) {
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
  this.decay = function () {
    var curAroma = this;
    var decayIntvl = setInterval(function () {
      for (var i = 0; i < curAroma.memory.length; i++) {
        for (var j = 0; j < curAroma.memory[i].length; j++) {
          curAroma.memory[i][j] *= 0.95;
          if (curAroma.memory[i][j] < 0.01) curAroma.memory[i][j] = 0;
        }
      }
    }, 250 * t__);
  };

  this.pause = function () {
    clearInterval(decayIntvl);
  };

  //leeren Speicher-Array erzeugen/resetten
  this.initiate = function () {
    var xMax = window.innerWidth / this.resolution;
    var yMax = window.innerHeight / this.resolution;
    for (var i = 0; i < xMax; i++) {
      this.memory[i] = new Array();
      for (var j = 0; j < yMax; j++) {
        this.memory[i][j] = 0;
      }
    }
    this.decay();
  };
  this.initiate();

  //Aroma grafisch darstellen, insb. zum Debugging
  this.monitor = function (r, g, b, max) {
    max = max || 30;
    r = r || 0;
    b = b || 0;
    g = g || 0;
    monitorAromas.push({ obj: this, r: r, g: g, b: b, max: max });
  };

  this.overlay2 = function (canvas, context, r, g, b, max, clear) {
    if (clear) context.clearRect(0, 0, canvas.width, canvas.height);
    var mem = this.memory;
    for (var i = 0; i < mem.length; i++) {
      for (var j = 0; j < mem[i].length; j++) {
        var val = mem[i][j] / max;
        if (val > 1) val = 1;
        context.fillStyle =
          "rgba(" + r + ", " + g + ", " + b + ", " + val + ")";
        if (val > 0)
          context.fillRect(
            i * antAroma.resolution,
            j * antAroma.resolution,
            antAroma.resolution,
            antAroma.resolution,
          );
      }
    }
  };
};

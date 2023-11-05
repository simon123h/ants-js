
ants = new Array();
antAroma = new Aroma();

nestAroma = new Aroma();
sugarAroma = new Aroma();


//Klasse fuer Ameisen
Ant = function (x, y, color, probeLength) {
	Obj.call(this);
	ants.push(this);

	// // Attribute // //
	this.x = x || window.innerWidth * Math.random();	//x-Position [int]
	this.y = y || window.innerHeight * Math.random();	//y-Position [int]
	this.rad = 10;									//Radius [int]
	this.speed = 3;									//Translationsgeschwindgkeit [int]
	this.direction = 2 * Math.PI * Math.random();		//Translationsrichtung (radians) [int]
	this.color = color || "#F00";					//Farbe (Farbcode) [String]
	this.cargo = null;								//getragene Last [Object] [portable]
	this.idle = true;								//Ist die Ameise frei fuer Aktionen? [bool]
	this.health = 100;								//Gesundheit der Ameise (0-100) [int]
	this.antType = null;							//Art der Ameise (Arbeiter...) [Object] [Implementieren]
	this.probeLength = probeLength || 24;			//Laenge der Fuehler
	this.image.src = "res/ant.png";				//Bildquelle zum Zeichnen [string]
	this.nest = undefined;							//Ameisenbau [Nest]
	this.id = AntCounter++;
	this.image.width = 15;
	this.image.height = 15;
	this.colliding = false;
	this.idleAromaStrength = 0.001;
	this.aromaStrength = 0;
	this.score = 0;



	// // Getter/Setter // //
	this.getX = function () { return this.x; }
	this.getY = function () { return this.y; }
	this.getPosition = function () { return this.x + ":" + this.y; }
	this.getSpeedX = function () { return this.speed * Math.cos(this.direction); }	//Welche Geschwindigkeit in X-Richtung?
	this.getSpeedY = function () { return this.speed * Math.sin(this.direction); }	//Welche Geschwindigkeit in Y-Richtung?
	this.getColor = function () { return this.color; }



	// // Main Functions // //


	this.toString = function () {
		return "Ant #" + this.id;
	}

	//Ein Schritt vorwaerts
	this.step = function () {
		this.x += this.speed * Math.cos(this.direction);
		this.y += this.speed * Math.sin(this.direction);

		if (this.x < this.rad / 2) { this.x = this.rad / 2; this.direction = 2 * Math.PI * Math.random(); }
		if (this.y < this.rad / 2) { this.y = this.rad / 2; this.direction = 2 * Math.PI * Math.random(); }
		if (this.x + this.rad / 2 > window.innerWidth) { this.x = window.innerWidth - this.rad / 2; this.direction = 2 * Math.PI * Math.random() }
		if (this.y + this.rad / 2 > window.innerHeight) { this.y = window.innerHeight - this.rad / 2; this.direction = 2 * Math.PI * Math.random(); }

		//if(Math.random()<0.02) this.direction += 1.5*(Math.random()-0.5);	//Zufaelliger Richtungswechsel

	}


	//Bewegung starten
	this.move = function () {
		var curAnt = this;
		this.movementInterval = setInterval(function () {
			curAnt.step();
			if (Math.random() < 0.15) curAnt.emitAntAroma();
			if (Math.random() < 0.4) curAnt.nose();
			if (Math.random() < 0.4) curAnt.detectObjects();
		}, 40 * t__);
	}
	this.move();


	//Bewegung stoppen
	this.stop = function () {
		clearInterval(this.movementInterval);
	}


	//Nach Duftstoffen schnuppern und Entscheidungen treffen
	this.nose = function () {
		var range = this.probeLength;
		var e_p = { x: Math.cos(this.direction), y: Math.sin(this.direction) }	//Einheitsvektor parallel zu Bewegungsrichtung
		var e_n = { x: Math.sin(this.direction), y: -Math.cos(this.direction) }	//Einheitsvektor normal zu Bewegungsrichtung
		var leftProbe1 = { x: this.x + range * (e_p.x + e_n.x), y: this.y + range * (e_p.y + e_n.y) }
		var rightProbe1 = { x: this.x + range * (e_p.x - e_n.x), y: this.y + range * (e_p.y - e_n.y) }
		var leftProbe2 = { x: this.x + range * (2 * e_p.x + e_n.x), y: this.y + range * (2 * e_p.y + e_n.y) }
		var rightProbe2 = { x: this.x + range * (2 * e_p.x - e_n.x), y: this.y + range * (2 * e_p.y - e_n.y) }
		var leftVal = 0;
		var rightVal = 0;
		leftVal = antAroma.get(leftProbe1.x, leftProbe1.y, this);
		rightVal = antAroma.get(rightProbe1.x, rightProbe1.y, this);
		leftVal = antAroma.get(leftProbe2.x, leftProbe2.y, this);
		rightVal = antAroma.get(rightProbe2.x, rightProbe2.y, this);
		if (this.cargo == "sugar") {
			leftVal += nestAroma.get(leftProbe1.x, leftProbe1.y, this);
			rightVal += nestAroma.get(rightProbe1.x, rightProbe1.y, this);
			leftVal += nestAroma.get(leftProbe2.x, leftProbe2.y, this);
			rightVal += nestAroma.get(rightProbe2.x, rightProbe2.y, this);
		} else if (this.idle == true) {
			leftVal += sugarAroma.get(leftProbe1.x, leftProbe1.y, this);
			rightVal += sugarAroma.get(rightProbe1.x, rightProbe1.y, this);
			leftVal += sugarAroma.get(leftProbe2.x, leftProbe2.y, this);
			rightVal += sugarAroma.get(rightProbe2.x, rightProbe2.y, this);
		}
		if (leftVal > rightVal) this.direction -= Math.random() * 0.5;
		if (leftVal < rightVal) this.direction += Math.random() * 0.5;
	}


	//Duftstoffe emitieren
	this.emitAntAroma = function () {
		antAroma.push(this.x, this.y, this.aromaStrength + this.idleAromaStrength);

		if (this.cargo == "sugar") sugarAroma.push(this.x, this.y, 3);
		if (this.idle == true) nestAroma.push(this.x, this.y, 1);
	}

	//Nach Objekten an der aktuellen Position suchen und gegebenenfalls interagieren
	this.detectObjects = function () {

		//An Position der Ameise
		var objArray = objMap.get(this.x, this.y);
		if (objArray.length > 0)
			for (var i = 0; i < objArray.length; i++) {
				objArray[i].detect(this);
			}

		//Mit den Fuehlern
		var range = this.probeLength * 0.3;
		var e_p = { x: Math.cos(this.direction), y: Math.sin(this.direction) }	//Einheitsvektor parallel zu Bewegungsrichtung
		var e_n = { x: Math.sin(this.direction), y: -Math.cos(this.direction) }	//Einheitsvektor normal zu Bewegungsrichtung
		var leftProbe = { x: this.x + range * (2 * e_p.x + e_n.x), y: this.y + range * (2 * e_p.y + e_n.y) }
		var rightProbe = { x: this.x + range * (2 * e_p.x - e_n.x), y: this.y + range * (2 * e_p.y - e_n.y) }
		var objArray = objMap.get(leftProbe.x, leftProbe.y);
		if (objArray.length > 0)
			for (var i = 0; i < objArray.length; i++) {
				objArray[i].leftProbeDetect(this);
			}
		objArray = objMap.get(rightProbe.x, rightProbe.y);
		if (objArray.length > 0)
			for (var i = 0; i < objArray.length; i++) {
				objArray[i].rightProbeDetect(this);
			}
	}


	//Zucker aufnehmen
	this.takeSugar = function (obj) {
		this.image.src = "res/antWithSugar.png";
		this.direction += Math.PI;
		this.idle = false;
		this.cargo = "sugar";
		obj.amount--;
		if (obj.amount < 1) {
			obj.die();
			new Sugar();
			evolveAnts(20);
		}
	}

	//Zucker ablegen
	this.deploySugar = function () {
		if (this.cargo != "sugar") return;
		this.image.src = "res/ant.png";
		this.idle = true;
		this.direction += Math.PI;
		this.cargo = null;
		this.score++;
		//new Ant(250, 250);
	}

	//Eine Weile lang Aroma senden
	this.excite = function () {
		this.aromaStrength = 2;
		var curAnt = this;
		setTimeout(function () { curAnt.aromaStrength = 0; }, 7500 * t__);
	}

	//Sterben
	this.die = function () {
		this.stop();
		var index = objs.indexOf(this);
		objs.splice(index, 1);
		index = ants.indexOf(this);
		ants.splice(index, 1);
		objMap.rebuild();
	}




	// // Carrying & Being Carried // //


	//Objekt Tragen
	this.carry = function (obj) {
		if (this.cargo != null) {
			console.log("CarryException: Ant #" + this.id + " tried to carry the Object, but already carried something.");
			return;
		}
		if (typeof (obj) != "undefined" && typeof (obj.onCarried) != "undefined") {
			if (obj.onCarried(this) == false) return;
			else this.cargo = obj;
		} else {
			console.log("CarryException: Ant #" + this.id + " tried to carry the Object, but failed. Object:");
			console.log(obj);
		}
	}


	//Objekt ablegen
	this.unCarry = function () {
		this.cargo.onUnCarried();
		this.cargo = null;
	}


	//getragen werden
	this.onCarried = function (carrier) {
		if (!this.idle) {
			console.log("CarryException: Ant #" + carrier.id + " tried to carry ant #" + this.id + " but it was not idle.");
			return false;
		}
		console.log("Implement: Ant #" + this.id + " is now being carried by ant #" + carrier.id + ".");
		this.idle = false;
	}


	//abgestellt werden
	this.onUnCarried = function (carrier) {
	}

}


//Hilfsfunktionen

function getAntById(id) {
	for (var i = 0; i < ants.length; i++) {
		if (ants[i].id == id) return ants[i];
	}
	return null;
}
AntCounter = 0;
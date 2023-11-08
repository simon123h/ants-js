
// Klasse fuer Ameisen
class Ant extends Obj {
	constructor(x, y, probeLength) {
		super();

		this.x = x || window.innerWidth * Math.random(); // x-Position
		this.y = y || window.innerHeight * Math.random(); // y-Position
		this.rad = 10; // Radius
		this.speed = 3; // Translationsgeschwindgkeit
		this.direction = 2 * Math.PI * Math.random(); // Translationsrichtung (rad)
		this.cargo = null; // getragene Last [Object]
		this.idle = true; // Ist die Ameise frei fuer Aktionen? [bool]
		this.health = 100; // Gesundheit der Ameise (0-100)
		this.antType = null; // Art der Ameise (Arbeiter...) [Object] [Implementieren]
		this.probeLength = probeLength || 24; // Laenge der Fuehler
		this.image.src = "res/ant.png"; // Bildquelle zum Zeichnen
		this.nest = undefined; // Ameisenbau [Nest]
		this.id = AntCounter++;
		this.image.width = 15;
		this.image.height = 15;
		this.colliding = false;
		this.idleAromaStrength = 0.001;
		this.aromaStrength = 0;
		this.score = 0;
	}

	// current velocity
	get vx() {
		return this.speed * Math.cos(this.direction);
	}
	get vy() {
		return this.speed * Math.sin(this.direction);
	}

	// Make a step forwards
	step() {
		this.x += this.vx;
		this.y += this.vy;
		// make sure the ant does not leave the window boundaries
		if (this.x < this.rad / 2) {
			this.x = this.rad / 2;
			this.direction = 2 * Math.PI * Math.random();
		}
		if (this.y < this.rad / 2) {
			this.y = this.rad / 2;
			this.direction = 2 * Math.PI * Math.random();
		}
		if (this.x + this.rad / 2 > window.innerWidth) {
			this.x = window.innerWidth - this.rad / 2;
			this.direction = 2 * Math.PI * Math.random();
		}
		if (this.y + this.rad / 2 > window.innerHeight) {
			this.y = window.innerHeight - this.rad / 2;
			this.direction = 2 * Math.PI * Math.random();
		}
		// occasionally change direction
		// if(Math.random()<0.02) this.direction += 1.5*(Math.random()-0.5);
		// TODO: better not make this random-based for performance reasons
		if (Math.random() < 0.15) this.emitAntAroma();
		if (Math.random() < 0.4) this.nose();
		if (Math.random() < 0.4) this.detectObjects();
	}

	// Nach Duftstoffen schnuppern und Entscheidungen treffen
	nose() {
		var range = this.probeLength;
		// unit vector parallel to the movement direction
		var e_p = { x: Math.cos(this.direction), y: Math.sin(this.direction) };
		// unit vector normal to the movement direction
		var e_n = { x: Math.sin(this.direction), y: -Math.cos(this.direction) };
		var leftProbe1 = {
			x: this.x + range * (e_p.x + e_n.x),
			y: this.y + range * (e_p.y + e_n.y),
		};
		var rightProbe1 = {
			x: this.x + range * (e_p.x - e_n.x),
			y: this.y + range * (e_p.y - e_n.y),
		};
		var leftProbe2 = {
			x: this.x + range * (2 * e_p.x + e_n.x),
			y: this.y + range * (2 * e_p.y + e_n.y),
		};
		var rightProbe2 = {
			x: this.x + range * (2 * e_p.x - e_n.x),
			y: this.y + range * (2 * e_p.y - e_n.y),
		};
		var leftVal = 0;
		var rightVal = 0;
		leftVal = game.aromas.ant.get(leftProbe1.x, leftProbe1.y, this);
		rightVal = game.aromas.ant.get(rightProbe1.x, rightProbe1.y, this);
		leftVal = game.aromas.ant.get(leftProbe2.x, leftProbe2.y, this);
		rightVal = game.aromas.ant.get(rightProbe2.x, rightProbe2.y, this);
		if (this.cargo == "sugar") {
			leftVal += game.aromas.nest.get(leftProbe1.x, leftProbe1.y, this);
			rightVal += game.aromas.nest.get(rightProbe1.x, rightProbe1.y, this);
			leftVal += game.aromas.nest.get(leftProbe2.x, leftProbe2.y, this);
			rightVal += game.aromas.nest.get(rightProbe2.x, rightProbe2.y, this);
		} else if (this.idle == true) {
			leftVal += game.aromas.sugar.get(leftProbe1.x, leftProbe1.y, this);
			rightVal += game.aromas.sugar.get(rightProbe1.x, rightProbe1.y, this);
			leftVal += game.aromas.sugar.get(leftProbe2.x, leftProbe2.y, this);
			rightVal += game.aromas.sugar.get(rightProbe2.x, rightProbe2.y, this);
		}
		if (leftVal > rightVal) this.direction -= Math.random() * 0.5;
		if (leftVal < rightVal) this.direction += Math.random() * 0.5;
	}

	// emit ant scent
	emitAntAroma() {
		game.aromas.ant.push(this.x, this.y, this.aromaStrength + this.idleAromaStrength);
		if (this.cargo == "sugar") game.aromas.sugar.push(this.x, this.y, 3);
		if (this.idle == true) game.aromas.nest.push(this.x, this.y, 1);
	}

	// search for objects in the current location and possibly interact
	detectObjects() {
		// objects at the current location
		for (var obj of game.objMap.get(this.x, this.y)) obj.detect(this);

		// objects at the probes
		var range = this.probeLength * 0.3;
		var e_p = { x: Math.cos(this.direction), y: Math.sin(this.direction) }; // Einheitsvektor parallel zu Bewegungsrichtung
		var e_n = { x: Math.sin(this.direction), y: -Math.cos(this.direction) }; // Einheitsvektor normal zu Bewegungsrichtung
		var leftProbe = {
			x: this.x + range * (2 * e_p.x + e_n.x),
			y: this.y + range * (2 * e_p.y + e_n.y),
		};
		var rightProbe = {
			x: this.x + range * (2 * e_p.x - e_n.x),
			y: this.y + range * (2 * e_p.y - e_n.y),
		};
		var objArray = game.objMap.get(leftProbe.x, leftProbe.y);
		if (objArray.length > 0)
			for (var i = 0; i < objArray.length; i++) {
				objArray[i].leftProbeDetect(this);
			}
		objArray = game.objMap.get(rightProbe.x, rightProbe.y);
		if (objArray.length > 0)
			for (var i = 0; i < objArray.length; i++) {
				objArray[i].rightProbeDetect(this);
			}
	}

	// carry sugar
	takeSugar(sugar) {
		this.image.src = "res/antWithSugar.png";
		this.direction += Math.PI;
		this.idle = false;
		this.cargo = "sugar";
		sugar.amount--;
		if (sugar.amount < 1) {
			game.remove_object(sugar);
			game.add_object(new Sugar());
			// evolveAnts(20);
		}
	}

	// Zucker ablegen
	deploySugar() {
		if (this.cargo != "sugar") return;
		this.image.src = "res/ant.png";
		this.idle = true;
		this.direction += Math.PI;
		this.cargo = null;
		this.score++;
		// new Ant(250, 250);
	}

	// Eine Weile lang Aroma senden
	excite() {
		this.aromaStrength = 2;
		var curAnt = this;
		setTimeout(function () {
			curAnt.aromaStrength = 0;
		}, 7500 * game.time_scale);
	}

}

AntCounter = 0;




//Klasse fuer Ameisennester
Nest = function (x, y) {
	Obj.call(this);

	this.x = x || window.innerWidth * Math.random();	//x-Position [int]
	this.y = y || window.innerHeight * Math.random();	//y-Position [int]
	this.image.src = "res/nest.png";
	this.image.width = 120;
	this.image.height = 120;
	this.aromaStrength = 10;
	this.detectable = true;
	objMap.pushArea(this.x, this.y, this.image.width, this.image.height, this);



	this.toString = function () {
		return "Nest #" + this.id;
	}

	this.detect = function (by) {
		if (!by.colliding) {
			if (by.cargo == "sugar") by.deploySugar();
			by.excite();
			by.colliding = true;
			setTimeout(function () { by.colliding = false; }, 1000 * t__);
		}
	}

	this.active = function () {
		var curNest = this;
		this.activeInterval = setInterval(function () {
			antAroma.push(curNest.x + (Math.random() - 0.5) * 100, curNest.y + (Math.random() - 0.5) * 100, curNest.aromaStrength);
		}, 100 * t__);
	}
	this.active();

	this.stop = function () {
		clearInterval(this.activeInterval);
	}

	this.die = function () {
		this.stop();
		var index = objs.indexOf(this);
		objs.splice(index, 1);
		objMap.rebuild();
	}
}



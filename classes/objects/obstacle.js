
//Klasse fuer Hindernisse
Obstacle = function(x, y, width, height){
	Obj.call(this);
	
	this.x = x || window.innerWidth*Math.random();	//x-Position [int]
	this.y = y || window.innerHeight*Math.random();	//y-Position [int]
	this.image.src="../res/obstacle.png";
	this.image.width = width || 90;
	this.image.height = height || 500;
	this.detectable = true;
	objMap.pushArea(this.x, this.y, this.image.width, this.image.height, this);

	
	this.toString = function(){
		return "Obstacle #"+this.id;
	}
	
	this.detect = function(by){
		if(!by.colliding){
			by.direction += Math.PI;
			by.colliding = true;
			setTimeout(function(){by.colliding=false;}, 1000*t__);
		}
	}
	
	//Von Fuehler erfuelt werden
	this.leftProbeDetect = function(by){
		if(!by.colliding){
			by.direction += 1;
			by.colliding = true;
			setTimeout(function(){by.colliding=false;}, 100*t__);
		}
	}
	this.rightProbeDetect = function(by){
		if(!by.colliding){
			by.direction -= 1;
			by.colliding = true;
			setTimeout(function(){by.colliding=false;}, 100*t__);
		}
	}
}
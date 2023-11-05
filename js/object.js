
//Objekte zaehlen
objCounter = 0;
objs = new Array();


//Klasse fuer Objekte
Obj = function(x, y){
	objs.push(this);
	
	// // Attribute // //
	this.x = x || window.innerWidth*Math.random();	//x-Position [int]
	this.y = y || window.innerHeight*Math.random();	//y-Position [int]
	this.direction = 0;								//Ausrichtung (radians) [int]
	this.drawable = true;							//Zeichenbar [bool]
	this.portable = false;							//Tragbar [bool]
	this.image = new Image();
	this.id = objCounter++;
	this.stackable = true;
	this.detectable = false;
	
	// // Getter/Setter // //
	this.getX = function(){return this.x;}
	this.getY = function(){return this.y;}
	this.getPosition = function(){return this.x+":"+this.y;}
	
	
	// // Methoden // //
	
	this.toString = function(){
		return "Obj. #"+this.id;
	}
	
	//erfuehlt werden von Ameise
	this.detect = function(by){
		if(this.detectable) console.log(by.toString()+" hit "+this.toString());
	}
	
	//Von Fuehler erfuelt werden
	this.leftProbeDetect = function(by){
		
	}
	this.rightProbeDetect = function(by){
		
	}
	
	//Getragen werden
	this.onCarried = function(carrier){
		detectable = false;
		objMap.rebuild();
	}
	
	//abgestellt werden
	this.onUnCarried = function(carrier){
		this.detectable = true;
		objMap.rebuild();
	}
	
	//Entfernt werden
	this.die = function(){
		var index = objs.indexOf(this);
		objs.splice(index, 1);
		objMap.rebuild();
	}
}





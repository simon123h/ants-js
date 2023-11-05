
//Konstruktor
ObjectMap = function(res){

	// // Attribute // //
	this.resolution = res || 15;	//Aufloesung des Rasters in px [int]
	this.memory = new Array();		//Speicher fuer Duftstoffe [ int[int][int] ]
	
	
	//Punkt auf Karte abfragen
	this.get = function(x, y){
		x = Math.floor(x/this.resolution);
		y = Math.floor(y/this.resolution);
		if(typeof(this.memory[x])=="undefined" || typeof(this.memory[x][y])=="undefined"){
			return new Array();
		}
		return this.memory[x][y];		
	}
	
	
	//Punkt auf Karte setzen
	this.push = function(x, y, obj){
		x = Math.floor(x/this.resolution);
		y = Math.floor(y/this.resolution);
		if(typeof(this.memory[x])=="undefined") this.memory[x] = new Array();
		if(typeof(this.memory[x][y])=="undefined") this.memory[x][y] = new Array();
		this.memory[x][y].push(obj);
	}
	
	
	//Flaeche auf Karte setzen
	this.pushArea = function(x, y, width, height, obj){
		x -= width/2 - 3;
		y -= height/2 - 3;
		var xi = Math.floor(x/this.resolution);
		var xMax = Math.floor((x+width)/this.resolution);
		var yMax = Math.floor((y+height)/this.resolution);
		while(xi<xMax){
			var yi = Math.floor(y/this.resolution);
			while(yi<yMax){
				if(typeof(this.memory[xi])=="undefined") this.memory[xi] = new Array();
				if(typeof(this.memory[xi][yi])=="undefined") this.memory[xi][yi] = new Array();
				this.memory[xi][yi].push(obj);
				yi++;
			}
			xi++;
		}
	}
	
	this.rebuild = function(){
		this.memory = new Array();
		for(var i=0;i<objs.length;i++){
			if(objs[i].detectable){
				curObj = objs[i];
				this.pushArea(curObj.x, curObj.y, curObj.image.width, curObj.image.height, curObj);
			}
		}
	}
}

objMap = new ObjectMap();

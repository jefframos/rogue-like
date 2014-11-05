/*jshint undef:false */
var displayColors = {
	    // Features
	    OCEAN: 0x44447a,
	    COAST: 0x33335a,
	    LAKESHORE: 0x225588,
	    LAKE: 0x336699,
	    RIVER: 0x225588,
	    MARSH: 0x2f6666,
	    ICE: 0x99ffff,
	    BEACH: 0xa09077,
	    ROAD1: 0x442211,
	    ROAD2: 0x553322,
	    ROAD3: 0x664433,
	    BRIDGE: 0x686860,
	    LAVA: 0xcc3333,

	    // Terrain
	    SNOW: 0xffffff,
	    TUNDRA: 0xbbbbaa,
	    BARE: 0x888888,
	    SCORCHED: 0x555555,
	    TAIGA: 0x99aa77,
	    SHRUBLAND: 0x889977,
	    TEMPERATE_DESERT: 0xc9d29b,
	    TEMPERATE_RAIN_FOREST: 0x448855,
	    TEMPERATE_DECIDUOUS_FOREST: 0x679459,
	    GRASSLAND: 0x88aa55,
	    SUBTROPICAL_DESERT: 0xd2b98b,
	    TROPICAL_RAIN_FOREST: 0x337755,
	    TROPICAL_SEASONAL_FOREST: 0x559944
	};
var LevelGenerator = Class.extend({
	init: function (parent){
		this.parent = parent;
	},
	createHordes: function(){
		var tempMonster = null;
		for (var i = 0; i < 1; i++) {
			
			tempMonster = new Enemy(this.parent.player, APP.monsterList[0].clone());
			// if(this.parent.currentNode.id >= 10){
			// 	// tempMonster.monsterModel.level = 10;
			// 	tempMonster.monsterModel.updateLevel(10);
			// }else{
			// 	tempMonster.monsterModel.updateLevel(1);
			// }
			tempMonster.build();
			tempMonster.setPosition(this.parent.levelBounds.x * this.parent.currentNode.getNextFloat() + this.parent.mapPosition.x,this.parent.levelBounds.y * this.parent.currentNode.getNextFloat() + this.parent.mapPosition.y);
			this.parent.entityLayer.addChild(tempMonster);
		}
	},
	putObstacles: function(){
		// for (var i = this.parent.level.length - 1; i >= 0; i--) {
		// 	for (var j = this.parent.level[i].length - 1; j >= 0; j--) {
		// 		if(this.parent.level[i][j] > 0)
		// 		{
		// 			var obs = new Obstacle(this.parent.level[i][j] - 1);
		// 			obs.build();
		// 			obs.setPosition((j)* APP.nTileSize+ this.parent.mapPosition.x, (i+1)* APP.tileSize.y+ this.parent.mapPosition.y);
		// 			this.parent.entityLayer.addChild(obs);
		// 		}
		// 	}
		// }



		// for (var i = this.parent.marginTiles.x + 1; i < this.parent.tempSizeTiles.x-this.parent.marginTiles.x + 1; i++) {
		// 	for (var j = this.parent.marginTiles.y + 1; j < this.parent.tempSizeTiles.y-this.parent.marginTiles.y + 1; j++) {
		// 		if(this.parent.currentNode.getNextFloat() > 0.95)
		// 		{
		// 			var obs = new Obstacle(1);
		// 			obs.build();
		// 			obs.setPosition((j)* APP.nTileSize+ this.parent.mapPosition.x, (i+1)* APP.nTileSize+ this.parent.mapPosition.y);
		// 			this.parent.entityLayer.addChild(obs);
		// 		}
		// 	}
		// }
	},
	createRoom: function(){
		var i = 0;
		var tempTile = null;
		var tempContainer = new PIXI.DisplayObjectContainer();
		var mapMaker = null;
		
		// if(this.parent.currentNode.getNextFloat()< 0.3){
		// 	mapMaker = voronoiMap.islandShape.makeBlob(this.parent.currentNode.getNextFloat(), 0.5);
		// }
		// else if(this.parent.currentNode.getNextFloat()< 0.6){
		// 	mapMaker = voronoiMap.islandShape.makeRadial(this.parent.currentNode.getNextFloat(), 0.5);
		// }
		// else{// if(this.parent.currentNode.getNextFloat()< 0.3){
		// 	mapMaker = voronoiMap.islandShape.makeSquare(this.parent.currentNode.getNextFloat(), 0.5);
		// }


		mapMaker = voronoiMap.islandShape.makeRadial(this.parent.currentNode.getNextFloat(), 0.5);
		// this.parent.tempSizeTiles.x *= 4;
		// this.parent.tempSizeTiles.y *= 4;
		this.parent.currentNode.mapData = [];
		var tempDataLine = [];
		for (i = this.parent.tempSizeTiles.x - 1; i >= 0; i--) {
			tempDataLine = [];
			for (var j = this.parent.tempSizeTiles.y - 1; j >= 0; j--) {
				tempDataLine.push({});
			}
			this.parent.currentNode.mapData.push(tempDataLine);
		}

		var tempMapSize = {width:this.parent.tempSizeTiles.x*APP.nTileSize,height:this.parent.tempSizeTiles.y*APP.nTileSize};
		var numberOfPoints = this.parent.tempSizeTiles.x*this.parent.tempSizeTiles.y;

		var map = voronoiMap.map(tempMapSize);
		map.newIsland(mapMaker, this.parent.currentNode.getNextFloat());

		//gera a malha de pontos uniformemente
		map.go0PlaceUniformPoints( numberOfPoints ,this.parent.tempSizeTiles.x,this.parent.tempSizeTiles.y,APP.nTileSize);
		map.go1BuildGraph();
		map.assignBiomes();
		map.go2AssignElevations();
		map.go3AssignMoisture();
		map.go4DecorateMap();


		var sz = APP.nTileSize;
		var scl = 1;

		var tempX = 0;
		var tempY = 0;

		var ix = 0;
		var jy = 0;
		
		var top = null;
		var bot = {x:0, y:-99999};
		var lef = null;
		var rig = {x:-99999, y:-99999};
		
		for (i = 0; i < map.centers.length; i++) {
			

			//inverse
			ix = Math.floor(map.centers[i].point.y / APP.nTileSize);
			jy = Math.floor(map.centers[i].point.x / APP.nTileSize);


			
			if(ix === Math.floor(this.parent.tempSizeTiles.y / 2)){
				if(!top && map.centers[i].biome !== 'OCEAN')
				{
					top = {x:jy,y:ix};
					// console.log('top',top);
				}
				if(bot.y < jy){
					bot = {x:jy,y:ix};
					// console.log('bot',bot);
				}
			}

			if(jy === Math.floor(this.parent.tempSizeTiles.x / 2)){
				if(!lef && map.centers[i].biome !== 'OCEAN')
				{
					lef = {x:jy,y:ix};
					console.log('lef',lef);
				}
				console.log('ix',ix, jy);

				if(rig.x < ix){
					rig = {x:jy,y:ix};
					console.log('rig',rig);
				}
			}


			tempX = ix * APP.nTileSize;
			tempY = jy * APP.nTileSize;

			this.parent.currentNode.mapData[jy][ix] = map.centers[i].biome;

			tempTile = new SimpleSprite('_dist/img/tile1.png');
			
			tempTile.setPosition(tempY*scl,tempX*scl);
			tempTile.getContent().tint = displayColors[map.centers[i].biome];//0x0000FF * map.centers[i].elevation;

			// tempTile.getContent().tint = displayColors.OCEAN + 0x000055 * map.centers[i].elevation;//0x0000FF * map.centers[i].elevation;

			tempTile.getContent().scale.x = scl;
			tempTile.getContent().scale.y = scl;
			tempContainer.addChild(tempTile.getContent());
		}
		this.parent.currentNode.topTile = top;
		this.parent.currentNode.bottomTile = bot;
		this.parent.currentNode.leftTile = lef;
		this.parent.currentNode.rightTile = rig;

		//*** roads

		// var roads = voronoiMap.roads();
		// roads.createRoads(map, [0, 0.15]);

		// console.log(nacum);
		// console.log(roads);

		// for (i = roads.roadConnections.length - 1; i >= 0; i--) {
		// 	if(roads.roadConnections[i]){
		// 		console.log(roads.road[roads.roadConnections[i][0].index], roads.road[roads.roadConnections[i][1].index]);

		// 		tempTile = new SimpleSprite('_dist/img/tile1.png');
		// 		tempTile.getContent().tint = 0x00000;

		// 		// console.log(roads.roadConnections[i][0].d0.point);
		// 		tempContainer.addChild(tempTile.getContent());

		// 		tempX = Math.floor(roads.roadConnections[i][0].midpoint.y / APP.nTileSize)* APP.nTileSize;
		// 		tempY = Math.floor(roads.roadConnections[i][0].midpoint.x / APP.nTileSize)* APP.nTileSize;
		// 		tempTile.setPosition(tempY*scl,tempX*scl);

		// 	}
		// }



		//

		this.parent.bgContainer.addChild(tempContainer);
		this.parent.currentNode.bg = tempContainer;
		
		return tempContainer;

	},
	// debugBounds:function(){
	// 	if(this.parent.levelBoundsGraph && this.parent.levelBoundsGraph.parent){
	// 		this.parent.levelBoundsGraph.parent.removeChild(this.parent.levelBoundsGraph);
	// 	}
	// 	this.parent.levelBoundsGraph = new PIXI.Graphics();
	// 	this.parent.levelBoundsGraph.lineStyle(1,0xff0000);
	// 	this.parent.levelBoundsGraph.drawRect(this.parent.mapPosition.x,this.parent.mapPosition.y,this.parent.levelBounds.x, this.parent.levelBounds.y);
	// 	this.parent.addChild(this.parent.levelBoundsGraph);
	// },
	createDoors:function(){
		

		if(this.parent.currentNode.childrenSides[0] && this.parent.currentNode.leftTile){
			this.parent.doorLeft = new Door('left');
			this.parent.doorLeft.build();
			this.parent.doorLeft.setPosition(this.parent.currentNode.leftTile.x * APP.nTileSize + this.parent.doorLeft.width/2 , this.parent.currentNode.leftTile.y * APP.nTileSize);
			this.parent.doorLeft.node = this.parent.currentNode.childrenSides[0];
			this.parent.environmentLayer.addChild(this.parent.doorLeft);
		}

		if(this.parent.currentNode.childrenSides[1] && this.parent.currentNode.rightTile){
			this.parent.doorRight = new Door('right');
			this.parent.doorRight.build();
			this.parent.doorRight.setPosition(this.parent.currentNode.rightTile.x * APP.nTileSize - this.parent.doorRight.width/2 , this.parent.currentNode.rightTile.y * APP.nTileSize);
			this.parent.doorRight.node = this.parent.currentNode.childrenSides[1];
			this.parent.environmentLayer.addChild(this.parent.doorRight);
		}


		if(this.parent.currentNode.childrenSides[2] && this.parent.currentNode.topTile){
			this.parent.doorUp = new Door('up');
			this.parent.doorUp.build();
			this.parent.doorUp.setPosition(this.parent.currentNode.topTile.x * APP.nTileSize, this.parent.currentNode.topTile.y * APP.nTileSize - this.parent.doorUp.height/2);
			this.parent.doorUp.node = this.parent.currentNode.childrenSides[2];
			this.parent.environmentLayer.addChild(this.parent.doorUp);
		}

		if(this.parent.currentNode.childrenSides[3] && this.parent.currentNode.downTile){
			this.parent.doorDown = new Door('down');
			this.parent.doorDown.build();
			this.parent.doorDown.setPosition(this.parent.currentNode.downTile.x * APP.nTileSize, this.parent.currentNode.downTile.y * APP.nTileSize + this.parent.doorDown.height/2);
			this.parent.doorDown.node = this.parent.currentNode.childrenSides[3];
			this.parent.environmentLayer.addChild(this.parent.doorDown);
		}


		// if(this.parent.currentNode.childrenSides[0]){
		// 	this.parent.doorLeft = new Door('left');
		// 	this.parent.doorLeft.build();
		// 	this.parent.doorLeft.setPosition(this.parent.mapPosition.x,this.parent.levelBounds.y/2 + this.parent.mapPosition.y);

		// 	this.parent.doorLeft.node = this.parent.currentNode.childrenSides[0];
		// 	this.parent.environmentLayer.addChild(this.parent.doorLeft);

		// }
		// if(this.parent.currentNode.childrenSides[1]){
		// 	this.parent.doorRight = new Door('right');
		// 	this.parent.doorRight.build();
		// 	this.parent.doorRight.setPosition(this.parent.levelBounds.x + this.parent.mapPosition.x,this.parent.levelBounds.y/2  + this.parent.mapPosition.y);

		// 	this.parent.doorRight.node = this.parent.currentNode.childrenSides[1];
		// 	this.parent.environmentLayer.addChild(this.parent.doorRight);

		// }
		// if(this.parent.currentNode.childrenSides[2]){
		// 	this.parent.doorUp = new Door('up');
		// 	this.parent.doorUp.build();
		// 	this.parent.doorUp.setPosition(this.parent.mapPosition.x + this.parent.levelBounds.x / 2,this.parent.mapPosition.y);

		// 	this.parent.doorUp.node = this.parent.currentNode.childrenSides[2];
		// 	this.parent.environmentLayer.addChild(this.parent.doorUp);

		// }
		// if(this.parent.currentNode.childrenSides[3]){
		// 	this.parent.doorDown = new Door('down');
		// 	this.parent.doorDown.build();
		// 	this.parent.doorDown.setPosition(this.parent.mapPosition.x + this.parent.levelBounds.x / 2,this.parent.levelBounds.y + this.parent.mapPosition.y);
		// 	this.parent.doorDown.node = this.parent.currentNode.childrenSides[3];
		// 	this.parent.environmentLayer.addChild(this.parent.doorDown);
		// }
	},
	removeRain: function(){
		if(this.rainContainer && this.rainContainer.parent){
			this.parent.removeChild(this.rainContainer);
		}
	},
	createRain: function(){
		var tempRain = null;
		if(this.rainContainer && this.rainContainer.parent){
			this.parent.removeChild(this.rainContainer);
		}

		this.rainContainer = new PIXI.DisplayObjectContainer();

		this.vecRain = [];
		for (var j = 300; j >= 0; j--) {
			tempRain = new RainParticle(50, 5, this.parent.levelBounds.x + 500, this.parent.levelBounds.y + 500, 'left');
			this.rainContainer.addChild(tempRain.content);
			this.vecRain.push(tempRain);
		}
		if(!this.rainContainer.parent){
			this.parent.addChild(this.rainContainer);
		}
	},
	update: function(){
		if(this.vecRain){
			for (var i = this.vecRain.length - 1; i >= 0; i--) {
				this.vecRain[i].update();
			}
		}
	},
	pointDistance: function(x, y, x0, y0){
		return Math.sqrt((x -= x0) * x + (y -= y0) * y);
	},
});

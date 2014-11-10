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
		var monsters = [];
		for (var i = 0; i < 1; i++) {
			
			tempMonster = new Enemy(this.parent.player, APP.monsterList[0].clone());
			// if(this.parent.currentNode.id >= 10){
			// 	// tempMonster.monsterModel.level = 10;
			// 	tempMonster.monsterModel.updateLevel(10);
			// }else{
			// 	tempMonster.monsterModel.updateLevel(1);
			// }
			// tempMonster.build();
			// tempMonster.setPosition(this.parent.levelBounds.x * this.parent.currentNode.getNextFloat(),this.parent.levelBounds.y * this.parent.currentNode.getNextFloat());
			var rndAngle = this.parent.currentNode.getNextFloat() * 360 / 180 * Math.PI;
			tempMonster.initialPosition = {x:this.parent.levelBounds.x /2 + 300 * Math.sin(rndAngle),
				y:this.parent.levelBounds.y /2 + 300 * Math.cos(rndAngle)};
			// this.parent.entityLayer.addChild(tempMonster);
			monsters.push(tempMonster);
		}
		return monsters;
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
		this.distanceToShowMap = 5;
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
		// this.placedTiles = [];
		var tempDataLine = [];
		var tempDataPlacedLine = [];
		for (i = this.parent.tempSizeTiles.x - 1; i >= 0; i--) {
			tempDataLine = [];
			tempDataPlacedLine = [];
			for (var j = this.parent.tempSizeTiles.y - 1; j >= 0; j--) {
				tempDataLine.push({});
				tempDataPlacedLine.push(0);
			}
			this.parent.currentNode.mapData.push(tempDataLine);
			this.parent.currentNode.placedTiles.push(tempDataPlacedLine);
		}

		var tempMapSize = {width:this.parent.tempSizeTiles.x*APP.nTileSize,height:this.parent.tempSizeTiles.y*APP.nTileSize};
		var numberOfPoints = this.parent.tempSizeTiles.x*this.parent.tempSizeTiles.y;

		this.map = voronoiMap.map(tempMapSize);
		this.map.newIsland(mapMaker, this.parent.currentNode.getNextFloat());

		//gera a malha de pontos uniformemente
		this.map.go0PlaceUniformPoints( numberOfPoints ,this.parent.tempSizeTiles.x,this.parent.tempSizeTiles.y,APP.nTileSize);
		this.map.go1BuildGraph();
		this.map.assignBiomes();
		this.map.go2AssignElevations();
		this.map.go3AssignMoisture();
		this.map.go4DecorateMap();
		var ix = 0;
		var jy = 0;
		
		// var top = null;
		// var bot = {x:0, y:-99999};
		// var lef = null;
		// var rig = {x:-99999, y:-99999};

		var top = {x:this.parent.tempSizeTiles.x / 2, y:this.parent.tempSizeTiles.y/2 - 3};
		var bot = {x:this.parent.tempSizeTiles.x / 2, y:this.parent.tempSizeTiles.y/2 + 3};
		var lef = {x:this.parent.tempSizeTiles.x/2 - 3, y:this.parent.tempSizeTiles.y / 2};
		var rig = {x:this.parent.tempSizeTiles.x/2 + 3, y:this.parent.tempSizeTiles.y / 2};
////////////////////////////////////////
		for (i = 0; i < this.map.centers.length; i++) {
			

		// 	//inverse
			ix = Math.floor(this.map.centers[i].point.y / APP.nTileSize);
			jy = Math.floor(this.map.centers[i].point.x / APP.nTileSize);


			
			// if(ix === Math.floor(this.parent.tempSizeTiles.y / 2)){
			// 	if(!top && this.map.centers[i].biome !== 'OCEAN')
			// 	{
			// 		top = {x:jy,y:ix};
			// 		// console.log('top',top);
			// 	}
			// 	if(bot.y < jy){
			// 		bot = {x:jy,y:ix};
			// 		// console.log('bot',bot);
			// 	}
			// }

			// if(jy === Math.floor(this.parent.tempSizeTiles.x / 2)){
			// 	if(!lef && this.map.centers[i].biome !== 'OCEAN')
			// 	{
			// 		lef = {x:jy,y:ix};
			// 		// console.log('lef',lef);
			// 	}
			// 	// console.log('ix',ix, jy);

			// 	if(rig.x < ix){
			// 		rig = {x:jy,y:ix};
			// 		// console.log('rig',rig);
			// 	}
			// }


		// 	tempX = ix * APP.nTileSize;
		// 	tempY = jy * APP.nTileSize;
			this.parent.currentNode.placedTiles[jy][ix] = 0;
			this.parent.currentNode.mapData[jy][ix] = this.map.centers[i].biome;
		}
////////////////////////////////////////
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

		this.parent.currentNode.bg = new PIXI.DisplayObjectContainer();
		return this.parent.currentNode.bg;

	},
	updateTiles: function(playerPostion){
		// console.log(this.parent.currentNode.bg.parent);
		// if(this.parent.currentNode.bg && this.parent.currentNode.bg.parent === undefined){
		// 	this.parent.bgContainer.addChild(this.parent.currentNode.bg);
		// }
		if(playerPostion && this.parent.currentNode.mapData){
			var tempPlaced = {x:0,y:0};
			for (var i = playerPostion.x - this.distanceToShowMap; i < playerPostion.x+this.distanceToShowMap; i++) {
				if(i >= 0 && i <this.parent.currentNode.placedTiles.length){
					tempPlaced.x = i;
					for (var j = playerPostion.y - this.distanceToShowMap; j < playerPostion.y+this.distanceToShowMap; j++) {
						if(j >= 0 && j <this.parent.currentNode.placedTiles[tempPlaced.x].length){
							tempPlaced.y = j;
							if(this.parent.currentNode.placedTiles[tempPlaced.x][tempPlaced.y] === 0 && this.pointDistance(tempPlaced.x, tempPlaced.y,playerPostion.x,playerPostion.y) < this.distanceToShowMap){
								this.parent.currentNode.placedTiles[tempPlaced.x][tempPlaced.y] = 1;

								var tempTile = new SimpleSprite('_dist/img/tile1.png');
								
								var tempX = tempPlaced.x * APP.nTileSize;
								var tempY = tempPlaced.y * APP.nTileSize;

								var sz = APP.nTileSize;
								var scl = 1;
								// console.log(tempY*scl,tempX*scl);
								tempTile.setPosition(tempX*scl,tempY*scl);

								tempTile.getContent().tint = displayColors[this.parent.currentNode.mapData[tempPlaced.x][tempPlaced.y]];//0x0000FF * map.centers[i].elevation;

								tempTile.getContent().scale.x = scl / 2;
								tempTile.getContent().scale.y = scl / 2;
								tempTile.getContent().alpha = 0;
								TweenLite.to(tempTile.getContent(), 0.5, {alpha:1});
								TweenLite.to(tempTile.getContent().scale, 0.2, {x:scl, y:scl});
								this.parent.currentNode.bg.addChild(tempTile.getContent());
							}
						}
					}
				}
			}
			
		}
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
		
		console.log(this.parent.currentNode.childrenSides,'childrenSides');
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

		if(this.parent.currentNode.childrenSides[3] && this.parent.currentNode.bottomTile){
			this.parent.doorDown = new Door('down');
			this.parent.doorDown.build();
			this.parent.doorDown.setPosition(this.parent.currentNode.bottomTile.x * APP.nTileSize, this.parent.currentNode.bottomTile.y * APP.nTileSize + this.parent.doorDown.height/2);
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
		this.updateTiles(this.parent.getPlayerTilePos());
		// console.log(this.parent.getPlayerTylePos());
	},
	pointDistance: function(x, y, x0, y0){
		return Math.sqrt((x -= x0) * x + (y -= y0) * y);
	},
});

/*jshint undef:false */
// var defaultColors = {
// 		// Features
// 		OCEAN: 0x44447a,
// 		COAST: 0x33335a,
// 		LAKESHORE: 0x225588,
// 		LAKE: 0x336699,
// 		RIVER: 0x225588,
// 		MARSH: 0x2f6666,
// 		ICE: 0x99ffff,
// 		BEACH: 0xa09077,
// 		ISLAND1: 0x442211,
// 		ISLAND2: 0x553322,
// 		ISLAND3: 0x664433,
// 		BRIDGE: 0x686860,
// 		LAVA: 0xcc3333,

// 		// Terrain
// 		SNOW: 0xffffff,
// 		TUNDRA: 0xbbbbaa,
// 		BARE: 0x888888,
// 		SCORCHED: 0x555555,
// 		TAIGA: 0x99aa77,
// 		SHRUBLAND: 0x889977,
// 		TEMPERATE_DESERT: 0xc9d29b,
// 		TEMPERATE_RAIN_FOREST: 0x448855,
// 		TEMPERATE_DECIDUOUS_FOREST: 0x679459,
// 		GRASSLAND: 0x88aa55,
// 		SUBTROPICAL_DESERT: 0xd2b98b,
// 		TROPICAL_RAIN_FOREST: 0x337755,
// 		TROPICAL_SEASONAL_FOREST: 0x559944
// 	};

// var displayColorsOld = {
// 		// Features
// 		OCEAN: 0x44447a,
// 		COAST: 0x33335a,
// 		LAKESHORE: 0x225588,
// 		LAKE: 0x336699,
// 		MARSH: 0x2f6666,
// 		ICE: 0x99ffff,
// 		RIVER: 0x225588,
// 		// BEACH: 0xa09077,
// 		BEACH: 0x4fa319,
// 		BASE: 0x4fa319,
// 		ISLAND1: 0x7F4F1F,
// 		ISLAND2: 0x663B14,
// 		ISLAND3: 0x472911,
// 		BRIDGE: 0x686860,
// 		LAVA: 0xcc3333,

// 		// Terrain 0x315b16
// 		SNOW: 0x3d8e09,
// 		TUNDRA: 0x3d8e09,
// 		BARE: 0x3d8e09,
// 		SCORCHED: 0x3d8e09,
// 		TAIGA: 0x3d8e09,
// 		STANDARD1: 0x3d8e09,

// 		TEMPERATE_RAIN_FOREST: 0x315b16,
// 		TEMPERATE_DECIDUOUS_FOREST: 0x315b16,
// 		TROPICAL_RAIN_FOREST: 0x315b16,
// 		TROPICAL_SEASONAL_FOREST: 0x315b16,
// 		STANDARD2: 0x315b16,

		
// 		SHRUBLAND: 0x4fa319,
// 		TEMPERATE_DESERT: 0x4fa319,
// 		GRASSLAND: 0x4fa319,
// 		SUBTROPICAL_DESERT: 0x4fa319,
// 		STANDARD3: 0x4fa319

// 	};
var displayColors = {};
// 		// Features
// 		OCEAN: 0x44447a,
// 		COAST: 0x33335a,
// 		LAKESHORE: 0x225588,
// 		LAKE: 0x336699,
// 		MARSH: 0x2f6666,
// 		ICE: 0x99ffff,
// 		RIVER: 0x225588,
// 		// BEACH: 0xa09077,

// 		BEACH: 0x336339,
// 		BASE: 0x336339,
// 		// BASE: 0xFF0000,


// 		ISLAND3: 0xC19C70,
// 		ISLAND2: 0x9B6E4D,
// 		ISLAND1: 0x402A1C,
// 		BRIDGE: 0x686860,
// 		LAVA: 0xcc3333,
// 		ROAD1: 0xcc3333,

// 		// Terrain 0x315b16
// 		SNOW: 0x3d8e09,
// 		TUNDRA: 0x3d8e09,
// 		BARE: 0x3d8e09,
// 		SCORCHED: 0x3d8e09,
// 		TAIGA: 0x3d8e09,
// 		STANDARD1: 0x488E5A,

// 		TEMPERATE_RAIN_FOREST: 0x315b16,
// 		TEMPERATE_DECIDUOUS_FOREST: 0x315b16,
// 		TROPICAL_RAIN_FOREST: 0x315b16,
// 		TROPICAL_SEASONAL_FOREST: 0x315b16,
// 		STANDARD2: 0x3D7747,

		
// 		SHRUBLAND: 0x4fa319,
// 		TEMPERATE_DESERT: 0x4fa319,
// 		GRASSLAND: 0x4fa319,
// 		SUBTROPICAL_DESERT: 0x4fa319,
// 		STANDARD3: 0x488E5A

// 	};
var arrayThrees = [['_dist/img/flora/florest1/tree1.png',
					'_dist/img/flora/florest1/tree2.png',
					'_dist/img/flora/florest1/tree3.png',
					'_dist/img/flora/florest1/tree4.png'
					],
				['_dist/img/flora/florest1/treeEvil.png']
				];
var arrayRocks = [['_dist/img/flora/florest1/rock1.png',
		'_dist/img/flora/florest1/rock2.png',
		'_dist/img/flora/florest1/rock3.png']];
var tilesGraphics = {
	TOP_LEFT : '_dist/img/levels/leftTop.png',
	TOP_RIGHT : '_dist/img/levels/rightTop.png',
	BOTTOM_LEFT : '_dist/img/levels/leftBottom.png',
	BOTTOM_RIGHT : '_dist/img/levels/rightBottom.png',
	CENTER : '_dist/img/levels/tile1.png',
	BASE1 : '_dist/img/levels/base1.png'
};
var LevelGenerator = Class.extend({
	init: function (parent){
		this.parent = parent;
		this.tileDesigner = new TileDesigner();
		this.nonPlaceObstaclesBiomes = ['OCEAN', 'BEACH', 'LAKE', 'ISLAND1', 'ISLAND2', 'ISLAND3', 'ROAD1'];
		this.nullTiles = ['NULL', 'OCEAN'];
		displayColors = APP.environmentList[0].colors;
	},
	createHordes: function(){
		var tempMonster = null;
		var monsters = [];
		for (var i = 0; i < 10; i++) {
			var id = Math.floor(this.parent.currentNode.getNextFloat() * APP.monsterList.length);
			if(APP.monsterList[id].sourceLabel === 'STATIC'){
				tempMonster = new StaticEnemy(this.parent.player, APP.monsterList[id].clone());
			}else{
				tempMonster = new Enemy(this.parent.player, APP.monsterList[id].clone());
			}
			// if(this.parent.currentNode.id >= 10){
			// 	// tempMonster.monsterModel.level = 10;
			// tempMonster.monsterModel.updateLevel(10);
			// }else{
			// 	tempMonster.monsterModel.updateLevel(1);
			// }
			// tempMonster.build();
			// tempMonster.setPosition(this.parent.levelBounds.x * this.parent.currentNode.getNextFloat(),this.parent.levelBounds.y * this.parent.currentNode.getNextFloat());
			var rndAngle = this.parent.currentNode.getNextFloat() * 360 / 180 * Math.PI;
			tempMonster.initialPosition = {x:this.parent.levelBounds.x /2 + 300 + (200*i) * Math.sin(rndAngle),
				y:this.parent.levelBounds.y /2 + 300 + (200*i) * Math.cos(rndAngle)};
			// this.parent.entityLayer.addChild(tempMonster);
			monsters.push(tempMonster);
		}
		return monsters;
	},
	isNullTiles: function(biome){
		for (var i = this.nullTiles.length - 1; i >= 0; i--) {
			if(biome === this.nullTiles[i]){
				return false;
			}
		}
		return true;
	},
	possibleBiomesToObstacles: function(biome){
		for (var i = this.nonPlaceObstaclesBiomes.length - 1; i >= 0; i--) {
			if(biome === this.nonPlaceObstaclesBiomes[i]){
				return false;
			}
		}
		return true;
	},
	possibleBiome: function(biome, model){
		for (var i = model.biomes.length - 1; i >= 0; i--) {
			if(biome === model.biomes[i]){
				return true;
			}
		}
		return false;
	},
	putObstacles: function(){
		var accBounds = 2;
		var yAcc = 0.00001;
		var currentEnvironent = 0;
		var treeModel = APP.environmentList[currentEnvironent].treeModelList[0];
		for (var i = this.parent.currentNode.mapData.length - accBounds; i >= accBounds; i--) {
			for (var j = this.parent.currentNode.mapData[i].length - accBounds; j >= accBounds; j--) {
				if(treeModel.frequence > this.parent.currentNode.getNextFloat() &&
					this.parent.currentNode.mapData[i][j]!== undefined &&
					this.parent.currentNode.mapData[i][j].biome !== undefined &&
					(
						this.possibleBiome(this.parent.currentNode.mapData[i][j].biome, treeModel) ||
						this.possibleBiome(this.parent.currentNode.mapDataLayer1[i][j].biome, treeModel) ||
						this.possibleBiome(this.parent.currentNode.mapDataLayer2[i][j].biome, treeModel)
					)
					){
					var obs = new EnvironmentObject(treeModel, new Float(this.parent.currentNode.getNextFloat()));
					obs.build();
					obs.setPosition((i)* APP.nTileSize, (j+1)* APP.nTileSize + yAcc);
					yAcc += 0.0001;
					this.parent.entityLayer.addChild(obs);
				}
			}
		}
	},
	createRoom: function(){
		var i = 0;
		this.distanceToShowMap = 9;
		var mapMaker = null;
		// if(this.parent.currentNode.getNextFloat()< 0.3){
		// 	mapMaker = voronoiMap.islandShape.makeBlob(this.parent.currentNode.getNextFloat(), 0.5);
		// }
		// else if(this.parent.currentNode.getNextFloat()< 0.6){
		// 	mapMaker = voronoiMap.islandShape.makeRadial(this.parent.currentNode.getNextFloat(), 0.5);
		// }
		// else{// if(this.parent.currentNode.getNextFloat()< 0.3){
			// mapMaker = voronoiMap.islandShape.makeSquare(this.parent.currentNode.getNextFloat(), 0.5);
		// }
		// mapMaker = voronoiMap.islandShape.makeRadial(this.parent.currentNode.getNextFloat(), 0.5);
		// mapMaker = voronoiMap.islandShape.makeSquare(this.parent.currentNode.getNextFloat(), 0.5);

		mapMaker = voronoiMap.islandShape.makePerlin(this.parent.currentNode.getNextFloat(), 0.5);
		
		//inicializa o map data das layers
		this.parent.currentNode.backMapData = [];
		this.parent.currentNode.mapData = [];
		this.parent.currentNode.mapDataLayer1 = [];
		this.parent.currentNode.mapDataLayer2 = [];
		this.parent.currentNode.mapDataLayer3 = [];

		//inicializa as layers placeds
		this.parent.currentNode.backPlacedTiles = [];
		this.parent.currentNode.placedTiles = [];
		this.parent.currentNode.placedTilesLayer1 = [];
		this.parent.currentNode.placedTilesLayer2 = [];
		this.parent.currentNode.placedTilesLayer3 = [];

		var tempBackDataLine = [];
		var tempDataLine = [];
		var tempDataLineLayer1 = [];
		var tempDataLineLayer2 = [];
		var tempDataLineLayer3 = [];

		var tempBackDataPlacedLine = [];
		var tempDataPlacedLine = [];
		var tempDataPlacedLineLineLayer1 = [];
		var tempDataPlacedLineLineLayer2 = [];
		var tempDataPlacedLineLineLayer3 = [];

		for (i = this.parent.tempSizeTiles.x - 1; i >= 0; i--) {
			tempBackDataLine = [];
			tempDataLine = [];
			tempDataLineLayer1 = [];
			tempDataLineLayer2 = [];
			tempDataLineLayer3 = [];

			tempBackDataPlacedLine = [];
			tempDataPlacedLine = [];
			tempDataPlacedLineLineLayer1 = [];
			tempDataPlacedLineLineLayer2 = [];
			tempDataPlacedLineLineLayer3 = [];

			for (var j = this.parent.tempSizeTiles.y + 5; j >= 0; j--) {
				tempBackDataLine.push({});
				tempBackDataPlacedLine.push(0);

				// if(j >= 0 && j < this.parent.tempSizeTiles.y){
				// tempDataLine.push({});
				// tempDataLineLayer1.push({});
				// tempDataLineLayer2.push({});
				// tempDataLineLayer3.push({});

				tempDataLine.push({biome:'OCEAN', position:'CENTER'});
				tempDataLineLayer1.push({biome:'OCEAN', position:'CENTER'});
				tempDataLineLayer2.push({biome:'OCEAN', position:'CENTER'});
				tempDataLineLayer3.push({biome:'OCEAN', position:'CENTER'});



				tempDataPlacedLine.push(0);
				tempDataPlacedLineLineLayer1.push(0);
				tempDataPlacedLineLineLayer2.push(0);
				tempDataPlacedLineLineLayer3.push(0);
				// }
			}

			this.parent.currentNode.backMapData.push(tempBackDataLine);
			this.parent.currentNode.backPlacedTiles.push(tempBackDataPlacedLine);

			
			this.parent.currentNode.mapDataLayer1.push(tempDataLineLayer1);
			this.parent.currentNode.mapDataLayer2.push(tempDataLineLayer2);
			this.parent.currentNode.mapDataLayer3.push(tempDataLineLayer3);

			this.parent.currentNode.placedTilesLayer1.push(tempDataPlacedLineLineLayer1);
			this.parent.currentNode.placedTilesLayer2.push(tempDataPlacedLineLineLayer2);
			this.parent.currentNode.placedTilesLayer3.push(tempDataPlacedLineLineLayer3);


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
		this.map.go2AssignElevations(0.1);
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


			
			this.parent.currentNode.placedTiles[jy][ix] = null;
			this.parent.currentNode.placedTilesLayer1[jy][ix] = null;
			this.parent.currentNode.placedTilesLayer2[jy][ix] = null;
			this.parent.currentNode.placedTilesLayer3[jy][ix] = null;

			if(this.map.centers[i].biome === 'BEACH' || this.map.centers[i].biome === 'OCEAN' ){
				this.parent.currentNode.mapData[jy][ix] = {biome:this.map.centers[i].biome, tile:'CENTER'};
			}else{
				this.parent.currentNode.mapData[jy][ix] = {biome:'BASE', tile:'CENTER'};
			}
			if(this.map.centers[i].biome === 'BEACH'){
				this.parent.currentNode.mapDataLayer1[jy][ix] = {biome:'OCEAN', tile:'CENTER'};
			}else{

				var tempBioma = 'STANDARD1';
				var tempBioma2 = this.map.centers[i].biome;
				if(tempBioma2 === 'SNOW' ||
					tempBioma2 === 'TUNDRA' ||
					tempBioma2 === 'BARE' ||
					tempBioma2 === 'TAIGA' ||
					tempBioma2 === 'SCORCHED'){
					tempBioma = 'STANDARD1';
				}else if(tempBioma2 === 'TEMPERATE_RAIN_FOREST' ||
					tempBioma2 === 'TEMPERATE_DECIDUOUS_FOREST' ||
					tempBioma2 === 'TROPICAL_RAIN_FOREST' ||
					tempBioma2 === 'TROPICAL_SEASONAL_FOREST'){
					tempBioma = 'STANDARD2';
				}else if(tempBioma2 === 'SHRUBLAND' ||
					tempBioma2 === 'TEMPERATE_DESERT' ||
					tempBioma2 === 'GRASSLAND' ||
					tempBioma2 === 'SUBTROPICAL_DESERT'){
					tempBioma = 'STANDARD3';
				}else if(tempBioma2 === 'COAST' ||
					tempBioma2 === 'LAKESHORE' ||
					tempBioma2 === 'LAKE' ||
					tempBioma2 === 'MARSH' ||
					tempBioma2 === 'ICE' ||
					tempBioma2 === 'RIVER'){
					tempBioma = 'LAKE';
				}else{
					tempBioma = tempBioma2;
				}
				// if(tempBioma === 'LAKE'){
				// 	this.parent.currentNode.mapDataLayer1[jy][ix] = {bioma:'OCEAN', tile:'CENTER'};
				// }
				this.parent.currentNode.mapDataLayer1[jy][ix] = {biome:tempBioma, tile:'CENTER'};
				// else{
				// 	this.parent.currentNode.mapDataLayer1[jy][ix] = {bioma:tempBioma, tile:'CENTER'};
				// 	this.parent.currentNode.mapDataLayer2[jy][ix] = {biome:'OCEAN', position:'CENTER'};	
				// }
			}
			
			this.parent.currentNode.mapDataLayer2[jy][ix] = {biome:'NULL', position:'CENTER'};
			this.parent.currentNode.mapDataLayer3[jy][ix] = {biome:'NULL', position:'CENTER'};
		}

		for (i = this.parent.tempSizeTiles.x - 1; i >= 0; i--) {
			for (k = this.parent.tempSizeTiles.y + 5; k >= 0; k--) {
				if(!this.parent.currentNode.mapData[i][k].biome){
					
					this.parent.currentNode.mapData[i][k] = {biome:'OCEAN', position:'CENTER'};
				}
			}
		}
////////////////////////////////////////
		this.parent.currentNode.topTile = top;
		this.parent.currentNode.bottomTile = bot;
		this.parent.currentNode.leftTile = lef;
		this.parent.currentNode.rightTile = rig;

		//*** roads

		var roads = voronoiMap.roads();
		roads.createRoads(this.map, [0, 0.15]);

		// console.log(nacum);
		// console.log(roads);

		for (i = roads.roadConnections.length - 1; i >= 0; i--) {

			if (roads.roadConnections[i] && roads.roadConnections[i].length >= 0) {
				tempX = Math.floor(roads.roadConnections[i][0].midpoint.y  / APP.nTileSize);
				tempY = Math.floor(roads.roadConnections[i][0].midpoint.x  / APP.nTileSize);
				// console.log(tempX,tempY);
				this.parent.currentNode.mapDataLayer2[tempY][tempX].biome = 'ROAD1';
				this.parent.currentNode.mapDataLayer2[tempY][tempX].tile = 'CENTER';

			}
		}

		this.tileDesigner.roundTiles(this.parent.currentNode.mapDataLayer1, 'STANDARD1');
		this.tileDesigner.roundTiles(this.parent.currentNode.mapDataLayer1, 'STANDARD2');
		this.tileDesigner.roundTiles(this.parent.currentNode.mapDataLayer1, 'STANDARD3');

		this.tileDesigner.roundTiles(this.parent.currentNode.mapDataLayer1, 'STANDARD1');
		this.tileDesigner.roundTiles(this.parent.currentNode.mapDataLayer1, 'STANDARD2');
		this.tileDesigner.roundTiles(this.parent.currentNode.mapDataLayer1, 'STANDARD3');

		// this.tileDesigner.roundTiles(this.parent.currentNode.mapDataLayer2, 'LAKE');

		this.tileDesigner.roundTilesCost(this.parent.currentNode.mapData, 'BEACH');
		this.tileDesigner.roundTilesCost(this.parent.currentNode.mapData, 'BEACH');
		this.tileDesigner.roundTilesCost(this.parent.currentNode.mapData, 'BEACH');
		this.tileDesigner.roundTilesCost(this.parent.currentNode.mapData, 'BEACH');

		this.tileDesigner.roundTilesBorder(this.parent.currentNode.backMapData, this.parent.currentNode.mapData, 'OCEAN');
		this.tileDesigner.roundTilesBorder(this.parent.currentNode.backMapData, this.parent.currentNode.mapData, 'OCEAN');
		this.tileDesigner.roundTilesBorder2(this.parent.currentNode.backMapData, ['ISLAND1','ISLAND2','ISLAND3'], 'ISLAND3');
		this.tileDesigner.roundTilesBorder2(this.parent.currentNode.backMapData, ['ISLAND1','ISLAND2','ISLAND3'], 'ISLAND2');
		this.tileDesigner.roundTilesBaseIsland(this.parent.currentNode.backMapData, ['ISLAND1','ISLAND2','ISLAND3']);
		this.tileDesigner.roundTilesBaseIslandColors(this.parent.currentNode.backMapData);
		// this.roundTilesBorder2(this.parent.currentNode.backMapData, 'ISLAND3');
		var line = '';
		for (var ii = 0; ii < this.parent.currentNode.backMapData.length; ii++) {
			line = '';
			for (var jj = 0; jj < this.parent.currentNode.backMapData[ii].length; jj++) {
				// console.log(this.parent.currentNode.backMapData[ii][jj]);
				line += this.parent.currentNode.backMapData[ii][jj].biome !== undefined?'1':'0';
			}
			// console.log(ii,line);
		}
		// console.log(this.parent.currentNode.backMapData);
		// console.log('MAP', this.parent.currentNode.mapData);
		// this.tileTeste = new SimpleSprite('_dist/img/levels/tile'+(Math.floor(Math.random() * 4) + 1)+'.png');
		this.parent.currentNode.backLayer = new PIXI.DisplayObjectContainer();
		this.parent.currentNode.bg = new PIXI.DisplayObjectContainer();
		this.parent.currentNode.bgLayer1 = new PIXI.DisplayObjectContainer();
		this.parent.currentNode.bgLayer2 = new PIXI.DisplayObjectContainer();
		this.parent.currentNode.bgLayer3 = new PIXI.DisplayObjectContainer();
		this.playerPostion = 0;
		return this.parent.currentNode.bg;

	},
	updateLayer: function(container, placeds, data, alpha){
		var tempPlaced = {x:0,y:0};
		var tempPlacedSprite = null;
		var distance = -999;
		// this.distanceToShowMap = 8;
		var accX = 3;
		var accY = 3;
		if(!alpha){
			alpha = 1;
		}
		for (var i = this.playerPostion.x - this.distanceToShowMap - accX; i < this.playerPostion.x+this.distanceToShowMap + accX; i++) {
			if(i >= 0 && i <placeds.length){
				tempPlaced.x = i;
				// console.log(placeds[tempPlaced.x].length);
				for (var j = this.playerPostion.y - this.distanceToShowMap - accY; j < this.playerPostion.y+this.distanceToShowMap + accY; j++) {
					if(j >= 0 && j <placeds[tempPlaced.x].length){
						tempPlaced.y = j;
						if(tempPlaced.x >= 0 && tempPlaced.y >= 0 && this.isNullTiles(data[tempPlaced.x][tempPlaced.y].biome)){//} !== 'OCEAN'&& data[tempPlaced.x][tempPlaced.y].biome !== 'NULL'){
							tempPlacedSprite = placeds[tempPlaced.x][tempPlaced.y];
							distance = Math.floor(this.pointDistance(tempPlaced.x, tempPlaced.y,this.playerPostion.x,this.playerPostion.y));
							if(data[tempPlaced.x][tempPlaced.y].biome && (tempPlacedSprite === null || tempPlacedSprite === 0)  && distance < this.distanceToShowMap){
								var tempTile = new SimpleSprite(tilesGraphics[data[tempPlaced.x][tempPlaced.y].tile]);
								// var tempTile = new SimpleSprite('_dist/img/tile1.png');
								var tempX = tempPlaced.x * APP.nTileSize;
								var tempY = tempPlaced.y * APP.nTileSize;
								var sz = APP.nTileSize;
								var scl = 1;
								tempTile.setPosition(tempX*scl,tempY*scl);
								tempTile.getContent().tint = addSaturation(displayColors[data[tempPlaced.x][tempPlaced.y].biome] , 1.5 - APP.getMadness() / 2);
								tempTile.getContent().alpha = alpha;//this.distanceToShowMap /distance;//alpha;
								container.addChild(tempTile.getContent());
								placeds[tempPlaced.x][tempPlaced.y] = tempTile.getContent();
							}

							if (tempPlacedSprite !== null  && distance > this.distanceToShowMap){
								if(tempPlacedSprite.parent){
									tempPlacedSprite.parent.removeChild(tempPlacedSprite);
									placeds[tempPlaced.x][tempPlaced.y] = null;
								}
							}
						}
					}
				}
			}
		}
	},
	updateTiles: function(playerPostion){
		if(this.playerPostion === playerPostion){
			return;
		}
		this.playerPostion = playerPostion;
		if(this.playerPostion && this.parent.currentNode.mapData){
			// this.updateLayer(this.parent.currentNode.bgLayer2,this.parent.currentNode.placedTilesLayer2,this.parent.currentNode.mapDataLayer2,0.8);
			this.updateLayer(this.parent.currentNode.backLayer,this.parent.currentNode.backPlacedTiles,this.parent.currentNode.backMapData);

			this.updateLayer(this.parent.currentNode.bgLayer1,this.parent.currentNode.placedTilesLayer1,this.parent.currentNode.mapDataLayer1,0.8);
			this.updateLayer(this.parent.currentNode.bg,this.parent.currentNode.placedTiles,this.parent.currentNode.mapData);

			// this.updateLayer(this.parent.currentNode.bgLayer2,this.parent.currentNode.placedTilesLayer2,this.parent.currentNode.mapDataLayer2,0.8);
			
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
		
		// console.log(this.parent.currentNode.childrenSides,'childrenSides');
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

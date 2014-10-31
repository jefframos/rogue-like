/*jshint undef:false */
var LevelGenerator = Class.extend({
	init: function (parent){
		this.parent = parent;
	},
	createHordes: function(){
		var tempMonster = null;
		for (var i = 0; i < 1; i++) {
			// APP.monsterList[0].level = this.parent.playerModel.level;
			tempMonster = new Enemy(this.parent.player, APP.monsterList[0]);
			tempMonster.build();
			tempMonster.setPosition(this.parent.levelBounds.x * this.parent.currentNode.getNextFloat() + this.parent.mapPosition.x,this.parent.levelBounds.y * this.parent.currentNode.getNextFloat() + this.parent.mapPosition.y);
			this.parent.entityLayer.addChild(tempMonster);
		}
	},
	putObstacles: function(){
		for (var i = this.parent.level.length - 1; i >= 0; i--) {
			for (var j = this.parent.level[i].length - 1; j >= 0; j--) {
				if(this.parent.level[i][j] > 0)
				{
					var obs = new Obstacle(this.parent.level[i][j] - 1);
					obs.build();
					obs.setPosition((j)* APP.tileSize.x+ this.parent.mapPosition.x, (i+1)* APP.tileSize.y+ this.parent.mapPosition.y);
					this.parent.entityLayer.addChild(obs);
				}
			}
		}
	},
	createRoom: function(){

		
	//     var octaveCount = options.octaveCount || 4;
		// var amplitude = options.amplitude || 0.1;
		// var persistence = options.persistence || 0.2;
		var opt = {
			octaveCount: 2,
			amplitude: 0.8,
			persistence:0.2
		};
		var noise = generatePerlinNoise(this.parent.tempSizeTiles.x,this.parent.tempSizeTiles.y,opt,this.parent.currentNode.getNextFloat());
		var ii = 0;
		var jj = 0;
		var tempTile = null;
		var tempContainer = new PIXI.DisplayObjectContainer();
		var maxDist = this.parent.tempSizeTiles.x > this.parent.tempSizeTiles.y ? this.parent.tempSizeTiles.x/2 : this.parent.tempSizeTiles.y/2;

		for (ii = 0; ii < this.parent.tempSizeTiles.x; ii++) {
			for (jj = 0; jj < this.parent.tempSizeTiles.y; jj++) {

				

				tempTile = new SimpleSprite(this.parent.currentNode.getNextFloat() < 0.5 ? '_dist/img/tile1.png':'_dist/img/tile2.png');
				tempTile.setPosition(ii * 80,jj * 80);

				if(ii < this.parent.marginTiles.x || ii >= this.parent.tempSizeTiles.x - this.parent.marginTiles.x ||
					jj < this.parent.marginTiles.y || jj >= this.parent.tempSizeTiles.y - this.parent.marginTiles.y )
				{
					var noiseID = (jj + Math.floor(ii * this.parent.tempSizeTiles.y));
					var alphaacc = 0;
					var distance = (this.pointDistance(ii,jj, Math.floor(this.parent.tempSizeTiles.x/2), Math.floor(this.parent.tempSizeTiles.y/2)) / maxDist);
					if(noise[noiseID] < 0.5){
						alphaacc = 0.1;//noise[noiseID];
						// tempTile.getContent().alpha = 0.1 + 1 - (this.pointDistance(ii,jj, this.parent.tempSizeTiles.x/2, this.parent.tempSizeTiles.y/2) / maxDist);//noise[noiseID];
					}
					
					tempTile.getContent().alpha = 0.5 + (1 - distance) - alphaacc;
				}

				// tempTile.getContent().cacheAsBitmap = true;
				tempContainer.addChild(tempTile.getContent());
			}
		}
		// var noise = new ClassicalNoise(Math);
  
		var nacum = 0;
		for (ii = this.parent.marginTiles.x; ii < this.parent.tempSizeTiles.x-this.parent.marginTiles.x; ii++) {
			for (jj = this.parent.marginTiles.y; jj < this.parent.tempSizeTiles.y-this.parent.marginTiles.y; jj++) {
				if(this.parent.currentNode.getNextFloat() < 0.2){
				// if(noise[(jj + Math.floor(ii * this.parent.tempSizeTiles.y))] < 0.5){
					tempTile = new SimpleSprite('_dist/img/grama1.png');
					tempTile.setPosition(ii * 80,jj * 80);
					tempTile.getContent().cacheAsBitmap = true;
					tempContainer.addChild(tempTile.getContent());
				}
			}
		}

		// var bgTexture = new PIXI.RenderTexture();
		// bgTexture.render(tempContainer);

		// var background = new PIXI.Sprite(bgTexture);
		// background.cacheAsBitmap = true;
		this.parent.bgContainer.addChild(tempContainer);

		this.parent.currentNode.bg = tempContainer;
		

		// tempContainer.cacheAsBitmap = true;

		// this.parent.getContent().addChildAt(background, 0);
		// this.parent.addChild(background);

		// this.parent.bgContainer.addChild(background);

		

		return tempContainer;

	},
	debugBounds:function(){
		if(this.parent.levelBoundsGraph && this.parent.levelBoundsGraph.parent){
			this.parent.levelBoundsGraph.parent.removeChild(this.parent.levelBoundsGraph);
		}
		this.parent.levelBoundsGraph = new PIXI.Graphics();
		this.parent.levelBoundsGraph.lineStyle(1,0xff0000);
		this.parent.levelBoundsGraph.drawRect(this.parent.mapPosition.x,this.parent.mapPosition.y,this.parent.levelBounds.x, this.parent.levelBounds.y);
		this.parent.addChild(this.parent.levelBoundsGraph);
	},
	createDoors:function(){
		if(this.parent.currentNode.childrenSides[0]){
			this.parent.doorLeft = new Door('left');
			this.parent.doorLeft.build();
			this.parent.doorLeft.setPosition(this.parent.mapPosition.x,this.parent.levelBounds.y/2 + this.parent.mapPosition.y);

			this.parent.doorLeft.node = this.parent.currentNode.childrenSides[0];
			this.parent.environmentLayer.addChild(this.parent.doorLeft);

		}
		if(this.parent.currentNode.childrenSides[1]){
			this.parent.doorRight = new Door('right');
			this.parent.doorRight.build();
			this.parent.doorRight.setPosition(this.parent.levelBounds.x + this.parent.mapPosition.x,this.parent.levelBounds.y/2  + this.parent.mapPosition.y);

			this.parent.doorRight.node = this.parent.currentNode.childrenSides[1];
			this.parent.environmentLayer.addChild(this.parent.doorRight);

		}
		if(this.parent.currentNode.childrenSides[2]){
			this.parent.doorUp = new Door('up');
			this.parent.doorUp.build();
			this.parent.doorUp.setPosition(this.parent.mapPosition.x + this.parent.levelBounds.x / 2,this.parent.mapPosition.y);

			this.parent.doorUp.node = this.parent.currentNode.childrenSides[2];
			this.parent.environmentLayer.addChild(this.parent.doorUp);

		}
		if(this.parent.currentNode.childrenSides[3]){
			this.parent.doorDown = new Door('down');
			this.parent.doorDown.build();
			this.parent.doorDown.setPosition(this.parent.mapPosition.x + this.parent.levelBounds.x / 2,this.parent.levelBounds.y + this.parent.mapPosition.y);

			this.parent.doorDown.node = this.parent.currentNode.childrenSides[3];
			this.parent.environmentLayer.addChild(this.parent.doorDown);

		}
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
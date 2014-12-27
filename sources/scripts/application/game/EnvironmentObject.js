/*jshint undef:false */
var EnvironmentObject = Entity.extend({
	init:function(envModel){
		this.envModel = envModel;
		this._super();
		this.updateable = true;
		this.collidable = true;
		this.arrayObstacles = Math.random() < 0.5?arrayThrees[0]:arrayRocks[0];
		this.srcImg =  this.arrayObstacles[Math.floor(Math.random() * this.arrayObstacles.length)];
		this.type = 'environment';
		this.width = APP.nTileSize / 1.8;
		this.height = APP.nTileSize / 2.5;
		this.debugGraphic = new PIXI.Graphics();
		this.debugGraphic.beginFill(0xFF3300);
		this.debugGraphic.lineStyle(1, 0xffd900, 1);
		this.debugGraphic.endFill();
		this.range = 0;
		this.seed = 0;
		this.currentMadness = APP.getMadness();
		this.state = 0;
		this.frames = this.envModel.frames;
		this.life = this.envModel.life;
		this.arrayFrames = this.getFramesByRange(this.envModel.sourceLabel, 0, this.frames-1);
	},
	preKill:function(){
		var self = this;
		if(Math.random() < 0.2){
			APP.getGame().addBag({x:self.getPosition().x, y:self.getPosition().y - 20}, APP.itemList[0]);
		}
		TweenLite.to(this.getContent(), 0.3, {delay:0.2, alpha:0});
		TweenLite.to(this.getContent().scale, 0.4, {x:0.85, y:0.85, ease:'easeInBack', onComplete:function(){
			self.kill = true;
		}});
	},
	getBounds: function(){
		this.bounds = {x: this.getPosition().x - this.width *this.sprite.anchor.x,
			y: this.getPosition().y - this.height *this.sprite.anchor.y,
			w: this.width,
			h: this.height};
		return this.bounds;
	},
	fireCollide: function(){
		if(this.life <= 0){
			return;
		}
		this.life --;
		// APP.updateMadness(0.01);
		APP.updateMadness(0.1);
		this.getContent().scale.x = 0.95;
		this.getContent().scale.y = 0.95;
		TweenLite.to(this.getContent().scale, 0.5, {x:1, y:1, ease:'easeOutElastic'});
		if(this.life <= 0){
			this.collidable = false;
			this.updateable = false;
			this.preKill();
		}
	},
	build: function(){
		// console.log('criou o Obstacle');
		this.sprite = new PIXI.Sprite.fromFrame(this.arrayFrames[0]);

		this.updateGraphic();
		// this.respaw();
		this.sprite.anchor.x = 0.5;
		this.sprite.anchor.y = 1;
		this.getContent().type = this.type;
	},
	updateGraphic: function(){
		var nextFrame =  Math.floor((this.currentMadness) / 2 * (this.frames - 1) );
		console.log((this.currentMadness) / 2, (this.frames - 1));

		if(this.currentFrame === nextFrame){
			return;
		}
		this.currentFrame = nextFrame;
		// console.log(this.currentFrame, nextFrame);
		this.sprite.setTexture(PIXI.Sprite.fromFrame(this.arrayFrames[this.currentFrame]).texture);
		this.getContent().scale.x = 0.95;
		this.getContent().scale.y = 0.95;
		TweenLite.to(this.getContent().scale, 0.5, {x:1, y:1, ease:'easeOutElastic'});
		// this.state = -1;
	},
	update: function(){
		
		this._super();

		if(this.currentMadness !== APP.getMadness()){
			this.currentMadness = APP.getMadness();
			var dist = pointDistance(this.currentMadness,0,1,0);
			// console.log((this.currentMadness +2) / 3 );
			if(dist > this.seed){
				this.updateGraphic();
			}
		}
	},
	getFramesByRange:function (label, init, end, type){
		var tempArray = [];
		var tempI = '';
		
		for (var i = init; i <= end; i++) {
			if(i < 10){
				tempI = '00' + i;
			}
			else if(i < 100){
				tempI = '0' + i;
			}
			else if(i < 1000){
				tempI =  i;
			}
			tempArray.push(label+tempI);
		}
		if(type === 'pingPong')
		{
			for (var j = end - 1; j > init; j--) {
				if(j < 10){
					tempI = '00' + j;
				}
				else if(j < 100){
					tempI = '0' + j;
				}
				else if(j < 1000){
					tempI =  j;
				}
				tempArray.push(label+tempI);
			}
		}

		return tempArray;
	}
});
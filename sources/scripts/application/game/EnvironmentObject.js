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
		// this.scale.x = 0.5;
		// this.scale.y = 0.5;
		this.range = 0;
		this.life = 3;
		this.seed = 0;
		this.currentMadness = APP.getMadness();
		this.state = 0;
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
		APP.updateMadness(0.9);
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
		this.sprite = new PIXI.Sprite.fromFrame('three10000');
		var self = this;
		// this.respaw();
		this.sprite.anchor.x = 0.5;
		this.sprite.anchor.y = 1;
		this.getContent().type = this.type;
		// this.sprite.scale.x = 0.5;
		// this.sprite.scale.y = 0.5;
	},
	updateGraphic: function(){
		if(this.state === -1){
			return;
		}
		
		this.getContent().tint = 0xFFFFFF;

		var self = this;
		// setTimeout(function(){
		if(self.state === -1){
			return;
		}
		this.sprite.parent.removeChild(this.sprite);
		// self.texture.destroy();
		// self.sprite.setTexture(PIXI.Texture.fromImage('_dist/img/flora/florest1/treeEvil.png'));// = new PIXI.Sprite(self.texture);
		this.sprite = new PIXI.Sprite.fromFrame('three10001');
		// self.sprite.setTexture(PIXI.Sprite.fromFrame('three10001'));// = new PIXI.Sprite(self.texture);


		// self.getContent().scale.x = 0.95;
		// self.getContent().scale.y = 0.95;
		// TweenLite.to(self.getContent().scale, 0.5, {x:1, y:1, ease:'easeOutElastic'});
		// self.state = -1;


		// },200);
		
		//this.sprite.anchor.x = 0.5;
		//this.sprite.anchor.y = 0.5;
	},
	update: function(){
		
		this._super();

		if(this.currentMadness !== APP.getMadness()){
			this.currentMadness = APP.getMadness();
			var dist = pointDistance(this.currentMadness,0,1,0);
			// console.log(this.seed, dist);
			if(dist > this.seed){
				this.updateGraphic();
			}
		}
		// if(this.debugGraphic.parent === null && this.getContent().parent !== null)
		// {
		//     this.getBounds();
		//     this.debugGraphic.drawRect(this.bounds.x, this.bounds.y,this.bounds.w, this.bounds.h);

		//     this.getContent().parent.addChild(this.debugGraphic);
		// }
	},
	respaw: function(){
		// var rndPos = {x:(windowWidth - 200) * Math.random() + 100,
		//     y:(windowHeight - 200) * Math.random() + 100};

		var rndPos = {x:Math.floor((12 * Math.random() * 142) /142) * 142 + 104,
			y:Math.floor((7 * Math.random() * 142) /142) * 142 + 177 + 142};

		if(this.pointDistance(rndPos.x, rndPos.y, windowWidth/2, windowHeight/2 ) < 200)
		{
			this.respaw();
		}

		this.setPosition( rndPos.x,rndPos.y) ;
		this.collidable = true;
	},
});
/*jshint undef:false */
var EnvironmentObject = Entity.extend({
	init:function(treeModel, seed){
		this.treeModel = treeModel;
		this._super();
		this.updateable = true;
		this.collidable = true;

		this.type = 'environment';
		this.width = APP.nTileSize / 1.8;
		this.height = APP.nTileSize / 2.5;
		this.debugGraphic = new PIXI.Graphics();
		this.debugGraphic.beginFill(0xFF3300);
		this.debugGraphic.lineStyle(1, 0xffd900, 1);
		this.debugGraphic.endFill();
		this.range = 0;
		this.seed = seed;
		this.stateModifier = seed.getNextFloat();
		this.arrayModfiers = [(1 - this.stateModifier)/2, this.stateModifier + (1 - this.stateModifier)/2];

		this.currentMadness = APP.getMadness();
		this.state = 1;


		this.lifeArray = this.treeModel.life;
		this.life = this.lifeArray[this.state];

		this.arrayFrames = [];
		this.arrayFrames.push(this.treeModel.happyTrees[Math.floor(this.treeModel.happyTrees.length * this.seed.getNextFloat())]);
		this.arrayFrames.push(this.treeModel.normalTrees[Math.floor(this.treeModel.normalTrees.length * this.seed.getNextFloat())]);
		this.arrayFrames.push(this.treeModel.madTrees[Math.floor(this.treeModel.madTrees.length * this.seed.getNextFloat())]);

		this.modifier = treeModel.modifier;
		this.frequencies = treeModel.frequencies;
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
		console.log(this.life);
		APP.updateMadness(this.modifier[this.state]);
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
		this.sprite = new PIXI.Sprite.fromFrame(this.arrayFrames[this.state]);

		this.updateGraphic();
		// this.respaw();
		this.sprite.anchor.x = 0.5;
		this.sprite.anchor.y = 1;
		this.getContent().type = this.type;
	},
	updateGraphic: function(){
		var tempState = 1;
		if(this.currentMadness/2 < this.arrayModfiers[0]){
			tempState = 0;
		}
		if(this.currentMadness/2 > this.arrayModfiers[1]){
			tempState = 2;
		}

		if(tempState === this.state){
			return;
		}
		this.state = tempState;
		this.life = this.lifeArray[this.state] - this.life;
		this.sprite.setTexture(PIXI.Sprite.fromFrame(this.arrayFrames[this.state]).texture);
		this.getContent().scale.x = 0.95;
		this.getContent().scale.y = 0.95;
		TweenLite.to(this.getContent().scale, 0.5, {x:1, y:1, ease:'easeOutElastic'});
	},
	update: function(){
		
		this._super();

		if(this.currentMadness !== APP.getMadness()){
			this.currentMadness = APP.getMadness();
			var dist = pointDistance(this.currentMadness,0,1,0);
			// console.log((this.currentMadness +2) / 3 );
			if(dist > this.stateModifier){
				this.updateGraphic();
			}
		}
	}
});
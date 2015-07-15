/*jshint undef:false */
var MapHUD = Class.extend({
	init:function(img){
		this.width = 100;
		this.height = 100;
		if(!img){
			this.background = new PIXI.Graphics();
			this.background.beginFill(displayColors.OCEAN);
			// this.background.beginFill(0);
			this.background.drawRect(0-15,0-15,this.width + 30,this.height + 30);
			this.background.endFill();
		}
		else if(typeof(img) === 'string')
		{
			this.texture = new PIXI.Texture.fromImage(img);
		}
		else{
			this.texture = img;
		}

		this.mask = new PIXI.Graphics();


		this.container = new PIXI.DisplayObjectContainer();
		this.mapContainer = new PIXI.DisplayObjectContainer();
		this.container.addChild(this.background);
		this.container.addChild(this.mapContainer);
		this.sizeTile = {x:3, y:3};

		this.rightBottom = new PIXI.Graphics();
		this.leftleft = new PIXI.Graphics();
		this.bottomLeft = new PIXI.Graphics();

		this.player = new PIXI.Graphics();
	},
	build:function(node){
		this.node = node;
		// console.log(APP.gen.rooms);
		// if(this.player.parent)
		// {
		// 	this.player.parent.removeChild(this.player);
		// }
		// if(this.rightBottom.parent)
		// {
		// 	this.rightBottom.parent.removeChild(this.rightBottom);
		// }
		// if(this.leftleft.parent)
		// {
		// 	this.leftleft.parent.removeChild(this.leftleft);
		// }
		// if(this.bottomLeft.parent)
		// {
		// 	this.bottomLeft.parent.removeChild(this.bottomLeft);
		// }
		// if(this.mask.parent)
		// {
		// 	this.mask.parent.removeChild(this.mask);
		// }
		// if(this.mapContainer.parent)
		// {
		// 	while(this.mapContainer.childs)
		// 	{
		// 		this.mapContainer.removeChildAt(0);
		// 	}
		// 	this.mapContainer.parent.removeChild(this.mapContainer);
		// 	this.mapContainer = new PIXI.DisplayObjectContainer();
		// 	this.container.addChild(this.mapContainer);
		// }
		// while(this.container.childs)
		// {
		// 	this.container.removeChildAt(0);
		// }

		var tempMapContainer = new PIXI.DisplayObjectContainer();
		var tempRect = null;
		// this.miniPlayer.beginFill(0xFF0000);
		// this.miniPlayer.drawRect(tileMiniSize,tileMiniSize,0,0);
		for (i = 0; i < node.mapDataLayer1.length; i++) {

			for (j = 0; j < node.mapDataLayer1[i].length; j++) {
				tempRect = new SimpleSprite('dist/img/pixel.jpg');
				tempRect.setPosition(i,j);
				tempMapContainer.addChild(tempRect.getContent());
				tempRect.getContent().tint = displayColors[node.mapDataLayer1[i][j].biome];
			}
		}

		tempMapContainer.scale.x = this.sizeTile.x;
		tempMapContainer.scale.y = this.sizeTile.y;
		this.mapContainer.addChild(tempMapContainer);
		tempMapContainer.cacheAsBitmap = true;


		this.mask.beginFill(0x000);
		this.mask.moveTo(this.width/1.8,0);
		// this.mask.lineTo(this.width/1.1,this.height * 0.2);
		var rightBottomEdge = {x:this.width + Math.random()*10 ,y:this.height/2.5 + Math.random()*10};

		this.mask.lineTo(rightBottomEdge.x,rightBottomEdge.y);

		var bottomEdge = {x:this.width/1.3 + Math.random()*10 ,y:this.height + Math.random()*10};
		this.mask.lineTo(bottomEdge.x,bottomEdge.y);


		var leftBottomEdge = {x:this.width/2.8 + Math.random()*10 ,y:this.height/1.1 + Math.random()*10};
		this.mask.lineTo(leftBottomEdge.x,leftBottomEdge.y);


		var leftLeftEdge = {x:-5 + Math.random()*10 ,y:this.height/1.8 + Math.random()*10};

		this.mask.lineTo(leftLeftEdge.x,leftLeftEdge.y);


		this.mask.lineTo(0,this.height/5);
		this.mask.lineTo(this.width/7,this.height/15);

		// this.mask.drawRect(0,0,this.width/2,this.height/2);
		this.mask.endFill();

		this.container.addChild(this.mask);
		this.mapContainer.mask = this.mask;
		this.background.mask = this.mask;


		var tempRbUnion = {x:bottomEdge.x +5,y:bottomEdge.y + 10};

		this.rightBottom = new PIXI.Graphics();
		this.rightBottom.beginFill(0x212144);
		this.rightBottom.moveTo(rightBottomEdge.x,rightBottomEdge.y);
		this.rightBottom.lineTo(bottomEdge.x,bottomEdge.y);
		this.rightBottom.lineTo(tempRbUnion.x,tempRbUnion.y);
		this.rightBottom.lineTo(rightBottomEdge.x,rightBottomEdge.y + 10);

		this.rightBottom.endFill();


		var tempBlUnion = {x:leftBottomEdge.x -5,y:leftBottomEdge.y + 10};
		this.bottomLeft = new PIXI.Graphics();
		this.bottomLeft.beginFill(0x31315B);
		this.bottomLeft.moveTo(bottomEdge.x,bottomEdge.y);
		this.bottomLeft.lineTo(leftBottomEdge.x,leftBottomEdge.y);
		this.bottomLeft.lineTo(tempBlUnion.x,tempBlUnion.y);
		this.bottomLeft.lineTo(tempRbUnion.x,tempRbUnion.y);

		this.bottomLeft.endFill();


		this.leftleft = new PIXI.Graphics();
		this.leftleft.beginFill(0x5C5C8E);
		this.leftleft.moveTo(leftBottomEdge.x,leftBottomEdge.y);
		this.leftleft.lineTo(leftLeftEdge.x,leftLeftEdge.y);
		this.leftleft.lineTo(leftLeftEdge.x + 5,leftLeftEdge.y + 10);
		this.leftleft.lineTo(tempBlUnion.x,tempBlUnion.y);

		this.leftleft.endFill();

		this.container.addChild(this.rightBottom);
		this.container.addChild(this.bottomLeft);
		this.container.addChild(this.leftleft);

		this.player = new PIXI.Graphics();
		this.player.beginFill(0x83FC35);

		this.player.moveTo(8,7);
		this.player.lineTo(-8,0);
		this.player.lineTo(8,-7);
		this.player.lineTo(6,0);

		this.player.endFill();
		this.container.addChild(this.player);
		this.player.position.x = this.width/2;
		this.player.position.y = this.height/2;
	},
	update:function(playerPos){
		// console.log(this.node.mapDataLayer1[playerPos.x][playerPos.y]);
		this.mouseAngle = Math.atan2( windowHeight/2 - APP.getMousePos().y,  windowWidth/2-APP.getMousePos().x);
		this.player.rotation = this.mouseAngle;
		this.mapContainer.position.x = -(playerPos.x * this.sizeTile.x) + this.width/2;// + (this.node.mapDataLayer1.length  * this.sizeTile.x) /2;
		this.mapContainer.position.y = -(playerPos.y * this.sizeTile.y) + this.height/2;// + (this.node.mapDataLayer1[0].length  * this.sizeTile.y) /2;

	},
	getContent:function(){
		return this.container;
	},
	setPosition:function(x,y){
		this.container.position.x = x;
		this.container.position.y = y;
	}
});

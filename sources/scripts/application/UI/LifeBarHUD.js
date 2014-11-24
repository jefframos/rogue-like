/*jshint undef:false */
var LifeBarHUD = Class.extend({
	init: function (width, height, maxValue, currentValue){

		this.maxValue = maxValue;
		this.text = 'default';
		this.currentValue = currentValue;
		this.container = new PIXI.DisplayObjectContainer();
		this.width = width;
		this.height = height;
		this.backShape = new PIXI.Graphics();

		this.rect = [[3,0],[92,18],[90,34],[0,18]];
		this.frontRect = [[3,0],[92,0],[92,34],[-5, 43]];

		var i = 0;
		this.backShape.beginFill(0xFF0B40);
		this.backShape.moveTo(this.rect[0][0],this.rect[0][1]);
		for (i = 1; i < this.rect.length; i++) {
			this.backShape.lineTo(this.rect[i][0],this.rect[i][1]);
		}
		this.backShape.endFill();
		this.container.addChild(this.backShape);

		this.frontShape = new PIXI.Graphics();
		this.frontShape.beginFill(0x83FC35);
		this.frontShape.moveTo(this.frontRect[0][0],this.frontRect[0][1]);
		for (i = 1; i < this.frontRect.length; i++) {
			this.frontShape.lineTo(this.frontRect[i][0],this.frontRect[i][1]);
		}
		this.frontShape.endFill();
		this.container.addChild(this.frontShape);

		this.mask = new PIXI.Graphics();
		this.mask.beginFill(0x800000);
		this.mask.moveTo(this.rect[0][0],this.rect[0][1]);
		for (i = 1; i < this.rect.length; i++) {
			this.mask.lineTo(this.rect[i][0],this.rect[i][1]);
		}
		this.mask.endFill();



		this.baseRect = [[0,18], [90,34], [95,41], [6,25]];
		this.baseFrontRect = [[0,18], [95,18], [95,41], [14,41]];

		this.backBaseShape = new PIXI.Graphics();
		this.backBaseShape.beginFill(0x961A1A);
		this.backBaseShape.moveTo(this.baseRect[0][0],this.baseRect[0][1]);
		for (i = 1; i < this.baseRect.length; i++) {
			this.backBaseShape.lineTo(this.baseRect[i][0],this.baseRect[i][1]);
		}
		this.backBaseShape.endFill();
		this.container.addChild(this.backBaseShape);


		this.backFrontShape = new PIXI.Graphics();
		this.backFrontShape.beginFill(0x30B730);
		this.backFrontShape.moveTo(this.baseFrontRect[0][0],this.baseFrontRect[0][1]);
		for (i = 1; i < this.baseFrontRect.length; i++) {
			this.backFrontShape.lineTo(this.baseFrontRect[i][0],this.baseFrontRect[i][1]);
		}
		this.backFrontShape.endFill();
		this.container.addChild(this.backFrontShape);

		this.backMask = new PIXI.Graphics();
		this.backMask.beginFill(0x0000FF);
		this.backMask.moveTo(this.baseRect[0][0],this.baseRect[0][1]);
		for (i = 1; i < this.baseRect.length; i++) {
			this.backMask.lineTo(this.baseRect[i][0],this.baseRect[i][1]);
		}
		this.backMask.endFill();

		this.container.addChild(this.mask);
		this.container.addChild(this.backMask);
		this.frontShape.mask = this.mask;
		this.backFrontShape.mask = this.backMask;

		// this.frontShape.scale.x = this.currentValue/this.maxValue;
	},
	setFrontColor: function(color){
		// if(this.frontShape){
		// 	this.container.removeChild(this.frontShape);
		// }
		// this.frontShape = new PIXI.Graphics();
		// this.frontShape.beginFill(color);
		// this.frontShape.drawRect(0,0,this.width, this.height);
		// this.container.addChild(this.frontShape);

	},
	setBackColor: function(color){
		// if(this.backShape){
		// 	this.container.removeChild(this.backShape);
		// }
		// this.backShape = new PIXI.Graphics();
		// this.backShape.beginFill(color);
		// // this.backShape.lineStyle(1,0xEEEEEE);
		// this.backShape.drawRect(0,0,this.width, this.height);
		// this.container.addChildAt(this.backShape,0);

	},
	setText: function(text){
		if(this.text !== text){
			if(!this.lifebar){
				this.lifebar = new PIXI.Text(text, {fill:'white', align:'center', font:'10px Arial'});
				// this.container.addChild(this.lifebar);
			}else
			{
				this.lifebar.setText(text);
			}
		}
	},
	updateBar: function(currentValue, maxValue){
		//if(this.currentValue !== currentValue || this.maxValue !== maxValue && currentValue >= 0){
		if(this.currentValue < 0){
			this.frontShape.position.x = this.frontShape.width;
			this.backFrontShape.position.x = this.backFrontShape.position.width;
			return;
		}
		this.currentValue = currentValue;
		this.maxValue = maxValue;

		this.frontShape.position.x = 91 * (1 - this.currentValue/this.maxValue);
		this.backFrontShape.position.x = 79 * (1 - this.currentValue/this.maxValue);

		//}
	},
	getContent: function(){
		return this.container;
	},
	setPosition: function(x,y){
		this.container.position.x = x;
		this.container.position.y = y;
	},
});
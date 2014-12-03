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

		// this.rect = [[3,0],[92,18],[90,34],[0,18]];
		this.rect = [[0,14],[102,0],[106,20],[4,34]];
		this.frontRect = [[-4,0],[102,0],[108,34],[2,34]];

		var i = 0;
		this.backShape.beginFill(0xFF0B40);
		this.backShape.moveTo(this.rect[0][0],this.rect[0][1]);
		for (i = 1; i < this.rect.length; i++) {
			this.backShape.lineTo(this.rect[i][0],this.rect[i][1]);
		}
		this.backShape.endFill();
		// this.backShape.scale.x = this.backShape.scale.y = 0.5;
		// this.backShape.cacheAsBitmap = true;
		this.container.addChild(this.backShape);

		this.frontShape = new PIXI.Graphics();
		this.frontShape.beginFill(0x83FC35);
		this.frontShape.moveTo(this.frontRect[0][0],this.frontRect[0][1]);
		for (i = 1; i < this.frontRect.length; i++) {
			this.frontShape.lineTo(this.frontRect[i][0],this.frontRect[i][1]);
		}
		this.frontShape.endFill();
		// this.frontShape.scale.x = this.frontShape.scale.y = 0.5;
		// this.frontShape.cacheAsBitmap = true;
		this.container.addChild(this.frontShape);

		this.mask = new PIXI.Graphics();
		this.mask.beginFill(0x800000);
		this.mask.moveTo(this.rect[0][0],this.rect[0][1]);
		for (i = 1; i < this.rect.length; i++) {
			this.mask.lineTo(this.rect[i][0],this.rect[i][1]);
		}
		this.mask.endFill();
		// this.mask.scale.x = this.mask.scale.y = 0.5;
		// this.mask.cacheAsBitmap = true;



		// this.baseRect = [[0,18], [90,34], [95,41], [6,25]];
		this.baseRect = [this.rect[3], this.rect[2], [this.rect[2][0] - 4,this.rect[2][1] + 10], [this.rect[3][0] - 4,this.rect[3][1] + 10]];
		this.baseFrontRect = [[9,20], [108,20], [100,44], [0,44]];

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
		console.log(this.currentValue/this.maxValue);
		this.frontShape.position.x = 105 * (1 - this.currentValue/this.maxValue);
		this.backFrontShape.position.x = 95 * (1 - this.currentValue/this.maxValue);

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
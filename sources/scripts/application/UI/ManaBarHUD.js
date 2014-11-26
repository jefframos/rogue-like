/*jshint undef:false */
var ManaBarHUD = Class.extend({
	init: function (width, height, maxValue, currentValue){

		this.maxValue = maxValue;
		this.text = 'default';
		this.currentValue = currentValue;
		this.container = new PIXI.DisplayObjectContainer();
		this.width = width;
		this.height = height;
		this.backShape = new PIXI.Graphics();

		this.rect = [[92,18],[168,-32],[178,-23],[103,28]];
		this.frontRect = [[92,-32],[168,-32],[240,34],[90,34]];

		// this.rect = [[92,18],[164,-32],[171,-23],[90,34]];
		// this.frontRect = [[92,-32],[164,-32],[211,34],[90,34]];

		var i = 0;
		this.backShape.beginFill(0xFF0B40);
		this.backShape.moveTo(this.rect[0][0],this.rect[0][1]);
		for (i = 1; i < this.rect.length; i++) {
			this.backShape.lineTo(this.rect[i][0],this.rect[i][1]);
		}
		this.backShape.endFill();
		this.container.addChild(this.backShape);


		this.frontShape = new PIXI.Graphics();
		this.frontShape.beginFill(0x89D5F4);
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



		this.baseRect = [this.rect[3],this.rect[2], [173,-12], [95,41]];
		this.baseFrontRect = [[90,-23],this.rect[2], [148,41], [90,41]];

		// this.baseRect = [[90,34],[171,-23], [171,-12], [95,41]];
		// this.baseFrontRect = [[90,-23],[171,-23], [171,41], [90,41]];

		this.backBaseShape = new PIXI.Graphics();
		this.backBaseShape.beginFill(0x961A1A);
		this.backBaseShape.moveTo(this.baseRect[0][0],this.baseRect[0][1]);
		for (i = 1; i < this.baseRect.length; i++) {
			this.backBaseShape.lineTo(this.baseRect[i][0],this.baseRect[i][1]);
		}
		this.backBaseShape.endFill();
		this.container.addChild(this.backBaseShape);


		this.backFrontShape = new PIXI.Graphics();
		this.backFrontShape.beginFill(0x217A89);
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

		this.supportShape = new PIXI.Graphics();
		this.supportShape.beginFill(0x216268);
		this.supportShape.moveTo(this.rect[0][0],this.rect[0][1]);
		this.supportShape.lineTo(this.baseRect[0][0],this.baseRect[0][1]);
		this.supportShape.lineTo(this.baseRect[3][0],this.baseRect[3][1]);
		this.supportShape.lineTo(this.rect[0][0],this.rect[0][1]);

		this.supportShape.endFill();
		this.container.addChild(this.supportShape);

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
		// console.log(this.currentValue, this.maxValue, 'mp');
		this.frontShape.position.x = 130 * (this.currentValue/this.maxValue) - 130;
		this.backFrontShape.position.x = 51 * (this.currentValue/this.maxValue) - 51;

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
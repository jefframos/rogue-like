/*jshint undef:false */
var BoxHUD1 = Class.extend({
	init: function (width, height){
		this.text = 'default';
		this.container = new PIXI.DisplayObjectContainer();
		this.width = width;
		this.height = height;
		this.backShape = new PIXI.Graphics();
		this.backShape.beginFill(0x000000);
		this.backShape.drawRect(0,0,width, height);
		this.container.addChild(this.backShape);

	},
	setColor: function(color){
		if(this.backShape){
			this.container.removeChild(this.backShape);
		}
		this.backShape = new PIXI.Graphics();
		this.backShape.beginFill(color);
		this.backShape.drawRect(0,0,this.width, this.height);
		this.container.addChild(this.backShape);

	},
	setText: function(text){
		if(this.text !== text){
			if(!this.label){
				this.label = new PIXI.Text(text, {fill:'white', align:'left', font:'bold 20px Arial'});
				this.container.addChild(this.label);
			}else
			{
				this.label.setText(text);
			}
		}
	},
	getContent: function(){
		return this.container;
	},
	setPosition: function(x,y){
		this.container.position.x = x;
		this.container.position.y = y;
	},
});
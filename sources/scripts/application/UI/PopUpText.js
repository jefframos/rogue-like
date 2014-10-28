/*jshint undef:false */
var PopUpText = Class.extend({
	init: function (color){
		this.color = color?color:'white';
		this.label = new PIXI.Text('', {fill:this.color, align:'center', font:'bold 20px Arial', stroke:'#000', strokeThickness: 2});
	},
	setText: function(text){
		this.label.setText(text);
	},
	getContent: function(){
		return this.label;
	},
	initMotion: function(yacum, time){
		var self = this;
		TweenLite.to(this.label.position, time,{y:this.label.position.y + yacum, onComplete:function(){
			self.label.parent.removeChild(self.label);
		}});
	},
	setPosition: function(x,y){
		this.label.position.x = x;
		this.label.position.y = y;
	},
});
/*jshint undef:false */
var EquipsHUD = Class.extend({
	init: function (position){
		
			// var self = this;
			// this.container.mouseover = function(mouseData){
			// 	self.showInfo();
			// 	self.overState();
			// };

			// this.container.mouseout = function(mouseData){
			// 	self.hideInfo();
			// 	self.outState();
			// };

			// this.container.mouseup = function(mouseData){
			// 	APP.getHUDController().upThisBox(self);
			// };

			// this.container.mousedown = function(mouseData){
			// 	APP.getHUDController().dragInventory(self);
			// };
		// }
	},
	getContent: function(){
		return this.container;
	},
	setPosition: function(x,y){
		this.container.position.x = x;
		this.container.position.y = y;
	},
});
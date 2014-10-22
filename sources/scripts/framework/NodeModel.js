/*jshint undef:false */
var NodeModel = Class.extend({
	init:function(){
		this.position = [];
		this.dist = 0;
		this.parentPosition = [];
		this.childrenSides = [null,null,null,null];
		this.parentId = -1;
		this.parent = null;
		this.active = false;
		this.mode = 0;
		this.id = -1;
	}
});
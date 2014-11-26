/*jshint undef:false */
var HUDController = Class.extend({
	init:function(container, stage){
		this.container = container;
		this.dragged = null;
		this.currentModel = null;
		this.stage = stage;
		var self = this;
		this.stage.stage.mouseup = function(mouseData){
			// console.log('mouseup', self);
			self.releaseInventory();
		};
	},
	releaseInventory:function(){
		if(this.dragged){
			var self = this;
			TweenLite.to(this.dragged.scale, 0.2 ,{x:0, y:0, ease:'easeInBack', onComplete:function(){
				if(self.dragged.parent){
					self.dragged.parent.removeChild(self.dragged);
				}
				self.dragged = null;
				self.currentBox = null;
			}});
		}
	},
	upThisBox:function(box){
		if(this.currentModel !== null){
			if(box.model !== null){
				this.currentBox.addModel(box.model);
			}else{
				this.currentBox.removeModel();
			}
			box.addModel(this.currentModel);
			this.currentModel = null;
			this.currentBox = null;
		}
	},
	dragInventory:function(box){
		if(this.currentBox !== null){
			this.currentBox = null;
		}
		if(this.dragged !== null){
			this.container.removeChild(this.dragged);
		}

		this.currentBox = box;
		this.currentModel = this.currentBox.model;
		
		if(!this.currentBox.infoImg){
			return;
		}
		var currentScale = 0.8;
		this.dragged = this.currentBox.infoImg.getContent();
		this.dragged.anchor.x = 0.5;
		this.dragged.anchor.y = 0.5;
		this.dragged.scale.x = this.dragged.scale.y = 0.0;
		TweenLite.to(this.dragged.scale, 0.4 ,{x:currentScale, y:currentScale, ease:'easeOutBack'});
		this.container.addChild(this.dragged);
	},
	update:function(img){
		if(this.dragged){
			this.dragged.position.x = APP.getMousePos().x;
			this.dragged.position.y = APP.getMousePos().y;
		}
	}
});
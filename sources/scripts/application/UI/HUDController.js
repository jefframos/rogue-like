/*jshint undef:false */
var HUDController = Class.extend({
	init:function(container, stage){
		this.container = container;
		this.dragged = null;
		this.currentModel = null;
		this.stage = stage;


		this.bagContent = new PIXI.DisplayObjectContainer();
        this.bagContentBackground = new SimpleSprite('_dist/img/HUD/bagContent.png');
        this.bagContent.addChild(this.bagContentBackground.getContent());
        this.bagContent.pivot.x = 35;
        this.bagContent.pivot.y = 59;
        this.bagContent.alpha = 0;
        this.bagContent.position.x = windowWidth / 2 + 30;
        this.bagContent.position.y = windowHeight / 2 - 25;
        this.bagContentImg = null;
        this.container.addChild(this.bagContent);
        this.currentBag = null;
        this.bagContent.setInteractive(true);
		var self = this;

		this.bagContent.mousedown = function(mouseData){
			if(self.currentBag){
				if(APP.getGame().addModelInventory(self.currentBag.model)){
					self.currentBag.model = null;
					self.removeBag();
				}else{
					console.log('inventory is full');
					var pop = new PopUpText('red');
		            pop.setText('inventory is full!');
		            APP.getEffectsContainer().addChild(pop.getContent());
		            pop.setPosition(self.currentBag.getPosition().x - 50, self.currentBag.getPosition().y-5 + Math.random() * 10);
		            pop.initMotion(-15 - (Math.random() * 10), 0.8);
				}
			}
		};

		this.stage.stage.mouseup = function(mouseData){
			self.releaseInventory();
		};
	},
	removeBag:function(){
		if(this.currentBag && this.currentBag.getContent().parent){
			this.currentBag.kill = true;
			this.currentModel = null;
			this.hideBagContent();
		}
	},
	hideBagContent:function(){
		this.bagContent.alpha = 0;
		this.currentBag = null;
	},
	showBagContent:function(bag){
		if(bag === this.currentBag){
			this.bagContent.alpha = 1;
			TweenLite.to(this.bagContent.scale, 0.4 ,{x:1, y:1});
			return;
		}
		if(this.bagContentImg && this.bagContentImg.getContent().parent)
		{
			this.bagContentImg.getContent().parent.removeChild(this.bagContentImg.getContent());
			this.bagContentImg = null;
		}
		this.currentBag = bag;
		this.bagContentImg = new SimpleSprite(bag.model.icoImg);
		this.bagContentImg.setPosition(13,10);
		this.bagContent.addChild(this.bagContentImg.getContent());
		this.bagContent.alpha = 1;
		// this.bagContent.scale.x = this.bagContent.scale.y = 0.2;
		TweenLite.to(this.bagContent.scale, 0.4 ,{x:1, y:1});
	},
	releaseInventory:function(){
		if(this.dragged){
			var self = this;
			TweenLite.to(this.dragged.scale, 0.2 ,{x:0, y:0, ease:'easeInBack', onComplete:function(){
				if(self.dragged && self.dragged.parent){
					self.dragged.parent.removeChild(self.dragged);
				}
				self.dragged = null;
				self.currentBox = null;
			}});
			if(APP.getMousePos().x < windowWidth){
				APP.getGame().addBag(APP.getMousePosMapRelative(), this.currentModel);
				if(self.currentBox !== null){
					self.currentBox.removeModel();
				}
				// console.log('larga no mapa', APP.getMousePosMapRelative());
			}
		}
	},
	upEquipBox:function(equipBox){
		console.log(this.currentModel);
		if(this.currentModel !== null){
			if(equipBox.type !== this.currentModel.type){
				return;
			}
			if(this.currentBox !== null && equipBox.model !== null){
				if(this.currentBox.model.type !== equipBox.type){
					return;
				}
				this.currentBox.addModel(equipBox.model);
			}else if(this.currentBox !== null){
				this.currentBox.removeModel();
			}
			equipBox.addModel(this.currentModel);
			APP.getGame().updatePlayerEquips();
			this.currentModel = null;
			this.currentBox = null;
		}
	},
	upThisBox:function(box){
		console.log('upThisBox',this.currentModel);
		// console.log(box.model, this.currentModel.type2,this.currentModel.type2 === 'currentEquip',this.currentBox.model.type !== box.model.type);
		if(box.model && this.currentModel.type2!== null && this.currentModel.type2 === 'currentEquip' && this.currentBox.model.type !== box.model.type){
			return;
		}
		if(this.currentModel !== null){
			if(this.currentBox !== null && box.model !== null){

				this.currentBox.addModel(box.model);
				if(box.model !== null && box.model.type2 === 'currentEquip'){
					APP.getGame().updatePlayerEquips();
				}
			}else if(this.currentBox !== null){
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
		var temps = new SimpleSprite(this.currentBox.model.icoImg);
		this.dragged = temps.getContent();// this.currentBox.infoImg.getContent();
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
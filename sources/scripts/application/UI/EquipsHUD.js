/*jshint undef:false */
var EquipsHUD = Class.extend({
	init: function (type){
		this.type = type;
		this.container = new PIXI.DisplayObjectContainer();
		var imgScr = '_dist/img/HUD/backWeapon.png';
		if(this.type === 'fairy'){
			imgScr = '_dist/img/HUD/backFairy.png';
		}
		else if(this.type === 'relic'){
			imgScr = '_dist/img/HUD/backSpec.png';
		}
		else if(this.type === 'armor'){
			imgScr = '_dist/img/HUD/backArmor.png';
		}
		this.background = new SimpleSprite(imgScr);
		this.container.addChild(this.background.getContent());
		// this.container.addChild(this.container);
		this.width = this.background.texture.width;
		this.height = this.background.texture.height;
		this.container.setInteractive(true);
		var self = this;
		this.container.mouseover = function(mouseData){
			// self.showInfo();
			// self.overState();
		};

		this.container.mouseout = function(mouseData){
			// self.hideInfo();
			// self.outState();
		};

		this.container.mouseup = function(mouseData){
			APP.getHUDController().upEquipBox(self);
		};

		this.container.mousedown = function(mouseData){
			APP.getHUDController().dragInventory(self);
		};
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
	overState: function(){
		this.backgroundOver.getContent().alpha = 1;
		// this.background.getContent().alpha = 0;
		// this.background.getContent().tint = 0xFFA506;
	},
	outState: function(){
		this.backgroundOver.getContent().alpha = 0;
		// this.background.getContent().alpha = 1;
		// this.background.getContent().filters = null;
		// this.background.getContent().filters = [];

	},
	removeModel: function(){
		if(this.img && this.img.getContent().parent){
			this.img.getContent().parent.removeChild(this.img.getContent());
		}

		if(this.infoImg && this.infoImg.getContent().parent){
			this.infoImg.getContent().parent.removeChild(this.infoImg.getContent());
		}
		if (this.quant && this.quant.getContent().parent){
			this.quant.getContent().parent.removeChild(this.quant.getContent());
		}
		if(this.quantLabel && this.quantLabel.parent){
			this.quantLabel.parent.removeChild(this.quantLabel);
		}
		if(this.infoLabel && this.infoLabel.parent){
			this.infoLabel.parent.removeChild(this.infoLabel);
		}
		this.model = null;
		this.quant = null;
		this.quantLabel = null;
		this.img = null;
		this.infoImg = null;
		this.infoLabel = null;
	},
	addModel: function(model){
		if(this.model !== null){
			this.removeModel();
		}
		this.model = model;
		// this.addImage(this.model.icoImg);

		if(this.infoSide !== 0){
			var text = '';
			if(model){
				// textTitle = model.label;
			}
			if(model instanceof WeaponModel && this.type === 'weapon')
			{
				text = 'PWR: +'+model.battlePower+ '\n' + 'MPW: +'+model.magicPower;
			}else if(model instanceof ArmorModel && this.type === 'armor')
			{
				text = 'DEF: +'+model.defenseArmor+ '\n' + 'MDF: +'+model.magicDefenseArmor;
			}else if(model instanceof RelicModel && this.type === 'relic')
			{
				text = 'STATUS: \n'+model.status;
			}
			else
			{
				return false;
			}
			if(model.icoImg){
				this.addImage(model.icoImg);
			}
		}
	},
	addImage: function(src){
		if(this.img && this.img.getContent().parent){
			this.img.getContent().parent.removeChild(this.img.getContent());
		}

		if(this.infoImg && this.infoImg.getContent().parent){
			this.infoImg.getContent().parent.removeChild(this.infoImg.getContent());
		}

		this.img = new SimpleSprite(src);
		this.infoImg = new SimpleSprite(src);
		this.container.addChild(this.img.getContent());
		this.img.getContent().scale.x = 0.0;
		this.img.getContent().scale.y = 0.0;
		this.img.getContent().anchor.x = 0.5;
		this.img.getContent().anchor.y = 0.5;
		TweenLite.to(this.img.getContent().scale, 0.4, {x: 0.8, y: 0.8, ease:'easeOutBack'});
		var posCorrection = {x:0, y:0};
		if(this.type === 'weapon'){
			posCorrection.x = 5;
			posCorrection.y = 5;
		}else if(this.type === 'armor'){
			posCorrection.x = -5;
		}else if(this.type === 'relic'){
			posCorrection.x = 5;
		}

		// console.log(this.background);
		this.img.setPosition((this.width / 2) + posCorrection.x,
		(this.height / 2) + posCorrection.y);
		// this.img.setPosition(40,30);
		if(this.infoContainer){
			this.infoContainer.addChild(this.infoImg.getContent());

			this.infoImg.getContent().scale.x = 0.6;
			this.infoImg.getContent().scale.y = 0.6;
			this.infoImg.setPosition(15 , 15);
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
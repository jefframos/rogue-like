/*jshint undef:false */
var PlayerHUD = Class.extend({
	init: function (type){
		this.type = type;
		this.container = new PIXI.DisplayObjectContainer();
		var imgScr = '_dist/img/HUD/backPlayerHUD.png';
		this.background = new SimpleSprite(imgScr);
		this.container.addChild(this.background.getContent());


		this.infoContainer = new PIXI.DisplayObjectContainer();
		this.backShapeInfo = new PIXI.Graphics();
		this.backShapeInfo.lineStyle(4, 0x39E239);
		this.backShapeInfo.beginFill(0x140B23);
		// this.backShapeInfo.beginFill(0xffffff);

		this.backShapeInfo.moveTo(2,20);
		this.backShapeInfo.lineTo(25,2);
		this.backShapeInfo.lineTo(140,0);

		this.backShapeInfo.lineTo(138,73);

		this.backShapeInfo.lineTo(185,90);

		this.backShapeInfo.lineTo(145,104);

		this.backShapeInfo.lineTo(143,174);

		this.backShapeInfo.lineTo(118,190);
		this.backShapeInfo.lineTo(20,175);
		this.backShapeInfo.lineTo(0,150);
		this.backShapeInfo.lineTo(2,20);
		this.infoContainer.addChild(this.backShapeInfo);
		this.infoContainer.pivot.x = 185;
		this.infoContainer.pivot.y = 90;
		this.infoContainer.position.x = -165 + this.infoContainer.pivot.x;
		this.infoContainer.position.y = this.infoContainer.pivot.y;
		this.infoContainer.alpha = 0;
		
		this.container.addChild(this.infoContainer);


		// this.container.addChild(this.container);
		this.width = this.background.texture.width;
		this.height = this.background.texture.height;
		this.container.setInteractive(true);
		var self = this;
		this.container.mouseover = function(mouseData){
			self.showInfo();
			self.overState();
		};

		this.container.mouseout = function(mouseData){
			self.hideInfo();
			self.outState();
		};

		this.container.mouseup = function(mouseData){
			APP.getHUDController().upEquipBox(self);
		};

		this.container.mousedown = function(mouseData){
			APP.getHUDController().dragInventory(self);
		};
	},
	overState: function(){
		// this.backgroundOver.getContent().alpha = 1;

		// this.background.getContent().alpha = 0;
		// this.background.getContent().tint = 0xFFA506;
	},
	outState: function(){
		// this.backgroundOver.getContent().alpha = 0;

		// this.background.getContent().alpha = 1;
		// this.background.getContent().filters = null;
		// this.background.getContent().filters = [];

	},
	showInfo: function(){
		if(this.model){
			// this.infoContainer.alpha = 1;
			this.infoContainer.scale.x = 0.5;
			this.infoContainer.scale.y = 0.5;
			TweenLite.to(this.infoContainer, 0.1, {alpha: 1 });
			TweenLite.to(this.infoContainer.scale, 0.2, {x: 1, y: 1, ease:'easeOutBack' });
		}
	},
	hideInfo: function(){
		if(this.model){
			// this.infoContainer.alpha = 0;
			TweenLite.to(this.infoContainer, 0.1, {alpha: 0 });
			TweenLite.to(this.infoContainer.scale, 0.3, {x: 0.5, y: 0.5, ease:'easeInBack'});
		}
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
	addModel: function(model, player){
		this.player = player;
		if(this.model !== null){
			this.removeModel();
		}
		this.model = model;
		// this.addImage(this.model.icoImg);
		var text = '';
		// if(model){
		textTitle = 'model.label';

		text = 'LEVEL: '+this.model.level+' '+this.model.playerClass+'\n'+
                'VIG: '+Math.floor(this.model.vigor)+'\n'+
                'SPD: '+Math.floor(this.model.speed)+'\n'+
                'STM: '+Math.floor(this.model.stamina)+'\n'+
                'MPW: '+Math.floor(this.model.magicPower)+' + '+this.player.weaponModel.magicPower+'\n'+
                'BPW: '+Math.floor(this.model.battlePower)+' + '+this.player.weaponModel.battlePower+'\n'+
                'ATT: '+Math.floor(this.model.attack)+'\n'+
                'DEF: '+Math.floor(this.model.defense)+' + '+this.player.armorModel.defenseArmor+'\n'+
                'MDF: '+Math.floor(this.model.magicDefense)+' + '+this.player.armorModel.magicDefenseArmor;

		// }
		// if(model instanceof WeaponModel && this.type === 'weapon')
		// {
		// 	text = 'PWR: +'+model.battlePower+ '\n' + 'MPW: +'+model.magicPower;
		// }else if(model instanceof ArmorModel && this.type === 'armor')
		// {
		// 	text = 'DEF: +'+model.defenseArmor+ '\n' + 'MDF: +'+model.magicDefenseArmor;
		// }else if(model instanceof RelicModel && this.type === 'relic')
		// {
		// 	text = 'STATUS: \n'+model.status;
		// }
		// else
		// {
		// 	return false;
		// }

		// if(!this.infoLabelTitle){
		// 	this.infoLabelTitle = new PIXI.Text(textTitle, {fill:'white', align:'center', font:'12px Arial', wordWrap:true, wordWrapWidth:60});
		// 	this.infoContainer.addChildAt(this.infoLabelTitle,1);
		// 	this.infoLabelTitle.position.y = 25;
		// 	this.infoLabelTitle.position.x = 44 - this.infoLabelTitle.width / 2;
		// }else
		// {
		// 	this.infoLabelTitle.setText(textTitle);
		// }

		if(!this.infoLabel){
			this.infoLabel = new PIXI.Text(text, {fill:'white', align:'left', font:'12px Arial'});
			this.infoContainer.addChildAt(this.infoLabel,1);
			this.infoLabel.position.y = 25;
			this.infoLabel.position.x = 25;
		}else
		{
			this.infoLabel.setText(text);
		}
		console.log(model.graphicsData);
		if(model.graphicsData.icoImg){
			this.addImage(model.graphicsData.icoImg);
		}
	},
	addImage: function(src){
		console.log(src);
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
		var posCorrection = {x:0, y:10};
		
		// console.log(this.background);
		this.img.setPosition((this.width / 2) + posCorrection.x,
		(this.height / 2) + posCorrection.y);
	},
	getContent: function(){
		return this.container;
	},
	setPosition: function(x,y){
		this.container.position.x = x;
		this.container.position.y = y;
	},
});
/*jshint undef:false */
var BoxHUD1 = Class.extend({
	init: function (width, height, infoSide, id){
		this.text = 'default';
		this.container = new PIXI.DisplayObjectContainer();
		this.infoSide = infoSide;

		this.width = width;
		this.height = height;
		this.background = new SimpleSprite('_dist/img/HUD/box.png');
		
		this.img = null;
		this.infoImg = null;
		
		this.container.hitArea = new PIXI.Rectangle(0,0,width, height);

		if(infoSide !== 0){
			this.infoContainer = new PIXI.DisplayObjectContainer();
			this.backShapeInfo = new PIXI.Graphics();
			this.backShapeInfo.beginFill(0x140B23);
			// this.backShapeInfo.beginFill(0xffffff);

			this.backShapeInfo.moveTo(10,2);
			this.backShapeInfo.lineTo(85,0);

			this.backShapeInfo.lineTo(84,70);
			this.backShapeInfo.lineTo(63,95);

			this.backShapeInfo.lineTo(0,84);
			this.backShapeInfo.lineTo(0,16);
			this.infoContainer.addChild(this.backShapeInfo);
			this.infoContainer.pivot.x = 85;
			this.infoContainer.pivot.y = 85;
			if(infoSide === 1){
				this.infoContainer.position.x = -this.backShapeInfo.width;
			}else if(infoSide === 2){
				this.infoContainer.position.x = this.backShapeInfo.width;
			}else if(infoSide === 3){
				this.infoContainer.position.y = -86 + this.infoContainer.pivot.y;
				this.infoContainer.position.x = -62 + this.infoContainer.pivot.x;
			}else if(infoSide === 4){
				this.infoContainer.position.y = this.backShapeInfo.height;
			}
			this.infoContainer.alpha = 0;

			if(id < 4){
				this.shortcut = new SimpleSprite('_dist/img/HUD/topBox.png');
				this.container.addChild(this.shortcut.getContent());
				this.shortcut.getContent().position.x = 7;
				this.shortcut.getContent().position.y = -14;
				this.setText(id + 1);
				this.setTextPos(20 , -13);
			}

			
			this.container.addChild(this.infoContainer);
			this.container.addChild(this.background.getContent());
			

			this.container.setInteractive(true);

			this.model = null;
			var self = this;
			this.container.mouseover = function(mouseData){
				self.showInfo();
			};

			this.container.mouseout = function(mouseData){
				self.hideInfo();
			};

			this.container.mousedown = function(mouseData){
				console.log('down');
				APP.getHUDController().dragInventory(self.infoImg.getContent());
			};
		}
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
	setTextPos: function(x,y){
		if(this.label){
			this.label.position.x = x;
			this.label.position.y = y;
		}
	},
	setQuantTextPos: function(x,y){
		if(this.quantLabel){
			this.quantLabel.position.x = x;
			this.quantLabel.position.y = y;
		}
	},
	addModel: function(model){
		this.model = model;
		this.addImage(this.model.icoImg);

		if(this.infoSide !== 0){
			var text = '';
			if(model){
				textTitle = model.label;
			}
			if(model instanceof WeaponModel)
			{
				text = 'PWR: +'+model.battlePower+ '\n' + 'MPW: +'+model.magicPower;
			}else if(model instanceof ArmorModel)
			{
				text = 'DEF: +'+model.defenseArmor+ '\n' + 'MDF: +'+model.magicDefenseArmor;
			}else if(model instanceof RelicModel)
			{
				text = 'STATUS: \n'+model.status;
			}else if(model instanceof SpellModel)
			{
				text = 'MPW: '+model.spellPower+ '\nMP: '+model.mp;
			}else if(model instanceof ItemModel)
			{
				var addicionalLabel = (model.baseValue !== 0)?('\n' + '+ '+model.baseValue):'';
				textTitle = model.label;
				text = model.effect + addicionalLabel;
				if(!this.quant){
					this.quant = new SimpleSprite('_dist/img/HUD/quantBox.png');
					this.container.addChild(this.quant.getContent());
					this.quant.getContent().position.x = -7;
					this.quant.getContent().position.y = 24;
					this.setQuantText('2');
					this.setQuantTextPos(-3 , 26);
				}
			}


			if(!this.infoLabelTitle){
				this.infoLabelTitle = new PIXI.Text(textTitle, {fill:'white', align:'left', font:'10px Arial', wordWrap:true, wordWrapWidth:20});
				this.infoContainer.addChildAt(this.infoLabelTitle,1);
				this.infoLabelTitle.position.y = 15;
				this.infoLabelTitle.position.x = 40;
			}else
			{
				this.infoLabelTitle.setText(textTitle);
			}

			if(!this.infoLabel){
				this.infoLabel = new PIXI.Text(text, {fill:'white', align:'left', font:'12px Arial'});
				this.infoContainer.addChildAt(this.infoLabel,1);
				this.infoLabel.position.y = 45;
				this.infoLabel.position.x = 15;
			}else
			{
				this.infoLabel.setText(text);
			}
			if(model.icoImg){
				this.addImage(model.icoImg);
			}
		}
	},
	setQuantText: function(text){
		if(this.quantText !== text){
			if(!this.quantLabel){
				this.quantLabel = new PIXI.Text(text, {fill:'black', align:'left', font:'12px Arial'});
				this.container.addChild(this.quantLabel);
			}else
			{
				this.quantLabel.setText(text);
			}
		}
	},
	setText: function(text){
		if(this.text !== text){
			if(!this.label){
				this.label = new PIXI.Text(text, {fill:'black', align:'left', font:'14px Arial'});
				this.container.addChild(this.label);
			}else
			{
				this.label.setText(text);
			}
		}
	},
	update: function(){
		if(this.img && this.img.parent){
			this.img.setPosition(this.width / 2 - this.img.getContent().width / 2, this.height / 2 -  this.img.getContent().height / 2);
		}
	},
	addImage: function(src){
		if(this.img && this.img.parent){
			this.img.parent.removeChild(this.img.getContent());
		}

		if(this.infoImg && this.infoImg.parent){
			this.infoImg.parent.removeChild(this.infoImg.getContent());
		}

		this.img = new SimpleSprite(src);
		this.infoImg = new SimpleSprite(src);
		this.container.addChild(this.img.getContent());
		this.img.getContent().scale.x = 0.8;
		this.img.getContent().scale.y = 0.8;
		var posCorrection = (30 / 2) * 0.8;
		this.img.setPosition(this.width / 2 -posCorrection , this.height / 2 - posCorrection);

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
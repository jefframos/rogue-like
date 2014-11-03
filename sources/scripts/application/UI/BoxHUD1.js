/*jshint undef:false */
var BoxHUD1 = Class.extend({
	init: function (width, height, infoSide){
		this.text = 'default';
		this.container = new PIXI.DisplayObjectContainer();
		this.infoSide = infoSide;

		this.width = width;
		this.height = height;
		this.backShape = new PIXI.Graphics();
		this.backShape.beginFill(0x000000);
		this.backShape.drawRect(0,0,width, height);
		this.container.addChild(this.backShape);
		this.container.hitArea = new PIXI.Rectangle(0,0,width, height);

		if(infoSide !== 0){
			this.infoContainer = new PIXI.DisplayObjectContainer();
			this.backShapeInfo = new PIXI.Graphics();
			this.backShapeInfo.beginFill(0x000000);

			this.backShapeInfo.drawRect(0,0,width, height);

			this.infoContainer.addChild(this.backShapeInfo);
			if(infoSide === 1){
				this.infoContainer.position.x = -width;
			}else if(infoSide === 2){
				this.infoContainer.position.x = width;
			}else if(infoSide === 3){
				this.infoContainer.position.y = -height;
			}else if(infoSide === 4){
				this.infoContainer.position.y = height;
			}
			this.infoContainer.alpha = 0;
			this.container.addChild(this.infoContainer);
			

			this.container.setInteractive(true);

			this.model = null;
			var self = this;
			this.container.mouseover = function(mouseData){
				self.showInfo();
				console.log('over');
			};

			this.container.mouseout = function(mouseData){
				self.hideInfo();
			};

		}
	},
	showInfo: function(){
		this.infoContainer.alpha = 1;
	},
	hideInfo: function(){
		this.infoContainer.alpha = 0;
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
	addModel: function(model){
		this.model = model;
		this.addImage(this.model.icoImg);

		if(this.infoSide !== 0){
			var text = '';
			if(model instanceof WeaponModel)
			{
				text = 'Weapon' + '\n'+model.label + '\n' + 'pwr: +'+model.battlePower;
			}else if(model instanceof ArmorModel)
			{
				text = 'Armor' + '\n'+model.label + '\n' + 'def: +'+model.defenseArmor+ '\n' + 'mag def: +'+model.magicDefenseArmor;
			}else if(model instanceof RelicModel)
			{
				text = 'Relic' + '\n'+model.label + '\n' + 'status: '+model.status;
			}else if(model instanceof ItemModel)
			{
				var addicionalLabel = (model.baseValue !== 0)?('\n' + '+ '+model.baseValue):'';
				text = model.label + '\n' + model.effect + addicionalLabel;
			}else if(model instanceof SpellModel)
			{
				text = model.label + '\n' + 'mag pow: '+model.spellPower+ '\nMP: '+model.mp;
			}

			if(!this.infoLabel){
				this.infoLabel = new PIXI.Text(text, {fill:'white', align:'left', font:'14px Arial'});
				this.infoContainer.addChildAt(this.infoLabel,1);
			}else
			{
				this.infoLabel.setText(text);
			}
		}
	},
	setText: function(text){
		if(this.text !== text){
			if(!this.label){
				this.label = new PIXI.Text(text, {fill:'white', align:'left', font:'14px Arial'});
				this.container.addChildAt(this.label,1);
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
			this.img.parent.removeChild(this.img);
		}
		this.img = new SimpleSprite(src);
		this.container.addChild(this.img.getContent());
		this.img.setPosition(this.width / 2 - 30 / 2, this.height / 2 - 30 / 2);
	},
	getContent: function(){
		return this.container;
	},
	setPosition: function(x,y){
		this.container.position.x = x;
		this.container.position.y = y;
	},
});
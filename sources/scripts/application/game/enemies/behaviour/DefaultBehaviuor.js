/*jshint undef:false */
var DefaultBehaviour = Class.extend({
	init: function (entity, player){
		this.player = player;
		this.entity = entity;
		this.fireFreq = entity.monsterModel.fire.fireFreq / 2;
		this.maxFireFreq = entity.monsterModel.fire.fireFreq;
		this.fireAcum = 0;
		this.walkAccum = 0;
		this.fireTimeLive = 50;
		this.velocity = entity.defaultVelocity;
		this.maxWalkAccum = this.velocity * 5;
		this.fireSpeed = this.velocity * 1.5;
		this.maxChilds = 5;
		this.bornChildAccum = 100;
		if(entity.monsterModel.config.spawner){
			this.childModel = APP.getMonsterByName(entity.monsterModel.config.spawner);
		}
	},
	update: function(){
		if(this.childModel && this.maxChilds > 0){
			this.bornChildAccum --;
			if(this.bornChildAccum < 0){
				this.bornChildAccum = 100;
				this.maxChilds --;
				var tempMonster = null;
				if(this.childModel.sourceLabel === 'STATIC'){
					tempMonster = new StaticEnemy(this.player, this.childModel.clone());
				}else{
					tempMonster = new Enemy(this.player,this.childModel.clone());
				}
				tempMonster.build();
				tempMonster.setPosition(this.entity.getPosition().x, this.entity.getPosition().y);
				this.entity.layer.addChild(tempMonster);
			}
		}
		this.walkAccum --;
		if(this.walkAccum < 0){
			this.entity.setVelocity(Math.sin((Math.random()* 360) / 180 * Math.PI) * this.velocity * 0.8,Math.cos((Math.random()* 360) / 180 * Math.PI) * this.velocity * 0.8);
			this.walkAccum = this.maxWalkAccum;
			// console.log(this.entity.velocity);
		}
		this.fireFreq --;
		if(this.fireFreq < 0 && pointDistance(this.entity.getPosition().x, this.entity.getPosition().y, this.player.getPosition().x, this.player.getPosition().y) < (this.fireTimeLive * this.fireSpeed * 2))
		{
			// console.log(pointDistance(this.entity.getPosition().x, this.entity.getPosition().y, this.player.getPosition().x, this.player.getPosition().y));
			this.shoot();
			this.fireFreq = this.maxFireFreq;
		}
	},
	shoot: function(){
		var self = this;
		var angle = Math.atan2( this.entity.getPosition().y + this.entity.centerPosition.y - this.player.getPosition().y,
			this.entity.getPosition().x + this.entity.centerPosition.x - this.player.getPosition().x);
		angle = angle * 180 / Math.PI * -1;
		angle += 90 + 180;
		angle = angle / 180 * Math.PI;
		var monsterModel = this.entity.monsterModel;
		var numFires = monsterModel.fire.quant;
		var tempFireSpeed = monsterModel.fire.speed;
		var pair = 1;
		var odd = 1;
		var tempAcc = 0;
		var tempAngle = angle;
		var angleAcc = monsterModel.fire.mode === 'arround'?360 :90;
                
		for (var i = 0; i < numFires; i++) {
			if(i > 0){
				if(i % 2 === 0){
					tempAcc = pair;
					pair ++;
				}else
				{
					tempAcc = -odd;
					odd ++;
				}
				// tempAngle = angle + tempAcc * 10 * Math.PI / 180;
				tempAngle = angle + tempAcc * (angleAcc / numFires) * Math.PI / 180;

			}
			var tempFire = new Fire({x:tempFireSpeed * Math.sin(tempAngle), y: tempFireSpeed * Math.cos(tempAngle)});
			tempFire.timeLive = monsterModel.fire.lifeTime;
			tempFire.power = monsterModel.getDemage(monsterModel.attackType);
			if(monsterModel.fire.srcImg){
				tempFire.imgSource = monsterModel.fire.srcImg;
			}
			// console.log('tempFire.power', tempFire.power);
			tempFire.build();
			tempFire.target = 'player';
			tempFire.setPosition(this.entity.getPosition().x + this.entity.centerPosition.x, this.entity.getPosition().y + this.entity.centerPosition.y);
			this.entity.layer.addChild(tempFire);
			tempFire.getContent().rotation = -tempAngle + (180 * Math.PI / 180);
		}
	}
});
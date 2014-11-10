/*jshint undef:false */
var DefaultBehaviour = Class.extend({
	init: function (entity, player){
		this.player = player;
		this.entity = entity;
		this.fireFreq = entity.fireFreq / 2;
		this.maxFireFreq = entity.fireFreq;
		this.fireAcum = 0;
		this.walkAccum = 0;
		this.fireTimeLive = 50;
		this.velocity = entity.defaultVelocity;
		this.maxWalkAccum = this.velocity * 5;
		this.fireSpeed = this.velocity * 1.5;
	},
	update: function(){
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

		var numFires = 1;
		var tempFireSpeed = this.fireSpeed;
		var pair = 1;
		var odd = 1;
		var tempAcc = 0;
		var tempAngle = angle;
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
				tempAngle = angle + tempAcc * 10 * Math.PI / 180;

			}
			var tempFire = new Fire({x:tempFireSpeed * Math.sin(tempAngle), y: tempFireSpeed * Math.cos(tempAngle)});
			tempFire.timeLive = this.fireTimeLive;
			tempFire.power = this.entity.monsterModel.getDemage(this.entity.monsterModel.attackType);
			// console.log('tempFire.power', tempFire.power);
			tempFire.build();
			tempFire.target = 'player';
			tempFire.setPosition(this.entity.getPosition().x + 40, this.entity.getPosition().y +10);
			this.entity.layer.addChild(tempFire);
		}
	}
});
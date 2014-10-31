/*jshint undef:false */
var DefaultBehaviour = Class.extend({
	init: function (entity, player){
		this.player = player;
		this.entity = entity;
		this.life = 8;
		this.entity.setVelocity(-2,(Math.random()-0.5)*3);
		this.sideAcum = 0;
		this.sideMaxAcum = 200;
		this.fireFreq = 25 + Math.random() * 30;
		this.maxFireFreq = 100;
		this.fireAcum = 0;
		this.fireSpeed = 6;
	},
	update: function(){

		this.fireFreq --;
		if(this.fireFreq < 0)
		{
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
		var tempFireSpeed = 5;
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
			tempFire.timeLive = 50;
			tempFire.power = this.entity.monsterModel.getDemage('physical');
			// console.log('tempFire.power', tempFire.power);
			tempFire.build();
			tempFire.target = 'player';
			tempFire.setPosition(this.entity.getPosition().x + 40, this.entity.getPosition().y +10);
			this.entity.layer.addChild(tempFire);
		}
	}
});
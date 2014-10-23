/*jshint undef:false */
var MonsterModel = Class.extend({
	init: function (){
		this.velocity = 4;
		this.fireFreq = 5;
		this.life = 20;
		this.level = 1;
		this.magicPower = 20;
		this.spellPower = 2;
        this.battlePower = 2;
		this.defense = 20;
		this.critialChance = 0.0;
		this.speedStatus = 'normal';
		this.vigor = parseInt(Math.random() * 7) + 53;
        this.vigor2 = this.vigor*2;
        this.xp = 100;
        if(this.vigor >= 128){
            this.vigor2 = 255;
        }
		this.attack = this.battlePower + this.vigor2;
        this.speed = 10;
	},
	getDemage: function(type){
		var damageMultiplier = Math.random() < this.critialChance ? 0.5 : 2;
		var demage = 0;
		if(type === 'physical'){
			demage = this.battlePower + ((this.level * this.level * this.attack) / 256) * 3 / 2;
		}else if(type === 'magical'){
			demage = this.spellPower * 4 + (this.level * (this.magicPower * 3/2) * this.spellPower / 32);
		}
		demage = demage + ((demage / 2) * damageMultiplier);

		return demage;
	},
	getHurt: function(demage, type){
		console.log('getHurt1',demage);

		if(type === 'physical'){
			demage = (demage * (255 - this.defense) / 256) + 1;
		}else if(type === 'magical'){
			demage = (demage * (255 - this.magicDefense) / 256) + 1;
		}

		console.log('getHurt2',demage);

		return demage;
	},
	getSpeed: function(){
		if(type === 'normal'){
			currentSpeed = (96 * (this.speed + 20)) / 16;//normal
		}else if(type === 'haste'){
			currentSpeed = (126 * (this.speed + 20)) / 16;//haste
		}else if(type === 'slow'){
			currentSpeed = (48 * (this.speed + 20)) / 16; //slow
		}
		return currentSpeed;
	}
});
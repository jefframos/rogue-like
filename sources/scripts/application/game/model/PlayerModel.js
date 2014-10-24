/*jshint undef:false */
var PlayerModel = Class.extend({
	init: function (playerClass){
		this.velocity = 4;
		this.fireFreq = 10;

		if(!playerClass){
			this.playerClass = 'warrior';
		}else{
			this.playerClass = playerClass;
		}

		this.level = 1;

		if(this.playerClass === 'warrior'){
			this.vigor = 40;
	        this.speed = 28;
	        this.stamina = 33;
			this.magicPower = 25;
	        this.battlePower = 25;
			this.defense = 48;
			this.magicDefense = 20;
			this.baseHPModifier = 1.32;
			this.baseHP = this.level* (20 / this.baseHPModifier);
			//modifiers
			this.vigorModifier = 0.007;
	        this.speedModifier = 0.004;
	        this.staminaModifier = 0.007;
			this.magicPowerModifier = 0.003;
	        this.battlePowerModifier = 0.006;
			this.defenseModifier = 0.006;
			this.magicDefenseModifier = 0.003;

		}else if(this.playerClass === 'mage'){
			this.vigor = 31;
	        this.speed = 33;
	        this.stamina = 28;
			this.magicPower = 39;
	        this.battlePower = 12;
			this.defense = 42;
			this.magicDefense = 33;
			this.baseHPModifier = 1.32;
			this.baseHP = this.level* (20 / this.baseHPModifier);

			this.vigorModifier = 0.005;
	        this.speedModifier = 0.004;
	        this.staminaModifier = 0.005;
			this.magicPowerModifier = 0.007;
	        this.battlePowerModifier = 0.003;
			this.defenseModifier = 0.005;
			this.magicDefenseModifier = 0.007;
		}
		else if(this.playerClass === 'thief'){
			this.vigor = 37;
	        this.speed = 40;
	        this.stamina = 31;
			this.magicPower = 28;
	        this.battlePower = 14;
			this.defense = 46;
			this.magicDefense = 23;
			this.baseHPModifier = 1.32;
			this.baseHP = this.level* (20 / this.baseHPModifier);

			this.vigorModifier = 0.004;
	        this.speedModifier = 0.007;
	        this.staminaModifier = 0.007;
			this.magicPowerModifier = 0.004;
	        this.battlePowerModifier = 0.006;
			this.defenseModifier = 0.004;
			this.magicDefenseModifier = 0.004;
		}

		//modifiers >
		//'warrior'
		


		// for (var i = 0; i < 99; i++) {
		// 	console.log(i* (20 / this.baseHPModifier));
		// 	this.baseHPModifier -= 0.0085;
		// }

		this.spellPower = 20; //speel do bolt
		this.life = (this.baseHP*(this.stamina + 32))/32;


		this.critialChance = 0.0;
		this.speedStatus = 'normal';
        this.vigor2 = this.vigor*2;
        if(this.vigor >= 128){
            this.vigor2 = 255;
        }
		this.attack = this.battlePower + this.vigor2;
		this.xp = 0;
	},
	log: function(){
		console.log();
		console.log('stats');
		console.log('level',Math.floor(this.level));
		console.log('life',Math.floor(this.life));
		console.log('vigor',Math.floor(this.vigor));
		console.log('speed',Math.floor(this.speed));
		console.log('stamina',Math.floor(this.stamina));
		console.log('magicPower',Math.floor(this.magicPower));
		console.log('battlePower',Math.floor(this.battlePower));
		console.log('defense',Math.floor(this.defense));
		console.log('attack',Math.floor(this.attack));
		console.log('magicDefense',Math.floor(this.magicDefense));
	},
	levelUp: function(){
		this.level ++;
		
		this.vigor += (this.vigor*this.vigor+this.vigor+3)/4*this.vigorModifier;
        this.speed += (this.speed*this.speed+this.speed+3)/4*this.speedModifier;
        this.stamina += (this.stamina*this.stamina+this.stamina+3)/4*this.staminaModifier;
		this.magicPower += (this.magicPower*this.magicPower+this.magicPower+3)/4*this.magicPowerModifier;
        this.battlePower += (this.battlePower*this.battlePower+this.battlePower+3)/4*this.battlePowerModifier;
		this.defense += (this.defense*this.defense+this.defense+3)/4*this.defenseModifier;
		// this.attack += (this.attack*this.attack+this.attack+3)/4*this.attackModifier;
		this.magicDefense += (this.magicDefense*this.magicDefense+this.magicDefense+3)/4*this.magicDefenseModifier;
		this.vigor2 = this.vigor*2;
        if(this.vigor >= 128){
            this.vigor2 = 255;
        }
		this.attack = this.battlePower + this.vigor2;

		this.baseHPModifier -= 0.0085;
		this.baseHP = this.level* (20 / this.baseHPModifier);
		this.life += (this.baseHP*(this.stamina+32))/32;
	},
	updateLevel: function(){
		// console.log((this.level*this.level+this.level+3)/4, 'compare');

		if(this.xp > (this.level*this.level+this.level+3)/4* 100){
			this.levelUp();
		}
		console.log(this.level,'<- level, xp ->',this.xp);
	},
	updateXp: function(xp){
		console.log('xp', xp);
		this.xp += xp;
		this.updateLevel();
	},
	getDemage: function(type){
		var damageMultiplier = Math.random() < this.critialChance ? 0.5 : 2;
		var demage = 0;
		if(type === 'physical'){
			demage = this.battlePower + ((this.level * this.level * this.attack) / 256) * 3 / 2;
		}else if(type === 'magical'){
			demage = this.spellPower * 4 + (this.level * this.magicPower * this.spellPower / 32);
		}

		demage = demage + ((demage / 2) * damageMultiplier);

		return demage;
	},
	getHurt: function(demage, type){
		if(type === 'physical'){
			demage = (demage * (255 - this.defense) / 256) + 1;
		}else if(type === 'magical'){
			demage = (demage * (255 - this.magicDefense) / 256) + 1;
		}

		return demage;
	},
	getSpeed: function(type){
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




// SpellMPSpell PowerDescription
// Bio 26 53 Poison-elemental attack
// Bolt 6 20 Lightning-elemental attack
// Bolt 22 26 1Lightning-elemental attack
// Bolt 3 53 120 Lightning-elemental attack
// Demi 33 8 Cuts an enemys HP in half
// Drain 15 38 Drains HP from an enemy
// Fire 4 21 Fire-elemental attack
// Fire 2 20 60 Fire-elemental attack
// Fire 3 51 121 Fire-elemental attack
// Flare 45 60 Barrier-piercing attack
// Ice 5 22 Ice-elemental attack
// Ice 2 21 62 Ice-elemental attack
// Ice 3 52 122 Ice-elemental attack
// Merton 85 138 Unfocused piercing fire attack
// Meteor 62 36 Damages multiple enemies
// Pearl 40 108 Pearl-elemental attack
// Poison 3 25 Poisons an enemy
// Quake 50 111 Unfocused Earth-elemental attack
// Quartr 48 12 Cuts an enemys HP by 3/4
// Ultima 80 150 Damages multiple enemies
// W Wind 75 15 Unfocused near-fatal attack

// X-Zone530Sends an enemy into the X-Zone
// Bserk160Casts Berserk on target
// Dispel250Maintains poor status
// Float170Makes target float
// Haste100Raises battle speed
// Haste2380Speeds up entire party
// Imp100Changes to/from "Imp"
// Muddle80Confuses target
// Mute80Silences target
// Osmose126Absorbs MP from an enemy
// Quick990Allows double commands
// Rasp1210Damages MP
// Rflect220Casts a magic barrier on target
// Safe120Raises defense
// Scan30Displays an enemy's HP/weak point
// Shell150Raises magic defense
// Sleep50Puts target to sleep
// Slow50Slows battle speed
// Slow 2260Slows multiple enemies
// Stop100Stops an enemy
// Vanish180Renders target invisible
// Warp200Escape from dungeons/battles
// Antdot30Cures poisoning
// Cure510Recovers HP
// Cure 22528Recovers HP
// Cure 34066Recovers HP
// Life302Recovers life
// Life 26016Restores life and HP/MP
// Life 3500Protects from wound
// Regen100Gradually recovers HP
// Remedy150Cures status ailments
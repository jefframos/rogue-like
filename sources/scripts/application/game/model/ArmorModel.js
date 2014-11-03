/*jshint undef:false */
var ArmorModel = Class.extend({
	init: function (name,defenseArmor,magicDefenseArmor,price, icoImg){
		this.name = name;
		this.label = name;
		this.defenseArmor = defenseArmor;
		this.magicDefenseArmor = magicDefenseArmor;
		this.price = price;
		this.icoImg = icoImg;
	}
});
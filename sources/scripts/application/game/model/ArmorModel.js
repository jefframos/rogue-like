/*jshint undef:false */
var ArmorModel = Class.extend({
	init: function (name,defenseArmor,magicDefenseArmor,price, srcImg){
		this.name = name;
		this.defenseArmor = defenseArmor;
		this.magicDefenseArmor = magicDefenseArmor;
		this.price = price;
		this.srcImg = srcImg;
	}
});
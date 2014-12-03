/*jshint undef:false */
var WeaponModel = Class.extend({
	init: function (name,battlePower,magicPower,hitRate,price,icoImg,srcImg){
		this.name = name;
		this.label = name;
		this.battlePower = battlePower;
		this.magicPower = magicPower;
		this.hitRate = hitRate;
		this.price = price;
		this.srcImg = srcImg;
		this.icoImg = icoImg;
		this.type = 'weapon';
	}
});
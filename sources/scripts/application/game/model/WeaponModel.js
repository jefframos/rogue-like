/*jshint undef:false */
var WeaponModel = Class.extend({
	init: function (name,battlePower,hitRate,price){
		this.name = name;
		this.battlePower = battlePower;
		this.hitRate = hitRate;
		this.price = price;
	}
});
/*jshint undef:false */
var ItemModel = Class.extend({
	init: function (name,effect,baseValue,price){
		this.name = name;
		this.effect = effect;
		this.baseValue = baseValue;
		this.price = price;
	}
});
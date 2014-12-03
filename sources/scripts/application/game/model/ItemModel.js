/*jshint undef:false */
var ItemModel = Class.extend({
	init: function (name,effect,baseValue,price,icoImg){
		this.name = name;
		this.label = name;
		this.effect = effect;
		this.baseValue = baseValue;
		this.price = price;
		this.icoImg = icoImg;
		this.quant = 2;
		this.type = 'item';

	}
});
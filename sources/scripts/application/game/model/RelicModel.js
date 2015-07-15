/*jshint undef:false */
var RelicModel = Class.extend({
	init: function (name,status,baseValue,price,icoImg){
		this.name = name;
		this.label = name;
		this.status = status;
		this.baseValue = baseValue;
		this.price = price;
		this.icoImg = icoImg;
		this.type = 'relic';
		this.type2 = 'equip';
	}
});
/*jshint undef:false */
var RelicModel = Class.extend({
	init: function (name,status,baseValue,price,srcImg){
		this.name = name;
		this.status = status;
		this.baseValue = baseValue;
		this.price = price;
		this.srcImg = srcImg;
	}
});
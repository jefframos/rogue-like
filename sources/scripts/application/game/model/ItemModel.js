/*jshint undef:false */
var ItemModel = Class.extend({
	init: function (name,effect,baseValue,price,icoImg, quant){
		this.name = name;
		this.label = name;
		this.effect = effect;
		this.baseValue = baseValue;
		this.price = price;
		this.icoImg = icoImg;
		this.quant = quant?quant:1;
		this.type = 'item';
	},
	clone: function(){
		return new ItemModel(this.name,this.effect,this.baseValue,this.price,this.icoImg, this.quant);
	}
});
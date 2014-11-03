/*jshint undef:false */
var SpellModel = Class.extend({
	init: function (level,name,mp,spellPower,icoImg, srcImg, isMultiple){
		this.level = level;
		this.name = name;
		this.label = name;
		this.mp = mp;
		this.spellPower = spellPower;
		this.icoImg = icoImg;
		this.srcImg = srcImg;
		this.isMultiple = isMultiple;
	}
});
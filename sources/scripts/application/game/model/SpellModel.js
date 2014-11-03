/*jshint undef:false */
var SpellModel = Class.extend({
	init: function (level,name,mp,spellPower, srcImg, isMultiple){
		this.level = level;
		this.name = name;
		this.mp = mp;
		this.spellPower = spellPower;
		this.srcImg = srcImg;
		this.isMultiple = isMultiple;
	}
});
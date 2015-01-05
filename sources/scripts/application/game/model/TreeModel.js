/*jshint undef:false */
var TreeModel = Class.extend({
	init: function (tree){
		this.biomes = tree.biomes;
		this.happyTrees = tree.happyTrees;
		this.normalTrees = tree.normalTrees;
		this.madTrees = tree.madTrees;
		this.modifier = tree.modifier;
		this.life = tree.life;
		this.frequencies = tree.frequencies;
		this.frequence = tree.frequence;
	}
});
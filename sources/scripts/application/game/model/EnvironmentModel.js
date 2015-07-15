/*jshint undef:false */
var EnvironmentModel = Class.extend({
	init: function (name,tree,colors,graphics){
		this.name = name;
		this.colors = colors;
		this.treeModelList = [];
		for (var i = tree.length - 1; i >= 0; i--) {
			this.treeModelList.push(new TreeModel(tree[i]));
		}
		this.graphics = graphics;
	}
});
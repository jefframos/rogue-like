/*jshint undef:false */
var ItemDefault = Class.extend({
    init: function (entity, player){
		this.player = player;
		this.entity = entity;
		this.life = 8;
		this.entity.setVelocity(-2,(Math.random()-0.5)*3);
		this.sideAcum = 0;
		this.sideMaxAcum = 200;
		this.fireFreq = 25;
		this.fireAcum = 0;
		this.fireSpeed = 6;
	},
	update: function(){
    },
});
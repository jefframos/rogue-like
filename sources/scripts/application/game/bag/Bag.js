/*jshint undef:false */
var Bag = Entity.extend({
	init: function (){
		this._super( true );
        this.updateable = true;
        this.colidable = true;
        this.range = 60;
        this.type = 'fire';
        this.imgSource = '_dist/img/HUD/bags/bag1.png';
	},
	build: function(){
        this._super(this.imgSource);
        this.updateable = true;
        this.collidable = true;
        this.getContent().scale.x = 0;
        this.getContent().scale.y = 0;
        TweenLite.to(this.getContent().scale, 0.5, {x:1, y:1, ease:'easeOutElastic'});
    }
});
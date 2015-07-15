/*jshint undef:false */
var Bag = Entity.extend({
	init: function (model, player){
		this._super( true );
        this.updateable = true;
        this.colidable = false;
        this.range = 50;
        this.type = 'bag';
        // this.target = 'player';
        this.model = model;
        this.player = player;
        this.imgSource = 'dist/img/HUD/bags/bag1.png';
        this.isShow = false;
	},
    update:function(){
        // if(pointDistance(this.getPosition().x,
        //     this.getPosition().y,
        //     this.player.getPosition().x + this.player.centerPosition.x,
        //     this.player.getPosition().y + this.player.centerPosition.y) < 100){
        //     APP.getHUDController().showBagContent(this.model);
        // }else
        // {
        //     APP.getHUDController().hideBagContent();
        // }
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

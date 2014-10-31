/*jshint undef:false */
var Enemy = SpritesheetEntity.extend({
    init:function(player, model){
        this._super( true );
        this.updateable = false;
        this.deading = false;
        this.range = APP.tileSize.x/2;
        this.width = APP.tileSize.x * 0.9;
        this.height = APP.tileSize.y * 0.9;
        this.type = 'enemy';
        this.node = null;
        this.boundsCollision = true;
        this.player = player;
        console.log('player', this.player);

        this.monsterModel = model;
        this.defaultVelocity = this.monsterModel.speed/10;
        this.hp = this.monsterModel.hp;
        this.behaviour = new DefaultBehaviour(this, player);
    },
    hurt:function(demage, type){
        var pop = new PopUpText('red');
        pop.setText(Math.floor(demage));
        APP.getEffectsContainer().addChild(pop.getContent());
        pop.setPosition(this.getPosition().x -10 + Math.random() * 20, this.getPosition().y-5 + Math.random() * 10 - this.height/2);
        pop.initMotion(-10 - (Math.random() * 10), 0.5);
        this.getTexture().tint = 0xFF0000;

        var trueDemage = this.monsterModel.getHurt(demage, type);

        this.hp -= trueDemage;

        // console.log(demage,'hurt',trueDemage, this.hp, this.monsterModel.level);


        if(this.hp <= 0){
            this.preKill();
            this.player.playerModel.updateXp(this.monsterModel.xp);
        }
    },
    build: function(){
        // console.log('criou o Heart');
        var self = this;
        var motionArray = this.getFramesByRange('dragon10',0,14);
        var animationIdle = new SpritesheetAnimation();
        animationIdle.build('idle', motionArray, 1, true, null);
        this.spritesheet = new Spritesheet();
        this.spritesheet.addAnimation(animationIdle);
        this.spritesheet.play('idle');
        this.centerPosition = {x:this.width/2, y:this.height/2};

        this.updateable = true;
        this.collidable = true;
    },
    update: function(){
        this.behaviour.update();
        if(!this.isTouch){
            this.velocity = this.virtualVelocity;
        }
        this._super();
        this.getBounds();
        if(this.getTexture()){
            // this.width = 0;
            // this.height = 0;
            this.getContent().position.x = 20;
            // this.getContent().position.y = -20;
            // this.range = this.bounds.w / 2;
        }

    },
    preKill:function(){
        //this._super();
        var self = this;
        this.updateable = false;
        this.collidable = false;
        TweenLite.to(this.getContent(), 0.5, {alpha:0, onComplete:function(){self.kill = true;}});
        // if(this.debugGraphic.parent){
        //     this.debugGraphic.parent.removeChild(this.debugGraphic);
        // }
    },
    pointDistance: function(x, y, x0, y0){
        return Math.sqrt((x -= x0) * x + (y -= y0) * y);
    },
    touch: function(collection){
        this.isTouch = true;
        if(collection.left||collection.right && this.virtualVelocity.x !== 0)
        {
            this.velocity.x = 0;
        }
        if(collection.up|| collection.down && this.virtualVelocity.y !== 0)
        {
            this.velocity.y = 0;
        }
    },
});
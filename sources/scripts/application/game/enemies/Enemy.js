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
        this.monsterModel = model;
    },
    hurt:function(demage, type){
        

        var trueDemage = this.monsterModel.getHurt(demage, type);
        this.hp -= trueDemage;

        var pop = new PopUpText('red');
        pop.setText(Math.floor(trueDemage));
        APP.getEffectsContainer().addChild(pop.getContent());
        pop.setPosition(this.getPosition().x -10 + Math.random() * 20, this.getPosition().y-5 + Math.random() * 10 - this.height/2);
        pop.initMotion(-10 - (Math.random() * 10), 0.5);
        this.getTexture().tint = 0xFF0000;

        if(this.hp <= 0){
            this.preKill();
            var trueXP = this.monsterModel.xp + ((this.monsterModel.level - this.player.playerModel.level)*0.15*this.monsterModel.xp) + 1;
            this.player.playerModel.updateXp(trueXP);
        }
    },
    build: function(){
        // console.log('criou o Heart');
        this.fireFreq = this.monsterModel.fireFreq;
        this.defaultVelocity = this.monsterModel.speed/15;
        if(this.defaultVelocity < 4){
            this.defaultVelocity = 4;
        }
        this.hp = this.monsterModel.hp;
        this.behaviour = new DefaultBehaviour(this, this.player);
        console.log('HP', this.hp);

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
        if(this.behaviour){
            this.behaviour.update();
        }
        if(!this.isTouch){
            this.velocity = this.virtualVelocity;
        }
        this._super();
        this.getBounds();
        if(this.getTexture()){
            this.getContent().position.x = 20;
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
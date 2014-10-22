/*jshint undef:false */
var Player = SpritesheetEntity.extend({
    init:function(){
        this._super( true );
        this.updateable = false;
        this.deading = false;
        this.collidable = true;
        this.range = APP.tileSize.x/2;
        this.width = APP.tileSize.x * 0.8;
        this.height = APP.tileSize.y * 0.8;
        this.type = 'player';
        this.collisionPointsMarginDivide = 0;
        this.isTouch = false;
        this.boundsCollision = true;

        this.playerModel = new PlayerModel();
        this.fireModel = new FireModel();
        this.endLevel = false;


        this.defaultVelocity = this.playerModel.velocity;
        this.fireFreq = this.playerModel.fireFreq;
        this.life = this.playerModel.life;

        this.fireSpeed = this.fireModel.fireSpeed;
        this.fireStepLive = this.fireModel.fireStepLive;
        this.firePower = this.fireModel.firePower;

        this.fireFreqAcum = 0;



    },
    debug:function(){
        // draw a shape
        // console.log('debug', this.debugGraphic.parent);
        if(this.debugGraphic.parent === null && this.getContent().parent !== null)
        {
            this.getContent().parent.addChild(this.debugGraphic);
        }
        this.debugGraphic.clear();
        this.debugGraphic.beginFill(0xFF3300);
        this.debugGraphic.lineStyle(1, 0xffd900);
        this.debugGraphic.moveTo(this.bounds.x ,this.bounds.y);
        this.debugGraphic.lineTo(this.bounds.x + this.bounds.w, this.bounds.y);
        this.debugGraphic.lineTo(this.bounds.x + this.bounds.w, this.bounds.y + this.bounds.h);
        this.debugGraphic.lineTo(this.bounds.x, this.bounds.y + this.bounds.h);
        this.debugGraphic.endFill();
    },
    getBounds: function(){
        //TA UMA MERDA E CONFUSO ISSO AQUI, por causa das posições
        // console.log()
        this.bounds = {x: this.getPosition().x , y: this.getPosition().y, w: this.width, h: this.height};
        this.collisionPoints = {
            up:{x:this.bounds.x + this.bounds.w / 2, y:this.bounds.y},
            down:{x:this.bounds.x + this.bounds.w / 2, y:this.bounds.y + this.bounds.h},
            bottomLeft:{x:this.bounds.x, y:this.bounds.y+this.bounds.h},
            topLeft:{x:this.bounds.x, y:this.bounds.y},
            bottomRight:{x:this.bounds.x + this.bounds.w, y:this.bounds.y+this.bounds.h},
            topRight:{x:this.bounds.x + this.bounds.w, y:this.bounds.y}
        };
        this.polygon = new PIXI.Polygon(new PIXI.Point(this.bounds.x + this.bounds.w / 2, this.bounds.y),
            new PIXI.Point(this.bounds.x, this.bounds.y),
            new PIXI.Point(this.bounds.x, this.bounds.y+this.bounds.h),
            new PIXI.Point(this.bounds.x + this.bounds.w / 2, this.bounds.y + this.bounds.h),
            new PIXI.Point(this.bounds.x + this.bounds.w, this.bounds.y+this.bounds.h),
            new PIXI.Point(this.bounds.x + this.bounds.w, this.bounds.y));
        return this.bounds;
    },
    build: function(){
        // console.log('criou o player');

        var self = this;
        var motionArray = this.getFramesByRange('chinesa10',0,8);
        var animationIdle = new SpritesheetAnimation();
        animationIdle.build('idle', motionArray, 1, true, null);

        // var motionArrayDead = this.getFramesByRange('chinesa10',19,25);
        var motionArrayDead = this.getFramesByRange('chinesa10',0,8);
        var animationDead = new SpritesheetAnimation();

        animationDead.build('dead', motionArrayDead, 2, false, function(){
            TweenLite.to(self.spritesheet.scale, 0.2, {x:0,y:0});
        });

        this.spritesheet = new Spritesheet();
        this.spritesheet.addAnimation(animationIdle);
        this.spritesheet.addAnimation(animationDead);
        this.spritesheet.play('idle');
        this.reset();
        this.counter = 0;

        this.debugGraphic = new PIXI.Graphics();
        this.debugGraphic.beginFill(0xFF3300);
        this.debugGraphic.lineStyle(1, 0xffd900, 1);
        this.debugGraphic.endFill();


    },
    update: function(){
        if(!this.isTouch){
            this.velocity = this.virtualVelocity;
        }

        if(this.deading){
            this.setVelocity(0,0);
        }
        this._super();
        this.debugPolygon(0x556644, true);

        if(this.getTexture()){
            this.getContent().position.x = 20;
        }
    },
    preKill:function(){
        this._super();
        if(this.debugGraphic.parent){
            this.debugGraphic.parent.removeChild(this.debugGraphic);
        }
    },
    reset: function(){
        this.deading = false;
        this.setPosition( windowWidth/2, windowHeight/2);
        this.spritesheet.play('idle');
        this.setVelocity(0,0);
        this.updateable = true;
        // console.log('radius player', this.range);

        // this.spritesheet.setScale(0,0);
        // TweenLite.to(this.spritesheet.scale, 1, {delay:0.4, x:1,y:1, ease:'easeOutElastic'});

    },
    collide:function(arrayCollide){
        // console.log('playerCollide', arrayCollide[0].type);

        if(arrayCollide[0].type === 'door'){
            console.log('door collider');
            if(arrayCollide[0].side === 'up' && this.virtualVelocity.y < 0 ||
                arrayCollide[0].side === 'down' && this.virtualVelocity.y > 0 ||
                arrayCollide[0].side === 'left' && this.virtualVelocity.x < 0 ||
                arrayCollide[0].side === 'right' && this.virtualVelocity.x > 0)
            {

                this.endLevel = true;
                this.nextNode = arrayCollide[0].node;
                this.nextDoorSide = arrayCollide[0].side;
            }
        }
        if(arrayCollide[0].type === 'enemy'){
            // var angle = Math.atan2(this.getPosition().y-arrayCollide[0].getPosition().y,  this.getPosition().x-arrayCollide[0].getPosition().x);
            // angle = angle * 180 / Math.PI;
            // this.setPosition(this.getPosition().x + arrayCollide[0].range * Math.sin(angle), this.getPosition().y + arrayCollide[0].range * Math.cos(angle));
        }
        //console.log('colidiu');
    },
    touch: function(collection){
        this.isTouch = true;
        console.log(collection);
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
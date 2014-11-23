/*jshint undef:false */
var Fairy = Entity.extend({
    init:function(player){
        this._super();
        this.updateable = true;
        this.collidable = false;
        this.player = player;
        // this.arrayObstacles = ['_dist/img/fairy/f1.png'];
  
        this.srcImg =  '_dist/img/fairy/f1.png';//this.arrayObstacles[imgId];
        this.type = 'fairy';
        this.width = 25;//APP.tileSize.x;
        this.height = 25;//APP.tileSize.x;

        this.bounceAcc = 0;
        this.bounceAccMax = 30;
        this.velYHelper = 1;

        // this.bounceAcc = 10;
        // this.velYHelper = 0.5;
        // this.debugGraphic = new PIXI.Graphics();
        // this.debugGraphic.beginFill(0xFF3300);
        // this.debugGraphic.lineStyle(1, 0xffd900, 1);
        // this.debugGraphic.endFill();
        this.fairyContainer = new PIXI.DisplayObjectContainer();
        this.range = 0;
        this.fairyAngle = 0;

        // this.noDepth = true;
    },
    getBounds: function(){
        this.bounds = {x: this.getPosition().x - this.width *this.fairySprite.anchor.x,
            y: this.getPosition().y - this.height *this.fairySprite.anchor.y,
            w: this.width,
            h: this.height};
        return this.bounds;
    },
    build: function(){
        // this._super(this.srcImg);
        this.texture = PIXI.Texture.fromImage(this.srcImg);
        this.fairySprite = new PIXI.Sprite(this.texture);

        this.fairyContainer.addChild(this.fairySprite);

        var self = this;
        this.fairySprite.anchor.x = 0.5;
        this.fairySprite.anchor.y = 0.5;
        if(this.texture){
            // this.getContent().position.x = +this.width/2;
            //this.texture.position.y = -100;
        }
    },
    getContent: function(){
        return this.fairyContainer;
    },
    //retorna a posicao
    getPosition: function(){
        return this.fairyContainer.position;
    },
    //seta a posicao
    setPosition: function(x,y){
        this.fairyContainer.position.x = x;
        this.fairyContainer.position.y = y;
    },
    forceBackPlayer: function(){
        console.log('force back');

    },
    forceFrontPlayer: function(){

        console.log('force front');

        if(this.player.layer){
            // console.log(this.player.layer.getContent().swapChildren );
            // console.log(this.player.layer.getContent().children);

            this.player.layer.getContent().swapChildren(this.fairyContainer, this.player.getContent());
            // this.player.layer.getContent().setChildIndex(this.fairyContainer, 5);

            // for (var i = this.player.layer.getContent().children.length - 1; i >= 0; i--) {
            //     // console.log(this.player.layer.getContent().children[i]);
            //     if(this.fairyContainer === this.player.layer.getContent().children[i])
            //     {
            //         this.player.layer.getContent().setChildIndex(this.fairyContainer, this.player.layer.getContent().children.length - 1);
            //         // this.player.layer.getContent().children.splice(
            //         //     this.player.layer.getContent().children.length - 1,
            //         //     0,
            //         //     this.player.layer.getContent().children[i]
            //         //     );

            //         // this.player.layer.getContent().children.splice(i,0);

            //         console.log(i);
            //         return;
            //     }
            // }
        }
        // this.entityLayer.getContent().children
    },
    update: function(){
        // this._super();
        var angle = null;

        this.fairyContainer.position.x += this.velocity.x;
        // this.fairyContainer.position.x -= 5;
        this.fairyContainer.position.y += this.velocity.y;

        this.fairySprite.position.x += this.virtualVelocity.x;
        this.fairySprite.position.y += this.virtualVelocity.y;

        
        // if(this.fairySprite.position.y + this.fairyContainer.position.y > this.player.getPosition().y)
        // {
        //     this.forceFrontPlayer();
        // }else{
        //     this.forceBackPlayer();
        // }


        // console.log(pointDistance(this.player.getPosition().x, this.player.getPosition().y, this.getPosition().x, this.getPosition().y));
        if(this.player && this.player.centerPosition){
            var playerPos =
            {
                x:this.player.getPosition().x,
                y:this.player.getPosition().y + this.player.centerPosition.y// + this.player.range
            };
            var dist = pointDistance(playerPos.x,playerPos.y, this.fairyContainer.position.x, this.fairyContainer.position.y);
            if(dist > 20)
            {
                angle = Math.atan2(playerPos.y - this.fairyContainer.position.y,  playerPos.x - this.fairyContainer.position.x);
                angle = angle * 180 / Math.PI;// * -1;
                angle += 90 + 180;
                angle = angle / 180 * Math.PI * -1;

                this.velocity.x = Math.sin(angle) * this.player.defaultVelocity * dist / 30;
                this.velocity.y = Math.cos(angle) * this.player.defaultVelocity * dist / 30;

                // console.log(dist);

                // this.velocity.x *= 0.8;
                // this.velocity.y *= 0.8;

            }
            else{
                // this.velocity.x = 0;
                //this.velocity.y = 2;
                // console.log(this.velocity);
                // this.velocity.x *= 0.1;
                // this.velocity.y *= 0.1;

                this.velocity.x *= 0.9;
                this.velocity.y *= 0.9;

                if(Math.abs(this.velocity.x < 0.05)){
                    this.velocity.x = 0;
                }

                if(Math.abs(this.velocity.y < 0.05)){
                    this.velocity.y = 0;
                }
               
            }

            this.fairyAngle += 2.8;

            var xAcc = Math.sin(this.fairyAngle / 180 * Math.PI) *2;//* ((this.bounceAcc / this.bounceAccMax) / 50 + this.fairyAngle? Math.sin(this.fairyAngle) / 8:0);
            var yAcc =  Math.cos(this.fairyAngle / 180 * Math.PI)* 2.1 * (this.bounceAcc / this.bounceAccMax) * 2;//* ((this.bounceAcc / this.bounceAccMax) / 50 + this.fairyAngle? Math.cos(this.fairyAngle) / 8:0);
            // if(yAcc !== Infinity){
            this.virtualVelocity.x = xAcc ;
            this.virtualVelocity.y = yAcc ;
            // }

            this.bounceAcc += this.velYHelper;

            if(this.bounceAcc <= 0)
            {
                this.velYHelper *= -1;
            }else if(this.bounceAcc >= this.bounceAccMax)
            {
                this.velYHelper *= -1;
            }

            // console.log(this.bounceAcc / this.bounceAccMax);
            
        }
        // if(this.debugGraphic.parent === null && this.getContent().parent !== null)
        // {
        //     this.getBounds();
        //     // this.debugGraphic.drawRect(this.bounds.x, this.bounds.y,this.bounds.w, this.bounds.h);

        //     // this.getContent().parent.addChild(this.debugGraphic);
        // }
    }
});
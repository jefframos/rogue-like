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

        this.bounceAcc = 10;
        this.bounceAccMax = 30;
        this.velYHelper = 1;

        // this.bounceAcc = 10;
        // this.velYHelper = 0.5;
        // this.debugGraphic = new PIXI.Graphics();
        // this.debugGraphic.beginFill(0xFF3300);
        // this.debugGraphic.lineStyle(1, 0xffd900, 1);
        // this.debugGraphic.endFill();
        this.range = 0;
    },
    getBounds: function(){
        this.bounds = {x: this.getPosition().x - this.width *this.sprite.anchor.x,
            y: this.getPosition().y - this.height *this.sprite.anchor.y,
            w: this.width,
            h: this.height};
        return this.bounds;
    },
    build: function(){
        this._super(this.srcImg);
        var self = this;
        this.sprite.anchor.x = 0.5;
        this.sprite.anchor.y = 1;
        if(this.texture){
            // this.getContent().position.x = +this.width/2;
            //this.texture.position.y = -100;
        }
    },
    update: function(){
        this._super();
        var angle = null;
        // console.log(pointDistance(this.player.getPosition().x, this.player.getPosition().y, this.getPosition().x, this.getPosition().y));
        if(this.player && this.player.centerPosition){
            var playerPos =
            {
                x:this.player.getPosition().x + this.player.centerPosition.x,
                y:this.player.getPosition().y + this.player.centerPosition.y
            };
            var dist = pointDistance(playerPos.x,playerPos.y, this.getPosition().x, this.getPosition().y);
            if(dist > 20)
            {
                angle = Math.atan2(playerPos.y - this.getPosition().y,  playerPos.x - this.getPosition().x);
                angle = angle * 180 / Math.PI;// * -1;
                angle += 90 + 180;
                angle = angle / 180 * Math.PI * -1;

                // this.velocity.x = Math.sin(angle) * 6;
                // this.velocity.y = Math.cos(angle) * 6;
                this.velocity.x *= 0.8;
                this.velocity.y *= 0.8;

            }
            else{
                this.velocity.x = 0;
                //this.velocity.y = 2;
               
            }


            var yAcc = (this.bounceAcc / this.bounceAccMax * this.velYHelper) / 5;
            var xAcc = -(this.bounceAcc / this.bounceAccMax * this.velYHelper) / 5;
            // if(yAcc !== Infinity){
            this.velocity.x += xAcc + angle? Math.sin(angle):0;
            this.velocity.y += yAcc + angle? Math.cos(angle):0;
            // }

            this.bounceAcc += this.velYHelper;

            console.log(this.velocity.y);
            if(this.bounceAcc <= 0)
            {
                // this.bounceAcc = this.bounceAccMax;
                this.velYHelper *= -1;
            }else if(this.bounceAcc >= this.bounceAccMax)
            {
                // this.bounceAcc = this.bounceAccMax;
                this.velYHelper *= -1;
            }

            // console.log(this.velocity.y);
            
        }
        // if(this.debugGraphic.parent === null && this.getContent().parent !== null)
        // {
        //     this.getBounds();
        //     // this.debugGraphic.drawRect(this.bounds.x, this.bounds.y,this.bounds.w, this.bounds.h);

        //     // this.getContent().parent.addChild(this.debugGraphic);
        // }
    }
});
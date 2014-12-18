/*jshint undef:false */
var Obstacle = Entity.extend({
    init:function(imgId){
        this._super();
        this.updateable = true;
        this.collidable = true;
        this.arrayObstacles = ['_dist/img/flora/florest1/tree1.png',
        '_dist/img/flora/florest1/tree2.png',
        '_dist/img/flora/florest1/tree3.png',
        '_dist/img/flora/florest1/tree4.png'];
  
        this.srcImg =  this.arrayObstacles[imgId];
        this.type = 'environment';
        this.width = APP.nTileSize / 1.8;
        this.height = APP.nTileSize / 2;

        this.debugGraphic = new PIXI.Graphics();
        this.debugGraphic.beginFill(0xFF3300);
        this.debugGraphic.lineStyle(1, 0xffd900, 1);
        this.debugGraphic.endFill();
        // this.scale.x = 0.5;
        // this.scale.y = 0.5;
        this.range = 0;
    },
    preKill:function(){
        this._super();
        this.getContent().cacheAsBitmap = true;
        if(this.debugGraphic.parent){
            this.debugGraphic.parent.removeChild(this.debugGraphic);
        }
    },
    getBounds: function(){
        this.bounds = {x: this.getPosition().x - this.width *this.sprite.anchor.x,
            y: this.getPosition().y - this.height *this.sprite.anchor.y,
            w: this.width,
            h: this.height};
        return this.bounds;
    },
    build: function(){
        // console.log('criou o Obstacle');
        this._super(this.srcImg);
        var self = this;
        // this.respaw();
        this.sprite.anchor.x = 0.5;
        this.sprite.anchor.y = 1;
        this.getContent().type = this.type;
        // this.sprite.scale.x = 0.5;
        // this.sprite.scale.y = 0.5;
    },
    update: function(){
        this._super();

        // if(this.debugGraphic.parent === null && this.getContent().parent !== null)
        // {
        //     this.getBounds();
        //     this.debugGraphic.drawRect(this.bounds.x, this.bounds.y,this.bounds.w, this.bounds.h);

        //     this.getContent().parent.addChild(this.debugGraphic);
        // }
    },
    respaw: function(){
        // var rndPos = {x:(windowWidth - 200) * Math.random() + 100,
        //     y:(windowHeight - 200) * Math.random() + 100};

        var rndPos = {x:Math.floor((12 * Math.random() * 142) /142) * 142 + 104,
            y:Math.floor((7 * Math.random() * 142) /142) * 142 + 177 + 142};

        if(this.pointDistance(rndPos.x, rndPos.y, windowWidth/2, windowHeight/2 ) < 200)
        {
            this.respaw();
        }

        this.setPosition( rndPos.x,rndPos.y) ;
        this.collidable = true;
    },
    pointDistance: function(x, y, x0, y0){
        return Math.sqrt((x -= x0) * x + (y -= y0) * y);
    },
});
/*jshint undef:false */
var DesktopMainScreen = AbstractScreen.extend({
    init: function (label) {
        MicroEvent.mixin(this);
        this._super(label);

        var bg = new SimpleSprite('_dist/img/rascunho-mapa.jpg');
        this.addChild(bg);
        // bg.getContent().scale.x = 0.5;
        // bg.getContent().scale.y = 0.5;
        this.currentAppModel = new AppModel();

        this.mainLayer = new Layer('main');

        this.entityLayer = new Layer('fire');
        this.environmentLayer = new Layer('environment');
        this.layerManager = new LayerManager();
        this.layerManager.addLayer(this.environmentLayer);

        this.layerManager.addLayer(this.entityLayer);
        this.addChild(this.layerManager);
        this.margin = {x:APP.tileSize.x / 2 * 3,y:160 / 2};
        this.mouseDown = false;

    },
    destroy: function () {
        this._super();
    },
    build: function () {
        this._super();
        var assetsToLoader = [
            '_dist/img/spritesheet/dragon.json',
            '_dist/img/spritesheet/dragon.png',
        // '_dist/img/chinesa.png',
            '_dist/img/dragao-perdido.png',
            // '_dist/img/drop.png',
            '_dist/img/fireball.png',
            '_dist/img/spritesheet/chinesa.json',
            '_dist/img/spritesheet/finn.json',
            '_dist/img/spritesheet/finn.png',
            // '_dist/img/rascunho-mapa.jpg',
            '_dist/img/spritesheet/chinesa.png'
        ];
        this.loader = new PIXI.AssetLoader(assetsToLoader);
        this.initLoad();
    },
    onAssetsLoaded:function()
    {
        this._super();

        this.currentNode = APP.gen.firstNode;
        console.log('this.currentNode', this.currentNode);
        // SOCKET.updateObj({user:{isMobile:false}});
        // SOCKET.updateObj({socket:this.currentAppModel});
        this.rainContainer = new PIXI.DisplayObjectContainer();

        var self = this;

        this.vecPositions = [];
        document.body.addEventListener('mouseup', function(e){
            self.mouseDown = false;
        });
        document.body.addEventListener('mousedown', function(e){
            self.mouseDown = true;
            self.player.fireFreqAcum = 0;
        });
        document.body.addEventListener('keyup', function(e){
            if(self.player){
                if(e.keyCode === 87 || e.keyCode === 38 && self.player.velocity.y < 0){
                    self.removePosition('up');
                }
                else if(e.keyCode === 83 || e.keyCode === 40 && self.player.velocity.y > 0){
                    self.removePosition('down');
                }
                else if(e.keyCode === 65 || e.keyCode === 37 && self.player.velocity.x < 0){
                    self.removePosition('left');
                }
                else if(e.keyCode === 68 || e.keyCode === 39 && self.player.velocity.x > 0){
                    self.removePosition('right');
                }
                self.updatePlayerVel();
            }
        });
        document.body.addEventListener('keydown', function(e){
            var vel = 6;
            //console.log('keydown');

            if(e.keyCode === 87 || e.keyCode === 38){
                self.removePosition('down');
                self.addPosition('up');
            }
            else if(e.keyCode === 83 || e.keyCode === 40){
                self.removePosition('up');
                self.addPosition('down');
            }
            else if(e.keyCode === 65 || e.keyCode === 37){
                self.removePosition('right');
                self.addPosition('left');
            }
            else if(e.keyCode === 68 || e.keyCode === 39){
                self.removePosition('left');
                self.addPosition('right');
            }
            self.updatePlayerVel();

        });
        var tempRain = null;
        this.vecRain = [];
        for (var j = 300; j >= 0; j--) {
            tempRain = new RainParticle(50, 5, windowWidth + 200, windowHeight, 'left');
            this.rainContainer.addChild(tempRain.content);
            this.vecRain.push(tempRain);
        }

        this.mascara = new PIXI.Graphics();
        this.mascara.beginFill(0xFFFF00);
        // set the line style to have a width of 5 and set the color to red
        this.mascara.lineStyle(5, 0xFF0000);
        this.mascara.moveTo(-1920,-1280);
        this.mascara.lineTo(1920*2,-1280);
        this.mascara.lineTo(1920*2,1280*2);
        this.mascara.lineTo(-1920,1280*2);
        this.mascara.lineTo(-1920,-1280);
        this.mascara.lineTo(854,596);
        this.mascara.lineTo(902,542);
        this.mascara.lineTo(960,528);
        this.mascara.lineTo(1034,556);
        this.mascara.lineTo(1064,604);
        this.mascara.lineTo(1068,670);
        this.mascara.lineTo(1032,724);
        this.mascara.lineTo(966,750);
        this.mascara.lineTo(902,734);
        this.mascara.lineTo(854,676);
        this.mascara.lineTo(854,594);
        // end the fill
        this.mascara.endFill();
        this.mascara.position.x = 500;
        // this.addChild(this.mascara);
        //this.addChild(this.rainContainer);
        // this.rainContainer.mask = this.mascara;

        this.graphDebug = new PIXI.Graphics();
        this.addChild(this.graphDebug);

        this.blackShape = new PIXI.Graphics();
        this.blackShape.beginFill(0x000000);
        this.blackShape.drawRect(0,0,windowWidth, windowHeight);
        this.addChild(this.blackShape);
        TweenLite.to(this.blackShape, 1, {alpha:0});

        this.levelLabel = new PIXI.Text('', {fill:'white', align:'center', font:'bold 20px Arial'});
        this.addChild(this.levelLabel);

        this.resetLevel();
        this.minimap = new Minimap();
        this.addChild(this.minimap);
        this.minimap.build();
        this.minimap.setPosition(windowWidth - 100,5);
        this.minimap.getContent().scale.x = 0.3;
        this.minimap.getContent().scale.y = 0.3;

        // console.log(new BoundCollisionSystem(),'col system BoundCollisionSystem');

        this.collisionSystem = new BoundCollisionSystem(this, true);
        // console.log(this.collisionSystem,'col system');
    },
    removePosition:function(position){
        for (var i = this.vecPositions.length - 1; i >= 0; i--) {
            if(this.vecPositions[i] === position)
            {
                this.vecPositions.splice(i,1);
            }
        }
    },
    addPosition:function(position){
        var exists = false;

        for (var i = this.vecPositions.length - 1; i >= 0; i--) {
            if(this.vecPositions[i] === position)
            {
                exists = true;
            }
        }

        if(!exists){
            this.vecPositions.push(position);
        }
    },
    updatePlayerVel:function()
    {
        if(this.player && this.vecPositions){
            var hasAxysY = false;
            var hasAxysX = false;
            if(this.vecPositions.length === 0){
                this.player.virtualVelocity.x = 0;
                this.player.virtualVelocity.y = 0;
            }
            for (var i = this.vecPositions.length - 1; i >= 0; i--) {

                if(this.vecPositions[i] === 'up'){
                    this.player.virtualVelocity.y = -this.player.defaultVelocity;
                    hasAxysY = true;
                }
                else if(this.vecPositions[i] === 'down'){
                    this.player.virtualVelocity.y = this.player.defaultVelocity;
                    hasAxysY = true;
                }

                if(this.vecPositions[i] === 'left'){
                    this.player.virtualVelocity.x = -this.player.defaultVelocity;
                    hasAxysX = true;
                }
                else if(this.vecPositions[i] === 'right'){
                    this.player.virtualVelocity.x = this.player.defaultVelocity;
                    hasAxysX = true;
                }
            }

            if(!hasAxysY){
                this.player.virtualVelocity.y = 0;
            }
            if(!hasAxysX){
                this.player.virtualVelocity.x = 0;
            }

        }
    },
    //colocar isso dentro do personagem
    shoot:function(){
        var self = this;
        var angle = Math.atan2(this.player.getPosition().y-APP.stage.getMousePosition().y,  this.player.getPosition().x-APP.stage.getMousePosition().x);
        angle = angle * 180 / Math.PI * -1;
        angle += 90 + 180;
        angle = angle / 180 * Math.PI;
        for (var i = 0; i < 10; i++) {
            var tempFire = new Fire({x:this.player.fireSpeed * Math.sin(angle * i), y: this.player.fireSpeed * Math.cos(angle * i)});
            tempFire.timeLive = this.player.fireStepLive;
            tempFire.power = this.player.firePower;
            tempFire.build();
            tempFire.setPosition(this.player.getPosition().x + 40, this.player.getPosition().y +10);
            this.entityLayer.addChild(tempFire);
            this.player.fireFreqAcum = this.player.fireFreq;
        }
    },
    update:function()
    {
       // console.log(this.mouseDown);

        if(this.player){
            
            if(this.mouseDown){
                this.player.fireFreqAcum --;
                //console.log(this.player.fireFreqAcum);
                if(this.player.fireFreqAcum <= 0){
                    this.shoot();
                }
            }
            this.entityLayer.collideChilds(this.player);
            this.environmentLayer.collideChilds(this.player);
            //zera as posições aqui, caso encontre uma porte, por isso a colisao antes
            if(((this.player.getPosition().x + this.player.virtualVelocity.x < this.margin.x ) && this.player.virtualVelocity.x < 0) ||
                ((this.player.getPosition().x + this.player.width + this.player.virtualVelocity.x > windowWidth -  this.margin.x)&& this.player.virtualVelocity.x > 0)){
                this.player.virtualVelocity.x = 0;
            }
            if(((this.player.getPosition().y + this.player.virtualVelocity.y < this.margin.y ) && this.player.virtualVelocity.y < 0) ||
                ((this.player.getPosition().y + this.player.height + this.player.virtualVelocity.y > windowHeight -  this.margin.y)&& this.player.virtualVelocity.y > 0)){
                this.player.virtualVelocity.y = 0;
            }

            for (var i = 0; i < this.entityLayer.childs.length; i++) {
                if(this.entityLayer.childs[i].type === 'fire'){
                    this.entityLayer.collideChilds(this.entityLayer.childs[i]);
                }
            }
            
            this.collisionSystem.applyCollision(this.entityLayer.childs, this.entityLayer.childs);
        }

        this._super();

        this.entityLayer.getContent().children.sort(this.depthCompare);
        // if(this.vecRain){
        //     for (var i = this.vecRain.length - 1; i >= 0; i--) {
        //         this.vecRain[i].update();
        //     }
        // }
        // console.log('entity childs', this.entityLayer.childs.length);
        if(this.player && this.player.endLevel)
        {
            this.player.endLevel = false;
            this.currentNode = this.player.nextNode;
            this.currentPlayerSide = this.player.nextDoorSide;
            this.killLevel(this.resetLevel);
            this.player = null;
        }
       
        // if(this.player){
        //     console.log('updade here');
        //     this.mascara.position.x = this.player.getPosition().x -1920/2;
        //     this.mascara.position.y = this.player.getPosition().y -1280/2;
        // }
    },
    killLevel:function(callback){
        // console.log('kill here');
        var self = this;
        for (var k = this.entityLayer.childs.length - 1; k >= 0; k--) {
            this.entityLayer.childs[k].preKill();
        }

        for (var t = this.environmentLayer.childs.length - 1; t >= 0; t--) {
            this.environmentLayer.childs[t].preKill();
        }

        // this.blackShape.alpha = 0.5;
        TweenLite.to(this.blackShape, 0.5, {alpha:1});

        setTimeout(function(){
            self.resetLevel();
        }, 700);

    },
    resetLevel:function()
    {
        this.vecPositions = [];
        TweenLite.to(this.blackShape, 1, {alpha:0});
        var roomState = 'first room';
        switch(this.currentNode.mode)
        {
            case 2:
                roomState = 'standard';
                break;
            case 3:
                roomState = 'item';
                break;
            case 4:
                roomState = 'boss';
                break;
            case 5:
                roomState = 'lock';
                break;
            case 6:
                roomState = 'key';

        }
        //console.log(this, 'ESSE É O ID DO LEVEL ATUAL -> ', this.currentNode);
        this.levelLabel.setText('room id:'+this.currentNode.id+'   -    state:'+roomState);
        this.level = getRandomLevel();

        
        this.player = new Player();
        this.player.build();



        if(this.currentPlayerSide === 'up')
        {
            this.player.setPosition(windowWidth/2,windowHeight - this.margin.y- this.player.height);

        }else if(this.currentPlayerSide === 'down')
        {
            this.player.setPosition(windowWidth/2,this.margin.y );
        }else if(this.currentPlayerSide === 'left')
        {
            this.player.setPosition(windowWidth - this.margin.x - this.player.width,windowHeight/2);
        }else if(this.currentPlayerSide === 'right')
        {
            this.player.setPosition(this.margin.x,windowHeight/2);
        }

        this.heart = new Enemy();
        this.heart.build();
       
        this.fly = new FlightEnemy(500,500);
        this.fly.build();
        this.heart.setPosition(700,200);
        this.fly.setPosition(100,200);
        
        this.entityLayer.addChild(this.player);
        this.entityLayer.addChild(this.heart);
        this.entityLayer.addChild(this.fly);
        

        for (var i = this.level.length - 1; i >= 0; i--) {
            for (var j = this.level[i].length - 1; j >= 0; j--) {
                if(this.level[i][j] > 0)
                {
                    var obs = new Obstacle(this.level[i][j] - 1);
                    obs.build();
                    obs.setPosition((j)* APP.tileSize.x+ this.margin.x, (i+1)* APP.tileSize.y+ this.margin.y);
                    this.entityLayer.addChild(obs);
                    
                }
            }
        }


        this.createDoors();
    },
    createDoors:function(){
        if(this.currentNode.childrenSides[0]){
            this.doorLeft = new Door('left');
            this.doorLeft.build();
            this.doorLeft.setPosition(this.margin.x - APP.tileSize.x / 2,windowHeight/2);

            this.doorLeft.node = this.currentNode.childrenSides[0];
            this.environmentLayer.addChild(this.doorLeft);

        }
        if(this.currentNode.childrenSides[1]){
            this.doorRight = new Door('right');
            this.doorRight.build();
            this.doorRight.setPosition(windowWidth - this.margin.x + APP.tileSize.x / 2,windowHeight/2);

            this.doorRight.node = this.currentNode.childrenSides[1];
            this.environmentLayer.addChild(this.doorRight);

        }
        if(this.currentNode.childrenSides[2]){
            this.doorUp = new Door('up');
            this.doorUp.build();
            this.doorUp.setPosition(windowWidth/2,this.margin.y - APP.tileSize.y / 2);

            this.doorUp.node = this.currentNode.childrenSides[2];
            this.environmentLayer.addChild(this.doorUp);

        }
        if(this.currentNode.childrenSides[3]){
            this.doorDown = new Door('down');
            this.doorDown.build();
            this.doorDown.setPosition(windowWidth/2,windowHeight - this.margin.y + APP.tileSize.y / 2);

            this.doorDown.node = this.currentNode.childrenSides[3];
            this.environmentLayer.addChild(this.doorDown);

        }
    },
    depthCompare:function(a,b) {
        var yA = a.position.y;
        var yB = b.position.y;
        if(a.children.length > 0){
            yA = a.children[0].position.y + a.children[0].height;
        }
        if(b.children.length > 0){
            yB = b.children[0].position.y + b.children[0].height;
        }
        if (yA < yB){
            return -1;
        }
        if (yA > yB){
            return 1;
        }
        return 0;
    },
});
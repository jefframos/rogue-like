/*jshint undef:false */
var GameScreen = AbstractScreen.extend({
    init: function (label) {
        MicroEvent.mixin(this);
        this._super(label);

        //var bg = new SimpleSprite('_dist/img/rascunho-mapa.jpg');
        //this.addChild(bg);

        this.bgContainer = new PIXI.DisplayObjectContainer();
        // var tempTile = new SimpleSprite('_dist/img/tile1.png');




        this.addChild(this.bgContainer);
        
        // bgContainer.cacheAsBitmap = true;

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
        // this.mapPosition = {x:APP.tileSize.x / 2 * 3,y:160 / 2};
        this.mapPosition = {x:200,y:200};

        this.tempSizeTiles = {x:12, y:10};
        //POR ENQUANTO 80 é o tamanho do tile
        // this.levelBounds = {x: this.tempSizeTiles.x * 80 - this.mapPosition.x*2, y: this.tempSizeTiles.y * 80 - this.mapPosition.y * 2};
        this.levelBounds = {x: this.tempSizeTiles.x * 80 - this.mapPosition.x*2, y: this.tempSizeTiles.y * 80 - this.mapPosition.y * 2};

        this.mouseDown = false;

        var clss = 'thief';
        var rnd = Math.random();
        if(rnd < 0.33){
            clss = 'warrior';
        }
        else if(rnd < 0.66){
            clss = 'mage';
        }

        this.playerModel = new PlayerModel(clss);
        // this.playerModel.levelUp();
        // for (var i = 0; i < 20; i++) {
        //     this.playerModel.levelUp();ddw
        // }
        // this.playerModel.levelUp();
        // this.playerModel.logCSV();
    },
    destroy: function () {
        this._super();
    },
    build: function () {
        this._super();
        var assetsToLoader = [
            '_dist/img/spritesheet/dragon.json',
            '_dist/img/spritesheet/dragon.png',
            '_dist/img/dragao-perdido.png',
            '_dist/img/drop.png',
            '_dist/img/fireball.png',
            '_dist/img/spritesheet/chinesa.json',
            '_dist/img/spritesheet/chinesa.png'
        ];
        this.loader = new PIXI.AssetLoader(assetsToLoader);
        this.initLoad();
    },
    onAssetsLoaded:function()
    {
        this._super();

        this.currentNode = APP.gen.firstNode;
        this.currentNode.applySeed();

        var self = this;

        this.vecPositions = [];
        this.keyboardInput = new KeyboardInput(this);
        


        this.graphDebug = new PIXI.Graphics();
        this.addChild(this.graphDebug);

        this.blackShape = new PIXI.Graphics();
        this.blackShape.beginFill(0x000000);
        this.blackShape.drawRect(0,0,windowWidth, windowHeight);
        APP.getHUD().addChild(this.blackShape);

        this.HPView = new BarView(200,20, 100,100);
        this.HPView.setPosition(20,150);
        APP.getHUD().addChild(this.HPView.getContent());

        this.MPView = new BarView(200,20, 100,100);
        this.MPView.setPosition(20,180);
        this.MPView.setFrontColor(0x0000FF);
        APP.getHUD().addChild(this.MPView.getContent());

        this.XPBar = new BarView(200,20, 100,100);
        this.XPBar.setPosition(20,210);
        this.XPBar.setFrontColor(0x555555);
        this.XPBar.setBackColor(0x000000);
        APP.getHUD().addChild(this.XPBar.getContent());

        TweenLite.to(this.blackShape, 1, {alpha:0});

        this.levelLabel = new PIXI.Text('', {fill:'white', align:'left', font:'bold 15px Arial'});
        console.log('HUD',APP.getHUD());
        APP.getHUD().addChild(this.levelLabel);

        // this.lifebar = new PIXI.Text('', {fill:'white', align:'center', font:'bold 20px Arial'});
        // APP.getHUD().addChild(this.lifebar);
        // this.lifebar.position.x = windowWidth - 200;

        this.minimap = new Minimap();
        APP.getHUD().addChild(this.minimap.getContent());
        var tempBox = null;
        for (var bi = 0; bi < 5; bi++) {
            tempBox = new BoxHUD1(80,50);
            tempBox.setPosition(550+bi*100, 20);
            APP.getHUD().addChild(tempBox.getContent());
            if(bi === 0){
                tempBox.setText('potion\n1');
            }else if(bi === 1){
                tempBox.setText('ether\n2');
            }else if(bi === 2){
                tempBox.setText('haste\n3');
            }else if(bi === 3){
                tempBox.setText('bolt1\n4');
            }else if(bi === 4){
                tempBox.setText('\n5');
            }
        }


        this.minimap.build();
        this.minimap.setPosition(windowWidth - this.minimap.getContent().width * 0.5 - 5, 10);
        this.minimap.getContent().scale.x = 0.5;
        this.minimap.getContent().scale.y = 0.5;



        
        // console.log(new BoundCollisionSystem(),'col system BoundCollisionSystem');

        this.collisionSystem = new BoundCollisionSystem(this, true);
        // console.log(this.collisionSystem,'col system');

        this.effectsContainer = new PIXI.DisplayObjectContainer();
        this.addChild(this.effectsContainer);

        this.levelGenerator = new LevelGenerator(this);
        this.resetLevel();


        // var octaveCount = options.octaveCount || 4;
        // var amplitude = options.amplitude || 0.1;
        // var persistence = options.persistence || 0.2;



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
    spell:function(){
        this.player.spell(APP.stage.getMousePosition());
    },
    //colocar isso dentro do personagem
    shoot:function(){
        this.player.shoot(APP.stage.getMousePosition());
    },
    update:function()
    {
       // console.log(this.mouseDown);


        if(this.player){
            this.getContent().position.x = windowWidth/2 - this.player.getPosition().x;
            this.getContent().position.y = windowHeight/2 - this.player.getPosition().y;
            this.player.fireFreqAcum --;

            if(this.mouseDown){
                if(this.player.fireFreqAcum <= 0){
                    this.shoot();
                }
            }

            this.entityLayer.collideChilds(this.player);
            this.environmentLayer.collideChilds(this.player);
            //zera as posições aqui, caso encontre uma porte, por isso a colisao antes
            // if(((this.player.getPosition().x + this.player.virtualVelocity.x < this.mapPosition.x ) && this.player.virtualVelocity.x < 0) ||
            //     ((this.player.getPosition().x + this.player.width + this.player.virtualVelocity.x > windowWidth -  this.mapPosition.x)&& this.player.virtualVelocity.x > 0)){
            //     this.player.virtualVelocity.x = 0;
            // }
            // if(((this.player.getPosition().y + this.player.virtualVelocity.y < this.mapPosition.y ) && this.player.virtualVelocity.y < 0) ||
            //     ((this.player.getPosition().y + this.player.height + this.player.virtualVelocity.y > windowHeight -  this.mapPosition.y)&& this.player.virtualVelocity.y > 0)){
            //     this.player.virtualVelocity.y = 0;
            // } ----<< OLD
            // RETIREI AS mapPosition, VER ACIMA COMO ERA
            if(((this.player.getPosition().x + this.player.virtualVelocity.x < this.mapPosition.x ) && this.player.virtualVelocity.x < 0) ||
                ((this.player.getPosition().x + this.player.width + this.player.virtualVelocity.x > this.levelBounds.x  +  this.mapPosition.x)&& this.player.virtualVelocity.x > 0)){
                this.player.virtualVelocity.x = 0;
            }
            if(((this.player.getPosition().y + this.player.virtualVelocity.y < this.mapPosition.y) && this.player.virtualVelocity.y < 0) ||
                ((this.player.getPosition().y + this.player.height + this.player.virtualVelocity.y > this.levelBounds.y +  this.mapPosition.y)&& this.player.virtualVelocity.y > 0)){
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
        if(this.levelGenerator){
            this.levelGenerator.update();
        }
       
        if(this.HPView && this.player){
            this.HPView.updateBar(Math.floor(this.playerModel.hp),Math.floor(this.playerModel.hpMax));
            this.HPView.setText(Math.floor(this.playerModel.hp)+'/ '+Math.floor(this.playerModel.hpMax));

            this.MPView.updateBar(Math.floor(this.playerModel.mp),Math.floor(this.playerModel.mpMax));
            this.MPView.setText(Math.floor(this.playerModel.mp)+'/ '+Math.floor(this.playerModel.mpMax));

            var tempXP = Math.floor(this.playerModel.xp)- Math.floor(this.playerModel.toBeforeLevel);
            var tempNext = Math.floor(this.playerModel.toNextLevel)- Math.floor(this.playerModel.toBeforeLevel);
            this.XPBar.updateBar(tempXP,tempNext);
            this.XPBar.setText(tempXP+'/ '+tempNext);
            // console.log(tempXP,tempNext);

            // this.lifebar.position.x = this.player.getPosition().x;
            // this.lifebar.position.y = this.player.getPosition().y - this.player.height / 2;
        }
        if(this.player && this.player.endLevel)
        {
            this.player.endLevel = false;
            this.currentNode = this.player.nextNode;
            this.currentNode.applySeed();
            this.currentPlayerSide = this.player.nextDoorSide;
            this.killLevel(this.resetLevel);
            this.player = null;
        }else if(this.player && this.player.playerDead)
        {
            // this.player.endLevel = false;
            // this.currentNode = this.player.nextNode;
            // this.currentPlayerSide = this.player.nextDoorSide;
            this.playerModel.resetPoints();
            this.killLevel(this.resetLevel);
            this.player = null;
        }
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
        this.blackShape.alpha = 1;
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
        this.player = new Player(this.playerModel);
        //console.log(this, 'ESSE É O ID DO LEVEL ATUAL -> ', this.currentNode);
        this.level = getRandomLevel();
        this.currentNode.applySeed();

        while(this.bgContainer.children.length){
            this.bgContainer.removeChildAt(0);
        }
        //seta o tamanho novamente, sempre
        this.marginTiles = {x:Math.floor(this.mapPosition.x/ 80), y:Math.floor(this.mapPosition.y/ 80)};
        if(this.currentNode.mode === 1){
            this.tempSizeTiles = {x: Math.floor(windowWidth / 80) + this.marginTiles.x , y:Math.floor(windowHeight / 80) +this.marginTiles.y};
        }else{
            this.tempSizeTiles = {x:14 + this.marginTiles.x + Math.floor(this.currentNode.getNextFloat() * 15) , y:7+ this.marginTiles.y+Math.floor(this.currentNode.getNextFloat() * 15)};
        }
        console.log(this.tempSizeTiles, this.mapPosition);
        this.levelBounds = {x: this.tempSizeTiles.x * 80 - Math.floor(this.mapPosition.x*2), y: this.tempSizeTiles.y * 80 - Math.floor(this.mapPosition.y*2)};

        if(this.currentNode.bg){
            this.bgContainer.addChild(this.currentNode.bg);
        }else{
            this.currentNode.bg = this.levelGenerator.createRoom();
        }

        this.levelGenerator.debugBounds();
        this.levelGenerator.createDoors();
        this.levelGenerator.createHordes();

        if(this.currentNode.getNextFloat() > 0.5){
            this.levelGenerator.createRain();
        }else{
            this.levelGenerator.removeRain();
        }

        this.getContent().position.x = -this.mapPosition.x;
        this.getContent().position.y = -this.mapPosition.y;

        
        this.player.build();
        // this.player.setSpellModel(APP.spellList[Math.floor(APP.spellList.length * Math.random())]);
        // this.player.setArmorModel(APP.armorList[Math.floor(APP.armorList.length * Math.random())]);
        // this.player.setWeaponModel(APP.weaponList[Math.floor(APP.weaponList.length * Math.random())]);
        // this.player.setRelicModel(APP.relicList[Math.floor(APP.relicList.length * Math.random())]);

        this.player.setSpellModel(APP.spellList[0]);
        this.player.setArmorModel(APP.armorList[0]);
        this.player.setWeaponModel(APP.weaponList[0]);
        this.player.setRelicModel(APP.relicList[Math.floor(APP.relicList.length * Math.random())]);

        this.levelLabel.setText('room id:'+this.currentNode.id+'   -    state:'+roomState+'   -    playerClass:'+this.playerModel.playerClass+
            '\nspell: '+this.player.spellModel.name +' - pow: '+this.player.spellModel.spellPower +' - mp: '+this.player.spellModel.mp+
            '\narmor: '+this.player.armorModel.name +' - def: '+this.player.armorModel.defenseArmor +' - magDef: '+this.player.armorModel.magicDefenseArmor+
            '\nweapon: '+this.player.weaponModel.name +' - pow: '+this.player.weaponModel.battlePower +' - hitRate: '+this.player.weaponModel.hitRate+
            '\nrelic: '+this.player.relicModel.name +' - stat: '+this.player.relicModel.status
            );

        // if(this.currentPlayerSide === 'up')
        // {
        //     this.player.setPosition(windowWidth/2,windowHeight - this.mapPosition.y- this.player.height);

        // }else if(this.currentPlayerSide === 'down')
        // {
        //     this.player.setPosition(windowWidth/2,this.mapPosition.y );
        // }else if(this.currentPlayerSide === 'left')
        // {
        //     this.player.setPosition(windowWidth - this.mapPosition.x - this.player.width ,windowHeight/2 - this.player.height/2);
        // }else if(this.currentPlayerSide === 'right')
        // {
        //     this.player.setPosition(this.mapPosition.x,windowHeight/2- this.player.height/2);
        // } ---<<< OLD



        
        
        
        this.entityLayer.addChild(this.player);


        console.log(this.currentPlayerSide,'this.currentPlayerSide');

        if(this.currentPlayerSide === 'up')
        {
            this.player.setPosition(this.levelBounds.x/2 + this.player.width,this.levelBounds.y + this.mapPosition.y- this.player.height);

        }else if(this.currentPlayerSide === 'down')
        {
            this.player.setPosition(this.levelBounds.x/2 + this.player.width,this.mapPosition.y+ this.mapPosition.y- this.player.height );
        }else if(this.currentPlayerSide === 'left')
        {
            this.player.setPosition(this.levelBounds.x + this.mapPosition.x - this.player.width ,this.levelBounds.y/2 + this.player.height);
        }else if(this.currentPlayerSide === 'right')
        {
            this.player.setPosition(this.mapPosition.x,this.levelBounds.y/2+ this.player.height);
        }else{
            this.player.setPosition(this.mapPosition.x + this.levelBounds.x/2,this.mapPosition.y + this.levelBounds.y/2);
        }
    },
    useItem:function(itemID){
        this.player.useItem(APP.itemList[itemID]);
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
/*jshint undef:false */
var GameScreen = AbstractScreen.extend({
    init: function (label) {
        MicroEvent.mixin(this);
        this._super(label);

        this.bgContainer = new PIXI.DisplayObjectContainer();
        this.addChild(this.bgContainer);

        
        this.currentAppModel = new AppModel();

        this.mainLayer = new Layer('main');

        this.entityLayer = new Layer('fire');
        this.environmentLayer = new Layer('environment');
        this.layerManager = new LayerManager();
        this.layerManager.addLayer(this.environmentLayer);

        this.layerManager.addLayer(this.entityLayer);
        this.addChild(this.layerManager);
        this.mapPosition = {x:200,y:200};

        this.tempSizeTiles = {x:12, y:10};
        this.mouseDown = false;

        var clss = 'thief';
        var rnd = Math.random();
        if(rnd < 0.33){
            clss = 'warrior';
        }
        else if(rnd < 0.66){
            clss = 'mage';
        }

        this.playerModel = APP.playersList[2].clone();
        // this.playerModel = APP.playersList[Math.floor(Math.random()*APP.playersList.length)].clone();

        this.playerModel.mp = 100;
        this.playerModel.mpMax = 100;

        this.playerReady = false;

        // this.playerModel.levelUp();
        // for (var i = 0; i < 20; i++) {
        //     this.playerModel.levelUp();
        // }
        // this.playerModel.logCSV();
        this.gameMadness = 1;
    },
    destroy: function () {
        this._super();
    },
    build: function () {
        this._super();
        var assetsToLoader = [
            '_dist/img/drop.png',
            '_dist/img/pixel.jpg',
            '_dist/img/HUD/bags/bag1.png',
            '_dist/img/HUD/box.png',
            '_dist/img/HUD/backWeapon.png',
            '_dist/img/HUD/backArmor.png',
            '_dist/img/HUD/backSpec.png',
            '_dist/img/HUD/backFairy.png',
            '_dist/img/HUD/backPlayerHUD.png',
            '_dist/img/HUD/levelContent.png',
            '_dist/img/HUD/backEquips.png',
            '_dist/img/levels/leftTop.png',
            '_dist/img/levels/rightTop.png',
            '_dist/img/levels/leftBottom.png',
            '_dist/img/levels/rightBottom.png',
            '_dist/img/levels/tile1.png',
            this.playerModel.graphicsData.icoImg,
            this.playerModel.graphicsData.srcImg,
            this.playerModel.graphicsData.srcJson
        ];
        for (var i = arrayThrees.length - 1; i >= 0; i--) {
            for (var j = arrayThrees[i].length - 1; j >= 0; j--) {
                assetsToLoader.push(arrayThrees[i][j]);
            }
        }
        for (var k = arrayRocks.length - 1; k >= 0; k--) {
            for (var l = arrayRocks[k].length - 1; l >= 0; l--) {
                assetsToLoader.push(arrayRocks[k][l]);
            }
        }
        this.loader = new PIXI.AssetLoader(assetsToLoader);
        this.initLoad();

        this.equips = [null,null,null];
    },
    onProgress:function()
    {
        this.loadPercent = ((this.loader.assetURLs.length - this.loader.loadCount) / this.loader.assetURLs.length);
        // if(this.loadText.parent){
        //     this.container.removeChild(this.loadText);
        // }
        if(this.loadText)
        {
            this.loadText.setText(Math.floor(this.loadPercent* 100) + '%');
        }
        // this.loadText = new PIXI.Text(Math.floor(this.loadPercent* 100) + "%", {fill:"black", align:"center"});;
        // this.container.addChild(this.loadText);
        this.loadText.position.x = this.canvasArea.x/2 - this.loadText.width/2;
        this.loadText.position.y = this.canvasArea.y/2 - this.loadText.height/2;

    },
    onAssetsLoaded:function()
    {
        this.loadText.setText('Generating Map');
        this._super();
        this.currentNode = APP.gen.firstNode;
        this.currentNode.applySeed();

        var self = this;

        this.vecPositions = [];

        //instacia gerenciador de inputs
        this.keyboardInput = new InputManager(this);

        this.graphDebug = new PIXI.Graphics();
        this.addChild(this.graphDebug);

        this.createHUD();

        this.blackShape = new PIXI.Graphics();
        this.blackShape.beginFill(0x000000);
        this.blackShape.drawRect(0,0,windowWidth, windowHeight);
        APP.getHUD().addChild(this.blackShape);

        //instancia o sistema de colisões
        this.collisionSystem = new BoundCollisionSystem(this, false);

        //adiciona uma camada de efeitos
        this.effectsContainer = new PIXI.DisplayObjectContainer();
        this.addChild(this.effectsContainer);

        //instancia o gerador de levels
        this.levelGenerator = new LevelGenerator(this);
        this.resetLevel();

        this.arrayBags = [];
    },
    //cria a HUD
    createHUD:function(){

        
        // this.fog.build();
        this.barsContainer = new PIXI.DisplayObjectContainer();
        this.playerHUD = new PlayerHUD('player');
        this.playerHUD.setPosition(15, - this.playerHUD.getContent().height + 100);
        this.barsContainer.addChild(this.playerHUD.getContent());
       
        this.levelContent = new SimpleSprite('_dist/img/HUD/levelContent.png');
        this.barsContainer.addChild(this.levelContent.getContent());

        this.humanityBar = new BarView(240,10, 100,100);
        this.humanityBar.setFrontColor(0xAD5587);
        this.humanityBar.setBackColor(0xFF8500);
        this.humanityBar.setPosition(windowWidth/2 - this.humanityBar.width/2,20);
        this.humanityBar.updateBar(50, 100);
        APP.getHUD().addChild(this.humanityBar.getContent());

        this.XPBar = new BarView(140,6, 100,100);
        this.XPBar.setFrontColor(0xAD5587);
        this.XPBar.setBackColor(0xFF8500);
        this.XPBar.setPosition(this.levelContent.getContent().width-1,0);
        this.barsContainer.addChild(this.XPBar.getContent());

        this.HPView = new LifeBarHUD(80,10, 100,100);
        this.HPView.setPosition(this.levelContent.getContent().width-1,6);
        this.barsContainer.addChild(this.HPView.getContent());

        this.MPView = new ManaBarHUD(80,10, 100,100);
        this.MPView.setPosition(this.levelContent.getContent().width - 7,35);
        this.barsContainer.addChild(this.MPView.getContent());

        this.levelLabel = new PIXI.Text('10', {fill:'black', align:'left', font:'16px Arial', wordWrap:true, wordWrapWidth:20});
        this.levelLabel.position.y = 9;
        this.levelLabel.position.x = 15;
        this.levelLabel.rotation = degreesToRadians(-3);

        this.barsContainer.addChild(this.levelLabel);
        this.barsContainer.position.x = 15;
        this.barsContainer.position.y = 100;
        this.barsContainer.rotation = degreesToRadians(-5);
        this.barsContainer.scale.x = 0.7;
        this.barsContainer.scale.y = 0.7;
        APP.getHUD().addChild(this.barsContainer);



        ///EQUIPS
        this.equips[0] = APP.weaponList[0];
        this.equips[1] = APP.armorList[0];
        // this.equips[2] = APP.relicList[1];

        this.equipsContainer = new PIXI.DisplayObjectContainer();
        this.backEquips = new SimpleSprite('_dist/img/HUD/backEquips.png');
        this.backEquips.setPosition(-12,-14);
        this.equipsContainer.addChild(this.backEquips.getContent());

        var contentEquipPos = {x:windowWidth - 110, y: 15};


        this.fairyEquip = new EquipsHUD('fairy');
        this.equipsContainer.addChild(this.fairyEquip.getContent());
        this.fairyEquip.setPosition(73,61);
        // this.weaponEquip.addModel(this.equips[1]);

        this.relicEquip = new EquipsHUD('relic');
        this.equipsContainer.addChild(this.relicEquip.getContent());
        this.relicEquip.setPosition(7,61);
        this.relicEquip.addModel(this.equips[2]);


        this.weaponEquip = new EquipsHUD('weapon');
        this.equipsContainer.addChild(this.weaponEquip.getContent());
        this.weaponEquip.setPosition(0,0);
        this.weaponEquip.addModel(this.equips[0]);

        this.armorEquip = new EquipsHUD('armor');
        this.equipsContainer.addChild(this.armorEquip.getContent());
        this.armorEquip.setPosition(73,4);
        this.armorEquip.addModel(this.equips[1]);

        

        APP.getHUD().addChild(this.equipsContainer);
        this.equipsContainer.position.x = contentEquipPos.x;
        this.equipsContainer.position.y = contentEquipPos.y;

        this.equipsContainer.scale.x = 0.7;
        this.equipsContainer.scale.y = 0.7;

        //adiciona os inventory
        this.inventory =
        [null,null,null,null,
        null,null,null,null,
        null,null,null,null,
        null,null,null];
        this.inventoryContainer = new PIXI.DisplayObjectContainer();
        var tempBox = null;
        var lineAccum = 0;
        var rowAccum = 0;
        var inventoryPosition = {x: (realWindowWidth / 2) - (46 * this.inventory.length) / 2 + 10, y:windowHeight - 50};
       
        for (var i = 0; i < this.inventory.length; i++) {
            tempBox = new BoxHUD1(42,36, 3, i);
            tempBox.setPosition(rowAccum*46, lineAccum * 42);
            rowAccum ++;
            this.inventoryContainer.addChild(tempBox.getContent());
           
            this.inventory[i] = tempBox;
        }

        this.inventory[0].addModel(APP.itemList[0]);
        this.inventory[1].addModel(APP.itemList[1]);
        this.inventory[2].addModel(APP.itemList[2]);
        this.inventory[3].addModel(APP.spellList[0]);
        this.inventory[4].addModel(APP.spellList[1]);
        this.inventory[5].addModel(APP.spellList[2]);
        this.inventory[9].addModel(APP.weaponList[2]);
        this.inventory[10].addModel(APP.relicList[2]);
        this.inventory[11].addModel(APP.relicList[1]);

        APP.getHUD().addChild(this.inventoryContainer);
        this.inventoryContainer.position.x = inventoryPosition.x;
        this.inventoryContainer.position.y = inventoryPosition.y;

    },
    addBag:function(pos, model){
        var tempBag = new Bag(model, this.player);
        tempBag.build();
        tempBag.setPosition(pos.x, pos.y);
        this.entityLayer.addChild(tempBag);
        this.arrayBags.push(tempBag);
    },
    addModelInventory:function(model){
        for (var i = 0; i < this.inventory.length; i++) {
            if(this.inventory[i].model && this.inventory[i].model.name === model.name && model.quant && this.inventory[i].model.quant < 9){
                console.log(model.quant, this.inventory[i].model.quant);
                var tempModel = this.inventory[i].model.clone();
                tempModel.quant += model.quant;
                // this.inventory[i].model.quant += model.quant;
                this.inventory[i].model = tempModel;//addModel(tempModel);
                this.inventory[i].updateQuant();
                return true;
            }
        }
        for (i = 0; i < this.inventory.length; i++) {
            if(!this.inventory[i].model){
                this.inventory[i].addModel(model);
                return true;
            }
        }
        return false;
    },
    //verifica qual model está no atalho e executa a ação daquele model
    useShortcut:function(id){
        console.log(this.inventory[id].model);
        if(this.inventory[id] && this.inventory[id].model){
            if(this.inventory[id].model instanceof ItemModel){
                if(this.useItem(this.inventory[id].model)){
                    this.inventory[id].model.quant --;
                    if(this.inventory[id].model.quant <= 0){
                        this.inventory[id].removeModel();
                    }else
                    {
                        this.inventory[id].updateQuant();
                    }
                }
            }else if(this.inventory[id].model instanceof SpellModel){
                this.spell(this.inventory[id].model);
            }
        }
    },
    //atualiza o inventorio
    updatePlayerEquips:function(){
        if(this.weaponEquip && this.weaponEquip.model && this.weaponEquip.model !== this.equips[0]){
            this.equips[0] = this.weaponEquip.model;
        }
        if(this.armorEquip && this.armorEquip.model && this.armorEquip.model !== this.equips[0]){
            this.equips[1] = this.armorEquip.model;
        }
        if(this.relicEquip && this.relicEquip.model && this.relicEquip.model !== this.equips[0]){
            this.equips[2] = this.relicEquip.model;
        }
        if(this.equips[0]){
            this.player.setWeaponModel(this.equips[0]);
        }
        if(this.equips[1]){
            this.player.setArmorModel(this.equips[1]);
        }
        if(this.equips[2]){
            this.player.setRelicModel(this.equips[2]);
        }
        this.playerHUD.addModel(this.playerModel, this.player);

    },
    //usa um item
    useItem:function(itemModel){
        return this.player.useItem(itemModel);
    },
    //dispara um spell
    spell:function(spellModel){
        this.player.spell(APP.stage.getMousePosition(), spellModel);
    },
    //colocar isso dentro do personagem
    shoot:function(){
        this.player.shoot(APP.stage.getMousePosition(), this.player.weaponModel);
    },
    //update do game
    update:function()
    {
        if(this.playerReady && this.player !== undefined && this.player !== null){
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
            this.boundsCollision();

            //collide os tiros com as entidades
            for (var i = 0; i < this.entityLayer.childs.length; i++) {
                if(this.entityLayer.childs[i].type === 'fire' || this.entityLayer.childs[i].type === 'bag'){
                    this.entityLayer.collideChilds(this.entityLayer.childs[i]);
                }
                if(this.entityLayer.childs[i].type === 'environment'){
                    if(APP.getGame().player && pointDistance(APP.getGame().player.getPosition().x, APP.getGame().player.getPosition().y, this.entityLayer.childs[i].getPosition().x, this.entityLayer.childs[i].getPosition().y) < windowHeight){
                        this.entityLayer.childs[i].collidable = true;
                        this.entityLayer.childs[i].updateable = true;

                    }else{
                        this.entityLayer.childs[i].collidable = false;
                        this.entityLayer.childs[i].updateable = false;
                    }
                }
            }
            //atualiza o sistema de colisão
            this.collisionSystem.applyCollision(this.entityLayer.childs, this.entityLayer.childs);

            if(this.minimapHUD){
                this.minimapHUD.update(this.getPlayerTilePos());
            }
            var dist = 9999;
            var bagNear = null;
            if(this.arrayBags){
                for (i = this.arrayBags.length - 1; i >= 0; i--) {
                    var distance = pointDistance(this.arrayBags[i].getPosition().x,
                        this.arrayBags[i].getPosition().y,
                        this.player.getPosition().x + this.player.centerPosition.x,
                        this.player.getPosition().y + this.player.centerPosition.y);
                    if(distance < this.arrayBags[i].range && !this.arrayBags[i].kill)
                    {
                        if(distance < dist){
                            bagNear = this.arrayBags[i];
                            dist = distance;
                        }
                    }
                    if(bagNear){
                        APP.getHUDController().showBagContent(bagNear);
                    }else{
                        APP.getHUDController().hideBagContent();
                    }
                    
                }
            }
        }

        this._super();

        this.entityLayer.getContent().children.sort(this.depthCompare);

        //update em tudo que for atualizavel no level generator
        if(this.levelGenerator){
            this.levelGenerator.update();
        }

        if(this.HPView && this.player){
            this.updateHUD();
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
            this.entityLayer.updateable = false;
        }
    },
    //atualiza a HUD
    updateHUD:function(){
        this.HPView.updateBar(Math.floor(this.playerModel.hp),Math.floor(this.playerModel.hpMax));
        this.HPView.setText(Math.floor(this.playerModel.hp)+'/ '+Math.floor(this.playerModel.hpMax));

        if(this.playerModel.level < 10)
        {
            this.levelLabel.setText(' '+this.playerModel.level);
        }else{
            this.levelLabel.setText(this.playerModel.level);
        }

        this.MPView.updateBar(Math.floor(this.playerModel.mp),Math.floor(this.playerModel.mpMax));
        this.MPView.setText(Math.floor(this.playerModel.mp)+'/ '+Math.floor(this.playerModel.mpMax));

        var tempXP = Math.floor(this.playerModel.xp)- Math.floor(this.playerModel.toBeforeLevel);
        var tempNext = Math.floor(this.playerModel.toNextLevel)- Math.floor(this.playerModel.toBeforeLevel);
        this.XPBar.updateBar(tempXP,tempNext);

        this.humanityBar.updateBar(this.gameMadness,2);

        // this.XPBar.setText(tempXP+'/ '+tempNext);
    },
    getPlayerTilePos:function(){
        if(this.playerReady && this.player){
            var centerPositionPlayer = {x:this.player.getPosition().x + this.player.centerPosition.x,
                y:this.player.getPosition().y + this.player.centerPosition.y};
            var tilePosition = {x:Math.floor(centerPositionPlayer.x / APP.nTileSize),y:Math.floor(centerPositionPlayer.y / APP.nTileSize)};
            return tilePosition;
        }
        return null;
    },
    getPlayerTileType:function(){
        var pos = this.getPlayerTilePos();
        return this.currentNode.mapDataLayer1[pos.x][pos.y].biome;
    },
    //faz a colisão por tile map
    boundsCollision:function(){
        // console.log(this.currentNode.mapData[0], 'data');
        if(this.currentNode.mapData && this.player){
            for (var i = this.entityLayer.childs.length - 1; i >= 0; i--) {
                tempEntity = this.entityLayer.childs[i];
                if(tempEntity.type !== 'fire' && tempEntity.type !== 'bag'  && tempEntity.type !== 'fairy'){
                    var centerPositionPlayer = {x:tempEntity.getPosition().x + tempEntity.centerPosition.x,
                        y:tempEntity.getPosition().y + tempEntity.centerPosition.y};


                    var nextStep = {x:centerPositionPlayer.x + tempEntity.virtualVelocity.x,
                        y:centerPositionPlayer.y + tempEntity.virtualVelocity.y};


                    var nextStepDown = {x:nextStep.x,y:nextStep.y + tempEntity.height};
                    var nextStepUp = {x:nextStep.x,y:nextStep.y - tempEntity.height};
                    var nextStepLeft = {x:nextStep.x - tempEntity.width,y:nextStep.y};
                    var nextStepRight = {x:nextStep.x + tempEntity.width,y:nextStep.y};

                    // var nextStepDown = {x:nextStep.x,y:nextStep.y + tempEntity.range};
                    // var nextStepUp = {x:nextStep.x,y:nextStep.y - tempEntity.range};
                    // var nextStepLeft = {x:nextStep.x - tempEntity.range,y:nextStep.y};
                    // var nextStepRight = {x:nextStep.x + tempEntity.range,y:nextStep.y};


                    var tilePositionDown = {x:Math.floor(nextStepDown.x / APP.nTileSize),y:Math.floor(nextStepDown.y / APP.nTileSize)};
                    var tilePositionUp = {x:Math.floor(nextStepUp.x / APP.nTileSize),y:Math.floor(nextStepUp.y / APP.nTileSize)};
                    var tilePositionLeft = {x:Math.floor(nextStepLeft.x / APP.nTileSize),y:Math.floor(nextStepLeft.y / APP.nTileSize)};
                    var tilePositionRight = {x:Math.floor(nextStepRight.x / APP.nTileSize),y:Math.floor(nextStepRight.y / APP.nTileSize)};

                    var pass = this.currentNode.mapData[tilePositionDown.x][tilePositionDown.y] !== undefined && this.currentNode.mapData[tilePositionDown.x][tilePositionDown.y] !== undefined;
                    if(pass &&
                        this.currentNode.mapData[tilePositionDown.x][tilePositionDown.y].biome === 'OCEAN' && tempEntity.virtualVelocity.y > 0){
                        tempEntity.virtualVelocity.y = 0;
                    }

                    pass = this.currentNode.mapData[tilePositionUp.x][tilePositionUp.y] !== undefined && this.currentNode.mapData[tilePositionUp.x][tilePositionUp.y] !== undefined;
                    if(pass &&
                        this.currentNode.mapData[tilePositionUp.x][tilePositionUp.y].biome === 'OCEAN' && tempEntity.virtualVelocity.y < 0){
                        tempEntity.virtualVelocity.y = 0;
                    }
                    
                    pass = this.currentNode.mapData[tilePositionRight.x][tilePositionRight.y] !== undefined && this.currentNode.mapData[tilePositionRight.x][tilePositionRight.y] !== undefined;
                    if(this.currentNode.mapData[tilePositionRight.x][tilePositionRight.y] &&
                        this.currentNode.mapData[tilePositionRight.x][tilePositionRight.y].biome === 'OCEAN' && tempEntity.virtualVelocity.x > 0){
                        tempEntity.virtualVelocity.x = 0;
                    }

                    pass = this.currentNode.mapData[tilePositionLeft.x][tilePositionLeft.y] !== undefined && this.currentNode.mapData[tilePositionLeft.x][tilePositionLeft.y] !== undefined;
                    if(this.currentNode.mapData[tilePositionLeft.x][tilePositionLeft.y] &&
                        this.currentNode.mapData[tilePositionLeft.x][tilePositionLeft.y].biome === 'OCEAN' && tempEntity.virtualVelocity.x < 0){
                        tempEntity.virtualVelocity.x = 0;
                    }
                }
            }
        }
    },
    //destroy o level
    killLevel:function(callback){
        var self = this;

        this.playerReady = false;

        for (var k = this.entityLayer.childs.length - 1; k >= 0; k--) {
            this.entityLayer.childs[k].preKill();
        }

        for (var t = this.environmentLayer.childs.length - 1; t >= 0; t--) {
            this.environmentLayer.childs[t].preKill();
        }
        TweenLite.to(this.blackShape, 0.5, {alpha:1});

        setTimeout(function(){
            self.resetLevel();
        }, 700);

    },
    //reseta o level
    resetLevel:function()
    {
        this.mouseDown = false;
        this.keyboardInput.vecPositions = [];
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
        this.level = getRandomLevel();
        this.currentNode.applySeed();

        while(this.bgContainer.children.length){
            this.bgContainer.removeChildAt(0);
        }
        //seta o tamanho novamente, sempre
        
        // console.log(this.tempSizeTiles, this.mapPosition);
        // this.levelBounds = {x: this.tempSizeTiles.x * APP.nTileSize - Math.floor(this.mapPosition.x*2), y: this.tempSizeTiles.y * APP.nTileSize - Math.floor(this.mapPosition.y*2)};
        var i = 0;
        var j = 0;
        var sizeHelper = 150;
        if(this.currentNode.bg){
            this.bgContainer.addChild(this.currentNode.bg);
            this.bgContainer.addChild(this.currentNode.bgLayer1);
            this.bgContainer.addChild(this.currentNode.bgLayer2);
            this.bgContainer.addChild(this.currentNode.bgLayer3);
        }else{
            this.marginTiles = {x:Math.floor(this.mapPosition.x/ APP.nTileSize) + sizeHelper, y:Math.floor(this.mapPosition.y/ APP.nTileSize) + sizeHelper};
            if(this.currentNode.mode === 1){
                this.tempSizeTiles = {x: Math.floor(windowWidth / APP.nTileSize) + this.marginTiles.x , y:Math.floor(windowHeight / APP.nTileSize) +this.marginTiles.y};
            }else{
                this.tempSizeTiles = {x:100 + this.marginTiles.x + Math.floor(this.currentNode.getNextFloat() * 15) , y:120+ this.marginTiles.y+Math.floor(this.currentNode.getNextFloat() * 15)};
            }
            this.currentNode.bg = this.levelGenerator.createRoom();
            this.bgContainer.addChild(this.currentNode.backLayer);
            this.bgContainer.addChild(this.currentNode.bg);
            this.bgContainer.addChild(this.currentNode.bgLayer1);
            this.bgContainer.addChild(this.currentNode.bgLayer2);
            this.bgContainer.addChild(this.currentNode.bgLayer3);
        }

        // var maskk = new PIXI.Graphics();
        // maskk.beginFill(0);
        // maskk.drawRect(0,0,windowWidth,windowHeight);
        // maskk.endFill();
        // this.getContent().parent.addChild(maskk);
        //this.bgContainer.mask = maskk;
        // this.bgContainer

        this.levelBounds= {x: this.currentNode.mapData.length * APP.nTileSize, y: this.currentNode.mapData[0].length * APP.nTileSize};
        


        if(this.minimapHUD)
        {
            this.minimapHUD.getContent().parent.removeChild(this.minimapHUD.getContent());
            this.minimapHUD = null;
        }
        // this.minimapHUD = new MapHUD();
        // this.minimapHUD.build(this.currentNode);
        // APP.getHUD().addChild(this.minimapHUD.getContent());
        // var mapPosition = {x:20, y:realWindowHeight - this.minimapHUD.height - 30};
        // this.minimapHUD.setPosition(mapPosition.x,mapPosition.y);

            // windowWidth + (realWindowWidth - windowWidth)/2 - this.minimapHUD.width/2, realWindowHeight - this.minimapHUD.height - 30);

        // this.levelGenerator.debugBounds();
        // this.levelGenerator.createDoors();
        this.levelGenerator.putObstacles();

        if(this.currentNode.getNextFloat() > 0.5){
            this.levelGenerator.createRain();
        }else{
            this.levelGenerator.removeRain();
        }

        var monstersToLoaded = [];
        var monstersAssets = [];

        if(this.currentNode.mode !== 1){
            //definir um valor de level de hora a ser gerado, pode ser o ID ou a distancia até o centro
            //ou até mesmo o proprio level do player
            monstersToLoaded = this.levelGenerator.createHordes();
            for (i = monstersToLoaded.length - 1; i >= 0; i--) {
                if(monstersToLoaded[i].monsterModel.fire.srcImg){
                    monstersAssets.push(monstersToLoaded[i].monsterModel.fire.srcImg);
                }
                if(monstersToLoaded[i].monsterModel.srcJson){
                    monstersAssets.push(monstersToLoaded[i].monsterModel.srcJson);
                }
                if(monstersToLoaded[i].monsterModel.srcImg){
                    monstersAssets.push(monstersToLoaded[i].monsterModel.srcImg);
                }
            }
            if(monstersToLoaded.length){
                var monsterLoader = new PIXI.AssetLoader(monstersAssets);
                var self = this;
                monsterLoader.onComplete = function() {
                    for (var i = monstersToLoaded.length - 1; i >= 0; i--) {
                        monstersToLoaded[i].build();
                        monstersToLoaded[i].setPosition(monstersToLoaded[i].initialPosition.x, monstersToLoaded[i].initialPosition.y);
                        self.entityLayer.addChild(monstersToLoaded[i]);
                    }
                    self.initPlayer();
                };
                monsterLoader.onProgress = function() {
                    console.log('onProgress');
                    // self.onProgress();
                };
                monsterLoader.load();
            }
            else
            {
                this.initPlayer();
            }
        }
        else
        {
            this.initPlayer();
        }
    },
    initPlayer:function() {

        this.blackShape.alpha = 1;
        TweenLite.to(this.blackShape, 1, {alpha:0});

        this.playerReady = true;
        this.entityLayer.updateable = true;

        this.player.build();


        // this.player.setSpellModel(APP.spellList[Math.floor(APP.spellList.length * Math.random())]);
        // this.player.setArmorModel(APP.armorList[Math.floor(APP.armorList.length * Math.random())]);
        // this.player.setWeaponModel(APP.weaponList[Math.floor(APP.weaponList.length * Math.random())]);
        // this.player.setRelicModel(APP.relicList[Math.floor(APP.relicList.length * Math.random())]);

        // this.player.setSpellModel(APP.spellList[1]);
        // this.player.setArmorModel(APP.armorList[0]);
        // this.player.setWeaponModel(APP.weaponList[0]);
        //this.player.setRelicModel(APP.relicList[Math.floor(APP.relicList.length * Math.random())]);

       

        this.entityLayer.addChild(this.player);


        if(this.currentPlayerSide === 'up')
        {
            //this.player.setPosition(this.levelBounds.x/2 + this.player.width,this.levelBounds.y + this.mapPosition.y- this.player.height);
        }else if(this.currentPlayerSide === 'down')
        {
            //this.player.setPosition(this.levelBounds.x/2 + this.player.width,this.mapPosition.y+ this.mapPosition.y- this.player.height );
        }else if(this.currentPlayerSide === 'left')
        {
            //this.player.setPosition(this.levelBounds.x + this.mapPosition.x - this.player.width ,this.levelBounds.y/2 + this.player.height);
        }else if(this.currentPlayerSide === 'right')
        {
            //this.player.setPosition(this.mapPosition.x,this.levelBounds.y/2+ this.player.height);
        }else{
            //this.player.setPosition(this.mapPosition.x + this.levelBounds.x/2,this.mapPosition.y + this.levelBounds.y/2);
        }

        this.player.setPosition(this.levelBounds.x/2,this.levelBounds.y/2);
        // this.addBag({x:this.levelBounds.x/2, y:this.levelBounds.y/2});


        //ADICIONA FADINHA
        // this.fairy1 = new Fairy(this.player);
        // this.fairy1.build();
        // this.entityLayer.addChild(this.fairy1);
        // this.fairy1.setPosition(this.player.getPosition().x, this.player.getPosition().y);

        // this.entityLayer.addChild(this.simpleEnemy);
        // this.equips[0] = this.player.weaponModel;
        // this.equips[1] = this.player.armorModel;
        // this.equips[2] = this.player.relicModel;

        this.updatePlayerEquips();

        // console.log(this.levelBounds.x/2,this.levelBounds.y/2);
    },
    //atualiza o z index da layer
    depthCompare:function(a,b) {
        // if(a.type === 'environment' && b.type === 'environment'){
        //     return 0;
        // }

        var yA = a.position.y;
        var yB = b.position.y;
        if(yA === yB){
            return 0;
        }
        if(a.noDepth || b.noDepth){
            return 0;
        }
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
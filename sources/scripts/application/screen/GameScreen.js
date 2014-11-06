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

        this.playerModel = new PlayerModel(clss);

        this.playerModel.mp = 8000;
        this.playerModel.mpMax = 8000;
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

        //instacia gerenciador de inputs
        this.keyboardInput = new InputManager(this);

        this.graphDebug = new PIXI.Graphics();
        this.addChild(this.graphDebug);

        this.blackShape = new PIXI.Graphics();
        this.blackShape.beginFill(0x000000);
        this.blackShape.drawRect(0,0,windowWidth, windowHeight);
        APP.getHUD().addChild(this.blackShape);


        this.createHUD();

        //instancia o sistema de colisões
        this.collisionSystem = new BoundCollisionSystem(this, false);

        //adiciona uma camada de efeitos
        this.effectsContainer = new PIXI.DisplayObjectContainer();
        this.addChild(this.effectsContainer);

        //instancia o gerador de levels
        this.levelGenerator = new LevelGenerator(this);
        this.resetLevel();


    },
    //cria a HUD
    createHUD:function(){
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

        this.levelLabel = new PIXI.Text('', {fill:'white', align:'left', font:'bold 15px Arial'});
        APP.getHUD().addChild(this.levelLabel);

        //adiciona os shortcuts
        this.shortcuts = [null,null,null,null,null,null];
        this.shortcuts[0] = APP.itemList[0];
        this.shortcuts[1] = APP.itemList[1];
        this.shortcuts[2] = APP.itemList[2];
        this.shortcuts[3] = APP.spellList[Math.floor(APP.spellList.length * Math.random())];
        this.shortcuts[4] = APP.spellList[Math.floor(APP.spellList.length * Math.random())];
        this.shortcuts[5] = APP.spellList[Math.floor(APP.spellList.length * Math.random())];
        var tempBox = null;
        var icosTotalWidth = (120 * this.shortcuts.length);
        for (var i = 0; i < this.shortcuts.length; i++) {
            tempBox = new BoxHUD1(100,70, 3);
            tempBox.setPosition(windowWidth / 2 - icosTotalWidth / 2 +i*120, windowHeight - 90);
            APP.getHUD().addChild(tempBox.getContent());
            var tempText = '';
            var shortcut = i + 1;
            if(i === 3){
                shortcut = 'Q';
            }
            else if(i === 4){
                shortcut = 'E';
            }
            else if(i === 5){
                shortcut = 'SPACE';
            }
            if(this.shortcuts[i]){
                tempBox.addImage(this.shortcuts[i].icoImg);
                tempText = this.shortcuts[i].name;
                tempBox.addModel(this.shortcuts[i]);
            }
            tempBox.setText(tempText + '\n\n\n' + shortcut);
        }

        this.equips = [null,null,null];
        this.equipsBoxHud = [];
        for (i = 0; i < this.equips.length; i++) {
            tempBox = new BoxHUD1(100,70,1);
            tempBox.setPosition(windowWidth - 120, windowHeight / 2.5 + 90*i);
            if(i === 0){
                tempBox.setText('Weapon');
            }else if(i === 1){
                tempBox.setText('Armor');
            }else if(i === 2){
                tempBox.setText('Relic');
            }
            APP.getHUD().addChild(tempBox.getContent());
            this.equipsBoxHud.push(tempBox);
        }

        //adiciona minimap
        this.minimap = new Minimap();
        APP.getHUD().addChild(this.minimap.getContent());
        this.minimap.build();
        this.minimap.setPosition(windowWidth - this.minimap.getContent().width * 0.5 - 5, 10);
        this.minimap.getContent().scale.x = 0.5;
        this.minimap.getContent().scale.y = 0.5;
    },
    //verifica qual model está no atalho e executa a ação daquele model
    useShortcut:function(id){
        if(this.shortcuts[id]){
            if(this.shortcuts[id] instanceof ItemModel){
                this.useItem(this.shortcuts[id]);
            }else if(this.shortcuts[id] instanceof SpellModel){
                this.spell(this.shortcuts[id]);
            }
        }
    },
    //atualiza o inventorio
    updateInventory:function(){
        this.equips[0] = this.player.weaponModel;
        this.equips[1] = this.player.armorModel;
        this.equips[2] = this.player.relicModel;

        for (var i = 0; i < this.equipsBoxHud.length; i++) {
            this.equipsBoxHud[i].addModel(this.equips[i]);
        }
    },
    //usa um item
    useItem:function(itemModel){
        this.player.useItem(itemModel);
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
            this.boundsCollision();

            //collide os tiros com as entidades
            for (var i = 0; i < this.entityLayer.childs.length; i++) {
                if(this.entityLayer.childs[i].type === 'fire'){
                    this.entityLayer.collideChilds(this.entityLayer.childs[i]);
                }
            }
            //atualiza o sistema de colisão
            this.collisionSystem.applyCollision(this.entityLayer.childs, this.entityLayer.childs);
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
        }
    },
    //atualiza a HUD
    updateHUD:function(){
        this.HPView.updateBar(Math.floor(this.playerModel.hp),Math.floor(this.playerModel.hpMax));
        this.HPView.setText(Math.floor(this.playerModel.hp)+'/ '+Math.floor(this.playerModel.hpMax));

        this.MPView.updateBar(Math.floor(this.playerModel.mp),Math.floor(this.playerModel.mpMax));
        this.MPView.setText(Math.floor(this.playerModel.mp)+'/ '+Math.floor(this.playerModel.mpMax));

        var tempXP = Math.floor(this.playerModel.xp)- Math.floor(this.playerModel.toBeforeLevel);
        var tempNext = Math.floor(this.playerModel.toNextLevel)- Math.floor(this.playerModel.toBeforeLevel);
        this.XPBar.updateBar(tempXP,tempNext);
        this.XPBar.setText(tempXP+'/ '+tempNext);
        //atualiza label
        if(this.levelLabel){
            this.levelLabel.setText('room id:'+this.currentNode.id+'   -    state:'+'roomState'+'   -    playerClass:'+this.playerModel.playerClass+
                '\nLEVEL: '+this.playerModel.level
                );
        }
    },
    //faz a colisão por tile map
    boundsCollision:function(){
        for (var i = this.entityLayer.childs.length - 1; i >= 0; i--) {
            tempEntity = this.entityLayer.childs[i];
            if(tempEntity.type !== 'fire'){
        
                var centerPositionPlayer = {x:tempEntity.getPosition().x + tempEntity.centerPosition.x,
                    y:tempEntity.getPosition().y + tempEntity.centerPosition.y};


                var nextStep = {x:centerPositionPlayer.x + tempEntity.virtualVelocity.x,
                    y:centerPositionPlayer.y + tempEntity.virtualVelocity.y};


                var nextStepDown = {x:nextStep.x,y:nextStep.y + tempEntity.height};
                var nextStepUp = {x:nextStep.x,y:nextStep.y - tempEntity.height};
                var nextStepLeft = {x:nextStep.x - tempEntity.width,y:nextStep.y};
                var nextStepRight = {x:nextStep.x + tempEntity.width,y:nextStep.y};


                var tilePositionDown = {x:Math.floor(nextStepDown.x / APP.nTileSize),y:Math.floor(nextStepDown.y / APP.nTileSize)};
                var tilePositionUp = {x:Math.floor(nextStepUp.x / APP.nTileSize),y:Math.floor(nextStepUp.y / APP.nTileSize)};
                var tilePositionLeft = {x:Math.floor(nextStepLeft.x / APP.nTileSize),y:Math.floor(nextStepLeft.y / APP.nTileSize)};
                var tilePositionRight = {x:Math.floor(nextStepRight.x / APP.nTileSize),y:Math.floor(nextStepRight.y / APP.nTileSize)};

                var pass = this.currentNode.mapData[tilePositionDown.x] &&this.currentNode.mapData[tilePositionDown.x][tilePositionDown.y];
                if(pass &&
                    this.currentNode.mapData[tilePositionDown.x][tilePositionDown.y] === 'OCEAN' && tempEntity.virtualVelocity.y > 0){
                    tempEntity.virtualVelocity.y = 0;
                }

                pass = this.currentNode.mapData[tilePositionUp.x] &&this.currentNode.mapData[tilePositionUp.x][tilePositionUp.y];
                if(pass &&
                    this.currentNode.mapData[tilePositionUp.x][tilePositionUp.y] === 'OCEAN' && tempEntity.virtualVelocity.y < 0){
                    tempEntity.virtualVelocity.y = 0;
                }
                
                pass = this.currentNode.mapData[tilePositionRight.x] &&this.currentNode.mapData[tilePositionRight.x][tilePositionRight.y];
                if(this.currentNode.mapData[tilePositionRight.x][tilePositionRight.y] &&
                    this.currentNode.mapData[tilePositionRight.x][tilePositionRight.y] === 'OCEAN' && tempEntity.virtualVelocity.x > 0){
                    tempEntity.virtualVelocity.x = 0;
                }

                pass = this.currentNode.mapData[tilePositionLeft.x] &&this.currentNode.mapData[tilePositionLeft.x][tilePositionLeft.y];
                if(this.currentNode.mapData[tilePositionLeft.x][tilePositionLeft.y] &&
                    this.currentNode.mapData[tilePositionLeft.x][tilePositionLeft.y] === 'OCEAN' && tempEntity.virtualVelocity.x < 0){
                    tempEntity.virtualVelocity.x = 0;
                }
            }
        }
    },
    //destroy o level
    killLevel:function(callback){
        var self = this;
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
        this.level = getRandomLevel();
        this.currentNode.applySeed();

        while(this.bgContainer.children.length){
            this.bgContainer.removeChildAt(0);
        }
        //seta o tamanho novamente, sempre
        
        // console.log(this.tempSizeTiles, this.mapPosition);
        // this.levelBounds = {x: this.tempSizeTiles.x * APP.nTileSize - Math.floor(this.mapPosition.x*2), y: this.tempSizeTiles.y * APP.nTileSize - Math.floor(this.mapPosition.y*2)};

        if(this.currentNode.bg){
            this.bgContainer.addChild(this.currentNode.bg);
        }else{
            this.marginTiles = {x:Math.floor(this.mapPosition.x/ APP.nTileSize), y:Math.floor(this.mapPosition.y/ APP.nTileSize)};
            if(this.currentNode.mode === 1){
                this.tempSizeTiles = {x: Math.floor(windowWidth / APP.nTileSize) + this.marginTiles.x , y:Math.floor(windowHeight / APP.nTileSize) +this.marginTiles.y};
            }else{
                this.tempSizeTiles = {x:24 + this.marginTiles.x + Math.floor(this.currentNode.getNextFloat() * 15) , y:20+ this.marginTiles.y+Math.floor(this.currentNode.getNextFloat() * 15)};
            }
            this.currentNode.bg = this.levelGenerator.createRoom();
        }

        this.levelBounds= {x: this.currentNode.bg.width, y: this.currentNode.bg.height};

        // this.levelGenerator.debugBounds();
        this.levelGenerator.createDoors();
        this.levelGenerator.putObstacles();
        if(this.currentNode.mode !== 1){
            //definir um valor de level de hora a ser gerado, pode ser o ID ou a distancia até o centro
            //ou até mesmo o proprio level do player
            this.levelGenerator.createHordes();
        }

        if(this.currentNode.getNextFloat() > 0.5){
            this.levelGenerator.createRain();
        }else{
            this.levelGenerator.removeRain();
        }

        
        this.player.build();
        // this.player.setSpellModel(APP.spellList[Math.floor(APP.spellList.length * Math.random())]);
        // this.player.setArmorModel(APP.armorList[Math.floor(APP.armorList.length * Math.random())]);
        // this.player.setWeaponModel(APP.weaponList[Math.floor(APP.weaponList.length * Math.random())]);
        // this.player.setRelicModel(APP.relicList[Math.floor(APP.relicList.length * Math.random())]);

        // this.player.setSpellModel(APP.spellList[1]);
        this.player.setArmorModel(APP.armorList[0]);
        this.player.setWeaponModel(APP.weaponList[0]);
        this.player.setRelicModel(APP.relicList[Math.floor(APP.relicList.length * Math.random())]);

        // this.equips = [null,null,null];
        this.equips[0] = this.player.weaponModel;
        this.equips[1] = this.player.armorModel;
        this.equips[2] = this.player.relicModel;
        this.updateInventory();

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
    },
    //atualiza o z index da layer
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
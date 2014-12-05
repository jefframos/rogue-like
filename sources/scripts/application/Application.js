/*jshint undef:false */
var Application = AbstractApplication.extend({
	init:function(){

        this._super(windowWidth, windowHeight);
        this.stage.setBackgroundColor(0x301f42);
        this.stage.removeChild(this.loadText);
        this.isMobile = testMobile();
        this.appContainer = document.getElementById('rect');
        this.id = parseInt(Math.random() * 100000000000);


        this.gen = new DungeonGenerator();
        this.gen.generate(Math.random() * 0xFFFFFF, 1, [10, 15], [12,12], 5);
        // this.gen.log();

        //size utilizado no tilemap
        this.nTileSize = 50;
        //size utilizado nos personagens
        this.tileSize = {x: this.nTileSize, y:  this.nTileSize};
        
	},
    getHUDController:function(){
        return this.hudController;
    },
    getEffectsContainer:function(){
        return this.gameScreen.effectsContainer;
    },
    getGame:function(){
        return this.gameScreen;
    },
    getMousePos:function(){
        return this.stage.getMousePosition();
    },
    getMousePosMapRelative:function(){
        // console.log(this.gameScreen.levelBounds,
        // this.gameScreen.getContent().position.x - windowWidth/2,
        // this.gameScreen.getContent().position.y - windowHeight/2,
        // this.stage.getMousePosition().x - windowWidth/2,
        // this.stage.getMousePosition().y - windowHeight/2);
        return {x:(this.gameScreen.getContent().position.x - windowWidth/2) * -1 + this.stage.getMousePosition().x - windowWidth/2,
            y:(this.gameScreen.getContent().position.y - windowHeight/2) * -1 + this.stage.getMousePosition().y - windowHeight/2};
    },
    getGameContent:function(){
        return this.gameScreen.getContent();
    },
    getHUD:function(){
        return this.HUD;
    },
    update:function(){
        this._super();
        if(this.hudController){
            this.hudController.update();
        }
    },
    build:function(){
        // this.monsterList.push(new MonsterModel(1,80,50,20,13,13,70,70, 10));
        this.playersList = [];
        this.monsterList = [];
        this.spellList = [];
        this.weaponList = [];
        this.armorList = [];
        this.itemList = [];
        this.relicList = [];

        this._super();
        var JSONToLoader = ['_dist/img/relics/relics.JSON',
                            '_dist/img/weapons/weapons.JSON',
                            '_dist/img/spells/spells.JSON',
                            '_dist/img/potions/potions.JSON',
                            '_dist/img/enemies/enemies.JSON',
                            '_dist/img/armor/armor.JSON',
                            '_dist/img/players/players.JSON'];
        this.assetsLoader = new PIXI.AssetLoader(JSONToLoader);
        var self = this;

        this.assetsLoader.onComplete = function() {
            self.onAssetsLoaded();
        };
        this.assetsLoader.onProgress = function() {
            // console.log('onProgress');
            // self.onProgress();
        };
        this.assetsLoader.load();
        this.jsonLoads = JSONToLoader.length;
        // this.initLoad();
        // this.onAssetsLoaded();
    },
    updateLoad:function(){
        this.jsonLoads --;
        if(this.jsonLoads <= 0){
            this.initApplication();
        }
    },
    initApplication:function(){
        this.gameScreen = new GameScreen('Main');
        this.screenManager.addScreen(this.gameScreen);

            // this.waitScreen = new WaitScreen('Wait');
            // this.screenManager.addScreen(this.waitScreen);

            // this.screenManager.change('Wait');
        this.HUD = new PIXI.DisplayObjectContainer();
        this.stage.addChild(this.HUD);
        this.hudController = new HUDController(this.HUD, this.stage);

        this.screenManager.change('Main');
    },
    onAssetsLoaded:function()
    {
        // console.log('assetsLoader');
        var self = this;

        var jsonLoaderPlayers = new PIXI.JsonLoader('_dist/img/players/players.JSON');
        jsonLoaderPlayers.on('loaded', function(evt) {
            console.log('jsonLoaderPlayers',evt.content.json);
            for (var i = 0; i < evt.content.json.itens.length; i++) {
                // console.log(evt.content.json.itens[i].stats,'SJKALSKALSK');
                self.playersList.push(new PlayerModel(
                    evt.content.json.itens[i].name,
                    evt.content.json.itens[i].label,
                    evt.content.json.itens[i].stats,
                    evt.content.json.itens[i].modifiers,
                    evt.content.json.itens[i].graphicsData,
                    evt.content.json.itens[i].config
                ));
            }
            // console.log('jsonLoaderPlayers',evt.content.json.itens[0]);
            self.updateLoad();
        });
        jsonLoaderPlayers.load();

        var jsonLoaderMonsters = new PIXI.JsonLoader('_dist/img/enemies/enemies.JSON');
        jsonLoaderMonsters.on('loaded', function(evt) {
            console.log('jsonLoaderMonsters',evt.content.json);
            for (var i = 0; i < evt.content.json.itens.length; i++) {
                self.monsterList.push(new MonsterModel(
                    evt.content.json.itens[i].name,
                    evt.content.json.itens[i].stats,
                    evt.content.json.itens[i].fire,
                    evt.content.json.itens[i].graphicsData,
                    evt.content.json.itens[i].config
                ));
            }
            // console.log('jsonLoaderMonsters',evt.content.json.itens[0]);
            self.updateLoad();
        });
        jsonLoaderMonsters.load();

        var jsonLoaderRelics = new PIXI.JsonLoader('_dist/img/relics/relics.JSON');
        jsonLoaderRelics.on('loaded', function(evt) {
            for (var i = 0; i < evt.content.json.itens.length; i++) {
                self.relicList.push(new RelicModel(evt.content.json.itens[i].name,
                    evt.content.json.itens[i].status,
                    evt.content.json.itens[i].baseValue,
                    evt.content.json.itens[i].price,
                    evt.content.json.itens[i].icoImg
                ));
            }
            // console.log('jsonLoaderRelics',evt.content.json.itens.length);
            self.updateLoad();
        });
        jsonLoaderRelics.load();

        var jsonLoaderArmor = new PIXI.JsonLoader('_dist/img/armor/armor.JSON');
        jsonLoaderArmor.on('loaded', function(evt) {
            for (var i = 0; i < evt.content.json.itens.length; i++) {
                self.armorList.push(new ArmorModel(evt.content.json.itens[i].name,
                    evt.content.json.itens[i].defenseArmor,
                    evt.content.json.itens[i].magicDefenseArmor,
                    evt.content.json.itens[i].price,
                    evt.content.json.itens[i].icoImg
                ));
            }
            // console.log('jsonLoaderArmor',evt.content.json.itens.length);
            self.updateLoad();

        });
        jsonLoaderArmor.load();

        var jsonLoaderWeapon = new PIXI.JsonLoader('_dist/img/weapons/weapons.JSON');
        jsonLoaderWeapon.on('loaded', function(evt) {
            for (var i = 0; i < evt.content.json.itens.length; i++) {
                self.weaponList.push(new WeaponModel(evt.content.json.itens[i].name,
                    evt.content.json.itens[i].battlePower,
                    evt.content.json.itens[i].magicPower,
                    evt.content.json.itens[i].hitRate,
                    evt.content.json.itens[i].price,
                    evt.content.json.itens[i].icoImg,
                    evt.content.json.itens[i].srcImg
                ));
            }
            // console.log('jsonLoaderWeapon',evt.content.json.itens.length);
            self.updateLoad();

        });
        jsonLoaderWeapon.load();

        var jsonLoaderSpell = new PIXI.JsonLoader('_dist/img/spells/spells.JSON');
        jsonLoaderSpell.on('loaded', function(evt) {
            for (var i = 0; i < evt.content.json.itens.length; i++) {
                self.spellList.push(new SpellModel(evt.content.json.itens[i].level,
                    evt.content.json.itens[i].name,
                    evt.content.json.itens[i].mp,
                    evt.content.json.itens[i].spellPower,
                    evt.content.json.itens[i].icoImg,
                    evt.content.json.itens[i].srcImg,
                    evt.content.json.itens[i].isMultiple
                ));
            }
            // console.log('jsonLoaderSpell',evt.content.json.itens.length);
            self.updateLoad();

        });
        jsonLoaderSpell.load();

        var jsonLoaderPotion = new PIXI.JsonLoader('_dist/img/potions/potions.JSON');
        jsonLoaderPotion.on('loaded', function(evt) {
            for (var i = 0; i < evt.content.json.itens.length; i++) {
                
                self.itemList.push(new ItemModel(evt.content.json.itens[i].name,
                    evt.content.json.itens[i].effect,
                    evt.content.json.itens[i].baseValue,
                    evt.content.json.itens[i].price,
                    evt.content.json.itens[i].icoImg
                ));
            }
            // console.log('jsonLoaderPotion',evt.content.json.itens.length);
            self.updateLoad();

        });
        jsonLoaderPotion.load();
        // this.gameScreen = new GameScreen('Main');
        // this.screenManager.addScreen(this.gameScreen);

        //     // this.waitScreen = new WaitScreen('Wait');
        //     // this.screenManager.addScreen(this.waitScreen);

        //     // this.screenManager.change('Wait');
        // this.HUD = new PIXI.DisplayObjectContainer();
        // this.stage.addChild(this.HUD);
        // this.screenManager.change('Main');
    },
    getMonsterByName:function(name){
        for (var i = this.monsterList.length - 1; i >= 0; i--) {
            if(this.monsterList[i].name === name)
            {
                return this.monsterList[i].clone();
            }
        }
        return null;
    },
    show:function(){
    },
    hide:function(){
    },
    destroy:function(){
    }
});
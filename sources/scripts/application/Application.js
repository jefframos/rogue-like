/*jshint undef:false */
var Application = AbstractApplication.extend({
	init:function(){

        // $.ajax({
        //     cache: false
        //     //other options...
        // });
        //8599741.56163418 78
        this._super(windowWidth, windowHeight);
        this.stage.setBackgroundColor(0xffffff);
        this.stage.removeChild(this.loadText);
        this.isMobile = testMobile();
        this.appContainer = document.getElementById('rect');
        this.id = parseInt(Math.random() * 100000000000);


        this.gen = new DungeonGenerator();
        this.gen.generate(Math.random() * 0xFFFFFF, 1, [10, 15], [12,12], 5);
        this.gen.log();
        this.tileSize = {x:80, y: 80};

        var model1 = new PlayerModel('warrior');
        //model1.log();
        model1.levelUp();
       // model1.log();
        model1.levelUp();
       // model1.log();
        model1.levelUp();
        //model1.log();
        model1.levelUp();
        //model1.log();
        model1.levelUp();
        //model1.log();
        model1.levelUp();
        //model1.log();
        model1.levelUp();
        model1.log();

        var model2 = new PlayerModel('mage');
        //model2.log();
        model2.levelUp();
       // model2.log();
        model2.levelUp();
       // model2.log();
        model2.levelUp();
        //model2.log();
        model2.levelUp();
        //model2.log();
        model2.levelUp();
        //model2.log();
        model2.levelUp();
        //model2.log();
        model2.levelUp();
        model2.log();


        var model3 = new PlayerModel('thief');
        //model3.log();
        model3.levelUp();
       // model3.log();
        model3.levelUp();
       // model3.log();
        model3.levelUp();
        //model3.log();
        model3.levelUp();
        //model3.log();
        model3.levelUp();
        //model3.log();
        model3.levelUp();
        //model3.log();
        model3.levelUp();
        

        model3.levelUp();
        model3.levelUp();
        model3.levelUp();
        model3.levelUp();
        model3.levelUp();
        model3.levelUp();
        model3.levelUp();
        model3.levelUp();
        model3.levelUp();
        model3.levelUp();
        model3.levelUp();
        model3.log();
        // var model2 = new MonsterModel();
        //level,hp,speed,magicPower,battlePower,defense, magDef
        // var monster = new MonsterModel(8,860,35,10,16,125,150);
        // var monster = new MonsterModel(12,230,35,10,13,150,100);
        // var monster = new MonsterModel(24,1305,40,10,22,225,45);
        var monster = new MonsterModel(19,8000,55,55,13,140,160);
        console.log('thief');
        console.log('player physical attack', monster.getHurt(model3.getDemage('physical'),'physical'));
        console.log('player magical attack', monster.getHurt(model3.getDemage('magical'),'magical'));
        console.log('monster physical attack', model3.getHurt(monster.getDemage('physical'),'physical'));
        console.log('monster magical attack', model3.getHurt(monster.getDemage('magical'),'magical'));

        console.log('warrior');
        console.log('player physical attack', monster.getHurt(model1.getDemage('physical'),'physical'));
        console.log('player magical attack', monster.getHurt(model1.getDemage('magical'),'magical'));
        console.log('monster physical attack', model1.getHurt(monster.getDemage('physical'),'physical'));
        console.log('monster magical attack', model1.getHurt(monster.getDemage('magical'),'magical'));

        console.log('mage');
        console.log('player physical attack', monster.getHurt(model2.getDemage('physical'),'physical'));
        console.log('player magical attack', monster.getHurt(model2.getDemage('magical'),'magical'));
        console.log('monster physical attack', model2.getHurt(monster.getDemage('physical'),'physical'));
        console.log('monster magical attack', model2.getHurt(monster.getDemage('magical'),'magical'));
	},
    getGame:function(){
        return this.mainApp;
    },
    build:function(){
        this.monsterList = [];

        // this.monsterList.push(new MonsterModel(6,800,55,55,13,140,160, 94));
        this.monsterList.push(new MonsterModel(1,150,55,55,13,140,160, 6));


        this.spellList = [];
        this.spellList.push(new SpellModel(1,'bolt1',6,20));
        this.spellList.push(new SpellModel(1,'fire1',4,21));
        this.spellList.push(new SpellModel(1,'ice1',5,22));
        this.spellList.push(new SpellModel(1,'poison',3,25));
        this.spellList.push(new SpellModel(1,'wind',75,25));//multiple1
        this.spellList.push(new SpellModel(2,'bolt2',22,26));
        this.spellList.push(new SpellModel(2,'fire2',20,60));
        this.spellList.push(new SpellModel(2,'ice2',21,62));
        this.spellList.push(new SpellModel(2,'drain',15,38));//drain
        this.spellList.push(new SpellModel(3,'meteor',62,36));//multiple
        this.spellList.push(new SpellModel(3,'bio',26,53));
        this.spellList.push(new SpellModel(3,'flare',45,60));
        this.spellList.push(new SpellModel(4,'quake',50,111));//multiple
        this.spellList.push(new SpellModel(5,'bolt3',53,120));
        this.spellList.push(new SpellModel(5,'fire3',51,121));
        this.spellList.push(new SpellModel(5,'ice3',52,122));
        this.spellList.push(new SpellModel(6,'merton',85,138));
        this.spellList.push(new SpellModel(7,'ultima',80,150));//multiple



        this.weaponList = [];
        this.weaponList.push(new WeaponModel('AirLancet',76,180,950));
        this.weaponList.push(new WeaponModel('Assassin',106,180,2));
        this.weaponList.push(new WeaponModel('Dirk',26,180,150));
        this.weaponList.push(new WeaponModel('Graedus',204,180,2));
        this.weaponList.push(new WeaponModel('Guardian',59,180,2));
        this.weaponList.push(new WeaponModel('ManEater',146,180,11000));
        this.weaponList.push(new WeaponModel('MithrilKnife',30,180,300));
        this.weaponList.push(new WeaponModel('SwordBreaker',164,180,16000));
        this.weaponList.push(new WeaponModel('ThiefKnife',88,180,2));
        this.weaponList.push(new WeaponModel('ValiantKnife',145,180,2));
        this.weaponList.push(new WeaponModel('Atma,WeaponBat',255,150,2));
        this.weaponList.push(new WeaponModel('Blizzard',108,150,7000));
        this.weaponList.push(new WeaponModel('Break Blade',117,150,12000));
        this.weaponList.push(new WeaponModel('Crystal',167,150,15000));
        this.weaponList.push(new WeaponModel('Drainer',121,150,2));
        this.weaponList.push(new WeaponModel('Enhancer',135,150,10000));
        this.weaponList.push(new WeaponModel('Epee',98,150,3000));
        this.weaponList.push(new WeaponModel('Excalibur',217,150,2));
        this.weaponList.push(new WeaponModel('Falchion',176,150,17000));
        this.weaponList.push(new WeaponModel('Flame,Sabre',108,150,7000));
        this.weaponList.push(new WeaponModel('Illumina',255,255,2));
        this.weaponList.push(new WeaponModel('MithrilBlade',38,150,450));
        this.weaponList.push(new WeaponModel('Ogre Nix',182,150,2));
        this.weaponList.push(new WeaponModel('Ragnarok',255,150,2));
        this.weaponList.push(new WeaponModel('RegalCutlass',54,150,800));
        this.weaponList.push(new WeaponModel('Rune,Edge',55,150,7500));
        this.weaponList.push(new WeaponModel('Scimitar',208,150,2));
        this.weaponList.push(new WeaponModel('Soul,Sabre',125,150,2));
        this.weaponList.push(new WeaponModel('ThunderBlade',108,150,7000));
        this.weaponList.push(new WeaponModel('Aura,Lance',227,180,2));
        this.weaponList.push(new WeaponModel('Gold,Lance',139,150,12000));
        this.weaponList.push(new WeaponModel('Imp,Halberd',253,150,2));
        this.weaponList.push(new WeaponModel('Mithril,Pike',70,150,800));
        this.weaponList.push(new WeaponModel('Partisan',150,150,13000));
        this.weaponList.push(new WeaponModel('Pearl,Lance',194,150,2));
        this.weaponList.push(new WeaponModel('Stout,Spear',112,150,10000));
        this.weaponList.push(new WeaponModel('Trident',93,150,1700));
        this.weaponList.push(new WeaponModel('Blossom',112,180,3200));
        this.weaponList.push(new WeaponModel('Hardened',121,180,2));
        this.weaponList.push(new WeaponModel('Imperial',82,180,600));
        this.weaponList.push(new WeaponModel('Kodachi',93,180,1200));
        this.weaponList.push(new WeaponModel('Striker',190,180,2));
        this.weaponList.push(new WeaponModel('Stunner',220,180,2));
        this.weaponList.push(new WeaponModel('Ashura',57,150,500));
        this.weaponList.push(new WeaponModel('Aura',162,150,2));
        this.weaponList.push(new WeaponModel('Forged',81,150,1200));
        this.weaponList.push(new WeaponModel('Kotetsu',66,150,800));
        this.weaponList.push(new WeaponModel('Murasame',110,150,9000));
        this.weaponList.push(new WeaponModel('Sky,Render',215,150,2));
        this.weaponList.push(new WeaponModel('Strato',199,150,2));
        this.weaponList.push(new WeaponModel('Tempest',101,150,8000));
        this.weaponList.push(new WeaponModel('Fire,Rod',79,135,3000));
        this.weaponList.push(new WeaponModel('Gravity,Rod',120,135,13000));
        this.weaponList.push(new WeaponModel('Heal,Rod',200,255,2));
        this.weaponList.push(new WeaponModel('Ice,Rod',79,135,3000));
        this.weaponList.push(new WeaponModel('Magus,Rod',168,135,2));
        this.weaponList.push(new WeaponModel('Mithril,Rod',60,135,500));
        this.weaponList.push(new WeaponModel('Pearl,Rod',124,135,12000));
        this.weaponList.push(new WeaponModel('Poison,Rod',86,135,1500));
        this.weaponList.push(new WeaponModel('Punisher',111,150,2));
        this.weaponList.push(new WeaponModel('Thunder,Rod',79,135,3000));
        this.weaponList.push(new WeaponModel('Chocobo,Brsh',60,135,600));
        this.weaponList.push(new WeaponModel('DaVinci,Brsh',100,135,7000));
        this.weaponList.push(new WeaponModel('Magical,Brsh',130,135,10000));
        this.weaponList.push(new WeaponModel('Rainbow,Brsh',146,135,2));
        this.weaponList.push(new WeaponModel('Ninja,Star',132,230,500));
        this.weaponList.push(new WeaponModel('Shuriken',86,230,30));
        this.weaponList.push(new WeaponModel('Tack,Star',190,230,2));
        this.weaponList.push(new WeaponModel('Bone,Club',151,150,20000));
        this.weaponList.push(new WeaponModel('Boomerang',102,230,4500));
        this.weaponList.push(new WeaponModel('Flail',86,150,2000));
        this.weaponList.push(new WeaponModel('Full,Moon',95,230,2500));
        this.weaponList.push(new WeaponModel('Hawk,Eye',111,180,6000));
        this.weaponList.push(new WeaponModel('Morning,Star',109,150,5000));
        this.weaponList.push(new WeaponModel('Rising,Sun',98,230,2));
        this.weaponList.push(new WeaponModel('Cards',104,230,1000));
        this.weaponList.push(new WeaponModel('Darts',115,230,10000));
        this.weaponList.push(new WeaponModel('Doom,Darts',187,230,2));
        this.weaponList.push(new WeaponModel('Trump',133,230,13000));
        this.weaponList.push(new WeaponModel('ClawDragon,Claw',188,200,2));
        this.weaponList.push(new WeaponModel('ClawFire,Knuckle',122,200,10000));
        this.weaponList.push(new WeaponModel('ClawKaiser',83,200,1000));
        this.weaponList.push(new WeaponModel('ClawMetalKnuckle',55,200,500));
        this.weaponList.push(new WeaponModel('ClawMithril,Claw',65,200,800));
        this.weaponList.push(new WeaponModel('ClawPoison,Claw',95,200,2500));
        this.weaponList.push(new WeaponModel('ClawTiger,Fangs',215,200,2));


        this._super();
        // var assetsToLoader = ['_dist/img/spritesheet/sockets.json','_dist/img/spritesheet/sockets.png'];
       // this.loader = new PIXI.AssetLoader(assetsToLoader);
        //this.initLoad();
        this.onAssetsLoaded();
    },
    onAssetsLoaded:function()
    {
        this.mainApp = new GameScreen('Main');
        this.screenManager.addScreen(this.mainApp);

            // this.waitScreen = new WaitScreen('Wait');
            // this.screenManager.addScreen(this.waitScreen);

            // this.screenManager.change('Wait');
        this.screenManager.change('Main');
    },
    show:function(){
    },
    hide:function(){
    },
    destroy:function(){
    }
});
/*jshint undef:false */
var Application = AbstractApplication.extend({
	init:function(){

        // $.ajax({
        //     cache: false
        //     //other options...
        // });
        //8599741.56163418 78
        this._super(windowWidth, windowHeight);
        this.stage.setBackgroundColor(0x000);
        this.stage.removeChild(this.loadText);
        this.isMobile = testMobile();
        this.appContainer = document.getElementById('rect');
        this.id = parseInt(Math.random() * 100000000000);


        this.gen = new DungeonGenerator();
        this.gen.generate(Math.random() * 0xFFFFFF, 1, [10, 15], [12,12], 5);
        this.gen.log();
        this.tileSize = {x:80, y: 80};

       //  var model1 = new PlayerModel('warrior');
       //  //model1.log();
       //  model1.levelUp();
       // // model1.log();
       //  model1.levelUp();
       // // model1.log();
       //  model1.levelUp();
       //  //model1.log();
       //  model1.levelUp();
       //  //model1.log();
       //  model1.levelUp();
       //  //model1.log();
       //  model1.levelUp();
       //  //model1.log();
       //  model1.levelUp();
       //  model1.log();

       //  var model2 = new PlayerModel('mage');
       //  //model2.log();
       //  model2.levelUp();
       // // model2.log();
       //  model2.levelUp();
       // // model2.log();
       //  model2.levelUp();
       //  //model2.log();
       //  model2.levelUp();
       //  //model2.log();
       //  model2.levelUp();
       //  //model2.log();
       //  model2.levelUp();
       //  //model2.log();
       //  model2.levelUp();
       //  model2.log();


       //  var model3 = new PlayerModel('thief');
       //  //model3.log();
       //  model3.levelUp();
       // // model3.log();
       //  model3.levelUp();
       // // model3.log();
       //  model3.levelUp();
       //  //model3.log();
       //  model3.levelUp();
       //  //model3.log();
       //  model3.levelUp();
       //  //model3.log();
       //  model3.levelUp();
       //  //model3.log();
       //  model3.levelUp();
        

       //  model3.levelUp();
       //  model3.levelUp();
       //  model3.levelUp();
       //  model3.levelUp();
       //  model3.levelUp();
       //  model3.levelUp();
       //  model3.levelUp();
       //  model3.levelUp();
       //  model3.levelUp();
       //  model3.levelUp();
       //  model3.levelUp();
       //  model3.log();

        // var model2 = new MonsterModel();
        //level,hp,speed,magicPower,battlePower,defense, magDef
        // var monster = new MonsterModel(8,860,35,10,16,125,150);
        // var monster = new MonsterModel(12,230,35,10,13,150,100);
        // var monster = new MonsterModel(24,1305,40,10,22,225,45);
        // var monster = new MonsterModel(19,8000,55,55,13,140,160);

        // console.log('thief');
        // console.log('player physical attack', monster.getHurt(model3.getDemage('physical'),'physical'));
        // console.log('player magical attack', monster.getHurt(model3.getDemage('magical'),'magical'));
        // console.log('monster physical attack', model3.getHurt(monster.getDemage('physical'),'physical'));
        // console.log('monster magical attack', model3.getHurt(monster.getDemage('magical'),'magical'));

        // console.log('warrior');
        // console.log('player physical attack', monster.getHurt(model1.getDemage('physical'),'physical'));
        // console.log('player magical attack', monster.getHurt(model1.getDemage('magical'),'magical'));
        // console.log('monster physical attack', model1.getHurt(monster.getDemage('physical'),'physical'));
        // console.log('monster magical attack', model1.getHurt(monster.getDemage('magical'),'magical'));

        // console.log('mage');
        // console.log('player physical attack', monster.getHurt(model2.getDemage('physical'),'physical'));
        // console.log('player magical attack', monster.getHurt(model2.getDemage('magical'),'magical'));
        // console.log('monster physical attack', model2.getHurt(monster.getDemage('physical'),'physical'));
        // console.log('monster magical attack', model2.getHurt(monster.getDemage('magical'),'magical'));
	},
    getEffectsContainer:function(){
        return this.mainApp.effectsContainer;
    },
    getGame:function(){
        return this.mainApp;
    },
    getGameContent:function(){
        return this.mainApp.getContent();
    },
    getHUD:function(){
        return this.HUD;
    },
    build:function(){
        this.monsterList = [];

        // this.monsterList.push(new MonsterModel(6,800,55,55,13,140,160, 94));
        // this.monsterList.push(new MonsterModel(1,150,55,55,13,140,160, 20));
        //level,hp,stamina,speed,magicPower,battlePower,defense,magicDefense, xp
        // this.monsterList.push(new MonsterModel(1,150,30,55,55,13,140,160, 20));
        this.monsterList.push(new MonsterModel(1,10,50,55,13,13,70,70, 10));
        this.monsterList.push(new MonsterModel(10,80,50,55,13,13,70,70, 10));
        this.monsterList.push(new MonsterModel(20,80,50,55,13,13,70,70, 10));
        // this.monsterList.push(new MonsterModel(1,150,30,55,55,13,140,160, 10));


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
        this.weaponList.push(new WeaponModel('MithrilKnife',30,180,300));
        this.weaponList.push(new WeaponModel('AirLancet',76,180,950));
        this.weaponList.push(new WeaponModel('Assassin',106,180,2));
        this.weaponList.push(new WeaponModel('Dirk',26,180,150));
        this.weaponList.push(new WeaponModel('Graedus',204,180,2));
        this.weaponList.push(new WeaponModel('Guardian',59,180,2));
        this.weaponList.push(new WeaponModel('ManEater',146,180,11000));
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



        this.armorList = [];
        this.armorList.push(new ArmorModel('Aegis Shld' ,46 ,52 ,2));
        this.armorList.push(new ArmorModel('Buckler' ,16 ,10 ,200));
        this.armorList.push(new ArmorModel('Crystal Shld' ,50 ,34 ,7000));
        this.armorList.push(new ArmorModel('Diamond Shld' ,40 ,27 ,3500));
        this.armorList.push(new ArmorModel('Flame Shld' ,41 ,28 ,2));
        this.armorList.push(new ArmorModel('Force Shld' ,0 ,70 ,2));
        this.armorList.push(new ArmorModel('Genji Shld' ,54 ,50 ,2));
        this.armorList.push(new ArmorModel('Gold Shld' ,34 ,23 ,2500));
        this.armorList.push(new ArmorModel('Heavy Shld' ,22 ,14 ,400));
        this.armorList.push(new ArmorModel('Ice Shld' ,42 ,28 ,2));
        this.armorList.push(new ArmorModel('Mithril Shld' ,27 ,18 ,1200));
        this.armorList.push(new ArmorModel('Paladin Shld' ,59 ,59 ,2));
        this.armorList.push(new ArmorModel('Thunder Shld' ,43 ,28 ,2));
        this.armorList.push(new ArmorModel('TortoiseShld' ,66 ,66 ,2));
        this.armorList.push(new ArmorModel('Bandana' ,16 ,10 ,800));
        this.armorList.push(new ArmorModel('Bards Hat' ,19 ,21 ,3000));
        this.armorList.push(new ArmorModel('Beret' ,21 ,21 ,3500));
        this.armorList.push(new ArmorModel('Cat Hood' ,33 ,33 ,2));
        this.armorList.push(new ArmorModel('Circlet' ,25 ,19 ,7000));
        this.armorList.push(new ArmorModel('Coronet' ,23 ,23 ,2));
        this.armorList.push(new ArmorModel('Crystal Helm' ,29 ,19 ,10000));
        this.armorList.push(new ArmorModel('Dark Hood' ,26 ,17 ,7500));
        this.armorList.push(new ArmorModel('Diamond Helm' ,27 ,18 ,8000));
        this.armorList.push(new ArmorModel('Genji Helmet' ,36 ,38 ,2));
        this.armorList.push(new ArmorModel('Gold Helmet' ,22 ,15 ,4000));
        this.armorList.push(new ArmorModel('Green Beret' ,19 ,13 ,3000));
        this.armorList.push(new ArmorModel('Hair Band' ,12 ,81 ,50));
        this.armorList.push(new ArmorModel('Head Band' ,16 ,10 ,1600));
        this.armorList.push(new ArmorModel('Iron Helmet' ,18 ,12 ,1000));
        this.armorList.push(new ArmorModel('Leather Hat' ,11 ,7 ,50));
        this.armorList.push(new ArmorModel('Magus Hat' ,15 ,16 ,600));
        this.armorList.push(new ArmorModel('Mithril Helm' ,20 ,13 ,2000));
        this.armorList.push(new ArmorModel('Mystery Veil' ,24 ,25 ,5500));
        this.armorList.push(new ArmorModel('Oath Veil' ,32 ,31 ,9000));
        this.armorList.push(new ArmorModel('Plumed Hat' ,14 ,9 ,250));
        this.armorList.push(new ArmorModel('Red Cap' ,24 ,17 ,2));
        this.armorList.push(new ArmorModel('Regal Crown' ,28 ,23 ,2));
        this.armorList.push(new ArmorModel('Thornlet' ,38 ,0 ,2));
        this.armorList.push(new ArmorModel('Tiara' ,22 ,20 ,3000));
        this.armorList.push(new ArmorModel('Tiger Mask' ,21 ,13 ,2500));
        this.armorList.push(new ArmorModel('Titanium' ,42 ,42 ,2));
        this.armorList.push(new ArmorModel('BehemothSuit' ,94 ,73 ,2));
        this.armorList.push(new ArmorModel('Chocobo Suit' ,56 ,38 ,2));
        this.armorList.push(new ArmorModel('Cotton Robe' ,32 ,21 ,200));
        this.armorList.push(new ArmorModel('Crystal Mail' ,72 ,49 ,17000));
        this.armorList.push(new ArmorModel('Czarina Gown' ,70 ,64 ,2));
        this.armorList.push(new ArmorModel('Dark Gear' ,68 ,46 ,13000));
        this.armorList.push(new ArmorModel('Diamond Vest' ,65 ,44 ,12000));
        this.armorList.push(new ArmorModel('DiamondArmor' ,70 ,47 ,15000));
        this.armorList.push(new ArmorModel('Force Armor' ,69 ,68 ,2));
        this.armorList.push(new ArmorModel('Gaia Gear' ,53 ,43 ,6000));
        this.armorList.push(new ArmorModel('Genji Armor' ,90 ,80 ,2));
        this.armorList.push(new ArmorModel('Gold Armor' ,55 ,37 ,10000));
        this.armorList.push(new ArmorModel('Imps Armor' ,100 ,100 ,2));
        this.armorList.push(new ArmorModel('Iron Armor' ,40 ,27 ,700));
        this.armorList.push(new ArmorModel('Kung Fu Suit' ,34 ,23 ,250));
        this.armorList.push(new ArmorModel('LeatherArmor' ,28 ,19 ,150));
        this.armorList.push(new ArmorModel('Light Robe' ,60 ,43 ,11000));
        this.armorList.push(new ArmorModel('Minerva' ,88 ,70 ,2));
        this.armorList.push(new ArmorModel('Mirage Vest' ,48 ,36 ,2));
        this.armorList.push(new ArmorModel('Mithril Mail' ,51 ,34 ,3500));
        this.armorList.push(new ArmorModel('Mithril Vest' ,45 ,30 ,1200));
        this.armorList.push(new ArmorModel('Moogle Suit' ,58 ,52 ,2));
        this.armorList.push(new ArmorModel('Ninja Gear' ,47 ,32 ,1100));
        this.armorList.push(new ArmorModel('Nutkin Suit' ,86 ,67 ,2));
        this.armorList.push(new ArmorModel('Power Sash' ,52 ,35 ,5000));
        this.armorList.push(new ArmorModel('Red Jacket' ,78 ,55 ,2));
        this.armorList.push(new ArmorModel('Silk Robe' ,39 ,29 ,600));
        this.armorList.push(new ArmorModel('Snow Muffler' ,128 ,90 ,2));
        this.armorList.push(new ArmorModel('Tabby Suit' ,54 ,36 ,2));
        this.armorList.push(new ArmorModel('Tao Robe' ,68 ,50 ,13000));
        this.armorList.push(new ArmorModel('White Dress' ,47 ,35 ,2200));

        this.itemList = [];
        this.itemList.push(new ItemModel('Minor Potion' ,'regen HP' ,35 ,100));
        this.itemList.push(new ItemModel('Minor Ether' ,'regen MP' ,35 ,100));
        this.itemList.push(new ItemModel('Haste' ,'haste' ,0 ,100));

        this.relicList = [];
        this.relicList.push(new RelicModel('relic 1' ,'2shots' ,0 ,100));
        this.relicList.push(new RelicModel('relic 2' ,'3shots' ,0 ,100));
        this.relicList.push(new RelicModel('power' ,'powershot' ,0 ,100));
        this.relicList.push(new RelicModel('speed' ,'speedshot' ,0 ,100));


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
        this.HUD = new PIXI.DisplayObjectContainer();
        this.stage.addChild(this.HUD);
        this.screenManager.change('Main');
    },
    show:function(){
    },
    hide:function(){
    },
    destroy:function(){
    }
});
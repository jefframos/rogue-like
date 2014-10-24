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

        var model1 = new PlayerModel();
        model1.log();
        model1.levelUp();
        model1.log();
        model1.levelUp();

        model1.log();
        model1.levelUp();

        model1.log();
        model1.levelUp();

        model1.log();
        model1.levelUp();

        model1.log();
        model1.levelUp();

        model1.log();
        model1.levelUp();
        
        model1.log();
        // var model2 = new MonsterModel();


        // console.log('player physical attack', model2.getHurt(model1.getDemage('physical')));
        // console.log('player magical attack', model2.getHurt(model1.getDemage('magical')));

        // for (var i = 0; i < 20; i++) {
        //     model1.updateXp(10);
        // }
        // console.log('monster physical attack', model1.getHurt(model2.getDemage('physical')));
        // console.log('monster magical attack', model1.getHurt(model2.getDemage('magical')));
	},
    build:function(){
        this.spellList = [];

        // SpellMPSpell PowerDescription
// Bio 26 53 Poison-elemental attack
// Bolt 6 20 Lightning-elemental attack
// Bolt 22 26 1Lightning-elemental attack
// Bolt 3 53 120 Lightning-elemental attack
// Demi 33 8 Cuts an enemys HP in half
// Drain 15 38 Drains HP from an enemy
// Fire 4 21 Fire-elemental attack
// Fire 2 20 60 Fire-elemental attack
// Fire 3 51 121 Fire-elemental attack
// Flare 45 60 Barrier-piercing attack
// Ice 5 22 Ice-elemental attack
// Ice 2 21 62 Ice-elemental attack
// Ice 3 52 122 Ice-elemental attack
// Merton 85 138 Unfocused piercing fire attack
// Meteor 62 36 Damages multiple enemies
// Pearl 40 108 Pearl-elemental attack
// Poison 3 25 Poisons an enemy
// Quake 50 111 Unfocused Earth-elemental attack
// Quartr 48 12 Cuts an enemys HP by 3/4
// Ultima 80 150 Damages multiple enemies
// W Wind 75 15 Unfocused near-fatal attack

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
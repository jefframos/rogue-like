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
        var model2 = new MonsterModel();
        console.log('player physical attack', model2.getHurt(model1.getDemage('physical')));
        console.log('player magical attack', model2.getHurt(model1.getDemage('magical')));

        for (var i = 0; i < 20; i++) {
            model1.updateXp(10);
        }
        console.log('monster physical attack', model1.getHurt(model2.getDemage('physical')));
        console.log('monster magical attack', model1.getHurt(model2.getDemage('magical')));
	},
    build:function(){
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
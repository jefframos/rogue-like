/*jshint undef:false */
var Application = AbstractApplication.extend({
	init:function(firebaseURL){

        // console.log(firebaseURL);
        $.ajax({
            cache: false
            //other options...
        });
        //8599741.56163418 78
        this._super(windowWidth, windowHeight);
        this.stage.setBackgroundColor(0xffffff);
        this.stage.removeChild(this.loadText);
        this.isMobile = testMobile();
        this.appContainer = document.getElementById('rect');
        this.id = parseInt(Math.random() * 100000000000);

        //SOCKET = new FirebaseSocket(firebaseURL +parseInt(Math.random() * 100000000000));
        // SOCKET = new FirebaseSocket(firebaseURL);

        this.gen = new DungeonGenerator();
        this.gen.generate(Math.random() * 0xFFFFFF, 1, [10, 15], [12,12], 5);
        this.gen.log();

        this.tileSize = {x:80, y: 80};
	},
    build:function(){
        this._super();
        console.log('build');
        // var assetsToLoader = ['_dist/img/spritesheet/sockets.json','_dist/img/spritesheet/sockets.png'];
       // this.loader = new PIXI.AssetLoader(assetsToLoader);
        //this.initLoad();
        this.onAssetsLoaded();
    },
    onAssetsLoaded:function()
    {
        // console.log('assetsLoaded');
        
        // SOCKET.build();
        // // SOCKET.bind(SmartSocket.READ_LAST, this.readObj);
        // SOCKET.bind(SmartSocket.WRITE_OBJ, this.writeObj);
        // SOCKET.bind(SmartSocket.SET_OBJ, this.setObj);
        this.mainApp = null;
        if(this.isMobile){
            this.mainApp = new MobileMainScreen('Main');
            this.screenManager.addScreen(this.mainApp);

            this.screenManager.change('Main');

        }else
        {
            this.mainApp = new DesktopMainScreen('Main');
            this.screenManager.addScreen(this.mainApp);

            // this.waitScreen = new WaitScreen('Wait');
            // this.screenManager.addScreen(this.waitScreen);

            // this.screenManager.change('Wait');
            this.screenManager.change('Main');
        }


        // this.mainApp.bind('writeObj', this.appWrite);
        // SOCKET.bind(SmartSocket.READ_OBJ, this.readObj);

    },
    appWrite:function(obj){
        console.log('appWrite', obj);
        SOCKET.updateObj({socket:obj});
    },
    readObj:function(obj){
        // console.log('readObj', obj);
        if(obj){
            if(obj.user && obj.user.isMobile && APP.screenManager.currentScreen.screenLabel !== 'Main'){
                APP.screenManager.change('Main');
            }else if(obj.socket && obj.socket.isMobile !== this.isMobile){
                APP.mainApp.updateNotification(obj.socket);
            }
        }
    },
    writeObj:function(obj){
        // console.log('writeObj', obj);
    },
    setObj:function(obj){
        // console.log('setObj', obj);
    },
    show:function(){
    },
    hide:function(){
    },
    destroy:function(){
    }
});
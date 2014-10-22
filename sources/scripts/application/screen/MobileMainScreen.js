/*jshint undef:false */
var MobileMainScreen = AbstractScreen.extend({
    init: function (label) {
        MicroEvent.mixin(this);
        this._super(label);
        this.currentAppModel = new AppModel();
        this.initPosition = null;
    },
    destroy: function () {
        this._super();
    },
    build: function () {
        this._super();
        this.name = new PIXI.Text('iniciou a aplicação no mobile', {fill:'black', align:'center'});
        // this.addChild(this.name);

        var bg = new SimpleSprite('_dist/img/bgMobile.png');
        this.addChild(bg);
        
        var assetsToLoader = ['_dist/img/bgMobile.png',
        '_dist/img/buttonDown0001.png',
        '_dist/img/buttonDown0002.png',
        '_dist/img/buttonLeft0001.png',
        '_dist/img/buttonLeft0002.png',
        '_dist/img/buttonRight0001.png',
        '_dist/img/buttonRight0002.png',
        '_dist/img/buttonUp0001.png',
        '_dist/img/buttonUp0002.png'
        ];

        

        this.loader = new PIXI.AssetLoader(assetsToLoader);
        this.initLoad();

        


    },
    onAssetsLoaded:function()
    {
        this._super();

        SOCKET.updateObj({user:{isMobile:true}});
        SOCKET.updateObj({socket:this.currentAppModel});

        console.log('carregou os assets',this.screenLabel);


        

        var self = this;

        this.buttonUp = new DefaultButton('_dist/img/buttonUp0001.png','_dist/img/buttonUp0002.png','_dist/img/buttonUp0002.png');
        this.buttonUp.build();
        this.buttonUp.setPosition(windowWidth/2 - this.buttonUp.width/2 ,windowHeight/2 - 200 - this.buttonUp.height/2);
        this.addChild(this.buttonUp);

        this.buttonDown = new DefaultButton('_dist/img/buttonDown0001.png','_dist/img/buttonDown0002.png','_dist/img/buttonDown0002.png');
        this.buttonDown.build();
        this.buttonDown.setPosition( windowWidth/2 - this.buttonDown.width/2,windowHeight/2+200 - this.buttonDown.height/2);
        this.addChild(this.buttonDown);

        this.buttonLeft = new DefaultButton('_dist/img/buttonLeft0001.png','_dist/img/buttonLeft0002.png','_dist/img/buttonLeft0002.png');
        this.buttonLeft.build();
        this.buttonLeft.setPosition(50+ windowWidth/2- this.buttonLeft.width *1.5,windowHeight/2 - this.buttonLeft.height/2);
        this.addChild(this.buttonLeft);

        this.buttonRight = new DefaultButton('_dist/img/buttonRight0001.png','_dist/img/buttonRight0002.png','_dist/img/buttonRight0002.png');
        this.buttonRight.build();
        this.buttonRight.setPosition(-50+ windowWidth/2 + this.buttonRight.width/2,windowHeight/2 - this.buttonRight.height/2);
        this.addChild(this.buttonRight);

        this.buttonUp.mouseDownCallback = function(){
            if(self.currentAppModel.side !== 'up'){
                self.currentAppModel.side = 'up';
                self.currentAppModel.action = 'down';
            }
            self.sendNotification(self.currentAppModel);
        };
        this.buttonDown.mouseDownCallback = function(){
            if(self.currentAppModel.side !== 'down'){
                self.currentAppModel.side = 'down';
                self.currentAppModel.action = 'down';
            }

            self.sendNotification(self.currentAppModel);
        };
        this.buttonLeft.mouseDownCallback = function(){
            if(self.currentAppModel.side !== 'left'){
                self.currentAppModel.side = 'left';
                self.currentAppModel.action = 'down';
            }

            self.sendNotification(self.currentAppModel);
        };
        this.buttonRight.mouseDownCallback = function(){
            if(self.currentAppModel.side !== 'right'){
                self.currentAppModel.side = 'right';
                self.currentAppModel.action = 'down';
            }
            self.sendNotification(self.currentAppModel);
        };


        // var touchActions = ['auto','none'];
        // Hammer.each(touchActions, function(touchAction) {
        //     var el = renderer.view;

        //     var mc = new Hammer(el, {
        //         touchAction: touchAction
        //     });
        //     mc.on('press pressup release', function(ev) {
        //         //if(ev.type === 'pressup'){
        //         self.currentAppModel.side = '';
        //         self.currentAppModel.action = ev.type;//'release';
        //         self.sendNotification(self.currentAppModel);
        //         //}
        //     });
        // });

        // this.buttonUp.mouseUpCallback =
        // this.buttonDown.mouseUpCallback =
        // this.buttonLeft.mouseUpCallback =
        // this.buttonRight.mouseUpCallback = function(){
        //     self.currentAppModel.side = '';
        //     self.currentAppModel.action = 'release';
        //     self.sendNotification(self.currentAppModel);
        // };
        this.sendNotification(new AppModel());


    },
    update:function()
    {
        this._super();
    },
    updateNotification:function(socketObj)
    {
        // console.log('updateNotification', socketObj);
    },
    sendNotification:function(socketObj)
    {
        socketObj.id = parseInt(Math.random() * 5003232323);
        socketObj.isMobile = true;

        this.trigger('writeObj', socketObj);
    },
    // transitionIn:function()
    // {
    //     console.log('_transition in',this.screenLabel);
    //     // this.build();
    //     var self = this;
    //     setTimeout(function(){self.build();}, 1000);
    // },
    // transitionOut:function(nextScreen, container)
    // {
    //     console.log('_transition in',this.screenLabel);
    //     this.destroy();
    //     var self = this;
    //     setTimeout(function(){
    //         nextScreen.transitionIn();
    //         //self.destroy();
    //         container.removeChild(self.getContent());
    //     }, 1000);
    // }
});
/*jshint undef:false */
var Player = SpritesheetEntity.extend({
    init:function(model){
        this._super( true );
        this.updateable = false;
        this.deading = false;
        this.collidable = true;
        this.range = APP.tileSize.x/2;
        this.width = APP.tileSize.x * 0.8;
        this.height = APP.tileSize.y * 0.8;
        this.type = 'player';
        this.collisionPointsMarginDivide = 0;
        this.isTouch = false;
        this.boundsCollision = true;

        this.armorModel = null;
        this.weaponModel = null;
        this.relicModel = null;
        // this.spellModel = null;
        this.playerModel = model;
        this.playerModel.entity = this;
        this.fireModel = new FireModel();
        this.endLevel = false;
        this.playerDead = false;
        this.hasteAcum = 0;
        this.centerPosition = {x:this.width/2, y:this.height/4};
       
        //this.playerModel.log();
        //this.firePower = this.playerModel.getDemage('physical');

        this.fireFreqAcum = 0;
        this.returnCollider = 0;
        this.updateAtt();

    },
    // setSpellModel: function(sModel){
    //     this.spellModel = sModel;
    // },
    setArmorModel: function(aModel){
        this.armorModel = aModel;
    },
    setRelicModel: function(rModel){
        this.relicModel = rModel;
    },
    setWeaponModel: function(wModel){
        this.weaponModel = wModel;
    },
    updateAtt: function(){
        // this.hpMax = this.playerModel.hpMax;
        // this.hp = this.playerModel.hpMax;
        // this.mp = this.playerModel.mp;
        // this.mpMax = this.playerModel.mp;

        this.defaultVelocity = this.playerModel.velocity;

        this.fireFreq = this.playerModel.fireFreq - 3;

        this.fireSpeed = this.fireModel.fireSpeed;

        if(this.fireSpeed < this.defaultVelocity * 1.4){
            this.fireSpeed = this.defaultVelocity * 1.4;
        }
       
        this.fireStepLive = this.fireModel.fireStepLive;
    },
    levelUp: function(){
        var pop = new PopUpText('white');
        pop.setText('LEVEL UP');
        APP.getEffectsContainer().addChild(pop.getContent());
        pop.setPosition(this.getPosition().x + this.centerPosition.x - 20, this.getPosition().y-5 + Math.random() * 10 - this.height/2 - 20);
        pop.initMotion(-15 - (Math.random() * 10), 1.5);
        this.getTexture().tint = 0xFF0000;

        this.updateAtt();
       
    },
    updateXP: function(xp){
        var pop = new PopUpText('green');
        pop.setText(Math.floor(xp) + ' XP');
        APP.getEffectsContainer().addChild(pop.getContent());
        pop.setPosition(this.getPosition().x + this.centerPosition.x - 10, this.getPosition().y-5 + Math.random() * 10 - this.height/2);
        pop.initMotion(-10 - (Math.random() * 10), 1);
        this.getTexture().tint = 0xFF0000;
    },
    build: function(){
        // console.log('criou o player');

        var self = this;


        var motionArray = this.getFramesByRange(this.playerModel.graphicsData.sourceLabel,
            this.playerModel.graphicsData.frames.idleInit,
            this.playerModel.graphicsData.frames.idleEnd);
        var animationIdle = new SpritesheetAnimation();
        animationIdle.build('idle', motionArray, 1, true, null);

        // var motionArrayDead = this.getFramesByRange('chinesa10',19,25);
        // var motionArrayDead = this.getFramesByRange('chinesa10',0,8);
        // var animationDead = new SpritesheetAnimation();

        // animationDead.build('dead', motionArrayDead, 2, false, function(){
        //     TweenLite.to(self.spritesheet.scale, 0.2, {x:0,y:0});
        // });

        this.spritesheet = new Spritesheet();
        this.spritesheet.addAnimation(animationIdle);
        // this.spritesheet.addAnimation(animationDead);
        this.spritesheet.play('idle');
        this.reset();
        this.counter = 0;

        this.debugGraphic = new PIXI.Graphics();
        this.debugGraphic.beginFill(0xFF3300);
        this.debugGraphic.lineStyle(1, 0xffd900, 1);
        this.debugGraphic.endFill();
        // console.log('level', this.playerModel.level);

    },
    getBounds: function(){
        //TA UMA MERDA E CONFUSO ISSO AQUI, por causa das posições
        // console.log()
        this.bounds = {x: this.getPosition().x , y: this.getPosition().y, w: this.width, h: this.height};
        this.collisionPoints = {
            up:{x:this.bounds.x + this.bounds.w / 2, y:this.bounds.y},
            down:{x:this.bounds.x + this.bounds.w / 2, y:this.bounds.y + this.bounds.h},
            bottomLeft:{x:this.bounds.x, y:this.bounds.y+this.bounds.h},
            topLeft:{x:this.bounds.x, y:this.bounds.y},
            bottomRight:{x:this.bounds.x + this.bounds.w, y:this.bounds.y+this.bounds.h},
            topRight:{x:this.bounds.x + this.bounds.w, y:this.bounds.y}
        };
        this.polygon = new PIXI.Polygon(new PIXI.Point(this.bounds.x + this.bounds.w / 2, this.bounds.y),
            new PIXI.Point(this.bounds.x, this.bounds.y),
            new PIXI.Point(this.bounds.x, this.bounds.y+this.bounds.h),
            new PIXI.Point(this.bounds.x + this.bounds.w / 2, this.bounds.y + this.bounds.h),
            new PIXI.Point(this.bounds.x + this.bounds.w, this.bounds.y+this.bounds.h),
            new PIXI.Point(this.bounds.x + this.bounds.w, this.bounds.y));
        return this.bounds;
    },
    updatePlayerVel:function(vecPositions)
    {
        if(this && vecPositions){
            var hasAxysY = false;
            var hasAxysX = false;
            if(vecPositions.length === 0){
                this.virtualVelocity.x = 0;
                this.virtualVelocity.y = 0;
            }
            for (var i = vecPositions.length - 1; i >= 0; i--) {

                if(vecPositions[i] === 'up'){
                    this.virtualVelocity.y = -this.defaultVelocity;
                    hasAxysY = true;
                }
                else if(vecPositions[i] === 'down'){
                    this.virtualVelocity.y = this.defaultVelocity;
                    hasAxysY = true;
                }

                if(vecPositions[i] === 'left'){
                    this.virtualVelocity.x = -this.defaultVelocity;
                    hasAxysX = true;
                }
                else if(vecPositions[i] === 'right'){
                    this.virtualVelocity.x = this.defaultVelocity;
                    hasAxysX = true;
                }
            }

            if(!hasAxysY){
                this.virtualVelocity.y = 0;
            }
            if(!hasAxysX){
                this.virtualVelocity.x = 0;
            }

        }
    },
    update: function(){
        if(this.hasteAcum > 0){
            this.hasteAcum --;
        }else{
            this.defaultVelocity = this.playerModel.velocity;
        }

        if(!this.isTouch && this.returnCollider <= 0){
            this.velocity = this.virtualVelocity;
        }
        if(this.returnCollider > 0){
            this.returnCollider --;
        }
        if(this.deading){
            this.setVelocity(0,0);
        }
        this._super();
        this.debugPolygon(0x556644, true);

        if(this.getTexture() && this.playerModel.graphicsData.positionSprite){
            if(this.playerModel.graphicsData.positionSprite.x){
                this.getContent().position.x = this.playerModel.graphicsData.positionSprite.x;
            }
            if(this.playerModel.graphicsData.positionSprite.y){
                this.getContent().position.y = this.playerModel.graphicsData.positionSprite.y;
            }
        }
    },
    //spell
    spell: function(mousePos, spellModel){
        if(spellModel.mp > this.playerModel.mp){
            var pop = new PopUpText('red');
            pop.setText('NO MP');
            APP.getEffectsContainer().addChild(pop.getContent());
            pop.setPosition(this.getPosition().x + this.centerPosition.x - 20, this.getPosition().y-5 + Math.random() * 10 - this.height/2 - 20);
            pop.initMotion(-15 - (Math.random() * 10), 0.8);
            return;
        }else{
            this.playerModel.mp -= spellModel.mp;
            var pop2 = new PopUpText('blue');
            pop2.setText('-' + spellModel.mp+' MP');
            APP.getEffectsContainer().addChild(pop2.getContent());
            pop2.setPosition(this.getPosition().x + this.centerPosition.x - 20, this.getPosition().y-5 + Math.random() * 10 - this.height/2 - 20);
            pop2.initMotion(-15 - (Math.random() * 10), 0.8);
        }

        var numFires = spellModel.isMultiple?10 :3;
        var tempFireSpeed = this.fireSpeed * 2;
        var tempFireFreq = this.fireFreq;
        var angle = Math.atan2( windowHeight/2 - mousePos.y + this.centerPosition.y,  windowWidth/2-mousePos.x+ this.centerPosition.x);
        // var angle = Math.atan2(this.getPosition().y-mousePos.y,  this.getPosition().x-mousePos.x);
        angle = angle * 180 / Math.PI * -1;
        angle += 90 + 180;
        angle = angle / 180 * Math.PI;

        var pair = 1;
        var odd = 1;
        var tempAcc = 0;
        var tempAngle = angle;
        var angleAcc = spellModel.isMultiple?360 :90;
        for (var i = 0; i < numFires; i++) {
            if(i > 0){
                if(i % 2 === 0){
                    tempAcc = pair;
                    pair ++;
                }else
                {
                    tempAcc = -odd;
                    odd ++;
                }
                tempAngle = angle + tempAcc * (angleAcc / numFires) * Math.PI / 180;
            }
            var tempFire = new Fire({x:tempFireSpeed * Math.sin(tempAngle), y: tempFireSpeed * Math.cos(tempAngle)});
            tempFire.timeLive = this.fireStepLive / 5;
            if(spellModel){
                this.playerModel.spellPower = spellModel.spellPower + this.weaponModel?this.weaponModel.magicPower:0;
                tempFire.imgSource = spellModel.srcImg;
            }
            tempFire.fireType = 'magical';
            tempFire.power = this.playerModel.getDemage('magical');
            tempFire.range *= 1.5;
            tempFire.build();
            tempFire.getContent().scale.x = 2;
            tempFire.getContent().scale.y = 2;
            tempFire.setPosition(this.getPosition().x + 40, this.getPosition().y +10);
            this.layer.addChild(tempFire);
            this.fireFreqAcum = tempFireFreq;
            // tempFire.getContent().rotation = -tempAngle + (180 * Math.PI / 180);
        }
    },
    //tiro com dano fisico
    shoot: function(mousePos, weaponModel){
        var self = this;
        var mouseX = -APP.getGameContent().position.x + windowWidth/2  + mousePos.x;
        var mouseY = -APP.getGameContent().position.y + windowHeight/2  + mousePos.y;
        //var angle = Math.atan2(APP.getGameContent().x + this.getPosition().y-mousePos.y, APP.getGameContent().y + this.getPosition().x-mousePos.x);
        var angle = Math.atan2( windowHeight/2 - mousePos.y + this.centerPosition.y,  windowWidth/2-mousePos.x+ this.centerPosition.x);
        // var angle = Math.atan2(this.getPosition().y-mousePos.y,  this.getPosition().x-mousePos.x);
        angle = angle * 180 / Math.PI * -1;
        angle += 90 + 180;
        angle = angle / 180 * Math.PI;

        var numFires = 1;
        var tempFireSpeed = this.fireSpeed;
        var tempFireFreq = this.fireFreq;
        if(this.relicModel){
            if(this.relicModel.status === '2shots'){
                numFires = 2;
            }
            if(this.relicModel.status === '3shots'){
                numFires = 3;
            }
            if(this.relicModel.status === 'powershot'){
                tempFireSpeed = this.fireSpeed * 2;
            }
            if(this.relicModel.status === 'speedshot'){
                tempFireFreq = this.fireFreq / 1.5;
            }
        }
        var pair = 1;
        var odd = 1;
        var tempAcc = 0;
        var tempAngle = angle;
        for (var i = 0; i < numFires; i++) {
            if(i > 0){
                if(i % 2 === 0){
                    tempAcc = pair;
                    pair ++;
                }else
                {
                    tempAcc = -odd;
                    odd ++;
                }
                tempAngle = angle + tempAcc * 10 * Math.PI / 180;
            }
            var tempFire = new Fire({x:tempFireSpeed * Math.sin(tempAngle), y: tempFireSpeed * Math.cos(tempAngle)});
            tempFire.timeLive = this.fireStepLive;
            if(weaponModel){
                this.playerModel.weaponPower = weaponModel.battlePower;
                tempFire.imgSource = weaponModel.srcImg;
            }
            tempFire.power = this.playerModel.getDemage('physical');
            tempFire.build();
            tempFire.setPosition(this.getPosition().x + 40, this.getPosition().y +10);
            this.layer.addChild(tempFire);
            this.fireFreqAcum = tempFireFreq;
            tempFire.getContent().rotation = -tempAngle + (180 * Math.PI / 180);
        }
    },
    preKill:function(){
        this._super();
        if(this.debugGraphic.parent){
            this.debugGraphic.parent.removeChild(this.debugGraphic);
            this.playerDead = true;
        }
    },
    regenHP:function(value){
        if(value + this.playerModel.hp > this.playerModel.hpMax){
            value = Math.floor(this.playerModel.hpMax - this.playerModel.hp);
        }
        if(value === 0){
            return;
        }
        this.playerModel.hp += value;
        var pop = new PopUpText('green');
        pop.setText('+'+value + 'HP');
        APP.getEffectsContainer().addChild(pop.getContent());
        pop.setPosition(this.getPosition().x + this.centerPosition.x - 20, this.getPosition().y-5 + Math.random() * 10 - this.height/2 - 20);
        pop.initMotion(-15 - (Math.random() * 10), 0.8);
        //dar baixa no inventório
    },
    regenMP:function(value){
        if(value + this.playerModel.mp > this.playerModel.mpMax){
            value = Math.floor(this.playerModel.mpMax - this.playerModel.mp);
        }
        if(value === 0){
            return;
        }
        this.playerModel.mp += value;
        var pop = new PopUpText('blue');
        pop.setText('+'+value + 'MP');
        APP.getEffectsContainer().addChild(pop.getContent());
        pop.setPosition(this.getPosition().x + this.centerPosition.x - 20, this.getPosition().y-5 + Math.random() * 10 - this.height/2 - 20);
        pop.initMotion(-15 - (Math.random() * 10), 0.8);
        //dar baixa no inventório
    },
    useItem: function(itemModel){
        if(itemModel.effect === 'regen HP'){
            this.regenHP(itemModel.baseValue);
        }
        else if(itemModel.effect === 'regen MP'){
            this.regenMP(itemModel.baseValue);
        }
        else if(itemModel.effect === 'haste'){
            if(this.hasteAcum <= 0){
                var pop = new PopUpText('white');
                pop.setText('HASTE');
                APP.getEffectsContainer().addChild(pop.getContent());
                pop.setPosition(this.getPosition().x + this.centerPosition.x - 20, this.getPosition().y-5 + Math.random() * 10 - this.height/2 - 20);
                pop.initMotion(-15 - (Math.random() * 10), 0.8);
                this.defaultVelocity = this.playerModel.velocity * 1.5;

                this.hasteAcum = 200;
            }
        }
    },
    reset: function(){
        this.deading = false;
        this.setPosition( windowWidth/2, windowHeight/2);
        this.spritesheet.play('idle');
        this.setVelocity(0,0);
        this.updateable = true;

    },
    collide:function(arrayCollide){
        // console.log('playerCollide', arrayCollide[0].type);

        if(arrayCollide[0].type === 'door'){
            // console.log('door collider');
            // if(arrayCollide[0].side === 'up' && this.virtualVelocity.y < 0 ||
            //     arrayCollide[0].side === 'down' && this.virtualVelocity.y > 0 ||
            //     arrayCollide[0].side === 'left' && this.virtualVelocity.x < 0 ||
            //     arrayCollide[0].side === 'right' && this.virtualVelocity.x > 0)
            {

                this.endLevel = true;
                this.nextNode = arrayCollide[0].node;
                this.nextDoorSide = arrayCollide[0].side;
            }
        }
        //COLISÃO DO PLAYER COM O INIMIGO
        // if(arrayCollide[0].type === 'enemy' && this.returnCollider <= 0){
        //     var angle = Math.atan2(this.getPosition().y-arrayCollide[0].getPosition().y,  this.getPosition().x-arrayCollide[0].getPosition().x);
        //     angle = angle * 180 / Math.PI;
        //     // this.setPosition(this.getPosition().x + arrayCollide[0].range * Math.sin(angle), this.getPosition().y + arrayCollide[0].range * Math.cos(angle));
        //     this.setVelocity(5 * Math.sin(angle), 5 * Math.cos(angle));
        //     this.returnCollider = 10;
        // }
    },
    touch: function(collection){
        this.isTouch = true;
        // console.log(collection);
        if(collection.left||collection.right && this.virtualVelocity.x !== 0)
        {
            this.velocity.x = 0;
        }
        if(collection.up|| collection.down && this.virtualVelocity.y !== 0)
        {
            this.velocity.y = 0;
        }
    },
    debug:function(){
        // draw a shape
        // console.log('debug', this.debugGraphic.parent);
        if(this.debugGraphic.parent === null && this.getContent().parent !== null)
        {
            this.getContent().parent.addChild(this.debugGraphic);
        }
        this.debugGraphic.clear();
        this.debugGraphic.beginFill(0xFF3300);
        this.debugGraphic.lineStyle(1, 0xffd900);
        this.debugGraphic.moveTo(this.bounds.x ,this.bounds.y);
        this.debugGraphic.lineTo(this.bounds.x + this.bounds.w, this.bounds.y);
        this.debugGraphic.lineTo(this.bounds.x + this.bounds.w, this.bounds.y + this.bounds.h);
        this.debugGraphic.lineTo(this.bounds.x, this.bounds.y + this.bounds.h);
        this.debugGraphic.endFill();
    },
    hurt:function(demage, type){
        if(this.playerModel.hp < 0){
            return;
        }
        if(!type){
            type = 'physical';
        }

        if(this.armorModel){
            this.playerModel.magicDefenseArmor = this.armorModel.magicDefenseArmor;
            this.playerModel.defenseArmor = this.armorModel.defenseArmor;
        }
        var trueDemage = this.playerModel.getHurt(demage, type);

        var pop = new PopUpText('red');
        pop.setText(Math.floor(trueDemage));
        APP.getEffectsContainer().addChild(pop.getContent());
        pop.setPosition(this.getPosition().x -10 + Math.random() * 20, this.getPosition().y-5 + Math.random() * 10 - this.height/2);
        pop.initMotion(-10 - (Math.random() * 10), 0.5);
        this.getTexture().tint = 0xFF0000;


        this.playerModel.hp -= trueDemage;
        if(this.playerModel.hp < 0){
            this.playerModel.hp = 0;
        }

        if(this.playerModel.hp <= 0){
            this.preKill();
        }
    },
    debugPolygon: function(color, force){
        if(this.lastColorDebug !== color || force){
            if(this.debugGraphic.parent === null && this.getContent().parent !== null)
            {
                this.getContent().parent.addChild(this.debugGraphic);
            }
            this.lastColorDebug = color;
            this.gambAcum ++;
            if(this.debugGraphic !== undefined){
                this.debugGraphic.clear();
            }else{
                this.debugGraphic = new PIXI.Graphics();
            }
            // console.log(this.polygon);
            this.debugGraphic.beginFill(color, 0.5);
            this.debugGraphic.lineStyle(1, 0xffd900);
            
            this.debugGraphic.drawCircle(this.getPosition().x + this.centerPosition.x,this.getPosition().y + this.centerPosition.y,this.range);
            // this.debugGraphic.moveTo(this.polygon.points[this.polygon.points.length - 1].x,this.polygon.points[this.polygon.points.length - 1].y);
            // // console.log('this.polygon',this.polygon.points);

            // for (var i = this.polygon.points.length - 2; i >= 0; i--) {
            //     this.debugGraphic.lineTo(this.polygon.points[i].x, this.polygon.points[i].y);
            // }
            this.debugGraphic.endFill();
        }
    },
});

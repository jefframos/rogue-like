/*! goyabpd 24-10-2014 */
function getRandomLevel() {
    var id = 3;
    return ALL_LEVELS[id];
}

function testMobile() {
    return !1;
}

function update() {
    requestAnimFrame(update);
    var tempRation = window.innerHeight / windowHeight, ratio = tempRation < window.innerWidth / windowWidth ? tempRation : window.innerWidth / windowWidth;
    windowWidthVar = windowWidth * ratio, windowHeightVar = windowHeight * ratio, renderer.view.style.width = windowWidth / 2 + "px", 
    renderer.view.style.height = windowHeight / 2 + "px", APP.update(), renderer.render(APP.stage);
}

var ALL_LEVELS = [ [ [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0 ], [ 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0 ], [ 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0 ], [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ] ], [ [ 2, 0, 0, 0, 3, 0, 0, 3, 0, 0, 0, 2 ], [ 0, 2, 2, 0, 0, 0, 0, 0, 0, 2, 2, 0 ], [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 2, 2, 0, 0, 0, 0, 0, 0, 2, 2, 0 ], [ 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2 ] ], [ [ 0, 0, 0, 0, 2, 0, 0, 2, 0, 0, 0, 0 ], [ 0, 3, 0, 0, 2, 0, 0, 2, 0, 0, 3, 0 ], [ 0, 0, 0, 0, 2, 0, 0, 2, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 2, 0, 0, 2, 0, 0, 0, 0 ], [ 0, 3, 0, 0, 2, 0, 0, 2, 0, 0, 3, 0 ], [ 0, 0, 0, 0, 2, 0, 0, 2, 0, 0, 0, 0 ] ], [ [ 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3 ], [ 0, 0, 0, 0, 2, 2, 2, 2, 2, 0, 0, 0, 0 ], [ 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2 ], [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ], [ 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2 ], [ 0, 0, 0, 0, 2, 2, 2, 2, 2, 0, 0, 0, 0 ], [ 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3 ] ], [ [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ] ] ], DungeonGenerator = Class.extend({
    init: function() {
        this.random = 0, this.numActivesNodes = 0, this.maxDist = 5, this.minNodes = 5, 
        this.seeds = 1, this.rooms = [], this.maxNodes = 10, this.mostDistant = new NodeModel(), 
        this.nodeLock = new NodeModel(), this.firstNode = new NodeModel(), this.keyNode = new NodeModel(), 
        this.precision = 1, this.seed = 0, this.rooms = [];
    },
    generate: function(seed, precision, minMax, bounds, maxLenght, start) {
        this.seed = seed, random = 0, 0 > maxLenght && (maxLenght = 99999), this.minNodes = minMax[0], 
        this.maxNodes = minMax[1], this.precision = precision, this.numActivesNodes = 0, 
        this.maxDist = -999999999, this.seeds = 1;
        var i = 0, j = 0;
        if (this.rooms.length <= 0) for (i = 0; i < bounds[0]; i++) {
            var temp = [];
            for (j = 0; j < bounds[1]; j++) {
                var tempModel = new NodeModel();
                tempModel.position = [ i, j ], temp.push(tempModel);
            }
            this.rooms.push(temp);
        }
        this.generateNodes(start ? start[0] : Math.floor(bounds[0] / 2), start ? start[1] : Math.floor(bounds[1] / 2), null, maxLenght), 
        this.mostDistant.mode = 4;
        var keyDistance = -9999999999;
        for (k = 0; k < this.rooms.length; k++) {
            var item = this.rooms[k];
            for (i = 0; i < item.length; i++) {
                var dist = this.pointDistance(this.mostDistant.position[0], this.mostDistant.position[1], item[i].position[0], item[i].position[1]);
                dist >= keyDistance && item[i].active && item[i].parentId > 0 && (keyDistance = dist, 
                this.keyNode = item[i]), item[i].parentId > 0 && item[i].position[0] === this.mostDistant.parentPosition[0] && item[i].position[1] === this.mostDistant.parentPosition[1] && (this.nodeLock = item[i]);
            }
        }
        this.nodeLock && (this.nodeLock.mode = 5), this.keyNode && (this.keyNode.mode = 6);
    },
    log: function() {
        for (var i = 0; i < this.rooms.length; i++) {
            for (var tempStr = "", item = this.rooms[i], j = 0; j < item.length; j++) 0 === item[j].mode && (tempStr += "| - |"), 
            1 === item[j].mode && (tempStr += "| ♥ |"), 2 === item[j].mode && (tempStr += "| o |"), 
            3 === item[j].mode && (tempStr += "| c |"), 4 === item[j].mode && (tempStr += "| b |"), 
            5 === item[j].mode && (tempStr += "| l |"), 6 === item[j].mode && (tempStr += "| K |");
            console.log(tempStr + "   " + i);
        }
        console.log(this.firstNode);
    },
    generateNodes: function(i, j, parent, maxLeght, forceAdd) {
        if (!((this.numActivesNodes >= this.maxNodes || 0 >= maxLeght) && !forceAdd || this.numActivesNodes > 50)) {
            for (var node = null, jj = 0; jj < this.rooms.length; jj++) for (var item = this.rooms[jj], ii = 0; ii < item.length; ii++) item[ii].position[0] === i && item[ii].position[1] === j && (node = item[ii]);
            if (node) {
                if (node.active && !forceAdd) return void this.minNodes++;
                if (this.minNodes--, node.mode = 2, this.numActivesNodes++, node.active = !0, node.id < 0 && (node.id = this.numActivesNodes), 
                parent && 1 !== node.id) {
                    node.parentPosition = parent.position, node.parentId = parent.id, node.parent = parent;
                    var dist = this.pointDistance(parent.position[0], parent.position[1], this.firstNode.position[0], this.firstNode.position[1]);
                    for (node.dist = dist, this.maxDist <= dist && node.parentId > 2 && (this.maxDist = dist, 
                    this.mostDistant = node), node.dist = dist, ri = this.rooms.length - 1; ri >= 0; ri--) {
                        var tempNodeArray = this.rooms[ri];
                        for (nj = tempNodeArray.length - 1; nj >= 0; nj--) tempNodeArray[nj].id === node.parentId && (tempNodeArray[nj].position[1] > node.position[1] ? tempNodeArray[nj].childrenSides[0] = node : tempNodeArray[nj].position[1] < node.position[1] ? tempNodeArray[nj].childrenSides[1] = node : tempNodeArray[nj].position[0] > node.position[0] ? tempNodeArray[nj].childrenSides[2] = node : tempNodeArray[nj].position[0] < node.position[0] && (tempNodeArray[nj].childrenSides[3] = node));
                    }
                    node.parent.position[1] < node.position[1] ? node.childrenSides[0] = node.parent : node.parent.position[1] > node.position[1] ? node.childrenSides[1] = node.parent : node.parent.position[0] < node.position[0] ? node.childrenSides[2] = node.parent : node.parent.position[0] > node.position[0] && (node.childrenSides[3] = node.parent);
                } else node.id = 1, node.mode = 1, this.firstNode = node;
                var has = !1;
                if (this.getNextFloat() < this.seeds || this.minNodes > 0) {
                    this.seeds *= this.precision;
                    for (var tmpArr = [ 0, 0 ], arrayGens = [], rndTest = 1 === node.id, rndValue = rndTest ? .9 : .4, k = 0; 4 > k; k++) if (this.getNextFloat() < rndValue) {
                        has = !0, 0 === k ? tmpArr = [ -1, 0 ] : 1 === k ? tmpArr = [ 1, 0 ] : 2 === k ? tmpArr = [ 0, 1 ] : 3 === k && (tmpArr = [ 0, -1 ]);
                        var objGen = {};
                        objGen.i = i + tmpArr[0], objGen.j = j + tmpArr[1], objGen.parentPosition = [ i, j ], 
                        objGen.parent = node, arrayGens.push(objGen);
                    }
                    for (var n = arrayGens.length - 1; n >= 0; n--) {
                        var obj = arrayGens[n];
                        rndTest || maxLeght--, this.generateNodes(obj.i, obj.j, obj.parent, maxLeght, rndTest);
                    }
                    if (this.minNodes > 0 || this.seeds >= 1) {
                        var tempRnd = this.getNextFloat();
                        tmpArr = .25 > tempRnd ? [ -1, 0 ] : .5 > tempRnd ? [ 1, 0 ] : .75 > tempRnd ? [ 0, 1 ] : [ 0, -1 ], 
                        this.generateNodes(i + tmpArr[0], j + tmpArr[1], node, --maxLeght);
                    }
                }
                has || (node.mode = 3);
            }
        }
    },
    pointDistance: function(x, y, x0, y0) {
        return Math.sqrt((x -= x0) * x + (y -= y0) * y);
    },
    getNextFloat: function() {
        var x = 1e4 * Math.sin(this.seed++);
        return x - Math.floor(x);
    }
}), NodeModel = Class.extend({
    init: function() {
        this.position = [], this.dist = 0, this.parentPosition = [], this.childrenSides = [ null, null, null, null ], 
        this.parentId = -1, this.parent = null, this.active = !1, this.mode = 0, this.id = -1;
    }
}), SmartObject = Class.extend({
    init: function() {
        MicroEvent.mixin(this);
    },
    show: function() {},
    hide: function() {},
    build: function() {},
    destroy: function() {}
}), SmartSocket = Class.extend({
    init: function() {
        MicroEvent.mixin(this);
    },
    build: function() {},
    writeObj: function(obj) {
        this.trigger(SmartSocket.WRITE_OBJ, obj);
    },
    readSocketList: function(obj) {
        this.trigger(SmartSocket.READ_SOCKET_SNAPSHOT, obj);
    },
    readObj: function(obj) {
        this.trigger(SmartSocket.READ_OBJ, obj);
    },
    readLast: function(obj) {
        this.trigger(SmartSocket.READ_LAST, obj);
    },
    setReadCallback: function(callback) {
        this.readCallback = callback;
    },
    socketError: function() {
        this.trigger(SmartSocket.SOCKET_ERROR, obj);
    },
    setObj: function(obj) {
        this.trigger(SmartSocket.SET_OBJ, obj);
    },
    updateObj: function(obj) {
        this.trigger(SmartSocket.UPDATE_OBJ, obj);
    },
    destroy: function() {}
});

SmartSocket.UPDATE_OBJ = "updateObj", SmartSocket.READ_OBJ = "readObj", SmartSocket.READ_SOCKET_SNAPSHOT = "readSocketSnapshot", 
SmartSocket.READ_LAST = "readLast", SmartSocket.WRITE_OBJ = "writeObj", SmartSocket.SET_OBJ = "setObj", 
SmartSocket.SOCKET_ERROR = "socketError";

var Application = AbstractApplication.extend({
    init: function() {
        this._super(windowWidth, windowHeight), this.stage.setBackgroundColor(16777215), 
        this.stage.removeChild(this.loadText), this.isMobile = testMobile(), this.id = parseInt(1e11 * Math.random()), 
        this.gen = new DungeonGenerator(), this.gen.generate(16777215 * Math.random(), 1, [ 10, 15 ], [ 12, 12 ], 5), 
        this.gen.log(), this.tileSize = {
            x: 80,
            y: 80
        };
        var model1 = new PlayerModel();
        model1.log(), model1.levelUp(), model1.log(), model1.levelUp(), model1.log(), model1.levelUp(), 
        model1.log(), model1.levelUp(), model1.log(), model1.levelUp(), model1.log(), model1.levelUp(), 
        model1.log(), model1.levelUp(), model1.log();
    },
    build: function() {
        this.spellList = [], this.spellList.push(new SpellModel(1, "bolt1", 6, 20)), this.spellList.push(new SpellModel(1, "fire1", 4, 21)), 
        this.spellList.push(new SpellModel(1, "ice1", 5, 22)), this.spellList.push(new SpellModel(1, "poison", 3, 25)), 
        this.spellList.push(new SpellModel(1, "wind", 75, 25)), this.spellList.push(new SpellModel(2, "bolt2", 22, 26)), 
        this.spellList.push(new SpellModel(2, "fire2", 20, 60)), this.spellList.push(new SpellModel(2, "ice2", 21, 62)), 
        this.spellList.push(new SpellModel(2, "drain", 15, 38)), this.spellList.push(new SpellModel(3, "meteor", 62, 36)), 
        this.spellList.push(new SpellModel(3, "bio", 26, 53)), this.spellList.push(new SpellModel(3, "flare", 45, 60)), 
        this.spellList.push(new SpellModel(4, "quake", 50, 111)), this.spellList.push(new SpellModel(5, "bolt3", 53, 120)), 
        this.spellList.push(new SpellModel(5, "fire3", 51, 121)), this.spellList.push(new SpellModel(5, "ice3", 52, 122)), 
        this.spellList.push(new SpellModel(6, "merton", 85, 138)), this.spellList.push(new SpellModel(7, "ultima", 80, 150)), 
        this._super(), this.onAssetsLoaded();
    },
    onAssetsLoaded: function() {
        this.mainApp = new GameScreen("Main"), this.screenManager.addScreen(this.mainApp), 
        this.screenManager.change("Main");
    },
    show: function() {},
    hide: function() {},
    destroy: function() {}
}), Door = Entity.extend({
    init: function(side) {
        this._super(!0), this.updateable = !1, this.deading = !1, this.side = side, this.range = APP.tileSize.x / 1.8, 
        this.width = APP.tileSize.x, this.height = APP.tileSize.y, this.type = "door", this.node = null, 
        this.updateable = !0;
    },
    getBounds: function() {
        return this.bounds = {
            x: this.getPosition().x - this.width / 2,
            y: this.getPosition().y - this.height / 2,
            w: this.width,
            h: this.height
        }, this.collisionPoints = {
            up: {
                x: this.bounds.x + this.bounds.w / 2,
                y: this.bounds.y
            },
            down: {
                x: this.bounds.x + this.bounds.w / 2,
                y: this.bounds.y + this.bounds.h
            },
            bottomLeft: {
                x: this.bounds.x,
                y: this.bounds.y + this.bounds.h
            },
            topLeft: {
                x: this.bounds.x,
                y: this.bounds.y
            },
            bottomRight: {
                x: this.bounds.x + this.bounds.w,
                y: this.bounds.y + this.bounds.h
            },
            topRight: {
                x: this.bounds.x + this.bounds.w,
                y: this.bounds.y
            }
        }, this.polygon = new PIXI.Polygon(new PIXI.Point(this.bounds.x + this.bounds.w / 2, this.bounds.y), new PIXI.Point(this.bounds.x, this.bounds.y), new PIXI.Point(this.bounds.x, this.bounds.y + this.bounds.h), new PIXI.Point(this.bounds.x + this.bounds.w / 2, this.bounds.y + this.bounds.h), new PIXI.Point(this.bounds.x + this.bounds.w, this.bounds.y + this.bounds.h), new PIXI.Point(this.bounds.x + this.bounds.w, this.bounds.y)), 
        this.bounds;
    },
    debugPolygon: function(color, force) {
        (this.lastColorDebug !== color || force) && (null === this.debugGraphic.parent && null !== this.getContent().parent && this.getContent().parent.addChild(this.debugGraphic), 
        this.lastColorDebug = color, this.gambAcum++, void 0 !== this.debugGraphic ? this.debugGraphic.clear() : this.debugGraphic = new PIXI.Graphics(), 
        this.debugGraphic.beginFill(color, .5), this.debugGraphic.lineStyle(1, 16767232), 
        this.debugGraphic.drawCircle(this.getPosition().x + this.centerPosition.x, this.getPosition().y + this.centerPosition.y, this.range), 
        this.debugGraphic.endFill());
    },
    build: function() {
        this._super("_dist/img/cubo2.png");
        this.debugGraphic = new PIXI.Graphics(), this.debugGraphic.beginFill(16724736), 
        this.debugGraphic.lineStyle(1, 16767232, 1), this.debugGraphic.endFill(), this.getContent().alpha = .5;
    },
    update: function() {
        this._super(), this.getBounds(), this.debugPolygon(5596740, !0);
    },
    preKill: function() {
        this._super(), this.debugGraphic.parent && this.debugGraphic.parent.removeChild(this.debugGraphic);
    },
    pointDistance: function(x, y, x0, y0) {
        return Math.sqrt((x -= x0) * x + (y -= y0) * y);
    }
}), Fire = Entity.extend({
    init: function(vel) {
        this._super(!0), this.updateable = !1, this.deading = !1, this.range = 60, this.width = 1, 
        this.height = 1, this.type = "fire", this.fireType = "physical", this.node = null, 
        this.velocity.x = vel.x, this.velocity.y = vel.y, this.timeLive = 10, this.power = 1, 
        this.defaultVelocity = 1;
    },
    getBounds: function() {
        return this.bounds = {
            x: this.getPosition().x - this.width / 2,
            y: this.getPosition().y - this.height / 2,
            w: this.width,
            h: this.height
        }, this.centerPosition = {
            x: this.width / 2,
            y: this.height / 2
        }, this.collisionPoints = {
            up: {
                x: this.bounds.x + this.bounds.w / 2,
                y: this.bounds.y
            },
            down: {
                x: this.bounds.x + this.bounds.w / 2,
                y: this.bounds.y + this.bounds.h
            },
            bottomLeft: {
                x: this.bounds.x,
                y: this.bounds.y + this.bounds.h
            },
            topLeft: {
                x: this.bounds.x,
                y: this.bounds.y
            },
            bottomRight: {
                x: this.bounds.x + this.bounds.w,
                y: this.bounds.y + this.bounds.h
            },
            topRight: {
                x: this.bounds.x + this.bounds.w,
                y: this.bounds.y
            }
        }, this.polygon = new PIXI.Polygon(new PIXI.Point(this.bounds.x + this.bounds.w / 2, this.bounds.y), new PIXI.Point(this.bounds.x, this.bounds.y), new PIXI.Point(this.bounds.x, this.bounds.y + this.bounds.h), new PIXI.Point(this.bounds.x + this.bounds.w / 2, this.bounds.y + this.bounds.h), new PIXI.Point(this.bounds.x + this.bounds.w, this.bounds.y + this.bounds.h), new PIXI.Point(this.bounds.x + this.bounds.w, this.bounds.y)), 
        this.bounds;
    },
    debugPolygon: function(color, force) {
        if (this.lastColorDebug !== color || force) {
            null === this.debugGraphic.parent && null !== this.getContent().parent && this.getContent().parent.addChild(this.debugGraphic), 
            this.lastColorDebug = color, this.gambAcum++, void 0 !== this.debugGraphic ? this.debugGraphic.clear() : this.debugGraphic = new PIXI.Graphics(), 
            this.debugGraphic.beginFill(color, .5), this.debugGraphic.lineStyle(1, 16767232), 
            this.debugGraphic.moveTo(this.polygon.points[this.polygon.points.length - 1].x, this.polygon.points[this.polygon.points.length - 1].y);
            for (var i = this.polygon.points.length - 2; i >= 0; i--) this.debugGraphic.lineTo(this.polygon.points[i].x, this.polygon.points[i].y);
            this.debugGraphic.endFill();
        }
    },
    build: function() {
        this._super("_dist/img/fireball.png"), this.updateable = !0, this.collidable = !0, 
        this.debugGraphic = new PIXI.Graphics(), this.debugGraphic.beginFill(1127168), this.debugGraphic.lineStyle(1, 16767232, 1), 
        this.debugGraphic.endFill();
    },
    update: function() {
        this._super(), this.timeLive--, this.timeLive <= 0 && this.preKill(), this.getContent() && (this.width = this.getContent().width, 
        this.height = this.getContent().height), this.getBounds(), this.range = this.width / 2;
    },
    collide: function(arrayCollide) {
        this.collidable && "enemy" === arrayCollide[0].type && (this.getContent().tint = 16711680, 
        this.preKill(), arrayCollide[0].hurt(this.power, this.fireType));
    },
    preKill: function() {
        if (this.collidable) {
            var self = this;
            this.updateable = !1, this.collidable = !1, TweenLite.to(this.getContent().scale, .3, {
                x: .2,
                y: .2,
                onComplete: function() {
                    self.kill = !0;
                }
            }), this.debugGraphic.parent && this.debugGraphic.parent.removeChild(this.debugGraphic);
        }
    },
    pointDistance: function(x, y, x0, y0) {
        return Math.sqrt((x -= x0) * x + (y -= y0) * y);
    },
    touch: function() {
        this.preKill();
    }
}), Heart = SpritesheetEntity.extend({
    init: function() {
        this._super(!0), this.updateable = !1, this.deading = !1, this.range = 60, this.width = 142, 
        this.height = 142, this.type = "heart", this.node = null, this.life = 5;
    },
    hurt: function(power) {
        console.log("hurt"), this.life -= power, this.life <= 0 && this.preKill();
    },
    collide: function() {
        console.log("this.node", this.node), console.log("col enemy");
    },
    getBounds: function() {
        return this.bounds = {
            x: this.getPosition().x,
            y: this.getPosition().y,
            w: this.width,
            h: this.height
        }, this.centerPosition = {
            x: this.width / 2,
            y: this.height / 2
        }, this.collisionPoints = {
            up: {
                x: this.bounds.x + this.bounds.w / 2,
                y: this.bounds.y
            },
            down: {
                x: this.bounds.x + this.bounds.w / 2,
                y: this.bounds.y + this.bounds.h
            },
            bottomLeft: {
                x: this.bounds.x,
                y: this.bounds.y + this.bounds.h
            },
            topLeft: {
                x: this.bounds.x,
                y: this.bounds.y
            },
            bottomRight: {
                x: this.bounds.x + this.bounds.w,
                y: this.bounds.y + this.bounds.h
            },
            topRight: {
                x: this.bounds.x + this.bounds.w,
                y: this.bounds.y
            }
        }, this.polygon = new PIXI.Polygon(new PIXI.Point(this.bounds.x + this.bounds.w / 2, this.bounds.y), new PIXI.Point(this.bounds.x, this.bounds.y), new PIXI.Point(this.bounds.x, this.bounds.y + this.bounds.h), new PIXI.Point(this.bounds.x + this.bounds.w / 2, this.bounds.y + this.bounds.h), new PIXI.Point(this.bounds.x + this.bounds.w, this.bounds.y + this.bounds.h), new PIXI.Point(this.bounds.x + this.bounds.w, this.bounds.y)), 
        this.bounds;
    },
    debugPolygon: function(color, force) {
        if (this.lastColorDebug !== color || force) {
            null === this.debugGraphic.parent && null !== this.getContent().parent && this.getContent().parent.addChild(this.debugGraphic), 
            this.lastColorDebug = color, this.gambAcum++, void 0 !== this.debugGraphic ? this.debugGraphic.clear() : this.debugGraphic = new PIXI.Graphics(), 
            this.debugGraphic.beginFill(color, .5), this.debugGraphic.lineStyle(1, 16767232), 
            this.debugGraphic.moveTo(this.polygon.points[this.polygon.points.length - 1].x, this.polygon.points[this.polygon.points.length - 1].y);
            for (var i = this.polygon.points.length - 2; i >= 0; i--) this.debugGraphic.lineTo(this.polygon.points[i].x, this.polygon.points[i].y);
            this.debugGraphic.endFill();
        }
    },
    build: function() {
        var motionArray = this.getFramesByRange("dragon10", 0, 14), animationIdle = new SpritesheetAnimation();
        animationIdle.build("idle", motionArray, 1, !0, null), this.spritesheet = new Spritesheet(), 
        this.spritesheet.addAnimation(animationIdle), this.spritesheet.play("idle"), this.respaw();
    },
    update: function() {
        this._super(), this.getBounds(), this.getTexture() && (this.getContent().position.x = 80, 
        this.getContent().position.y = -20, this.range = this.bounds.w / 2);
    },
    preKill: function() {
        var self = this;
        this.updateable = !1, this.collidable = !1, TweenLite.to(this.getContent(), .5, {
            alpha: 0,
            onComplete: function() {
                self.kill = !0;
            }
        });
    },
    respaw: function() {
        this.deading = !1;
        var rndPos = {
            x: 142 * Math.floor(12 * Math.random() * 142 / 142) + 104,
            y: 142 * Math.floor(7 * Math.random() * 142 / 142) + 177 + 142
        };
        this.pointDistance(rndPos.x, rndPos.y, windowWidth / 2, windowHeight / 2) < 200 && this.respaw(), 
        this.setPosition(7 * Math.floor(rndPos.x / 7), 7 * Math.floor(rndPos.y / 7)), this.spritesheet.play("idle"), 
        this.setVelocity(0, 0), this.updateable = !0, this.collidable = !0;
    },
    pointDistance: function(x, y, x0, y0) {
        return Math.sqrt((x -= x0) * x + (y -= y0) * y);
    }
}), Minimap = Class.extend({
    init: function(img) {
        img ? this.texture = "string" == typeof img ? new PIXI.Texture.fromImage(img) : img : this.background = new PIXI.Graphics(), 
        this.container = new PIXI.DisplayObjectContainer(), this.container.addChild(this.background), 
        this.arrayRooms = [], this.margin = {
            x: 20,
            y: 20
        }, this.sizeTile = {
            x: 50,
            y: 50
        }, this.sizeGraph = {
            x: 30,
            y: 30
        };
    },
    build: function() {
        for (var minX = 9999, minY = 9999, maxX = -9999, maxY = -9999, tempX = 0, tempY = 0, j = 0; j < APP.gen.rooms.length; j++) for (var item = APP.gen.rooms[j], i = 0; i < item.length; i++) if (item[i].id > 0) {
            var tempRoomView = new PIXI.Graphics();
            tempRoomView.beginFill(1 === item[i].mode ? 5428328 : 2 === item[i].mode ? 11447982 : 3 === item[i].mode ? 16239929 : 4 === item[i].mode ? 16202041 : 5 === item[i].mode ? 2171169 : 6 === item[i].mode ? 13324996 : 16777215), 
            tempRoomView.lineStyle(1, 3355443, 1), tempX = item[i].position[1] * this.sizeTile.x, 
            tempY = item[i].position[0] * this.sizeTile.y, tempRoomView.position.x = tempX, 
            tempRoomView.position.y = tempY, tempRoomView.drawRect(0, 0, this.sizeGraph.x, this.sizeGraph.y), 
            tempRoomView.endFill(), this.container.addChild(tempRoomView), minX > item[i].position[1] && (minX = item[i].position[1]), 
            minY > item[i].position[0] && (minY = item[i].position[0]), maxX < item[i].position[1] && (maxX = item[i].position[1]), 
            maxY < item[i].position[0] && (maxY = item[i].position[0]), this.arrayRooms.push(tempRoomView);
        }
        for (var k = 0; k < this.arrayRooms.length; k++) this.arrayRooms[k].position.x -= minX * this.sizeTile.x - this.margin.x - this.sizeGraph.x / 2, 
        this.arrayRooms[k].position.y -= minY * this.sizeTile.y - this.margin.y - this.sizeGraph.y / 2;
        this.background.beginFill(0), this.background.drawRect(0, 0, (maxX - minX + 1) * this.sizeTile.x + 2 * this.margin.x + this.sizeGraph.x / 2, (maxY - minY + 1) * this.sizeTile.y + 2 * this.margin.y + this.sizeGraph.y / 2), 
        this.background.endFill();
    },
    getContent: function() {
        return this.container;
    },
    setPosition: function(x, y) {
        this.container.position.x = x, this.container.position.y = y;
    }
}), Obstacle = Entity.extend({
    init: function(imgId) {
        this._super(), this.updateable = !0, this.collidable = !0, this.arrayObstacles = [ "_dist/img/2.png", "_dist/img/3.png", "_dist/img/2.png" ], 
        this.srcImg = this.arrayObstacles[imgId], this.type = "environment", this.width = APP.tileSize.x, 
        this.height = APP.tileSize.x, this.debugGraphic = new PIXI.Graphics(), this.debugGraphic.beginFill(16724736), 
        this.debugGraphic.lineStyle(1, 16767232, 1), this.debugGraphic.endFill(), this.range = 0;
    },
    preKill: function() {
        this._super(), this.getContent().cacheAsBitmap = !0, this.debugGraphic.parent && this.debugGraphic.parent.removeChild(this.debugGraphic);
    },
    getBounds: function() {
        return this.bounds = {
            x: this.getPosition().x - this.width * this.sprite.anchor.x,
            y: this.getPosition().y - this.height * this.sprite.anchor.y,
            w: this.width,
            h: this.height
        }, this.bounds;
    },
    build: function() {
        this._super(this.srcImg);
        this.sprite.anchor.x = 0, this.sprite.anchor.y = 1;
    },
    update: function() {
        this._super(), null === this.debugGraphic.parent && null !== this.getContent().parent && (this.getBounds(), 
        this.debugGraphic.drawRect(this.bounds.x, this.bounds.y, this.bounds.w, this.bounds.h), 
        this.getContent().parent.addChild(this.debugGraphic));
    },
    respaw: function() {
        var rndPos = {
            x: 142 * Math.floor(12 * Math.random() * 142 / 142) + 104,
            y: 142 * Math.floor(7 * Math.random() * 142 / 142) + 177 + 142
        };
        this.pointDistance(rndPos.x, rndPos.y, windowWidth / 2, windowHeight / 2) < 200 && this.respaw(), 
        this.setPosition(rndPos.x, rndPos.y), this.collidable = !0;
    },
    pointDistance: function(x, y, x0, y0) {
        return Math.sqrt((x -= x0) * x + (y -= y0) * y);
    }
}), Player = SpritesheetEntity.extend({
    init: function(model) {
        this._super(!0), this.updateable = !1, this.deading = !1, this.collidable = !0, 
        this.range = APP.tileSize.x / 2, this.width = .8 * APP.tileSize.x, this.height = .8 * APP.tileSize.y, 
        this.type = "player", this.collisionPointsMarginDivide = 0, this.isTouch = !1, this.boundsCollision = !0, 
        this.playerModel = model, this.fireModel = new FireModel(), this.endLevel = !1, 
        this.centerPosition = {
            x: this.width / 2,
            y: this.height / 4
        }, this.defaultVelocity = this.playerModel.velocity, this.fireFreq = this.playerModel.fireFreq, 
        this.life = this.playerModel.life, console.log(this.playerModel.getSpeed("normal")), 
        this.fireSpeed = this.fireModel.fireSpeed, this.fireStepLive = this.fireModel.fireStepLive, 
        this.firePower = this.fireModel.firePower, this.fireFreqAcum = 0;
    },
    build: function() {
        var self = this, motionArray = this.getFramesByRange("chinesa10", 0, 8), animationIdle = new SpritesheetAnimation();
        animationIdle.build("idle", motionArray, 1, !0, null);
        var motionArrayDead = this.getFramesByRange("chinesa10", 0, 8), animationDead = new SpritesheetAnimation();
        animationDead.build("dead", motionArrayDead, 2, !1, function() {
            TweenLite.to(self.spritesheet.scale, .2, {
                x: 0,
                y: 0
            });
        }), this.spritesheet = new Spritesheet(), this.spritesheet.addAnimation(animationIdle), 
        this.spritesheet.addAnimation(animationDead), this.spritesheet.play("idle"), this.reset(), 
        this.counter = 0, this.debugGraphic = new PIXI.Graphics(), this.debugGraphic.beginFill(16724736), 
        this.debugGraphic.lineStyle(1, 16767232, 1), this.debugGraphic.endFill();
    },
    getBounds: function() {
        return this.bounds = {
            x: this.getPosition().x,
            y: this.getPosition().y,
            w: this.width,
            h: this.height
        }, this.collisionPoints = {
            up: {
                x: this.bounds.x + this.bounds.w / 2,
                y: this.bounds.y
            },
            down: {
                x: this.bounds.x + this.bounds.w / 2,
                y: this.bounds.y + this.bounds.h
            },
            bottomLeft: {
                x: this.bounds.x,
                y: this.bounds.y + this.bounds.h
            },
            topLeft: {
                x: this.bounds.x,
                y: this.bounds.y
            },
            bottomRight: {
                x: this.bounds.x + this.bounds.w,
                y: this.bounds.y + this.bounds.h
            },
            topRight: {
                x: this.bounds.x + this.bounds.w,
                y: this.bounds.y
            }
        }, this.polygon = new PIXI.Polygon(new PIXI.Point(this.bounds.x + this.bounds.w / 2, this.bounds.y), new PIXI.Point(this.bounds.x, this.bounds.y), new PIXI.Point(this.bounds.x, this.bounds.y + this.bounds.h), new PIXI.Point(this.bounds.x + this.bounds.w / 2, this.bounds.y + this.bounds.h), new PIXI.Point(this.bounds.x + this.bounds.w, this.bounds.y + this.bounds.h), new PIXI.Point(this.bounds.x + this.bounds.w, this.bounds.y)), 
        this.bounds;
    },
    update: function() {
        this.isTouch || (this.velocity = this.virtualVelocity), this.deading && this.setVelocity(0, 0), 
        this._super(), this.debugPolygon(5596740, !0), this.getTexture() && (this.getContent().position.x = 20);
    },
    shoot: function(mousePos) {
        var angle = Math.atan2(this.getPosition().y - mousePos.y, this.getPosition().x - mousePos.x);
        angle = 180 * angle / Math.PI * -1, angle += 270, angle = angle / 180 * Math.PI;
        for (var i = 0; 1 > i; i++) {
            var tempFire = new Fire({
                x: this.fireSpeed * Math.sin(angle),
                y: this.fireSpeed * Math.cos(angle)
            });
            tempFire.timeLive = this.fireStepLive, tempFire.power = this.playerModel.getDemage("physical"), 
            tempFire.build(), tempFire.setPosition(this.getPosition().x + 40, this.getPosition().y + 10), 
            this.layer.addChild(tempFire), this.fireFreqAcum = this.fireFreq;
        }
    },
    preKill: function() {
        this._super(), this.debugGraphic.parent && this.debugGraphic.parent.removeChild(this.debugGraphic);
    },
    reset: function() {
        this.deading = !1, this.setPosition(windowWidth / 2, windowHeight / 2), this.spritesheet.play("idle"), 
        this.setVelocity(0, 0), this.updateable = !0;
    },
    collide: function(arrayCollide) {
        "door" === arrayCollide[0].type && (console.log("door collider"), ("up" === arrayCollide[0].side && this.virtualVelocity.y < 0 || "down" === arrayCollide[0].side && this.virtualVelocity.y > 0 || "left" === arrayCollide[0].side && this.virtualVelocity.x < 0 || "right" === arrayCollide[0].side && this.virtualVelocity.x > 0) && (this.endLevel = !0, 
        this.nextNode = arrayCollide[0].node, this.nextDoorSide = arrayCollide[0].side)), 
        "enemy" === arrayCollide[0].type;
    },
    touch: function(collection) {
        this.isTouch = !0, console.log(collection), (collection.left || collection.right && 0 !== this.virtualVelocity.x) && (this.velocity.x = 0), 
        (collection.up || collection.down && 0 !== this.virtualVelocity.y) && (this.velocity.y = 0);
    },
    debug: function() {
        null === this.debugGraphic.parent && null !== this.getContent().parent && this.getContent().parent.addChild(this.debugGraphic), 
        this.debugGraphic.clear(), this.debugGraphic.beginFill(16724736), this.debugGraphic.lineStyle(1, 16767232), 
        this.debugGraphic.moveTo(this.bounds.x, this.bounds.y), this.debugGraphic.lineTo(this.bounds.x + this.bounds.w, this.bounds.y), 
        this.debugGraphic.lineTo(this.bounds.x + this.bounds.w, this.bounds.y + this.bounds.h), 
        this.debugGraphic.lineTo(this.bounds.x, this.bounds.y + this.bounds.h), this.debugGraphic.endFill();
    },
    debugPolygon: function(color, force) {
        (this.lastColorDebug !== color || force) && (null === this.debugGraphic.parent && null !== this.getContent().parent && this.getContent().parent.addChild(this.debugGraphic), 
        this.lastColorDebug = color, this.gambAcum++, void 0 !== this.debugGraphic ? this.debugGraphic.clear() : this.debugGraphic = new PIXI.Graphics(), 
        this.debugGraphic.beginFill(color, .5), this.debugGraphic.lineStyle(1, 16767232), 
        this.debugGraphic.drawCircle(this.getPosition().x + this.centerPosition.x, this.getPosition().y + this.centerPosition.y, this.range), 
        this.debugGraphic.endFill());
    }
}), Enemy = SpritesheetEntity.extend({
    init: function(player) {
        this._super(!0), this.updateable = !1, this.deading = !1, this.range = APP.tileSize.x / 2, 
        this.width = .9 * APP.tileSize.x, this.height = .9 * APP.tileSize.y, this.type = "enemy", 
        this.node = null, this.life = 20, this.boundsCollision = !0, this.defaultVelocity = 1, 
        this.player = player, this.monsterModel = new MonsterModel(), this.behaviour = new DefaultBehaviour(this, player);
    },
    hurt: function(demage, type) {
        this.getTexture().tint = 16711680;
        var trueDemage = this.monsterModel.getHurt(demage, type);
        console.log(demage, "hurt", trueDemage), this.life -= trueDemage, this.life <= 0 && this.preKill();
    },
    build: function() {
        var motionArray = this.getFramesByRange("dragon10", 0, 14), animationIdle = new SpritesheetAnimation();
        animationIdle.build("idle", motionArray, 1, !0, null), this.spritesheet = new Spritesheet(), 
        this.spritesheet.addAnimation(animationIdle), this.spritesheet.play("idle"), this.centerPosition = {
            x: this.width / 2,
            y: this.height / 2
        }, this.updateable = !0, this.collidable = !0;
    },
    update: function() {
        this.behaviour.update(), this.isTouch || (this.velocity = this.virtualVelocity), 
        this._super(), this.getBounds(), this.getTexture() && (this.getContent().position.x = 20);
    },
    preKill: function() {
        var self = this;
        this.player.playerModel.updateXp(this.monsterModel.xp), this.updateable = !1, this.collidable = !1, 
        TweenLite.to(this.getContent(), .5, {
            alpha: 0,
            onComplete: function() {
                self.kill = !0;
            }
        });
    },
    pointDistance: function(x, y, x0, y0) {
        return Math.sqrt((x -= x0) * x + (y -= y0) * y);
    },
    touch: function(collection) {
        this.isTouch = !0, (collection.left || collection.right && 0 !== this.virtualVelocity.x) && (this.velocity.x = 0), 
        (collection.up || collection.down && 0 !== this.virtualVelocity.y) && (this.velocity.y = 0);
    }
}), FlightEnemy = Enemy.extend({
    init: function(position) {
        this._super(!0), this.updateable = !1, this.deading = !1, this.range = 60, this.width = 71, 
        this.height = 71, this.type = "flight", this.node = null, this.life = 10, this.radius = 200, 
        this.acumSimCos = 0, this.setPosition(position.x, position.y), this.boundsCollision = !0;
    },
    build: function() {
        var motionArray = this.getFramesByRange("dragon10", 0, 14), animationIdle = new SpritesheetAnimation();
        animationIdle.build("idle", motionArray, 1, !0, null), this.spritesheet = new Spritesheet(), 
        this.spritesheet.addAnimation(animationIdle), this.spritesheet.play("idle"), this.centerPosition = {
            x: this.width / 2,
            y: this.height / 2
        }, this.updateable = !0, this.collidable = !0, this.debugGraphic = new PIXI.Graphics(), 
        this.debugGraphic.beginFill(16724736), this.debugGraphic.lineStyle(1, 16767232, 1), 
        this.debugGraphic.endFill(), this.virtualVelocity.x = 5, this.virtualVelocity.y = -5;
    },
    debug: function() {
        null === this.debugGraphic.parent && null !== this.getContent().parent && this.getContent().parent.addChild(this.debugGraphic), 
        this.debugGraphic.clear(), this.debugGraphic.beginFill(16724736), this.debugGraphic.lineStyle(1, 16767232), 
        this.debugGraphic.moveTo(this.bounds.x, this.bounds.y), this.debugGraphic.lineTo(this.bounds.x + this.bounds.w, this.bounds.y), 
        this.debugGraphic.lineTo(this.bounds.x + this.bounds.w, this.bounds.y + this.bounds.h), 
        this.debugGraphic.lineTo(this.bounds.x, this.bounds.y + this.bounds.h), this.debugGraphic.endFill();
    },
    update: function() {
        this._super(), this.getBounds(), this.acumSimCos += .05, this.virtualVelocity.x = 5 * Math.sin(this.acumSimCos), 
        this.virtualVelocity.y = 5 * Math.cos(this.acumSimCos);
    },
    preKill: function() {
        var self = this;
        this.updateable = !1, this.collidable = !1, TweenLite.to(this.getContent(), .5, {
            alpha: 0,
            onComplete: function() {
                self.kill = !0;
            }
        });
    },
    pointDistance: function(x, y, x0, y0) {
        return Math.sqrt((x -= x0) * x + (y -= y0) * y);
    },
    touch: function(collection) {
        this.isTouch = !0, (collection.left || collection.right && 0 !== this.virtualVelocity.x) && (this.velocity.x = 0), 
        (collection.up || collection.down && 0 !== this.virtualVelocity.y) && (this.velocity.y = 0);
    }
}), DefaultBehaviour = Class.extend({
    init: function(entity, player) {
        this.player = player, this.entity = entity, this.life = 8, this.entity.setVelocity(-2, 3 * (Math.random() - .5)), 
        this.sideAcum = 0, this.sideMaxAcum = 200, this.fireFreq = 25, this.fireAcum = 0, 
        this.fireSpeed = 6;
    },
    update: function() {}
}), ItemDefault = Class.extend({
    init: function(entity, player) {
        this.player = player, this.entity = entity, this.life = 8, this.entity.setVelocity(-2, 3 * (Math.random() - .5)), 
        this.sideAcum = 0, this.sideMaxAcum = 200, this.fireFreq = 25, this.fireAcum = 0, 
        this.fireSpeed = 6;
    },
    update: function() {}
}), FireModel = Class.extend({
    init: function() {
        this.fireSpeed = 10, this.fireStepLive = 40, this.firePower = 20;
    },
    update: function() {}
}), MonsterModel = Class.extend({
    init: function() {
        this.velocity = 4, this.fireFreq = 5, this.life = 20, this.level = 1, this.magicPower = 20, 
        this.spellPower = 2, this.battlePower = 2, this.defense = 20, this.critialChance = 0, 
        this.speedStatus = "normal", this.vigor = parseInt(7 * Math.random()) + 53, this.vigor2 = 2 * this.vigor, 
        this.xp = 100, this.vigor >= 128 && (this.vigor2 = 255), this.attack = this.battlePower + this.vigor2, 
        this.speed = 10;
    },
    getDemage: function(type) {
        var damageMultiplier = Math.random() < this.critialChance ? .5 : 2, demage = 0;
        return "physical" === type ? demage = this.battlePower + this.level * this.level * this.attack / 256 * 3 / 2 : "magical" === type && (demage = 4 * this.spellPower + this.level * (3 * this.magicPower / 2) * this.spellPower / 32), 
        demage += demage / 2 * damageMultiplier;
    },
    getHurt: function(demage, type) {
        return console.log("getHurt1", demage), "physical" === type ? demage = demage * (255 - this.defense) / 256 + 1 : "magical" === type && (demage = demage * (255 - this.magicDefense) / 256 + 1), 
        console.log("getHurt2", demage), demage;
    },
    getSpeed: function() {
        return "normal" === type ? currentSpeed = 96 * (this.speed + 20) / 16 : "haste" === type ? currentSpeed = 126 * (this.speed + 20) / 16 : "slow" === type && (currentSpeed = 48 * (this.speed + 20) / 16), 
        currentSpeed;
    }
}), PlayerModel = Class.extend({
    init: function(playerClass) {
        this.velocity = 4, this.fireFreq = 10, this.playerClass = playerClass ? playerClass : "warrior", 
        this.level = 1, "warrior" === this.playerClass ? (this.vigor = 40, this.speed = 28, 
        this.stamina = 33, this.magicPower = 25, this.battlePower = 25, this.defense = 48, 
        this.magicDefense = 20, this.baseHPModifier = 1.32, this.baseHP = this.level * (20 / this.baseHPModifier), 
        this.vigorModifier = .007, this.speedModifier = .004, this.staminaModifier = .007, 
        this.magicPowerModifier = .003, this.battlePowerModifier = .006, this.defenseModifier = .006, 
        this.magicDefenseModifier = .003) : "mage" === this.playerClass ? (this.vigor = 31, 
        this.speed = 33, this.stamina = 28, this.magicPower = 39, this.battlePower = 12, 
        this.defense = 42, this.magicDefense = 33, this.baseHPModifier = 1.32, this.baseHP = this.level * (20 / this.baseHPModifier), 
        this.vigorModifier = .005, this.speedModifier = .004, this.staminaModifier = .005, 
        this.magicPowerModifier = .007, this.battlePowerModifier = .003, this.defenseModifier = .005, 
        this.magicDefenseModifier = .007) : "thief" === this.playerClass && (this.vigor = 37, 
        this.speed = 40, this.stamina = 31, this.magicPower = 28, this.battlePower = 14, 
        this.defense = 46, this.magicDefense = 23, this.baseHPModifier = 1.32, this.baseHP = this.level * (20 / this.baseHPModifier), 
        this.vigorModifier = .004, this.speedModifier = .007, this.staminaModifier = .007, 
        this.magicPowerModifier = .004, this.battlePowerModifier = .006, this.defenseModifier = .004, 
        this.magicDefenseModifier = .004), this.spellPower = 20, this.life = this.baseHP * (this.stamina + 32) / 32, 
        this.critialChance = 0, this.speedStatus = "normal", this.vigor2 = 2 * this.vigor, 
        this.vigor >= 128 && (this.vigor2 = 255), this.attack = this.battlePower + this.vigor2, 
        this.xp = 0;
    },
    log: function() {
        console.log(), console.log("stats"), console.log("level", Math.floor(this.level)), 
        console.log("life", Math.floor(this.life)), console.log("vigor", Math.floor(this.vigor)), 
        console.log("speed", Math.floor(this.speed)), console.log("stamina", Math.floor(this.stamina)), 
        console.log("magicPower", Math.floor(this.magicPower)), console.log("battlePower", Math.floor(this.battlePower)), 
        console.log("defense", Math.floor(this.defense)), console.log("attack", Math.floor(this.attack)), 
        console.log("magicDefense", Math.floor(this.magicDefense));
    },
    levelUp: function() {
        this.level++, this.vigor += (this.vigor * this.vigor + this.vigor + 3) / 4 * this.vigorModifier, 
        this.speed += (this.speed * this.speed + this.speed + 3) / 4 * this.speedModifier, 
        this.stamina += (this.stamina * this.stamina + this.stamina + 3) / 4 * this.staminaModifier, 
        this.magicPower += (this.magicPower * this.magicPower + this.magicPower + 3) / 4 * this.magicPowerModifier, 
        this.battlePower += (this.battlePower * this.battlePower + this.battlePower + 3) / 4 * this.battlePowerModifier, 
        this.defense += (this.defense * this.defense + this.defense + 3) / 4 * this.defenseModifier, 
        this.magicDefense += (this.magicDefense * this.magicDefense + this.magicDefense + 3) / 4 * this.magicDefenseModifier, 
        this.vigor2 = 2 * this.vigor, this.vigor >= 128 && (this.vigor2 = 255), this.attack = this.battlePower + this.vigor2, 
        this.baseHPModifier -= .0085, this.baseHP = this.level * (20 / this.baseHPModifier), 
        this.life += this.baseHP * (this.stamina + 32) / 32;
    },
    updateLevel: function() {
        this.xp > (this.level * this.level + this.level + 3) / 4 * 100 && this.levelUp(), 
        console.log(this.level, "<- level, xp ->", this.xp);
    },
    updateXp: function(xp) {
        console.log("xp", xp), this.xp += xp, this.updateLevel();
    },
    getDemage: function(type) {
        var damageMultiplier = Math.random() < this.critialChance ? .5 : 2, demage = 0;
        return "physical" === type ? demage = this.battlePower + this.level * this.level * this.attack / 256 * 3 / 2 : "magical" === type && (demage = 4 * this.spellPower + this.level * this.magicPower * this.spellPower / 32), 
        demage += demage / 2 * damageMultiplier;
    },
    getHurt: function(demage, type) {
        return "physical" === type ? demage = demage * (255 - this.defense) / 256 + 1 : "magical" === type && (demage = demage * (255 - this.magicDefense) / 256 + 1), 
        demage;
    },
    getSpeed: function(type) {
        return "normal" === type ? currentSpeed = 96 * (this.speed + 20) / 16 : "haste" === type ? currentSpeed = 126 * (this.speed + 20) / 16 : "slow" === type && (currentSpeed = 48 * (this.speed + 20) / 16), 
        currentSpeed;
    }
}), SpellModel = Class.extend({
    init: function(level, name, mp, spellPower) {
        this.level = level, this.name = name, this.mp = mp, this.spellPower = spellPower;
    }
}), MobileApp = SmartObject.extend({
    init: function() {
        this._super();
    },
    show: function() {},
    hide: function() {},
    build: function() {},
    destroy: function() {}
}), AppModel = Class.extend({
    init: function() {
        this.isMobile = !1, this.action = "default", this.id = 0, this.position = 0, this.angle = 0, 
        this.side = 0;
    },
    build: function() {},
    destroy: function() {},
    serialize: function() {}
}), RainParticle = Class.extend({
    init: function(fallSpeed, windSpeed, hArea, vArea, dir) {
        this.fallSpeed = fallSpeed, this.windSpeed = windSpeed, this.dir = dir, this.hArea = hArea, 
        this.vArea = vArea, this.texture = new PIXI.Texture.fromImage("_dist/img/drop.png"), 
        this.content = new PIXI.Sprite(this.texture), this.content.position.x = Math.random() * hArea, 
        this.content.position.y = Math.random() * vArea, this.gambAccum = 0;
    },
    update: function() {
        var side = 1;
        switch (this.dir) {
          case "left":
            this.content.rotation = 15 / 180 * 3.14;
            break;

          case "right":
            side = -1, this.content.rotation = -15 / 180 * 3.14;
            break;

          default:
            console.log("There is some error dude...");
        }
        this.content.position.x -= this.windSpeed * side, this.content.position.y += Math.random() * this.fallSpeed, 
        this.content.position.y > this.vArea && (this.content.position.x = Math.random() * this.hArea, 
        this.content.position.y = -200);
    }
}), GameScreen = AbstractScreen.extend({
    init: function(label) {
        MicroEvent.mixin(this), this._super(label);
        var bg = new SimpleSprite("_dist/img/rascunho-mapa.jpg");
        this.addChild(bg), this.currentAppModel = new AppModel(), this.mainLayer = new Layer("main"), 
        this.entityLayer = new Layer("fire"), this.environmentLayer = new Layer("environment"), 
        this.layerManager = new LayerManager(), this.layerManager.addLayer(this.environmentLayer), 
        this.layerManager.addLayer(this.entityLayer), this.addChild(this.layerManager), 
        this.margin = {
            x: APP.tileSize.x / 2 * 3,
            y: 80
        }, this.mouseDown = !1, this.playerModel = new PlayerModel();
    },
    destroy: function() {
        this._super();
    },
    build: function() {
        this._super();
        var assetsToLoader = [ "_dist/img/spritesheet/dragon.json", "_dist/img/spritesheet/dragon.png", "_dist/img/dragao-perdido.png", "_dist/img/fireball.png", "_dist/img/spritesheet/chinesa.json", "_dist/img/spritesheet/finn.json", "_dist/img/spritesheet/finn.png", "_dist/img/spritesheet/chinesa.png" ];
        this.loader = new PIXI.AssetLoader(assetsToLoader), this.initLoad();
    },
    onAssetsLoaded: function() {
        this._super(), this.currentNode = APP.gen.firstNode, this.rainContainer = new PIXI.DisplayObjectContainer();
        this.vecPositions = [], this.keyboardInput = new KeyboardInput(this);
        var tempRain = null;
        this.vecRain = [];
        for (var j = 300; j >= 0; j--) tempRain = new RainParticle(50, 5, windowWidth + 200, windowHeight, "left"), 
        this.rainContainer.addChild(tempRain.content), this.vecRain.push(tempRain);
        this.mascara = new PIXI.Graphics(), this.mascara.beginFill(16776960), this.mascara.lineStyle(5, 16711680), 
        this.mascara.moveTo(-1920, -1280), this.mascara.lineTo(3840, -1280), this.mascara.lineTo(3840, 2560), 
        this.mascara.lineTo(-1920, 2560), this.mascara.lineTo(-1920, -1280), this.mascara.lineTo(854, 596), 
        this.mascara.lineTo(902, 542), this.mascara.lineTo(960, 528), this.mascara.lineTo(1034, 556), 
        this.mascara.lineTo(1064, 604), this.mascara.lineTo(1068, 670), this.mascara.lineTo(1032, 724), 
        this.mascara.lineTo(966, 750), this.mascara.lineTo(902, 734), this.mascara.lineTo(854, 676), 
        this.mascara.lineTo(854, 594), this.mascara.endFill(), this.mascara.position.x = 500, 
        this.graphDebug = new PIXI.Graphics(), this.addChild(this.graphDebug), this.blackShape = new PIXI.Graphics(), 
        this.blackShape.beginFill(0), this.blackShape.drawRect(0, 0, windowWidth, windowHeight), 
        this.addChild(this.blackShape), TweenLite.to(this.blackShape, 1, {
            alpha: 0
        }), this.levelLabel = new PIXI.Text("", {
            fill: "white",
            align: "center",
            font: "bold 20px Arial"
        }), this.addChild(this.levelLabel), this.resetLevel(), this.minimap = new Minimap(), 
        this.addChild(this.minimap), this.minimap.build(), this.minimap.setPosition(windowWidth - 100, 5), 
        this.minimap.getContent().scale.x = .3, this.minimap.getContent().scale.y = .3, 
        this.collisionSystem = new BoundCollisionSystem(this, !0);
    },
    removePosition: function(position) {
        for (var i = this.vecPositions.length - 1; i >= 0; i--) this.vecPositions[i] === position && this.vecPositions.splice(i, 1);
    },
    addPosition: function(position) {
        for (var exists = !1, i = this.vecPositions.length - 1; i >= 0; i--) this.vecPositions[i] === position && (exists = !0);
        exists || this.vecPositions.push(position);
    },
    updatePlayerVel: function() {
        if (this.player && this.vecPositions) {
            var hasAxysY = !1, hasAxysX = !1;
            0 === this.vecPositions.length && (this.player.virtualVelocity.x = 0, this.player.virtualVelocity.y = 0);
            for (var i = this.vecPositions.length - 1; i >= 0; i--) "up" === this.vecPositions[i] ? (this.player.virtualVelocity.y = -this.player.defaultVelocity, 
            hasAxysY = !0) : "down" === this.vecPositions[i] && (this.player.virtualVelocity.y = this.player.defaultVelocity, 
            hasAxysY = !0), "left" === this.vecPositions[i] ? (this.player.virtualVelocity.x = -this.player.defaultVelocity, 
            hasAxysX = !0) : "right" === this.vecPositions[i] && (this.player.virtualVelocity.x = this.player.defaultVelocity, 
            hasAxysX = !0);
            hasAxysY || (this.player.virtualVelocity.y = 0), hasAxysX || (this.player.virtualVelocity.x = 0);
        }
    },
    shoot: function() {
        this.player.shoot(APP.stage.getMousePosition());
    },
    update: function() {
        if (this.player) {
            this.mouseDown && (this.player.fireFreqAcum--, this.player.fireFreqAcum <= 0 && this.shoot()), 
            this.entityLayer.collideChilds(this.player), this.environmentLayer.collideChilds(this.player), 
            (this.player.getPosition().x + this.player.virtualVelocity.x < this.margin.x && this.player.virtualVelocity.x < 0 || this.player.getPosition().x + this.player.width + this.player.virtualVelocity.x > windowWidth - this.margin.x && this.player.virtualVelocity.x > 0) && (this.player.virtualVelocity.x = 0), 
            (this.player.getPosition().y + this.player.virtualVelocity.y < this.margin.y && this.player.virtualVelocity.y < 0 || this.player.getPosition().y + this.player.height + this.player.virtualVelocity.y > windowHeight - this.margin.y && this.player.virtualVelocity.y > 0) && (this.player.virtualVelocity.y = 0);
            for (var i = 0; i < this.entityLayer.childs.length; i++) "fire" === this.entityLayer.childs[i].type && this.entityLayer.collideChilds(this.entityLayer.childs[i]);
            this.collisionSystem.applyCollision(this.entityLayer.childs, this.entityLayer.childs);
        }
        this._super(), this.entityLayer.getContent().children.sort(this.depthCompare), this.player && this.player.endLevel && (this.player.endLevel = !1, 
        this.currentNode = this.player.nextNode, this.currentPlayerSide = this.player.nextDoorSide, 
        this.killLevel(this.resetLevel), this.player = null);
    },
    killLevel: function() {
        for (var self = this, k = this.entityLayer.childs.length - 1; k >= 0; k--) this.entityLayer.childs[k].preKill();
        for (var t = this.environmentLayer.childs.length - 1; t >= 0; t--) this.environmentLayer.childs[t].preKill();
        TweenLite.to(this.blackShape, .5, {
            alpha: 1
        }), setTimeout(function() {
            self.resetLevel();
        }, 700);
    },
    resetLevel: function() {
        this.vecPositions = [], TweenLite.to(this.blackShape, 1, {
            alpha: 0
        });
        var roomState = "first room";
        switch (this.currentNode.mode) {
          case 2:
            roomState = "standard";
            break;

          case 3:
            roomState = "item";
            break;

          case 4:
            roomState = "boss";
            break;

          case 5:
            roomState = "lock";
            break;

          case 6:
            roomState = "key";
        }
        this.levelLabel.setText("room id:" + this.currentNode.id + "   -    state:" + roomState), 
        this.level = getRandomLevel(), this.player = new Player(this.playerModel), this.player.build(), 
        "up" === this.currentPlayerSide ? this.player.setPosition(windowWidth / 2, windowHeight - this.margin.y - this.player.height) : "down" === this.currentPlayerSide ? this.player.setPosition(windowWidth / 2, this.margin.y) : "left" === this.currentPlayerSide ? this.player.setPosition(windowWidth - this.margin.x - this.player.width, windowHeight / 2 - this.player.height / 2) : "right" === this.currentPlayerSide && this.player.setPosition(this.margin.x, windowHeight / 2 - this.player.height / 2), 
        this.heart = new Enemy(this.player), this.heart.build(), this.fly = new FlightEnemy(500, 500), 
        this.fly.build(), this.heart.setPosition(700, 200), this.fly.setPosition(100, 200), 
        this.entityLayer.addChild(this.player), this.entityLayer.addChild(this.heart), this.entityLayer.addChild(this.fly);
        for (var i = this.level.length - 1; i >= 0; i--) for (var j = this.level[i].length - 1; j >= 0; j--) if (this.level[i][j] > 0) {
            var obs = new Obstacle(this.level[i][j] - 1);
            obs.build(), obs.setPosition(j * APP.tileSize.x + this.margin.x, (i + 1) * APP.tileSize.y + this.margin.y), 
            this.entityLayer.addChild(obs);
        }
        this.createDoors();
    },
    createDoors: function() {
        this.currentNode.childrenSides[0] && (this.doorLeft = new Door("left"), this.doorLeft.build(), 
        this.doorLeft.setPosition(this.margin.x - APP.tileSize.x / 2, windowHeight / 2), 
        this.doorLeft.node = this.currentNode.childrenSides[0], this.environmentLayer.addChild(this.doorLeft)), 
        this.currentNode.childrenSides[1] && (this.doorRight = new Door("right"), this.doorRight.build(), 
        this.doorRight.setPosition(windowWidth - this.margin.x + APP.tileSize.x / 2, windowHeight / 2), 
        this.doorRight.node = this.currentNode.childrenSides[1], this.environmentLayer.addChild(this.doorRight)), 
        this.currentNode.childrenSides[2] && (this.doorUp = new Door("up"), this.doorUp.build(), 
        this.doorUp.setPosition(windowWidth / 2, this.margin.y - APP.tileSize.y / 2), this.doorUp.node = this.currentNode.childrenSides[2], 
        this.environmentLayer.addChild(this.doorUp)), this.currentNode.childrenSides[3] && (this.doorDown = new Door("down"), 
        this.doorDown.build(), this.doorDown.setPosition(windowWidth / 2, windowHeight - this.margin.y + APP.tileSize.y / 2), 
        this.doorDown.node = this.currentNode.childrenSides[3], this.environmentLayer.addChild(this.doorDown));
    },
    depthCompare: function(a, b) {
        var yA = a.position.y, yB = b.position.y;
        return a.children.length > 0 && (yA = a.children[0].position.y + a.children[0].height), 
        b.children.length > 0 && (yB = b.children[0].position.y + b.children[0].height), 
        yB > yA ? -1 : yA > yB ? 1 : 0;
    }
}), WaitScreen = AbstractScreen.extend({
    init: function(label) {
        this._super(label);
    },
    destroy: function() {
        this._super();
    },
    build: function() {
        this._super();
        var bg = new SimpleSprite("_dist/img/bg.png");
        this.addChild(bg), this.name = new PIXI.Text("Aguardando mobile entrar", {
            fill: "black",
            align: "center"
        });
        var assetsToLoader = [ "_dist/img/qrcode.png" ];
        this.loader = new PIXI.AssetLoader(assetsToLoader), this.initLoad();
    },
    onAssetsLoaded: function() {
        this._super();
        var qrcode = new SimpleSprite($("qrcode").context.images[0].src);
        this.addChild(qrcode), qrcode.getContent().position.x = windowWidth / 2 - qrcode.getContent().width / 2, 
        qrcode.getContent().position.y = windowHeight / 2 - qrcode.getContent().height / 2;
    }
}), FirebaseSocket = SmartSocket.extend({
    init: function(url) {
        this._super(), this.dataRef = new Firebase(url), this.dataRef.limit(1);
    },
    build: function() {
        var self = this;
        this.lastMessagesQuery = this.dataRef.endAt().limit(2), this.lastMessagesQuery.on("child_added", function(snapshot) {
            self.readLast(snapshot.val());
        }, function(errorObject) {
            self.socketError(errorObject);
        }), this.dataRef.on("child_added", function(snapshot) {
            self.readSocketList(snapshot.val());
        }, function(errorObject) {
            self.socketError(errorObject);
        }), this.dataRef.on("value", function(data) {
            self.readObj(data.val());
        }, function(errorObject) {
            self.socketError(errorObject);
        });
    },
    writeObj: function(obj) {
        this._super(obj), this.dataRef.push(obj);
    },
    setObj: function(obj) {
        this._super(obj), this.dataRef.set(obj);
    },
    updateObj: function(obj) {
        this._super(obj), this.dataRef.update(obj);
    },
    destroy: function() {}
}), KeyboardInput = Class.extend({
    init: function(parent) {
        var self = parent;
        document.body.addEventListener("mouseup", function() {
            self.mouseDown = !1;
        }), document.body.addEventListener("mousedown", function() {
            self.mouseDown = !0, self.player.fireFreqAcum = 0;
        }), document.body.addEventListener("keyup", function(e) {
            self.player && (87 === e.keyCode || 38 === e.keyCode && self.player.velocity.y < 0 ? self.removePosition("up") : 83 === e.keyCode || 40 === e.keyCode && self.player.velocity.y > 0 ? self.removePosition("down") : 65 === e.keyCode || 37 === e.keyCode && self.player.velocity.x < 0 ? self.removePosition("left") : (68 === e.keyCode || 39 === e.keyCode && self.player.velocity.x > 0) && self.removePosition("right"), 
            self.updatePlayerVel());
        }), document.body.addEventListener("keydown", function(e) {
            87 === e.keyCode || 38 === e.keyCode ? (self.removePosition("down"), self.addPosition("up")) : 83 === e.keyCode || 40 === e.keyCode ? (self.removePosition("up"), 
            self.addPosition("down")) : 65 === e.keyCode || 37 === e.keyCode ? (self.removePosition("right"), 
            self.addPosition("left")) : (68 === e.keyCode || 39 === e.keyCode) && (self.removePosition("left"), 
            self.addPosition("right")), self.updatePlayerVel();
        });
    }
}), SOCKET = null, windowWidth = 1280, windowHeight = 720;

testMobile() && (windowWidth = 640, windowHeight = 960);

var renderer, windowWidthVar = window.innerWidth, windowHeightVar = window.innerHeight, renderer = PIXI.autoDetectRenderer(windowWidth, windowHeight);

document.getElementById("rogueCanvasWrap").appendChild(renderer.view);

var APP;

APP = new Application(), APP.build(), APP.show();

var initialize = function() {
    PIXI.BaseTexture.SCALE_MODE = 2, requestAnimFrame(update);
};

!function() {
    var App = {
        init: function() {
            initialize();
        }
    };
    $(App.init);
}();
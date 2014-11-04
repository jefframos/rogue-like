/*! jefframos 04-11-2014 */
function getRandomLevel() {
    var id = 4;
    return ALL_LEVELS[id];
}

function testMobile() {
    return !1;
}

function update() {
    requestAnimFrame(update), meter.tickStart();
    var tempRation = window.innerHeight / windowHeight, ratio = tempRation < window.innerWidth / windowWidth ? tempRation : window.innerWidth / windowWidth;
    windowWidthVar = windowWidth * ratio, windowHeightVar = windowHeight * ratio, renderer.view.style.width = windowWidth / 1.5 + "px", 
    renderer.view.style.height = windowHeight / 1.5 + "px", APP.update(), renderer.render(APP.stage), 
    meter.tick();
}

function pointDistance(x, y, x0, y0) {
    return Math.sqrt((x -= x0) * x + (y -= y0) * y);
}

var ALL_LEVELS = [ [ [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0 ], [ 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0 ], [ 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0 ], [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ] ], [ [ 2, 0, 0, 0, 3, 0, 0, 3, 0, 0, 0, 2 ], [ 0, 2, 2, 0, 0, 0, 0, 0, 0, 2, 2, 0 ], [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 2, 2, 0, 0, 0, 0, 0, 0, 2, 2, 0 ], [ 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2 ] ], [ [ 0, 0, 0, 0, 2, 0, 0, 2, 0, 0, 0, 0 ], [ 0, 3, 0, 0, 2, 0, 0, 2, 0, 0, 3, 0 ], [ 0, 0, 0, 0, 2, 0, 0, 2, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 2, 0, 0, 2, 0, 0, 0, 0 ], [ 0, 3, 0, 0, 2, 0, 0, 2, 0, 0, 3, 0 ], [ 0, 0, 0, 0, 2, 0, 0, 2, 0, 0, 0, 0 ] ], [ [ 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3 ], [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ], [ 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2 ], [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ], [ 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2 ], [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ], [ 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3 ] ], [ [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ] ] ], DungeonGenerator = Class.extend({
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
                if (this.minNodes--, node.mode = 2, this.numActivesNodes++, node.active = !0, node.id < 0 && (node.id = this.numActivesNodes, 
                node.seed = this.getNextFloat(), node.applySeed()), parent && 1 !== node.id) {
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
        this.parentId = -1, this.parent = null, this.active = !1, this.mode = 0, this.id = -1, 
        this.seed = -1, this.tempAccSeed = this.seed, this.bg = null;
    },
    applySeed: function() {
        this.tempAccSeed = this.seed;
    },
    getNextFloat: function() {
        var x = 1e4 * Math.sin(this.tempAccSeed++);
        return x - Math.floor(x);
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
        this._super(windowWidth, windowHeight), this.stage.setBackgroundColor(0), this.stage.removeChild(this.loadText), 
        this.isMobile = testMobile(), this.appContainer = document.getElementById("rect"), 
        this.id = parseInt(1e11 * Math.random()), this.gen = new DungeonGenerator(), this.gen.generate(16777215 * Math.random(), 1, [ 10, 15 ], [ 12, 12 ], 5), 
        this.tileSize = {
            x: 80,
            y: 80
        };
    },
    getEffectsContainer: function() {
        return this.mainApp.effectsContainer;
    },
    getGame: function() {
        return this.mainApp;
    },
    getGameContent: function() {
        return this.mainApp.getContent();
    },
    getHUD: function() {
        return this.HUD;
    },
    build: function() {
        this.monsterList = [], this.monsterList.push(new MonsterModel(1, 80, 50, 55, 13, 13, 70, 70, 10)), 
        this.spellList = [], this.spellList.push(new SpellModel(1, "bolt1", 6, 20, "_dist/img/spells/icos/bolt1.png", "_dist/img/spells/bolt1.png")), 
        this.spellList.push(new SpellModel(1, "fire1", 4, 21, "_dist/img/spells/icos/fire1.png", "_dist/img/spells/fire1.png")), 
        this.spellList.push(new SpellModel(1, "ice1", 5, 22, "_dist/img/spells/icos/ice1.png", "_dist/img/spells/ice1.png")), 
        this.spellList.push(new SpellModel(1, "poison", 3, 25, "_dist/img/spells/icos/poison.png", "_dist/img/spells/poison.png")), 
        this.spellList.push(new SpellModel(1, "wind", 75, 25, "_dist/img/spells/icos/wind.png", "_dist/img/spells/wind.png", !0)), 
        this.spellList.push(new SpellModel(2, "bolt2", 22, 26, "_dist/img/spells/icos/bolt2.png", "_dist/img/spells/bolt2.png")), 
        this.spellList.push(new SpellModel(2, "fire2", 20, 60, "_dist/img/spells/icos/fire2.png", "_dist/img/spells/fire2.png")), 
        this.spellList.push(new SpellModel(2, "ice2", 21, 62, "_dist/img/spells/icos/ice2.png", "_dist/img/spells/ice2.png")), 
        this.spellList.push(new SpellModel(2, "drain", 15, 38, "_dist/img/spells/icos/drain.png", "_dist/img/spells/drain.png")), 
        this.spellList.push(new SpellModel(3, "meteor", 62, 36, "_dist/img/spells/icos/meteor.png", "_dist/img/spells/meteor.png", !0)), 
        this.spellList.push(new SpellModel(3, "bio", 26, 53, "_dist/img/spells/icos/bio.png", "_dist/img/spells/bio.png")), 
        this.spellList.push(new SpellModel(3, "flare", 45, 60, "_dist/img/spells/icos/flare.png", "_dist/img/spells/flare.png")), 
        this.spellList.push(new SpellModel(4, "quake", 50, 111, "_dist/img/spells/icos/quake.png", "_dist/img/spells/quake.png", !0)), 
        this.spellList.push(new SpellModel(5, "bolt3", 53, 120, "_dist/img/spells/icos/bolt3.png", "_dist/img/spells/bolt3.png")), 
        this.spellList.push(new SpellModel(5, "fire3", 51, 121, "_dist/img/spells/icos/fire3.png", "_dist/img/spells/fire3.png")), 
        this.spellList.push(new SpellModel(5, "ice3", 52, 122, "_dist/img/spells/icos/ice3.png", "_dist/img/spells/ice3.png")), 
        this.spellList.push(new SpellModel(6, "merton", 85, 138, "_dist/img/spells/icos/merton.png", "_dist/img/spells/merton.png")), 
        this.spellList.push(new SpellModel(7, "ultima", 80, 150, "_dist/img/spells/icos/ultima.png", "_dist/img/spells/ultima.png", !0)), 
        this.weaponList = [], this.weaponList.push(new WeaponModel("MithrilKnife", 30, 180, 300, "_dist/img/weapons/dagger.png", "_dist/img/weapons/dagger.png")), 
        this.weaponList.push(new WeaponModel("AirLancet", 76, 180, 950, "_dist/img/weapons/dagger.png", "_dist/img/weapons/dagger.png")), 
        this.weaponList.push(new WeaponModel("Assassin", 106, 180, 2, "_dist/img/weapons/dagger.png", "_dist/img/weapons/dagger.png")), 
        this.weaponList.push(new WeaponModel("Dirk", 26, 180, 150, "_dist/img/weapons/dagger.png", "_dist/img/weapons/dagger.png")), 
        this.weaponList.push(new WeaponModel("Graedus", 204, 180, 2, "_dist/img/weapons/dagger.png", "_dist/img/weapons/dagger.png")), 
        this.weaponList.push(new WeaponModel("Guardian", 59, 180, 2, "_dist/img/weapons/dagger.png", "_dist/img/weapons/dagger.png")), 
        this.weaponList.push(new WeaponModel("ManEater", 146, 180, 11e3, "_dist/img/weapons/dagger.png", "_dist/img/weapons/dagger.png")), 
        this.weaponList.push(new WeaponModel("SwordBreaker", 164, 180, 16e3, "_dist/img/weapons/dagger.png", "_dist/img/weapons/dagger.png")), 
        this.weaponList.push(new WeaponModel("ThiefKnife", 88, 180, 2, "_dist/img/weapons/dagger.png", "_dist/img/weapons/dagger.png")), 
        this.weaponList.push(new WeaponModel("ValiantKnife", 145, 180, 2, "_dist/img/weapons/dagger.png", "_dist/img/weapons/dagger.png")), 
        this.weaponList.push(new WeaponModel("Atma,WeaponBat", 255, 150, 2, "_dist/img/weapons/dagger.png", "_dist/img/weapons/dagger.png")), 
        this.weaponList.push(new WeaponModel("Blizzard", 108, 150, 7e3, "_dist/img/weapons/dagger.png", "_dist/img/weapons/dagger.png")), 
        this.weaponList.push(new WeaponModel("Break Blade", 117, 150, 12e3, "_dist/img/weapons/dagger.png", "_dist/img/weapons/dagger.png")), 
        this.weaponList.push(new WeaponModel("Crystal", 167, 150, 15e3, "_dist/img/weapons/dagger.png", "_dist/img/weapons/dagger.png")), 
        this.weaponList.push(new WeaponModel("Drainer", 121, 150, 2, "_dist/img/weapons/dagger.png", "_dist/img/weapons/dagger.png")), 
        this.weaponList.push(new WeaponModel("Enhancer", 135, 150, 1e4, "_dist/img/weapons/dagger.png", "_dist/img/weapons/dagger.png")), 
        this.weaponList.push(new WeaponModel("Epee", 98, 150, 3e3, "_dist/img/weapons/dagger.png", "_dist/img/weapons/dagger.png")), 
        this.weaponList.push(new WeaponModel("Excalibur", 217, 150, 2, "_dist/img/weapons/dagger.png", "_dist/img/weapons/dagger.png")), 
        this.weaponList.push(new WeaponModel("Falchion", 176, 150, 17e3, "_dist/img/weapons/dagger.png", "_dist/img/weapons/dagger.png")), 
        this.weaponList.push(new WeaponModel("Flame,Sabre", 108, 150, 7e3, "_dist/img/weapons/dagger.png", "_dist/img/weapons/dagger.png")), 
        this.weaponList.push(new WeaponModel("Illumina", 255, 255, 2, "_dist/img/weapons/dagger.png", "_dist/img/weapons/dagger.png")), 
        this.weaponList.push(new WeaponModel("MithrilBlade", 38, 150, 450, "_dist/img/weapons/dagger.png", "_dist/img/weapons/dagger.png")), 
        this.weaponList.push(new WeaponModel("Ogre Nix", 182, 150, 2, "_dist/img/weapons/dagger.png", "_dist/img/weapons/dagger.png")), 
        this.weaponList.push(new WeaponModel("Ragnarok", 255, 150, 2, "_dist/img/weapons/dagger.png", "_dist/img/weapons/dagger.png")), 
        this.weaponList.push(new WeaponModel("RegalCutlass", 54, 150, 800, "_dist/img/weapons/dagger.png", "_dist/img/weapons/dagger.png")), 
        this.weaponList.push(new WeaponModel("Rune,Edge", 55, 150, 7500, "_dist/img/weapons/dagger.png", "_dist/img/weapons/dagger.png")), 
        this.weaponList.push(new WeaponModel("Scimitar", 208, 150, 2, "_dist/img/weapons/dagger.png", "_dist/img/weapons/dagger.png")), 
        this.weaponList.push(new WeaponModel("Soul,Sabre", 125, 150, 2, "_dist/img/weapons/dagger.png", "_dist/img/weapons/dagger.png")), 
        this.weaponList.push(new WeaponModel("ThunderBlade", 108, 150, 7e3, "_dist/img/weapons/dagger.png", "_dist/img/weapons/dagger.png")), 
        this.weaponList.push(new WeaponModel("Aura,Lance", 227, 180, 2, "_dist/img/weapons/dagger.png", "_dist/img/weapons/dagger.png")), 
        this.weaponList.push(new WeaponModel("Gold,Lance", 139, 150, 12e3, "_dist/img/weapons/dagger.png", "_dist/img/weapons/dagger.png")), 
        this.weaponList.push(new WeaponModel("Imp,Halberd", 253, 150, 2, "_dist/img/weapons/dagger.png", "_dist/img/weapons/dagger.png")), 
        this.weaponList.push(new WeaponModel("Mithril,Pike", 70, 150, 800, "_dist/img/weapons/dagger.png", "_dist/img/weapons/dagger.png")), 
        this.weaponList.push(new WeaponModel("Partisan", 150, 150, 13e3, "_dist/img/weapons/dagger.png", "_dist/img/weapons/dagger.png")), 
        this.weaponList.push(new WeaponModel("Pearl,Lance", 194, 150, 2, "_dist/img/weapons/dagger.png", "_dist/img/weapons/dagger.png")), 
        this.weaponList.push(new WeaponModel("Stout,Spear", 112, 150, 1e4, "_dist/img/weapons/dagger.png", "_dist/img/weapons/dagger.png")), 
        this.weaponList.push(new WeaponModel("Trident", 93, 150, 1700, "_dist/img/weapons/dagger.png", "_dist/img/weapons/dagger.png")), 
        this.weaponList.push(new WeaponModel("Blossom", 112, 180, 3200, "_dist/img/weapons/dagger.png", "_dist/img/weapons/dagger.png")), 
        this.weaponList.push(new WeaponModel("Hardened", 121, 180, 2, "_dist/img/weapons/dagger.png", "_dist/img/weapons/dagger.png")), 
        this.weaponList.push(new WeaponModel("Imperial", 82, 180, 600, "_dist/img/weapons/dagger.png", "_dist/img/weapons/dagger.png")), 
        this.weaponList.push(new WeaponModel("Kodachi", 93, 180, 1200, "_dist/img/weapons/dagger.png", "_dist/img/weapons/dagger.png")), 
        this.weaponList.push(new WeaponModel("Striker", 190, 180, 2, "_dist/img/weapons/dagger.png", "_dist/img/weapons/dagger.png")), 
        this.weaponList.push(new WeaponModel("Stunner", 220, 180, 2, "_dist/img/weapons/dagger.png", "_dist/img/weapons/dagger.png")), 
        this.weaponList.push(new WeaponModel("Ashura", 57, 150, 500, "_dist/img/weapons/dagger.png", "_dist/img/weapons/dagger.png")), 
        this.weaponList.push(new WeaponModel("Aura", 162, 150, 2, "_dist/img/weapons/dagger.png", "_dist/img/weapons/dagger.png")), 
        this.weaponList.push(new WeaponModel("Forged", 81, 150, 1200, "_dist/img/weapons/dagger.png", "_dist/img/weapons/dagger.png")), 
        this.weaponList.push(new WeaponModel("Kotetsu", 66, 150, 800, "_dist/img/weapons/dagger.png", "_dist/img/weapons/dagger.png")), 
        this.weaponList.push(new WeaponModel("Murasame", 110, 150, 9e3, "_dist/img/weapons/dagger.png", "_dist/img/weapons/dagger.png")), 
        this.weaponList.push(new WeaponModel("Sky,Render", 215, 150, 2, "_dist/img/weapons/dagger.png", "_dist/img/weapons/dagger.png")), 
        this.weaponList.push(new WeaponModel("Strato", 199, 150, 2, "_dist/img/weapons/dagger.png", "_dist/img/weapons/dagger.png")), 
        this.weaponList.push(new WeaponModel("Tempest", 101, 150, 8e3, "_dist/img/weapons/dagger.png", "_dist/img/weapons/dagger.png")), 
        this.weaponList.push(new WeaponModel("Fire,Rod", 79, 135, 3e3, "_dist/img/weapons/dagger.png", "_dist/img/weapons/dagger.png")), 
        this.weaponList.push(new WeaponModel("Gravity,Rod", 120, 135, 13e3, "_dist/img/weapons/dagger.png", "_dist/img/weapons/dagger.png")), 
        this.weaponList.push(new WeaponModel("Heal,Rod", 200, 255, 2, "_dist/img/weapons/dagger.png", "_dist/img/weapons/dagger.png")), 
        this.weaponList.push(new WeaponModel("Ice,Rod", 79, 135, 3e3, "_dist/img/weapons/dagger.png", "_dist/img/weapons/dagger.png")), 
        this.weaponList.push(new WeaponModel("Magus,Rod", 168, 135, 2, "_dist/img/weapons/dagger.png", "_dist/img/weapons/dagger.png")), 
        this.weaponList.push(new WeaponModel("Mithril,Rod", 60, 135, 500, "_dist/img/weapons/dagger.png", "_dist/img/weapons/dagger.png")), 
        this.weaponList.push(new WeaponModel("Pearl,Rod", 124, 135, 12e3, "_dist/img/weapons/dagger.png", "_dist/img/weapons/dagger.png")), 
        this.weaponList.push(new WeaponModel("Poison,Rod", 86, 135, 1500, "_dist/img/weapons/dagger.png", "_dist/img/weapons/dagger.png")), 
        this.weaponList.push(new WeaponModel("Punisher", 111, 150, 2, "_dist/img/weapons/dagger.png", "_dist/img/weapons/dagger.png")), 
        this.weaponList.push(new WeaponModel("Thunder,Rod", 79, 135, 3e3, "_dist/img/weapons/dagger.png", "_dist/img/weapons/dagger.png")), 
        this.weaponList.push(new WeaponModel("Chocobo,Brsh", 60, 135, 600, "_dist/img/weapons/dagger.png", "_dist/img/weapons/dagger.png")), 
        this.weaponList.push(new WeaponModel("DaVinci,Brsh", 100, 135, 7e3, "_dist/img/weapons/dagger.png", "_dist/img/weapons/dagger.png")), 
        this.weaponList.push(new WeaponModel("Magical,Brsh", 130, 135, 1e4, "_dist/img/weapons/dagger.png", "_dist/img/weapons/dagger.png")), 
        this.weaponList.push(new WeaponModel("Rainbow,Brsh", 146, 135, 2, "_dist/img/weapons/dagger.png", "_dist/img/weapons/dagger.png")), 
        this.weaponList.push(new WeaponModel("Ninja,Star", 132, 230, 500, "_dist/img/weapons/dagger.png", "_dist/img/weapons/dagger.png")), 
        this.weaponList.push(new WeaponModel("Shuriken", 86, 230, 30, "_dist/img/weapons/dagger.png", "_dist/img/weapons/dagger.png")), 
        this.weaponList.push(new WeaponModel("Tack,Star", 190, 230, 2, "_dist/img/weapons/dagger.png", "_dist/img/weapons/dagger.png")), 
        this.weaponList.push(new WeaponModel("Bone,Club", 151, 150, 2e4, "_dist/img/weapons/dagger.png", "_dist/img/weapons/dagger.png")), 
        this.weaponList.push(new WeaponModel("Boomerang", 102, 230, 4500, "_dist/img/weapons/dagger.png", "_dist/img/weapons/dagger.png")), 
        this.weaponList.push(new WeaponModel("Flail", 86, 150, 2e3, "_dist/img/weapons/dagger.png", "_dist/img/weapons/dagger.png")), 
        this.weaponList.push(new WeaponModel("Full,Moon", 95, 230, 2500, "_dist/img/weapons/dagger.png", "_dist/img/weapons/dagger.png")), 
        this.weaponList.push(new WeaponModel("Hawk,Eye", 111, 180, 6e3, "_dist/img/weapons/dagger.png", "_dist/img/weapons/dagger.png")), 
        this.weaponList.push(new WeaponModel("Morning,Star", 109, 150, 5e3, "_dist/img/weapons/dagger.png", "_dist/img/weapons/dagger.png")), 
        this.weaponList.push(new WeaponModel("Rising,Sun", 98, 230, 2, "_dist/img/weapons/dagger.png", "_dist/img/weapons/dagger.png")), 
        this.weaponList.push(new WeaponModel("Cards", 104, 230, 1e3, "_dist/img/weapons/dagger.png", "_dist/img/weapons/dagger.png")), 
        this.weaponList.push(new WeaponModel("Darts", 115, 230, 1e4, "_dist/img/weapons/dagger.png", "_dist/img/weapons/dagger.png")), 
        this.weaponList.push(new WeaponModel("Doom,Darts", 187, 230, 2, "_dist/img/weapons/dagger.png", "_dist/img/weapons/dagger.png")), 
        this.weaponList.push(new WeaponModel("Trump", 133, 230, 13e3, "_dist/img/weapons/dagger.png", "_dist/img/weapons/dagger.png")), 
        this.weaponList.push(new WeaponModel("ClawDragon,Claw", 188, 200, 2, "_dist/img/weapons/dagger.png", "_dist/img/weapons/dagger.png")), 
        this.weaponList.push(new WeaponModel("ClawFire,Knuckle", 122, 200, 1e4, "_dist/img/weapons/dagger.png", "_dist/img/weapons/dagger.png")), 
        this.weaponList.push(new WeaponModel("ClawKaiser", 83, 200, 1e3, "_dist/img/weapons/dagger.png", "_dist/img/weapons/dagger.png")), 
        this.weaponList.push(new WeaponModel("ClawMetalKnuckle", 55, 200, 500, "_dist/img/weapons/dagger.png", "_dist/img/weapons/dagger.png")), 
        this.weaponList.push(new WeaponModel("ClawMithril,Claw", 65, 200, 800, "_dist/img/weapons/dagger.png", "_dist/img/weapons/dagger.png")), 
        this.weaponList.push(new WeaponModel("ClawPoison,Claw", 95, 200, 2500, "_dist/img/weapons/dagger.png", "_dist/img/weapons/dagger.png")), 
        this.weaponList.push(new WeaponModel("ClawTiger,Fangs", 215, 200, 2, "_dist/img/weapons/dagger.png", "_dist/img/weapons/dagger.png")), 
        this.armorList = [], this.armorList.push(new ArmorModel("Aegis Shld", 46, 52, 2, "_dist/img/armor/armor1.png")), 
        this.armorList.push(new ArmorModel("Buckler", 16, 10, 200, "_dist/img/armor/armor1.png")), 
        this.armorList.push(new ArmorModel("Crystal Shld", 50, 34, 7e3, "_dist/img/armor/armor1.png")), 
        this.armorList.push(new ArmorModel("Diamond Shld", 40, 27, 3500, "_dist/img/armor/armor1.png")), 
        this.armorList.push(new ArmorModel("Flame Shld", 41, 28, 2, "_dist/img/armor/armor1.png")), 
        this.armorList.push(new ArmorModel("Force Shld", 0, 70, 2, "_dist/img/armor/armor1.png")), 
        this.armorList.push(new ArmorModel("Genji Shld", 54, 50, 2, "_dist/img/armor/armor1.png")), 
        this.armorList.push(new ArmorModel("Gold Shld", 34, 23, 2500, "_dist/img/armor/armor1.png")), 
        this.armorList.push(new ArmorModel("Heavy Shld", 22, 14, 400, "_dist/img/armor/armor1.png")), 
        this.armorList.push(new ArmorModel("Ice Shld", 42, 28, 2, "_dist/img/armor/armor1.png")), 
        this.armorList.push(new ArmorModel("Mithril Shld", 27, 18, 1200, "_dist/img/armor/armor1.png")), 
        this.armorList.push(new ArmorModel("Paladin Shld", 59, 59, 2, "_dist/img/armor/armor1.png")), 
        this.armorList.push(new ArmorModel("Thunder Shld", 43, 28, 2, "_dist/img/armor/armor1.png")), 
        this.armorList.push(new ArmorModel("TortoiseShld", 66, 66, 2, "_dist/img/armor/armor1.png")), 
        this.armorList.push(new ArmorModel("Bandana", 16, 10, 800, "_dist/img/armor/armor1.png")), 
        this.armorList.push(new ArmorModel("Bards Hat", 19, 21, 3e3, "_dist/img/armor/armor1.png")), 
        this.armorList.push(new ArmorModel("Beret", 21, 21, 3500, "_dist/img/armor/armor1.png")), 
        this.armorList.push(new ArmorModel("Cat Hood", 33, 33, 2, "_dist/img/armor/armor1.png")), 
        this.armorList.push(new ArmorModel("Circlet", 25, 19, 7e3, "_dist/img/armor/armor1.png")), 
        this.armorList.push(new ArmorModel("Coronet", 23, 23, 2, "_dist/img/armor/armor1.png")), 
        this.armorList.push(new ArmorModel("Crystal Helm", 29, 19, 1e4, "_dist/img/armor/armor1.png")), 
        this.armorList.push(new ArmorModel("Dark Hood", 26, 17, 7500, "_dist/img/armor/armor1.png")), 
        this.armorList.push(new ArmorModel("Diamond Helm", 27, 18, 8e3, "_dist/img/armor/armor1.png")), 
        this.armorList.push(new ArmorModel("Genji Helmet", 36, 38, 2, "_dist/img/armor/armor1.png")), 
        this.armorList.push(new ArmorModel("Gold Helmet", 22, 15, 4e3, "_dist/img/armor/armor1.png")), 
        this.armorList.push(new ArmorModel("Green Beret", 19, 13, 3e3, "_dist/img/armor/armor1.png")), 
        this.armorList.push(new ArmorModel("Hair Band", 12, 81, 50, "_dist/img/armor/armor1.png")), 
        this.armorList.push(new ArmorModel("Head Band", 16, 10, 1600, "_dist/img/armor/armor1.png")), 
        this.armorList.push(new ArmorModel("Iron Helmet", 18, 12, 1e3, "_dist/img/armor/armor1.png")), 
        this.armorList.push(new ArmorModel("Leather Hat", 11, 7, 50, "_dist/img/armor/armor1.png")), 
        this.armorList.push(new ArmorModel("Magus Hat", 15, 16, 600, "_dist/img/armor/armor1.png")), 
        this.armorList.push(new ArmorModel("Mithril Helm", 20, 13, 2e3, "_dist/img/armor/armor1.png")), 
        this.armorList.push(new ArmorModel("Mystery Veil", 24, 25, 5500, "_dist/img/armor/armor1.png")), 
        this.armorList.push(new ArmorModel("Oath Veil", 32, 31, 9e3, "_dist/img/armor/armor1.png")), 
        this.armorList.push(new ArmorModel("Plumed Hat", 14, 9, 250, "_dist/img/armor/armor1.png")), 
        this.armorList.push(new ArmorModel("Red Cap", 24, 17, 2, "_dist/img/armor/armor1.png")), 
        this.armorList.push(new ArmorModel("Regal Crown", 28, 23, 2, "_dist/img/armor/armor1.png")), 
        this.armorList.push(new ArmorModel("Thornlet", 38, 0, 2, "_dist/img/armor/armor1.png")), 
        this.armorList.push(new ArmorModel("Tiara", 22, 20, 3e3, "_dist/img/armor/armor1.png")), 
        this.armorList.push(new ArmorModel("Tiger Mask", 21, 13, 2500, "_dist/img/armor/armor1.png")), 
        this.armorList.push(new ArmorModel("Titanium", 42, 42, 2, "_dist/img/armor/armor1.png")), 
        this.armorList.push(new ArmorModel("BehemothSuit", 94, 73, 2, "_dist/img/armor/armor1.png")), 
        this.armorList.push(new ArmorModel("Chocobo Suit", 56, 38, 2, "_dist/img/armor/armor1.png")), 
        this.armorList.push(new ArmorModel("Cotton Robe", 32, 21, 200, "_dist/img/armor/armor1.png")), 
        this.armorList.push(new ArmorModel("Crystal Mail", 72, 49, 17e3, "_dist/img/armor/armor1.png")), 
        this.armorList.push(new ArmorModel("Czarina Gown", 70, 64, 2, "_dist/img/armor/armor1.png")), 
        this.armorList.push(new ArmorModel("Dark Gear", 68, 46, 13e3, "_dist/img/armor/armor1.png")), 
        this.armorList.push(new ArmorModel("Diamond Vest", 65, 44, 12e3, "_dist/img/armor/armor1.png")), 
        this.armorList.push(new ArmorModel("DiamondArmor", 70, 47, 15e3, "_dist/img/armor/armor1.png")), 
        this.armorList.push(new ArmorModel("Force Armor", 69, 68, 2, "_dist/img/armor/armor1.png")), 
        this.armorList.push(new ArmorModel("Gaia Gear", 53, 43, 6e3, "_dist/img/armor/armor1.png")), 
        this.armorList.push(new ArmorModel("Genji Armor", 90, 80, 2, "_dist/img/armor/armor1.png")), 
        this.armorList.push(new ArmorModel("Gold Armor", 55, 37, 1e4, "_dist/img/armor/armor1.png")), 
        this.armorList.push(new ArmorModel("Imps Armor", 100, 100, 2, "_dist/img/armor/armor1.png")), 
        this.armorList.push(new ArmorModel("Iron Armor", 40, 27, 700, "_dist/img/armor/armor1.png")), 
        this.armorList.push(new ArmorModel("Kung Fu Suit", 34, 23, 250, "_dist/img/armor/armor1.png")), 
        this.armorList.push(new ArmorModel("LeatherArmor", 28, 19, 150, "_dist/img/armor/armor1.png")), 
        this.armorList.push(new ArmorModel("Light Robe", 60, 43, 11e3, "_dist/img/armor/armor1.png")), 
        this.armorList.push(new ArmorModel("Minerva", 88, 70, 2, "_dist/img/armor/armor1.png")), 
        this.armorList.push(new ArmorModel("Mirage Vest", 48, 36, 2, "_dist/img/armor/armor1.png")), 
        this.armorList.push(new ArmorModel("Mithril Mail", 51, 34, 3500, "_dist/img/armor/armor1.png")), 
        this.armorList.push(new ArmorModel("Mithril Vest", 45, 30, 1200, "_dist/img/armor/armor1.png")), 
        this.armorList.push(new ArmorModel("Moogle Suit", 58, 52, 2, "_dist/img/armor/armor1.png")), 
        this.armorList.push(new ArmorModel("Ninja Gear", 47, 32, 1100, "_dist/img/armor/armor1.png")), 
        this.armorList.push(new ArmorModel("Nutkin Suit", 86, 67, 2, "_dist/img/armor/armor1.png")), 
        this.armorList.push(new ArmorModel("Power Sash", 52, 35, 5e3, "_dist/img/armor/armor1.png")), 
        this.armorList.push(new ArmorModel("Red Jacket", 78, 55, 2, "_dist/img/armor/armor1.png")), 
        this.armorList.push(new ArmorModel("Silk Robe", 39, 29, 600, "_dist/img/armor/armor1.png")), 
        this.armorList.push(new ArmorModel("Snow Muffler", 128, 90, 2, "_dist/img/armor/armor1.png")), 
        this.armorList.push(new ArmorModel("Tabby Suit", 54, 36, 2, "_dist/img/armor/armor1.png")), 
        this.armorList.push(new ArmorModel("Tao Robe", 68, 50, 13e3, "_dist/img/armor/armor1.png")), 
        this.armorList.push(new ArmorModel("White Dress", 47, 35, 2200, "_dist/img/armor/armor1.png")), 
        this.itemList = [], this.itemList.push(new ItemModel("Minor Potion", "regen HP", 35, 100, "_dist/img/potions/hpPotion.png")), 
        this.itemList.push(new ItemModel("Minor Ether", "regen MP", 35, 100, "_dist/img/potions/mpPotion.png")), 
        this.itemList.push(new ItemModel("Haste", "haste", 0, 100, "_dist/img/potions/hastePotion.png")), 
        this.relicList = [], this.relicList.push(new RelicModel("relic 1", "2shots", 0, 100, "_dist/img/relics/relic1.png")), 
        this.relicList.push(new RelicModel("relic 2", "3shots", 0, 100, "_dist/img/relics/relic1.png")), 
        this.relicList.push(new RelicModel("power", "powershot", 0, 100, "_dist/img/relics/relic1.png")), 
        this.relicList.push(new RelicModel("speed", "speedshot", 0, 100, "_dist/img/relics/relic1.png")), 
        this._super(), this.onAssetsLoaded();
    },
    onAssetsLoaded: function() {
        this.mainApp = new GameScreen("Main"), this.screenManager.addScreen(this.mainApp), 
        this.HUD = new PIXI.DisplayObjectContainer(), this.stage.addChild(this.HUD), this.screenManager.change("Main");
    },
    show: function() {},
    hide: function() {},
    destroy: function() {}
}), BarView = Class.extend({
    init: function(width, height, maxValue, currentValue) {
        this.maxValue = maxValue, this.text = "default", this.currentValue = currentValue, 
        this.container = new PIXI.DisplayObjectContainer(), this.width = width, this.height = height, 
        this.backShape = new PIXI.Graphics(), this.backShape.beginFill(16711680), this.backShape.drawRect(0, 0, width, height), 
        this.container.addChild(this.backShape), this.frontShape = new PIXI.Graphics(), 
        this.frontShape.beginFill(65280), this.frontShape.drawRect(0, 0, width, height), 
        this.container.addChild(this.frontShape), this.frontShape.scale.x = this.currentValue / this.maxValue;
    },
    setFrontColor: function(color) {
        this.frontShape && this.container.removeChild(this.frontShape), this.frontShape = new PIXI.Graphics(), 
        this.frontShape.beginFill(color), this.frontShape.drawRect(0, 0, this.width, this.height), 
        this.container.addChild(this.frontShape);
    },
    setBackColor: function(color) {
        this.backShape && this.container.removeChild(this.backShape), this.backShape = new PIXI.Graphics(), 
        this.backShape.beginFill(color), this.backShape.drawRect(0, 0, this.width, this.height), 
        this.container.addChildAt(this.backShape, 0);
    },
    setText: function(text) {
        this.text !== text && (this.lifebar ? this.lifebar.setText(text) : (this.lifebar = new PIXI.Text(text, {
            fill: "white",
            align: "center",
            font: "bold 20px Arial"
        }), this.container.addChild(this.lifebar)));
    },
    updateBar: function(currentValue, maxValue) {
        (this.currentValue !== currentValue || this.maxValue !== maxValue && currentValue >= 0) && (this.currentValue = currentValue, 
        this.maxValue = maxValue, this.frontShape.scale.x = this.currentValue / this.maxValue, 
        this.frontShape.scale.x < 0 && (this.frontShape.scale.x = 0));
    },
    getContent: function() {
        return this.container;
    },
    setPosition: function(x, y) {
        this.container.position.x = x, this.container.position.y = y;
    }
}), BoxHUD1 = Class.extend({
    init: function(width, height, infoSide) {
        if (this.text = "default", this.container = new PIXI.DisplayObjectContainer(), this.infoSide = infoSide, 
        this.width = width, this.height = height, this.backShape = new PIXI.Graphics(), 
        this.backShape.beginFill(0), this.backShape.drawRect(0, 0, width, height), this.container.addChild(this.backShape), 
        this.container.hitArea = new PIXI.Rectangle(0, 0, width, height), 0 !== infoSide) {
            this.infoContainer = new PIXI.DisplayObjectContainer(), this.backShapeInfo = new PIXI.Graphics(), 
            this.backShapeInfo.beginFill(0), this.backShapeInfo.drawRect(0, 0, width, height), 
            this.infoContainer.addChild(this.backShapeInfo), 1 === infoSide ? this.infoContainer.position.x = -width : 2 === infoSide ? this.infoContainer.position.x = width : 3 === infoSide ? this.infoContainer.position.y = -height : 4 === infoSide && (this.infoContainer.position.y = height), 
            this.infoContainer.alpha = 0, this.container.addChild(this.infoContainer), this.container.setInteractive(!0), 
            this.model = null;
            var self = this;
            this.container.mouseover = function() {
                self.showInfo(), console.log("over");
            }, this.container.mouseout = function() {
                self.hideInfo();
            };
        }
    },
    showInfo: function() {
        this.infoContainer.alpha = 1;
    },
    hideInfo: function() {
        this.infoContainer.alpha = 0;
    },
    setColor: function(color) {
        this.backShape && this.container.removeChild(this.backShape), this.backShape = new PIXI.Graphics(), 
        this.backShape.beginFill(color), this.backShape.drawRect(0, 0, this.width, this.height), 
        this.container.addChild(this.backShape);
    },
    addModel: function(model) {
        if (this.model = model, this.addImage(this.model.icoImg), 0 !== this.infoSide) {
            var text = "";
            if (model instanceof WeaponModel) text = "Weapon\n" + model.label + "\npwr: +" + model.battlePower; else if (model instanceof ArmorModel) text = "Armor\n" + model.label + "\ndef: +" + model.defenseArmor + "\nmag def: +" + model.magicDefenseArmor; else if (model instanceof RelicModel) text = "Relic\n" + model.label + "\nstatus: " + model.status; else if (model instanceof ItemModel) {
                var addicionalLabel = 0 !== model.baseValue ? "\n+ " + model.baseValue : "";
                text = model.label + "\n" + model.effect + addicionalLabel;
            } else model instanceof SpellModel && (text = model.label + "\nmag pow: " + model.spellPower + "\nMP: " + model.mp);
            this.infoLabel ? this.infoLabel.setText(text) : (this.infoLabel = new PIXI.Text(text, {
                fill: "white",
                align: "left",
                font: "14px Arial"
            }), this.infoContainer.addChildAt(this.infoLabel, 1));
        }
    },
    setText: function(text) {
        this.text !== text && (this.label ? this.label.setText(text) : (this.label = new PIXI.Text(text, {
            fill: "white",
            align: "left",
            font: "14px Arial"
        }), this.container.addChildAt(this.label, 1)));
    },
    update: function() {
        this.img && this.img.parent && this.img.setPosition(this.width / 2 - this.img.getContent().width / 2, this.height / 2 - this.img.getContent().height / 2);
    },
    addImage: function(src) {
        this.img && this.img.parent && this.img.parent.removeChild(this.img), this.img = new SimpleSprite(src), 
        this.container.addChild(this.img.getContent()), this.img.setPosition(this.width / 2 - 15, this.height / 2 - 15);
    },
    getContent: function() {
        return this.container;
    },
    setPosition: function(x, y) {
        this.container.position.x = x, this.container.position.y = y;
    }
}), PopUpText = Class.extend({
    init: function(color) {
        this.color = color ? color : "white", this.label = new PIXI.Text("", {
            fill: this.color,
            align: "center",
            font: "bold 20px Arial",
            stroke: "#000",
            strokeThickness: 2
        });
    },
    setText: function(text) {
        this.label.setText(text);
    },
    getContent: function() {
        return this.label;
    },
    initMotion: function(yacum, time) {
        var self = this;
        TweenLite.to(this.label.position, time, {
            y: this.label.position.y + yacum,
            onComplete: function() {
                self.label.parent.removeChild(self.label);
            }
        });
    },
    setPosition: function(x, y) {
        this.label.position.x = x, this.label.position.y = y;
    }
}), Door = Entity.extend({
    init: function(side) {
        this._super(!0), this.updateable = !1, this.deading = !1, this.side = side, this.range = APP.tileSize.x / 2, 
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
        this.height = 1, this.type = "fire", this.target = "enemy", this.fireType = "physical", 
        this.node = null, this.velocity.x = vel.x, this.velocity.y = vel.y, this.timeLive = 10, 
        this.power = 1, this.defaultVelocity = 1, this.imgSource = "_dist/img/spells/fire1.png";
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
        this._super(this.imgSource), this.updateable = !0, this.collidable = !0, this.debugGraphic = new PIXI.Graphics(), 
        this.debugGraphic.beginFill(1127168), this.debugGraphic.lineStyle(1, 16767232, 1), 
        this.debugGraphic.endFill();
    },
    update: function() {
        this._super(), this.timeLive--, this.timeLive <= 0 && this.preKill(), this.getContent() && (this.width = this.getContent().width, 
        this.height = this.getContent().height), this.getBounds(), this.range = this.width / 2;
    },
    collide: function(arrayCollide) {
        this.collidable && arrayCollide[0].type === this.target && (this.preKill(), arrayCollide[0].hurt(this.power, this.fireType));
    },
    preKill: function() {
        if (this.collidable) {
            var self = this;
            this.updateable = !1, this.collidable = !1, this.getContent().tint = 16711680, TweenLite.to(this.getContent().scale, .3, {
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
        this.armorModel = null, this.weaponModel = null, this.relicModel = null, this.playerModel = model, 
        this.playerModel.entity = this, this.fireModel = new FireModel(), this.endLevel = !1, 
        this.playerDead = !1, this.hasteAcum = 0, this.centerPosition = {
            x: this.width / 2,
            y: this.height / 4
        }, this.fireFreqAcum = 0, this.returnCollider = 0, this.updateAtt();
    },
    setArmorModel: function(aModel) {
        this.armorModel = aModel;
    },
    setRelicModel: function(rModel) {
        this.relicModel = rModel;
    },
    setWeaponModel: function(wModel) {
        this.weaponModel = wModel;
    },
    updateAtt: function() {
        this.defaultVelocity = this.playerModel.velocity, this.fireFreq = this.playerModel.fireFreq - 3, 
        this.fireSpeed = this.fireModel.fireSpeed, this.fireSpeed < 1.4 * this.defaultVelocity && (this.fireSpeed = 1.4 * this.defaultVelocity), 
        this.fireStepLive = this.fireModel.fireStepLive;
    },
    levelUp: function() {
        var pop = new PopUpText("white");
        pop.setText("LEVEL UP"), APP.getEffectsContainer().addChild(pop.getContent()), pop.setPosition(this.getPosition().x + this.centerPosition.x - 20, this.getPosition().y - 5 + 10 * Math.random() - this.height / 2 - 20), 
        pop.initMotion(-15 - 10 * Math.random(), .8), this.getTexture().tint = 16711680, 
        this.updateAtt();
    },
    updateXP: function(xp) {
        var pop = new PopUpText("green");
        pop.setText(Math.floor(xp) + " XP"), APP.getEffectsContainer().addChild(pop.getContent()), 
        pop.setPosition(this.getPosition().x + this.centerPosition.x - 10, this.getPosition().y - 5 + 10 * Math.random() - this.height / 2), 
        pop.initMotion(-10 - 10 * Math.random(), .5), this.getTexture().tint = 16711680;
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
        this.hasteAcum > 0 ? this.hasteAcum-- : this.defaultVelocity = this.playerModel.velocity, 
        !this.isTouch && this.returnCollider <= 0 && (this.velocity = this.virtualVelocity), 
        this.returnCollider > 0 && this.returnCollider--, this.deading && this.setVelocity(0, 0), 
        this._super(), this.debugPolygon(5596740, !0), this.getTexture() && (this.getContent().position.x = 20);
    },
    spell: function(mousePos, spellModel) {
        if (spellModel.mp > this.playerModel.mp) {
            var pop = new PopUpText("red");
            return pop.setText("NO MP"), APP.getEffectsContainer().addChild(pop.getContent()), 
            pop.setPosition(this.getPosition().x + this.centerPosition.x - 20, this.getPosition().y - 5 + 10 * Math.random() - this.height / 2 - 20), 
            void pop.initMotion(-15 - 10 * Math.random(), .8);
        }
        this.playerModel.mp -= spellModel.mp;
        var pop2 = new PopUpText("blue");
        pop2.setText("-" + spellModel.mp + " MP"), APP.getEffectsContainer().addChild(pop2.getContent()), 
        pop2.setPosition(this.getPosition().x + this.centerPosition.x - 20, this.getPosition().y - 5 + 10 * Math.random() - this.height / 2 - 20), 
        pop2.initMotion(-15 - 10 * Math.random(), .8);
        var numFires = spellModel.isMultiple ? 10 : 3, tempFireSpeed = 2 * this.fireSpeed, tempFireFreq = this.fireFreq, angle = Math.atan2(windowHeight / 2 - mousePos.y + this.centerPosition.y, windowWidth / 2 - mousePos.x + this.centerPosition.x);
        angle = 180 * angle / Math.PI * -1, angle += 270, angle = angle / 180 * Math.PI;
        for (var pair = 1, odd = 1, tempAcc = 0, tempAngle = angle, angleAcc = spellModel.isMultiple ? 360 : 90, i = 0; numFires > i; i++) {
            i > 0 && (i % 2 === 0 ? (tempAcc = pair, pair++) : (tempAcc = -odd, odd++), tempAngle = angle + tempAcc * (angleAcc / numFires) * Math.PI / 180);
            var tempFire = new Fire({
                x: tempFireSpeed * Math.sin(tempAngle),
                y: tempFireSpeed * Math.cos(tempAngle)
            });
            tempFire.timeLive = this.fireStepLive / 5, spellModel && (this.playerModel.spellPower = spellModel.spellPower, 
            tempFire.imgSource = spellModel.srcImg), tempFire.fireType = "magical", tempFire.power = this.playerModel.getDemage("magical"), 
            tempFire.range *= 1.5, tempFire.build(), tempFire.getContent().scale.x = 2, tempFire.getContent().scale.y = 2, 
            tempFire.setPosition(this.getPosition().x + 40, this.getPosition().y + 10), this.layer.addChild(tempFire), 
            this.fireFreqAcum = tempFireFreq;
        }
    },
    shoot: function(mousePos, weaponModel) {
        var angle = (-APP.getGameContent().position.x + windowWidth / 2 + mousePos.x, -APP.getGameContent().position.y + windowHeight / 2 + mousePos.y, 
        Math.atan2(windowHeight / 2 - mousePos.y + this.centerPosition.y, windowWidth / 2 - mousePos.x + this.centerPosition.x));
        angle = 180 * angle / Math.PI * -1, angle += 270, angle = angle / 180 * Math.PI;
        var numFires = 1, tempFireSpeed = this.fireSpeed, tempFireFreq = this.fireFreq;
        this.relicModel && ("2shots" === this.relicModel.status && (numFires = 2), "3shots" === this.relicModel.status && (numFires = 3), 
        "powershot" === this.relicModel.status && (tempFireSpeed = 2 * this.fireSpeed), 
        "speedshot" === this.relicModel.status && (tempFireFreq = this.fireFreq / 1.5));
        for (var pair = 1, odd = 1, tempAcc = 0, tempAngle = angle, i = 0; numFires > i; i++) {
            i > 0 && (i % 2 === 0 ? (tempAcc = pair, pair++) : (tempAcc = -odd, odd++), tempAngle = angle + 10 * tempAcc * Math.PI / 180);
            var tempFire = new Fire({
                x: tempFireSpeed * Math.sin(tempAngle),
                y: tempFireSpeed * Math.cos(tempAngle)
            });
            tempFire.timeLive = this.fireStepLive, weaponModel && (this.playerModel.weaponPower = weaponModel.battlePower, 
            tempFire.imgSource = weaponModel.srcImg), tempFire.power = this.playerModel.getDemage("physical"), 
            tempFire.build(), tempFire.setPosition(this.getPosition().x + 40, this.getPosition().y + 10), 
            this.layer.addChild(tempFire), this.fireFreqAcum = tempFireFreq, tempFire.getContent().rotation = -tempAngle + 180 * Math.PI / 180;
        }
    },
    preKill: function() {
        this._super(), this.debugGraphic.parent && (this.debugGraphic.parent.removeChild(this.debugGraphic), 
        this.playerDead = !0);
    },
    regenHP: function(value) {
        if (value + this.playerModel.hp > this.playerModel.hpMax && (value = Math.floor(this.playerModel.hpMax - this.playerModel.hp)), 
        0 !== value) {
            this.playerModel.hp += value;
            var pop = new PopUpText("green");
            pop.setText("+" + value + "HP"), APP.getEffectsContainer().addChild(pop.getContent()), 
            pop.setPosition(this.getPosition().x + this.centerPosition.x - 20, this.getPosition().y - 5 + 10 * Math.random() - this.height / 2 - 20), 
            pop.initMotion(-15 - 10 * Math.random(), .8);
        }
    },
    regenMP: function(value) {
        if (value + this.playerModel.mp > this.playerModel.mpMax && (value = Math.floor(this.playerModel.mpMax - this.playerModel.mp)), 
        0 !== value) {
            this.playerModel.mp += value;
            var pop = new PopUpText("blue");
            pop.setText("+" + value + "MP"), APP.getEffectsContainer().addChild(pop.getContent()), 
            pop.setPosition(this.getPosition().x + this.centerPosition.x - 20, this.getPosition().y - 5 + 10 * Math.random() - this.height / 2 - 20), 
            pop.initMotion(-15 - 10 * Math.random(), .8);
        }
    },
    useItem: function(itemModel) {
        if ("regen HP" === itemModel.effect) this.regenHP(itemModel.baseValue); else if ("regen MP" === itemModel.effect) this.regenMP(itemModel.baseValue); else if ("haste" === itemModel.effect && this.hasteAcum <= 0) {
            var pop = new PopUpText("white");
            pop.setText("HASTE"), APP.getEffectsContainer().addChild(pop.getContent()), pop.setPosition(this.getPosition().x + this.centerPosition.x - 20, this.getPosition().y - 5 + 10 * Math.random() - this.height / 2 - 20), 
            pop.initMotion(-15 - 10 * Math.random(), .8), this.defaultVelocity = 1.5 * this.playerModel.velocity, 
            this.hasteAcum = 200;
        }
    },
    reset: function() {
        this.deading = !1, this.setPosition(windowWidth / 2, windowHeight / 2), this.spritesheet.play("idle"), 
        this.setVelocity(0, 0), this.updateable = !0;
    },
    collide: function(arrayCollide) {
        "door" === arrayCollide[0].type && ("up" === arrayCollide[0].side && this.virtualVelocity.y < 0 || "down" === arrayCollide[0].side && this.virtualVelocity.y > 0 || "left" === arrayCollide[0].side && this.virtualVelocity.x < 0 || "right" === arrayCollide[0].side && this.virtualVelocity.x > 0) && (this.endLevel = !0, 
        this.nextNode = arrayCollide[0].node, this.nextDoorSide = arrayCollide[0].side);
    },
    touch: function(collection) {
        this.isTouch = !0, (collection.left || collection.right && 0 !== this.virtualVelocity.x) && (this.velocity.x = 0), 
        (collection.up || collection.down && 0 !== this.virtualVelocity.y) && (this.velocity.y = 0);
    },
    debug: function() {
        null === this.debugGraphic.parent && null !== this.getContent().parent && this.getContent().parent.addChild(this.debugGraphic), 
        this.debugGraphic.clear(), this.debugGraphic.beginFill(16724736), this.debugGraphic.lineStyle(1, 16767232), 
        this.debugGraphic.moveTo(this.bounds.x, this.bounds.y), this.debugGraphic.lineTo(this.bounds.x + this.bounds.w, this.bounds.y), 
        this.debugGraphic.lineTo(this.bounds.x + this.bounds.w, this.bounds.y + this.bounds.h), 
        this.debugGraphic.lineTo(this.bounds.x, this.bounds.y + this.bounds.h), this.debugGraphic.endFill();
    },
    hurt: function(demage, type) {
        if (!(this.playerModel.hp < 0)) {
            type || (type = "physical"), this.armorModel && (this.playerModel.magicDefenseArmor = this.armorModel.magicDefenseArmor, 
            this.playerModel.defenseArmor = this.armorModel.defenseArmor);
            var trueDemage = this.playerModel.getHurt(demage, type), pop = new PopUpText("red");
            pop.setText(Math.floor(trueDemage)), APP.getEffectsContainer().addChild(pop.getContent()), 
            pop.setPosition(this.getPosition().x - 10 + 20 * Math.random(), this.getPosition().y - 5 + 10 * Math.random() - this.height / 2), 
            pop.initMotion(-10 - 10 * Math.random(), .5), this.getTexture().tint = 16711680, 
            this.playerModel.hp -= trueDemage, this.playerModel.hp < 0 && (this.playerModel.hp = 0), 
            this.playerModel.hp <= 0 && this.preKill();
        }
    },
    debugPolygon: function(color, force) {
        (this.lastColorDebug !== color || force) && (null === this.debugGraphic.parent && null !== this.getContent().parent && this.getContent().parent.addChild(this.debugGraphic), 
        this.lastColorDebug = color, this.gambAcum++, void 0 !== this.debugGraphic ? this.debugGraphic.clear() : this.debugGraphic = new PIXI.Graphics(), 
        this.debugGraphic.beginFill(color, .5), this.debugGraphic.lineStyle(1, 16767232), 
        this.debugGraphic.drawCircle(this.getPosition().x + this.centerPosition.x, this.getPosition().y + this.centerPosition.y, this.range), 
        this.debugGraphic.endFill());
    }
}), Enemy = SpritesheetEntity.extend({
    init: function(player, model) {
        this._super(!0), this.updateable = !1, this.deading = !1, this.range = APP.tileSize.x / 2, 
        this.width = .9 * APP.tileSize.x, this.height = .9 * APP.tileSize.y, this.type = "enemy", 
        this.node = null, this.boundsCollision = !0, this.player = player, this.monsterModel = model;
    },
    hurt: function(demage, type) {
        var trueDemage = this.monsterModel.getHurt(demage, type);
        this.hp -= trueDemage;
        var pop = new PopUpText("red");
        if (pop.setText(Math.floor(trueDemage)), APP.getEffectsContainer().addChild(pop.getContent()), 
        pop.setPosition(this.getPosition().x - 10 + 20 * Math.random(), this.getPosition().y - 5 + 10 * Math.random() - this.height / 2), 
        pop.initMotion(-10 - 10 * Math.random(), .5), this.getTexture().tint = 16711680, 
        this.hp <= 0) {
            this.preKill();
            var trueXP = this.monsterModel.xp + .15 * (this.monsterModel.level - this.player.playerModel.level) * this.monsterModel.xp + 1;
            this.player.playerModel.updateXp(trueXP);
        }
    },
    build: function() {
        this.fireFreq = this.monsterModel.fireFreq, this.defaultVelocity = this.monsterModel.speed / 15, 
        this.defaultVelocity < 4 && (this.defaultVelocity = 4), this.hp = this.monsterModel.hp, 
        this.behaviour = new DefaultBehaviour(this, this.player), console.log("HP", this.hp);
        var motionArray = this.getFramesByRange("dragon10", 0, 14), animationIdle = new SpritesheetAnimation();
        animationIdle.build("idle", motionArray, 1, !0, null), this.spritesheet = new Spritesheet(), 
        this.spritesheet.addAnimation(animationIdle), this.spritesheet.play("idle"), this.centerPosition = {
            x: this.width / 2,
            y: this.height / 2
        }, this.updateable = !0, this.collidable = !0;
    },
    update: function() {
        this.behaviour && this.behaviour.update(), this.isTouch || (this.velocity = this.virtualVelocity), 
        this._super(), this.getBounds(), this.getTexture() && (this.getContent().position.x = 20);
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
        this.player = player, this.entity = entity, this.fireFreq = entity.fireFreq + 30 * Math.random(), 
        this.maxFireFreq = entity.fireFreq, this.fireAcum = 0, this.walkAccum = 0, this.fireTimeLive = 50, 
        this.velocity = entity.defaultVelocity, this.maxWalkAccum = 5 * this.velocity, this.fireSpeed = 1.5 * this.velocity;
    },
    update: function() {
        this.walkAccum--, this.walkAccum < 0 && (this.entity.setVelocity(Math.sin(360 * Math.random() / 180 * Math.PI) * this.velocity * .8, Math.cos(360 * Math.random() / 180 * Math.PI) * this.velocity * .8), 
        this.walkAccum = this.maxWalkAccum), this.fireFreq--, this.fireFreq < 0 && pointDistance(this.entity.getPosition().x, this.entity.getPosition().y, this.player.getPosition().x, this.player.getPosition().y) < this.fireTimeLive * this.fireSpeed * 2 && (this.shoot(), 
        this.fireFreq = this.maxFireFreq);
    },
    shoot: function() {
        var angle = Math.atan2(this.entity.getPosition().y + this.entity.centerPosition.y - this.player.getPosition().y, this.entity.getPosition().x + this.entity.centerPosition.x - this.player.getPosition().x);
        angle = 180 * angle / Math.PI * -1, angle += 270, angle = angle / 180 * Math.PI;
        for (var numFires = 1, tempFireSpeed = this.fireSpeed, pair = 1, odd = 1, tempAcc = 0, tempAngle = angle, i = 0; numFires > i; i++) {
            i > 0 && (i % 2 === 0 ? (tempAcc = pair, pair++) : (tempAcc = -odd, odd++), tempAngle = angle + 10 * tempAcc * Math.PI / 180);
            var tempFire = new Fire({
                x: tempFireSpeed * Math.sin(tempAngle),
                y: tempFireSpeed * Math.cos(tempAngle)
            });
            tempFire.timeLive = this.fireTimeLive, tempFire.power = this.entity.monsterModel.getDemage(this.entity.monsterModel.attackType), 
            tempFire.build(), tempFire.target = "player", tempFire.setPosition(this.entity.getPosition().x + 40, this.entity.getPosition().y + 10), 
            this.entity.layer.addChild(tempFire);
        }
    }
}), ItemDefault = Class.extend({
    init: function(entity, player) {
        this.player = player, this.entity = entity, this.life = 8, this.entity.setVelocity(-2, 3 * (Math.random() - .5)), 
        this.sideAcum = 0, this.sideMaxAcum = 200, this.fireFreq = 25, this.fireAcum = 0, 
        this.fireSpeed = 6;
    },
    update: function() {}
}), ArmorModel = Class.extend({
    init: function(name, defenseArmor, magicDefenseArmor, price, icoImg) {
        this.name = name, this.label = name, this.defenseArmor = defenseArmor, this.magicDefenseArmor = magicDefenseArmor, 
        this.price = price, this.icoImg = icoImg;
    }
}), FireModel = Class.extend({
    init: function() {
        this.fireSpeed = 10, this.fireStepLive = 65;
    },
    update: function() {}
}), ItemModel = Class.extend({
    init: function(name, effect, baseValue, price, icoImg) {
        this.name = name, this.label = name, this.effect = effect, this.baseValue = baseValue, 
        this.price = price, this.icoImg = icoImg;
    }
}), MonsterModel = Class.extend({
    init: function(level, hp, stamina, speed, magicPower, battlePower, defense, magicDefense, xp) {
        this.initiallevel = level, this.initialhp = hp, this.initialstamina = stamina, this.initialspeed = speed, 
        this.initialmagicPower = magicPower, this.initialbattlePower = battlePower, this.initialdefense = defense, 
        this.initialmagicDefense = magicDefense, this.initialxp = xp, this.level = level, 
        this.hpMax = hp, this.speed = speed, this.magicPower = magicPower, this.battlePower = battlePower, 
        this.defense = defense, this.magicDefense = magicDefense, this.stamina = stamina, 
        this.critialChance = 0, this.speedStatus = "normal", this.attackType = "physical", 
        magicPower > battlePower && (this.attackType = "magical"), this.xp = xp ? xp : 100, 
        this.spellPower = 9, this.speedModifier = .005, this.magicPowerModifier = .004, 
        this.battlePowerModifier = .005, this.defenseModifier = .004, this.magicDefenseModifier = .004, 
        this.baseHPModifier = 1.62, this.staminaModifier = .008, this.level = level;
    },
    clone: function() {
        return new MonsterModel(this.initiallevel, this.initialhp, this.initialstamina, this.initialspeed, this.initialmagicPower, this.initialbattlePower, this.initialdefense, this.initialmagicDefense, this.initialxp);
    },
    updateLevel: function(level) {
        console.log("updateLevel", level), this.level = level, this.speed += level * ((this.speed * this.speed + this.speed + 3) / 4) * this.speedModifier, 
        console.log(this.speed), this.magicPower += level * ((this.magicPower * this.magicPower + this.magicPower + 3) / 4) * this.magicPowerModifier, 
        this.battlePower += level * ((this.battlePower * this.battlePower + this.battlePower + 3) / 4) * this.battlePowerModifier, 
        this.defense += level * ((this.defense * this.defense + this.defense + 3) / 4) * this.defenseModifier, 
        this.magicDefense += level * ((this.magicDefense * this.magicDefense + this.magicDefense + 3) / 4) * this.magicDefenseModifier, 
        this.stamina += (this.stamina * this.stamina + this.stamina + 3) / 4 * this.staminaModifier, 
        this.attack = this.battlePower * level, this.speed > 255 && (this.speed = 255), 
        this.stamina > 255 && (this.stamina = 255), this.magicPower > 255 && (this.magicPower = 255), 
        this.battlePower > 255 && (this.battlePower = 255), this.defense > 255 && (this.defense = 255), 
        this.attack > 255 && (this.attack = 255), this.magicDefense > 255 && (this.magicDefense = 255), 
        this.baseHP = level * (20 / this.baseHPModifier), this.hpMax += this.baseHP * (this.stamina + 32) / 32 * (level / 2), 
        this.hp = this.hpMax, this.velocity = 8 - (255 - this.speed) / 25 + 5, this.fireFreq = (255 - this.speed) / (.4 * this.speed) * (1.8 + 1e3 * this.speedModifier), 
        this.fireFreq <= 4 && (this.fireFreq = 4), this.fireFreq >= 150 && (this.fireFreq = 150), 
        this.velocity >= 10 && (this.velocity = 10), this.velocity <= 3 && (this.velocity = 3);
        var curveAcentValue = .15;
        this.xp += Math.floor((level * (level / 3) + level + 3) / 5 * this.xp * level * curveAcentValue), 
        console.log("enemy HP", this.hp, this.defenseModifier, level, this.fireFreq, this.xp);
    },
    getDemage: function(type) {
        var damageMultiplier = 0, demage = 0;
        return "physical" === type ? demage = this.battlePower * this.level + this.level * this.level * this.battlePower / 2 / 256 * 2.5 / 2 : "magical" === type && (demage = this.spellPower * this.level + this.level * (3 * this.magicPower / 2) * this.spellPower / 32), 
        demage += demage / 2 * damageMultiplier;
    },
    getHurt: function(demage, type) {
        return "physical" === type ? demage = demage * (255 - this.defense) / 256 + 1 : "magical" === type && (demage = demage * (255 - this.magicDefense) / 256 + 1), 
        demage;
    },
    getSpeed: function() {
        return "normal" === type ? currentSpeed = 96 * (this.speed + 20) / 16 : "haste" === type ? currentSpeed = 126 * (this.speed + 20) / 16 : "slow" === type && (currentSpeed = 48 * (this.speed + 20) / 16), 
        currentSpeed;
    }
}), PlayerModel = Class.extend({
    init: function(playerClass) {
        this.playerClass = playerClass ? playerClass : "warrior", this.level = 1;
        var nextl = this.level;
        this.toNextLevel = (nextl * nextl + nextl + 3) / 4 * 20 * nextl, this.toBeforeLevel = 0, 
        "warrior" === this.playerClass ? (this.vigor = 40, this.speed = 33, this.stamina = 33, 
        this.magicPower = 25, this.battlePower = 25, this.defense = 48, this.magicDefense = 20, 
        this.baseHPModifier = 1.32, this.baseHP = this.level * (20 / this.baseHPModifier), 
        this.baseMPModifier = 15.2, this.vigorModifier = .0065, this.speedModifier = .0045, 
        this.staminaModifier = .007, this.magicPowerModifier = .0025, this.battlePowerModifier = .0055, 
        this.defenseModifier = .0065, this.magicDefenseModifier = .0025) : "mage" === this.playerClass ? (this.vigor = 31, 
        this.speed = 33, this.stamina = 28, this.magicPower = 39, this.battlePower = 12, 
        this.defense = 42, this.magicDefense = 33, this.baseHPModifier = 1.32, this.baseHP = this.level * (20 / this.baseHPModifier), 
        this.baseMPModifier = 7.8, this.vigorModifier = .004, this.speedModifier = .005, 
        this.staminaModifier = .005, this.magicPowerModifier = .007, this.battlePowerModifier = .003, 
        this.defenseModifier = .005, this.magicDefenseModifier = .007) : "thief" === this.playerClass && (this.vigor = 37, 
        this.speed = 40, this.stamina = 28, this.magicPower = 28, this.battlePower = 14, 
        this.defense = 38, this.magicDefense = 23, this.baseHPModifier = 1.32, this.baseHP = this.level * (20 / this.baseHPModifier), 
        this.baseMPModifier = 10.2, this.vigorModifier = .005, this.speedModifier = .007, 
        this.staminaModifier = .007, this.magicPowerModifier = .004, this.battlePowerModifier = .005, 
        this.defenseModifier = .004, this.magicDefenseModifier = .004), this.spellPower = 20, 
        this.weaponPower = 30, this.defenseArmor = 0, this.magicDefenseArmor = 0, this.hpMax = this.baseHP * (this.stamina + 32) / 32, 
        this.hp = this.hpMax, this.baseMP = this.level * (20 / this.baseMPModifier), this.mpMax = this.baseMP * (this.magicPower + 32) / 32, 
        this.mp = this.mpMax, this.critialChance = 0, this.speedStatus = "normal", this.vigor2 = 2 * this.vigor, 
        this.vigor >= 128 && (this.vigor2 = 255), this.attack = this.battlePower + this.vigor2, 
        this.xp = 0, this.velocity = 8 - (255 - this.speed) / 25 + 5, this.fireFreq = (255 - this.speed) / (.4 * this.speed) * 1.5, 
        this.entity = null, this.csvStr = "level,hp,mp,vigor,speed,stamina,magicPower,battlePower,defense,attack,magicDefense,velocity,fireFreq,demagePhysical,demageMagical\n", 
        this.csvStr += this.level + "," + Math.floor(this.hpMax) + "," + Math.floor(this.mpMax) + "," + Math.floor(this.vigor) + "," + Math.floor(this.speed) + "," + Math.floor(this.stamina) + "," + Math.floor(this.magicPower) + "," + Math.floor(this.battlePower) + "," + Math.floor(this.defense) + "," + Math.floor(this.attack) + "," + Math.floor(this.magicDefense) + "," + Math.floor(this.velocity) + "," + Math.floor(this.fireFreq) + "," + Math.floor(this.getDemage("physical")) + "," + Math.floor(this.getDemage("magical")) + "\n";
    },
    log: function() {
        console.log(), console.log("stats"), console.log("class,", this.playerClass), console.log("level,", Math.floor(this.level)), 
        console.log("hp,", Math.floor(this.hpMax)), console.log("mp,", Math.floor(this.mpMax)), 
        console.log("vigor,", Math.floor(this.vigor)), console.log("speed,", Math.floor(this.speed)), 
        console.log("stamina,", Math.floor(this.stamina)), console.log("magicPower,", Math.floor(this.magicPower)), 
        console.log("battlePower,", Math.floor(this.battlePower)), console.log("defense,", Math.floor(this.defense)), 
        console.log("attack,", Math.floor(this.attack)), console.log("magicDefense,", Math.floor(this.magicDefense)), 
        console.log("velocity,", Math.floor(this.velocity)), console.log("fireFreq,", Math.floor(this.fireFreq)), 
        console.log("demagePhysical,", Math.floor(this.getDemage("physical"))), console.log("demageMagical,", Math.floor(this.getDemage("magical")));
    },
    logCSV: function() {
        console.log(this.csvStr);
    },
    levelUp: function() {
        this.level++;
        var nextl = this.level, befl = this.level - 1;
        this.toNextLevel = (nextl * nextl + nextl + 3) / 4 * 20 * nextl, this.toBeforeLevel = (befl * befl + befl + 3) / 4 * 20 * befl, 
        this.vigor += (this.vigor * this.vigor + this.vigor + 3) / 4 * this.vigorModifier, 
        this.speed += (this.speed * this.speed + this.speed + 3) / 4 * this.speedModifier, 
        this.stamina += (this.stamina * this.stamina + this.stamina + 3) / 4 * this.staminaModifier, 
        this.magicPower += (this.magicPower * this.magicPower + this.magicPower + 3) / 4 * this.magicPowerModifier, 
        this.battlePower += (this.battlePower * this.battlePower + this.battlePower + 3) / 4 * this.battlePowerModifier, 
        this.defense += (this.defense * this.defense + this.defense + 3) / 4 * this.defenseModifier, 
        this.magicDefense += (this.magicDefense * this.magicDefense + this.magicDefense + 3) / 4 * this.magicDefenseModifier, 
        this.vigorModifier -= 5e-4, this.speedModifier -= 5e-4, this.staminaModifier -= 5e-4, 
        this.magicPowerModifier -= 5e-4, this.battlePowerModifier -= 5e-4, this.defenseModifier -= 5e-4, 
        this.magicDefenseModifier -= 5e-4, this.vigorModifier <= .001 && (this.vigorModifier = .001), 
        this.speedModifier <= .001 && (this.speedModifier = .001), this.staminaModifier <= .001 && (this.staminaModifier = .001), 
        this.magicPowerModifier <= .001 && (this.magicPowerModifier = .001), this.battlePowerModifier <= .001 && (this.battlePowerModifier = .001), 
        this.defenseModifier <= .001 && (this.defenseModifier = .001), this.magicDefenseModifier <= .001 && (this.magicDefenseModifier = .001), 
        this.vigor2 = 2 * this.vigor, this.vigor >= 128 && (this.vigor2 = 255), this.attack = this.battlePower + this.vigor2, 
        this.vigor > 255 && (this.vigor = 255), this.speed > 255 && (this.speed = 255), 
        this.stamina > 255 && (this.stamina = 255), this.magicPower > 255 && (this.magicPower = 255), 
        this.battlePower > 255 && (this.battlePower = 255), this.defense > 255 && (this.defense = 255), 
        this.attack > 255 && (this.attack = 255), this.magicDefense > 255 && (this.magicDefense = 255), 
        this.baseHPModifier -= .008, this.baseMPModifier += .02, this.baseHP = this.level * (20 / this.baseHPModifier), 
        this.baseMP = this.level * (20 / this.baseMPModifier), this.hpMax += this.baseHP * (this.stamina + 32) / 32, 
        this.hp = this.hpMax, this.mpMax += this.baseMP * (this.magicPower + 32) / 32, this.mp = this.mpMax, 
        this.velocity = 8 - (255 - this.speed) / 25 + 5, this.fireFreq = (255 - this.speed) / (.4 * this.speed) * (1.1 + 1e3 * this.speedModifier), 
        this.fireFreq <= 4 && (this.fireFreq = 4), this.fireFreq >= 25 && (this.fireFreq = 25), 
        this.velocity >= 10 && (this.velocity = 10), this.velocity <= 3 && (this.velocity = 3), 
        this.csvStr += this.level + "," + Math.floor(this.hpMax) + "," + Math.floor(this.mpMax) + "," + Math.floor(this.vigor) + "," + Math.floor(this.speed) + "," + Math.floor(this.stamina) + "," + Math.floor(this.magicPower) + "," + Math.floor(this.battlePower) + "," + Math.floor(this.defense) + "," + Math.floor(this.attack) + "," + Math.floor(this.magicDefense) + "," + Math.floor(this.velocity) + "," + Math.floor(this.fireFreq) + "," + Math.floor(this.getDemage("physical")) + "," + Math.floor(this.getDemage("magical")) + "\n", 
        this.entity && this.entity.levelUp();
    },
    updateLevel: function() {
        for (var i = this.level; 99 >= i; i++) {
            var calcXP = (i * i + i + 3) / 4 * 20 * i;
            if (!(this.xp > calcXP)) break;
            this.levelUp();
        }
    },
    resetPoints: function() {
        this.hp = this.hpMax, this.mp = this.mpMax;
    },
    updateXp: function(xp) {
        this.xp += xp, this.updateLevel(), this.entity && this.entity.updateXP(xp);
    },
    getDemage: function(type) {
        var damageMultiplierCritical = Math.random() < this.critialChance ? .5 : 2, damageMultiplier = Math.random() / 2 + 1, demage = 0;
        return "physical" === type ? demage = this.battlePower * this.level + this.level * this.attack * this.weaponPower / 256 * 3 / 2 : "magical" === type && (demage = 4 * this.spellPower + this.level * this.magicPower * this.spellPower / 32), 
        demage = .3 * (damageMultiplier * demage + demage / 2 * damageMultiplierCritical);
    },
    getHurt: function(demage, type) {
        return "physical" === type ? demage = demage * (255 - this.defense - this.defenseArmor + (3 - 10 * Math.random())) / 256 + 1 : "magical" === type && (demage = demage * (255 - this.magicDefense - this.magicDefenseArmor + (3 - 10 * Math.random())) / 256 + 1), 
        demage;
    },
    getSpeed: function(type) {
        return "normal" === type ? currentSpeed = 96 * (this.speed + 20) / 16 : "haste" === type ? currentSpeed = 126 * (this.speed + 20) / 16 : "slow" === type && (currentSpeed = 48 * (this.speed + 20) / 16), 
        currentSpeed;
    }
}), RelicModel = Class.extend({
    init: function(name, status, baseValue, price, icoImg) {
        this.name = name, this.label = name, this.status = status, this.baseValue = baseValue, 
        this.price = price, this.icoImg = icoImg;
    }
}), SpellModel = Class.extend({
    init: function(level, name, mp, spellPower, icoImg, srcImg, isMultiple) {
        this.level = level, this.name = name, this.label = name, this.mp = mp, this.spellPower = spellPower, 
        this.icoImg = icoImg, this.srcImg = srcImg, this.isMultiple = isMultiple;
    }
}), WeaponModel = Class.extend({
    init: function(name, battlePower, hitRate, price, icoImg, srcImg) {
        this.name = name, this.label = name, this.battlePower = battlePower, this.hitRate = hitRate, 
        this.price = price, this.srcImg = srcImg, this.icoImg = icoImg;
    }
}), LevelGenerator = Class.extend({
    init: function(parent) {
        this.parent = parent;
    },
    createHordes: function() {
        for (var tempMonster = null, i = 0; 1 > i; i++) tempMonster = new Enemy(this.parent.player, APP.monsterList[0].clone()), 
        tempMonster.monsterModel.updateLevel(this.parent.currentNode.id >= 10 ? 10 : 1), 
        tempMonster.build(), tempMonster.setPosition(this.parent.levelBounds.x * this.parent.currentNode.getNextFloat() + this.parent.mapPosition.x, this.parent.levelBounds.y * this.parent.currentNode.getNextFloat() + this.parent.mapPosition.y), 
        this.parent.entityLayer.addChild(tempMonster);
    },
    putObstacles: function() {
        for (var i = this.parent.marginTiles.x + 1; i < this.parent.tempSizeTiles.x - this.parent.marginTiles.x + 1; i++) for (var j = this.parent.marginTiles.y + 1; j < this.parent.tempSizeTiles.y - this.parent.marginTiles.y + 1; j++) if (this.parent.currentNode.getNextFloat() > .95) {
            var obs = new Obstacle(1);
            obs.build(), obs.setPosition(j * APP.tileSize.x + this.parent.mapPosition.x, (i + 1) * APP.tileSize.y + this.parent.mapPosition.y), 
            this.parent.entityLayer.addChild(obs);
        }
    },
    createRoom: function() {
        var ii = 0, jj = 0, tempTile = null, tempContainer = new PIXI.DisplayObjectContainer(), maxDist = this.parent.tempSizeTiles.x > this.parent.tempSizeTiles.y ? this.parent.tempSizeTiles.x / 2 : this.parent.tempSizeTiles.y / 2;
        for (ii = 0; ii < this.parent.tempSizeTiles.x; ii++) for (jj = 0; jj < this.parent.tempSizeTiles.y; jj++) {
            if (tempTile = new SimpleSprite(this.parent.currentNode.getNextFloat() < .5 ? "_dist/img/tile1.png" : "_dist/img/tile2.png"), 
            tempTile.setPosition(80 * ii, 80 * jj), ii < this.parent.marginTiles.x || ii >= this.parent.tempSizeTiles.x - this.parent.marginTiles.x || jj < this.parent.marginTiles.y || jj >= this.parent.tempSizeTiles.y - this.parent.marginTiles.y) {
                var alphaacc = (jj + Math.floor(ii * this.parent.tempSizeTiles.y), 0), distance = this.pointDistance(ii, jj, Math.floor(this.parent.tempSizeTiles.x / 2), Math.floor(this.parent.tempSizeTiles.y / 2)) / maxDist;
                tempTile.getContent().alpha = .5 + (1 - distance) - alphaacc;
            }
            tempContainer.addChild(tempTile.getContent());
        }
        var mapMaker = null;
        mapMaker = this.parent.currentNode.getNextFloat() < .3 ? voronoiMap.islandShape.makeBlob(this.parent.currentNode.getNextFloat(), .5) : this.parent.currentNode.getNextFloat() < .6 ? voronoiMap.islandShape.makeRadial(this.parent.currentNode.getNextFloat(), .5) : voronoiMap.islandShape.makeSquare(this.parent.currentNode.getNextFloat(), .5);
        var map = voronoiMap.map({
            width: 80 * this.parent.tempSizeTiles.x,
            height: 80 * this.parent.tempSizeTiles.y
        });
        map.newIsland(mapMaker, 2), console.log(map.newIsland), console.log(map, this.parent.tempSizeTiles, this.parent.tempSizeTiles.x * this.parent.tempSizeTiles.y), 
        map.go0PlacePoints(this.parent.tempSizeTiles.x * this.parent.tempSizeTiles.y, voronoiMap.pointSelector.generateRandom(map.SIZE.width, map.SIZE.height, this.parent.currentNode.getNextFloat())), 
        map.go1BuildGraph(), map.assignBiomes(), map.go2AssignElevations(), map.go3AssignMoisture(), 
        map.go4DecorateMap(), console.log(map);
        var nacum = 0;
        for (ii = 0; ii < map.centers.length; ii++) {
            console.log(map.centers[ii].point, map.centers[ii].biome);
            var tempX = 80 * Math.floor(map.centers[ii].point.y / 80), tempY = 80 * Math.floor(map.centers[ii].point.x / 80);
            tempTile = new SimpleSprite("_dist/img/tile1.png"), "OCEAN" === map.centers[ii].biome ? tempTile.getContent().tint = 344916 : "TEMPERATE_DECIDUOUS_FOREST" === map.centers[ii].biome ? tempTile.getContent().tint = 2590794 : "GRASSLAND" === map.centers[ii].biome ? tempTile.getContent().tint = 2935395 : "TEMPERATE_RAIN_FOREST" === map.centers[ii].biome ? tempTile.getContent().tint = 1531978 : "TROPICAL_RAIN_FOREST" === map.centers[ii].biome ? tempTile.getContent().tint = 2590827 : "TROPICAL_SEASONAL_FOREST" === map.centers[ii].biome ? tempTile.getContent().tint = 3311655 : "SUBTROPICAL_DESERT" === map.centers[ii].biome ? tempTile.getContent().tint = 11186804 : "TEMPERATE_DESERT" === map.centers[ii].biome ? tempTile.getContent().tint = 11709044 : "BEACH" === map.centers[ii].biome ? tempTile.getContent().tint = 8895181 : "SHRUBLAND" === map.centers[ii].biome ? tempTile.getContent().tint = 6195049 : "BARE" === map.centers[ii].biome ? tempTile.getContent().tint = 10987431 : "TAIGA" === map.centers[ii].biome ? tempTile.getContent().tint = 13421772 : "SCORCHED" === map.centers[ii].biome ? tempTile.getContent().tint = 14540253 : "TUNDRA" === map.centers[ii].biome ? tempTile.getContent().tint = 9157271 : "SNOW " === map.centers[ii].biome ? tempTile.getContent().tint = 16777215 : (tempTile.getContent().tint = 0, 
            console.log("WHATS", map.centers[ii].point, map.centers[ii].biome));
            var scl = .4;
            tempTile.setPosition(tempY * scl, tempX * scl), tempTile.getContent().scale.x = scl, 
            tempTile.getContent().scale.y = scl, tempContainer.addChild(tempTile.getContent()), 
            nacum++;
        }
        return console.log(nacum), tempContainer.position.x = 200, tempContainer.position.y = 200, 
        this.parent.bgContainer.addChild(tempContainer), this.parent.currentNode.bg = tempContainer, 
        tempContainer;
    },
    debugBounds: function() {
        this.parent.levelBoundsGraph && this.parent.levelBoundsGraph.parent && this.parent.levelBoundsGraph.parent.removeChild(this.parent.levelBoundsGraph), 
        this.parent.levelBoundsGraph = new PIXI.Graphics(), this.parent.levelBoundsGraph.lineStyle(1, 16711680), 
        this.parent.levelBoundsGraph.drawRect(this.parent.mapPosition.x, this.parent.mapPosition.y, this.parent.levelBounds.x, this.parent.levelBounds.y), 
        this.parent.addChild(this.parent.levelBoundsGraph);
    },
    createDoors: function() {
        this.parent.currentNode.childrenSides[0] && (this.parent.doorLeft = new Door("left"), 
        this.parent.doorLeft.build(), this.parent.doorLeft.setPosition(this.parent.mapPosition.x, this.parent.levelBounds.y / 2 + this.parent.mapPosition.y), 
        this.parent.doorLeft.node = this.parent.currentNode.childrenSides[0], this.parent.environmentLayer.addChild(this.parent.doorLeft)), 
        this.parent.currentNode.childrenSides[1] && (this.parent.doorRight = new Door("right"), 
        this.parent.doorRight.build(), this.parent.doorRight.setPosition(this.parent.levelBounds.x + this.parent.mapPosition.x, this.parent.levelBounds.y / 2 + this.parent.mapPosition.y), 
        this.parent.doorRight.node = this.parent.currentNode.childrenSides[1], this.parent.environmentLayer.addChild(this.parent.doorRight)), 
        this.parent.currentNode.childrenSides[2] && (this.parent.doorUp = new Door("up"), 
        this.parent.doorUp.build(), this.parent.doorUp.setPosition(this.parent.mapPosition.x + this.parent.levelBounds.x / 2, this.parent.mapPosition.y), 
        this.parent.doorUp.node = this.parent.currentNode.childrenSides[2], this.parent.environmentLayer.addChild(this.parent.doorUp)), 
        this.parent.currentNode.childrenSides[3] && (this.parent.doorDown = new Door("down"), 
        this.parent.doorDown.build(), this.parent.doorDown.setPosition(this.parent.mapPosition.x + this.parent.levelBounds.x / 2, this.parent.levelBounds.y + this.parent.mapPosition.y), 
        this.parent.doorDown.node = this.parent.currentNode.childrenSides[3], this.parent.environmentLayer.addChild(this.parent.doorDown));
    },
    removeRain: function() {
        this.rainContainer && this.rainContainer.parent && this.parent.removeChild(this.rainContainer);
    },
    createRain: function() {
        var tempRain = null;
        this.rainContainer && this.rainContainer.parent && this.parent.removeChild(this.rainContainer), 
        this.rainContainer = new PIXI.DisplayObjectContainer(), this.vecRain = [];
        for (var j = 300; j >= 0; j--) tempRain = new RainParticle(50, 5, this.parent.levelBounds.x + 500, this.parent.levelBounds.y + 500, "left"), 
        this.rainContainer.addChild(tempRain.content), this.vecRain.push(tempRain);
        this.rainContainer.parent || this.parent.addChild(this.rainContainer);
    },
    update: function() {
        if (this.vecRain) for (var i = this.vecRain.length - 1; i >= 0; i--) this.vecRain[i].update();
    },
    pointDistance: function(x, y, x0, y0) {
        return Math.sqrt((x -= x0) * x + (y -= y0) * y);
    }
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
        MicroEvent.mixin(this), this._super(label), this.bgContainer = new PIXI.DisplayObjectContainer(), 
        this.addChild(this.bgContainer), this.currentAppModel = new AppModel(), this.mainLayer = new Layer("main"), 
        this.entityLayer = new Layer("fire"), this.environmentLayer = new Layer("environment"), 
        this.layerManager = new LayerManager(), this.layerManager.addLayer(this.environmentLayer), 
        this.layerManager.addLayer(this.entityLayer), this.addChild(this.layerManager), 
        this.mapPosition = {
            x: 200,
            y: 200
        }, this.tempSizeTiles = {
            x: 12,
            y: 10
        }, this.levelBounds = {
            x: 80 * this.tempSizeTiles.x - 2 * this.mapPosition.x,
            y: 80 * this.tempSizeTiles.y - 2 * this.mapPosition.y
        }, this.mouseDown = !1;
        var clss = "thief", rnd = Math.random();
        .33 > rnd ? clss = "warrior" : .66 > rnd && (clss = "mage"), this.playerModel = new PlayerModel(clss), 
        this.playerModel.mp = 8e3, this.playerModel.mpMax = 8e3;
    },
    destroy: function() {
        this._super();
    },
    build: function() {
        this._super();
        var assetsToLoader = [ "_dist/img/spritesheet/dragon.json", "_dist/img/spritesheet/dragon.png", "_dist/img/dragao-perdido.png", "_dist/img/drop.png", "_dist/img/spritesheet/chinesa.json", "_dist/img/spritesheet/chinesa.png" ];
        this.loader = new PIXI.AssetLoader(assetsToLoader), this.initLoad();
    },
    onAssetsLoaded: function() {
        this._super(), this.currentNode = APP.gen.firstNode, this.currentNode.applySeed();
        this.vecPositions = [], this.keyboardInput = new KeyboardInput(this), this.graphDebug = new PIXI.Graphics(), 
        this.addChild(this.graphDebug), this.blackShape = new PIXI.Graphics(), this.blackShape.beginFill(0), 
        this.blackShape.drawRect(0, 0, windowWidth, windowHeight), APP.getHUD().addChild(this.blackShape), 
        this.HPView = new BarView(200, 20, 100, 100), this.HPView.setPosition(20, 150), 
        APP.getHUD().addChild(this.HPView.getContent()), this.MPView = new BarView(200, 20, 100, 100), 
        this.MPView.setPosition(20, 180), this.MPView.setFrontColor(255), APP.getHUD().addChild(this.MPView.getContent()), 
        this.XPBar = new BarView(200, 20, 100, 100), this.XPBar.setPosition(20, 210), this.XPBar.setFrontColor(5592405), 
        this.XPBar.setBackColor(0), APP.getHUD().addChild(this.XPBar.getContent()), TweenLite.to(this.blackShape, 1, {
            alpha: 0
        }), this.levelLabel = new PIXI.Text("", {
            fill: "white",
            align: "left",
            font: "bold 15px Arial"
        }), APP.getHUD().addChild(this.levelLabel), this.shortcuts = [ null, null, null, null, null, null ], 
        this.shortcuts[0] = APP.itemList[0], this.shortcuts[1] = APP.itemList[1], this.shortcuts[2] = APP.itemList[2], 
        this.shortcuts[3] = APP.spellList[Math.floor(APP.spellList.length * Math.random())], 
        this.shortcuts[4] = APP.spellList[Math.floor(APP.spellList.length * Math.random())], 
        this.shortcuts[5] = APP.spellList[Math.floor(APP.spellList.length * Math.random())];
        for (var tempBox = null, icosTotalWidth = 120 * this.shortcuts.length, i = 0; i < this.shortcuts.length; i++) {
            tempBox = new BoxHUD1(100, 70, 3), tempBox.setPosition(windowWidth / 2 - icosTotalWidth / 2 + 120 * i, windowHeight - 90), 
            APP.getHUD().addChild(tempBox.getContent());
            var tempText = "", shortcut = i + 1;
            5 === i && (shortcut = "SPACE"), this.shortcuts[i] && (tempBox.addImage(this.shortcuts[i].icoImg), 
            tempText = this.shortcuts[i].name, tempBox.addModel(this.shortcuts[i])), tempBox.setText(tempText + "\n\n\n" + shortcut);
        }
        for (this.equips = [ null, null, null ], this.equipsBoxHud = [], i = 0; i < this.equips.length; i++) tempBox = new BoxHUD1(100, 70, 1), 
        tempBox.setPosition(windowWidth - 120, windowHeight / 2.5 + 90 * i), 0 === i ? tempBox.setText("Weapon") : 1 === i ? tempBox.setText("Armor") : 2 === i && tempBox.setText("Relic"), 
        APP.getHUD().addChild(tempBox.getContent()), this.equipsBoxHud.push(tempBox);
        this.minimap = new Minimap(), APP.getHUD().addChild(this.minimap.getContent()), 
        this.minimap.build(), this.minimap.setPosition(windowWidth - .5 * this.minimap.getContent().width - 5, 10), 
        this.minimap.getContent().scale.x = .5, this.minimap.getContent().scale.y = .5, 
        this.collisionSystem = new BoundCollisionSystem(this, !1), this.effectsContainer = new PIXI.DisplayObjectContainer(), 
        this.addChild(this.effectsContainer), this.levelGenerator = new LevelGenerator(this), 
        this.resetLevel();
    },
    updateHUD: function() {
        this.equips[0] = this.player.weaponModel, this.equips[1] = this.player.armorModel, 
        this.equips[2] = this.player.relicModel;
        for (var i = 0; i < this.equipsBoxHud.length; i++) this.equipsBoxHud[i].addModel(this.equips[i]);
    },
    useItem: function(itemModel) {
        this.player.useItem(itemModel);
    },
    spell: function(spellModel) {
        console.log("usou spell", spellModel), this.player.spell(APP.stage.getMousePosition(), spellModel);
    },
    shoot: function() {
        this.player.shoot(APP.stage.getMousePosition(), this.player.weaponModel);
    },
    useShortcut: function(id) {
        this.shortcuts[id] && (this.shortcuts[id] instanceof ItemModel ? this.useItem(this.shortcuts[id]) : this.shortcuts[id] instanceof SpellModel && this.spell(this.shortcuts[id]));
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
    update: function() {
        if (this.player) {
            this.getContent().position.x = windowWidth / 2 - this.player.getPosition().x, this.getContent().position.y = windowHeight / 2 - this.player.getPosition().y, 
            this.player.fireFreqAcum--, this.levelLabel && this.levelLabel.setText("room id:" + this.currentNode.id + "   -    state:roomState   -    playerClass:" + this.playerModel.playerClass + "\nLEVEL: " + this.playerModel.level), 
            this.mouseDown && this.player.fireFreqAcum <= 0 && this.shoot(), this.entityLayer.collideChilds(this.player), 
            this.environmentLayer.collideChilds(this.player), this.boundsCollision();
            for (var i = 0; i < this.entityLayer.childs.length; i++) "fire" === this.entityLayer.childs[i].type && this.entityLayer.collideChilds(this.entityLayer.childs[i]);
            this.collisionSystem.applyCollision(this.entityLayer.childs, this.entityLayer.childs);
        }
        if (this._super(), this.entityLayer.getContent().children.sort(this.depthCompare), 
        this.levelGenerator && this.levelGenerator.update(), this.HPView && this.player) {
            this.HPView.updateBar(Math.floor(this.playerModel.hp), Math.floor(this.playerModel.hpMax)), 
            this.HPView.setText(Math.floor(this.playerModel.hp) + "/ " + Math.floor(this.playerModel.hpMax)), 
            this.MPView.updateBar(Math.floor(this.playerModel.mp), Math.floor(this.playerModel.mpMax)), 
            this.MPView.setText(Math.floor(this.playerModel.mp) + "/ " + Math.floor(this.playerModel.mpMax));
            var tempXP = Math.floor(this.playerModel.xp) - Math.floor(this.playerModel.toBeforeLevel), tempNext = Math.floor(this.playerModel.toNextLevel) - Math.floor(this.playerModel.toBeforeLevel);
            this.XPBar.updateBar(tempXP, tempNext), this.XPBar.setText(tempXP + "/ " + tempNext);
        }
        this.player && this.player.endLevel ? (this.player.endLevel = !1, this.currentNode = this.player.nextNode, 
        this.currentNode.applySeed(), this.currentPlayerSide = this.player.nextDoorSide, 
        this.killLevel(this.resetLevel), this.player = null) : this.player && this.player.playerDead && (this.playerModel.resetPoints(), 
        this.killLevel(this.resetLevel), this.player = null);
    },
    boundsCollision: function() {
        for (var i = 0; i < this.entityLayer.childs.length; i++) {
            var tempEntity = this.entityLayer.childs[i];
            (tempEntity.getPosition().x + tempEntity.virtualVelocity.x < this.mapPosition.x && tempEntity.virtualVelocity.x < 0 || tempEntity.getPosition().x + tempEntity.width + tempEntity.virtualVelocity.x > this.levelBounds.x + this.mapPosition.x && tempEntity.virtualVelocity.x > 0) && (tempEntity.virtualVelocity.x = 0), 
            (tempEntity.getPosition().y + tempEntity.virtualVelocity.y < this.mapPosition.y && tempEntity.virtualVelocity.y < 0 || tempEntity.getPosition().y + tempEntity.height + tempEntity.virtualVelocity.y > this.levelBounds.y + this.mapPosition.y && tempEntity.virtualVelocity.y > 0) && (tempEntity.virtualVelocity.y = 0);
        }
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
        this.vecPositions = [], this.blackShape.alpha = 1, TweenLite.to(this.blackShape, 1, {
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
        for (this.player = new Player(this.playerModel), this.level = getRandomLevel(), 
        this.currentNode.applySeed(); this.bgContainer.children.length; ) this.bgContainer.removeChildAt(0);
        this.marginTiles = {
            x: Math.floor(this.mapPosition.x / 80),
            y: Math.floor(this.mapPosition.y / 80)
        }, this.tempSizeTiles = 1 === this.currentNode.mode ? {
            x: Math.floor(windowWidth / 80) + this.marginTiles.x,
            y: Math.floor(windowHeight / 80) + this.marginTiles.y
        } : {
            x: 14 + this.marginTiles.x + Math.floor(15 * this.currentNode.getNextFloat()),
            y: 7 + this.marginTiles.y + Math.floor(15 * this.currentNode.getNextFloat())
        }, this.levelBounds = {
            x: 80 * this.tempSizeTiles.x - Math.floor(2 * this.mapPosition.x),
            y: 80 * this.tempSizeTiles.y - Math.floor(2 * this.mapPosition.y)
        }, this.currentNode.bg ? this.bgContainer.addChild(this.currentNode.bg) : this.currentNode.bg = this.levelGenerator.createRoom(), 
        this.levelGenerator.debugBounds(), this.levelGenerator.createDoors(), this.levelGenerator.putObstacles(), 
        1 !== this.currentNode.mode && this.levelGenerator.createHordes(), this.currentNode.getNextFloat() > .5 ? this.levelGenerator.createRain() : this.levelGenerator.removeRain(), 
        this.getContent().position.x = -this.mapPosition.x, this.getContent().position.y = -this.mapPosition.y, 
        this.player.build(), this.player.setArmorModel(APP.armorList[0]), this.player.setWeaponModel(APP.weaponList[0]), 
        this.player.setRelicModel(APP.relicList[Math.floor(APP.relicList.length * Math.random())]), 
        this.equips[0] = this.player.weaponModel, this.equips[1] = this.player.armorModel, 
        this.equips[2] = this.player.relicModel, this.updateHUD(), this.entityLayer.addChild(this.player), 
        "up" === this.currentPlayerSide ? this.player.setPosition(this.levelBounds.x / 2 + this.player.width, this.levelBounds.y + this.mapPosition.y - this.player.height) : "down" === this.currentPlayerSide ? this.player.setPosition(this.levelBounds.x / 2 + this.player.width, this.mapPosition.y + this.mapPosition.y - this.player.height) : "left" === this.currentPlayerSide ? this.player.setPosition(this.levelBounds.x + this.mapPosition.x - this.player.width, this.levelBounds.y / 2 + this.player.height) : "right" === this.currentPlayerSide ? this.player.setPosition(this.mapPosition.x, this.levelBounds.y / 2 + this.player.height) : this.player.setPosition(this.mapPosition.x + this.levelBounds.x / 2, this.mapPosition.y + this.levelBounds.y / 2);
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
            self.player && (self.mouseDown = !1);
        }), document.body.addEventListener("mousedown", function() {
            self.player && (self.mouseDown = !0);
        }), document.body.addEventListener("keyup", function(e) {
            if (self.player) {
                if (87 === e.keyCode || 38 === e.keyCode && self.player.velocity.y < 0) self.removePosition("up"); else if (83 === e.keyCode || 40 === e.keyCode && self.player.velocity.y > 0) self.removePosition("down"); else if (65 === e.keyCode || 37 === e.keyCode && self.player.velocity.x < 0) self.removePosition("left"); else if (68 === e.keyCode || 39 === e.keyCode && self.player.velocity.x > 0) self.removePosition("right"); else if (32 === e.keyCode) self.useShortcut(5); else if (49 === e.keyCode || 50 === e.keyCode || 51 === e.keyCode || 52 === e.keyCode || 53 === e.keyCode) {
                    var id = 1;
                    50 === e.keyCode ? id = 2 : 51 === e.keyCode ? id = 3 : 52 === e.keyCode ? id = 4 : 53 === e.keyCode && (id = 5), 
                    self.useShortcut(id - 1);
                }
                self.updatePlayerVel();
            }
        }), document.body.addEventListener("keydown", function(e) {
            87 === e.keyCode || 38 === e.keyCode ? (self.removePosition("down"), self.addPosition("up")) : 83 === e.keyCode || 40 === e.keyCode ? (self.removePosition("up"), 
            self.addPosition("down")) : 65 === e.keyCode || 37 === e.keyCode ? (self.removePosition("right"), 
            self.addPosition("left")) : (68 === e.keyCode || 39 === e.keyCode) && (self.removePosition("left"), 
            self.addPosition("right")), self.updatePlayerVel();
        });
    }
}), meter = new FPSMeter(), SOCKET = null, windowWidth = 1280, windowHeight = 720;

testMobile() && (windowWidth = 640, windowHeight = 960);

var renderer, windowWidthVar = window.innerWidth, windowHeightVar = window.innerHeight, renderer = PIXI.autoDetectRenderer(windowWidth, windowHeight);

document.body.appendChild(renderer.view);

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
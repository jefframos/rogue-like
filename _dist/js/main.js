/*! jefframos 24-12-2014 */
function rgbToHsl(r, g, b) {
    r /= 255, g /= 255, b /= 255;
    var h, s, max = Math.max(r, g, b), min = Math.min(r, g, b), l = (max + min) / 2;
    if (max === min) h = s = 0; else {
        var d = max - min;
        switch (s = l > .5 ? d / (2 - max - min) : d / (max + min), max) {
          case r:
            h = (g - b) / d + (b > g ? 6 : 0);
            break;

          case g:
            h = (b - r) / d + 2;
            break;

          case b:
            h = (r - g) / d + 4;
        }
        h /= 6;
    }
    return {
        h: h,
        s: s,
        l: l
    };
}

function hslToRgb(h, s, l) {
    function hue2rgb(p, q, t) {
        return 0 > t && (t += 1), t > 1 && (t -= 1), 1 / 6 > t ? p + 6 * (q - p) * t : .5 > t ? q : 2 / 3 > t ? p + (q - p) * (2 / 3 - t) * 6 : p;
    }
    var r, g, b;
    if (0 === s) r = g = b = l; else {
        var q = .5 > l ? l * (1 + s) : l + s - l * s, p = 2 * l - q;
        r = hue2rgb(p, q, h + 1 / 3), g = hue2rgb(p, q, h), b = hue2rgb(p, q, h - 1 / 3);
    }
    return {
        r: Math.round(255 * r),
        g: Math.round(255 * g),
        b: Math.round(255 * b)
    };
}

function toHex(n) {
    return n = parseInt(n, 10), isNaN(n) ? "00" : (n = Math.max(0, Math.min(n, 255)), 
    "0123456789ABCDEF".charAt((n - n % 16) / 16) + "0123456789ABCDEF".charAt(n % 16));
}

function rgbToHex(R, G, B) {
    return parseInt("0x" + toHex(R) + toHex(G) + toHex(B));
}

function hexToRgb(hex) {
    var r = hex >> 16, g = hex >> 8 & 255, b = 255 & hex;
    return {
        r: r,
        g: g,
        b: b
    };
}

function addSaturation(color, value) {
    var rgb = hexToRgb(color), hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
    return hsl.s *= value, hsl.s > 1 && (hsl.s = 1), hsl.s < 0 && (hsl.s = 0), rgb = hslToRgb(hsl.h, hsl.s, hsl.l), 
    rgbToHex(rgb.r, rgb.g, rgb.b);
}

function pointDistance(x, y, x0, y0) {
    return Math.sqrt((x -= x0) * x + (y -= y0) * y);
}

function degreesToRadians(deg) {
    return deg * (Math.PI / 180);
}

function radiansToDegrees(rad) {
    return rad / (Math.PI / 180);
}

function testMobile() {
    return !1;
}

function update() {
    requestAnimFrame(update), meter.tickStart();
    var tempRation = window.innerHeight / windowHeight, ratio = tempRation < window.innerWidth / realWindowWidth ? tempRation : window.innerWidth / realWindowWidth;
    windowWidthVar = realWindowWidth * ratio, windowHeightVar = realWindowHeight * ratio, 
    windowWidthVar > realWindowWidth && (windowWidthVar = realWindowWidth), windowHeightVar > realWindowHeight && (windowHeightVar = realWindowHeight), 
    renderer.view.style.width = windowWidthVar + "px", renderer.view.style.height = windowHeightVar + "px", 
    APP.update(), renderer.render(APP.stage), meter.tick();
}

var DungeonGenerator = Class.extend({
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
        this.seed = -1, this.tempAccSeed = this.seed, this.bg = null, this.mapData = null, 
        this.topTile = {
            x: 0,
            y: 0
        }, this.bottomTile = {
            x: 0,
            y: 0
        }, this.leftTile = {
            x: 0,
            y: 0
        }, this.rightTile = {
            x: 0,
            y: 0
        }, this.placedTiles = [];
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
        this._super(windowWidth, windowHeight), this.stage.setBackgroundColor(3153730), 
        this.stage.removeChild(this.loadText), this.isMobile = testMobile(), this.appContainer = document.getElementById("rect"), 
        this.id = parseInt(1e11 * Math.random()), this.gen = new DungeonGenerator(), this.gen.generate(16777215 * Math.random(), 1, [ 10, 15 ], [ 12, 12 ], 5), 
        this.nTileSize = 64, this.tileSize = {
            x: this.nTileSize,
            y: this.nTileSize
        };
    },
    updateMadness: function(value) {
        this.gameScreen.gameMadness += value, this.gameScreen.gameMadness > 2 && (this.gameScreen.gameMadness = 2);
    },
    getMadness: function() {
        return this.gameScreen.gameMadness;
    },
    getHUDController: function() {
        return this.hudController;
    },
    getEffectsContainer: function() {
        return this.gameScreen.effectsContainer;
    },
    getPlayerTileType: function() {
        return this.gameScreen.getPlayerTileType();
    },
    getGame: function() {
        return this.gameScreen;
    },
    getMousePos: function() {
        return this.stage.getMousePosition();
    },
    getMousePosMapRelative: function() {
        return {
            x: -1 * (this.gameScreen.getContent().position.x - windowWidth / 2) + this.stage.getMousePosition().x - windowWidth / 2,
            y: -1 * (this.gameScreen.getContent().position.y - windowHeight / 2) + this.stage.getMousePosition().y - windowHeight / 2
        };
    },
    getGameContent: function() {
        return this.gameScreen.getContent();
    },
    getHUD: function() {
        return this.HUD;
    },
    update: function() {
        this._super(), this.hudController && this.hudController.update();
    },
    build: function() {
        this.playersList = [], this.monsterList = [], this.spellList = [], this.weaponList = [], 
        this.armorList = [], this.itemList = [], this.relicList = [], this._super();
        var JSONToLoader = [ "_dist/img/relics/relics.JSON", "_dist/img/weapons/weapons.JSON", "_dist/img/spells/spells.JSON", "_dist/img/potions/potions.JSON", "_dist/img/enemies/enemies.JSON", "_dist/img/armor/armor.JSON", "_dist/img/players/players.JSON" ];
        this.assetsLoader = new PIXI.AssetLoader(JSONToLoader);
        var self = this;
        this.assetsLoader.onComplete = function() {
            self.onAssetsLoaded();
        }, this.assetsLoader.onProgress = function() {}, this.assetsLoader.load(), this.jsonLoads = JSONToLoader.length;
    },
    updateLoad: function() {
        this.jsonLoads--, this.jsonLoads <= 0 && this.initApplication();
    },
    initApplication: function() {
        this.gameScreen = new GameScreen("Main"), this.screenManager.addScreen(this.gameScreen), 
        this.HUD = new PIXI.DisplayObjectContainer(), this.stage.addChild(this.HUD), this.hudController = new HUDController(this.HUD, this.stage), 
        this.screenManager.change("Main");
    },
    onAssetsLoaded: function() {
        var self = this, jsonLoaderPlayers = new PIXI.JsonLoader("_dist/img/players/players.JSON");
        jsonLoaderPlayers.on("loaded", function(evt) {
            console.log("jsonLoaderPlayers", evt.content.json);
            for (var i = 0; i < evt.content.json.itens.length; i++) self.playersList.push(new PlayerModel(evt.content.json.itens[i].name, evt.content.json.itens[i].label, evt.content.json.itens[i].stats, evt.content.json.itens[i].modifiers, evt.content.json.itens[i].graphicsData, evt.content.json.itens[i].config));
            self.updateLoad();
        }), jsonLoaderPlayers.load();
        var jsonLoaderMonsters = new PIXI.JsonLoader("_dist/img/enemies/enemies.JSON");
        jsonLoaderMonsters.on("loaded", function(evt) {
            console.log("jsonLoaderMonsters", evt.content.json);
            for (var i = 0; i < evt.content.json.itens.length; i++) self.monsterList.push(new MonsterModel(evt.content.json.itens[i].name, evt.content.json.itens[i].stats, evt.content.json.itens[i].fire, evt.content.json.itens[i].graphicsData, evt.content.json.itens[i].config));
            self.updateLoad();
        }), jsonLoaderMonsters.load();
        var jsonLoaderRelics = new PIXI.JsonLoader("_dist/img/relics/relics.JSON");
        jsonLoaderRelics.on("loaded", function(evt) {
            for (var i = 0; i < evt.content.json.itens.length; i++) self.relicList.push(new RelicModel(evt.content.json.itens[i].name, evt.content.json.itens[i].status, evt.content.json.itens[i].baseValue, evt.content.json.itens[i].price, evt.content.json.itens[i].icoImg));
            self.updateLoad();
        }), jsonLoaderRelics.load();
        var jsonLoaderArmor = new PIXI.JsonLoader("_dist/img/armor/armor.JSON");
        jsonLoaderArmor.on("loaded", function(evt) {
            for (var i = 0; i < evt.content.json.itens.length; i++) self.armorList.push(new ArmorModel(evt.content.json.itens[i].name, evt.content.json.itens[i].defenseArmor, evt.content.json.itens[i].magicDefenseArmor, evt.content.json.itens[i].price, evt.content.json.itens[i].icoImg));
            self.updateLoad();
        }), jsonLoaderArmor.load();
        var jsonLoaderWeapon = new PIXI.JsonLoader("_dist/img/weapons/weapons.JSON");
        jsonLoaderWeapon.on("loaded", function(evt) {
            for (var i = 0; i < evt.content.json.itens.length; i++) self.weaponList.push(new WeaponModel(evt.content.json.itens[i].name, evt.content.json.itens[i].battlePower, evt.content.json.itens[i].magicPower, evt.content.json.itens[i].hitRate, evt.content.json.itens[i].price, evt.content.json.itens[i].icoImg, evt.content.json.itens[i].srcImg));
            self.updateLoad();
        }), jsonLoaderWeapon.load();
        var jsonLoaderSpell = new PIXI.JsonLoader("_dist/img/spells/spells.JSON");
        jsonLoaderSpell.on("loaded", function(evt) {
            for (var i = 0; i < evt.content.json.itens.length; i++) self.spellList.push(new SpellModel(evt.content.json.itens[i].level, evt.content.json.itens[i].name, evt.content.json.itens[i].mp, evt.content.json.itens[i].spellPower, evt.content.json.itens[i].icoImg, evt.content.json.itens[i].srcImg, evt.content.json.itens[i].isMultiple));
            self.updateLoad();
        }), jsonLoaderSpell.load();
        var jsonLoaderPotion = new PIXI.JsonLoader("_dist/img/potions/potions.JSON");
        jsonLoaderPotion.on("loaded", function(evt) {
            for (var i = 0; i < evt.content.json.itens.length; i++) self.itemList.push(new ItemModel(evt.content.json.itens[i].name, evt.content.json.itens[i].effect, evt.content.json.itens[i].baseValue, evt.content.json.itens[i].price, evt.content.json.itens[i].icoImg));
            self.updateLoad();
        }), jsonLoaderPotion.load();
    },
    getMonsterByName: function(name) {
        for (var i = this.monsterList.length - 1; i >= 0; i--) if (this.monsterList[i].name === name) return this.monsterList[i].clone();
        return null;
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
            font: "10px Arial"
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
    init: function(width, height, infoSide, id) {
        if (this.text = "default", this.type = "inventory", this.container = new PIXI.DisplayObjectContainer(), 
        this.infoSide = infoSide, this.width = width, this.height = height, this.background = new SimpleSprite("_dist/img/HUD/box.png"), 
        this.backgroundOver = new SimpleSprite("_dist/img/HUD/boxGlow.png"), this.img = null, 
        this.infoImg = null, this.container.hitArea = new PIXI.Rectangle(0, 0, width, height), 
        0 !== infoSide) {
            this.infoContainer = new PIXI.DisplayObjectContainer(), this.backShapeInfo = new PIXI.Graphics(), 
            this.backShapeInfo.beginFill(1313571), this.backShapeInfo.moveTo(10, 2), this.backShapeInfo.lineTo(85, 0), 
            this.backShapeInfo.lineTo(84, 70), this.backShapeInfo.lineTo(63, 95), this.backShapeInfo.lineTo(0, 84), 
            this.backShapeInfo.lineTo(0, 16), this.infoContainer.addChild(this.backShapeInfo), 
            this.infoContainer.pivot.x = 85, this.infoContainer.pivot.y = 85, 1 === infoSide ? this.infoContainer.position.x = -this.backShapeInfo.width : 2 === infoSide ? this.infoContainer.position.x = this.backShapeInfo.width : 3 === infoSide ? (this.infoContainer.position.y = -86 + this.infoContainer.pivot.y, 
            this.infoContainer.position.x = -62 + this.infoContainer.pivot.x) : 4 === infoSide && (this.infoContainer.position.y = this.backShapeInfo.height), 
            this.infoContainer.alpha = 0, 4 > id && (this.shortcut = new SimpleSprite("_dist/img/HUD/topBox.png"), 
            this.container.addChild(this.shortcut.getContent()), this.shortcut.getContent().position.x = 7, 
            this.shortcut.getContent().position.y = -14, this.setText(id + 1), this.setTextPos(20, -13)), 
            this.container.addChild(this.infoContainer), this.container.addChild(this.background.getContent()), 
            this.container.addChild(this.backgroundOver.getContent()), this.backgroundOver.getContent().alpha = 0, 
            this.container.setInteractive(!0), this.model = null;
            var self = this;
            this.container.mouseover = function() {
                self.showInfo(), self.overState();
            }, this.container.mouseout = function() {
                self.hideInfo(), self.outState();
            }, this.container.mouseup = function() {
                APP.getHUDController().upThisBox(self);
            }, this.container.mousedown = function() {
                APP.getHUDController().dragInventory(self);
            };
        }
    },
    overState: function() {
        this.backgroundOver.getContent().alpha = 1;
    },
    outState: function() {
        this.backgroundOver.getContent().alpha = 0;
    },
    showInfo: function() {
        this.model && (this.infoContainer.scale.x = .5, this.infoContainer.scale.y = .5, 
        TweenLite.to(this.infoContainer, .1, {
            alpha: 1
        }), TweenLite.to(this.infoContainer.scale, .2, {
            x: 1,
            y: 1,
            ease: "easeOutBack"
        }));
    },
    hideInfo: function() {
        this.model && (TweenLite.to(this.infoContainer, .1, {
            alpha: 0
        }), TweenLite.to(this.infoContainer.scale, .3, {
            x: .5,
            y: .5,
            ease: "easeInBack"
        }));
    },
    setTextPos: function(x, y) {
        this.label && (this.label.position.x = x, this.label.position.y = y);
    },
    setQuantTextPos: function(x, y) {
        this.quantLabel && (this.quantLabel.position.x = x, this.quantLabel.position.y = y);
    },
    removeModel: function() {
        this.img && this.img.getContent().parent && this.img.getContent().parent.removeChild(this.img.getContent()), 
        this.infoImg && this.infoImg.getContent().parent && this.infoImg.getContent().parent.removeChild(this.infoImg.getContent()), 
        this.quant && this.quant.getContent().parent && this.quant.getContent().parent.removeChild(this.quant.getContent()), 
        this.quantLabel && this.quantLabel.parent && this.quantLabel.parent.removeChild(this.quantLabel), 
        this.infoLabel && this.infoLabel.parent && this.infoLabel.parent.removeChild(this.infoLabel), 
        this.model = null, this.quant = null, this.quantLabel = null, this.img = null, this.infoImg = null, 
        this.infoLabel = null;
    },
    addModel: function(model) {
        if (null !== this.model && this.removeModel(), this.model = model, 0 !== this.infoSide) {
            var text = "";
            if (model && (textTitle = model.label), model instanceof WeaponModel) text = "PWR: +" + model.battlePower + "\nMPW: +" + model.magicPower; else if (model instanceof ArmorModel) text = "DEF: +" + model.defenseArmor + "\nMDF: +" + model.magicDefenseArmor; else if (model instanceof RelicModel) text = "STATUS: \n" + model.status; else if (model instanceof SpellModel) text = "MPW: " + model.spellPower + "\nMP: " + model.mp; else if (model instanceof ItemModel) {
                var addicionalLabel = 0 !== model.baseValue ? "\n+ " + model.baseValue : "";
                textTitle = model.label, text = model.effect + addicionalLabel, this.quant || (this.quant = new SimpleSprite("_dist/img/HUD/quantBox.png"), 
                this.container.addChild(this.quant.getContent()), this.quant.getContent().position.x = -7, 
                this.quant.getContent().position.y = 24, this.setQuantText(model.quant), this.setQuantTextPos(-3, 26));
            }
            this.infoLabelTitle ? this.infoLabelTitle.setText(textTitle) : (this.infoLabelTitle = new PIXI.Text(textTitle, {
                fill: "white",
                align: "left",
                font: "10px Arial",
                wordWrap: !0,
                wordWrapWidth: 20
            }), this.infoContainer.addChildAt(this.infoLabelTitle, 1), this.infoLabelTitle.position.y = 15, 
            this.infoLabelTitle.position.x = 40), this.infoLabel ? this.infoLabel.setText(text) : (this.infoLabel = new PIXI.Text(text, {
                fill: "white",
                align: "left",
                font: "12px Arial"
            }), this.infoContainer.addChildAt(this.infoLabel, 1), this.infoLabel.position.y = 45, 
            this.infoLabel.position.x = 15), model.icoImg && this.addImage(model.icoImg);
        }
    },
    updateQuant: function() {
        this.setQuantText(this.model.quant);
    },
    setQuantText: function(text) {
        this.quantText !== text && (this.quantLabel ? this.quantLabel.setText(text) : (this.quantLabel = new PIXI.Text(text, {
            fill: "black",
            align: "left",
            font: "12px Arial"
        }), this.container.addChild(this.quantLabel)));
    },
    setText: function(text) {
        this.text !== text && (this.label ? this.label.setText(text) : (this.label = new PIXI.Text(text, {
            fill: "black",
            align: "left",
            font: "14px Arial"
        }), this.container.addChild(this.label)));
    },
    update: function() {
        this.img && this.img.parent && this.img.setPosition(this.width / 2 - this.img.getContent().width / 2, this.height / 2 - this.img.getContent().height / 2);
    },
    addImage: function(src) {
        this.img && this.img.getContent().parent && this.img.getContent().parent.removeChild(this.img.getContent()), 
        this.infoImg && this.infoImg.getContent().parent && this.infoImg.getContent().parent.removeChild(this.infoImg.getContent()), 
        this.img = new SimpleSprite(src), this.infoImg = new SimpleSprite(src), this.container.addChild(this.img.getContent()), 
        this.img.getContent().scale.x = 0, this.img.getContent().scale.y = 0, this.img.getContent().anchor.x = .5, 
        this.img.getContent().anchor.y = .5, TweenLite.to(this.img.getContent().scale, .4, {
            x: .8,
            y: .8,
            ease: "easeOutBack"
        });
        var posCorrection = 12, otherCorrection = 12;
        this.img.setPosition(this.width / 2 - posCorrection + otherCorrection, this.height / 2 - posCorrection + otherCorrection), 
        this.infoContainer && (this.infoContainer.addChild(this.infoImg.getContent()), this.infoImg.getContent().scale.x = .6, 
        this.infoImg.getContent().scale.y = .6, this.infoImg.setPosition(15, 15));
    },
    getContent: function() {
        return this.container;
    },
    setPosition: function(x, y) {
        this.container.position.x = x, this.container.position.y = y;
    }
}), EquipsHUD = Class.extend({
    init: function(type) {
        this.type = type, this.container = new PIXI.DisplayObjectContainer();
        var imgScr = "_dist/img/HUD/backWeapon.png";
        "fairy" === this.type ? imgScr = "_dist/img/HUD/backFairy.png" : "relic" === this.type ? imgScr = "_dist/img/HUD/backSpec.png" : "armor" === this.type && (imgScr = "_dist/img/HUD/backArmor.png"), 
        this.background = new SimpleSprite(imgScr), this.container.addChild(this.background.getContent()), 
        this.infoContainer = new PIXI.DisplayObjectContainer(), this.backShapeInfo = new PIXI.Graphics(), 
        this.backShapeInfo.lineStyle(4, 3793465), this.backShapeInfo.beginFill(1313571), 
        this.backShapeInfo.moveTo(10, -20), this.backShapeInfo.lineTo(85, -18), this.backShapeInfo.lineTo(84, 70), 
        this.backShapeInfo.lineTo(90, 90), this.backShapeInfo.lineTo(63, 80), this.backShapeInfo.lineTo(20, 84), 
        this.backShapeInfo.lineTo(0, 74), this.backShapeInfo.lineTo(0, 16), this.backShapeInfo.lineTo(10, -20), 
        this.backShapeInfo.scale.y = -1, this.backShapeInfo.position.y = 65, this.infoContainer.addChild(this.backShapeInfo), 
        this.infoContainer.pivot.x = 90, this.infoContainer.pivot.y = 90, this.infoContainer.position.x = -75 + this.infoContainer.pivot.x, 
        this.infoContainer.position.y = 75 + this.infoContainer.pivot.y, this.infoContainer.alpha = 0, 
        this.container.addChild(this.infoContainer), this.width = this.background.texture.width, 
        this.height = this.background.texture.height, this.container.setInteractive(!0);
        var self = this;
        this.container.mouseover = function() {
            self.showInfo(), self.overState();
        }, this.container.mouseout = function() {
            self.hideInfo(), self.outState();
        }, this.container.mouseup = function() {
            APP.getHUDController().upEquipBox(self);
        }, this.container.mousedown = function() {
            APP.getHUDController().dragInventory(self);
        };
    },
    overState: function() {},
    outState: function() {},
    showInfo: function() {
        this.model && (this.infoContainer.scale.x = .5, this.infoContainer.scale.y = .5, 
        TweenLite.to(this.infoContainer, .1, {
            alpha: 1
        }), TweenLite.to(this.infoContainer.scale, .2, {
            x: 1,
            y: 1,
            ease: "easeOutBack"
        }));
    },
    hideInfo: function() {
        this.model && (TweenLite.to(this.infoContainer, .1, {
            alpha: 0
        }), TweenLite.to(this.infoContainer.scale, .3, {
            x: .5,
            y: .5,
            ease: "easeInBack"
        }));
    },
    removeModel: function() {
        this.img && this.img.getContent().parent && this.img.getContent().parent.removeChild(this.img.getContent()), 
        this.infoImg && this.infoImg.getContent().parent && this.infoImg.getContent().parent.removeChild(this.infoImg.getContent()), 
        this.quant && this.quant.getContent().parent && this.quant.getContent().parent.removeChild(this.quant.getContent()), 
        this.quantLabel && this.quantLabel.parent && this.quantLabel.parent.removeChild(this.quantLabel), 
        this.infoLabel && this.infoLabel.parent && this.infoLabel.parent.removeChild(this.infoLabel), 
        this.model && this.model.type2 && (this.model.type2 = "equip"), this.model = null, 
        this.quant = null, this.quantLabel = null, this.img = null, this.infoImg = null, 
        this.infoLabel = null;
    },
    addModel: function(model) {
        if (null !== this.model && this.removeModel(), this.model = model, 0 !== this.infoSide) {
            var text = "";
            if (model && (textTitle = model.label), model instanceof WeaponModel && "weapon" === this.type) text = "PWR: +" + model.battlePower + "\nMPW: +" + model.magicPower; else if (model instanceof ArmorModel && "armor" === this.type) text = "DEF: +" + model.defenseArmor + "\nMDF: +" + model.magicDefenseArmor; else {
                if (!(model instanceof RelicModel && "relic" === this.type)) return !1;
                text = "STATUS: \n" + model.status;
            }
            this.model.type2 && (this.model.type2 = "currentEquip"), this.infoLabelTitle ? this.infoLabelTitle.setText(textTitle) : (this.infoLabelTitle = new PIXI.Text(textTitle, {
                fill: "white",
                align: "center",
                font: "12px Arial",
                wordWrap: !0,
                wordWrapWidth: 60
            }), this.infoContainer.addChildAt(this.infoLabelTitle, 1), this.infoLabelTitle.position.y = 25, 
            this.infoLabelTitle.position.x = 44 - this.infoLabelTitle.width / 2), this.infoLabel ? this.infoLabel.setText(text) : (this.infoLabel = new PIXI.Text(text, {
                fill: "white",
                align: "left",
                font: "12px Arial"
            }), this.infoContainer.addChildAt(this.infoLabel, 1), this.infoLabel.position.y = 45, 
            this.infoLabel.position.x = 15), model.icoImg && this.addImage(model.icoImg);
        }
    },
    addImage: function(src) {
        this.img && this.img.getContent().parent && this.img.getContent().parent.removeChild(this.img.getContent()), 
        this.infoImg && this.infoImg.getContent().parent && this.infoImg.getContent().parent.removeChild(this.infoImg.getContent()), 
        this.img = new SimpleSprite(src), this.infoImg = new SimpleSprite(src), this.container.addChild(this.img.getContent()), 
        this.img.getContent().scale.x = 0, this.img.getContent().scale.y = 0, this.img.getContent().anchor.x = .5, 
        this.img.getContent().anchor.y = .5, TweenLite.to(this.img.getContent().scale, .4, {
            x: .8,
            y: .8,
            ease: "easeOutBack"
        });
        var posCorrection = {
            x: 0,
            y: 0
        };
        "weapon" === this.type ? (posCorrection.x = 5, posCorrection.y = 5) : "armor" === this.type ? posCorrection.x = -5 : "relic" === this.type && (posCorrection.x = 5), 
        this.img.setPosition(this.width / 2 + posCorrection.x, this.height / 2 + posCorrection.y), 
        this.infoContainer && (this.infoContainer.addChild(this.infoImg.getContent()), this.infoImg.getContent().scale.x = .7, 
        this.infoImg.getContent().scale.y = .7, this.infoImg.setPosition(32, -10));
    },
    getContent: function() {
        return this.container;
    },
    setPosition: function(x, y) {
        this.container.position.x = x, this.container.position.y = y;
    }
}), HUDController = Class.extend({
    init: function(container, stage) {
        this.container = container, this.dragged = null, this.currentModel = null, this.stage = stage, 
        this.bagContent = new PIXI.DisplayObjectContainer(), this.bagContentBackground = new SimpleSprite("_dist/img/HUD/bagContent.png"), 
        this.bagContent.addChild(this.bagContentBackground.getContent()), this.bagContent.pivot.x = 35, 
        this.bagContent.pivot.y = 59, this.bagContent.alpha = 0, this.bagContent.position.x = windowWidth / 2 + 30, 
        this.bagContent.position.y = windowHeight / 2 - 25, this.bagContentImg = null, this.container.addChild(this.bagContent), 
        this.currentBag = null, this.bagContent.setInteractive(!0);
        var self = this;
        this.bagContent.mousedown = function() {
            if (self.currentBag) if (APP.getGame().addModelInventory(self.currentBag.model)) self.currentBag.model = null, 
            self.removeBag(); else {
                console.log("inventory is full");
                var pop = new PopUpText("red");
                pop.setText("inventory is full!"), APP.getEffectsContainer().addChild(pop.getContent()), 
                pop.setPosition(self.currentBag.getPosition().x - 50, self.currentBag.getPosition().y - 5 + 10 * Math.random()), 
                pop.initMotion(-15 - 10 * Math.random(), .8);
            }
        }, this.stage.stage.mouseup = function() {
            self.releaseInventory();
        };
    },
    removeBag: function() {
        this.currentBag && this.currentBag.getContent().parent && (this.currentBag.kill = !0, 
        this.currentModel = null, this.hideBagContent());
    },
    hideBagContent: function() {
        this.bagContent.alpha = 0, this.currentBag = null;
    },
    showBagContent: function(bag) {
        return bag === this.currentBag ? (this.bagContent.alpha = 1, void TweenLite.to(this.bagContent.scale, .4, {
            x: 1,
            y: 1
        })) : (this.bagContentImg && this.bagContentImg.getContent().parent && (this.bagContentImg.getContent().parent.removeChild(this.bagContentImg.getContent()), 
        this.bagContentImg = null), this.currentBag = bag, this.bagContentImg = new SimpleSprite(bag.model.icoImg), 
        this.bagContentImg.setPosition(13, 10), this.bagContent.addChild(this.bagContentImg.getContent()), 
        this.bagContent.alpha = 1, void TweenLite.to(this.bagContent.scale, .4, {
            x: 1,
            y: 1
        }));
    },
    releaseInventory: function() {
        if (this.dragged) {
            var self = this;
            TweenLite.to(this.dragged.scale, .2, {
                x: 0,
                y: 0,
                ease: "easeInBack",
                onComplete: function() {
                    self.dragged && self.dragged.parent && self.dragged.parent.removeChild(self.dragged), 
                    self.dragged = null, self.currentBox = null;
                }
            }), APP.getMousePos().y < windowHeight - 80 && (APP.getGame().addBag(APP.getMousePosMapRelative(), this.currentModel), 
            null !== self.currentBox && self.currentBox.removeModel());
        }
    },
    upEquipBox: function(equipBox) {
        if (console.log(this.currentModel), null !== this.currentModel) {
            if (equipBox.type !== this.currentModel.type) return;
            if (null !== this.currentBox && null !== equipBox.model) {
                if (this.currentBox.model.type !== equipBox.type) return;
                this.currentBox.addModel(equipBox.model);
            } else null !== this.currentBox && this.currentBox.removeModel();
            equipBox.addModel(this.currentModel), APP.getGame().updatePlayerEquips(), this.currentModel = null, 
            this.currentBox = null;
        }
    },
    upThisBox: function(box) {
        console.log("upThisBox", this.currentModel), box.model && null !== this.currentModel.type2 && "currentEquip" === this.currentModel.type2 && this.currentBox.model.type !== box.model.type || null !== this.currentModel && (null !== this.currentBox && null !== box.model ? (this.currentBox.addModel(box.model), 
        null !== box.model && "currentEquip" === box.model.type2 && APP.getGame().updatePlayerEquips()) : null !== this.currentBox && this.currentBox.removeModel(), 
        box.addModel(this.currentModel), this.currentModel = null, this.currentBox = null);
    },
    dragInventory: function(box) {
        if (null !== this.currentBox && (this.currentBox = null), null !== this.dragged && this.container.removeChild(this.dragged), 
        this.currentBox = box, this.currentModel = this.currentBox.model, this.currentBox.infoImg) {
            var currentScale = .8, temps = new SimpleSprite(this.currentBox.model.icoImg);
            this.dragged = temps.getContent(), this.dragged.anchor.x = .5, this.dragged.anchor.y = .5, 
            this.dragged.scale.x = this.dragged.scale.y = 0, TweenLite.to(this.dragged.scale, .4, {
                x: currentScale,
                y: currentScale,
                ease: "easeOutBack"
            }), this.container.addChild(this.dragged);
        }
    },
    update: function() {
        this.dragged && (this.dragged.position.x = APP.getMousePos().x, this.dragged.position.y = APP.getMousePos().y);
    }
}), LifeBarHUD = Class.extend({
    init: function(width, height, maxValue, currentValue) {
        this.maxValue = maxValue, this.text = "default", this.currentValue = currentValue, 
        this.container = new PIXI.DisplayObjectContainer(), this.width = width, this.height = height, 
        this.backShape = new PIXI.Graphics();
        var h = 21, w = 120, xAcc = 0;
        this.rect = [ [ 0, 0 ], [ w, 0 ], [ w + xAcc, h ], [ xAcc, h ] ], this.frontRect = [ [ 0, 0 ], [ w, 0 ], [ w + xAcc, h ], [ xAcc, h ] ];
        var i = 0;
        for (this.backShape.beginFill(16134492), this.backShape.moveTo(this.rect[0][0], this.rect[0][1]), 
        i = 1; i < this.rect.length; i++) this.backShape.lineTo(this.rect[i][0], this.rect[i][1]);
        for (this.backShape.endFill(), this.container.addChild(this.backShape), this.frontShape = new PIXI.Graphics(), 
        this.frontShape.beginFill(8649781), this.frontShape.moveTo(this.frontRect[0][0], this.frontRect[0][1]), 
        i = 1; i < this.frontRect.length; i++) this.frontShape.lineTo(this.frontRect[i][0], this.frontRect[i][1]);
        for (this.frontShape.endFill(), this.container.addChild(this.frontShape), this.mask = new PIXI.Graphics(), 
        this.mask.beginFill(8388608), this.mask.moveTo(this.rect[0][0], this.rect[0][1]), 
        i = 1; i < this.rect.length; i++) this.mask.lineTo(this.rect[i][0], this.rect[i][1]);
        this.mask.endFill();
        var acc = 8, xAcc2 = 6;
        for (this.baseRect = [ this.rect[3], this.rect[2], [ this.rect[2][0] - xAcc2, this.rect[2][1] + acc ], [ this.rect[3][0] - xAcc2, this.rect[3][1] + acc ] ], 
        this.baseFrontRect = [ this.rect[3], this.rect[2], [ this.rect[2][0] - xAcc2, this.rect[2][1] + acc ], [ this.rect[3][0] - xAcc2, this.rect[3][1] + acc ] ], 
        this.backBaseShape = new PIXI.Graphics(), this.backBaseShape.beginFill(9837082), 
        this.backBaseShape.moveTo(this.baseRect[0][0], this.baseRect[0][1]), i = 1; i < this.baseRect.length; i++) this.backBaseShape.lineTo(this.baseRect[i][0], this.baseRect[i][1]);
        for (this.backBaseShape.endFill(), this.container.addChild(this.backBaseShape), 
        this.backFrontShape = new PIXI.Graphics(), this.backFrontShape.beginFill(3192624), 
        this.backFrontShape.moveTo(this.baseFrontRect[0][0], this.baseFrontRect[0][1]), 
        i = 1; i < this.baseFrontRect.length; i++) this.backFrontShape.lineTo(this.baseFrontRect[i][0], this.baseFrontRect[i][1]);
        for (this.backFrontShape.endFill(), this.container.addChild(this.backFrontShape), 
        this.backMask = new PIXI.Graphics(), this.backMask.beginFill(255), this.backMask.moveTo(this.baseRect[0][0], this.baseRect[0][1]), 
        i = 1; i < this.baseRect.length; i++) this.backMask.lineTo(this.baseRect[i][0], this.baseRect[i][1]);
        this.backMask.endFill(), this.container.addChild(this.mask), this.container.addChild(this.backMask), 
        this.frontShape.mask = this.mask, this.backFrontShape.mask = this.backMask;
    },
    setText: function(text) {
        this.text !== text && (this.lifebar ? this.lifebar.setText(text) : this.lifebar = new PIXI.Text(text, {
            fill: "white",
            align: "center",
            font: "10px Arial"
        }));
    },
    updateBar: function(currentValue, maxValue) {
        return this.currentValue < 0 ? (this.frontShape.position.x = this.frontShape.width, 
        void (this.backFrontShape.position.x = this.backFrontShape.position.width)) : (this.currentValue = currentValue, 
        this.maxValue = maxValue, this.frontShape.position.x = this.frontShape.width * (1 - this.currentValue / this.maxValue), 
        void (this.backFrontShape.position.x = this.backFrontShape.width * (1 - this.currentValue / this.maxValue)));
    },
    getContent: function() {
        return this.container;
    },
    setPosition: function(x, y) {
        this.container.position.x = x, this.container.position.y = y;
    }
}), ManaBarHUD = Class.extend({
    init: function(width, height, maxValue, currentValue) {
        this.maxValue = maxValue, this.text = "default", this.currentValue = currentValue, 
        this.container = new PIXI.DisplayObjectContainer(), this.width = width, this.height = height, 
        this.backShape = new PIXI.Graphics();
        var h = 11, w = 120, xAcc = 0;
        this.rect = [ [ 0, 0 ], [ w, 0 ], [ w + xAcc, h ], [ xAcc, h ] ], this.frontRect = [ [ 0, 0 ], [ w, 0 ], [ w + xAcc, h ], [ xAcc, h ] ];
        var i = 0;
        for (this.backShape.beginFill(16134492), this.backShape.moveTo(this.rect[0][0], this.rect[0][1]), 
        i = 1; i < this.rect.length; i++) this.backShape.lineTo(this.rect[i][0], this.rect[i][1]);
        for (this.backShape.endFill(), this.container.addChild(this.backShape), this.frontShape = new PIXI.Graphics(), 
        this.frontShape.beginFill(9033204), this.frontShape.moveTo(this.frontRect[0][0], this.frontRect[0][1]), 
        i = 1; i < this.frontRect.length; i++) this.frontShape.lineTo(this.frontRect[i][0], this.frontRect[i][1]);
        for (this.frontShape.endFill(), this.container.addChild(this.frontShape), this.mask = new PIXI.Graphics(), 
        this.mask.beginFill(8388608), this.mask.moveTo(this.rect[0][0], this.rect[0][1]), 
        i = 1; i < this.rect.length; i++) this.mask.lineTo(this.rect[i][0], this.rect[i][1]);
        this.mask.endFill();
        var acc = 7, xAcc2 = 5;
        for (this.baseRect = [ this.rect[3], this.rect[2], [ this.rect[2][0] - xAcc2, this.rect[2][1] + acc ], [ this.rect[3][0] - xAcc2, this.rect[3][1] + acc ] ], 
        this.baseFrontRect = [ this.rect[3], this.rect[2], [ this.rect[2][0] - xAcc2, this.rect[2][1] + acc ], [ this.rect[3][0] - xAcc2, this.rect[3][1] + acc ] ], 
        this.backBaseShape = new PIXI.Graphics(), this.backBaseShape.beginFill(9837082), 
        this.backBaseShape.moveTo(this.baseRect[0][0], this.baseRect[0][1]), i = 1; i < this.baseRect.length; i++) this.backBaseShape.lineTo(this.baseRect[i][0], this.baseRect[i][1]);
        for (this.backBaseShape.endFill(), this.container.addChild(this.backBaseShape), 
        this.backFrontShape = new PIXI.Graphics(), this.backFrontShape.beginFill(2194057), 
        this.backFrontShape.moveTo(this.baseFrontRect[0][0], this.baseFrontRect[0][1]), 
        i = 1; i < this.baseFrontRect.length; i++) this.backFrontShape.lineTo(this.baseFrontRect[i][0], this.baseFrontRect[i][1]);
        for (this.backFrontShape.endFill(), this.container.addChild(this.backFrontShape), 
        this.backMask = new PIXI.Graphics(), this.backMask.beginFill(255), this.backMask.moveTo(this.baseRect[0][0], this.baseRect[0][1]), 
        i = 1; i < this.baseRect.length; i++) this.backMask.lineTo(this.baseRect[i][0], this.baseRect[i][1]);
        this.backMask.endFill(), this.container.addChild(this.mask), this.container.addChild(this.backMask), 
        this.frontShape.mask = this.mask, this.backFrontShape.mask = this.backMask;
    },
    setText: function(text) {
        this.text !== text && (this.lifebar ? this.lifebar.setText(text) : this.lifebar = new PIXI.Text(text, {
            fill: "white",
            align: "center",
            font: "10px Arial"
        }));
    },
    updateBar: function(currentValue, maxValue) {
        return this.currentValue < 0 ? (this.frontShape.position.x = this.frontShape.width, 
        void (this.backFrontShape.position.x = this.backFrontShape.position.width)) : (this.currentValue = currentValue, 
        this.maxValue = maxValue, this.frontShape.position.x = this.frontShape.width * (this.currentValue / this.maxValue) - this.frontShape.width, 
        void (this.backFrontShape.position.x = this.backFrontShape.width * (this.currentValue / this.maxValue) - this.backFrontShape.width));
    },
    getContent: function() {
        return this.container;
    },
    setPosition: function(x, y) {
        this.container.position.x = x, this.container.position.y = y;
    }
}), MapHUD = Class.extend({
    init: function(img) {
        this.width = 100, this.height = 100, img ? this.texture = "string" == typeof img ? new PIXI.Texture.fromImage(img) : img : (this.background = new PIXI.Graphics(), 
        this.background.beginFill(displayColors.OCEAN), this.background.drawRect(-15, -15, this.width + 30, this.height + 30), 
        this.background.endFill()), this.mask = new PIXI.Graphics(), this.container = new PIXI.DisplayObjectContainer(), 
        this.mapContainer = new PIXI.DisplayObjectContainer(), this.container.addChild(this.background), 
        this.container.addChild(this.mapContainer), this.sizeTile = {
            x: 3,
            y: 3
        }, this.rightBottom = new PIXI.Graphics(), this.leftleft = new PIXI.Graphics(), 
        this.bottomLeft = new PIXI.Graphics(), this.player = new PIXI.Graphics();
    },
    build: function(node) {
        this.node = node;
        var tempMapContainer = new PIXI.DisplayObjectContainer(), tempRect = null;
        for (i = 0; i < node.mapDataLayer1.length; i++) for (j = 0; j < node.mapDataLayer1[i].length; j++) tempRect = new SimpleSprite("_dist/img/pixel.jpg"), 
        tempRect.setPosition(i, j), tempMapContainer.addChild(tempRect.getContent()), tempRect.getContent().tint = displayColors[node.mapDataLayer1[i][j].biome];
        tempMapContainer.scale.x = this.sizeTile.x, tempMapContainer.scale.y = this.sizeTile.y, 
        this.mapContainer.addChild(tempMapContainer), tempMapContainer.cacheAsBitmap = !0, 
        this.mask.beginFill(0), this.mask.moveTo(this.width / 1.8, 0);
        var rightBottomEdge = {
            x: this.width + 10 * Math.random(),
            y: this.height / 2.5 + 10 * Math.random()
        };
        this.mask.lineTo(rightBottomEdge.x, rightBottomEdge.y);
        var bottomEdge = {
            x: this.width / 1.3 + 10 * Math.random(),
            y: this.height + 10 * Math.random()
        };
        this.mask.lineTo(bottomEdge.x, bottomEdge.y);
        var leftBottomEdge = {
            x: this.width / 2.8 + 10 * Math.random(),
            y: this.height / 1.1 + 10 * Math.random()
        };
        this.mask.lineTo(leftBottomEdge.x, leftBottomEdge.y);
        var leftLeftEdge = {
            x: -5 + 10 * Math.random(),
            y: this.height / 1.8 + 10 * Math.random()
        };
        this.mask.lineTo(leftLeftEdge.x, leftLeftEdge.y), this.mask.lineTo(0, this.height / 5), 
        this.mask.lineTo(this.width / 7, this.height / 15), this.mask.endFill(), this.container.addChild(this.mask), 
        this.mapContainer.mask = this.mask, this.background.mask = this.mask;
        var tempRbUnion = {
            x: bottomEdge.x + 5,
            y: bottomEdge.y + 10
        };
        this.rightBottom = new PIXI.Graphics(), this.rightBottom.beginFill(2171204), this.rightBottom.moveTo(rightBottomEdge.x, rightBottomEdge.y), 
        this.rightBottom.lineTo(bottomEdge.x, bottomEdge.y), this.rightBottom.lineTo(tempRbUnion.x, tempRbUnion.y), 
        this.rightBottom.lineTo(rightBottomEdge.x, rightBottomEdge.y + 10), this.rightBottom.endFill();
        var tempBlUnion = {
            x: leftBottomEdge.x - 5,
            y: leftBottomEdge.y + 10
        };
        this.bottomLeft = new PIXI.Graphics(), this.bottomLeft.beginFill(3223899), this.bottomLeft.moveTo(bottomEdge.x, bottomEdge.y), 
        this.bottomLeft.lineTo(leftBottomEdge.x, leftBottomEdge.y), this.bottomLeft.lineTo(tempBlUnion.x, tempBlUnion.y), 
        this.bottomLeft.lineTo(tempRbUnion.x, tempRbUnion.y), this.bottomLeft.endFill(), 
        this.leftleft = new PIXI.Graphics(), this.leftleft.beginFill(6053006), this.leftleft.moveTo(leftBottomEdge.x, leftBottomEdge.y), 
        this.leftleft.lineTo(leftLeftEdge.x, leftLeftEdge.y), this.leftleft.lineTo(leftLeftEdge.x + 5, leftLeftEdge.y + 10), 
        this.leftleft.lineTo(tempBlUnion.x, tempBlUnion.y), this.leftleft.endFill(), this.container.addChild(this.rightBottom), 
        this.container.addChild(this.bottomLeft), this.container.addChild(this.leftleft), 
        this.player = new PIXI.Graphics(), this.player.beginFill(8649781), this.player.moveTo(8, 7), 
        this.player.lineTo(-8, 0), this.player.lineTo(8, -7), this.player.lineTo(6, 0), 
        this.player.endFill(), this.container.addChild(this.player), this.player.position.x = this.width / 2, 
        this.player.position.y = this.height / 2;
    },
    update: function(playerPos) {
        this.mouseAngle = Math.atan2(windowHeight / 2 - APP.getMousePos().y, windowWidth / 2 - APP.getMousePos().x), 
        this.player.rotation = this.mouseAngle, this.mapContainer.position.x = -(playerPos.x * this.sizeTile.x) + this.width / 2, 
        this.mapContainer.position.y = -(playerPos.y * this.sizeTile.y) + this.height / 2;
    },
    getContent: function() {
        return this.container;
    },
    setPosition: function(x, y) {
        this.container.position.x = x, this.container.position.y = y;
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
        this.background.beginFill(0), this.background.lineStyle(4, 5592405), this.background.drawRect(0, 0, (maxX - minX + 1) * this.sizeTile.x + 2 * this.margin.x + this.sizeGraph.x / 2, (maxY - minY + 1) * this.sizeTile.y + 2 * this.margin.y + this.sizeGraph.y / 2), 
        this.background.endFill();
    },
    getContent: function() {
        return this.container;
    },
    setPosition: function(x, y) {
        this.container.position.x = x, this.container.position.y = y;
    }
}), PlayerHUD = Class.extend({
    init: function(type) {
        this.type = type, this.container = new PIXI.DisplayObjectContainer();
        var imgScr = "_dist/img/HUD/backPlayerHUD.png";
        this.background = new SimpleSprite(imgScr), this.container.addChild(this.background.getContent()), 
        this.infoContainer = new PIXI.DisplayObjectContainer(), this.backShapeInfo = new PIXI.Graphics(), 
        this.backShapeInfo.lineStyle(4, 3793465), this.backShapeInfo.beginFill(1313571), 
        this.backShapeInfo.moveTo(2, 20), this.backShapeInfo.lineTo(25, 2), this.backShapeInfo.lineTo(140, 0), 
        this.backShapeInfo.lineTo(138, 73), this.backShapeInfo.lineTo(185, 90), this.backShapeInfo.lineTo(145, 104), 
        this.backShapeInfo.lineTo(143, 174), this.backShapeInfo.lineTo(118, 190), this.backShapeInfo.lineTo(20, 175), 
        this.backShapeInfo.lineTo(0, 150), this.backShapeInfo.lineTo(2, 20), this.infoContainer.addChild(this.backShapeInfo), 
        this.infoContainer.pivot.x = 185, this.infoContainer.pivot.y = 90, this.infoContainer.position.x = 530, 
        this.infoContainer.position.y = this.infoContainer.pivot.y, this.infoContainer.alpha = 0, 
        this.container.addChild(this.infoContainer), this.backShapeInfo.scale.x = -1, this.width = this.background.texture.width, 
        this.height = this.background.texture.height, this.container.setInteractive(!0);
        var self = this;
        this.container.mouseover = function() {
            self.showInfo(), self.overState();
        }, this.container.mouseout = function() {
            self.hideInfo(), self.outState();
        };
    },
    overState: function() {},
    outState: function() {},
    showInfo: function() {
        this.model && (this.infoContainer.scale.x = .5, this.infoContainer.scale.y = .5, 
        TweenLite.to(this.infoContainer, .1, {
            alpha: 1
        }), TweenLite.to(this.infoContainer.scale, .2, {
            x: 1,
            y: 1,
            ease: "easeOutBack"
        }));
    },
    hideInfo: function() {
        this.model && (TweenLite.to(this.infoContainer, .1, {
            alpha: 0
        }), TweenLite.to(this.infoContainer.scale, .3, {
            x: .5,
            y: .5,
            ease: "easeInBack"
        }));
    },
    removeModel: function() {
        this.img && this.img.getContent().parent && this.img.getContent().parent.removeChild(this.img.getContent()), 
        this.infoImg && this.infoImg.getContent().parent && this.infoImg.getContent().parent.removeChild(this.infoImg.getContent()), 
        this.quant && this.quant.getContent().parent && this.quant.getContent().parent.removeChild(this.quant.getContent()), 
        this.quantLabel && this.quantLabel.parent && this.quantLabel.parent.removeChild(this.quantLabel), 
        this.infoLabel && this.infoLabel.parent && this.infoLabel.parent.removeChild(this.infoLabel), 
        this.model = null, this.quant = null, this.quantLabel = null, this.img = null, this.infoImg = null, 
        this.infoLabel = null;
    },
    addModel: function(model, player) {
        this.player = player, null !== this.model && this.removeModel(), this.model = model;
        var text = "";
        textTitle = "model.label", text = "LEVEL: " + this.model.level + " " + this.model.playerClass + "\nVIG: " + Math.floor(this.model.vigor) + "\nSPD: " + Math.floor(this.model.speed) + "\nSTM: " + Math.floor(this.model.stamina) + "\nMPW: " + Math.floor(this.model.magicPower) + " + " + this.player.weaponModel.magicPower + "\nBPW: " + Math.floor(this.model.battlePower) + " + " + this.player.weaponModel.battlePower + "\nATT: " + Math.floor(this.model.attack) + "\nDEF: " + Math.floor(this.model.defense) + " + " + this.player.armorModel.defenseArmor + "\nMDF: " + Math.floor(this.model.magicDefense) + " + " + this.player.armorModel.magicDefenseArmor, 
        this.infoLabel ? this.infoLabel.setText(text) : (this.infoLabel = new PIXI.Text(text, {
            fill: "white",
            align: "left",
            font: "12px Arial"
        }), this.infoContainer.addChildAt(this.infoLabel, 1), this.infoLabel.position.y = 25, 
        this.infoLabel.position.x = -120), console.log(model.graphicsData), model.graphicsData.icoImg && this.addImage(model.graphicsData.icoImg);
    },
    addImage: function(src) {
        console.log(src), this.img && this.img.getContent().parent && this.img.getContent().parent.removeChild(this.img.getContent()), 
        this.infoImg && this.infoImg.getContent().parent && this.infoImg.getContent().parent.removeChild(this.infoImg.getContent()), 
        this.img = new SimpleSprite(src), this.infoImg = new SimpleSprite(src), this.container.addChild(this.img.getContent()), 
        this.img.getContent().scale.x = 1, this.img.getContent().scale.y = 1, this.img.getContent().anchor.x = .5, 
        this.img.getContent().anchor.y = .5;
        var posCorrection = {
            x: 0,
            y: 10
        };
        this.img.setPosition(this.width / 2 + posCorrection.x, this.height / 2 + posCorrection.y);
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
            font: "bold 30px Arial",
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
        this._super("_dist/img/cubo.png");
    },
    update: function() {
        this._super(), this.getBounds();
    },
    preKill: function() {
        this._super(), this.debugGraphic && this.debugGraphic.parent && this.debugGraphic.parent.removeChild(this.debugGraphic);
    },
    pointDistance: function(x, y, x0, y0) {
        return Math.sqrt((x -= x0) * x + (y -= y0) * y);
    }
}), Fairy = Entity.extend({
    init: function(player) {
        this._super(), this.updateable = !0, this.collidable = !1, this.player = player, 
        this.srcImg = "_dist/img/fairy/f1.png", this.type = "fairy", this.width = 25, this.height = 25, 
        this.bounceAcc = 0, this.bounceAccMax = 30, this.velYHelper = 1, this.fairyContainer = new PIXI.DisplayObjectContainer(), 
        this.range = 0, this.fairyAngle = 0, this.noDepth = !0;
    },
    getBounds: function() {
        return this.bounds = {
            x: this.getPosition().x - this.width * this.fairySprite.anchor.x,
            y: this.getPosition().y - this.height * this.fairySprite.anchor.y,
            w: this.width,
            h: this.height
        }, this.bounds;
    },
    build: function() {
        this.texture = PIXI.Texture.fromImage(this.srcImg), this.fairySprite = new PIXI.Sprite(this.texture), 
        this.fairyContainer.addChild(this.fairySprite);
        this.fairySprite.anchor.x = .5, this.fairySprite.anchor.y = .5, this.texture;
    },
    getContent: function() {
        return this.fairyContainer;
    },
    getPosition: function() {
        return this.fairyContainer.position;
    },
    setPosition: function(x, y) {
        this.fairyContainer.position.x = x, this.fairyContainer.position.y = y;
    },
    forceBackPlayer: function() {
        console.log("force back");
    },
    forceFrontPlayer: function() {
        console.log("force front"), this.player.layer && this.player.layer.getContent().swapChildren(this.fairyContainer, this.player.getContent());
    },
    update: function() {
        var angle = null;
        if (this.fairyContainer.position.x += this.velocity.x, this.fairyContainer.position.y += this.velocity.y, 
        this.fairySprite.position.x += this.virtualVelocity.x, this.fairySprite.position.y += this.virtualVelocity.y, 
        this.player && this.player.centerPosition) {
            var playerPos = {
                x: this.player.getPosition().x - this.player.centerPosition.x - 10,
                y: this.player.getPosition().y + this.player.centerPosition.y
            }, dist = pointDistance(playerPos.x, playerPos.y, this.fairyContainer.position.x, this.fairyContainer.position.y);
            dist > 20 ? (angle = Math.atan2(playerPos.y - this.fairyContainer.position.y, playerPos.x - this.fairyContainer.position.x), 
            angle = 180 * angle / Math.PI, angle += 270, angle = angle / 180 * Math.PI * -1, 
            this.velocity.x = Math.sin(angle) * this.player.defaultVelocity * dist / 30, this.velocity.y = Math.cos(angle) * this.player.defaultVelocity * dist / 30) : (this.velocity.x *= .9, 
            this.velocity.y *= .9, Math.abs(this.velocity.x < .05) && (this.velocity.x = 0), 
            Math.abs(this.velocity.y < .05) && (this.velocity.y = 0)), this.fairyAngle += 2.8;
            var xAcc = 2 * Math.sin(this.fairyAngle / 180 * Math.PI), yAcc = 2.1 * Math.cos(this.fairyAngle / 180 * Math.PI) * (this.bounceAcc / this.bounceAccMax) * 2;
            this.virtualVelocity.x = xAcc, this.virtualVelocity.y = yAcc, this.bounceAcc += this.velYHelper, 
            this.bounceAcc <= 0 ? this.velYHelper *= -1 : this.bounceAcc >= this.bounceAccMax && (this.velYHelper *= -1);
        }
    }
}), Fire = Entity.extend({
    init: function(vel) {
        this._super(!0), this.updateable = !1, this.deading = !1, this.range = 20, this.width = 1, 
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
        this._super(), this.timeLive--, this.timeLive <= 0 && this.preKill(), this.getContent() && (this.width = .3 * this.getContent().width, 
        this.height = .3 * this.getContent().height), this.getBounds(), this.range = this.width / .3;
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
    touch: function(collection) {
        collection.object && "environment" === collection.object.type && collection.object.fireCollide(), 
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
}), Obstacle = Entity.extend({
    init: function() {
        this._super(), this.updateable = !0, this.collidable = !0, this.arrayObstacles = Math.random() < .5 ? arrayThrees[0] : arrayRocks[0], 
        this.srcImg = this.arrayObstacles[Math.floor(Math.random() * this.arrayObstacles.length)], 
        this.type = "environment", this.width = APP.nTileSize / 1.8, this.height = APP.nTileSize / 2.5, 
        this.debugGraphic = new PIXI.Graphics(), this.debugGraphic.beginFill(16724736), 
        this.debugGraphic.lineStyle(1, 16767232, 1), this.debugGraphic.endFill(), this.range = 0, 
        this.life = 3, this.seed = 0, this.currentMadness = APP.getMadness(), this.state = 0;
    },
    preKill: function() {
        var self = this;
        Math.random() < .2 && APP.getGame().addBag({
            x: self.getPosition().x,
            y: self.getPosition().y - 20
        }, APP.itemList[0]), TweenLite.to(this.getContent(), .3, {
            delay: .2,
            alpha: 0
        }), TweenLite.to(this.getContent().scale, .4, {
            x: .85,
            y: .85,
            ease: "easeInBack",
            onComplete: function() {
                self.kill = !0;
            }
        });
    },
    getBounds: function() {
        return this.bounds = {
            x: this.getPosition().x - this.width * this.sprite.anchor.x,
            y: this.getPosition().y - this.height * this.sprite.anchor.y,
            w: this.width,
            h: this.height
        }, this.bounds;
    },
    fireCollide: function() {
        this.life <= 0 || (this.life--, APP.updateMadness(.01), this.getContent().scale.x = .95, 
        this.getContent().scale.y = .95, TweenLite.to(this.getContent().scale, .5, {
            x: 1,
            y: 1,
            ease: "easeOutElastic"
        }), this.life <= 0 && (this.collidable = !1, this.updateable = !1, this.preKill()));
    },
    build: function() {
        this._super(this.srcImg);
        this.sprite.anchor.x = .5, this.sprite.anchor.y = 1, this.getContent().type = this.type;
    },
    updateGraphic: function() {
        if (-1 !== this.state) {
            this.getContent().tint = 16777215;
            var self = this;
            -1 !== self.state && (self.texture.destroy(), self.sprite.setTexture(PIXI.Texture.fromImage("_dist/img/flora/florest1/treeEvil.png")), 
            self.getContent().scale.x = .95, self.getContent().scale.y = .95, TweenLite.to(self.getContent().scale, .5, {
                x: 1,
                y: 1,
                ease: "easeOutElastic"
            }), self.state = -1);
        }
    },
    update: function() {
        if (this._super(), this.currentMadness !== APP.getMadness()) {
            this.currentMadness = APP.getMadness();
            var dist = pointDistance(this.currentMadness, 0, 1, 0);
            dist > this.seed && this.updateGraphic();
        }
    },
    respaw: function() {
        var rndPos = {
            x: 142 * Math.floor(12 * Math.random() * 142 / 142) + 104,
            y: 142 * Math.floor(7 * Math.random() * 142 / 142) + 177 + 142
        };
        this.pointDistance(rndPos.x, rndPos.y, windowWidth / 2, windowHeight / 2) < 200 && this.respaw(), 
        this.setPosition(rndPos.x, rndPos.y), this.collidable = !0;
    }
}), Player = SpritesheetEntity.extend({
    init: function(model) {
        this._super(!0), this.updateable = !1, this.deading = !1, this.collidable = !0, 
        this.range = 10, this.width = .8 * APP.tileSize.x, this.height = .8 * APP.tileSize.y, 
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
        this.fireSpeed = this.fireModel.fireSpeed, this.fireSpeed < 1.1 * this.defaultVelocity && (this.fireSpeed = 1.1 * this.defaultVelocity), 
        this.fireStepLive = this.fireModel.fireStepLive;
    },
    levelUp: function() {
        var pop = new PopUpText("white");
        pop.setText("LEVEL UP"), APP.getEffectsContainer().addChild(pop.getContent()), pop.setPosition(this.getPosition().x + this.centerPosition.x - 20, this.getPosition().y - 5 + 10 * Math.random() - this.height / 2 - 20), 
        pop.initMotion(-15 - 10 * Math.random(), 1.5), this.getTexture().tint = 16711680, 
        this.updateAtt();
    },
    updateXP: function(xp) {
        var pop = new PopUpText("green");
        pop.setText(Math.floor(xp) + " XP"), APP.getEffectsContainer().addChild(pop.getContent()), 
        pop.setPosition(this.getPosition().x + this.centerPosition.x - 10, this.getPosition().y - 5 + 10 * Math.random() - this.height / 2), 
        pop.initMotion(-10 - 10 * Math.random(), 1), this.getTexture().tint = 16711680;
    },
    build: function() {
        this.range = this.playerModel.graphicsData.range;
        var motionIdleDown = this.getFramesByRange(this.playerModel.graphicsData.sourceLabel, this.playerModel.graphicsData.frames.idleDownInit, this.playerModel.graphicsData.frames.idleDownEnd), animationIdleDown = new SpritesheetAnimation();
        animationIdleDown.build("idleDown", motionIdleDown, 1, !0, null);
        var motionIdleUp = this.getFramesByRange(this.playerModel.graphicsData.sourceLabel, this.playerModel.graphicsData.frames.idleUpInit, this.playerModel.graphicsData.frames.idleUpEnd), animationIdleUp = new SpritesheetAnimation();
        animationIdleUp.build("idleUp", motionIdleUp, 1, !0, null);
        var motionIdleSide = this.getFramesByRange(this.playerModel.graphicsData.sourceLabel, this.playerModel.graphicsData.frames.idleSideInit, this.playerModel.graphicsData.frames.idleSideEnd), animationIdleSide = new SpritesheetAnimation();
        animationIdleSide.build("idleSide", motionIdleSide, 1, !0, null);
        var motionDown = this.getFramesByRange(this.playerModel.graphicsData.sourceLabel, this.playerModel.graphicsData.frames.walkDownInit, this.playerModel.graphicsData.frames.walkDownEnd), animationDown = new SpritesheetAnimation();
        animationDown.build("down", motionDown, 1, !0, null);
        var motionUp = this.getFramesByRange(this.playerModel.graphicsData.sourceLabel, this.playerModel.graphicsData.frames.walkUpInit, this.playerModel.graphicsData.frames.walkUpEnd), animationUp = new SpritesheetAnimation();
        animationUp.build("up", motionUp, 1, !0, null);
        var motionSide = this.getFramesByRange(this.playerModel.graphicsData.sourceLabel, this.playerModel.graphicsData.frames.walkSideInit, this.playerModel.graphicsData.frames.walkSideEnd), animationSide = new SpritesheetAnimation();
        animationSide.build("side", motionSide, 1, !0, null), this.spritesheet = new Spritesheet(), 
        this.spritesheet.addAnimation(animationIdleDown), this.spritesheet.addAnimation(animationIdleUp), 
        this.spritesheet.addAnimation(animationDown), this.spritesheet.addAnimation(animationUp), 
        this.spritesheet.addAnimation(animationSide), this.spritesheet.addAnimation(animationIdleSide), 
        this.spritesheet.play("idleDown"), this.reset(), this.counter = 0, this.lakeMask = new PIXI.Graphics(), 
        this.lakeMask.beginFill(16724736), this.lakeMask.drawRect(0, -40, 50, 50), this.lakeMask.endFill(), 
        this.lakeMask.alpha = 0;
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
    updatePlayerVel: function(vecPositions) {
        if (this && vecPositions) {
            var hasAxysY = !1, hasAxysX = !1;
            0 === vecPositions.length && (this.virtualVelocity.x = 0, this.virtualVelocity.y = 0);
            for (var i = vecPositions.length - 1; i >= 0; i--) "up" === vecPositions[i] ? (this.virtualVelocity.y = -this.defaultVelocity, 
            hasAxysY = !0) : "down" === vecPositions[i] && (this.virtualVelocity.y = this.defaultVelocity, 
            hasAxysY = !0), "left" === vecPositions[i] ? (this.virtualVelocity.x = -this.defaultVelocity, 
            hasAxysX = !0) : "right" === vecPositions[i] && (this.virtualVelocity.x = this.defaultVelocity, 
            hasAxysX = !0);
            0 !== this.virtualVelocity.y && 0 !== this.virtualVelocity.x && (this.virtualVelocity.y /= 1.5, 
            this.virtualVelocity.x /= 1.5), hasAxysY || (this.virtualVelocity.y = 0), hasAxysX || (this.virtualVelocity.x = 0);
        }
    },
    update: function() {
        this.hasteAcum > 0 ? this.hasteAcum-- : this.defaultVelocity = this.playerModel.velocity, 
        !this.isTouch && this.returnCollider <= 0 && (this.velocity = this.virtualVelocity), 
        this.mouseAngle = Math.atan2(windowHeight / 2 - APP.getMousePos().y + this.centerPosition.y, windowWidth / 2 - APP.getMousePos().x + this.centerPosition.x);
        var motion = "side";
        this.mouseAngle = this.mouseAngle / Math.PI * 180 + 180, this.mouseAngle > 45 && this.mouseAngle < 135 ? motion = "down" : this.mouseAngle > 225 && this.mouseAngle < 315 && (motion = "up"), 
        "side" === motion && (this.spritesheet.scale.x = APP.getMousePos().x < windowWidth / 2 + this.centerPosition.x ? 1 : -1), 
        this.velocity.y + this.velocity.x !== 0 ? this.spritesheet.play(motion) : "side" === motion ? this.spritesheet.play("idleSide") : "up" === motion ? this.spritesheet.play("idleUp") : "down" === motion && this.spritesheet.play("idleDown"), 
        this.returnCollider > 0 && this.returnCollider--, this.deading && this.setVelocity(0, 0), 
        this.getTexture() && this.playerModel.graphicsData.positionSprite && (this.playerModel.graphicsData.positionSprite.x && (this.getContent().position.x = this.playerModel.graphicsData.positionSprite.x), 
        this.playerModel.graphicsData.positionSprite.y && (this.getContent().position.y = this.playerModel.graphicsData.positionSprite.y)), 
        this.getContent() && this.getContent().parent && this.lakeMask && !this.lakeMask.parent ? this.getContent().parent.addChild(this.lakeMask) : this.lakeMask && (this.lakeMask.position.x = this.getPosition().x, 
        this.lakeMask.position.y = this.getPosition().y), "LAKE" === APP.getPlayerTileType() ? (this.getContent().mask = this.lakeMask, 
        this.getContent().position.y = this.playerModel.graphicsData.positionSprite.y + 10, 
        this.defaultVelocity = this.playerModel.velocity / 2) : (this.getContent().mask = null, 
        this.defaultVelocity = this.playerModel.velocity), this._super();
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
            tempFire.timeLive = this.fireStepLive / 5, spellModel && (this.playerModel.spellPower = spellModel.spellPower + this.weaponModel ? this.weaponModel.magicPower : 0, 
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
        this._super(), void 0 !== this.debugGraphic && this.debugGraphic.parent && (this.debugGraphic.parent.removeChild(this.debugGraphic), 
        this.playerDead = !0);
    },
    regenHP: function(value) {
        if (value + this.playerModel.hp > this.playerModel.hpMax && (value = Math.floor(this.playerModel.hpMax - this.playerModel.hp)), 
        0 === value) return !1;
        this.playerModel.hp += value;
        var pop = new PopUpText("green");
        return pop.setText("+" + value + "HP"), APP.getEffectsContainer().addChild(pop.getContent()), 
        pop.setPosition(this.getPosition().x + this.centerPosition.x - 20, this.getPosition().y - 5 + 10 * Math.random() - this.height / 2 - 20), 
        pop.initMotion(-15 - 10 * Math.random(), .8), !0;
    },
    regenMP: function(value) {
        if (value + this.playerModel.mp > this.playerModel.mpMax && (value = Math.floor(this.playerModel.mpMax - this.playerModel.mp)), 
        0 === value) return !1;
        this.playerModel.mp += value;
        var pop = new PopUpText("blue");
        return pop.setText("+" + value + "MP"), APP.getEffectsContainer().addChild(pop.getContent()), 
        pop.setPosition(this.getPosition().x + this.centerPosition.x - 20, this.getPosition().y - 5 + 10 * Math.random() - this.height / 2 - 20), 
        pop.initMotion(-15 - 10 * Math.random(), .8), !0;
    },
    useItem: function(itemModel) {
        if ("regen HP" === itemModel.effect) return this.regenHP(itemModel.baseValue);
        if ("regen MP" === itemModel.effect) return this.regenMP(itemModel.baseValue);
        if ("haste" === itemModel.effect) {
            if (this.hasteAcum <= 0) {
                var pop = new PopUpText("white");
                return pop.setText("HASTE"), APP.getEffectsContainer().addChild(pop.getContent()), 
                pop.setPosition(this.getPosition().x + this.centerPosition.x - 20, this.getPosition().y - 5 + 10 * Math.random() - this.height / 2 - 20), 
                pop.initMotion(-15 - 10 * Math.random(), .8), this.defaultVelocity = 1.5 * this.playerModel.velocity, 
                this.hasteAcum = 200, !0;
            }
            return !1;
        }
    },
    reset: function() {
        this.deading = !1, this.setPosition(windowWidth / 2, windowHeight / 2), this.spritesheet.play("idle"), 
        this.setVelocity(0, 0), this.updateable = !0;
    },
    collide: function(arrayCollide) {
        "door" === arrayCollide[0].type && (this.endLevel = !0, this.nextNode = arrayCollide[0].node, 
        this.nextDoorSide = arrayCollide[0].side);
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
}), Bag = Entity.extend({
    init: function(model, player) {
        this._super(!0), this.updateable = !0, this.colidable = !1, this.range = 50, this.type = "bag", 
        this.model = model, this.player = player, this.imgSource = "_dist/img/HUD/bags/bag1.png", 
        this.isShow = !1;
    },
    update: function() {},
    build: function() {
        this._super(this.imgSource), this.updateable = !0, this.collidable = !0, this.getContent().scale.x = 0, 
        this.getContent().scale.y = 0, TweenLite.to(this.getContent().scale, .5, {
            x: 1,
            y: 1,
            ease: "easeOutElastic"
        });
    }
}), Enemy = SpritesheetEntity.extend({
    init: function(player, model) {
        this._super(!0), this.updateable = !1, this.deading = !1, this.range = APP.tileSize.x / 2, 
        this.width = .9 * APP.tileSize.x, this.height = .9 * APP.tileSize.y, this.type = "enemy", 
        this.node = null, this.boundsCollision = !0, this.player = player, this.monsterModel = model, 
        this.initialPosition = {
            x: 0,
            y: 0
        };
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
        this.defaultVelocity = this.monsterModel.speed / 15, this.defaultVelocity < 4 && (this.defaultVelocity = 4), 
        this.hp = this.monsterModel.hp, this.behaviour = new DefaultBehaviour(this, this.player);
        var motionArray = this.getFramesByRange(this.monsterModel.sourceLabel, this.monsterModel.frames.idleInit, this.monsterModel.frames.idleEnd), animationIdle = new SpritesheetAnimation();
        animationIdle.build("idle", motionArray, 1, !0, null), this.spritesheet = new Spritesheet(), 
        this.spritesheet.addAnimation(animationIdle), this.spritesheet.play("idle"), this.centerPosition = {
            x: this.width / 2,
            y: this.height / 2
        }, this.updateable = !0, this.collidable = !0;
    },
    update: function() {
        this.pointDistance(this.getPosition().x, this.getPosition().y, this.player.getPosition().x, this.player.getPosition().y) < 1.5 * windowWidth && (this.behaviour && this.behaviour.update(), 
        this.isTouch || (this.velocity = this.virtualVelocity), this._super(), this.getBounds(), 
        this.getTexture() && (this.getContent().position.x = 20, this.range = this.getTexture().width / 2));
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
}), StaticEnemy = Entity.extend({
    init: function(player, model) {
        this._super(!0), this.updateable = !1, this.deading = !1, this.range = APP.tileSize.x / 2, 
        this.width = .9 * APP.tileSize.x, this.height = .9 * APP.tileSize.y, this.type = "enemy", 
        this.node = null, this.boundsCollision = !0, this.player = player, this.monsterModel = model, 
        this.initialPosition = {
            x: 0,
            y: 0
        };
    },
    hurt: function(demage, type) {
        var trueDemage = this.monsterModel.getHurt(demage, type);
        this.hp -= trueDemage, console.log(this.hp);
        var pop = new PopUpText("red");
        if (pop.setText(Math.floor(trueDemage)), APP.getEffectsContainer().addChild(pop.getContent()), 
        pop.setPosition(this.getPosition().x - 10 + 20 * Math.random(), this.getPosition().y - 5 + 10 * Math.random() - this.height / 2), 
        pop.initMotion(-10 - 10 * Math.random(), .5), this.hp <= 0) {
            this.preKill();
            var trueXP = this.monsterModel.xp + .15 * (this.monsterModel.level - this.player.playerModel.level) * this.monsterModel.xp + 1;
            this.player.playerModel.updateXp(trueXP);
        }
    },
    build: function() {
        this._super(this.monsterModel.srcImg), this.defaultVelocity = this.monsterModel.speed / 15, 
        this.defaultVelocity < 4 && (this.defaultVelocity = 4), this.hp = this.monsterModel.hp, 
        this.behaviour = new DefaultBehaviour(this, this.player);
        this.updateable = !0, this.collidable = !0;
    },
    update: function() {
        this.pointDistance(this.getPosition().x, this.getPosition().y, this.player.getPosition().x, this.player.getPosition().y) < 1.5 * windowWidth && (this.behaviour && this.behaviour.update(), 
        this.isTouch || (this.velocity = this.virtualVelocity), this._super(), this.getBounds());
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
        this.player = player, this.entity = entity, this.fireFreq = entity.monsterModel.fire.fireFreq / 2, 
        this.maxFireFreq = entity.monsterModel.fire.fireFreq, this.fireAcum = 0, this.walkAccum = 0, 
        this.fireTimeLive = 50, this.velocity = entity.defaultVelocity, this.maxWalkAccum = 5 * this.velocity, 
        this.fireSpeed = 1.5 * this.velocity, this.maxChilds = 5, this.bornChildAccum = 100, 
        entity.monsterModel.config.spawner && (this.childModel = APP.getMonsterByName(entity.monsterModel.config.spawner));
    },
    update: function() {
        if (this.childModel && this.maxChilds > 0 && (this.bornChildAccum--, this.bornChildAccum < 0)) {
            this.bornChildAccum = 100, this.maxChilds--;
            var tempMonster = null;
            tempMonster = "STATIC" === this.childModel.sourceLabel ? new StaticEnemy(this.player, this.childModel.clone()) : new Enemy(this.player, this.childModel.clone()), 
            tempMonster.build(), tempMonster.setPosition(this.entity.getPosition().x, this.entity.getPosition().y), 
            this.entity.layer.addChild(tempMonster);
        }
        this.walkAccum--, this.walkAccum < 0 && (this.entity.setVelocity(Math.sin(360 * Math.random() / 180 * Math.PI) * this.velocity * .8, Math.cos(360 * Math.random() / 180 * Math.PI) * this.velocity * .8), 
        this.walkAccum = this.maxWalkAccum), this.fireFreq--, this.fireFreq < 0 && pointDistance(this.entity.getPosition().x, this.entity.getPosition().y, this.player.getPosition().x, this.player.getPosition().y) < this.fireTimeLive * this.fireSpeed * 2 && (this.shoot(), 
        this.fireFreq = this.maxFireFreq);
    },
    shoot: function() {
        var angle = Math.atan2(this.entity.getPosition().y + this.entity.centerPosition.y - this.player.getPosition().y, this.entity.getPosition().x + this.entity.centerPosition.x - this.player.getPosition().x);
        angle = 180 * angle / Math.PI * -1, angle += 270, angle = angle / 180 * Math.PI;
        for (var monsterModel = this.entity.monsterModel, numFires = monsterModel.fire.quant, tempFireSpeed = monsterModel.fire.speed, pair = 1, odd = 1, tempAcc = 0, tempAngle = angle, angleAcc = "arround" === monsterModel.fire.mode ? 360 : 90, i = 0; numFires > i; i++) {
            i > 0 && (i % 2 === 0 ? (tempAcc = pair, pair++) : (tempAcc = -odd, odd++), tempAngle = angle + tempAcc * (angleAcc / numFires) * Math.PI / 180);
            var tempFire = new Fire({
                x: tempFireSpeed * Math.sin(tempAngle),
                y: tempFireSpeed * Math.cos(tempAngle)
            });
            tempFire.timeLive = monsterModel.fire.lifeTime, tempFire.power = monsterModel.getDemage(monsterModel.attackType), 
            monsterModel.fire.srcImg && (tempFire.imgSource = monsterModel.fire.srcImg), tempFire.build(), 
            tempFire.target = "player", tempFire.setPosition(this.entity.getPosition().x + this.entity.centerPosition.x, this.entity.getPosition().y + this.entity.centerPosition.y), 
            this.entity.layer.addChild(tempFire), tempFire.getContent().rotation = -tempAngle + 180 * Math.PI / 180;
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
        this.price = price, this.icoImg = icoImg, this.type = "armor", this.type2 = "equip";
    }
}), FireModel = Class.extend({
    init: function() {
        this.fireSpeed = 12, this.fireStepLive = 65;
    },
    update: function() {}
}), ItemModel = Class.extend({
    init: function(name, effect, baseValue, price, icoImg, quant) {
        this.name = name, this.label = name, this.effect = effect, this.baseValue = baseValue, 
        this.price = price, this.icoImg = icoImg, this.quant = quant ? quant : 1, this.type = "item";
    },
    clone: function() {
        return new ItemModel(this.name, this.effect, this.baseValue, this.price, this.icoImg, this.quant);
    }
}), MonsterModel = Class.extend({
    init: function(name, stats, fire, graphicsData, config) {
        this.name = name, this.stats = stats, this.fire = fire, this.graphicsData = graphicsData, 
        this.config = config, this.initiallevel = stats.level, this.initialhp = stats.hp, 
        this.initialstamina = stats.stamina, this.initialspeed = stats.speed, this.initialmagicPower = stats.magicPower, 
        this.initialbattlePower = stats.battlePower, this.initialdefense = stats.defense, 
        this.initialmagicDefense = stats.magicDefense, this.initialxp = stats.xp, this.srcImg = graphicsData.srcImg, 
        this.srcJson = graphicsData.srcJson, this.sourceLabel = graphicsData.sourceLabel, 
        this.frames = graphicsData.frames, this.level = stats.level, this.hpMax = stats.hp, 
        this.speed = stats.speed, this.magicPower = stats.magicPower, this.battlePower = stats.battlePower, 
        this.defense = stats.defense, this.magicDefense = stats.magicDefense, this.stamina = stats.stamina, 
        this.critialChance = 0, this.speedStatus = "normal", this.fire.type ? this.attackType = this.fire.type : (this.attackType = "physical", 
        stats.magicPower > stats.battlePower && (this.attackType = "magical")), this.xp = stats.xp > 0 ? stats.xp : 100, 
        this.spellPower = 9, this.speedModifier = .005, this.magicPowerModifier = .004, 
        this.battlePowerModifier = .005, this.defenseModifier = .004, this.magicDefenseModifier = .004, 
        this.baseHPModifier = 1.62, this.staminaModifier = .008, this.updateLevel(stats.level);
    },
    clone: function() {
        return new MonsterModel(this.name, this.stats, this.fire, this.graphicsData, this.config);
    },
    updateLevel: function(level) {
        this.level = level, this.speed += level * ((this.speed * this.speed + this.speed + 3) / 4) * this.speedModifier, 
        this.magicPower += level * ((this.magicPower * this.magicPower + this.magicPower + 3) / 4) * this.magicPowerModifier, 
        this.battlePower += level * ((this.battlePower * this.battlePower + this.battlePower + 3) / 4) * this.battlePowerModifier, 
        this.defense += level * ((this.defense * this.defense + this.defense + 3) / 4) * this.defenseModifier, 
        this.magicDefense += level * ((this.magicDefense * this.magicDefense + this.magicDefense + 3) / 4) * this.magicDefenseModifier, 
        this.stamina += (this.stamina * this.stamina + this.stamina + 3) / 4 * this.staminaModifier, 
        this.attack = this.battlePower, this.speed > 255 && (this.speed = 255), this.stamina > 255 && (this.stamina = 255), 
        this.magicPower > 255 && (this.magicPower = 255), this.battlePower > 255 && (this.battlePower = 255), 
        this.defense > 255 && (this.defense = 255), this.attack > 255 && (this.attack = 255), 
        this.magicDefense > 255 && (this.magicDefense = 255), this.baseHP = level * (20 / this.baseHPModifier), 
        this.hpMax += this.baseHP * (this.stamina + 32) / 32 * (level / 2), this.hp = this.hpMax, 
        this.velocity = 8 - (255 - this.speed) / 25 + 5, this.velocity >= 10 && (this.velocity = 10), 
        this.velocity <= 3 && (this.velocity = 3);
        var curveAcentValue = .15;
        this.xp += Math.floor((level * (level / 3) + level + 3) / 5 * this.xp * level * curveAcentValue);
    },
    getDemage: function(type) {
        var damageMultiplier = 0, demage = 0;
        return "physical" === type ? demage = this.battlePower * (this.level / 5) + this.level * this.attack * (this.level / 20) * 15 / 256 * 3 / 2 : "magical" === type && (demage = this.spellPower * this.level + this.level * (3 * this.magicPower / 2) * this.spellPower / 32), 
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
    init: function(name, label, stats, modifiers, graphicsData, config) {
        this.level = 1, this.name = name, this.label = label, this.stats = stats, this.modifiers = modifiers, 
        this.graphicsData = graphicsData, this.confi = config, this.playerClass = name ? name : "warrior", 
        this.vigor = this.stats.vigor, this.speed = this.stats.speed, this.stamina = this.stats.stamina, 
        this.magicPower = this.stats.magicPower, this.battlePower = this.stats.battlePower, 
        this.defense = this.stats.defense, this.magicDefense = this.stats.magicDefense, 
        this.baseHPModifier = this.modifiers.baseHPModifier, this.baseMPModifier = this.modifiers.baseMPModifier, 
        this.vigorModifier = this.modifiers.vigorModifier, this.speedModifier = this.modifiers.speedModifier, 
        this.staminaModifier = this.modifiers.staminaModifier, this.magicPowerModifier = this.modifiers.magicPowerModifier, 
        this.battlePowerModifier = this.modifiers.battlePowerModifier, this.defenseModifier = this.modifiers.defenseModifier, 
        this.magicDefenseModifier = this.modifiers.magicDefenseModifier, this.baseHP = this.level * (20 / this.baseHPModifier), 
        this.spellPower = 20, this.weaponPower = 30, this.defenseArmor = 0, this.magicDefenseArmor = 0, 
        this.hpMax = this.baseHP * (this.stamina + 32) / 32, this.hp = this.hpMax, this.baseMP = this.level * (20 / this.baseMPModifier), 
        this.mpMax = this.baseMP * (this.magicPower + 32) / 32, this.mp = this.mpMax, this.critialChance = 0, 
        this.speedStatus = "normal", this.vigor2 = 2 * this.vigor, this.vigor >= 128 && (this.vigor2 = 255), 
        this.attack = this.battlePower + this.vigor2, this.xp = 0, this.velocity = 8 - (255 - this.speed) / 35 + 2, 
        this.velocity /= 3, this.fireFreq = (255 - this.speed) / (.4 * this.speed) * 1.3, 
        this.entity = null, this.csvStr = "level,hp,mp,vigor,speed,stamina,magicPower,battlePower,defense,attack,magicDefense,velocity,fireFreq,demagePhysical,demageMagical\n", 
        this.csvStr += this.level + "," + Math.floor(this.hpMax) + "," + Math.floor(this.mpMax) + "," + Math.floor(this.vigor) + "," + Math.floor(this.speed) + "," + Math.floor(this.stamina) + "," + Math.floor(this.magicPower) + "," + Math.floor(this.battlePower) + "," + Math.floor(this.defense) + "," + Math.floor(this.attack) + "," + Math.floor(this.magicDefense) + "," + Math.floor(this.velocity) + "," + Math.floor(this.fireFreq) + "," + Math.floor(this.getDemage("physical")) + "," + Math.floor(this.getDemage("magical")) + "\n", 
        console.log("PlayerModel", this);
        var nextl = this.level, befl = this.level - 1;
        this.toNextLevel = (nextl * nextl + nextl + 3) / 4 * 20 * nextl, this.toBeforeLevel = (befl * befl + befl + 3) / 4 * 20 * befl;
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
    clone: function() {
        return new PlayerModel(this.name, this.label, this.stats, this.modifiers, this.graphicsData, this.config);
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
        this.velocity = 8 - (255 - this.speed) / 35 + 2, this.velocity /= 3, this.fireFreq = (255 - this.speed) / (.4 * this.speed) * (1.1 + 1e3 * this.speedModifier), 
        this.fireFreq <= 4 && (this.fireFreq = 4), this.fireFreq >= 25 && (this.fireFreq = 25), 
        this.velocity >= 9 && (this.velocity = 9), this.velocity <= 2 && (this.velocity = 2), 
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
        this.price = price, this.icoImg = icoImg, this.type = "relic", this.type2 = "equip";
    }
}), SpellModel = Class.extend({
    init: function(level, name, mp, spellPower, icoImg, srcImg, isMultiple) {
        this.level = level, this.name = name, this.label = name, this.mp = mp, this.spellPower = spellPower, 
        this.icoImg = icoImg, this.srcImg = srcImg, this.isMultiple = isMultiple, this.type = "spell";
    }
}), WeaponModel = Class.extend({
    init: function(name, battlePower, magicPower, hitRate, price, icoImg, srcImg) {
        this.name = name, this.label = name, this.battlePower = battlePower, this.magicPower = magicPower, 
        this.hitRate = hitRate, this.price = price, this.srcImg = srcImg, this.icoImg = icoImg, 
        this.type = "weapon", this.type2 = "equip";
    }
}), defaultColors = {
    OCEAN: 4473978,
    COAST: 3355482,
    LAKESHORE: 2250120,
    LAKE: 3368601,
    RIVER: 2250120,
    MARSH: 3106406,
    ICE: 10092543,
    BEACH: 10522743,
    ISLAND1: 4465169,
    ISLAND2: 5583650,
    ISLAND3: 6702131,
    BRIDGE: 6842464,
    LAVA: 13382451,
    SNOW: 16777215,
    TUNDRA: 12303274,
    BARE: 8947848,
    SCORCHED: 5592405,
    TAIGA: 10070647,
    SHRUBLAND: 8952183,
    TEMPERATE_DESERT: 13226651,
    TEMPERATE_RAIN_FOREST: 4491349,
    TEMPERATE_DECIDUOUS_FOREST: 6788185,
    GRASSLAND: 8956501,
    SUBTROPICAL_DESERT: 13810059,
    TROPICAL_RAIN_FOREST: 3372885,
    TROPICAL_SEASONAL_FOREST: 5609796
}, displayColorsOld = {
    OCEAN: 4473978,
    COAST: 3355482,
    LAKESHORE: 2250120,
    LAKE: 3368601,
    MARSH: 3106406,
    ICE: 10092543,
    RIVER: 2250120,
    BEACH: 5219097,
    BASE_GRASS: 5219097,
    ISLAND1: 8343327,
    ISLAND2: 6699796,
    ISLAND3: 4663569,
    BRIDGE: 6842464,
    LAVA: 13382451,
    SNOW: 4034057,
    TUNDRA: 4034057,
    BARE: 4034057,
    SCORCHED: 4034057,
    TAIGA: 4034057,
    STANDARD1: 4034057,
    TEMPERATE_RAIN_FOREST: 3234582,
    TEMPERATE_DECIDUOUS_FOREST: 3234582,
    TROPICAL_RAIN_FOREST: 3234582,
    TROPICAL_SEASONAL_FOREST: 3234582,
    STANDARD2: 3234582,
    SHRUBLAND: 5219097,
    TEMPERATE_DESERT: 5219097,
    GRASSLAND: 5219097,
    SUBTROPICAL_DESERT: 5219097,
    STANDARD3: 5219097
}, displayColors = {
    OCEAN: 4473978,
    COAST: 3355482,
    LAKESHORE: 2250120,
    LAKE: 3368601,
    MARSH: 3106406,
    ICE: 10092543,
    RIVER: 2250120,
    BEACH: 3367737,
    BASE_GRASS: 3367737,
    ISLAND3: 12688496,
    ISLAND2: 10186317,
    ISLAND1: 4205084,
    BRIDGE: 6842464,
    LAVA: 13382451,
    ROAD1: 13382451,
    SNOW: 4034057,
    TUNDRA: 4034057,
    BARE: 4034057,
    SCORCHED: 4034057,
    TAIGA: 4034057,
    STANDARD1: 4755034,
    TEMPERATE_RAIN_FOREST: 3234582,
    TEMPERATE_DECIDUOUS_FOREST: 3234582,
    TROPICAL_RAIN_FOREST: 3234582,
    TROPICAL_SEASONAL_FOREST: 3234582,
    STANDARD2: 4028231,
    SHRUBLAND: 5219097,
    TEMPERATE_DESERT: 5219097,
    GRASSLAND: 5219097,
    SUBTROPICAL_DESERT: 5219097,
    STANDARD3: 4755034
}, arrayThrees = [ [ "_dist/img/flora/florest1/tree1.png", "_dist/img/flora/florest1/tree2.png", "_dist/img/flora/florest1/tree3.png", "_dist/img/flora/florest1/tree4.png" ], [ "_dist/img/flora/florest1/treeEvil.png" ] ], arrayRocks = [ [ "_dist/img/flora/florest1/rock1.png", "_dist/img/flora/florest1/rock2.png", "_dist/img/flora/florest1/rock3.png" ] ], tilesGraphics = {
    TOP_LEFT: "_dist/img/levels/leftTop.png",
    TOP_RIGHT: "_dist/img/levels/rightTop.png",
    BOTTOM_LEFT: "_dist/img/levels/leftBottom.png",
    BOTTOM_RIGHT: "_dist/img/levels/rightBottom.png",
    CENTER: "_dist/img/levels/tile1.png",
    BASE1: "_dist/img/levels/base1.png"
}, LevelGenerator = Class.extend({
    init: function(parent) {
        this.parent = parent, this.tileDesigner = new TileDesigner(), this.nonPlaceObstaclesBiomes = [ "OCEAN", "BEACH", "LAKE", "ISLAND1", "ISLAND2", "ISLAND3", "ROAD1" ], 
        this.nullTiles = [ "NULL", "OCEAN" ];
    },
    createHordes: function() {
        for (var tempMonster = null, monsters = [], i = 0; 10 > i; i++) {
            var id = Math.floor(this.parent.currentNode.getNextFloat() * APP.monsterList.length);
            tempMonster = "STATIC" === APP.monsterList[id].sourceLabel ? new StaticEnemy(this.parent.player, APP.monsterList[id].clone()) : new Enemy(this.parent.player, APP.monsterList[id].clone());
            var rndAngle = 360 * this.parent.currentNode.getNextFloat() / 180 * Math.PI;
            tempMonster.initialPosition = {
                x: this.parent.levelBounds.x / 2 + 300 + 200 * i * Math.sin(rndAngle),
                y: this.parent.levelBounds.y / 2 + 300 + 200 * i * Math.cos(rndAngle)
            }, monsters.push(tempMonster);
        }
        return monsters;
    },
    isNullTiles: function(biome) {
        for (var i = this.nullTiles.length - 1; i >= 0; i--) if (biome === this.nullTiles[i]) return !1;
        return !0;
    },
    possibleBiomesToObstacles: function(biome) {
        for (var i = this.nonPlaceObstaclesBiomes.length - 1; i >= 0; i--) if (biome === this.nonPlaceObstaclesBiomes[i]) return !1;
        return !0;
    },
    putObstacles: function() {
        for (var accBounds = 2, yAcc = 1e-5, i = this.parent.currentNode.mapData.length - accBounds; i >= accBounds; i--) for (var j = this.parent.currentNode.mapData[i].length - accBounds; j >= accBounds; j--) if (this.parent.currentNode.getNextFloat() < .1 && void 0 !== this.parent.currentNode.mapData[i][j] && void 0 !== this.parent.currentNode.mapData[i][j].biome && this.possibleBiomesToObstacles(this.parent.currentNode.mapData[i][j].biome) && this.possibleBiomesToObstacles(this.parent.currentNode.mapDataLayer1[i][j].biome) && this.possibleBiomesToObstacles(this.parent.currentNode.mapDataLayer2[i][j].biome)) {
            var obs = new Obstacle();
            obs.build(), obs.seed = 1.1 * this.parent.currentNode.getNextFloat(), obs.setPosition(i * APP.nTileSize, (j + 1) * APP.nTileSize + yAcc), 
            yAcc += 1e-4, this.parent.entityLayer.addChild(obs);
        }
    },
    createRoom: function() {
        var i = 0;
        this.distanceToShowMap = 9;
        var mapMaker = null;
        mapMaker = voronoiMap.islandShape.makePerlin(this.parent.currentNode.getNextFloat(), .5), 
        this.parent.currentNode.backMapData = [], this.parent.currentNode.mapData = [], 
        this.parent.currentNode.mapDataLayer1 = [], this.parent.currentNode.mapDataLayer2 = [], 
        this.parent.currentNode.mapDataLayer3 = [], this.parent.currentNode.backPlacedTiles = [], 
        this.parent.currentNode.placedTiles = [], this.parent.currentNode.placedTilesLayer1 = [], 
        this.parent.currentNode.placedTilesLayer2 = [], this.parent.currentNode.placedTilesLayer3 = [];
        var tempBackDataLine = [], tempDataLine = [], tempDataLineLayer1 = [], tempDataLineLayer2 = [], tempDataLineLayer3 = [], tempBackDataPlacedLine = [], tempDataPlacedLine = [], tempDataPlacedLineLineLayer1 = [], tempDataPlacedLineLineLayer2 = [], tempDataPlacedLineLineLayer3 = [];
        for (i = this.parent.tempSizeTiles.x - 1; i >= 0; i--) {
            tempBackDataLine = [], tempDataLine = [], tempDataLineLayer1 = [], tempDataLineLayer2 = [], 
            tempDataLineLayer3 = [], tempBackDataPlacedLine = [], tempDataPlacedLine = [], tempDataPlacedLineLineLayer1 = [], 
            tempDataPlacedLineLineLayer2 = [], tempDataPlacedLineLineLayer3 = [];
            for (var j = this.parent.tempSizeTiles.y + 5; j >= 0; j--) tempBackDataLine.push({}), 
            tempBackDataPlacedLine.push(0), tempDataLine.push({
                biome: "OCEAN",
                position: "CENTER"
            }), tempDataLineLayer1.push({
                biome: "OCEAN",
                position: "CENTER"
            }), tempDataLineLayer2.push({
                biome: "OCEAN",
                position: "CENTER"
            }), tempDataLineLayer3.push({
                biome: "OCEAN",
                position: "CENTER"
            }), tempDataPlacedLine.push(0), tempDataPlacedLineLineLayer1.push(0), tempDataPlacedLineLineLayer2.push(0), 
            tempDataPlacedLineLineLayer3.push(0);
            this.parent.currentNode.backMapData.push(tempBackDataLine), this.parent.currentNode.backPlacedTiles.push(tempBackDataPlacedLine), 
            this.parent.currentNode.mapDataLayer1.push(tempDataLineLayer1), this.parent.currentNode.mapDataLayer2.push(tempDataLineLayer2), 
            this.parent.currentNode.mapDataLayer3.push(tempDataLineLayer3), this.parent.currentNode.placedTilesLayer1.push(tempDataPlacedLineLineLayer1), 
            this.parent.currentNode.placedTilesLayer2.push(tempDataPlacedLineLineLayer2), this.parent.currentNode.placedTilesLayer3.push(tempDataPlacedLineLineLayer3), 
            this.parent.currentNode.mapData.push(tempDataLine), this.parent.currentNode.placedTiles.push(tempDataPlacedLine);
        }
        var tempMapSize = {
            width: this.parent.tempSizeTiles.x * APP.nTileSize,
            height: this.parent.tempSizeTiles.y * APP.nTileSize
        }, numberOfPoints = this.parent.tempSizeTiles.x * this.parent.tempSizeTiles.y;
        this.map = voronoiMap.map(tempMapSize), this.map.newIsland(mapMaker, this.parent.currentNode.getNextFloat()), 
        this.map.go0PlaceUniformPoints(numberOfPoints, this.parent.tempSizeTiles.x, this.parent.tempSizeTiles.y, APP.nTileSize), 
        this.map.go1BuildGraph(), this.map.assignBiomes(), this.map.go2AssignElevations(.1), 
        this.map.go3AssignMoisture(), this.map.go4DecorateMap();
        var ix = 0, jy = 0, top = {
            x: this.parent.tempSizeTiles.x / 2,
            y: this.parent.tempSizeTiles.y / 2 - 3
        }, bot = {
            x: this.parent.tempSizeTiles.x / 2,
            y: this.parent.tempSizeTiles.y / 2 + 3
        }, lef = {
            x: this.parent.tempSizeTiles.x / 2 - 3,
            y: this.parent.tempSizeTiles.y / 2
        }, rig = {
            x: this.parent.tempSizeTiles.x / 2 + 3,
            y: this.parent.tempSizeTiles.y / 2
        };
        for (i = 0; i < this.map.centers.length; i++) {
            if (ix = Math.floor(this.map.centers[i].point.y / APP.nTileSize), jy = Math.floor(this.map.centers[i].point.x / APP.nTileSize), 
            this.parent.currentNode.placedTiles[jy][ix] = null, this.parent.currentNode.placedTilesLayer1[jy][ix] = null, 
            this.parent.currentNode.placedTilesLayer2[jy][ix] = null, this.parent.currentNode.placedTilesLayer3[jy][ix] = null, 
            this.parent.currentNode.mapData[jy][ix] = "BEACH" === this.map.centers[i].biome || "OCEAN" === this.map.centers[i].biome ? {
                biome: this.map.centers[i].biome,
                tile: "CENTER"
            } : {
                biome: "BASE_GRASS",
                tile: "CENTER"
            }, "BEACH" === this.map.centers[i].biome) this.parent.currentNode.mapDataLayer1[jy][ix] = {
                biome: "OCEAN",
                tile: "CENTER"
            }; else {
                var tempBioma = "STANDARD1", tempBioma2 = this.map.centers[i].biome;
                tempBioma = "SNOW" === tempBioma2 || "TUNDRA" === tempBioma2 || "BARE" === tempBioma2 || "TAIGA" === tempBioma2 || "SCORCHED" === tempBioma2 ? "STANDARD1" : "TEMPERATE_RAIN_FOREST" === tempBioma2 || "TEMPERATE_DECIDUOUS_FOREST" === tempBioma2 || "TROPICAL_RAIN_FOREST" === tempBioma2 || "TROPICAL_SEASONAL_FOREST" === tempBioma2 ? "STANDARD2" : "SHRUBLAND" === tempBioma2 || "TEMPERATE_DESERT" === tempBioma2 || "GRASSLAND" === tempBioma2 || "SUBTROPICAL_DESERT" === tempBioma2 ? "STANDARD3" : "COAST" === tempBioma2 || "LAKESHORE" === tempBioma2 || "LAKE" === tempBioma2 || "MARSH" === tempBioma2 || "ICE" === tempBioma2 || "RIVER" === tempBioma2 ? "LAKE" : tempBioma2, 
                this.parent.currentNode.mapDataLayer1[jy][ix] = {
                    biome: tempBioma,
                    tile: "CENTER"
                };
            }
            this.parent.currentNode.mapDataLayer2[jy][ix] = {
                biome: "NULL",
                position: "CENTER"
            }, this.parent.currentNode.mapDataLayer3[jy][ix] = {
                biome: "NULL",
                position: "CENTER"
            };
        }
        for (i = this.parent.tempSizeTiles.x - 1; i >= 0; i--) for (k = this.parent.tempSizeTiles.y + 5; k >= 0; k--) this.parent.currentNode.mapData[i][k].biome || (this.parent.currentNode.mapData[i][k] = {
            biome: "OCEAN",
            position: "CENTER"
        });
        this.parent.currentNode.topTile = top, this.parent.currentNode.bottomTile = bot, 
        this.parent.currentNode.leftTile = lef, this.parent.currentNode.rightTile = rig;
        var roads = voronoiMap.roads();
        for (roads.createRoads(this.map, [ 0, .15 ]), i = roads.roadConnections.length - 1; i >= 0; i--) roads.roadConnections[i] && roads.roadConnections[i].length >= 0 && (tempX = Math.floor(roads.roadConnections[i][0].midpoint.y / APP.nTileSize), 
        tempY = Math.floor(roads.roadConnections[i][0].midpoint.x / APP.nTileSize), this.parent.currentNode.mapDataLayer2[tempY][tempX].biome = "ROAD1", 
        this.parent.currentNode.mapDataLayer2[tempY][tempX].tile = "CENTER");
        this.tileDesigner.roundTiles(this.parent.currentNode.mapDataLayer1, "STANDARD1"), 
        this.tileDesigner.roundTiles(this.parent.currentNode.mapDataLayer1, "STANDARD2"), 
        this.tileDesigner.roundTiles(this.parent.currentNode.mapDataLayer1, "STANDARD3"), 
        this.tileDesigner.roundTiles(this.parent.currentNode.mapDataLayer1, "STANDARD1"), 
        this.tileDesigner.roundTiles(this.parent.currentNode.mapDataLayer1, "STANDARD2"), 
        this.tileDesigner.roundTiles(this.parent.currentNode.mapDataLayer1, "STANDARD3"), 
        this.tileDesigner.roundTilesCost(this.parent.currentNode.mapData, "BEACH"), this.tileDesigner.roundTilesCost(this.parent.currentNode.mapData, "BEACH"), 
        this.tileDesigner.roundTilesCost(this.parent.currentNode.mapData, "BEACH"), this.tileDesigner.roundTilesCost(this.parent.currentNode.mapData, "BEACH"), 
        this.tileDesigner.roundTilesBorder(this.parent.currentNode.backMapData, this.parent.currentNode.mapData, "OCEAN"), 
        this.tileDesigner.roundTilesBorder(this.parent.currentNode.backMapData, this.parent.currentNode.mapData, "OCEAN"), 
        this.tileDesigner.roundTilesBorder2(this.parent.currentNode.backMapData, [ "ISLAND1", "ISLAND2", "ISLAND3" ], "ISLAND3"), 
        this.tileDesigner.roundTilesBorder2(this.parent.currentNode.backMapData, [ "ISLAND1", "ISLAND2", "ISLAND3" ], "ISLAND2"), 
        this.tileDesigner.roundTilesBaseIsland(this.parent.currentNode.backMapData, [ "ISLAND1", "ISLAND2", "ISLAND3" ]), 
        this.tileDesigner.roundTilesBaseIslandColors(this.parent.currentNode.backMapData);
        for (var line = "", ii = 0; ii < this.parent.currentNode.backMapData.length; ii++) {
            line = "";
            for (var jj = 0; jj < this.parent.currentNode.backMapData[ii].length; jj++) line += void 0 !== this.parent.currentNode.backMapData[ii][jj].biome ? "1" : "0";
        }
        return this.parent.currentNode.backLayer = new PIXI.DisplayObjectContainer(), this.parent.currentNode.bg = new PIXI.DisplayObjectContainer(), 
        this.parent.currentNode.bgLayer1 = new PIXI.DisplayObjectContainer(), this.parent.currentNode.bgLayer2 = new PIXI.DisplayObjectContainer(), 
        this.parent.currentNode.bgLayer3 = new PIXI.DisplayObjectContainer(), this.playerPostion = 0, 
        this.parent.currentNode.bg;
    },
    updateLayer: function(container, placeds, data, alpha) {
        var tempPlaced = {
            x: 0,
            y: 0
        }, tempPlacedSprite = null, distance = -999, accX = 3, accY = 3;
        alpha || (alpha = 1);
        for (var i = this.playerPostion.x - this.distanceToShowMap - accX; i < this.playerPostion.x + this.distanceToShowMap + accX; i++) if (i >= 0 && i < placeds.length) {
            tempPlaced.x = i;
            for (var j = this.playerPostion.y - this.distanceToShowMap - accY; j < this.playerPostion.y + this.distanceToShowMap + accY; j++) if (j >= 0 && j < placeds[tempPlaced.x].length && (tempPlaced.y = j, 
            tempPlaced.x >= 0 && tempPlaced.y >= 0 && this.isNullTiles(data[tempPlaced.x][tempPlaced.y].biome))) {
                if (tempPlacedSprite = placeds[tempPlaced.x][tempPlaced.y], distance = Math.floor(this.pointDistance(tempPlaced.x, tempPlaced.y, this.playerPostion.x, this.playerPostion.y)), 
                data[tempPlaced.x][tempPlaced.y].biome && (null === tempPlacedSprite || 0 === tempPlacedSprite) && distance < this.distanceToShowMap) {
                    var tempTile = new SimpleSprite(tilesGraphics[data[tempPlaced.x][tempPlaced.y].tile]), tempX = tempPlaced.x * APP.nTileSize, tempY = tempPlaced.y * APP.nTileSize, scl = (APP.nTileSize, 
                    1);
                    tempTile.setPosition(tempX * scl, tempY * scl), tempTile.getContent().tint = addSaturation(displayColors[data[tempPlaced.x][tempPlaced.y].biome], 1.5 - APP.getMadness() / 2), 
                    tempTile.getContent().alpha = alpha, container.addChild(tempTile.getContent()), 
                    placeds[tempPlaced.x][tempPlaced.y] = tempTile.getContent();
                }
                null !== tempPlacedSprite && distance > this.distanceToShowMap && tempPlacedSprite.parent && (tempPlacedSprite.parent.removeChild(tempPlacedSprite), 
                placeds[tempPlaced.x][tempPlaced.y] = null);
            }
        }
    },
    updateTiles: function(playerPostion) {
        this.playerPostion !== playerPostion && (this.playerPostion = playerPostion, this.playerPostion && this.parent.currentNode.mapData && (this.updateLayer(this.parent.currentNode.backLayer, this.parent.currentNode.backPlacedTiles, this.parent.currentNode.backMapData), 
        this.updateLayer(this.parent.currentNode.bgLayer1, this.parent.currentNode.placedTilesLayer1, this.parent.currentNode.mapDataLayer1, .8), 
        this.updateLayer(this.parent.currentNode.bg, this.parent.currentNode.placedTiles, this.parent.currentNode.mapData)));
    },
    createDoors: function() {
        this.parent.currentNode.childrenSides[0] && this.parent.currentNode.leftTile && (this.parent.doorLeft = new Door("left"), 
        this.parent.doorLeft.build(), this.parent.doorLeft.setPosition(this.parent.currentNode.leftTile.x * APP.nTileSize + this.parent.doorLeft.width / 2, this.parent.currentNode.leftTile.y * APP.nTileSize), 
        this.parent.doorLeft.node = this.parent.currentNode.childrenSides[0], this.parent.environmentLayer.addChild(this.parent.doorLeft)), 
        this.parent.currentNode.childrenSides[1] && this.parent.currentNode.rightTile && (this.parent.doorRight = new Door("right"), 
        this.parent.doorRight.build(), this.parent.doorRight.setPosition(this.parent.currentNode.rightTile.x * APP.nTileSize - this.parent.doorRight.width / 2, this.parent.currentNode.rightTile.y * APP.nTileSize), 
        this.parent.doorRight.node = this.parent.currentNode.childrenSides[1], this.parent.environmentLayer.addChild(this.parent.doorRight)), 
        this.parent.currentNode.childrenSides[2] && this.parent.currentNode.topTile && (this.parent.doorUp = new Door("up"), 
        this.parent.doorUp.build(), this.parent.doorUp.setPosition(this.parent.currentNode.topTile.x * APP.nTileSize, this.parent.currentNode.topTile.y * APP.nTileSize - this.parent.doorUp.height / 2), 
        this.parent.doorUp.node = this.parent.currentNode.childrenSides[2], this.parent.environmentLayer.addChild(this.parent.doorUp)), 
        this.parent.currentNode.childrenSides[3] && this.parent.currentNode.bottomTile && (this.parent.doorDown = new Door("down"), 
        this.parent.doorDown.build(), this.parent.doorDown.setPosition(this.parent.currentNode.bottomTile.x * APP.nTileSize, this.parent.currentNode.bottomTile.y * APP.nTileSize + this.parent.doorDown.height / 2), 
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
        this.updateTiles(this.parent.getPlayerTilePos());
    },
    pointDistance: function(x, y, x0, y0) {
        return Math.sqrt((x -= x0) * x + (y -= y0) * y);
    }
}), TileDesigner = Class.extend({
    init: function() {
        this.parent = parent;
    },
    roundTilesBaseIslandColors: function(data) {
        for (var i = data.length - 1; i >= 0; i--) for (var j = data[i].length - 1; j >= 0; j--) void 0 !== data[i][j].biome && (data[i][j].biome = "TOP_LEFT" === data[i][j].tile ? "ISLAND1" : "TOP_RIGHT" === data[i][j].tile ? "ISLAND3" : "ISLAND2");
        this.improveColors(data, "ISLAND2"), this.improveColors(data, "ISLAND1"), this.improveColors(data, "ISLAND3");
    },
    improveColors: function(data, type) {
        for (var ii = data.length - 2; ii >= 5; ii--) for (var jj = data[ii].length - 2; jj >= 5; jj--) if (void 0 !== data[ii][jj] && void 0 !== data[ii][jj].biome && data[ii][jj].biome === type) for (var kk = jj; kk >= jj - 4; kk--) void 0 !== data[ii][kk].biome && (data[ii][kk].biome = type);
    },
    roundTilesBaseIsland: function(data, type) {
        for (var tempTL = null, tempT = null, tempTR = null, tempL = null, tempR = null, tempBL = null, tempB = null, tempBR = null, current = null, ocean = function(data) {
            if (null === data) return !1;
            for (var ret = !1, i = type.length - 1; i >= 0; i--) if (ret = data.biome !== type[i], 
            !ret) return ret;
            return ret;
        }, i = data.length - 2; i >= 1; i--) for (var j = data[i].length - 2; j >= 1; j--) current = data[i][j], 
        void 0 !== data[i - 1][j - 1] && (tempTL = data[i - 1][j - 1]), void 0 !== data[i][j - 1] && (tempT = data[i][j - 1]), 
        void 0 !== data[i + 1][j - 1] && (tempTR = data[i + 1][j - 1]), void 0 !== data[i - 1][j] && (tempL = data[i - 1][j]), 
        void 0 !== data[i + 1][j] && (tempR = data[i + 1][j]), void 0 !== data[i - 1][j + 1] && (tempBL = data[i - 1][j + 1]), 
        void 0 !== data[i][j + 1] && (tempB = data[i][j + 1]), void 0 !== data[i + 1][j + 1] && (tempBR = data[i + 1][j + 1]), 
        ocean(tempB) && ocean(tempL) && !ocean(tempR) && (current.tile = "TOP_RIGHT"), ocean(tempB) && ocean(tempR) && !ocean(tempL) && (current.tile = "TOP_LEFT"), 
        null !== current && ocean(tempB) && ocean(tempR) && ocean(tempL) && (current.tile = "BASE1");
    },
    roundTilesBorder2: function(data, type, targetBiome) {
        for (var tempTL = null, tempT = null, tempTR = null, tempL = null, tempR = null, tempBL = null, tempB = null, tempBR = null, current = null, ocean = (Math.random(), 
        function(data) {
            if (null === data) return !1;
            for (var ret = !1, i = type.length - 1; i >= 0; i--) if (ret = data.biome === type[i]) return ret;
            return ret;
        }), i = data.length - 2; i >= 1; i--) for (var j = data[i].length - 2; j >= 1; j--) current = data[i][j], 
        void 0 !== data[i - 1][j - 1] && (tempTL = data[i - 1][j - 1]), void 0 !== data[i][j - 1] && (tempT = data[i][j - 1]), 
        void 0 !== data[i + 1][j - 1] && (tempTR = data[i + 1][j - 1]), void 0 !== data[i - 1][j] && (tempL = data[i - 1][j]), 
        void 0 !== data[i + 1][j] && (tempR = data[i + 1][j]), void 0 !== data[i - 1][j + 1] && (tempBL = data[i - 1][j + 1]), 
        void 0 !== data[i][j + 1] && (tempB = data[i][j + 1]), void 0 !== data[i + 1][j + 1] && (tempBR = data[i + 1][j + 1]), 
        ocean(current) && (data[i][j + 1] = {
            tile: "CENTER",
            biome: targetBiome
        }, console.log("create", targetBiome));
    },
    roundTilesBorder: function(data, dataCompare, type) {
        for (var tempTL = null, tempT = null, tempTR = null, tempL = null, tempR = null, tempBL = null, tempB = null, tempBR = null, current = null, ocean = function(data) {
            return null === data ? !1 : data.biome === type;
        }, i = dataCompare.length - 2; i >= 1; i--) for (var j = dataCompare[i].length - 2; j >= 1; j--) dataCompare[i][j].biome === type && (current = data[i][j], 
        void 0 !== dataCompare[i - 1][j - 1] && (tempTL = dataCompare[i - 1][j - 1]), void 0 !== dataCompare[i][j - 1] && (tempT = dataCompare[i][j - 1]), 
        void 0 !== dataCompare[i + 1][j - 1] && (tempTR = dataCompare[i + 1][j - 1]), void 0 !== dataCompare[i - 1][j] && (tempL = dataCompare[i - 1][j]), 
        void 0 !== dataCompare[i + 1][j] && (tempR = dataCompare[i + 1][j]), void 0 !== dataCompare[i - 1][j + 1] && (tempBL = dataCompare[i - 1][j + 1]), 
        void 0 !== dataCompare[i][j + 1] && (tempB = dataCompare[i][j + 1]), void 0 !== dataCompare[i + 1][j + 1] && (tempBR = dataCompare[i + 1][j + 1])), 
        "TOP_LEFT" === dataCompare[i][j].tile || "TOP_RIGHT" === dataCompare[i][j].tile ? (data[i][j].tile = "CENTER", 
        data[i][j].biome = "ISLAND3") : ocean(tempT) || !ocean(tempB) && !ocean(current) || ("CENTER" === tempT.tile ? current.tile = "CENTER" : "TOP_RIGHT" === tempT.tile ? current.tile = "TOP_RIGHT" : "TOP_LEFT" === tempT.tile && (current.tile = "TOP_LEFT"), 
        current.biome = "ISLAND3");
    },
    roundTiles: function(data, type) {
        for (var tempType = type, tempTL = null, tempT = null, tempTR = null, tempL = null, tempR = null, tempBL = null, tempB = null, tempBR = null, current = null, ocean = function(data) {
            return null === data ? !1 : data.biome !== tempType;
        }, verifyCross = function(data) {
            return null === data ? !1 : ocean(tempB) && !ocean(tempT) && ocean(tempL) && ocean(tempR) || ocean(tempT) && !ocean(tempB) && ocean(tempL) && ocean(tempR) || !ocean(tempR) && ocean(tempL) && ocean(tempT) && ocean(tempB) || !ocean(tempL) && ocean(tempR) && ocean(tempT) && ocean(tempB) || ocean(tempL) && ocean(tempR) && ocean(tempT) && ocean(tempB);
        }, i = data.length - 1; i >= 0; i--) for (var j = data[i].length - 1; j >= 0; j--) data[i][j].biome === type && (current = data[i][j], 
        void 0 !== data[i - 1][j - 1] && (tempTL = data[i - 1][j - 1]), void 0 !== data[i][j - 1] && (tempT = data[i][j - 1]), 
        void 0 !== data[i + 1][j - 1] && (tempTR = data[i + 1][j - 1]), void 0 !== data[i - 1][j] && (tempL = data[i - 1][j]), 
        void 0 !== data[i + 1][j] && (tempR = data[i + 1][j]), void 0 !== data[i - 1][j + 1] && (tempBL = data[i - 1][j + 1]), 
        void 0 !== data[i][j + 1] && (tempB = data[i][j + 1]), void 0 !== data[i + 1][j + 1] && (tempBR = data[i + 1][j + 1])), 
        ocean(tempB) && ocean(tempL) && !ocean(tempR) && (current.tile = "TOP_RIGHT"), ocean(tempT) && ocean(tempL) && !ocean(tempR) && (current.tile = "BOTTOM_RIGHT"), 
        ocean(tempB) && ocean(tempR) && !ocean(tempL) && (current.tile = "TOP_LEFT"), ocean(tempT) && ocean(tempR) && !ocean(tempL) && (current.tile = "BOTTOM_LEFT"), 
        verifyCross(current) && (current.biome = "OCEAN");
    },
    roundTilesCost: function(data, type) {
        for (var tempTL = null, tempT = null, tempTR = null, tempL = null, tempR = null, tempBL = null, tempB = null, tempBR = null, current = null, ocean = function(data) {
            return null === data ? !1 : "OCEAN" === data.biome;
        }, verifyCross = function(data) {
            return null === data ? !1 : ocean(tempB) && !ocean(tempT) && ocean(tempL) && ocean(tempR) || ocean(tempT) && !ocean(tempB) && ocean(tempL) && ocean(tempR) || !ocean(tempR) && ocean(tempL) && ocean(tempT) && ocean(tempB) || !ocean(tempL) && ocean(tempR) && ocean(tempT) && ocean(tempB) || ocean(tempL) && ocean(tempR) && ocean(tempT) && ocean(tempB);
        }, i = data.length - 1; i >= 0; i--) for (var j = data[i].length - 1; j >= 0; j--) data[i][j].biome === type && (current = data[i][j], 
        void 0 !== data[i - 1][j - 1] && (tempTL = data[i - 1][j - 1]), void 0 !== data[i][j - 1] && (tempT = data[i][j - 1]), 
        void 0 !== data[i + 1][j - 1] && (tempTR = data[i + 1][j - 1]), void 0 !== data[i - 1][j] && (tempL = data[i - 1][j]), 
        void 0 !== data[i + 1][j] && (tempR = data[i + 1][j]), void 0 !== data[i - 1][j + 1] && (tempBL = data[i - 1][j + 1]), 
        void 0 !== data[i][j + 1] && (tempB = data[i][j + 1]), void 0 !== data[i + 1][j + 1] && (tempBR = data[i + 1][j + 1])), 
        ocean(tempB) && ocean(tempL) && !ocean(tempR) && (current.tile = "TOP_RIGHT"), ocean(tempT) && ocean(tempL) && !ocean(tempR) && (current.tile = "BOTTOM_RIGHT"), 
        ocean(tempB) && ocean(tempR) && !ocean(tempL) && (current.tile = "TOP_LEFT"), ocean(tempT) && ocean(tempR) && !ocean(tempL) && (current.tile = "BOTTOM_LEFT"), 
        verifyCross(current) && (current.biome = "OCEAN");
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
        }, this.mouseDown = !1;
        var clss = "thief", rnd = Math.random();
        .33 > rnd ? clss = "warrior" : .66 > rnd && (clss = "mage"), this.playerModel = APP.playersList[2].clone(), 
        this.playerModel.mp = 100, this.playerModel.mpMax = 100, this.playerReady = !1, 
        this.gameMadness = 1;
    },
    destroy: function() {
        this._super();
    },
    build: function() {
        this._super();
        for (var assetsToLoader = [ "_dist/img/drop.png", "_dist/img/pixel.jpg", "_dist/img/HUD/bags/bag1.png", "_dist/img/HUD/box.png", "_dist/img/HUD/backWeapon.png", "_dist/img/HUD/backArmor.png", "_dist/img/HUD/backSpec.png", "_dist/img/HUD/backFairy.png", "_dist/img/HUD/backPlayerHUD.png", "_dist/img/HUD/levelContent.png", "_dist/img/HUD/backEquips.png", "_dist/img/levels/leftTop.png", "_dist/img/levels/rightTop.png", "_dist/img/levels/leftBottom.png", "_dist/img/levels/rightBottom.png", "_dist/img/levels/tile1.png", this.playerModel.graphicsData.icoImg, this.playerModel.graphicsData.srcImg, this.playerModel.graphicsData.srcJson ], i = arrayThrees.length - 1; i >= 0; i--) for (var j = arrayThrees[i].length - 1; j >= 0; j--) assetsToLoader.push(arrayThrees[i][j]);
        for (var k = arrayRocks.length - 1; k >= 0; k--) for (var l = arrayRocks[k].length - 1; l >= 0; l--) assetsToLoader.push(arrayRocks[k][l]);
        this.loader = new PIXI.AssetLoader(assetsToLoader), this.initLoad(), this.equips = [ null, null, null ];
    },
    onProgress: function() {
        this.loadPercent = (this.loader.assetURLs.length - this.loader.loadCount) / this.loader.assetURLs.length, 
        this.loadText && this.loadText.setText(Math.floor(100 * this.loadPercent) + "%"), 
        this.loadText.position.x = this.canvasArea.x / 2 - this.loadText.width / 2, this.loadText.position.y = this.canvasArea.y / 2 - this.loadText.height / 2;
    },
    onAssetsLoaded: function() {
        this.loadText.setText("Generating Map"), this._super(), this.currentNode = APP.gen.firstNode, 
        this.currentNode.applySeed();
        this.vecPositions = [], this.keyboardInput = new InputManager(this), this.graphDebug = new PIXI.Graphics(), 
        this.addChild(this.graphDebug), this.createHUD(), this.blackShape = new PIXI.Graphics(), 
        this.blackShape.beginFill(0), this.blackShape.drawRect(0, 0, windowWidth, windowHeight), 
        APP.getHUD().addChild(this.blackShape), this.collisionSystem = new BoundCollisionSystem(this, !1), 
        this.effectsContainer = new PIXI.DisplayObjectContainer(), this.addChild(this.effectsContainer), 
        this.levelGenerator = new LevelGenerator(this), this.resetLevel(), this.arrayBags = [];
    },
    createHUD: function() {
        this.barsContainer = new PIXI.DisplayObjectContainer(), this.playerHUD = new PlayerHUD("player"), 
        this.playerHUD.setPosition(15, -this.playerHUD.getContent().height + 100), this.barsContainer.addChild(this.playerHUD.getContent()), 
        this.levelContent = new SimpleSprite("_dist/img/HUD/levelContent.png"), this.barsContainer.addChild(this.levelContent.getContent()), 
        this.humanityBar = new BarView(240, 10, 100, 100), this.humanityBar.setFrontColor(11359623), 
        this.humanityBar.setBackColor(16745728), this.humanityBar.setPosition(windowWidth / 2 - this.humanityBar.width / 2, 20), 
        this.humanityBar.updateBar(50, 100), APP.getHUD().addChild(this.humanityBar.getContent()), 
        this.XPBar = new BarView(140, 6, 100, 100), this.XPBar.setFrontColor(11359623), 
        this.XPBar.setBackColor(16745728), this.XPBar.setPosition(this.levelContent.getContent().width - 1, 0), 
        this.barsContainer.addChild(this.XPBar.getContent()), this.HPView = new LifeBarHUD(80, 10, 100, 100), 
        this.HPView.setPosition(this.levelContent.getContent().width - 1, 6), this.barsContainer.addChild(this.HPView.getContent()), 
        this.MPView = new ManaBarHUD(80, 10, 100, 100), this.MPView.setPosition(this.levelContent.getContent().width - 7, 35), 
        this.barsContainer.addChild(this.MPView.getContent()), this.levelLabel = new PIXI.Text("10", {
            fill: "black",
            align: "left",
            font: "16px Arial",
            wordWrap: !0,
            wordWrapWidth: 20
        }), this.levelLabel.position.y = 9, this.levelLabel.position.x = 15, this.levelLabel.rotation = degreesToRadians(-3), 
        this.barsContainer.addChild(this.levelLabel), this.barsContainer.position.x = 15, 
        this.barsContainer.position.y = 100, this.barsContainer.rotation = degreesToRadians(-5), 
        this.barsContainer.scale.x = .7, this.barsContainer.scale.y = .7, APP.getHUD().addChild(this.barsContainer), 
        this.equips[0] = APP.weaponList[0], this.equips[1] = APP.armorList[0], this.equipsContainer = new PIXI.DisplayObjectContainer(), 
        this.backEquips = new SimpleSprite("_dist/img/HUD/backEquips.png"), this.backEquips.setPosition(-12, -14), 
        this.equipsContainer.addChild(this.backEquips.getContent());
        var contentEquipPos = {
            x: windowWidth - 110,
            y: 15
        };
        this.fairyEquip = new EquipsHUD("fairy"), this.equipsContainer.addChild(this.fairyEquip.getContent()), 
        this.fairyEquip.setPosition(73, 61), this.relicEquip = new EquipsHUD("relic"), this.equipsContainer.addChild(this.relicEquip.getContent()), 
        this.relicEquip.setPosition(7, 61), this.relicEquip.addModel(this.equips[2]), this.weaponEquip = new EquipsHUD("weapon"), 
        this.equipsContainer.addChild(this.weaponEquip.getContent()), this.weaponEquip.setPosition(0, 0), 
        this.weaponEquip.addModel(this.equips[0]), this.armorEquip = new EquipsHUD("armor"), 
        this.equipsContainer.addChild(this.armorEquip.getContent()), this.armorEquip.setPosition(73, 4), 
        this.armorEquip.addModel(this.equips[1]), APP.getHUD().addChild(this.equipsContainer), 
        this.equipsContainer.position.x = contentEquipPos.x, this.equipsContainer.position.y = contentEquipPos.y, 
        this.equipsContainer.scale.x = .7, this.equipsContainer.scale.y = .7, this.inventory = [ null, null, null, null, null, null, null, null, null, null, null, null, null, null, null ], 
        this.inventoryContainer = new PIXI.DisplayObjectContainer();
        for (var tempBox = null, lineAccum = 0, rowAccum = 0, inventoryPosition = {
            x: realWindowWidth / 2 - 46 * this.inventory.length / 2 + 10,
            y: windowHeight - 50
        }, i = 0; i < this.inventory.length; i++) tempBox = new BoxHUD1(42, 36, 3, i), tempBox.setPosition(46 * rowAccum, 42 * lineAccum), 
        rowAccum++, this.inventoryContainer.addChild(tempBox.getContent()), this.inventory[i] = tempBox;
        this.inventory[0].addModel(APP.itemList[0]), this.inventory[1].addModel(APP.itemList[1]), 
        this.inventory[2].addModel(APP.itemList[2]), this.inventory[3].addModel(APP.spellList[0]), 
        this.inventory[4].addModel(APP.spellList[1]), this.inventory[5].addModel(APP.spellList[2]), 
        this.inventory[9].addModel(APP.weaponList[2]), this.inventory[10].addModel(APP.relicList[2]), 
        this.inventory[11].addModel(APP.relicList[1]), APP.getHUD().addChild(this.inventoryContainer), 
        this.inventoryContainer.position.x = inventoryPosition.x, this.inventoryContainer.position.y = inventoryPosition.y;
    },
    addBag: function(pos, model) {
        var tempBag = new Bag(model, this.player);
        tempBag.build(), tempBag.setPosition(pos.x, pos.y), this.entityLayer.addChild(tempBag), 
        this.arrayBags.push(tempBag);
    },
    addModelInventory: function(model) {
        for (var i = 0; i < this.inventory.length; i++) if (this.inventory[i].model && this.inventory[i].model.name === model.name && model.quant && this.inventory[i].model.quant < 9) {
            console.log(model.quant, this.inventory[i].model.quant);
            var tempModel = this.inventory[i].model.clone();
            return tempModel.quant += model.quant, this.inventory[i].model = tempModel, this.inventory[i].updateQuant(), 
            !0;
        }
        for (i = 0; i < this.inventory.length; i++) if (!this.inventory[i].model) return this.inventory[i].addModel(model), 
        !0;
        return !1;
    },
    useShortcut: function(id) {
        console.log(this.inventory[id].model), this.inventory[id] && this.inventory[id].model && (this.inventory[id].model instanceof ItemModel ? this.useItem(this.inventory[id].model) && (this.inventory[id].model.quant--, 
        this.inventory[id].model.quant <= 0 ? this.inventory[id].removeModel() : this.inventory[id].updateQuant()) : this.inventory[id].model instanceof SpellModel && this.spell(this.inventory[id].model));
    },
    updatePlayerEquips: function() {
        this.weaponEquip && this.weaponEquip.model && this.weaponEquip.model !== this.equips[0] && (this.equips[0] = this.weaponEquip.model), 
        this.armorEquip && this.armorEquip.model && this.armorEquip.model !== this.equips[0] && (this.equips[1] = this.armorEquip.model), 
        this.relicEquip && this.relicEquip.model && this.relicEquip.model !== this.equips[0] && (this.equips[2] = this.relicEquip.model), 
        this.equips[0] && this.player.setWeaponModel(this.equips[0]), this.equips[1] && this.player.setArmorModel(this.equips[1]), 
        this.equips[2] && this.player.setRelicModel(this.equips[2]), this.playerHUD.addModel(this.playerModel, this.player);
    },
    useItem: function(itemModel) {
        return this.player.useItem(itemModel);
    },
    spell: function(spellModel) {
        this.player.spell(APP.stage.getMousePosition(), spellModel);
    },
    shoot: function() {
        this.player.shoot(APP.stage.getMousePosition(), this.player.weaponModel);
    },
    update: function() {
        if (this.playerReady && void 0 !== this.player && null !== this.player) {
            this.getContent().position.x = windowWidth / 2 - this.player.getPosition().x, this.getContent().position.y = windowHeight / 2 - this.player.getPosition().y, 
            this.player.fireFreqAcum--, this.mouseDown && this.player.fireFreqAcum <= 0 && this.shoot(), 
            this.entityLayer.collideChilds(this.player), this.environmentLayer.collideChilds(this.player), 
            this.boundsCollision();
            for (var i = 0; i < this.entityLayer.childs.length; i++) ("fire" === this.entityLayer.childs[i].type || "bag" === this.entityLayer.childs[i].type) && this.entityLayer.collideChilds(this.entityLayer.childs[i]), 
            "environment" === this.entityLayer.childs[i].type && (APP.getGame().player && pointDistance(APP.getGame().player.getPosition().x, APP.getGame().player.getPosition().y, this.entityLayer.childs[i].getPosition().x, this.entityLayer.childs[i].getPosition().y) < windowHeight ? (this.entityLayer.childs[i].collidable = !0, 
            this.entityLayer.childs[i].updateable = !0) : (this.entityLayer.childs[i].collidable = !1, 
            this.entityLayer.childs[i].updateable = !1));
            this.collisionSystem.applyCollision(this.entityLayer.childs, this.entityLayer.childs), 
            this.minimapHUD && this.minimapHUD.update(this.getPlayerTilePos());
            var dist = 9999, bagNear = null;
            if (this.arrayBags) for (i = this.arrayBags.length - 1; i >= 0; i--) {
                var distance = pointDistance(this.arrayBags[i].getPosition().x, this.arrayBags[i].getPosition().y, this.player.getPosition().x + this.player.centerPosition.x, this.player.getPosition().y + this.player.centerPosition.y);
                distance < this.arrayBags[i].range && !this.arrayBags[i].kill && dist > distance && (bagNear = this.arrayBags[i], 
                dist = distance), bagNear ? APP.getHUDController().showBagContent(bagNear) : APP.getHUDController().hideBagContent();
            }
        }
        this._super(), this.entityLayer.getContent().children.sort(this.depthCompare), this.levelGenerator && this.levelGenerator.update(), 
        this.HPView && this.player && this.updateHUD(), this.player && this.player.endLevel ? (this.player.endLevel = !1, 
        this.currentNode = this.player.nextNode, this.currentNode.applySeed(), this.currentPlayerSide = this.player.nextDoorSide, 
        this.killLevel(this.resetLevel), this.player = null) : this.player && this.player.playerDead && (this.playerModel.resetPoints(), 
        this.killLevel(this.resetLevel), this.player = null, this.entityLayer.updateable = !1);
    },
    updateHUD: function() {
        this.HPView.updateBar(Math.floor(this.playerModel.hp), Math.floor(this.playerModel.hpMax)), 
        this.HPView.setText(Math.floor(this.playerModel.hp) + "/ " + Math.floor(this.playerModel.hpMax)), 
        this.levelLabel.setText(this.playerModel.level < 10 ? " " + this.playerModel.level : this.playerModel.level), 
        this.MPView.updateBar(Math.floor(this.playerModel.mp), Math.floor(this.playerModel.mpMax)), 
        this.MPView.setText(Math.floor(this.playerModel.mp) + "/ " + Math.floor(this.playerModel.mpMax));
        var tempXP = Math.floor(this.playerModel.xp) - Math.floor(this.playerModel.toBeforeLevel), tempNext = Math.floor(this.playerModel.toNextLevel) - Math.floor(this.playerModel.toBeforeLevel);
        this.XPBar.updateBar(tempXP, tempNext), this.humanityBar.updateBar(this.gameMadness, 2);
    },
    getPlayerTilePos: function() {
        if (this.playerReady && this.player) {
            var centerPositionPlayer = {
                x: this.player.getPosition().x + this.player.centerPosition.x,
                y: this.player.getPosition().y + this.player.centerPosition.y
            }, tilePosition = {
                x: Math.floor(centerPositionPlayer.x / APP.nTileSize),
                y: Math.floor(centerPositionPlayer.y / APP.nTileSize)
            };
            return tilePosition;
        }
        return null;
    },
    getPlayerTileType: function() {
        var pos = this.getPlayerTilePos();
        return this.currentNode.mapDataLayer1[pos.x][pos.y].biome;
    },
    boundsCollision: function() {
        if (this.currentNode.mapData && this.player) for (var i = this.entityLayer.childs.length - 1; i >= 0; i--) if (tempEntity = this.entityLayer.childs[i], 
        "fire" !== tempEntity.type && "bag" !== tempEntity.type && "fairy" !== tempEntity.type) {
            var centerPositionPlayer = {
                x: tempEntity.getPosition().x + tempEntity.centerPosition.x,
                y: tempEntity.getPosition().y + tempEntity.centerPosition.y
            }, nextStep = {
                x: centerPositionPlayer.x + tempEntity.virtualVelocity.x,
                y: centerPositionPlayer.y + tempEntity.virtualVelocity.y
            }, nextStepDown = {
                x: nextStep.x,
                y: nextStep.y + tempEntity.height
            }, nextStepUp = {
                x: nextStep.x,
                y: nextStep.y - tempEntity.height
            }, nextStepLeft = {
                x: nextStep.x - tempEntity.width,
                y: nextStep.y
            }, nextStepRight = {
                x: nextStep.x + tempEntity.width,
                y: nextStep.y
            }, tilePositionDown = {
                x: Math.floor(nextStepDown.x / APP.nTileSize),
                y: Math.floor(nextStepDown.y / APP.nTileSize)
            }, tilePositionUp = {
                x: Math.floor(nextStepUp.x / APP.nTileSize),
                y: Math.floor(nextStepUp.y / APP.nTileSize)
            }, tilePositionLeft = {
                x: Math.floor(nextStepLeft.x / APP.nTileSize),
                y: Math.floor(nextStepLeft.y / APP.nTileSize)
            }, tilePositionRight = {
                x: Math.floor(nextStepRight.x / APP.nTileSize),
                y: Math.floor(nextStepRight.y / APP.nTileSize)
            }, pass = void 0 !== this.currentNode.mapData[tilePositionDown.x][tilePositionDown.y] && void 0 !== this.currentNode.mapData[tilePositionDown.x][tilePositionDown.y];
            pass && "OCEAN" === this.currentNode.mapData[tilePositionDown.x][tilePositionDown.y].biome && tempEntity.virtualVelocity.y > 0 && (tempEntity.virtualVelocity.y = 0), 
            pass = void 0 !== this.currentNode.mapData[tilePositionUp.x][tilePositionUp.y] && void 0 !== this.currentNode.mapData[tilePositionUp.x][tilePositionUp.y], 
            pass && "OCEAN" === this.currentNode.mapData[tilePositionUp.x][tilePositionUp.y].biome && tempEntity.virtualVelocity.y < 0 && (tempEntity.virtualVelocity.y = 0), 
            pass = void 0 !== this.currentNode.mapData[tilePositionRight.x][tilePositionRight.y] && void 0 !== this.currentNode.mapData[tilePositionRight.x][tilePositionRight.y], 
            this.currentNode.mapData[tilePositionRight.x][tilePositionRight.y] && "OCEAN" === this.currentNode.mapData[tilePositionRight.x][tilePositionRight.y].biome && tempEntity.virtualVelocity.x > 0 && (tempEntity.virtualVelocity.x = 0), 
            pass = void 0 !== this.currentNode.mapData[tilePositionLeft.x][tilePositionLeft.y] && void 0 !== this.currentNode.mapData[tilePositionLeft.x][tilePositionLeft.y], 
            this.currentNode.mapData[tilePositionLeft.x][tilePositionLeft.y] && "OCEAN" === this.currentNode.mapData[tilePositionLeft.x][tilePositionLeft.y].biome && tempEntity.virtualVelocity.x < 0 && (tempEntity.virtualVelocity.x = 0);
        }
    },
    killLevel: function() {
        var self = this;
        this.playerReady = !1;
        for (var k = this.entityLayer.childs.length - 1; k >= 0; k--) this.entityLayer.childs[k].preKill();
        for (var t = this.environmentLayer.childs.length - 1; t >= 0; t--) this.environmentLayer.childs[t].preKill();
        TweenLite.to(this.blackShape, .5, {
            alpha: 1
        }), setTimeout(function() {
            self.resetLevel();
        }, 700);
    },
    resetLevel: function() {
        this.mouseDown = !1, this.keyboardInput.vecPositions = [];
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
        for (this.player = new Player(this.playerModel), this.currentNode.applySeed(); this.bgContainer.children.length; ) this.bgContainer.removeChildAt(0);
        var i = 0, sizeHelper = 150;
        this.currentNode.bg ? (this.bgContainer.addChild(this.currentNode.bg), this.bgContainer.addChild(this.currentNode.bgLayer1), 
        this.bgContainer.addChild(this.currentNode.bgLayer2), this.bgContainer.addChild(this.currentNode.bgLayer3)) : (this.marginTiles = {
            x: Math.floor(this.mapPosition.x / APP.nTileSize) + sizeHelper,
            y: Math.floor(this.mapPosition.y / APP.nTileSize) + sizeHelper
        }, this.tempSizeTiles = 1 === this.currentNode.mode ? {
            x: Math.floor(windowWidth / APP.nTileSize) + this.marginTiles.x,
            y: Math.floor(windowHeight / APP.nTileSize) + this.marginTiles.y
        } : {
            x: 100 + this.marginTiles.x + Math.floor(15 * this.currentNode.getNextFloat()),
            y: 120 + this.marginTiles.y + Math.floor(15 * this.currentNode.getNextFloat())
        }, this.currentNode.bg = this.levelGenerator.createRoom(), this.bgContainer.addChild(this.currentNode.backLayer), 
        this.bgContainer.addChild(this.currentNode.bg), this.bgContainer.addChild(this.currentNode.bgLayer1), 
        this.bgContainer.addChild(this.currentNode.bgLayer2), this.bgContainer.addChild(this.currentNode.bgLayer3)), 
        this.levelBounds = {
            x: this.currentNode.mapData.length * APP.nTileSize,
            y: this.currentNode.mapData[0].length * APP.nTileSize
        }, this.minimapHUD && (this.minimapHUD.getContent().parent.removeChild(this.minimapHUD.getContent()), 
        this.minimapHUD = null), this.levelGenerator.putObstacles(), this.currentNode.getNextFloat() > .5 ? this.levelGenerator.createRain() : this.levelGenerator.removeRain();
        var monstersToLoaded = [], monstersAssets = [];
        if (1 !== this.currentNode.mode) {
            for (monstersToLoaded = this.levelGenerator.createHordes(), i = monstersToLoaded.length - 1; i >= 0; i--) monstersToLoaded[i].monsterModel.fire.srcImg && monstersAssets.push(monstersToLoaded[i].monsterModel.fire.srcImg), 
            monstersToLoaded[i].monsterModel.srcJson && monstersAssets.push(monstersToLoaded[i].monsterModel.srcJson), 
            monstersToLoaded[i].monsterModel.srcImg && monstersAssets.push(monstersToLoaded[i].monsterModel.srcImg);
            if (monstersToLoaded.length) {
                var monsterLoader = new PIXI.AssetLoader(monstersAssets), self = this;
                monsterLoader.onComplete = function() {
                    for (var i = monstersToLoaded.length - 1; i >= 0; i--) monstersToLoaded[i].build(), 
                    monstersToLoaded[i].setPosition(monstersToLoaded[i].initialPosition.x, monstersToLoaded[i].initialPosition.y), 
                    self.entityLayer.addChild(monstersToLoaded[i]);
                    self.initPlayer();
                }, monsterLoader.onProgress = function() {
                    console.log("onProgress");
                }, monsterLoader.load();
            } else this.initPlayer();
        } else this.initPlayer();
    },
    initPlayer: function() {
        this.blackShape.alpha = 1, TweenLite.to(this.blackShape, 1, {
            alpha: 0
        }), this.playerReady = !0, this.entityLayer.updateable = !0, this.player.build(), 
        this.entityLayer.addChild(this.player), "up" === this.currentPlayerSide || "down" === this.currentPlayerSide || "left" === this.currentPlayerSide || "right" === this.currentPlayerSide, 
        this.player.setPosition(this.levelBounds.x / 2, this.levelBounds.y / 2), this.updatePlayerEquips();
    },
    depthCompare: function(a, b) {
        var yA = a.position.y, yB = b.position.y;
        return yA === yB ? 0 : a.noDepth || b.noDepth ? 0 : (a.children.length > 0 && (yA = a.children[0].position.y + a.children[0].height), 
        b.children.length > 0 && (yB = b.children[0].position.y + b.children[0].height), 
        yB > yA ? -1 : yA > yB ? 1 : 0);
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
}), InputManager = Class.extend({
    init: function(parent) {
        var game = parent, self = this;
        this.vecPositions = [], document.body.addEventListener("mouseup", function() {
            game.player && (game.mouseDown = !1);
        }), document.body.addEventListener("mousedown", function() {
            game.player && APP.getMousePos().x < windowWidth && APP.getMousePos().y < windowHeight - 70 && (game.mouseDown = !0);
        }), document.body.addEventListener("keyup", function(e) {
            if (game.player) {
                if (87 === e.keyCode || 38 === e.keyCode && game.player.velocity.y < 0) self.removePosition("up"); else if (83 === e.keyCode || 40 === e.keyCode && game.player.velocity.y > 0) self.removePosition("down"); else if (65 === e.keyCode || 37 === e.keyCode && game.player.velocity.x < 0) self.removePosition("left"); else if (68 === e.keyCode || 39 === e.keyCode && game.player.velocity.x > 0) self.removePosition("right"); else if (32 === e.keyCode) game.player.hurt(5); else if (49 === e.keyCode || 50 === e.keyCode || 51 === e.keyCode || 52 === e.keyCode || 81 === e.keyCode || 69 === e.keyCode) {
                    var id = 1;
                    50 === e.keyCode ? id = 2 : 51 === e.keyCode ? id = 3 : 52 === e.keyCode && (id = 4), 
                    game.useShortcut(id - 1);
                }
                game.player.updatePlayerVel(self.vecPositions);
            }
        }), document.body.addEventListener("keydown", function(e) {
            game.player && (87 === e.keyCode || 38 === e.keyCode ? (self.removePosition("down"), 
            self.addPosition("up")) : 83 === e.keyCode || 40 === e.keyCode ? (self.removePosition("up"), 
            self.addPosition("down")) : 65 === e.keyCode || 37 === e.keyCode ? (self.removePosition("right"), 
            self.addPosition("left")) : (68 === e.keyCode || 39 === e.keyCode) && (self.removePosition("left"), 
            self.addPosition("right")), game.player.updatePlayerVel(self.vecPositions));
        });
    },
    removePosition: function(position) {
        for (var i = this.vecPositions.length - 1; i >= 0; i--) this.vecPositions[i] === position && this.vecPositions.splice(i, 1);
    },
    addPosition: function(position) {
        for (var exists = !1, i = this.vecPositions.length - 1; i >= 0; i--) this.vecPositions[i] === position && (exists = !0);
        exists || this.vecPositions.push(position);
    }
}), meter = new FPSMeter(), SOCKET = null, windowWidth = 820, windowHeight = 600, realWindowWidth = 820, realWindowHeight = 600;

testMobile() && (windowWidth = 640, windowHeight = 960);

var renderer, windowWidthVar = window.innerWidth, windowHeightVar = window.innerHeight, renderer = PIXI.autoDetectRenderer(realWindowWidth, realWindowHeight, null, !1, !0);

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
    App.init();
}();
/*! goyabpd 24-10-2014 */
var QRCode;

!function() {
    function a(a) {
        this.mode = c.MODE_8BIT_BYTE, this.data = a, this.parsedData = [];
        for (var b = [], d = 0, e = this.data.length; e > d; d++) {
            var f = this.data.charCodeAt(d);
            f > 65536 ? (b[0] = 240 | (1835008 & f) >>> 18, b[1] = 128 | (258048 & f) >>> 12, 
            b[2] = 128 | (4032 & f) >>> 6, b[3] = 128 | 63 & f) : f > 2048 ? (b[0] = 224 | (61440 & f) >>> 12, 
            b[1] = 128 | (4032 & f) >>> 6, b[2] = 128 | 63 & f) : f > 128 ? (b[0] = 192 | (1984 & f) >>> 6, 
            b[1] = 128 | 63 & f) : b[0] = f, this.parsedData = this.parsedData.concat(b);
        }
        this.parsedData.length != this.data.length && (this.parsedData.unshift(191), this.parsedData.unshift(187), 
        this.parsedData.unshift(239));
    }
    function b(a, b) {
        this.typeNumber = a, this.errorCorrectLevel = b, this.modules = null, this.moduleCount = 0, 
        this.dataCache = null, this.dataList = [];
    }
    function i(a, b) {
        if (void 0 == a.length) throw new Error(a.length + "/" + b);
        for (var c = 0; c < a.length && 0 == a[c]; ) c++;
        this.num = new Array(a.length - c + b);
        for (var d = 0; d < a.length - c; d++) this.num[d] = a[d + c];
    }
    function j(a, b) {
        this.totalCount = a, this.dataCount = b;
    }
    function k() {
        this.buffer = [], this.length = 0;
    }
    function m() {
        return "undefined" != typeof CanvasRenderingContext2D;
    }
    function n() {
        var a = !1, b = navigator.userAgent;
        return /android/i.test(b) && (a = !0, aMat = b.toString().match(/android ([0-9]\.[0-9])/i), 
        aMat && aMat[1] && (a = parseFloat(aMat[1]))), a;
    }
    function r(a, b) {
        for (var c = 1, e = s(a), f = 0, g = l.length; g >= f; f++) {
            var h = 0;
            switch (b) {
              case d.L:
                h = l[f][0];
                break;

              case d.M:
                h = l[f][1];
                break;

              case d.Q:
                h = l[f][2];
                break;

              case d.H:
                h = l[f][3];
            }
            if (h >= e) break;
            c++;
        }
        if (c > l.length) throw new Error("Too long data");
        return c;
    }
    function s(a) {
        var b = encodeURI(a).toString().replace(/\%[0-9a-fA-F]{2}/g, "a");
        return b.length + (b.length != a ? 3 : 0);
    }
    a.prototype = {
        getLength: function() {
            return this.parsedData.length;
        },
        write: function(a) {
            for (var b = 0, c = this.parsedData.length; c > b; b++) a.put(this.parsedData[b], 8);
        }
    }, b.prototype = {
        addData: function(b) {
            var c = new a(b);
            this.dataList.push(c), this.dataCache = null;
        },
        isDark: function(a, b) {
            if (0 > a || this.moduleCount <= a || 0 > b || this.moduleCount <= b) throw new Error(a + "," + b);
            return this.modules[a][b];
        },
        getModuleCount: function() {
            return this.moduleCount;
        },
        make: function() {
            this.makeImpl(!1, this.getBestMaskPattern());
        },
        makeImpl: function(a, c) {
            this.moduleCount = 4 * this.typeNumber + 17, this.modules = new Array(this.moduleCount);
            for (var d = 0; d < this.moduleCount; d++) {
                this.modules[d] = new Array(this.moduleCount);
                for (var e = 0; e < this.moduleCount; e++) this.modules[d][e] = null;
            }
            this.setupPositionProbePattern(0, 0), this.setupPositionProbePattern(this.moduleCount - 7, 0), 
            this.setupPositionProbePattern(0, this.moduleCount - 7), this.setupPositionAdjustPattern(), 
            this.setupTimingPattern(), this.setupTypeInfo(a, c), this.typeNumber >= 7 && this.setupTypeNumber(a), 
            null == this.dataCache && (this.dataCache = b.createData(this.typeNumber, this.errorCorrectLevel, this.dataList)), 
            this.mapData(this.dataCache, c);
        },
        setupPositionProbePattern: function(a, b) {
            for (var c = -1; 7 >= c; c++) if (!(-1 >= a + c || this.moduleCount <= a + c)) for (var d = -1; 7 >= d; d++) -1 >= b + d || this.moduleCount <= b + d || (this.modules[a + c][b + d] = c >= 0 && 6 >= c && (0 == d || 6 == d) || d >= 0 && 6 >= d && (0 == c || 6 == c) || c >= 2 && 4 >= c && d >= 2 && 4 >= d ? !0 : !1);
        },
        getBestMaskPattern: function() {
            for (var a = 0, b = 0, c = 0; 8 > c; c++) {
                this.makeImpl(!0, c);
                var d = f.getLostPoint(this);
                (0 == c || a > d) && (a = d, b = c);
            }
            return b;
        },
        createMovieClip: function(a, b, c) {
            var d = a.createEmptyMovieClip(b, c), e = 1;
            this.make();
            for (var f = 0; f < this.modules.length; f++) for (var g = f * e, h = 0; h < this.modules[f].length; h++) {
                var i = h * e, j = this.modules[f][h];
                j && (d.beginFill(0, 100), d.moveTo(i, g), d.lineTo(i + e, g), d.lineTo(i + e, g + e), 
                d.lineTo(i, g + e), d.endFill());
            }
            return d;
        },
        setupTimingPattern: function() {
            for (var a = 8; a < this.moduleCount - 8; a++) null == this.modules[a][6] && (this.modules[a][6] = 0 == a % 2);
            for (var b = 8; b < this.moduleCount - 8; b++) null == this.modules[6][b] && (this.modules[6][b] = 0 == b % 2);
        },
        setupPositionAdjustPattern: function() {
            for (var a = f.getPatternPosition(this.typeNumber), b = 0; b < a.length; b++) for (var c = 0; c < a.length; c++) {
                var d = a[b], e = a[c];
                if (null == this.modules[d][e]) for (var g = -2; 2 >= g; g++) for (var h = -2; 2 >= h; h++) this.modules[d + g][e + h] = -2 == g || 2 == g || -2 == h || 2 == h || 0 == g && 0 == h ? !0 : !1;
            }
        },
        setupTypeNumber: function(a) {
            for (var b = f.getBCHTypeNumber(this.typeNumber), c = 0; 18 > c; c++) {
                var d = !a && 1 == (1 & b >> c);
                this.modules[Math.floor(c / 3)][c % 3 + this.moduleCount - 8 - 3] = d;
            }
            for (var c = 0; 18 > c; c++) {
                var d = !a && 1 == (1 & b >> c);
                this.modules[c % 3 + this.moduleCount - 8 - 3][Math.floor(c / 3)] = d;
            }
        },
        setupTypeInfo: function(a, b) {
            for (var c = this.errorCorrectLevel << 3 | b, d = f.getBCHTypeInfo(c), e = 0; 15 > e; e++) {
                var g = !a && 1 == (1 & d >> e);
                6 > e ? this.modules[e][8] = g : 8 > e ? this.modules[e + 1][8] = g : this.modules[this.moduleCount - 15 + e][8] = g;
            }
            for (var e = 0; 15 > e; e++) {
                var g = !a && 1 == (1 & d >> e);
                8 > e ? this.modules[8][this.moduleCount - e - 1] = g : 9 > e ? this.modules[8][15 - e - 1 + 1] = g : this.modules[8][15 - e - 1] = g;
            }
            this.modules[this.moduleCount - 8][8] = !a;
        },
        mapData: function(a, b) {
            for (var c = -1, d = this.moduleCount - 1, e = 7, g = 0, h = this.moduleCount - 1; h > 0; h -= 2) for (6 == h && h--; ;) {
                for (var i = 0; 2 > i; i++) if (null == this.modules[d][h - i]) {
                    var j = !1;
                    g < a.length && (j = 1 == (1 & a[g] >>> e));
                    var k = f.getMask(b, d, h - i);
                    k && (j = !j), this.modules[d][h - i] = j, e--, -1 == e && (g++, e = 7);
                }
                if (d += c, 0 > d || this.moduleCount <= d) {
                    d -= c, c = -c;
                    break;
                }
            }
        }
    }, b.PAD0 = 236, b.PAD1 = 17, b.createData = function(a, c, d) {
        for (var e = j.getRSBlocks(a, c), g = new k(), h = 0; h < d.length; h++) {
            var i = d[h];
            g.put(i.mode, 4), g.put(i.getLength(), f.getLengthInBits(i.mode, a)), i.write(g);
        }
        for (var l = 0, h = 0; h < e.length; h++) l += e[h].dataCount;
        if (g.getLengthInBits() > 8 * l) throw new Error("code length overflow. (" + g.getLengthInBits() + ">" + 8 * l + ")");
        for (g.getLengthInBits() + 4 <= 8 * l && g.put(0, 4); 0 != g.getLengthInBits() % 8; ) g.putBit(!1);
        for (;!(g.getLengthInBits() >= 8 * l) && (g.put(b.PAD0, 8), !(g.getLengthInBits() >= 8 * l)); ) g.put(b.PAD1, 8);
        return b.createBytes(g, e);
    }, b.createBytes = function(a, b) {
        for (var c = 0, d = 0, e = 0, g = new Array(b.length), h = new Array(b.length), j = 0; j < b.length; j++) {
            var k = b[j].dataCount, l = b[j].totalCount - k;
            d = Math.max(d, k), e = Math.max(e, l), g[j] = new Array(k);
            for (var m = 0; m < g[j].length; m++) g[j][m] = 255 & a.buffer[m + c];
            c += k;
            var n = f.getErrorCorrectPolynomial(l), o = new i(g[j], n.getLength() - 1), p = o.mod(n);
            h[j] = new Array(n.getLength() - 1);
            for (var m = 0; m < h[j].length; m++) {
                var q = m + p.getLength() - h[j].length;
                h[j][m] = q >= 0 ? p.get(q) : 0;
            }
        }
        for (var r = 0, m = 0; m < b.length; m++) r += b[m].totalCount;
        for (var s = new Array(r), t = 0, m = 0; d > m; m++) for (var j = 0; j < b.length; j++) m < g[j].length && (s[t++] = g[j][m]);
        for (var m = 0; e > m; m++) for (var j = 0; j < b.length; j++) m < h[j].length && (s[t++] = h[j][m]);
        return s;
    };
    for (var c = {
        MODE_NUMBER: 1,
        MODE_ALPHA_NUM: 2,
        MODE_8BIT_BYTE: 4,
        MODE_KANJI: 8
    }, d = {
        L: 1,
        M: 0,
        Q: 3,
        H: 2
    }, e = {
        PATTERN000: 0,
        PATTERN001: 1,
        PATTERN010: 2,
        PATTERN011: 3,
        PATTERN100: 4,
        PATTERN101: 5,
        PATTERN110: 6,
        PATTERN111: 7
    }, f = {
        PATTERN_POSITION_TABLE: [ [], [ 6, 18 ], [ 6, 22 ], [ 6, 26 ], [ 6, 30 ], [ 6, 34 ], [ 6, 22, 38 ], [ 6, 24, 42 ], [ 6, 26, 46 ], [ 6, 28, 50 ], [ 6, 30, 54 ], [ 6, 32, 58 ], [ 6, 34, 62 ], [ 6, 26, 46, 66 ], [ 6, 26, 48, 70 ], [ 6, 26, 50, 74 ], [ 6, 30, 54, 78 ], [ 6, 30, 56, 82 ], [ 6, 30, 58, 86 ], [ 6, 34, 62, 90 ], [ 6, 28, 50, 72, 94 ], [ 6, 26, 50, 74, 98 ], [ 6, 30, 54, 78, 102 ], [ 6, 28, 54, 80, 106 ], [ 6, 32, 58, 84, 110 ], [ 6, 30, 58, 86, 114 ], [ 6, 34, 62, 90, 118 ], [ 6, 26, 50, 74, 98, 122 ], [ 6, 30, 54, 78, 102, 126 ], [ 6, 26, 52, 78, 104, 130 ], [ 6, 30, 56, 82, 108, 134 ], [ 6, 34, 60, 86, 112, 138 ], [ 6, 30, 58, 86, 114, 142 ], [ 6, 34, 62, 90, 118, 146 ], [ 6, 30, 54, 78, 102, 126, 150 ], [ 6, 24, 50, 76, 102, 128, 154 ], [ 6, 28, 54, 80, 106, 132, 158 ], [ 6, 32, 58, 84, 110, 136, 162 ], [ 6, 26, 54, 82, 110, 138, 166 ], [ 6, 30, 58, 86, 114, 142, 170 ] ],
        G15: 1335,
        G18: 7973,
        G15_MASK: 21522,
        getBCHTypeInfo: function(a) {
            for (var b = a << 10; f.getBCHDigit(b) - f.getBCHDigit(f.G15) >= 0; ) b ^= f.G15 << f.getBCHDigit(b) - f.getBCHDigit(f.G15);
            return (a << 10 | b) ^ f.G15_MASK;
        },
        getBCHTypeNumber: function(a) {
            for (var b = a << 12; f.getBCHDigit(b) - f.getBCHDigit(f.G18) >= 0; ) b ^= f.G18 << f.getBCHDigit(b) - f.getBCHDigit(f.G18);
            return a << 12 | b;
        },
        getBCHDigit: function(a) {
            for (var b = 0; 0 != a; ) b++, a >>>= 1;
            return b;
        },
        getPatternPosition: function(a) {
            return f.PATTERN_POSITION_TABLE[a - 1];
        },
        getMask: function(a, b, c) {
            switch (a) {
              case e.PATTERN000:
                return 0 == (b + c) % 2;

              case e.PATTERN001:
                return 0 == b % 2;

              case e.PATTERN010:
                return 0 == c % 3;

              case e.PATTERN011:
                return 0 == (b + c) % 3;

              case e.PATTERN100:
                return 0 == (Math.floor(b / 2) + Math.floor(c / 3)) % 2;

              case e.PATTERN101:
                return 0 == b * c % 2 + b * c % 3;

              case e.PATTERN110:
                return 0 == (b * c % 2 + b * c % 3) % 2;

              case e.PATTERN111:
                return 0 == (b * c % 3 + (b + c) % 2) % 2;

              default:
                throw new Error("bad maskPattern:" + a);
            }
        },
        getErrorCorrectPolynomial: function(a) {
            for (var b = new i([ 1 ], 0), c = 0; a > c; c++) b = b.multiply(new i([ 1, g.gexp(c) ], 0));
            return b;
        },
        getLengthInBits: function(a, b) {
            if (b >= 1 && 10 > b) switch (a) {
              case c.MODE_NUMBER:
                return 10;

              case c.MODE_ALPHA_NUM:
                return 9;

              case c.MODE_8BIT_BYTE:
                return 8;

              case c.MODE_KANJI:
                return 8;

              default:
                throw new Error("mode:" + a);
            } else if (27 > b) switch (a) {
              case c.MODE_NUMBER:
                return 12;

              case c.MODE_ALPHA_NUM:
                return 11;

              case c.MODE_8BIT_BYTE:
                return 16;

              case c.MODE_KANJI:
                return 10;

              default:
                throw new Error("mode:" + a);
            } else {
                if (!(41 > b)) throw new Error("type:" + b);
                switch (a) {
                  case c.MODE_NUMBER:
                    return 14;

                  case c.MODE_ALPHA_NUM:
                    return 13;

                  case c.MODE_8BIT_BYTE:
                    return 16;

                  case c.MODE_KANJI:
                    return 12;

                  default:
                    throw new Error("mode:" + a);
                }
            }
        },
        getLostPoint: function(a) {
            for (var b = a.getModuleCount(), c = 0, d = 0; b > d; d++) for (var e = 0; b > e; e++) {
                for (var f = 0, g = a.isDark(d, e), h = -1; 1 >= h; h++) if (!(0 > d + h || d + h >= b)) for (var i = -1; 1 >= i; i++) 0 > e + i || e + i >= b || (0 != h || 0 != i) && g == a.isDark(d + h, e + i) && f++;
                f > 5 && (c += 3 + f - 5);
            }
            for (var d = 0; b - 1 > d; d++) for (var e = 0; b - 1 > e; e++) {
                var j = 0;
                a.isDark(d, e) && j++, a.isDark(d + 1, e) && j++, a.isDark(d, e + 1) && j++, a.isDark(d + 1, e + 1) && j++, 
                (0 == j || 4 == j) && (c += 3);
            }
            for (var d = 0; b > d; d++) for (var e = 0; b - 6 > e; e++) a.isDark(d, e) && !a.isDark(d, e + 1) && a.isDark(d, e + 2) && a.isDark(d, e + 3) && a.isDark(d, e + 4) && !a.isDark(d, e + 5) && a.isDark(d, e + 6) && (c += 40);
            for (var e = 0; b > e; e++) for (var d = 0; b - 6 > d; d++) a.isDark(d, e) && !a.isDark(d + 1, e) && a.isDark(d + 2, e) && a.isDark(d + 3, e) && a.isDark(d + 4, e) && !a.isDark(d + 5, e) && a.isDark(d + 6, e) && (c += 40);
            for (var k = 0, e = 0; b > e; e++) for (var d = 0; b > d; d++) a.isDark(d, e) && k++;
            var l = Math.abs(100 * k / b / b - 50) / 5;
            return c += 10 * l;
        }
    }, g = {
        glog: function(a) {
            if (1 > a) throw new Error("glog(" + a + ")");
            return g.LOG_TABLE[a];
        },
        gexp: function(a) {
            for (;0 > a; ) a += 255;
            for (;a >= 256; ) a -= 255;
            return g.EXP_TABLE[a];
        },
        EXP_TABLE: new Array(256),
        LOG_TABLE: new Array(256)
    }, h = 0; 8 > h; h++) g.EXP_TABLE[h] = 1 << h;
    for (var h = 8; 256 > h; h++) g.EXP_TABLE[h] = g.EXP_TABLE[h - 4] ^ g.EXP_TABLE[h - 5] ^ g.EXP_TABLE[h - 6] ^ g.EXP_TABLE[h - 8];
    for (var h = 0; 255 > h; h++) g.LOG_TABLE[g.EXP_TABLE[h]] = h;
    i.prototype = {
        get: function(a) {
            return this.num[a];
        },
        getLength: function() {
            return this.num.length;
        },
        multiply: function(a) {
            for (var b = new Array(this.getLength() + a.getLength() - 1), c = 0; c < this.getLength(); c++) for (var d = 0; d < a.getLength(); d++) b[c + d] ^= g.gexp(g.glog(this.get(c)) + g.glog(a.get(d)));
            return new i(b, 0);
        },
        mod: function(a) {
            if (this.getLength() - a.getLength() < 0) return this;
            for (var b = g.glog(this.get(0)) - g.glog(a.get(0)), c = new Array(this.getLength()), d = 0; d < this.getLength(); d++) c[d] = this.get(d);
            for (var d = 0; d < a.getLength(); d++) c[d] ^= g.gexp(g.glog(a.get(d)) + b);
            return new i(c, 0).mod(a);
        }
    }, j.RS_BLOCK_TABLE = [ [ 1, 26, 19 ], [ 1, 26, 16 ], [ 1, 26, 13 ], [ 1, 26, 9 ], [ 1, 44, 34 ], [ 1, 44, 28 ], [ 1, 44, 22 ], [ 1, 44, 16 ], [ 1, 70, 55 ], [ 1, 70, 44 ], [ 2, 35, 17 ], [ 2, 35, 13 ], [ 1, 100, 80 ], [ 2, 50, 32 ], [ 2, 50, 24 ], [ 4, 25, 9 ], [ 1, 134, 108 ], [ 2, 67, 43 ], [ 2, 33, 15, 2, 34, 16 ], [ 2, 33, 11, 2, 34, 12 ], [ 2, 86, 68 ], [ 4, 43, 27 ], [ 4, 43, 19 ], [ 4, 43, 15 ], [ 2, 98, 78 ], [ 4, 49, 31 ], [ 2, 32, 14, 4, 33, 15 ], [ 4, 39, 13, 1, 40, 14 ], [ 2, 121, 97 ], [ 2, 60, 38, 2, 61, 39 ], [ 4, 40, 18, 2, 41, 19 ], [ 4, 40, 14, 2, 41, 15 ], [ 2, 146, 116 ], [ 3, 58, 36, 2, 59, 37 ], [ 4, 36, 16, 4, 37, 17 ], [ 4, 36, 12, 4, 37, 13 ], [ 2, 86, 68, 2, 87, 69 ], [ 4, 69, 43, 1, 70, 44 ], [ 6, 43, 19, 2, 44, 20 ], [ 6, 43, 15, 2, 44, 16 ], [ 4, 101, 81 ], [ 1, 80, 50, 4, 81, 51 ], [ 4, 50, 22, 4, 51, 23 ], [ 3, 36, 12, 8, 37, 13 ], [ 2, 116, 92, 2, 117, 93 ], [ 6, 58, 36, 2, 59, 37 ], [ 4, 46, 20, 6, 47, 21 ], [ 7, 42, 14, 4, 43, 15 ], [ 4, 133, 107 ], [ 8, 59, 37, 1, 60, 38 ], [ 8, 44, 20, 4, 45, 21 ], [ 12, 33, 11, 4, 34, 12 ], [ 3, 145, 115, 1, 146, 116 ], [ 4, 64, 40, 5, 65, 41 ], [ 11, 36, 16, 5, 37, 17 ], [ 11, 36, 12, 5, 37, 13 ], [ 5, 109, 87, 1, 110, 88 ], [ 5, 65, 41, 5, 66, 42 ], [ 5, 54, 24, 7, 55, 25 ], [ 11, 36, 12 ], [ 5, 122, 98, 1, 123, 99 ], [ 7, 73, 45, 3, 74, 46 ], [ 15, 43, 19, 2, 44, 20 ], [ 3, 45, 15, 13, 46, 16 ], [ 1, 135, 107, 5, 136, 108 ], [ 10, 74, 46, 1, 75, 47 ], [ 1, 50, 22, 15, 51, 23 ], [ 2, 42, 14, 17, 43, 15 ], [ 5, 150, 120, 1, 151, 121 ], [ 9, 69, 43, 4, 70, 44 ], [ 17, 50, 22, 1, 51, 23 ], [ 2, 42, 14, 19, 43, 15 ], [ 3, 141, 113, 4, 142, 114 ], [ 3, 70, 44, 11, 71, 45 ], [ 17, 47, 21, 4, 48, 22 ], [ 9, 39, 13, 16, 40, 14 ], [ 3, 135, 107, 5, 136, 108 ], [ 3, 67, 41, 13, 68, 42 ], [ 15, 54, 24, 5, 55, 25 ], [ 15, 43, 15, 10, 44, 16 ], [ 4, 144, 116, 4, 145, 117 ], [ 17, 68, 42 ], [ 17, 50, 22, 6, 51, 23 ], [ 19, 46, 16, 6, 47, 17 ], [ 2, 139, 111, 7, 140, 112 ], [ 17, 74, 46 ], [ 7, 54, 24, 16, 55, 25 ], [ 34, 37, 13 ], [ 4, 151, 121, 5, 152, 122 ], [ 4, 75, 47, 14, 76, 48 ], [ 11, 54, 24, 14, 55, 25 ], [ 16, 45, 15, 14, 46, 16 ], [ 6, 147, 117, 4, 148, 118 ], [ 6, 73, 45, 14, 74, 46 ], [ 11, 54, 24, 16, 55, 25 ], [ 30, 46, 16, 2, 47, 17 ], [ 8, 132, 106, 4, 133, 107 ], [ 8, 75, 47, 13, 76, 48 ], [ 7, 54, 24, 22, 55, 25 ], [ 22, 45, 15, 13, 46, 16 ], [ 10, 142, 114, 2, 143, 115 ], [ 19, 74, 46, 4, 75, 47 ], [ 28, 50, 22, 6, 51, 23 ], [ 33, 46, 16, 4, 47, 17 ], [ 8, 152, 122, 4, 153, 123 ], [ 22, 73, 45, 3, 74, 46 ], [ 8, 53, 23, 26, 54, 24 ], [ 12, 45, 15, 28, 46, 16 ], [ 3, 147, 117, 10, 148, 118 ], [ 3, 73, 45, 23, 74, 46 ], [ 4, 54, 24, 31, 55, 25 ], [ 11, 45, 15, 31, 46, 16 ], [ 7, 146, 116, 7, 147, 117 ], [ 21, 73, 45, 7, 74, 46 ], [ 1, 53, 23, 37, 54, 24 ], [ 19, 45, 15, 26, 46, 16 ], [ 5, 145, 115, 10, 146, 116 ], [ 19, 75, 47, 10, 76, 48 ], [ 15, 54, 24, 25, 55, 25 ], [ 23, 45, 15, 25, 46, 16 ], [ 13, 145, 115, 3, 146, 116 ], [ 2, 74, 46, 29, 75, 47 ], [ 42, 54, 24, 1, 55, 25 ], [ 23, 45, 15, 28, 46, 16 ], [ 17, 145, 115 ], [ 10, 74, 46, 23, 75, 47 ], [ 10, 54, 24, 35, 55, 25 ], [ 19, 45, 15, 35, 46, 16 ], [ 17, 145, 115, 1, 146, 116 ], [ 14, 74, 46, 21, 75, 47 ], [ 29, 54, 24, 19, 55, 25 ], [ 11, 45, 15, 46, 46, 16 ], [ 13, 145, 115, 6, 146, 116 ], [ 14, 74, 46, 23, 75, 47 ], [ 44, 54, 24, 7, 55, 25 ], [ 59, 46, 16, 1, 47, 17 ], [ 12, 151, 121, 7, 152, 122 ], [ 12, 75, 47, 26, 76, 48 ], [ 39, 54, 24, 14, 55, 25 ], [ 22, 45, 15, 41, 46, 16 ], [ 6, 151, 121, 14, 152, 122 ], [ 6, 75, 47, 34, 76, 48 ], [ 46, 54, 24, 10, 55, 25 ], [ 2, 45, 15, 64, 46, 16 ], [ 17, 152, 122, 4, 153, 123 ], [ 29, 74, 46, 14, 75, 47 ], [ 49, 54, 24, 10, 55, 25 ], [ 24, 45, 15, 46, 46, 16 ], [ 4, 152, 122, 18, 153, 123 ], [ 13, 74, 46, 32, 75, 47 ], [ 48, 54, 24, 14, 55, 25 ], [ 42, 45, 15, 32, 46, 16 ], [ 20, 147, 117, 4, 148, 118 ], [ 40, 75, 47, 7, 76, 48 ], [ 43, 54, 24, 22, 55, 25 ], [ 10, 45, 15, 67, 46, 16 ], [ 19, 148, 118, 6, 149, 119 ], [ 18, 75, 47, 31, 76, 48 ], [ 34, 54, 24, 34, 55, 25 ], [ 20, 45, 15, 61, 46, 16 ] ], 
    j.getRSBlocks = function(a, b) {
        var c = j.getRsBlockTable(a, b);
        if (void 0 == c) throw new Error("bad rs block @ typeNumber:" + a + "/errorCorrectLevel:" + b);
        for (var d = c.length / 3, e = [], f = 0; d > f; f++) for (var g = c[3 * f + 0], h = c[3 * f + 1], i = c[3 * f + 2], k = 0; g > k; k++) e.push(new j(h, i));
        return e;
    }, j.getRsBlockTable = function(a, b) {
        switch (b) {
          case d.L:
            return j.RS_BLOCK_TABLE[4 * (a - 1) + 0];

          case d.M:
            return j.RS_BLOCK_TABLE[4 * (a - 1) + 1];

          case d.Q:
            return j.RS_BLOCK_TABLE[4 * (a - 1) + 2];

          case d.H:
            return j.RS_BLOCK_TABLE[4 * (a - 1) + 3];

          default:
            return void 0;
        }
    }, k.prototype = {
        get: function(a) {
            var b = Math.floor(a / 8);
            return 1 == (1 & this.buffer[b] >>> 7 - a % 8);
        },
        put: function(a, b) {
            for (var c = 0; b > c; c++) this.putBit(1 == (1 & a >>> b - c - 1));
        },
        getLengthInBits: function() {
            return this.length;
        },
        putBit: function(a) {
            var b = Math.floor(this.length / 8);
            this.buffer.length <= b && this.buffer.push(0), a && (this.buffer[b] |= 128 >>> this.length % 8), 
            this.length++;
        }
    };
    var l = [ [ 17, 14, 11, 7 ], [ 32, 26, 20, 14 ], [ 53, 42, 32, 24 ], [ 78, 62, 46, 34 ], [ 106, 84, 60, 44 ], [ 134, 106, 74, 58 ], [ 154, 122, 86, 64 ], [ 192, 152, 108, 84 ], [ 230, 180, 130, 98 ], [ 271, 213, 151, 119 ], [ 321, 251, 177, 137 ], [ 367, 287, 203, 155 ], [ 425, 331, 241, 177 ], [ 458, 362, 258, 194 ], [ 520, 412, 292, 220 ], [ 586, 450, 322, 250 ], [ 644, 504, 364, 280 ], [ 718, 560, 394, 310 ], [ 792, 624, 442, 338 ], [ 858, 666, 482, 382 ], [ 929, 711, 509, 403 ], [ 1003, 779, 565, 439 ], [ 1091, 857, 611, 461 ], [ 1171, 911, 661, 511 ], [ 1273, 997, 715, 535 ], [ 1367, 1059, 751, 593 ], [ 1465, 1125, 805, 625 ], [ 1528, 1190, 868, 658 ], [ 1628, 1264, 908, 698 ], [ 1732, 1370, 982, 742 ], [ 1840, 1452, 1030, 790 ], [ 1952, 1538, 1112, 842 ], [ 2068, 1628, 1168, 898 ], [ 2188, 1722, 1228, 958 ], [ 2303, 1809, 1283, 983 ], [ 2431, 1911, 1351, 1051 ], [ 2563, 1989, 1423, 1093 ], [ 2699, 2099, 1499, 1139 ], [ 2809, 2213, 1579, 1219 ], [ 2953, 2331, 1663, 1273 ] ], o = function() {
        var a = function(a, b) {
            this._el = a, this._htOption = b;
        };
        return a.prototype.draw = function(a) {
            function g(a, b) {
                var c = document.createElementNS("http://www.w3.org/2000/svg", a);
                for (var d in b) b.hasOwnProperty(d) && c.setAttribute(d, b[d]);
                return c;
            }
            var b = this._htOption, c = this._el, d = a.getModuleCount();
            Math.floor(b.width / d), Math.floor(b.height / d), this.clear();
            var h = g("svg", {
                viewBox: "0 0 " + String(d) + " " + String(d),
                width: "100%",
                height: "100%",
                fill: b.colorLight
            });
            h.setAttributeNS("http://www.w3.org/2000/xmlns/", "xmlns:xlink", "http://www.w3.org/1999/xlink"), 
            c.appendChild(h), h.appendChild(g("rect", {
                fill: b.colorDark,
                width: "1",
                height: "1",
                id: "template"
            }));
            for (var i = 0; d > i; i++) for (var j = 0; d > j; j++) if (a.isDark(i, j)) {
                var k = g("use", {
                    x: String(i),
                    y: String(j)
                });
                k.setAttributeNS("http://www.w3.org/1999/xlink", "href", "#template"), h.appendChild(k);
            }
        }, a.prototype.clear = function() {
            for (;this._el.hasChildNodes(); ) this._el.removeChild(this._el.lastChild);
        }, a;
    }(), p = "svg" === document.documentElement.tagName.toLowerCase(), q = p ? o : m() ? function() {
        function a() {
            this._elImage.src = this._elCanvas.toDataURL("image/png"), this._elImage.style.display = "block", 
            this._elCanvas.style.display = "none";
        }
        function d(a, b) {
            var c = this;
            if (c._fFail = b, c._fSuccess = a, null === c._bSupportDataURI) {
                var d = document.createElement("img"), e = function() {
                    c._bSupportDataURI = !1, c._fFail && _fFail.call(c);
                }, f = function() {
                    c._bSupportDataURI = !0, c._fSuccess && c._fSuccess.call(c);
                };
                return d.onabort = e, d.onerror = e, d.onload = f, void (d.src = "data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg==");
            }
            c._bSupportDataURI === !0 && c._fSuccess ? c._fSuccess.call(c) : c._bSupportDataURI === !1 && c._fFail && c._fFail.call(c);
        }
        if (this._android && this._android <= 2.1) {
            var b = 1 / window.devicePixelRatio, c = CanvasRenderingContext2D.prototype.drawImage;
            CanvasRenderingContext2D.prototype.drawImage = function(a, d, e, f, g, h, i, j) {
                if ("nodeName" in a && /img/i.test(a.nodeName)) for (var l = arguments.length - 1; l >= 1; l--) arguments[l] = arguments[l] * b; else "undefined" == typeof j && (arguments[1] *= b, 
                arguments[2] *= b, arguments[3] *= b, arguments[4] *= b);
                c.apply(this, arguments);
            };
        }
        var e = function(a, b) {
            this._bIsPainted = !1, this._android = n(), this._htOption = b, this._elCanvas = document.createElement("canvas"), 
            this._elCanvas.width = b.width, this._elCanvas.height = b.height, a.appendChild(this._elCanvas), 
            this._el = a, this._oContext = this._elCanvas.getContext("2d"), this._bIsPainted = !1, 
            this._elImage = document.createElement("img"), this._elImage.style.display = "none", 
            this._el.appendChild(this._elImage), this._bSupportDataURI = null;
        };
        return e.prototype.draw = function(a) {
            var b = this._elImage, c = this._oContext, d = this._htOption, e = a.getModuleCount(), f = d.width / e, g = d.height / e, h = Math.round(f), i = Math.round(g);
            b.style.display = "none", this.clear();
            for (var j = 0; e > j; j++) for (var k = 0; e > k; k++) {
                var l = a.isDark(j, k), m = k * f, n = j * g;
                c.strokeStyle = l ? d.colorDark : d.colorLight, c.lineWidth = 1, c.fillStyle = l ? d.colorDark : d.colorLight, 
                c.fillRect(m, n, f, g), c.strokeRect(Math.floor(m) + .5, Math.floor(n) + .5, h, i), 
                c.strokeRect(Math.ceil(m) - .5, Math.ceil(n) - .5, h, i);
            }
            this._bIsPainted = !0;
        }, e.prototype.makeImage = function() {
            this._bIsPainted && d.call(this, a);
        }, e.prototype.isPainted = function() {
            return this._bIsPainted;
        }, e.prototype.clear = function() {
            this._oContext.clearRect(0, 0, this._elCanvas.width, this._elCanvas.height), this._bIsPainted = !1;
        }, e.prototype.round = function(a) {
            return a ? Math.floor(1e3 * a) / 1e3 : a;
        }, e;
    }() : function() {
        var a = function(a, b) {
            this._el = a, this._htOption = b;
        };
        return a.prototype.draw = function(a) {
            for (var b = this._htOption, c = this._el, d = a.getModuleCount(), e = Math.floor(b.width / d), f = Math.floor(b.height / d), g = [ '<table style="border:0;border-collapse:collapse;">' ], h = 0; d > h; h++) {
                g.push("<tr>");
                for (var i = 0; d > i; i++) g.push('<td style="border:0;border-collapse:collapse;padding:0;margin:0;width:' + e + "px;height:" + f + "px;background-color:" + (a.isDark(h, i) ? b.colorDark : b.colorLight) + ';"></td>');
                g.push("</tr>");
            }
            g.push("</table>"), c.innerHTML = g.join("");
            var j = c.childNodes[0], k = (b.width - j.offsetWidth) / 2, l = (b.height - j.offsetHeight) / 2;
            k > 0 && l > 0 && (j.style.margin = l + "px " + k + "px");
        }, a.prototype.clear = function() {
            this._el.innerHTML = "";
        }, a;
    }();
    QRCode = function(a, b) {
        if (this._htOption = {
            width: 256,
            height: 256,
            typeNumber: 4,
            colorDark: "#000000",
            colorLight: "#ffffff",
            correctLevel: d.H
        }, "string" == typeof b && (b = {
            text: b
        }), b) for (var c in b) this._htOption[c] = b[c];
        "string" == typeof a && (a = document.getElementById(a)), this._android = n(), this._el = a, 
        this._oQRCode = null, this._oDrawing = new q(this._el, this._htOption), this._htOption.text && this.makeCode(this._htOption.text);
    }, QRCode.prototype.makeCode = function(a) {
        this._oQRCode = new b(r(a, this._htOption.correctLevel), this._htOption.correctLevel), 
        this._oQRCode.addData(a), this._oQRCode.make(), this._el.title = a, this._oDrawing.draw(this._oQRCode), 
        this.makeImage();
    }, QRCode.prototype.makeImage = function() {
        "function" == typeof this._oDrawing.makeImage && (!this._android || this._android >= 3) && this._oDrawing.makeImage();
    }, QRCode.prototype.clear = function() {
        this._oDrawing.clear();
    }, QRCode.CorrectLevel = d;
}();

var MicroEvent = function() {};

MicroEvent.prototype = {
    bind: function(event, fct) {
        this._events = this._events || {}, this._events[event] = this._events[event] || [], 
        this._events[event].push(fct);
    },
    unbind: function(event, fct) {
        this._events = this._events || {}, event in this._events != !1 && this._events[event].splice(this._events[event].indexOf(fct), 1);
    },
    trigger: function(event) {
        if (this._events = this._events || {}, event in this._events != !1) for (var i = 0; i < this._events[event].length; i++) this._events[event][i].apply(this, Array.prototype.slice.call(arguments, 1));
    }
}, MicroEvent.mixin = function(destObject) {
    for (var props = [ "bind", "unbind", "trigger" ], i = 0; i < props.length; i++) "function" == typeof destObject ? destObject.prototype[props[i]] = MicroEvent.prototype[props[i]] : destObject[props[i]] = MicroEvent.prototype[props[i]];
}, "undefined" != typeof module && "exports" in module && (module.exports = MicroEvent), 
function(a, b) {
    function bf(a, b, c, d) {
        bf._super_.call(this), this.reset(a, b, c, d);
    }
    function be(a, b, c, d) {
        be._super_.call(this), this.x = a, this.y = b, this.width = c, this.height = d;
    }
    function bd(a, b) {
        bd._super_.call(this), this.x = a, this.y = b;
    }
    function bc(a, b, c) {
        bc._super_.call(this), this.x = a, this.y = b, this.radius = c, this.angle = 0, 
        this.center = {
            x: this.x,
            y: this.y
        };
    }
    function bb(a, b, d, e, f) {
        bb._super_.call(this), d - a >= 0 ? (this.x1 = a, this.y1 = b, this.x2 = d, this.y2 = e) : (this.x1 = d, 
        this.y1 = e, this.x2 = a, this.y2 = b), this.dx = this.x2 - this.x1, this.dy = this.y2 - this.y1, 
        this.minx = Math.min(this.x1, this.x2), this.miny = Math.min(this.y1, this.y2), 
        this.maxx = Math.max(this.x1, this.x2), this.maxy = Math.max(this.y1, this.y2), 
        this.dot = this.x2 * this.y1 - this.x1 * this.y2, this.xxyy = this.dx * this.dx + this.dy * this.dy, 
        this.gradient = this.getGradient(), this.length = this.getLength(), this.direction = c.Util.initValue(f, ">");
    }
    function ba() {
        this.vector = new c.Vector2D(0, 0), this.random = 0, this.crossType = "dead", this.alert = !0;
    }
    function _(a, b) {
        _._super_.call(this, a, b), this.gl = this.element.getContext("experimental-webgl", {
            antialias: !0,
            stencil: !1,
            depth: !1
        }), this.gl || alert("Sorry your browser do not suppest WebGL!"), this.initVar(), 
        this.setMaxRadius(), this.initShaders(), this.initBuffers(), this.gl.blendEquation(this.gl.FUNC_ADD), 
        this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA), this.gl.enable(this.gl.BLEND);
    }
    function $(a, b, c) {
        $._super_.call(this, a, b), this.context = this.element.getContext("2d"), this.imageData = null, 
        this.rectangle = null, this.rectangle = c, this.createImageData(c);
    }
    function Z(a, b) {
        Z._super_.call(this, a, b), this.stroke = null, this.context = this.element.getContext("2d"), 
        this.bufferCache = {};
    }
    function Y(a, b, c) {
        Y._super_.call(this, a, b), this.stroke = c;
    }
    function X(a, b) {
        X._super_.call(this, a, b), this.stroke = null;
    }
    function W(a, b, c) {
        this.proton = a, this.element = b, this.stroke = c;
    }
    function V(a, b, d) {
        this.element = d, this.type = c.Util.initValue(a, "canvas"), this.proton = b, this.renderer = this.getRenderer();
    }
    function T(b, d, e) {
        this.mouseTarget = c.Util.initValue(b, a), this.ease = c.Util.initValue(d, .7), 
        this._allowEmitting = !1, this.initEventHandler(), T._super_.call(this, e);
    }
    function S(a) {
        this.selfBehaviours = [], S._super_.call(this, a);
    }
    function R(a) {
        this.initializes = [], this.particles = [], this.behaviours = [], this.emitTime = 0, 
        this.emitTotalTimes = -1, this.damping = .006, this.bindEmitter = !0, this.rate = new c.Rate(1, .1), 
        R._super_.call(this, a), this.id = "emitter_" + R.ID++;
    }
    function Q(a, b, d, e) {
        Q._super_.call(this, d, e), this.distanceVec = new c.Vector2D(), this.centerPoint = c.Util.initValue(a, new c.Vector2D()), 
        this.force = c.Util.initValue(this.normalizeValue(b), 100), this.name = "GravityWell";
    }
    function P(a, b, c, d) {
        P._super_.call(this, c, d), this.reset(a, b), this.name = "Color";
    }
    function O(a, b, c, d, e) {
        O._super_.call(this, d, e), this.reset(a, b, c), this.name = "Rotate";
    }
    function N(a, b, c, d) {
        N._super_.call(this, c, d), this.reset(a, b), this.name = "Scale";
    }
    function M(a, b, c, d) {
        M._super_.call(this, c, d), this.reset(a, b), this.name = "Alpha";
    }
    function L(a, b, c, d) {
        L._super_.call(this, c, d), this.reset(a, b), this.name = "CrossZone";
    }
    function K(a, b, c, d, e) {
        K._super_.call(this, d, e), this.reset(a, b, c), this.name = "Collision";
    }
    function J(a, b, c) {
        J._super_.call(this, 0, a, b, c), this.name = "Gravity";
    }
    function I(a, b, c, d, e) {
        I._super_.call(this, a, b, c, d, e), this.force *= -1, this.name = "Repulsion";
    }
    function H(a, b, c, d, e) {
        H._super_.call(this, d, e), this.reset(a, b, c), this.time = 0, this.name = "RandomDrift";
    }
    function G(a, b, d, e, f) {
        G._super_.call(this, e, f), this.targetPosition = c.Util.initValue(a, new c.Vector2D()), 
        this.radius = c.Util.initValue(d, 1e3), this.force = c.Util.initValue(this.normalizeValue(b), 100), 
        this.radiusSq = this.radius * this.radius, this.attractionForce = new c.Vector2D(), 
        this.lengthSq = 0, this.name = "Attraction";
    }
    function F(a, b, d, e) {
        F._super_.call(this, d, e), this.force = this.normalizeForce(new c.Vector2D(a, b)), 
        this.name = "Force";
    }
    function E(a, b, d) {
        E._super_.call(this), this.image = this.setSpanValue(a), this.w = c.Util.initValue(b, 20), 
        this.h = c.Util.initValue(d, this.w);
    }
    function D(a, b, d) {
        D._super_.call(this), this.radius = c.Util.setSpanValue(a, b, d);
    }
    function C(a, b, d) {
        C._super_.call(this), this.massPan = c.Util.setSpanValue(a, b, d);
    }
    function B(a, b, d) {
        B._super_.call(this), this.rPan = c.Util.setSpanValue(a), this.thaPan = c.Util.setSpanValue(b), 
        this.type = c.Util.initValue(d, "vector");
    }
    function A(a) {
        A._super_.call(this), this.zone = c.Util.initValue(a, new c.PointZone());
    }
    function z(a, b, d) {
        z._super_.call(this), this.lifePan = c.Util.setSpanValue(a, b, d);
    }
    function x() {}
    function w(a, b) {
        this.numPan = c.Util.initValue(a, 1), this.timePan = c.Util.initValue(b, 1), this.numPan = c.Util.setSpanValue(this.numPan), 
        this.timePan = c.Util.setSpanValue(this.timePan), this.startTime = 0, this.nextTime = 0, 
        this.init();
    }
    function v(a, b) {
        this.id = "Behaviour_" + v.id++, this.life = c.Util.initValue(a, 1/0), this.easing = c.ease.setEasingByName(b), 
        this.age = 0, this.energy = 1, this.dead = !1, this.parents = [], this.name = "Behaviour";
    }
    function t(a, b, c, d) {
        this.x = a, this.y = b, this.width = c, this.height = d, this.bottom = this.y + this.height, 
        this.right = this.x + this.width;
    }
    function s(a) {
        this.colorArr = c.Util.isArray(a) ? a : [ a ];
    }
    function r(a, b, d) {
        this.isArray = !1, c.Util.isArray(a) ? (this.isArray = !0, this.a = a) : (this.a = c.Util.initValue(a, 1), 
        this.b = c.Util.initValue(b, this.a), this.center = c.Util.initValue(d, !1));
    }
    function l(a, b) {
        this.proParticleCount = c.Util.initValue(a, 0), this.releaseTime = c.Util.initValue(b, -1), 
        this.poolList = [], this.timeoutID = 0;
        for (var d = 0; d < this.proParticleCount; d++) this.add();
        this.releaseTime > 0 && (this.timeoutID = setTimeout(this.release, this.releaseTime / 1e3));
    }
    function k(a) {
        this.id = "particle_" + k.ID++, this.reset(!0), c.Util.setPrototypeByObject(this, a);
    }
    function j() {
        this.mats = [], this.size = 0;
        for (var a = 0; 20 > a; a++) this.mats.push(c.Mat3.create([ 0, 0, 0, 0, 0, 0, 0, 0, 0 ]));
    }
    function f(a) {
        this.type = "null", this.particle = null, this.emitter = null, this.particles = [], 
        c.Util.setPrototypeByObject(this, a);
    }
    function d() {
        this.initialize();
    }
    function c(a, b) {
        this.proParticleCount = c.Util.initValue(a, c.POOL_MAX), this.integrationType = c.Util.initValue(b, c.EULER), 
        this.emitters = [], this.renderers = [], this.time = 0, this.oldTime = 0, c.pool = new c.ParticlePool(this.proParticleCount), 
        c.integrator = new c.NumericalIntegration(this.integrationType);
    }
    c.POOL_MAX = 1e3, c.TIME_STEP = 60, c.MEASURE = 100, c.EULER = "euler", c.RK2 = "runge-kutta2", 
    c.RK4 = "runge-kutta4", c.VERLET = "verlet", c.PARTICLE_CREATED = "partilcleCreated", 
    c.PARTICLE_UPDATE = "partilcleUpdate", c.PARTICLE_SLEEP = "particleSleep", c.PARTICLE_DEAD = "partilcleDead", 
    c.PROTON_UPDATE = "protonUpdate", c.PROTON_UPDATE_AFTER = "protonUpdateAfter", c.EMITTER_ADDED = "emitterAdded", 
    c.EMITTER_REMOVED = "emitterRemoved", c.amendChangeTabsBug = !0, c.TextureBuffer = {}, 
    c.TextureCanvasBuffer = {}, c.prototype = {
        addRender: function(a) {
            a.proton = this, this.renderers.push(a.proton);
        },
        addEmitter: function(a) {
            this.emitters.push(a), a.parent = this, this.dispatchEvent(new c.Event({
                type: c.EMITTER_ADDED,
                emitter: a
            }));
        },
        removeEmitter: function(a) {
            var b = this.emitters.indexOf(a);
            this.emitters.splice(b, 1), a.parent = null, this.dispatchEvent(new c.Event({
                type: c.EMITTER_REMOVED,
                emitter: a
            }));
        },
        update: function() {
            this.dispatchEvent(new c.Event({
                type: c.PROTON_UPDATE
            })), this.oldTime || (this.oldTime = new Date().getTime());
            var a = new Date().getTime();
            if (this.elapsed = (a - this.oldTime) / 1e3, c.amendChangeTabsBug && this.amendChangeTabsBug(), 
            this.oldTime = a, this.elapsed > 0) for (var b = 0; b < this.emitters.length; b++) this.emitters[b].update(this.elapsed);
            this.dispatchEvent(new c.Event({
                type: c.PROTON_UPDATE_AFTER
            }));
        },
        amendChangeTabsBug: function() {
            this.elapsed > .5 && (this.oldTime = new Date().getTime(), this.elapsed = 0);
        },
        getParticleNumber: function() {
            for (var a = 0, b = 0; b < this.emitters.length; b++) a += this.emitters[b].particles.length;
            return a;
        },
        destory: function() {
            for (var a = 0; a < this.emitters.length; a++) this.emitters[a].destory(), delete this.emitters[a];
            this.emitters = [], this.time = 0, this.oldTime = 0, c.pool.release();
        }
    }, a.Proton = c;
    var e = d.prototype;
    d.initialize = function(a) {
        a.addEventListener = e.addEventListener, a.removeEventListener = e.removeEventListener, 
        a.removeAllEventListeners = e.removeAllEventListeners, a.hasEventListener = e.hasEventListener, 
        a.dispatchEvent = e.dispatchEvent;
    }, e._listeners = null, e.initialize = function() {}, e.addEventListener = function(a, b) {
        var c = this._listeners;
        c ? this.removeEventListener(a, b) : c = this._listeners = {};
        var d = c[a];
        return d || (d = c[a] = []), d.push(b), b;
    }, e.removeEventListener = function(a, b) {
        var c = this._listeners;
        if (c) {
            var d = c[a];
            if (!d) return;
            for (var e = 0, f = d.length; f > e; e++) if (d[e] == b) {
                1 == f ? delete c[a] : d.splice(e, 1);
                break;
            }
        }
    }, e.removeAllEventListeners = function(a) {
        a ? this._listeners && delete this._listeners[a] : this._listeners = null;
    }, e.dispatchEvent = function(a, b) {
        var c = !1, d = this._listeners;
        if (a && d) {
            "string" == typeof a && (a = {
                type: a
            });
            var e = d[a.type];
            if (!e) return c;
            a.target = b || this, e = e.slice();
            for (var f = 0, g = e.length; g > f; f++) {
                var h = e[f];
                c = h.handleEvent ? c || h.handleEvent(a) : c || h(a);
            }
        }
        return !!c;
    }, e.hasEventListener = function(a) {
        var b = this._listeners;
        return !!b && !!b[a];
    }, c.EventDispatcher = d, c.EventDispatcher.initialize(c.prototype), f.PARTICLE_CREATED = c.PARTICLE_CREATED, 
    f.PARTICLE_UPDATA = c.PARTICLE_UPDATA, f.PARTICLE_SLEEP = c.PARTICLE_SLEEP, f.PARTICLE_DEAD = c.PARTICLE_DEAD, 
    c.Event = f;
    var g = g || {
        initValue: function(a, c) {
            var a = null != a && a != b ? a : c;
            return a;
        },
        isArray: function(a) {
            return "object" == typeof a && a.hasOwnProperty("length");
        },
        destroyArray: function(a) {
            a.length = 0;
        },
        destroyObject: function(a) {
            for (var b in a) delete a[b];
        },
        getVector2D: function(a, b) {
            if ("object" == typeof a) return a;
            var d = new c.Vector2D(a, b);
            return d;
        },
        judgeVector2D: function(a) {
            var b = "";
            return (a.hasOwnProperty("x") || a.hasOwnProperty("y") || a.hasOwnProperty("p") || a.hasOwnProperty("position")) && (b += "p"), 
            (a.hasOwnProperty("vx") || a.hasOwnProperty("vx") || a.hasOwnProperty("v") || a.hasOwnProperty("velocity")) && (b += "v"), 
            (a.hasOwnProperty("ax") || a.hasOwnProperty("ax") || a.hasOwnProperty("a") || a.hasOwnProperty("accelerate")) && (b += "a"), 
            b;
        },
        setVector2DByObject: function(a, b) {
            b.hasOwnProperty("x") && (a.p.x = b.x), b.hasOwnProperty("y") && (a.p.y = b.y), 
            b.hasOwnProperty("vx") && (a.v.x = b.vx), b.hasOwnProperty("vy") && (a.v.y = b.vy), 
            b.hasOwnProperty("ax") && (a.a.x = b.ax), b.hasOwnProperty("ay") && (a.a.y = b.ay), 
            b.hasOwnProperty("p") && particle.p.copy(b.p), b.hasOwnProperty("v") && particle.v.copy(b.v), 
            b.hasOwnProperty("a") && particle.a.copy(b.a), b.hasOwnProperty("position") && particle.p.copy(b.position), 
            b.hasOwnProperty("velocity") && particle.v.copy(b.velocity), b.hasOwnProperty("accelerate") && particle.a.copy(b.accelerate);
        },
        addPrototypeByObject: function(a, b, d) {
            for (var e in b) d ? d.indexOf(e) < 0 && (a[e] = c.Util.getSpanValue(b[e])) : a[e] = c.Util.getSpanValue(b[e]);
            return a;
        },
        setPrototypeByObject: function(a, b, d) {
            for (var e in b) a.hasOwnProperty(e) && (d ? d.indexOf(e) < 0 && (a[e] = c.Util.getSpanValue(b[e])) : a[e] = c.Util.getSpanValue(b[e]));
            return a;
        },
        setSpanValue: function(a, b, d) {
            return a instanceof c.Span ? a : b ? d ? new c.Span(a, b, d) : new c.Span(a, b) : new c.Span(a);
        },
        getSpanValue: function(a) {
            return a instanceof c.Span ? a.getValue() : a;
        },
        inherits: function(a, b) {
            if (a._super_ = b, Object.create) a.prototype = Object.create(b.prototype, {
                constructor: {
                    value: b
                }
            }); else {
                var c = function() {};
                c.prototype = b.prototype, a.prototype = new c(), a.prototype.constructor = a;
            }
        },
        getImageData: function(a, b, c) {
            a.drawImage(b, c.x, c.y);
            var d = a.getImageData(c.x, c.y, c.width, c.height);
            return a.clearRect(c.x, c.y, c.width, c.height), d;
        },
        getImage: function(a, b, c, d) {
            "string" == typeof a ? this.loadAndSetImage(a, b, c, d) : "object" == typeof a ? this.loadAndSetImage(a.src, b, c, d) : a instanceof Image && this.loadedImage(a.src, b, c, d, a);
        },
        loadedImage: function(a, b, d, e, f) {
            if (b.target = f, b.transform.src = a, c.TextureBuffer[a] || (c.TextureBuffer[a] = b.target), 
            d) if (c.TextureCanvasBuffer[a]) b.transform.canvas = c.TextureCanvasBuffer[a]; else {
                var g = c.WebGLUtil.nhpot(b.target.width), h = c.WebGLUtil.nhpot(b.target.height);
                b.transform.canvas = c.DomUtil.createCanvas("canvas" + a, g, h);
                var i = b.transform.canvas.getContext("2d");
                i.drawImage(b.target, 0, 0, b.target.width, b.target.height), c.TextureCanvasBuffer[a] = b.transform.canvas;
            }
            e && e(b);
        },
        loadAndSetImage: function(a, b, d, e) {
            if (c.TextureBuffer[a]) this.loadedImage(a, b, d, e, c.TextureBuffer[a]); else {
                var f = this, g = new Image();
                g.onload = function(c) {
                    f.loadedImage(a, b, d, e, c.target);
                }, g.src = a;
            }
        },
        hexToRGB: function(a) {
            var b = "#" == a.charAt(0) ? a.substring(1, 7) : a, c = parseInt(b.substring(0, 2), 16), d = parseInt(b.substring(2, 4), 16), e = parseInt(b.substring(4, 6), 16);
            return {
                r: c,
                g: d,
                b: e
            };
        },
        rgbToHex: function(a) {
            return "rgb(" + a.r + ", " + a.g + ", " + a.b + ")";
        }
    };
    c.Util = g;
    var h = h || {
        ipot: function(a) {
            return 0 == (a & a - 1);
        },
        nhpot: function(a) {
            --a;
            for (var b = 1; 32 > b; b <<= 1) a |= a >> b;
            return a + 1;
        },
        makeTranslation: function(a, b) {
            return [ 1, 0, 0, 0, 1, 0, a, b, 1 ];
        },
        makeRotation: function(a) {
            var b = Math.cos(a), c = Math.sin(a);
            return [ b, -c, 0, c, b, 0, 0, 0, 1 ];
        },
        makeScale: function(a, b) {
            return [ a, 0, 0, 0, b, 0, 0, 0, 1 ];
        },
        matrixMultiply: function(a, b) {
            var c = a[0], d = a[1], e = a[2], f = a[3], g = a[4], h = a[5], i = a[6], j = a[7], k = a[8], l = b[0], m = b[1], n = b[2], o = b[3], p = b[4], q = b[5], r = b[6], s = b[7], t = b[8];
            return [ c * l + d * o + e * r, c * m + d * p + e * s, c * n + d * q + e * t, f * l + g * o + h * r, f * m + g * p + h * s, f * n + g * q + h * t, i * l + j * o + k * r, i * m + j * p + k * s, i * n + j * q + k * t ];
        }
    };
    c.WebGLUtil = h;
    var i = i || {
        createCanvas: function(a, b, c, d) {
            var e = document.createElement("canvas"), f = d ? d : "absolute";
            return e.id = a, e.width = b, e.height = c, e.style.position = f, e.style.opacity = 0, 
            this.transformDom(e, -500, -500, 0, 0), e;
        },
        transformDom: function(a, b, c, d, e) {
            a.style.WebkitTransform = "translate(" + b + "px, " + c + "px) scale(" + d + ") rotate(" + e + "deg)", 
            a.style.MozTransform = "translate(" + b + "px, " + c + "px) scale(" + d + ") rotate(" + e + "deg)", 
            a.style.OTransform = "translate(" + b + "px, " + c + "px) scale(" + d + ") rotate(" + e + "deg)", 
            a.style.msTransform = "translate(" + b + "px, " + c + "px) scale(" + d + ") rotate(" + e + "deg)", 
            a.style.transform = "translate(" + b + "px, " + c + "px) scale(" + d + ") rotate(" + e + "deg)";
        }
    };
    c.DomUtil = i, j.prototype.set = function(a, b) {
        0 == b ? c.Mat3.set(a, this.mats[0]) : c.Mat3.multiply(this.mats[b - 1], a, this.mats[b]), 
        this.size = Math.max(this.size, b + 1);
    }, j.prototype.push = function(a) {
        0 == this.size ? c.Mat3.set(a, this.mats[0]) : c.Mat3.multiply(this.mats[this.size - 1], a, this.mats[this.size]), 
        this.size++;
    }, j.prototype.pop = function() {
        this.size > 0 && this.size--;
    }, j.prototype.top = function() {
        return this.mats[this.size - 1];
    }, c.MStack = j, k.ID = 0, k.prototype = {
        getDirection: function() {
            return Math.atan2(this.v.x, -this.v.y) * (180 / Math.PI);
        },
        reset: function(a) {
            return this.life = 1/0, this.age = 0, this.energy = 1, this.dead = !1, this.sleep = !1, 
            this.target = null, this.sprite = null, this.parent = null, this.mass = 1, this.radius = 10, 
            this.alpha = 1, this.scale = 1, this.rotation = 0, this.color = null, this.easing = c.ease.setEasingByName(c.easeLinear), 
            a ? (this.transform = {}, this.p = new c.Vector2D(), this.v = new c.Vector2D(), 
            this.a = new c.Vector2D(), this.old = {
                p: new c.Vector2D(),
                v: new c.Vector2D(),
                a: new c.Vector2D()
            }, this.behaviours = []) : (c.Util.destroyObject(this.transform), this.p.set(0, 0), 
            this.v.set(0, 0), this.a.set(0, 0), this.old.p.set(0, 0), this.old.v.set(0, 0), 
            this.old.a.set(0, 0), this.removeAllBehaviours()), this.transform.rgb = {
                r: 255,
                g: 255,
                b: 255
            }, this;
        },
        update: function(a, b) {
            if (!this.sleep) {
                this.age += a;
                var d, c = this.behaviours.length;
                for (d = 0; c > d; d++) this.behaviours[d] && this.behaviours[d].applyBehaviour(this, a, b);
            }
            if (this.age >= this.life) this.destory(); else {
                var e = this.easing(this.age / this.life);
                this.energy = Math.max(1 - e, 0);
            }
        },
        addBehaviour: function(a) {
            this.behaviours.push(a), a.hasOwnProperty("parents") && a.parents.push(this), a.initialize(this);
        },
        addBehaviours: function(a) {
            var c, b = a.length;
            for (c = 0; b > c; c++) this.addBehaviour(a[c]);
        },
        removeBehaviour: function(a) {
            var b = this.behaviours.indexOf(a);
            if (b > -1) {
                var a = this.behaviours.splice(b, 1);
                a.parents = null;
            }
        },
        removeAllBehaviours: function() {
            c.Util.destroyArray(this.behaviours);
        },
        destory: function() {
            this.removeAllBehaviours(), this.energy = 0, this.dead = !0, this.parent = null;
        }
    }, c.Particle = k, l.prototype = {
        create: function(a) {
            return a ? new newTypeParticle() : new c.Particle();
        },
        getCount: function() {
            return this.poolList.length;
        },
        add: function() {
            return this.poolList.push(this.create());
        },
        get: function() {
            return 0 === this.poolList.length ? this.create() : this.poolList.pop().reset();
        },
        set: function(a) {
            return this.poolList.length < c.POOL_MAX ? this.poolList.push(a) : void 0;
        },
        release: function() {
            for (var a = 0; a < this.poolList.length; a++) this.poolList[a].destory && this.poolList[a].destory(), 
            delete this.poolList[a];
            this.poolList = [];
        }
    }, c.ParticlePool = l;
    var m = {
        randomAToB: function(a, b, c) {
            return c ? Math.floor(Math.random() * (b - a)) + a : a + Math.random() * (b - a);
        },
        randomFloating: function(a, b, c) {
            return m.randomAToB(a - b, a + b, c);
        },
        randomZone: function() {},
        degreeTransform: function(a) {
            return a * Math.PI / 180;
        },
        toColor16: function(a) {
            return "#" + a.toString(16);
        },
        randomColor: function() {
            return "#" + ("00000" + (16777216 * Math.random() << 0).toString(16)).slice(-6);
        }
    };
    c.MathUtils = m;
    var o = function(a) {
        this.type = c.Util.initValue(a, c.EULER);
    };
    o.prototype = {
        integrate: function(a, b, c) {
            this.eulerIntegrate(a, b, c);
        },
        eulerIntegrate: function(a, b, c) {
            a.sleep || (a.old.p.copy(a.p), a.old.v.copy(a.v), a.a.multiplyScalar(1 / a.mass), 
            a.v.add(a.a.multiplyScalar(b)), a.p.add(a.old.v.multiplyScalar(b)), c && a.v.multiplyScalar(c), 
            a.a.clear());
        }
    }, c.NumericalIntegration = o;
    var p = function(a, b) {
        this.x = a || 0, this.y = b || 0;
    };
    p.prototype = {
        set: function(a, b) {
            return this.x = a, this.y = b, this;
        },
        setX: function(a) {
            return this.x = a, this;
        },
        setY: function(a) {
            return this.y = a, this;
        },
        setComponent: function(a, b) {
            switch (a) {
              case 0:
                this.x = b;
                break;

              case 1:
                this.y = b;
                break;

              default:
                throw new Error("index is out of range: " + a);
            }
        },
        getGradient: function() {
            return 0 != this.x ? Math.atan2(this.y, this.x) : this.y > 0 ? Math.PI / 2 : this.y < 0 ? -Math.PI / 2 : void 0;
        },
        getComponent: function(a) {
            switch (a) {
              case 0:
                return this.x;

              case 1:
                return this.y;

              default:
                throw new Error("index is out of range: " + a);
            }
        },
        copy: function(a) {
            return this.x = a.x, this.y = a.y, this;
        },
        add: function(a, c) {
            return c !== b ? this.addVectors(a, c) : (this.x += a.x, this.y += a.y, this);
        },
        addXY: function(a, b) {
            return this.x += a, this.y += b, this;
        },
        addVectors: function(a, b) {
            return this.x = a.x + b.x, this.y = a.y + b.y, this;
        },
        addScalar: function(a) {
            return this.x += a, this.y += a, this;
        },
        sub: function(a, c) {
            return c !== b ? this.subVectors(a, c) : (this.x -= a.x, this.y -= a.y, this);
        },
        subVectors: function(a, b) {
            return this.x = a.x - b.x, this.y = a.y - b.y, this;
        },
        multiplyScalar: function(a) {
            return this.x *= a, this.y *= a, this;
        },
        divideScalar: function(a) {
            return 0 !== a ? (this.x /= a, this.y /= a) : this.set(0, 0), this;
        },
        min: function(a) {
            return this.x > a.x && (this.x = a.x), this.y > a.y && (this.y = a.y), this;
        },
        max: function(a) {
            return this.x < a.x && (this.x = a.x), this.y < a.y && (this.y = a.y), this;
        },
        clamp: function(a, b) {
            return this.x < a.x ? this.x = a.x : this.x > b.x && (this.x = b.x), this.y < a.y ? this.y = a.y : this.y > b.y && (this.y = b.y), 
            this;
        },
        negate: function() {
            return this.multiplyScalar(-1);
        },
        dot: function(a) {
            return this.x * a.x + this.y * a.y;
        },
        lengthSq: function() {
            return this.x * this.x + this.y * this.y;
        },
        length: function() {
            return Math.sqrt(this.x * this.x + this.y * this.y);
        },
        normalize: function() {
            return this.divideScalar(this.length());
        },
        distanceTo: function(a) {
            return Math.sqrt(this.distanceToSquared(a));
        },
        rotate: function(a) {
            var b = this.x, c = this.y;
            return this.x = b * Math.cos(a) + c * Math.sin(a), this.y = -b * Math.sin(a) + c * Math.cos(a), 
            this;
        },
        distanceToSquared: function(a) {
            var b = this.x - a.x, c = this.y - a.y;
            return b * b + c * c;
        },
        setLength: function(a) {
            var b = this.length();
            return 0 !== b && a !== b && this.multiplyScalar(a / b), this;
        },
        lerp: function(a, b) {
            return this.x += (a.x - this.x) * b, this.y += (a.y - this.y) * b, this;
        },
        equals: function(a) {
            return a.x === this.x && a.y === this.y;
        },
        toArray: function() {
            return [ this.x, this.y ];
        },
        clear: function() {
            return this.x = 0, this.y = 0, this;
        },
        clone: function() {
            return new c.Vector2D(this.x, this.y);
        }
    }, c.Vector2D = p;
    var q = function(a, b) {
        this.r = Math.abs(a) || 0, this.tha = b || 0;
    };
    q.prototype = {
        set: function(a, b) {
            return this.r = a, this.tha = b, this;
        },
        setR: function(a) {
            return this.r = a, this;
        },
        setTha: function(a) {
            return this.tha = a, this;
        },
        copy: function(a) {
            return this.r = a.r, this.tha = a.tha, this;
        },
        toVector: function() {
            return new c.Vector2D(this.getX(), this.getY());
        },
        getX: function() {
            return this.r * Math.sin(this.tha);
        },
        getY: function() {
            return -this.r * Math.cos(this.tha);
        },
        normalize: function() {
            return this.r = 1, this;
        },
        equals: function(a) {
            return a.r === this.r && a.tha === this.tha;
        },
        toArray: function() {
            return [ this.r, this.tha ];
        },
        clear: function() {
            return this.r = 0, this.tha = 0, this;
        },
        clone: function() {
            return new c.Polar2D(this.r, this.tha);
        }
    }, c.Polar2D = q, r.prototype = {
        getValue: function(a) {
            return this.isArray ? this.a[Math.floor(this.a.length * Math.random())] : this.center ? c.MathUtils.randomFloating(this.a, this.b, a) : c.MathUtils.randomAToB(this.a, this.b, a);
        }
    }, c.Span = r, c.getSpan = function(a, b, d) {
        return new c.Span(a, b, d);
    }, c.Util.inherits(s, c.Span), s.prototype.getValue = function() {
        var a = this.colorArr[Math.floor(this.colorArr.length * Math.random())];
        return "random" == a || "Random" == a ? c.MathUtils.randomColor() : a;
    }, c.ColorSpan = s, t.prototype = {
        contains: function(a, b) {
            return a <= this.right && a >= this.x && b <= this.bottom && b >= this.y ? !0 : !1;
        }
    }, c.Rectangle = t;
    var u = u || {
        create: function(a) {
            var b = new Float32Array(9);
            return a && this.set(a, b), b;
        },
        set: function(a, b) {
            for (var c = 0; 9 > c; c++) b[c] = a[c];
            return b;
        },
        multiply: function(a, b, c) {
            var d = a[0], e = a[1], f = a[2], g = a[3], h = a[4], i = a[6], j = a[7], k = b[0], l = b[1], m = b[2], n = b[3], o = b[4], p = b[6], q = b[7];
            return c[0] = k * d + l * g, c[1] = k * e + l * h, c[2] = f * m, c[3] = n * d + o * g, 
            c[4] = n * e + o * h, c[6] = p * d + q * g + i, c[7] = p * e + q * h + j, c;
        },
        inverse: function(a, b) {
            var m, c = a[0], d = a[1], e = a[3], f = a[4], g = a[6], h = a[7], i = f, j = -e, k = h * e - f * g, l = c * i + d * j;
            return m = 1 / l, b[0] = i * m, b[1] = -d * m, b[3] = j * m, b[4] = c * m, b[6] = k * m, 
            b[7] = (-h * c + d * g) * m, b;
        },
        multiplyVec2: function(a, b, c) {
            var d = b[0], e = b[1];
            return c[0] = d * a[0] + e * a[3] + a[6], c[1] = d * a[1] + e * a[4] + a[7], c;
        }
    };
    c.Mat3 = u, v.id = 0, v.prototype = {
        reset: function(a, b) {
            this.life = c.Util.initValue(a, 1/0), this.easing = c.Util.initValue(b, c.ease.setEasingByName(c.easeLinear));
        },
        normalizeForce: function(a) {
            return a.multiplyScalar(c.MEASURE);
        },
        normalizeValue: function(a) {
            return a * c.MEASURE;
        },
        initialize: function() {},
        applyBehaviour: function(a, b) {
            if (this.age += b, this.age >= this.life || this.dead) this.energy = 0, this.dead = !0, 
            this.destory(); else {
                var d = this.easing(a.age / a.life);
                this.energy = Math.max(1 - d, 0);
            }
        },
        destory: function() {
            var c, b = this.parents.length;
            for (c = 0; b > c; c++) this.parents[c].removeBehaviour(this);
            this.parents = [];
        }
    }, c.Behaviour = v, w.prototype = {
        init: function() {
            this.startTime = 0, this.nextTime = this.timePan.getValue();
        },
        getValue: function(a) {
            return this.startTime += a, this.startTime >= this.nextTime ? (this.startTime = 0, 
            this.nextTime = this.timePan.getValue(), 1 == this.numPan.b ? this.numPan.getValue(!1) > .5 ? 1 : 0 : this.numPan.getValue(!0)) : 0;
        }
    }, c.Rate = w, x.prototype.reset = function() {}, x.prototype.init = function(a, b) {
        this.initialize(b ? b : a);
    }, x.prototype.initialize = function() {}, c.Initialize = x;
    var y = {
        initialize: function(a, b, d) {
            var f, e = d.length;
            for (f = 0; e > f; f++) d[f] instanceof c.Initialize ? d[f].init(a, b) : c.InitializeUtil.init(a, b, d[f]);
            c.InitializeUtil.bindEmitter(a, b);
        },
        init: function(a, b, d) {
            c.Util.setPrototypeByObject(b, d), c.Util.setVector2DByObject(b, d);
        },
        bindEmitter: function(a, b) {
            a.bindEmitter && (b.p.add(a.p), b.v.add(a.v), b.a.add(a.a), b.v.rotate(c.MathUtils.degreeTransform(a.rotation)));
        }
    };
    c.InitializeUtil = y, c.Util.inherits(z, c.Initialize), z.prototype.initialize = function(a) {
        a.life = 1/0 == this.lifePan.a ? 1/0 : this.lifePan.getValue();
    }, c.Life = z, c.Util.inherits(A, c.Initialize), A.prototype.reset = function(a) {
        this.zone = c.Util.initValue(a, new c.PointZone());
    }, A.prototype.initialize = function(a) {
        this.zone.getPosition(), a.p.x = this.zone.vector.x, a.p.y = this.zone.vector.y;
    }, c.Position = A, c.P = A, c.Util.inherits(B, c.Initialize), B.prototype.reset = function(a, b, d) {
        this.rPan = c.Util.setSpanValue(a), this.thaPan = c.Util.setSpanValue(b), this.type = c.Util.initValue(d, "vector");
    }, B.prototype.normalizeVelocity = function(a) {
        return a * c.MEASURE;
    }, B.prototype.initialize = function(a) {
        if ("p" == this.type || "P" == this.type || "polar" == this.type) {
            var b = new c.Polar2D(this.normalizeVelocity(this.rPan.getValue()), this.thaPan.getValue() * Math.PI / 180);
            a.v.x = b.getX(), a.v.y = b.getY();
        } else a.v.x = this.normalizeVelocity(this.rPan.getValue()), a.v.y = this.normalizeVelocity(this.thaPan.getValue());
    }, c.Velocity = B, c.V = B, c.Util.inherits(C, c.Initialize), C.prototype.initialize = function(a) {
        a.mass = this.massPan.getValue();
    }, c.Mass = C, c.Util.inherits(D, c.Initialize), D.prototype.reset = function(a, b, d) {
        this.radius = c.Util.setSpanValue(a, b, d);
    }, D.prototype.initialize = function(a) {
        a.radius = this.radius.getValue(), a.transform.oldRadius = a.radius;
    }, c.Radius = D, c.Util.inherits(E, c.Initialize), E.prototype.initialize = function(a) {
        var b = this.image.getValue();
        a.target = "string" == typeof b ? {
            width: this.w,
            height: this.h,
            src: b
        } : b;
    }, E.prototype.setSpanValue = function(a) {
        return a instanceof c.ColorSpan ? a : new c.ColorSpan(a);
    }, c.ImageTarget = E, c.Util.inherits(F, c.Behaviour), F.prototype.reset = function(a, b, d, e) {
        this.force = this.normalizeForce(new c.Vector2D(a, b)), d && F._super_.prototype.reset.call(this, d, e);
    }, F.prototype.applyBehaviour = function(a, b, c) {
        F._super_.prototype.applyBehaviour.call(this, a, b, c), a.a.add(this.force);
    }, c.Force = F, c.F = F, c.Util.inherits(G, c.Behaviour), G.prototype.reset = function(a, b, d, e, f) {
        this.targetPosition = c.Util.initValue(a, new c.Vector2D()), this.radius = c.Util.initValue(d, 1e3), 
        this.force = c.Util.initValue(this.normalizeValue(b), 100), this.radiusSq = this.radius * this.radius, 
        this.attractionForce = new c.Vector2D(), this.lengthSq = 0, e && G._super_.prototype.reset.call(this, e, f);
    }, G.prototype.applyBehaviour = function(a, b, c) {
        G._super_.prototype.applyBehaviour.call(this, a, b, c), this.attractionForce.copy(this.targetPosition), 
        this.attractionForce.sub(a.p), this.lengthSq = this.attractionForce.lengthSq(), 
        this.lengthSq > 4e-6 && this.lengthSq < this.radiusSq && (this.attractionForce.normalize(), 
        this.attractionForce.multiplyScalar(1 - this.lengthSq / this.radiusSq), this.attractionForce.multiplyScalar(this.force), 
        a.a.add(this.attractionForce));
    }, c.Attraction = G, c.Util.inherits(H, c.Behaviour), H.prototype.reset = function(a, b, d, e, f) {
        this.panFoce = new c.Vector2D(a, b), this.panFoce = this.normalizeForce(this.panFoce), 
        this.delay = d, e && H._super_.prototype.reset.call(this, e, f);
    }, H.prototype.applyBehaviour = function(a, b, d) {
        H._super_.prototype.applyBehaviour.call(this, a, b, d), this.time += b, this.time >= this.delay && (a.a.addXY(c.MathUtils.randomAToB(-this.panFoce.x, this.panFoce.x), c.MathUtils.randomAToB(-this.panFoce.y, this.panFoce.y)), 
        this.time = 0);
    }, c.RandomDrift = H, c.Util.inherits(I, c.Attraction), I.prototype.reset = function(a, b, c, d, e) {
        I._super_.prototype.reset.call(this, a, b, c, d, e), this.force *= -1;
    }, c.Repulsion = I, c.Util.inherits(J, c.Force), J.prototype.reset = function(a, b, c) {
        J._super_.prototype.reset.call(this, 0, a, b, c);
    }, c.Gravity = J, c.G = J, c.Util.inherits(K, c.Behaviour), K.prototype.reset = function(a, b, d, e, f) {
        this.emitter = c.Util.initValue(a, null), this.mass = c.Util.initValue(b, !0), this.callback = c.Util.initValue(d, null), 
        this.collisionPool = [], this.delta = new c.Vector2D(), e && K._super_.prototype.reset.call(this, e, f);
    }, K.prototype.applyBehaviour = function(a, b, c) {
        for (var e, f, g, h, i, d = this.emitter ? this.emitter.particles.slice(c) : this.pool.slice(c), j = d.length, k = 0; j > k; k++) e = d[k], 
        e !== a && (this.delta.copy(e.p), this.delta.sub(a.p), f = this.delta.lengthSq(), 
        distance = a.radius + e.radius, distance * distance >= f && (g = distance - Math.sqrt(f), 
        g += .5, totalMass = a.mass + e.mass, h = this.mass ? e.mass / totalMass : .5, i = this.mass ? a.mass / totalMass : .5, 
        a.p.add(this.delta.clone().normalize().multiplyScalar(g * -h)), e.p.add(this.delta.normalize().multiplyScalar(g * i)), 
        this.callback && this.callback(a, e)));
    }, c.Collision = K, c.Util.inherits(L, c.Behaviour), L.prototype.reset = function(a, b, d, e) {
        this.zone = a, this.zone.crossType = c.Util.initValue(b, "dead"), d && L._super_.prototype.reset.call(this, d, e);
    }, L.prototype.applyBehaviour = function(a, b, c) {
        L._super_.prototype.applyBehaviour.call(this, a, b, c), this.zone.crossing(a);
    }, c.CrossZone = L, c.Util.inherits(M, c.Behaviour), M.prototype.reset = function(a, d, e, f) {
        this.same = null == d || d == b ? !0 : !1, this.a = c.Util.setSpanValue(c.Util.initValue(a, 1)), 
        this.b = c.Util.setSpanValue(d), e && M._super_.prototype.reset.call(this, e, f);
    }, M.prototype.initialize = function(a) {
        a.transform.alphaA = this.a.getValue(), a.transform.alphaB = this.same ? a.transform.alphaA : this.b.getValue();
    }, M.prototype.applyBehaviour = function(a, b, c) {
        M._super_.prototype.applyBehaviour.call(this, a, b, c), a.alpha = a.transform.alphaB + (a.transform.alphaA - a.transform.alphaB) * this.energy, 
        a.alpha < .001 && (a.alpha = 0);
    }, c.Alpha = M, c.Util.inherits(N, c.Behaviour), N.prototype.reset = function(a, d, e, f) {
        this.same = null == d || d == b ? !0 : !1, this.a = c.Util.setSpanValue(c.Util.initValue(a, 1)), 
        this.b = c.Util.setSpanValue(d), e && N._super_.prototype.reset.call(this, e, f);
    }, N.prototype.initialize = function(a) {
        a.transform.scaleA = this.a.getValue(), a.transform.oldRadius = a.radius, a.transform.scaleB = this.same ? a.transform.scaleA : this.b.getValue();
    }, N.prototype.applyBehaviour = function(a, b, c) {
        N._super_.prototype.applyBehaviour.call(this, a, b, c), a.scale = a.transform.scaleB + (a.transform.scaleA - a.transform.scaleB) * this.energy, 
        a.scale < 1e-4 && (a.scale = 0), a.radius = a.transform.oldRadius * a.scale;
    }, c.Scale = N, c.Util.inherits(O, c.Behaviour), O.prototype.reset = function(a, d, e, f, g) {
        this.same = null == d || d == b ? !0 : !1, this.a = c.Util.setSpanValue(c.Util.initValue(a, "Velocity")), 
        this.b = c.Util.setSpanValue(c.Util.initValue(d, 0)), this.style = c.Util.initValue(e, "to"), 
        f && O._super_.prototype.reset.call(this, f, g);
    }, O.prototype.initialize = function(a) {
        a.rotation = this.a.getValue(), a.transform.rotationA = this.a.getValue(), this.same || (a.transform.rotationB = this.b.getValue());
    }, O.prototype.applyBehaviour = function(a, b, c) {
        O._super_.prototype.applyBehaviour.call(this, a, b, c), this.same ? ("V" == this.a.a || "Velocity" == this.a.a || "v" == this.a.a) && (a.rotation = a.getDirection()) : a.rotation += "to" == this.style || "TO" == this.style || "_" == this.style ? a.transform.rotationB + (a.transform.rotationA - a.transform.rotationB) * this.energy : a.transform.rotationB;
    }, c.Rotate = O, c.Util.inherits(P, c.Behaviour), P.prototype.reset = function(a, b, c, d) {
        this.color1 = this.setSpanValue(a), this.color2 = this.setSpanValue(b), c && P._super_.prototype.reset.call(this, c, d);
    }, P.prototype.initialize = function(a) {
        a.color = this.color1.getValue(), a.transform.beginRGB = c.Util.hexToRGB(a.color), 
        this.color2 && (a.transform.endRGB = c.Util.hexToRGB(this.color2.getValue()));
    }, P.prototype.applyBehaviour = function(a, b, c) {
        this.color2 ? (P._super_.prototype.applyBehaviour.call(this, a, b, c), a.transform.rgb.r = a.transform.endRGB.r + (a.transform.beginRGB.r - a.transform.endRGB.r) * this.energy, 
        a.transform.rgb.g = a.transform.endRGB.g + (a.transform.beginRGB.g - a.transform.endRGB.g) * this.energy, 
        a.transform.rgb.b = a.transform.endRGB.b + (a.transform.beginRGB.b - a.transform.endRGB.b) * this.energy, 
        a.transform.rgb.r = parseInt(a.transform.rgb.r, 10), a.transform.rgb.g = parseInt(a.transform.rgb.g, 10), 
        a.transform.rgb.b = parseInt(a.transform.rgb.b, 10)) : (a.transform.rgb.r = a.transform.beginRGB.r, 
        a.transform.rgb.g = a.transform.beginRGB.g, a.transform.rgb.b = a.transform.beginRGB.b);
    }, P.prototype.setSpanValue = function(a) {
        return a ? a instanceof c.ColorSpan ? a : new c.ColorSpan(a) : null;
    }, c.Color = P, c.Util.inherits(Q, c.Behaviour), Q.prototype.reset = function(a, b, d, e) {
        this.distanceVec = new c.Vector2D(), this.centerPoint = c.Util.initValue(a, new c.Vector2D()), 
        this.force = c.Util.initValue(this.normalizeValue(b), 100), d && Q._super_.prototype.reset.call(this, d, e);
    }, Q.prototype.initialize = function() {}, Q.prototype.applyBehaviour = function(a, b) {
        this.distanceVec.set(this.centerPoint.x - a.p.x, this.centerPoint.y - a.p.y);
        var d = this.distanceVec.lengthSq();
        if (0 != d) {
            var e = this.distanceVec.length(), f = this.force * b / (d * e);
            a.v.x += f * this.distanceVec.x, a.v.y += f * this.distanceVec.y;
        }
    }, c.GravityWell = Q, R.ID = 0, c.Util.inherits(R, c.Particle), c.EventDispatcher.initialize(R.prototype), 
    R.prototype.emit = function(a, b) {
        this.emitTime = 0, this.emitTotalTimes = c.Util.initValue(a, 1/0), 1 == b || "life" == b || "destroy" == b ? this.life = "once" == a ? 1 : this.emitTotalTimes : isNaN(b) || (this.life = b), 
        this.rate.init();
    }, R.prototype.stopEmit = function() {
        this.emitTotalTimes = -1, this.emitTime = 0;
    }, R.prototype.removeAllParticles = function() {
        for (var a = 0; a < this.particles.length; a++) this.particles[a].dead = !0;
    }, R.prototype.createParticle = function(a, b) {
        var d = c.pool.get();
        return this.setupParticle(d, a, b), this.dispatchEvent(new c.Event({
            type: c.PARTICLE_CREATED,
            particle: d
        })), d;
    }, R.prototype.addSelfInitialize = function(a) {
        a.init ? a.init(this) : this.initAll();
    }, R.prototype.addInitialize = function() {
        var b, a = arguments.length;
        for (b = 0; a > b; b++) this.initializes.push(arguments[b]);
    }, R.prototype.removeInitialize = function(a) {
        var b = this.initializes.indexOf(a);
        b > -1 && this.initializes.splice(b, 1);
    }, R.prototype.removeInitializers = function() {
        c.Util.destroyArray(this.initializes);
    }, R.prototype.addBehaviour = function() {
        var b, a = arguments.length;
        for (b = 0; a > b; b++) this.behaviours.push(arguments[b]), arguments[b].hasOwnProperty("parents") && arguments[b].parents.push(this);
    }, R.prototype.removeBehaviour = function(a) {
        var b = this.behaviours.indexOf(a);
        b > -1 && this.behaviours.splice(b, 1);
    }, R.prototype.removeAllBehaviours = function() {
        c.Util.destroyArray(this.behaviours);
    }, R.prototype.integrate = function(a) {
        var b = 1 - this.damping;
        c.integrator.integrate(this, a, b);
        var e, d = this.particles.length;
        for (e = 0; d > e; e++) {
            var f = this.particles[e];
            f.update(a, e), c.integrator.integrate(f, a, b), this.dispatchEvent(new c.Event({
                type: c.PARTICLE_UPDATE,
                particle: f
            }));
        }
    }, R.prototype.emitting = function(a) {
        if ("once" == this.emitTotalTimes) {
            var c, b = this.rate.getValue(99999);
            for (c = 0; b > c; c++) this.createParticle();
            this.emitTotalTimes = "none";
        } else if (!isNaN(this.emitTotalTimes) && (this.emitTime += a, this.emitTime < this.emitTotalTimes)) {
            var c, b = this.rate.getValue(a);
            for (c = 0; b > c; c++) this.createParticle();
        }
    }, R.prototype.update = function(a) {
        this.age += a, (this.age >= this.life || this.dead) && this.destroy(), this.emitting(a), 
        this.integrate(a);
        var b, e, d = this.particles.length;
        for (e = d - 1; e >= 0; e--) b = this.particles[e], b.dead && (c.pool.set(b), this.particles.splice(e, 1), 
        this.dispatchEvent(new c.Event({
            type: c.PARTICLE_DEAD,
            particle: b
        })));
    }, R.prototype.setupParticle = function(a, b, d) {
        var e = this.initializes, f = this.behaviours;
        b && (e = b instanceof Array ? b : [ b ]), d && (f = d instanceof Array ? d : [ d ]), 
        c.InitializeUtil.initialize(this, a, e), a.addBehaviours(f), a.parent = this, this.particles.push(a);
    }, R.prototype.destroy = function() {
        this.dead = !0, this.emitTotalTimes = -1, 0 == this.particles.length && (this.removeInitializers(), 
        this.removeAllBehaviours(), this.parent && this.parent.removeEmitter(this));
    }, c.Emitter = R, c.Util.inherits(S, c.Emitter), S.prototype.addSelfBehaviour = function() {
        var b, a = arguments.length;
        for (b = 0; a > b; b++) this.selfBehaviours.push(arguments[b]);
    }, S.prototype.removeSelfBehaviour = function(a) {
        var b = this.selfBehaviours.indexOf(a);
        b > -1 && this.selfBehaviours.splice(b, 1);
    }, S.prototype.update = function(a) {
        if (S._super_.prototype.update.call(this, a), !this.sleep) {
            var c, b = this.selfBehaviours.length;
            for (c = 0; b > c; c++) this.selfBehaviours[c].applyBehaviour(this, a, c);
        }
    }, c.BehaviourEmitter = S, c.Util.inherits(T, c.Emitter), T.prototype.initEventHandler = function() {
        var a = this;
        this.mousemoveHandler = function(b) {
            a.mousemove.call(a, b);
        }, this.mousedownHandler = function(b) {
            a.mousedown.call(a, b);
        }, this.mouseupHandler = function(b) {
            a.mouseup.call(a, b);
        }, this.mouseTarget.addEventListener("mousemove", this.mousemoveHandler, !1);
    }, T.prototype.emit = function() {
        this._allowEmitting = !0;
    }, T.prototype.stopEmit = function() {
        this._allowEmitting = !1;
    }, T.prototype.mousemove = function(a) {
        a.layerX || 0 == a.layerX ? (this.p.x += (a.layerX - this.p.x) * this.ease, this.p.y += (a.layerY - this.p.y) * this.ease) : (a.offsetX || 0 == a.offsetX) && (this.p.x += (a.offsetX - this.p.x) * this.ease, 
        this.p.y += (a.offsetY - this.p.y) * this.ease), this._allowEmitting && T._super_.prototype.emit.call(this, "once");
    }, T.prototype.destroy = function() {
        T._super_.prototype.destroy.call(this), this.mouseTarget.removeEventListener("mousemove", this.mousemoveHandler, !1);
    }, c.FollowEmitter = T;
    var U = U || {
        easeLinear: function(a) {
            return a;
        },
        easeInQuad: function(a) {
            return Math.pow(a, 2);
        },
        easeOutQuad: function(a) {
            return -(Math.pow(a - 1, 2) - 1);
        },
        easeInOutQuad: function(a) {
            return (a /= .5) < 1 ? .5 * Math.pow(a, 2) : -.5 * ((a -= 2) * a - 2);
        },
        easeInCubic: function(a) {
            return Math.pow(a, 3);
        },
        easeOutCubic: function(a) {
            return Math.pow(a - 1, 3) + 1;
        },
        easeInOutCubic: function(a) {
            return (a /= .5) < 1 ? .5 * Math.pow(a, 3) : .5 * (Math.pow(a - 2, 3) + 2);
        },
        easeInQuart: function(a) {
            return Math.pow(a, 4);
        },
        easeOutQuart: function(a) {
            return -(Math.pow(a - 1, 4) - 1);
        },
        easeInOutQuart: function(a) {
            return (a /= .5) < 1 ? .5 * Math.pow(a, 4) : -.5 * ((a -= 2) * Math.pow(a, 3) - 2);
        },
        easeInSine: function(a) {
            return -Math.cos(a * (Math.PI / 2)) + 1;
        },
        easeOutSine: function(a) {
            return Math.sin(a * (Math.PI / 2));
        },
        easeInOutSine: function(a) {
            return -.5 * (Math.cos(Math.PI * a) - 1);
        },
        easeInExpo: function(a) {
            return 0 === a ? 0 : Math.pow(2, 10 * (a - 1));
        },
        easeOutExpo: function(a) {
            return 1 === a ? 1 : -Math.pow(2, -10 * a) + 1;
        },
        easeInOutExpo: function(a) {
            return 0 === a ? 0 : 1 === a ? 1 : (a /= .5) < 1 ? .5 * Math.pow(2, 10 * (a - 1)) : .5 * (-Math.pow(2, -10 * --a) + 2);
        },
        easeInCirc: function(a) {
            return -(Math.sqrt(1 - a * a) - 1);
        },
        easeOutCirc: function(a) {
            return Math.sqrt(1 - Math.pow(a - 1, 2));
        },
        easeInOutCirc: function(a) {
            return (a /= .5) < 1 ? -.5 * (Math.sqrt(1 - a * a) - 1) : .5 * (Math.sqrt(1 - (a -= 2) * a) + 1);
        },
        easeInBack: function(a) {
            var b = 1.70158;
            return a * a * ((b + 1) * a - b);
        },
        easeOutBack: function(a) {
            var b = 1.70158;
            return (a -= 1) * a * ((b + 1) * a + b) + 1;
        },
        easeInOutBack: function(a) {
            var b = 1.70158;
            return (a /= .5) < 1 ? .5 * a * a * (((b *= 1.525) + 1) * a - b) : .5 * ((a -= 2) * a * (((b *= 1.525) + 1) * a + b) + 2);
        },
        setEasingByName: function(a) {
            switch (a) {
              case "easeLinear":
                return c.ease.easeLinear;

              case "easeInQuad":
                return c.ease.easeInQuad;

              case "easeOutQuad":
                return c.ease.easeOutQuad;

              case "easeInOutQuad":
                return c.ease.easeInOutQuad;

              case "easeInCubic":
                return c.ease.easeInCubic;

              case "easeOutCubic":
                return c.ease.easeOutCubic;

              case "easeInOutCubic":
                return c.ease.easeInOutCubic;

              case "easeInQuart":
                return c.ease.easeInQuart;

              case "easeOutQuart":
                return c.ease.easeOutQuart;

              case "easeInOutQuart":
                return c.ease.easeInOutQuart;

              case "easeInSine":
                return c.ease.easeInSine;

              case "easeOutSine":
                return c.ease.easeOutSine;

              case "easeInOutSine":
                return c.ease.easeInOutSine;

              case "easeInExpo":
                return c.ease.easeInExpo;

              case "easeOutExpo":
                return c.ease.easeOutExpo;

              case "easeInOutExpo":
                return c.ease.easeInOutExpo;

              case "easeInCirc":
                return c.ease.easeInCirc;

              case "easeOutCirc":
                return c.ease.easeOutCirc;

              case "easeInOutCirc":
                return c.ease.easeInOutCirc;

              case "easeInBack":
                return c.ease.easeInBack;

              case "easeOutBack":
                return c.ease.easeOutBack;

              case "easeInOutBack":
                return c.ease.easeInOutBack;

              default:
                return c.ease.easeLinear;
            }
        }
    };
    c.ease = U, c.easeLinear = "easeLinear", c.easeInQuad = "easeInQuad", c.easeOutQuad = "easeOutQuad", 
    c.easeInOutQuad = "easeInOutQuad", c.easeInCubic = "easeInCubic", c.easeOutCubic = "easeOutCubic", 
    c.easeInOutCubic = "easeInOutCubic", c.easeInQuart = "easeInQuart", c.easeOutQuart = "easeOutQuart", 
    c.easeInOutQuart = "easeInOutQuart", c.easeInSine = "easeInSine", c.easeOutSine = "easeOutSine", 
    c.easeInOutSine = "easeInOutSine", c.easeInExpo = "easeInExpo", c.easeOutExpo = "easeOutExpo", 
    c.easeInOutExpo = "easeInOutExpo", c.easeInCirc = "easeInCirc", c.easeOutCirc = "easeOutCirc", 
    c.easeInOutCirc = "easeInOutCirc", c.easeInBack = "easeInBack", c.easeOutBack = "easeOutBack", 
    c.easeInOutBack = "easeInOutBack", V.prototype = {
        start: function() {
            this.addEventHandler(), this.renderer.start();
        },
        stop: function() {
            this.renderer.stop();
        },
        resize: function(a, b) {
            this.renderer.resize(a, b);
        },
        setStroke: function(a, b) {
            this.renderer.hasOwnProperty("stroke") ? this.renderer.setStroke(a, b) : alert("Sorry this renderer do not suppest stroke method!");
        },
        createImageData: function(a) {
            this.renderer instanceof c.PixelRender && this.renderer.createImageData(a);
        },
        setMaxRadius: function(a) {
            this.renderer instanceof c.WebGLRender && this.renderer.setMaxRadius(a);
        },
        blendEquation: function(a) {
            this.renderer instanceof c.WebGLRender && this.renderer.blendEquation(a);
        },
        blendFunc: function(a, b) {
            this.renderer instanceof c.WebGLRender && this.renderer.blendFunc(a, b);
        },
        setType: function(a) {
            this.type = a, this.renderer = this.getRenderer();
        },
        getRenderer: function() {
            switch (this.type) {
              case "dom":
                return new c.DomRender(this.proton, this.element);

              case "canvas":
                return new c.CanvasRender(this.proton, this.element);

              case "webgl":
                return new c.WebGLRender(this.proton, this.element);

              case "easel":
                return new c.EaselRender(this.proton, this.element);

              case "easeljs":
                return new c.EaselRender(this.proton, this.element);

              case "pixel":
                return new c.PixelRender(this.proton, this.element);

              default:
                return new c.BaseRender(this.proton, this.element);
            }
        },
        render: function(a) {
            this.renderer.render(a);
        },
        addEventHandler: function() {
            this.onProtonUpdate && (this.renderer.onProtonUpdate = this.onProtonUpdate), this.onParticleCreated && (this.renderer.onParticleCreated = this.onParticleCreated), 
            this.onParticleUpdate && (this.renderer.onParticleUpdate = this.onParticleUpdate), 
            this.onParticleDead && (this.renderer.onParticleDead = this.onParticleDead);
        }
    }, c.Renderer = V, W.prototype = {
        start: function() {
            var a = this;
            this.proton.addEventListener(c.PROTON_UPDATE, function() {
                a.onProtonUpdate.call(a);
            }), this.proton.addEventListener(c.PROTON_UPDATE_AFTER, function() {
                a.onProtonUpdateAfter.call(a);
            }), this.proton.addEventListener(c.EMITTER_ADDED, function(b) {
                a.onEmitterAdded.call(a, b.emitter);
            }), this.proton.addEventListener(c.EMITTER_REMOVED, function(b) {
                a.onEmitterRemoved.call(a, b.emitter);
            });
            var d, b = this.proton.emitters.length;
            for (d = 0; b > d; d++) {
                var e = this.proton.emitters[d];
                this.addEmitterListener(e);
            }
        },
        resize: function() {},
        addEmitterListener: function(a) {
            var b = this;
            a.addEventListener(c.PARTICLE_CREATED, function(a) {
                b.onParticleCreated.call(b, a.particle);
            }), a.addEventListener(c.PARTICLE_UPDATE, function(a) {
                b.onParticleUpdate.call(b, a.particle);
            }), a.addEventListener(c.PARTICLE_DEAD, function(a) {
                b.onParticleDead.call(b, a.particle);
            });
        },
        stop: function() {
            var b, a = this.proton.emitters.length;
            for (this.proton.removeAllEventListeners(), b = 0; a > b; b++) {
                var c = this.proton.emitters[b];
                c.removeAllEventListeners();
            }
        },
        onEmitterAdded: function(a) {
            this.addEmitterListener(a);
        },
        onEmitterRemoved: function(a) {
            a.removeAllEventListeners();
        },
        onProtonUpdate: function() {},
        onProtonUpdateAfter: function() {},
        onParticleCreated: function() {},
        onParticleUpdate: function() {},
        onParticleDead: function() {}
    }, c.BaseRender = W, c.Util.inherits(X, c.BaseRender), X.prototype.start = function() {
        X._super_.prototype.start.call(this);
    }, X.prototype.setStroke = function(a, b) {
        a = c.Util.initValue(a, "#000000"), b = c.Util.initValue(b, 1), this.stroke = {
            color: a,
            thinkness: b
        };
    }, X.prototype.onProtonUpdate = function() {}, X.prototype.onParticleCreated = function(a) {
        if (a.target) {
            var b = this;
            c.Util.getImage(a.target, a, !1, function(a) {
                b.setImgInDIV.call(b, a);
            });
        } else a.transform.canvas = c.DomUtil.createCanvas(a.id + "_canvas", a.radius + 1, a.radius + 1, "absolute"), 
        a.transform.bakOldRadius = a.radius, this.stroke ? (a.transform.canvas.width = 2 * a.radius + 2 * this.stroke.thinkness, 
        a.transform.canvas.height = 2 * a.radius + 2 * this.stroke.thinkness) : (a.transform.canvas.width = 2 * a.radius + 1, 
        a.transform.canvas.height = 2 * a.radius + 1), a.transform.context = a.transform.canvas.getContext("2d"), 
        a.transform.context.fillStyle = a.color, a.transform.context.beginPath(), a.transform.context.arc(a.radius, a.radius, a.radius, 0, 2 * Math.PI, !0), 
        this.stroke && (a.transform.context.strokeStyle = this.stroke.color, a.transform.context.lineWidth = this.stroke.thinkness, 
        a.transform.context.stroke()), a.transform.context.closePath(), a.transform.context.fill(), 
        this.element.appendChild(a.transform.canvas);
    }, X.prototype.onParticleUpdate = function(a) {
        a.target ? a.target instanceof Image && (a.transform.canvas.style.opacity = a.alpha, 
        c.DomUtil.transformDom(a.transform.canvas, a.p.x - a.target.width / 2, a.p.y - a.target.height / 2, a.scale, a.rotation)) : (a.transform.canvas.style.opacity = a.alpha, 
        a.transform.oldRadius ? c.DomUtil.transformDom(a.transform.canvas, a.p.x - a.transform.oldRadius, a.p.y - a.transform.oldRadius, a.scale, a.rotation) : c.DomUtil.transformDom(a.transform.canvas, a.p.x - a.transform.bakOldRadius, a.p.y - a.transform.bakOldRadius, a.scale, a.rotation));
    }, X.prototype.onParticleDead = function(a) {
        a.transform.canvas && this.element.removeChild(a.transform.canvas);
    }, X.prototype.setImgInDIV = function(a) {
        a.transform.canvas = c.DomUtil.createCanvas(a.id + "_canvas", a.target.width + 1, a.target.height + 1, "absolute", a.p.x - a.radius, a.p.y - a.radius), 
        a.transform.context = a.transform.canvas.getContext("2d"), a.transform.context.drawImage(a.target, 0, 0, a.target.width, a.target.height), 
        this.element.appendChild(a.transform.canvas);
    }, c.DomRender = X, c.Util.inherits(Y, c.BaseRender), Y.prototype.resize = function() {}, 
    Y.prototype.start = function() {
        Y._super_.prototype.start.call(this);
    }, Y.prototype.onProtonUpdate = function() {}, Y.prototype.onParticleCreated = function(a) {
        if (a.target) a.target = a.target.clone(), a.target.parent || (!a.target.image || (a.target.regX = a.target.image.width / 2, 
        a.target.regY = a.target.image.height / 2), this.element.addChild(a.target)); else {
            var b = new createjs.Graphics();
            this.stroke && (1 == this.stroke ? b.beginStroke("#000000") : this.stroke instanceof String && b.beginStroke(this.stroke)), 
            b.beginFill(a.color).drawCircle(0, 0, a.radius);
            var c = new createjs.Shape(b);
            a.target = c, this.element.addChild(a.target);
        }
    }, Y.prototype.onParticleUpdate = function(a) {
        a.target && (a.target.x = a.p.x, a.target.y = a.p.y, a.target.alpha = a.alpha, a.target.scaleX = a.target.scaleY = a.scale, 
        a.target.rotation = a.rotation);
    }, Y.prototype.onParticleDead = function(a) {
        a.target && a.target.parent && a.target.parent.removeChild(a.target);
    }, c.EaselRender = Y, c.Util.inherits(Z, c.BaseRender), Z.prototype.resize = function(a, b) {
        this.element.width = a, this.element.height = b;
    }, Z.prototype.start = function() {
        Z._super_.prototype.start.call(this);
    }, Z.prototype.setStroke = function(a, b) {
        a = c.Util.initValue(a, "#000000"), b = c.Util.initValue(b, 1), this.stroke = {
            color: a,
            thinkness: b
        };
    }, Z.prototype.onProtonUpdate = function() {
        this.context.clearRect(0, 0, this.element.width, this.element.height);
    }, Z.prototype.onParticleCreated = function(a) {
        a.target ? c.Util.getImage(a.target, a, !1) : a.color = a.color ? a.color : "#ff0000";
    }, Z.prototype.onParticleUpdate = function(a) {
        if (a.target) {
            if (a.target instanceof Image) {
                var b = a.target.width * a.scale | 0, d = a.target.height * a.scale | 0, e = a.p.x - b / 2, f = a.p.y - d / 2;
                if (a.color) {
                    a.transform.buffer || (a.transform.buffer = this.getBuffer(a.target));
                    var g = a.transform.buffer.getContext("2d");
                    g.clearRect(0, 0, a.transform.buffer.width, a.transform.buffer.height), g.globalAlpha = a.alpha, 
                    g.drawImage(a.target, 0, 0), g.globalCompositeOperation = "source-atop", g.fillStyle = c.Util.rgbToHex(a.transform.rgb), 
                    g.fillRect(0, 0, a.transform.buffer.width, a.transform.buffer.height), g.globalCompositeOperation = "source-over", 
                    g.globalAlpha = 1, this.context.drawImage(a.transform.buffer, 0, 0, a.transform.buffer.width, a.transform.buffer.height, e, f, b, d);
                } else this.context.save(), this.context.globalAlpha = a.alpha, this.context.translate(a.p.x, a.p.y), 
                this.context.rotate(c.MathUtils.degreeTransform(a.rotation)), this.context.translate(-a.p.x, -a.p.y), 
                this.context.drawImage(a.target, 0, 0, a.target.width, a.target.height, e, f, b, d), 
                this.context.globalAlpha = 1, this.context.restore();
            }
        } else this.context.fillStyle = a.transform.rgb ? "rgba(" + a.transform.rgb.r + "," + a.transform.rgb.g + "," + a.transform.rgb.b + "," + a.alpha + ")" : a.color, 
        this.context.beginPath(), this.context.arc(a.p.x, a.p.y, a.radius, 0, 2 * Math.PI, !0), 
        this.stroke && (this.context.strokeStyle = this.stroke.color, this.context.lineWidth = this.stroke.thinkness, 
        this.context.stroke()), this.context.closePath(), this.context.fill();
    }, Z.prototype.onParticleDead = function() {}, Z.prototype.getBuffer = function(a) {
        if (a instanceof Image) {
            var b = a.width + "_" + a.height, c = this.bufferCache[b];
            return c || (c = document.createElement("canvas"), c.width = a.width, c.height = a.height, 
            this.bufferCache[b] = c), c;
        }
    }, c.CanvasRender = Z, c.Util.inherits($, c.BaseRender), $.prototype.resize = function(a, b) {
        this.element.width = a, this.element.height = b;
    }, $.prototype.createImageData = function(a) {
        this.rectangle = a ? a : new c.Rectangle(0, 0, this.element.width, this.element.height), 
        this.imageData = this.context.createImageData(this.rectangle.width, this.rectangle.height), 
        this.context.putImageData(this.imageData, this.rectangle.x, this.rectangle.y);
    }, $.prototype.start = function() {
        $._super_.prototype.start.call(this);
    }, $.prototype.onProtonUpdate = function() {
        this.context.clearRect(this.rectangle.x, this.rectangle.y, this.rectangle.width, this.rectangle.height), 
        this.imageData = this.context.getImageData(this.rectangle.x, this.rectangle.y, this.rectangle.width, this.rectangle.height);
    }, $.prototype.onProtonUpdateAfter = function() {
        this.context.putImageData(this.imageData, this.rectangle.x, this.rectangle.y);
    }, $.prototype.onParticleCreated = function() {}, $.prototype.onParticleUpdate = function(a) {
        this.imageData && this.setPixel(this.imageData, Math.floor(a.p.x - this.rectangle.x), Math.floor(a.p.y - this.rectangle.y), a);
    }, $.prototype.setPixel = function(a, b, c, d) {
        var e = d.transform.rgb;
        if (!(0 > b || b > this.element.width || 0 > c || c > this.elementwidth)) {
            var f = 4 * ((c >> 0) * a.width + (b >> 0));
            a.data[f] = e.r, a.data[f + 1] = e.g, a.data[f + 2] = e.b, a.data[f + 3] = 255 * d.alpha;
        }
    }, $.prototype.onParticleDead = function() {}, c.PixelRender = $, c.Util.inherits(_, c.BaseRender), 
    _.prototype.resize = function(a, b) {
        this.umat[4] = -2, this.umat[7] = 1, this.smat[0] = 1 / a, this.smat[4] = 1 / b, 
        this.mstack.set(this.umat, 0), this.mstack.set(this.smat, 1), this.gl.viewport(0, 0, a, b), 
        this.element.width = a, this.element.height = b;
    }, _.prototype.setMaxRadius = function(a) {
        this.circleCanvasURL = this.createCircle(a);
    }, _.prototype.getVertexShader = function() {
        var a = [ "uniform vec2 viewport;", "attribute vec2 aVertexPosition;", "attribute vec2 aTextureCoord;", "uniform mat3 tMat;", "varying vec2 vTextureCoord;", "varying float alpha;", "void main() {", "vec3 v = tMat * vec3(aVertexPosition, 1.0);", "gl_Position = vec4(v.x, v.y, 0, 1);", "vTextureCoord = aTextureCoord;", "alpha = tMat[0][2];", "}" ].join("\n");
        return a;
    }, _.prototype.getFragmentShader = function() {
        var a = [ "precision mediump float;", "varying vec2 vTextureCoord;", "varying float alpha;", "uniform sampler2D uSampler;", "uniform vec4 color;", "uniform bool useTexture;", "uniform vec3 uColor;", "void main() {", "vec4 textureColor = texture2D(uSampler, vTextureCoord);", "gl_FragColor = textureColor * vec4(uColor, 1.0);", "gl_FragColor.w *= alpha;", "}" ].join("\n");
        return a;
    }, _.prototype.initVar = function() {
        this.mstack = new c.MStack(), this.umat = c.Mat3.create([ 2, 0, 1, 0, -2, 0, -1, 1, 1 ]), 
        this.smat = c.Mat3.create([ .01, 0, 1, 0, .01, 0, 0, 0, 1 ]), this.texturebuffers = {};
    }, _.prototype.start = function() {
        _._super_.prototype.start.call(this), this.resize(this.element.width, this.element.height);
    }, _.prototype.blendEquation = function(a) {
        this.gl.blendEquation(this.gl[a]);
    }, _.prototype.blendFunc = function(a, b) {
        this.gl.blendFunc(this.gl[a], this.gl[b]);
    }, _.prototype.getShader = function(a, b, c) {
        var d;
        return d = a.createShader(c ? a.FRAGMENT_SHADER : a.VERTEX_SHADER), a.shaderSource(d, b), 
        a.compileShader(d), a.getShaderParameter(d, a.COMPILE_STATUS) ? d : (alert(a.getShaderInfoLog(d)), 
        null);
    }, _.prototype.initShaders = function() {
        var a = this.getShader(this.gl, this.getFragmentShader(), !0), b = this.getShader(this.gl, this.getVertexShader(), !1);
        this.sprogram = this.gl.createProgram(), this.gl.attachShader(this.sprogram, b), 
        this.gl.attachShader(this.sprogram, a), this.gl.linkProgram(this.sprogram), this.gl.getProgramParameter(this.sprogram, this.gl.LINK_STATUS) || alert("Could not initialise shaders"), 
        this.gl.useProgram(this.sprogram), this.sprogram.vpa = this.gl.getAttribLocation(this.sprogram, "aVertexPosition"), 
        this.sprogram.tca = this.gl.getAttribLocation(this.sprogram, "aTextureCoord"), this.gl.enableVertexAttribArray(this.sprogram.tca), 
        this.gl.enableVertexAttribArray(this.sprogram.vpa), this.sprogram.tMatUniform = this.gl.getUniformLocation(this.sprogram, "tMat"), 
        this.sprogram.samplerUniform = this.gl.getUniformLocation(this.sprogram, "uSampler"), 
        this.sprogram.useTex = this.gl.getUniformLocation(this.sprogram, "useTexture"), 
        this.sprogram.color = this.gl.getUniformLocation(this.sprogram, "uColor"), this.gl.uniform1i(this.sprogram.useTex, 1);
    }, _.prototype.initBuffers = function() {
        this.unitIBuffer = this.gl.createBuffer(), this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.unitIBuffer);
        var a = [ 0, 3, 1, 0, 2, 3 ];
        this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(a), this.gl.STATIC_DRAW);
        for (var b = [], c = 0; 100 > c; c++) b.push(c);
        for (idx = new Uint16Array(b), this.unitI33 = this.gl.createBuffer(), this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.unitI33), 
        this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, idx, this.gl.STATIC_DRAW), b = [], 
        c = 0; 100 > c; c++) b.push(c, c + 1, c + 2);
        idx = new Uint16Array(b), this.stripBuffer = this.gl.createBuffer(), this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.stripBuffer), 
        this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, idx, this.gl.STATIC_DRAW);
    }, _.prototype.createCircle = function(a) {
        this.circleCanvasRadius = c.WebGLUtil.nhpot(c.Util.initValue(a, 32));
        var b = c.DomUtil.createCanvas("circle_canvas", 2 * this.circleCanvasRadius, 2 * this.circleCanvasRadius), d = b.getContext("2d");
        return d.beginPath(), d.arc(this.circleCanvasRadius, this.circleCanvasRadius, this.circleCanvasRadius, 0, 2 * Math.PI, !0), 
        d.closePath(), d.fillStyle = "#FFF", d.fill(), b.toDataURL();
    }, _.prototype.setImgInCanvas = function(a) {
        var b = a.target.width, d = a.target.height, e = c.WebGLUtil.nhpot(a.target.width), f = c.WebGLUtil.nhpot(a.target.height), g = a.target.width / e, h = a.target.height / f;
        this.texturebuffers[a.transform.src] || (this.texturebuffers[a.transform.src] = [ this.gl.createTexture(), this.gl.createBuffer(), this.gl.createBuffer() ]), 
        a.transform.texture = this.texturebuffers[a.transform.src][0], a.transform.vcBuffer = this.texturebuffers[a.transform.src][1], 
        a.transform.tcBuffer = this.texturebuffers[a.transform.src][2], this.gl.bindBuffer(this.gl.ARRAY_BUFFER, a.transform.tcBuffer), 
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array([ 0, 0, g, 0, 0, h, h, h ]), this.gl.STATIC_DRAW), 
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, a.transform.vcBuffer), this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array([ 0, 0, b, 0, 0, d, b, d ]), this.gl.STATIC_DRAW);
        var i = a.transform.canvas.getContext("2d"), j = i.getImageData(0, 0, e, f);
        this.gl.bindTexture(this.gl.TEXTURE_2D, a.transform.texture), this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, this.gl.RGBA, this.gl.UNSIGNED_BYTE, j), 
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.LINEAR), 
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.LINEAR_MIPMAP_NEAREST), 
        this.gl.generateMipmap(this.gl.TEXTURE_2D), a.transform.textureLoaded = !0, a.transform.textureWidth = b, 
        a.transform.textureHeight = d;
    }, _.prototype.setStroke = function() {}, _.prototype.onProtonUpdate = function() {}, 
    _.prototype.onParticleCreated = function(a) {
        var b = this;
        a.transform.textureLoaded = !1, a.transform.tmat = c.Mat3.create(), a.transform.tmat[8] = 1, 
        a.transform.imat = c.Mat3.create(), a.transform.imat[8] = 1, a.target ? c.Util.getImage(a.target, a, !0, function(a) {
            b.setImgInCanvas.call(b, a), a.transform.oldScale = 1;
        }) : c.Util.getImage(this.circleCanvasURL, a, !0, function(a) {
            b.setImgInCanvas.call(b, a), a.transform.oldScale = a.radius / b.circleCanvasRadius;
        });
    }, _.prototype.onParticleUpdate = function(a) {
        a.transform.textureLoaded && (this.updateMatrix(a), this.gl.uniform3f(this.sprogram.color, a.transform.rgb.r / 255, a.transform.rgb.g / 255, a.transform.rgb.b / 255), 
        this.gl.uniformMatrix3fv(this.sprogram.tMatUniform, !1, this.mstack.top()), this.gl.bindBuffer(this.gl.ARRAY_BUFFER, a.transform.vcBuffer), 
        this.gl.vertexAttribPointer(this.sprogram.vpa, 2, this.gl.FLOAT, !1, 0, 0), this.gl.bindBuffer(this.gl.ARRAY_BUFFER, a.transform.tcBuffer), 
        this.gl.vertexAttribPointer(this.sprogram.tca, 2, this.gl.FLOAT, !1, 0, 0), this.gl.bindTexture(this.gl.TEXTURE_2D, a.transform.texture), 
        this.gl.uniform1i(this.sprogram.samplerUniform, 0), this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.unitIBuffer), 
        this.gl.drawElements(this.gl.TRIANGLES, 6, this.gl.UNSIGNED_SHORT, 0), this.mstack.pop());
    }, _.prototype.onParticleDead = function() {}, _.prototype.updateMatrix = function(a) {
        var b = c.WebGLUtil.makeTranslation(-a.transform.textureWidth / 2, -a.transform.textureHeight / 2), d = c.WebGLUtil.makeTranslation(a.p.x, a.p.y), e = a.rotation * (Math.PI / 180), f = c.WebGLUtil.makeRotation(e), g = a.scale * a.transform.oldScale, h = c.WebGLUtil.makeScale(g, g), i = c.WebGLUtil.matrixMultiply(b, h);
        i = c.WebGLUtil.matrixMultiply(i, f), i = c.WebGLUtil.matrixMultiply(i, d), c.Mat3.inverse(i, a.transform.imat), 
        i[2] = a.alpha, this.mstack.push(i);
    }, c.WebGLRender = _, ba.prototype = {
        getPosition: function() {},
        crossing: function() {}
    }, c.Zone = ba, c.Util.inherits(bb, c.Zone), bb.prototype.getPosition = function() {
        return this.random = Math.random(), this.vector.x = this.x1 + this.random * this.length * Math.cos(this.gradient), 
        this.vector.y = this.y1 + this.random * this.length * Math.sin(this.gradient), this.vector;
    }, bb.prototype.getDirection = function(a, b) {
        var c = this.dy, d = -this.dx, e = this.dot, f = 0 == d ? 1 : d;
        return (c * a + d * b + e) * f > 0 ? !0 : !1;
    }, bb.prototype.getDistance = function(a, b) {
        var c = this.dy, d = -this.dx, e = this.dot, f = c * a + d * b + e;
        return f / Math.sqrt(this.xxyy);
    }, bb.prototype.getSymmetric = function(a) {
        var b = a.getGradient(), c = this.getGradient(), d = 2 * (c - b), e = a.x, f = a.y;
        return a.x = e * Math.cos(d) - f * Math.sin(d), a.y = e * Math.sin(d) + f * Math.cos(d), 
        a;
    }, bb.prototype.getGradient = function() {
        return Math.atan2(this.dy, this.dx);
    }, bb.prototype.getRange = function(a, b) {
        var c = Math.abs(this.getGradient());
        c <= Math.PI / 4 ? a.p.x < this.maxx && a.p.x > this.minx && b() : a.p.y < this.maxy && a.p.y > this.miny && b();
    }, bb.prototype.getLength = function() {
        return Math.sqrt(this.dx * this.dx + this.dy * this.dy);
    }, bb.prototype.crossing = function(a) {
        var b = this;
        "dead" == this.crossType ? ">" == this.direction || "R" == this.direction || "right" == this.direction || "down" == this.direction ? this.getRange(a, function() {
            b.getDirection(a.p.x, a.p.y) && (a.dead = !0);
        }) : this.getRange(a, function() {
            b.getDirection(a.p.x, a.p.y) || (a.dead = !0);
        }) : "bound" == this.crossType ? this.getRange(a, function() {
            b.getDistance(a.p.x, a.p.y) <= a.radius && (0 == b.dx ? a.v.x *= -1 : 0 == b.dy ? a.v.y *= -1 : b.getSymmetric(a.v));
        }) : "cross" == this.crossType && this.alert && (alert("Sorry lineZone does not support cross method"), 
        this.alert = !1);
    }, c.LineZone = bb, c.Util.inherits(bc, c.Zone), bc.prototype.getPosition = function() {
        return this.random = Math.random(), this.angle = 2 * Math.PI * Math.random(), this.vector.x = this.x + this.random * this.radius * Math.cos(this.angle), 
        this.vector.y = this.y + this.random * this.radius * Math.sin(this.angle), this.vector;
    }, bc.prototype.setCenter = function(a, b) {
        this.center.x = a, this.center.y = b;
    }, bc.prototype.crossing = function(a) {
        var b = a.p.distanceTo(this.center);
        "dead" == this.crossType ? b - a.radius > this.radius && (a.dead = !0) : "bound" == this.crossType ? b + a.radius >= this.radius && this.getSymmetric(a) : "cross" == this.crossType && this.alert && (alert("Sorry CircleZone does not support cross method"), 
        this.alert = !1);
    }, bc.prototype.getSymmetric = function(a) {
        var b = a.v.getGradient(), c = this.getGradient(a), d = 2 * (c - b), e = a.v.x, f = a.v.y;
        a.v.x = e * Math.cos(d) - f * Math.sin(d), a.v.y = e * Math.sin(d) + f * Math.cos(d);
    }, bc.prototype.getGradient = function(a) {
        return -Math.PI / 2 + Math.atan2(a.p.y - this.center.y, a.p.x - this.center.x);
    }, c.CircleZone = bc, c.Util.inherits(bd, c.Zone), bd.prototype.getPosition = function() {
        return this.vector.x = this.x, this.vector.y = this.y, this.vector;
    }, bd.prototype.crossing = function() {
        this.alert && (alert("Sorry PointZone does not support crossing method"), this.alert = !1);
    }, c.PointZone = bd, c.Util.inherits(be, c.Zone), be.prototype.getPosition = function() {
        return this.vector.x = this.x + Math.random() * this.width, this.vector.y = this.y + Math.random() * this.height, 
        this.vector;
    }, be.prototype.crossing = function(a) {
        "dead" == this.crossType ? (a.p.x + a.radius < this.x ? a.dead = !0 : a.p.x - a.radius > this.x + this.width && (a.dead = !0), 
        a.p.y + a.radius < this.y ? a.dead = !0 : a.p.y - a.radius > this.y + this.height && (a.dead = !0)) : "bound" == this.crossType ? (a.p.x - a.radius < this.x ? (a.p.x = this.x + a.radius, 
        a.v.x *= -1) : a.p.x + a.radius > this.x + this.width && (a.p.x = this.x + this.width - a.radius, 
        a.v.x *= -1), a.p.y - a.radius < this.y ? (a.p.y = this.y + a.radius, a.v.y *= -1) : a.p.y + a.radius > this.y + this.height && (a.p.y = this.y + this.height - a.radius, 
        a.v.y *= -1)) : "cross" == this.crossType && (a.p.x + a.radius < this.x && a.v.x <= 0 ? a.p.x = this.x + this.width + a.radius : a.p.x - a.radius > this.x + this.width && a.v.x >= 0 && (a.p.x = this.x - a.radius), 
        a.p.y + a.radius < this.y && a.v.y <= 0 ? a.p.y = this.y + this.height + a.radius : a.p.y - a.radius > this.y + this.height && a.v.y >= 0 && (a.p.y = this.y - a.radius));
    }, c.RectZone = be, c.Util.inherits(bf, c.Zone), bf.prototype.reset = function(a, b, d, e) {
        this.imageData = a, this.x = c.Util.initValue(b, 0), this.y = c.Util.initValue(d, 0), 
        this.d = c.Util.initValue(e, 2), this.vectors = [], this.setVectors();
    }, bf.prototype.setVectors = function() {
        var a, b, c = this.imageData.width, d = this.imageData.height;
        for (a = 0; c > a; a += this.d) for (b = 0; d > b; b += this.d) {
            var e = 4 * ((b >> 0) * c + (a >> 0));
            this.imageData.data[e + 3] > 0 && this.vectors.push({
                x: a + this.x,
                y: b + this.y
            });
        }
        return this.vector;
    }, bf.prototype.getBound = function(a, b) {
        var c = 4 * ((b >> 0) * this.imageData.width + (a >> 0));
        return this.imageData.data[c + 3] > 0 ? !0 : !1;
    }, bf.prototype.getPosition = function() {
        return this.vector.copy(this.vectors[Math.floor(Math.random() * this.vectors.length)]);
    }, bf.prototype.getColor = function(a, b) {
        a -= this.x, b -= this.y;
        var c = 4 * ((b >> 0) * this.imageData.width + (a >> 0));
        return {
            r: this.imageData.data[c],
            g: this.imageData.data[c + 1],
            b: this.imageData.data[c + 2],
            a: this.imageData.data[c + 3]
        };
    }, bf.prototype.crossing = function(a) {
        "dead" == this.crossType ? a.dead = this.getBound(a.p.x - this.x, a.p.y - this.y) ? !0 : !1 : "bound" == this.crossType && (this.getBound(a.p.x - this.x, a.p.y - this.y) || a.v.negate());
    }, c.ImageZone = bf;
    var bg = function() {
        if (a.console && a.console.log) {
            var b = arguments;
            if ("string" == typeof arguments[0]) if (0 == arguments[0].indexOf("+")) {
                var c = parseInt(arguments[0]);
                bg.once < c && (delete b[0], console.log(b), bg.once++);
            } else console.log(b); else console.log(b);
        }
    };
    bg.once = 0, c.log = bg;
    var bh = bh || {
        addEventListener: function(a, b) {
            a.addEventListener(c.PROTON_UPDATE, function() {
                b();
            });
        },
        setStyle: function(a) {
            var b = a || "#ff0000", d = c.Util.hexToRGB(b), e = "rgba(" + d.r + "," + d.g + "," + d.b + ",0.5)";
            return e;
        },
        drawZone: function(a, b, d, e) {
            var f = b.getContext("2d"), g = this.setStyle();
            this.addEventListener(a, function() {
                e && f.clearRect(0, 0, b.width, b.height), d instanceof c.PointZone ? (f.beginPath(), 
                f.fillStyle = g, f.arc(d.x, d.y, 10, 0, 2 * Math.PI, !0), f.fill(), f.closePath()) : d instanceof c.LineZone ? (f.beginPath(), 
                f.strokeStyle = g, f.moveTo(d.x1, d.y1), f.lineTo(d.x2, d.y2), f.stroke(), f.closePath()) : d instanceof c.RectZone ? (f.beginPath(), 
                f.strokeStyle = g, f.drawRect(d.x, d.y, d.width, d.height), f.stroke(), f.closePath()) : d instanceof c.CircleZone && (f.beginPath(), 
                f.strokeStyle = g, f.arc(d.x, d.y, d.radius, 0, 2 * Math.PI, !0), f.stroke(), f.closePath());
            });
        },
        drawEmitter: function(a, b, c, d) {
            var e = b.getContext("2d"), f = this.setStyle();
            this.addEventListener(a, function() {
                d && e.clearRect(0, 0, b.width, b.height), e.beginPath(), e.fillStyle = f, e.arc(c.p.x, c.p.y, 10, 0, 2 * Math.PI, !0), 
                e.fill(), e.closePath();
            });
        },
        test: {},
        setTest: function(a, b) {
            this.test[a] = b;
        },
        getTest: function(a) {
            return this.test.hasOwnProperty(a) ? this.test[a] : !1;
        }
    };
    c.Debug = bh;
}(window), function() {
    for (var a = 0, b = [ "ms", "moz", "webkit", "o" ], c = 0; c < b.length && !window.requestAnimationFrame; ++c) window.requestAnimationFrame = window[b[c] + "RequestAnimationFrame"], 
    window.cancelAnimationFrame = window[b[c] + "CancelAnimationFrame"] || window[b[c] + "CancelRequestAnimationFrame"];
    window.requestAnimationFrame || (window.requestAnimationFrame = function(b) {
        var d = new Date().getTime(), e = Math.max(0, 16 - (d - a)), f = window.setTimeout(function() {
            b(d + e);
        }, e);
        return a = d + e, f;
    }), window.cancelAnimationFrame || (window.cancelAnimationFrame = function(a) {
        clearTimeout(a);
    });
}(), !function(a, b, c, d) {
    "use strict";
    function e(a, b, c) {
        return setTimeout(k(a, c), b);
    }
    function f(a, b, c) {
        return Array.isArray(a) ? (g(a, c[b], c), !0) : !1;
    }
    function g(a, b, c) {
        var e;
        if (a) if (a.forEach) a.forEach(b, c); else if (a.length !== d) for (e = 0; e < a.length; ) b.call(c, a[e], e, a), 
        e++; else for (e in a) a.hasOwnProperty(e) && b.call(c, a[e], e, a);
    }
    function h(a, b, c) {
        for (var e = Object.keys(b), f = 0; f < e.length; ) (!c || c && a[e[f]] === d) && (a[e[f]] = b[e[f]]), 
        f++;
        return a;
    }
    function i(a, b) {
        return h(a, b, !0);
    }
    function j(a, b, c) {
        var d, e = b.prototype;
        d = a.prototype = Object.create(e), d.constructor = a, d._super = e, c && h(d, c);
    }
    function k(a, b) {
        return function() {
            return a.apply(b, arguments);
        };
    }
    function l(a, b) {
        return typeof a == ib ? a.apply(b ? b[0] || d : d, b) : a;
    }
    function m(a, b) {
        return a === d ? b : a;
    }
    function n(a, b, c) {
        g(r(b), function(b) {
            a.addEventListener(b, c, !1);
        });
    }
    function o(a, b, c) {
        g(r(b), function(b) {
            a.removeEventListener(b, c, !1);
        });
    }
    function p(a, b) {
        for (;a; ) {
            if (a == b) return !0;
            a = a.parentNode;
        }
        return !1;
    }
    function q(a, b) {
        return a.indexOf(b) > -1;
    }
    function r(a) {
        return a.trim().split(/\s+/g);
    }
    function s(a, b, c) {
        if (a.indexOf && !c) return a.indexOf(b);
        for (var d = 0; d < a.length; ) {
            if (c && a[d][c] == b || !c && a[d] === b) return d;
            d++;
        }
        return -1;
    }
    function t(a) {
        return Array.prototype.slice.call(a, 0);
    }
    function u(a, b, c) {
        for (var d = [], e = [], f = 0; f < a.length; ) {
            var g = b ? a[f][b] : a[f];
            s(e, g) < 0 && d.push(a[f]), e[f] = g, f++;
        }
        return c && (d = b ? d.sort(function(a, c) {
            return a[b] > c[b];
        }) : d.sort()), d;
    }
    function v(a, b) {
        for (var c, e, f = b[0].toUpperCase() + b.slice(1), g = 0; g < gb.length; ) {
            if (c = gb[g], e = c ? c + f : b, e in a) return e;
            g++;
        }
        return d;
    }
    function w() {
        return mb++;
    }
    function x(a) {
        var b = a.ownerDocument;
        return b.defaultView || b.parentWindow;
    }
    function y(a, b) {
        var c = this;
        this.manager = a, this.callback = b, this.element = a.element, this.target = a.options.inputTarget, 
        this.domHandler = function(b) {
            l(a.options.enable, [ a ]) && c.handler(b);
        }, this.init();
    }
    function z(a) {
        var b, c = a.options.inputClass;
        return new (b = c ? c : pb ? N : qb ? O : ob ? Q : M)(a, A);
    }
    function A(a, b, c) {
        var d = c.pointers.length, e = c.changedPointers.length, f = b & wb && d - e === 0, g = b & (yb | zb) && d - e === 0;
        c.isFirst = !!f, c.isFinal = !!g, f && (a.session = {}), c.eventType = b, B(a, c), 
        a.emit("hammer.input", c), a.recognize(c), a.session.prevInput = c;
    }
    function B(a, b) {
        var c = a.session, d = b.pointers, e = d.length;
        c.firstInput || (c.firstInput = E(b)), e > 1 && !c.firstMultiple ? c.firstMultiple = E(b) : 1 === e && (c.firstMultiple = !1);
        var f = c.firstInput, g = c.firstMultiple, h = g ? g.center : f.center, i = b.center = F(d);
        b.timeStamp = lb(), b.deltaTime = b.timeStamp - f.timeStamp, b.angle = J(h, i), 
        b.distance = I(h, i), C(c, b), b.offsetDirection = H(b.deltaX, b.deltaY), b.scale = g ? L(g.pointers, d) : 1, 
        b.rotation = g ? K(g.pointers, d) : 0, D(c, b);
        var j = a.element;
        p(b.srcEvent.target, j) && (j = b.srcEvent.target), b.target = j;
    }
    function C(a, b) {
        var c = b.center, d = a.offsetDelta || {}, e = a.prevDelta || {}, f = a.prevInput || {};
        (b.eventType === wb || f.eventType === yb) && (e = a.prevDelta = {
            x: f.deltaX || 0,
            y: f.deltaY || 0
        }, d = a.offsetDelta = {
            x: c.x,
            y: c.y
        }), b.deltaX = e.x + (c.x - d.x), b.deltaY = e.y + (c.y - d.y);
    }
    function D(a, b) {
        var c, e, f, g, h = a.lastInterval || b, i = b.timeStamp - h.timeStamp;
        if (b.eventType != zb && (i > vb || h.velocity === d)) {
            var j = h.deltaX - b.deltaX, k = h.deltaY - b.deltaY, l = G(i, j, k);
            e = l.x, f = l.y, c = kb(l.x) > kb(l.y) ? l.x : l.y, g = H(j, k), a.lastInterval = b;
        } else c = h.velocity, e = h.velocityX, f = h.velocityY, g = h.direction;
        b.velocity = c, b.velocityX = e, b.velocityY = f, b.direction = g;
    }
    function E(a) {
        for (var b = [], c = 0; c < a.pointers.length; ) b[c] = {
            clientX: jb(a.pointers[c].clientX),
            clientY: jb(a.pointers[c].clientY)
        }, c++;
        return {
            timeStamp: lb(),
            pointers: b,
            center: F(b),
            deltaX: a.deltaX,
            deltaY: a.deltaY
        };
    }
    function F(a) {
        var b = a.length;
        if (1 === b) return {
            x: jb(a[0].clientX),
            y: jb(a[0].clientY)
        };
        for (var c = 0, d = 0, e = 0; b > e; ) c += a[e].clientX, d += a[e].clientY, e++;
        return {
            x: jb(c / b),
            y: jb(d / b)
        };
    }
    function G(a, b, c) {
        return {
            x: b / a || 0,
            y: c / a || 0
        };
    }
    function H(a, b) {
        return a === b ? Ab : kb(a) >= kb(b) ? a > 0 ? Bb : Cb : b > 0 ? Db : Eb;
    }
    function I(a, b, c) {
        c || (c = Ib);
        var d = b[c[0]] - a[c[0]], e = b[c[1]] - a[c[1]];
        return Math.sqrt(d * d + e * e);
    }
    function J(a, b, c) {
        c || (c = Ib);
        var d = b[c[0]] - a[c[0]], e = b[c[1]] - a[c[1]];
        return 180 * Math.atan2(e, d) / Math.PI;
    }
    function K(a, b) {
        return J(b[1], b[0], Jb) - J(a[1], a[0], Jb);
    }
    function L(a, b) {
        return I(b[0], b[1], Jb) / I(a[0], a[1], Jb);
    }
    function M() {
        this.evEl = Lb, this.evWin = Mb, this.allow = !0, this.pressed = !1, y.apply(this, arguments);
    }
    function N() {
        this.evEl = Pb, this.evWin = Qb, y.apply(this, arguments), this.store = this.manager.session.pointerEvents = [];
    }
    function O() {
        this.evTarget = Sb, this.targetIds = {}, y.apply(this, arguments);
    }
    function P(a, b) {
        var c = t(a.touches), d = this.targetIds;
        if (b & (wb | xb) && 1 === c.length) return d[c[0].identifier] = !0, [ c, c ];
        var e, f = t(a.targetTouches), g = t(a.changedTouches), h = [];
        if (b === wb) for (e = 0; e < f.length; ) d[f[e].identifier] = !0, e++;
        for (e = 0; e < g.length; ) d[g[e].identifier] && h.push(g[e]), b & (yb | zb) && delete d[g[e].identifier], 
        e++;
        return h.length ? [ u(f.concat(h), "identifier", !0), h ] : void 0;
    }
    function Q() {
        y.apply(this, arguments);
        var a = k(this.handler, this);
        this.touch = new O(this.manager, a), this.mouse = new M(this.manager, a);
    }
    function R(a, b) {
        this.manager = a, this.set(b);
    }
    function S(a) {
        if (q(a, Yb)) return Yb;
        var b = q(a, Zb), c = q(a, $b);
        return b && c ? Zb + " " + $b : b || c ? b ? Zb : $b : q(a, Xb) ? Xb : Wb;
    }
    function T(a) {
        this.id = w(), this.manager = null, this.options = i(a || {}, this.defaults), this.options.enable = m(this.options.enable, !0), 
        this.state = _b, this.simultaneous = {}, this.requireFail = [];
    }
    function U(a) {
        return a & ec ? "cancel" : a & cc ? "end" : a & bc ? "move" : a & ac ? "start" : "";
    }
    function V(a) {
        return a == Eb ? "down" : a == Db ? "up" : a == Bb ? "left" : a == Cb ? "right" : "";
    }
    function W(a, b) {
        var c = b.manager;
        return c ? c.get(a) : a;
    }
    function X() {
        T.apply(this, arguments);
    }
    function Y() {
        X.apply(this, arguments), this.pX = null, this.pY = null;
    }
    function Z() {
        X.apply(this, arguments);
    }
    function $() {
        T.apply(this, arguments), this._timer = null, this._input = null;
    }
    function _() {
        X.apply(this, arguments);
    }
    function ab() {
        X.apply(this, arguments);
    }
    function bb() {
        T.apply(this, arguments), this.pTime = !1, this.pCenter = !1, this._timer = null, 
        this._input = null, this.count = 0;
    }
    function cb(a, b) {
        return b = b || {}, b.recognizers = m(b.recognizers, cb.defaults.preset), new db(a, b);
    }
    function db(a, b) {
        b = b || {}, this.options = i(b, cb.defaults), this.options.inputTarget = this.options.inputTarget || a, 
        this.handlers = {}, this.session = {}, this.recognizers = [], this.element = a, 
        this.input = z(this), this.touchAction = new R(this, this.options.touchAction), 
        eb(this, !0), g(b.recognizers, function(a) {
            var b = this.add(new a[0](a[1]));
            a[2] && b.recognizeWith(a[2]), a[3] && b.requireFailure(a[3]);
        }, this);
    }
    function eb(a, b) {
        var c = a.element;
        g(a.options.cssProps, function(a, d) {
            c.style[v(c.style, d)] = b ? a : "";
        });
    }
    function fb(a, c) {
        var d = b.createEvent("Event");
        d.initEvent(a, !0, !0), d.gesture = c, c.target.dispatchEvent(d);
    }
    var gb = [ "", "webkit", "moz", "MS", "ms", "o" ], hb = b.createElement("div"), ib = "function", jb = Math.round, kb = Math.abs, lb = Date.now, mb = 1, nb = /mobile|tablet|ip(ad|hone|od)|android/i, ob = "ontouchstart" in a, pb = v(a, "PointerEvent") !== d, qb = ob && nb.test(navigator.userAgent), rb = "touch", sb = "pen", tb = "mouse", ub = "kinect", vb = 25, wb = 1, xb = 2, yb = 4, zb = 8, Ab = 1, Bb = 2, Cb = 4, Db = 8, Eb = 16, Fb = Bb | Cb, Gb = Db | Eb, Hb = Fb | Gb, Ib = [ "x", "y" ], Jb = [ "clientX", "clientY" ];
    y.prototype = {
        handler: function() {},
        init: function() {
            this.evEl && n(this.element, this.evEl, this.domHandler), this.evTarget && n(this.target, this.evTarget, this.domHandler), 
            this.evWin && n(x(this.element), this.evWin, this.domHandler);
        },
        destroy: function() {
            this.evEl && o(this.element, this.evEl, this.domHandler), this.evTarget && o(this.target, this.evTarget, this.domHandler), 
            this.evWin && o(x(this.element), this.evWin, this.domHandler);
        }
    };
    var Kb = {
        mousedown: wb,
        mousemove: xb,
        mouseup: yb
    }, Lb = "mousedown", Mb = "mousemove mouseup";
    j(M, y, {
        handler: function(a) {
            var b = Kb[a.type];
            b & wb && 0 === a.button && (this.pressed = !0), b & xb && 1 !== a.which && (b = yb), 
            this.pressed && this.allow && (b & yb && (this.pressed = !1), this.callback(this.manager, b, {
                pointers: [ a ],
                changedPointers: [ a ],
                pointerType: tb,
                srcEvent: a
            }));
        }
    });
    var Nb = {
        pointerdown: wb,
        pointermove: xb,
        pointerup: yb,
        pointercancel: zb,
        pointerout: zb
    }, Ob = {
        2: rb,
        3: sb,
        4: tb,
        5: ub
    }, Pb = "pointerdown", Qb = "pointermove pointerup pointercancel";
    a.MSPointerEvent && (Pb = "MSPointerDown", Qb = "MSPointerMove MSPointerUp MSPointerCancel"), 
    j(N, y, {
        handler: function(a) {
            var b = this.store, c = !1, d = a.type.toLowerCase().replace("ms", ""), e = Nb[d], f = Ob[a.pointerType] || a.pointerType, g = f == rb;
            e & wb && (0 === a.button || g) ? b.push(a) : e & (yb | zb) && (c = !0);
            var h = s(b, a.pointerId, "pointerId");
            0 > h || (b[h] = a, this.callback(this.manager, e, {
                pointers: b,
                changedPointers: [ a ],
                pointerType: f,
                srcEvent: a
            }), c && b.splice(h, 1));
        }
    });
    var Rb = {
        touchstart: wb,
        touchmove: xb,
        touchend: yb,
        touchcancel: zb
    }, Sb = "touchstart touchmove touchend touchcancel";
    j(O, y, {
        handler: function(a) {
            var b = Rb[a.type], c = P.call(this, a, b);
            c && this.callback(this.manager, b, {
                pointers: c[0],
                changedPointers: c[1],
                pointerType: rb,
                srcEvent: a
            });
        }
    }), j(Q, y, {
        handler: function(a, b, c) {
            var d = c.pointerType == rb, e = c.pointerType == tb;
            if (d) this.mouse.allow = !1; else if (e && !this.mouse.allow) return;
            b & (yb | zb) && (this.mouse.allow = !0), this.callback(a, b, c);
        },
        destroy: function() {
            this.touch.destroy(), this.mouse.destroy();
        }
    });
    var Tb = v(hb.style, "touchAction"), Ub = Tb !== d, Vb = "compute", Wb = "auto", Xb = "manipulation", Yb = "none", Zb = "pan-x", $b = "pan-y";
    R.prototype = {
        set: function(a) {
            a == Vb && (a = this.compute()), Ub && (this.manager.element.style[Tb] = a), this.actions = a.toLowerCase().trim();
        },
        update: function() {
            this.set(this.manager.options.touchAction);
        },
        compute: function() {
            var a = [];
            return g(this.manager.recognizers, function(b) {
                l(b.options.enable, [ b ]) && (a = a.concat(b.getTouchAction()));
            }), S(a.join(" "));
        },
        preventDefaults: function(a) {
            if (!Ub) {
                var b = a.srcEvent, c = a.offsetDirection;
                if (this.manager.session.prevented) return void b.preventDefault();
                var d = this.actions, e = q(d, Yb), f = q(d, $b), g = q(d, Zb);
                return e || f && c & Fb || g && c & Gb ? this.preventSrc(b) : void 0;
            }
        },
        preventSrc: function(a) {
            this.manager.session.prevented = !0, a.preventDefault();
        }
    };
    var _b = 1, ac = 2, bc = 4, cc = 8, dc = cc, ec = 16, fc = 32;
    T.prototype = {
        defaults: {},
        set: function(a) {
            return h(this.options, a), this.manager && this.manager.touchAction.update(), this;
        },
        recognizeWith: function(a) {
            if (f(a, "recognizeWith", this)) return this;
            var b = this.simultaneous;
            return a = W(a, this), b[a.id] || (b[a.id] = a, a.recognizeWith(this)), this;
        },
        dropRecognizeWith: function(a) {
            return f(a, "dropRecognizeWith", this) ? this : (a = W(a, this), delete this.simultaneous[a.id], 
            this);
        },
        requireFailure: function(a) {
            if (f(a, "requireFailure", this)) return this;
            var b = this.requireFail;
            return a = W(a, this), -1 === s(b, a) && (b.push(a), a.requireFailure(this)), this;
        },
        dropRequireFailure: function(a) {
            if (f(a, "dropRequireFailure", this)) return this;
            a = W(a, this);
            var b = s(this.requireFail, a);
            return b > -1 && this.requireFail.splice(b, 1), this;
        },
        hasRequireFailures: function() {
            return this.requireFail.length > 0;
        },
        canRecognizeWith: function(a) {
            return !!this.simultaneous[a.id];
        },
        emit: function(a) {
            function b(b) {
                c.manager.emit(c.options.event + (b ? U(d) : ""), a);
            }
            var c = this, d = this.state;
            cc > d && b(!0), b(), d >= cc && b(!0);
        },
        tryEmit: function(a) {
            return this.canEmit() ? this.emit(a) : void (this.state = fc);
        },
        canEmit: function() {
            for (var a = 0; a < this.requireFail.length; ) {
                if (!(this.requireFail[a].state & (fc | _b))) return !1;
                a++;
            }
            return !0;
        },
        recognize: function(a) {
            var b = h({}, a);
            return l(this.options.enable, [ this, b ]) ? (this.state & (dc | ec | fc) && (this.state = _b), 
            this.state = this.process(b), void (this.state & (ac | bc | cc | ec) && this.tryEmit(b))) : (this.reset(), 
            void (this.state = fc));
        },
        process: function() {},
        getTouchAction: function() {},
        reset: function() {}
    }, j(X, T, {
        defaults: {
            pointers: 1
        },
        attrTest: function(a) {
            var b = this.options.pointers;
            return 0 === b || a.pointers.length === b;
        },
        process: function(a) {
            var b = this.state, c = a.eventType, d = b & (ac | bc), e = this.attrTest(a);
            return d && (c & zb || !e) ? b | ec : d || e ? c & yb ? b | cc : b & ac ? b | bc : ac : fc;
        }
    }), j(Y, X, {
        defaults: {
            event: "pan",
            threshold: 10,
            pointers: 1,
            direction: Hb
        },
        getTouchAction: function() {
            var a = this.options.direction, b = [];
            return a & Fb && b.push($b), a & Gb && b.push(Zb), b;
        },
        directionTest: function(a) {
            var b = this.options, c = !0, d = a.distance, e = a.direction, f = a.deltaX, g = a.deltaY;
            return e & b.direction || (b.direction & Fb ? (e = 0 === f ? Ab : 0 > f ? Bb : Cb, 
            c = f != this.pX, d = Math.abs(a.deltaX)) : (e = 0 === g ? Ab : 0 > g ? Db : Eb, 
            c = g != this.pY, d = Math.abs(a.deltaY))), a.direction = e, c && d > b.threshold && e & b.direction;
        },
        attrTest: function(a) {
            return X.prototype.attrTest.call(this, a) && (this.state & ac || !(this.state & ac) && this.directionTest(a));
        },
        emit: function(a) {
            this.pX = a.deltaX, this.pY = a.deltaY;
            var b = V(a.direction);
            b && this.manager.emit(this.options.event + b, a), this._super.emit.call(this, a);
        }
    }), j(Z, X, {
        defaults: {
            event: "pinch",
            threshold: 0,
            pointers: 2
        },
        getTouchAction: function() {
            return [ Yb ];
        },
        attrTest: function(a) {
            return this._super.attrTest.call(this, a) && (Math.abs(a.scale - 1) > this.options.threshold || this.state & ac);
        },
        emit: function(a) {
            if (this._super.emit.call(this, a), 1 !== a.scale) {
                var b = a.scale < 1 ? "in" : "out";
                this.manager.emit(this.options.event + b, a);
            }
        }
    }), j($, T, {
        defaults: {
            event: "press",
            pointers: 1,
            time: 500,
            threshold: 5
        },
        getTouchAction: function() {
            return [ Wb ];
        },
        process: function(a) {
            var b = this.options, c = a.pointers.length === b.pointers, d = a.distance < b.threshold, f = a.deltaTime > b.time;
            if (this._input = a, !d || !c || a.eventType & (yb | zb) && !f) this.reset(); else if (a.eventType & wb) this.reset(), 
            this._timer = e(function() {
                this.state = dc, this.tryEmit();
            }, b.time, this); else if (a.eventType & yb) return dc;
            return fc;
        },
        reset: function() {
            clearTimeout(this._timer);
        },
        emit: function(a) {
            this.state === dc && (a && a.eventType & yb ? this.manager.emit(this.options.event + "up", a) : (this._input.timeStamp = lb(), 
            this.manager.emit(this.options.event, this._input)));
        }
    }), j(_, X, {
        defaults: {
            event: "rotate",
            threshold: 0,
            pointers: 2
        },
        getTouchAction: function() {
            return [ Yb ];
        },
        attrTest: function(a) {
            return this._super.attrTest.call(this, a) && (Math.abs(a.rotation) > this.options.threshold || this.state & ac);
        }
    }), j(ab, X, {
        defaults: {
            event: "swipe",
            threshold: 10,
            velocity: .65,
            direction: Fb | Gb,
            pointers: 1
        },
        getTouchAction: function() {
            return Y.prototype.getTouchAction.call(this);
        },
        attrTest: function(a) {
            var b, c = this.options.direction;
            return c & (Fb | Gb) ? b = a.velocity : c & Fb ? b = a.velocityX : c & Gb && (b = a.velocityY), 
            this._super.attrTest.call(this, a) && c & a.direction && a.distance > this.options.threshold && kb(b) > this.options.velocity && a.eventType & yb;
        },
        emit: function(a) {
            var b = V(a.direction);
            b && this.manager.emit(this.options.event + b, a), this.manager.emit(this.options.event, a);
        }
    }), j(bb, T, {
        defaults: {
            event: "tap",
            pointers: 1,
            taps: 1,
            interval: 300,
            time: 250,
            threshold: 2,
            posThreshold: 10
        },
        getTouchAction: function() {
            return [ Xb ];
        },
        process: function(a) {
            var b = this.options, c = a.pointers.length === b.pointers, d = a.distance < b.threshold, f = a.deltaTime < b.time;
            if (this.reset(), a.eventType & wb && 0 === this.count) return this.failTimeout();
            if (d && f && c) {
                if (a.eventType != yb) return this.failTimeout();
                var g = this.pTime ? a.timeStamp - this.pTime < b.interval : !0, h = !this.pCenter || I(this.pCenter, a.center) < b.posThreshold;
                this.pTime = a.timeStamp, this.pCenter = a.center, h && g ? this.count += 1 : this.count = 1, 
                this._input = a;
                var i = this.count % b.taps;
                if (0 === i) return this.hasRequireFailures() ? (this._timer = e(function() {
                    this.state = dc, this.tryEmit();
                }, b.interval, this), ac) : dc;
            }
            return fc;
        },
        failTimeout: function() {
            return this._timer = e(function() {
                this.state = fc;
            }, this.options.interval, this), fc;
        },
        reset: function() {
            clearTimeout(this._timer);
        },
        emit: function() {
            this.state == dc && (this._input.tapCount = this.count, this.manager.emit(this.options.event, this._input));
        }
    }), cb.VERSION = "2.0.3", cb.defaults = {
        domEvents: !1,
        touchAction: Vb,
        enable: !0,
        inputTarget: null,
        inputClass: null,
        preset: [ [ _, {
            enable: !1
        } ], [ Z, {
            enable: !1
        }, [ "rotate" ] ], [ ab, {
            direction: Fb
        } ], [ Y, {
            direction: Fb
        }, [ "swipe" ] ], [ bb ], [ bb, {
            event: "doubletap",
            taps: 2
        }, [ "tap" ] ], [ $ ] ],
        cssProps: {
            userSelect: "none",
            touchSelect: "none",
            touchCallout: "none",
            contentZooming: "none",
            userDrag: "none",
            tapHighlightColor: "rgba(0,0,0,0)"
        }
    };
    var gc = 1, hc = 2;
    db.prototype = {
        set: function(a) {
            return h(this.options, a), a.touchAction && this.touchAction.update(), a.inputTarget && (this.input.destroy(), 
            this.input.target = a.inputTarget, this.input.init()), this;
        },
        stop: function(a) {
            this.session.stopped = a ? hc : gc;
        },
        recognize: function(a) {
            var b = this.session;
            if (!b.stopped) {
                this.touchAction.preventDefaults(a);
                var c, d = this.recognizers, e = b.curRecognizer;
                (!e || e && e.state & dc) && (e = b.curRecognizer = null);
                for (var f = 0; f < d.length; ) c = d[f], b.stopped === hc || e && c != e && !c.canRecognizeWith(e) ? c.reset() : c.recognize(a), 
                !e && c.state & (ac | bc | cc) && (e = b.curRecognizer = c), f++;
            }
        },
        get: function(a) {
            if (a instanceof T) return a;
            for (var b = this.recognizers, c = 0; c < b.length; c++) if (b[c].options.event == a) return b[c];
            return null;
        },
        add: function(a) {
            if (f(a, "add", this)) return this;
            var b = this.get(a.options.event);
            return b && this.remove(b), this.recognizers.push(a), a.manager = this, this.touchAction.update(), 
            a;
        },
        remove: function(a) {
            if (f(a, "remove", this)) return this;
            var b = this.recognizers;
            return a = this.get(a), b.splice(s(b, a), 1), this.touchAction.update(), this;
        },
        on: function(a, b) {
            var c = this.handlers;
            return g(r(a), function(a) {
                c[a] = c[a] || [], c[a].push(b);
            }), this;
        },
        off: function(a, b) {
            var c = this.handlers;
            return g(r(a), function(a) {
                b ? c[a].splice(s(c[a], b), 1) : delete c[a];
            }), this;
        },
        emit: function(a, b) {
            this.options.domEvents && fb(a, b);
            var c = this.handlers[a] && this.handlers[a].slice();
            if (c && c.length) {
                b.type = a, b.preventDefault = function() {
                    b.srcEvent.preventDefault();
                };
                for (var d = 0; d < c.length; ) c[d](b), d++;
            }
        },
        destroy: function() {
            this.element && eb(this, !1), this.handlers = {}, this.session = {}, this.input.destroy(), 
            this.element = null;
        }
    }, h(cb, {
        INPUT_START: wb,
        INPUT_MOVE: xb,
        INPUT_END: yb,
        INPUT_CANCEL: zb,
        STATE_POSSIBLE: _b,
        STATE_BEGAN: ac,
        STATE_CHANGED: bc,
        STATE_ENDED: cc,
        STATE_RECOGNIZED: dc,
        STATE_CANCELLED: ec,
        STATE_FAILED: fc,
        DIRECTION_NONE: Ab,
        DIRECTION_LEFT: Bb,
        DIRECTION_RIGHT: Cb,
        DIRECTION_UP: Db,
        DIRECTION_DOWN: Eb,
        DIRECTION_HORIZONTAL: Fb,
        DIRECTION_VERTICAL: Gb,
        DIRECTION_ALL: Hb,
        Manager: db,
        Input: y,
        TouchAction: R,
        TouchInput: O,
        MouseInput: M,
        PointerEventInput: N,
        TouchMouseInput: Q,
        Recognizer: T,
        AttrRecognizer: X,
        Tap: bb,
        Pan: Y,
        Swipe: ab,
        Pinch: Z,
        Rotate: _,
        Press: $,
        on: n,
        off: o,
        each: g,
        merge: i,
        extend: h,
        inherit: j,
        bindFn: k,
        prefixed: v
    }), typeof define == ib && define.amd ? define(function() {
        return cb;
    }) : "undefined" != typeof module && module.exports ? module.exports = cb : a[c] = cb;
}(window, document, "Hammer"), function() {
    var a = this, b = b || {};
    b.WEBGL_RENDERER = 0, b.CANVAS_RENDERER = 1, b.VERSION = "v1.6.1", b.blendModes = {
        NORMAL: 0,
        ADD: 1,
        MULTIPLY: 2,
        SCREEN: 3,
        OVERLAY: 4,
        DARKEN: 5,
        LIGHTEN: 6,
        COLOR_DODGE: 7,
        COLOR_BURN: 8,
        HARD_LIGHT: 9,
        SOFT_LIGHT: 10,
        DIFFERENCE: 11,
        EXCLUSION: 12,
        HUE: 13,
        SATURATION: 14,
        COLOR: 15,
        LUMINOSITY: 16
    }, b.scaleModes = {
        DEFAULT: 0,
        LINEAR: 0,
        NEAREST: 1
    }, b._UID = 0, "undefined" != typeof Float32Array ? (b.Float32Array = Float32Array, 
    b.Uint16Array = Uint16Array) : (b.Float32Array = Array, b.Uint16Array = Array), 
    b.INTERACTION_FREQUENCY = 30, b.AUTO_PREVENT_DEFAULT = !0, b.RAD_TO_DEG = 180 / Math.PI, 
    b.DEG_TO_RAD = Math.PI / 180, b.dontSayHello = !1, b.sayHello = function(a) {
        if (!b.dontSayHello) {
            if (navigator.userAgent.toLowerCase().indexOf("chrome") > -1) {
                var c = [ "%c %c %c Pixi.js " + b.VERSION + " - " + a + "  %c  %c  http://www.pixijs.com/  %c %c ♥%c♥%c♥ ", "background: #ff66a5", "background: #ff66a5", "color: #ff66a5; background: #030307;", "background: #ff66a5", "background: #ffc3dc", "background: #ff66a5", "color: #ff2424; background: #fff", "color: #ff2424; background: #fff", "color: #ff2424; background: #fff" ];
                console.log.apply(console, c);
            } else window.console && console.log("Pixi.js " + b.VERSION + " - http://www.pixijs.com/");
            b.dontSayHello = !0;
        }
    }, b.Point = function(a, b) {
        this.x = a || 0, this.y = b || 0;
    }, b.Point.prototype.clone = function() {
        return new b.Point(this.x, this.y);
    }, b.Point.prototype.set = function(a, b) {
        this.x = a || 0, this.y = b || (0 !== b ? this.x : 0);
    }, b.Point.prototype.constructor = b.Point, b.Rectangle = function(a, b, c, d) {
        this.x = a || 0, this.y = b || 0, this.width = c || 0, this.height = d || 0;
    }, b.Rectangle.prototype.clone = function() {
        return new b.Rectangle(this.x, this.y, this.width, this.height);
    }, b.Rectangle.prototype.contains = function(a, b) {
        if (this.width <= 0 || this.height <= 0) return !1;
        var c = this.x;
        if (a >= c && a <= c + this.width) {
            var d = this.y;
            if (b >= d && b <= d + this.height) return !0;
        }
        return !1;
    }, b.Rectangle.prototype.constructor = b.Rectangle, b.EmptyRectangle = new b.Rectangle(0, 0, 0, 0), 
    b.Polygon = function(a) {
        if (a instanceof Array || (a = Array.prototype.slice.call(arguments)), "number" == typeof a[0]) {
            for (var c = [], d = 0, e = a.length; e > d; d += 2) c.push(new b.Point(a[d], a[d + 1]));
            a = c;
        }
        this.points = a;
    }, b.Polygon.prototype.clone = function() {
        for (var a = [], c = 0; c < this.points.length; c++) a.push(this.points[c].clone());
        return new b.Polygon(a);
    }, b.Polygon.prototype.contains = function(a, b) {
        for (var c = !1, d = 0, e = this.points.length - 1; d < this.points.length; e = d++) {
            var f = this.points[d].x, g = this.points[d].y, h = this.points[e].x, i = this.points[e].y, j = g > b != i > b && (h - f) * (b - g) / (i - g) + f > a;
            j && (c = !c);
        }
        return c;
    }, b.Polygon.prototype.constructor = b.Polygon, b.Circle = function(a, b, c) {
        this.x = a || 0, this.y = b || 0, this.radius = c || 0;
    }, b.Circle.prototype.clone = function() {
        return new b.Circle(this.x, this.y, this.radius);
    }, b.Circle.prototype.contains = function(a, b) {
        if (this.radius <= 0) return !1;
        var c = this.x - a, d = this.y - b, e = this.radius * this.radius;
        return c *= c, d *= d, e >= c + d;
    }, b.Circle.prototype.getBounds = function() {
        return new b.Rectangle(this.x - this.radius, this.y - this.radius, this.width, this.height);
    }, b.Circle.prototype.constructor = b.Circle, b.Ellipse = function(a, b, c, d) {
        this.x = a || 0, this.y = b || 0, this.width = c || 0, this.height = d || 0;
    }, b.Ellipse.prototype.clone = function() {
        return new b.Ellipse(this.x, this.y, this.width, this.height);
    }, b.Ellipse.prototype.contains = function(a, b) {
        if (this.width <= 0 || this.height <= 0) return !1;
        var c = (a - this.x) / this.width, d = (b - this.y) / this.height;
        return c *= c, d *= d, 1 >= c + d;
    }, b.Ellipse.prototype.getBounds = function() {
        return new b.Rectangle(this.x - this.width, this.y - this.height, this.width, this.height);
    }, b.Ellipse.prototype.constructor = b.Ellipse, b.Matrix = function() {
        this.a = 1, this.b = 0, this.c = 0, this.d = 1, this.tx = 0, this.ty = 0;
    }, b.Matrix.prototype.fromArray = function(a) {
        this.a = a[0], this.b = a[1], this.c = a[3], this.d = a[4], this.tx = a[2], this.ty = a[5];
    }, b.Matrix.prototype.toArray = function(a) {
        this.array || (this.array = new Float32Array(9));
        var b = this.array;
        return a ? (b[0] = this.a, b[1] = this.c, b[2] = 0, b[3] = this.b, b[4] = this.d, 
        b[5] = 0, b[6] = this.tx, b[7] = this.ty, b[8] = 1) : (b[0] = this.a, b[1] = this.b, 
        b[2] = this.tx, b[3] = this.c, b[4] = this.d, b[5] = this.ty, b[6] = 0, b[7] = 0, 
        b[8] = 1), b;
    }, b.identityMatrix = new b.Matrix(), b.determineMatrixArrayType = function() {
        return "undefined" != typeof Float32Array ? Float32Array : Array;
    }, b.Matrix2 = b.determineMatrixArrayType(), b.DisplayObject = function() {
        this.position = new b.Point(), this.scale = new b.Point(1, 1), this.pivot = new b.Point(0, 0), 
        this.rotation = 0, this.alpha = 1, this.visible = !0, this.hitArea = null, this.buttonMode = !1, 
        this.renderable = !1, this.parent = null, this.stage = null, this.worldAlpha = 1, 
        this._interactive = !1, this.defaultCursor = "pointer", this.worldTransform = new b.Matrix(), 
        this.color = [], this.dynamic = !0, this._sr = 0, this._cr = 1, this.filterArea = null, 
        this._bounds = new b.Rectangle(0, 0, 1, 1), this._currentBounds = null, this._mask = null, 
        this._cacheAsBitmap = !1, this._cacheIsDirty = !1;
    }, b.DisplayObject.prototype.constructor = b.DisplayObject, b.DisplayObject.prototype.setInteractive = function(a) {
        this.interactive = a;
    }, Object.defineProperty(b.DisplayObject.prototype, "interactive", {
        get: function() {
            return this._interactive;
        },
        set: function(a) {
            this._interactive = a, this.stage && (this.stage.dirty = !0);
        }
    }), Object.defineProperty(b.DisplayObject.prototype, "worldVisible", {
        get: function() {
            var a = this;
            do {
                if (!a.visible) return !1;
                a = a.parent;
            } while (a);
            return !0;
        }
    }), Object.defineProperty(b.DisplayObject.prototype, "mask", {
        get: function() {
            return this._mask;
        },
        set: function(a) {
            this._mask && (this._mask.isMask = !1), this._mask = a, this._mask && (this._mask.isMask = !0);
        }
    }), Object.defineProperty(b.DisplayObject.prototype, "filters", {
        get: function() {
            return this._filters;
        },
        set: function(a) {
            if (a) {
                for (var b = [], c = 0; c < a.length; c++) for (var d = a[c].passes, e = 0; e < d.length; e++) b.push(d[e]);
                this._filterBlock = {
                    target: this,
                    filterPasses: b
                };
            }
            this._filters = a;
        }
    }), Object.defineProperty(b.DisplayObject.prototype, "cacheAsBitmap", {
        get: function() {
            return this._cacheAsBitmap;
        },
        set: function(a) {
            this._cacheAsBitmap !== a && (a ? this._generateCachedSprite() : this._destroyCachedSprite(), 
            this._cacheAsBitmap = a);
        }
    }), b.DisplayObject.prototype.updateTransform = function() {
        this.rotation !== this.rotationCache && (this.rotationCache = this.rotation, this._sr = Math.sin(this.rotation), 
        this._cr = Math.cos(this.rotation));
        var a = this.parent.worldTransform, b = this.worldTransform, c = this.pivot.x, d = this.pivot.y, e = this._cr * this.scale.x, f = -this._sr * this.scale.y, g = this._sr * this.scale.x, h = this._cr * this.scale.y, i = this.position.x - e * c - d * f, j = this.position.y - h * d - c * g, k = a.a, l = a.b, m = a.c, n = a.d;
        b.a = k * e + l * g, b.b = k * f + l * h, b.tx = k * i + l * j + a.tx, b.c = m * e + n * g, 
        b.d = m * f + n * h, b.ty = m * i + n * j + a.ty, this.worldAlpha = this.alpha * this.parent.worldAlpha;
    }, b.DisplayObject.prototype.getBounds = function(a) {
        return a = a, b.EmptyRectangle;
    }, b.DisplayObject.prototype.getLocalBounds = function() {
        return this.getBounds(b.identityMatrix);
    }, b.DisplayObject.prototype.setStageReference = function(a) {
        this.stage = a, this._interactive && (this.stage.dirty = !0);
    }, b.DisplayObject.prototype.generateTexture = function(a) {
        var c = this.getLocalBounds(), d = new b.RenderTexture(0 | c.width, 0 | c.height, a);
        return d.render(this, new b.Point(-c.x, -c.y)), d;
    }, b.DisplayObject.prototype.updateCache = function() {
        this._generateCachedSprite();
    }, b.DisplayObject.prototype._renderCachedSprite = function(a) {
        this._cachedSprite.worldAlpha = this.worldAlpha, a.gl ? b.Sprite.prototype._renderWebGL.call(this._cachedSprite, a) : b.Sprite.prototype._renderCanvas.call(this._cachedSprite, a);
    }, b.DisplayObject.prototype._generateCachedSprite = function() {
        this._cacheAsBitmap = !1;
        var a = this.getLocalBounds();
        if (this._cachedSprite) this._cachedSprite.texture.resize(0 | a.width, 0 | a.height); else {
            var c = new b.RenderTexture(0 | a.width, 0 | a.height);
            this._cachedSprite = new b.Sprite(c), this._cachedSprite.worldTransform = this.worldTransform;
        }
        var d = this._filters;
        this._filters = null, this._cachedSprite.filters = d, this._cachedSprite.texture.render(this, new b.Point(-a.x, -a.y)), 
        this._cachedSprite.anchor.x = -(a.x / a.width), this._cachedSprite.anchor.y = -(a.y / a.height), 
        this._filters = d, this._cacheAsBitmap = !0;
    }, b.DisplayObject.prototype._destroyCachedSprite = function() {
        this._cachedSprite && (this._cachedSprite.texture.destroy(!0), this._cachedSprite = null);
    }, b.DisplayObject.prototype._renderWebGL = function(a) {
        a = a;
    }, b.DisplayObject.prototype._renderCanvas = function(a) {
        a = a;
    }, Object.defineProperty(b.DisplayObject.prototype, "x", {
        get: function() {
            return this.position.x;
        },
        set: function(a) {
            this.position.x = a;
        }
    }), Object.defineProperty(b.DisplayObject.prototype, "y", {
        get: function() {
            return this.position.y;
        },
        set: function(a) {
            this.position.y = a;
        }
    }), b.DisplayObjectContainer = function() {
        b.DisplayObject.call(this), this.children = [];
    }, b.DisplayObjectContainer.prototype = Object.create(b.DisplayObject.prototype), 
    b.DisplayObjectContainer.prototype.constructor = b.DisplayObjectContainer, Object.defineProperty(b.DisplayObjectContainer.prototype, "width", {
        get: function() {
            return this.scale.x * this.getLocalBounds().width;
        },
        set: function(a) {
            var b = this.getLocalBounds().width;
            this.scale.x = 0 !== b ? a / (b / this.scale.x) : 1, this._width = a;
        }
    }), Object.defineProperty(b.DisplayObjectContainer.prototype, "height", {
        get: function() {
            return this.scale.y * this.getLocalBounds().height;
        },
        set: function(a) {
            var b = this.getLocalBounds().height;
            this.scale.y = 0 !== b ? a / (b / this.scale.y) : 1, this._height = a;
        }
    }), b.DisplayObjectContainer.prototype.addChild = function(a) {
        return this.addChildAt(a, this.children.length);
    }, b.DisplayObjectContainer.prototype.addChildAt = function(a, b) {
        if (b >= 0 && b <= this.children.length) return a.parent && a.parent.removeChild(a), 
        a.parent = this, this.children.splice(b, 0, a), this.stage && a.setStageReference(this.stage), 
        a;
        throw new Error(a + " The index " + b + " supplied is out of bounds " + this.children.length);
    }, b.DisplayObjectContainer.prototype.swapChildren = function(a, b) {
        if (a !== b) {
            var c = this.children.indexOf(a), d = this.children.indexOf(b);
            if (0 > c || 0 > d) throw new Error("swapChildren: Both the supplied DisplayObjects must be a child of the caller.");
            this.children[c] = b, this.children[d] = a;
        }
    }, b.DisplayObjectContainer.prototype.getChildAt = function(a) {
        if (a >= 0 && a < this.children.length) return this.children[a];
        throw new Error("Supplied index does not exist in the child list, or the supplied DisplayObject must be a child of the caller");
    }, b.DisplayObjectContainer.prototype.removeChild = function(a) {
        return this.removeChildAt(this.children.indexOf(a));
    }, b.DisplayObjectContainer.prototype.removeChildAt = function(a) {
        var b = this.getChildAt(a);
        return this.stage && b.removeStageReference(), b.parent = void 0, this.children.splice(a, 1), 
        b;
    }, b.DisplayObjectContainer.prototype.removeChildren = function(a, b) {
        var c = a || 0, d = "number" == typeof b ? b : this.children.length, e = d - c;
        if (e > 0 && d >= e) {
            for (var f = this.children.splice(c, e), g = 0; g < f.length; g++) {
                var h = f[g];
                this.stage && h.removeStageReference(), h.parent = void 0;
            }
            return f;
        }
        throw new Error("Range Error, numeric values are outside the acceptable range");
    }, b.DisplayObjectContainer.prototype.updateTransform = function() {
        if (this.visible && (b.DisplayObject.prototype.updateTransform.call(this), !this._cacheAsBitmap)) for (var a = 0, c = this.children.length; c > a; a++) this.children[a].updateTransform();
    }, b.DisplayObjectContainer.prototype.getBounds = function(a) {
        if (0 === this.children.length) return b.EmptyRectangle;
        if (a) {
            var c = this.worldTransform;
            this.worldTransform = a, this.updateTransform(), this.worldTransform = c;
        }
        for (var d, e, f, g = 1 / 0, h = 1 / 0, i = -1 / 0, j = -1 / 0, k = !1, l = 0, m = this.children.length; m > l; l++) {
            var n = this.children[l];
            n.visible && (k = !0, d = this.children[l].getBounds(a), g = g < d.x ? g : d.x, 
            h = h < d.y ? h : d.y, e = d.width + d.x, f = d.height + d.y, i = i > e ? i : e, 
            j = j > f ? j : f);
        }
        if (!k) return b.EmptyRectangle;
        var o = this._bounds;
        return o.x = g, o.y = h, o.width = i - g, o.height = j - h, o;
    }, b.DisplayObjectContainer.prototype.getLocalBounds = function() {
        var a = this.worldTransform;
        this.worldTransform = b.identityMatrix;
        for (var c = 0, d = this.children.length; d > c; c++) this.children[c].updateTransform();
        var e = this.getBounds();
        return this.worldTransform = a, e;
    }, b.DisplayObjectContainer.prototype.setStageReference = function(a) {
        this.stage = a, this._interactive && (this.stage.dirty = !0);
        for (var b = 0, c = this.children.length; c > b; b++) {
            var d = this.children[b];
            d.setStageReference(a);
        }
    }, b.DisplayObjectContainer.prototype.removeStageReference = function() {
        for (var a = 0, b = this.children.length; b > a; a++) {
            var c = this.children[a];
            c.removeStageReference();
        }
        this._interactive && (this.stage.dirty = !0), this.stage = null;
    }, b.DisplayObjectContainer.prototype._renderWebGL = function(a) {
        if (this.visible && !(this.alpha <= 0)) {
            if (this._cacheAsBitmap) return void this._renderCachedSprite(a);
            var b, c;
            if (this._mask || this._filters) {
                for (this._filters && (a.spriteBatch.flush(), a.filterManager.pushFilter(this._filterBlock)), 
                this._mask && (a.spriteBatch.stop(), a.maskManager.pushMask(this.mask, a), a.spriteBatch.start()), 
                b = 0, c = this.children.length; c > b; b++) this.children[b]._renderWebGL(a);
                a.spriteBatch.stop(), this._mask && a.maskManager.popMask(this._mask, a), this._filters && a.filterManager.popFilter(), 
                a.spriteBatch.start();
            } else for (b = 0, c = this.children.length; c > b; b++) this.children[b]._renderWebGL(a);
        }
    }, b.DisplayObjectContainer.prototype._renderCanvas = function(a) {
        if (this.visible !== !1 && 0 !== this.alpha) {
            if (this._cacheAsBitmap) return void this._renderCachedSprite(a);
            this._mask && a.maskManager.pushMask(this._mask, a.context);
            for (var b = 0, c = this.children.length; c > b; b++) {
                var d = this.children[b];
                d._renderCanvas(a);
            }
            this._mask && a.maskManager.popMask(a.context);
        }
    }, b.Sprite = function(a) {
        b.DisplayObjectContainer.call(this), this.anchor = new b.Point(), this.texture = a, 
        this._width = 0, this._height = 0, this.tint = 16777215, this.blendMode = b.blendModes.NORMAL, 
        a.baseTexture.hasLoaded ? this.onTextureUpdate() : (this.onTextureUpdateBind = this.onTextureUpdate.bind(this), 
        this.texture.addEventListener("update", this.onTextureUpdateBind)), this.renderable = !0;
    }, b.Sprite.prototype = Object.create(b.DisplayObjectContainer.prototype), b.Sprite.prototype.constructor = b.Sprite, 
    Object.defineProperty(b.Sprite.prototype, "width", {
        get: function() {
            return this.scale.x * this.texture.frame.width;
        },
        set: function(a) {
            this.scale.x = a / this.texture.frame.width, this._width = a;
        }
    }), Object.defineProperty(b.Sprite.prototype, "height", {
        get: function() {
            return this.scale.y * this.texture.frame.height;
        },
        set: function(a) {
            this.scale.y = a / this.texture.frame.height, this._height = a;
        }
    }), b.Sprite.prototype.setTexture = function(a) {
        this.texture = a, this.cachedTint = 16777215;
    }, b.Sprite.prototype.onTextureUpdate = function() {
        this._width && (this.scale.x = this._width / this.texture.frame.width), this._height && (this.scale.y = this._height / this.texture.frame.height);
    }, b.Sprite.prototype.getBounds = function(a) {
        var b = this.texture.frame.width, c = this.texture.frame.height, d = b * (1 - this.anchor.x), e = b * -this.anchor.x, f = c * (1 - this.anchor.y), g = c * -this.anchor.y, h = a || this.worldTransform, i = h.a, j = h.c, k = h.b, l = h.d, m = h.tx, n = h.ty, o = i * e + k * g + m, p = l * g + j * e + n, q = i * d + k * g + m, r = l * g + j * d + n, s = i * d + k * f + m, t = l * f + j * d + n, u = i * e + k * f + m, v = l * f + j * e + n, w = -1 / 0, x = -1 / 0, y = 1 / 0, z = 1 / 0;
        y = y > o ? o : y, y = y > q ? q : y, y = y > s ? s : y, y = y > u ? u : y, z = z > p ? p : z, 
        z = z > r ? r : z, z = z > t ? t : z, z = z > v ? v : z, w = o > w ? o : w, w = q > w ? q : w, 
        w = s > w ? s : w, w = u > w ? u : w, x = p > x ? p : x, x = r > x ? r : x, x = t > x ? t : x, 
        x = v > x ? v : x;
        var A = this._bounds;
        return A.x = y, A.width = w - y, A.y = z, A.height = x - z, this._currentBounds = A, 
        A;
    }, b.Sprite.prototype._renderWebGL = function(a) {
        if (this.visible && !(this.alpha <= 0)) {
            var b, c;
            if (this._mask || this._filters) {
                var d = a.spriteBatch;
                for (this._filters && (d.flush(), a.filterManager.pushFilter(this._filterBlock)), 
                this._mask && (d.stop(), a.maskManager.pushMask(this.mask, a), d.start()), d.render(this), 
                b = 0, c = this.children.length; c > b; b++) this.children[b]._renderWebGL(a);
                d.stop(), this._mask && a.maskManager.popMask(this._mask, a), this._filters && a.filterManager.popFilter(), 
                d.start();
            } else for (a.spriteBatch.render(this), b = 0, c = this.children.length; c > b; b++) this.children[b]._renderWebGL(a);
        }
    }, b.Sprite.prototype._renderCanvas = function(a) {
        if (this.visible !== !1 && 0 !== this.alpha) {
            if (this.blendMode !== a.currentBlendMode && (a.currentBlendMode = this.blendMode, 
            a.context.globalCompositeOperation = b.blendModesCanvas[a.currentBlendMode]), this._mask && a.maskManager.pushMask(this._mask, a.context), 
            this.texture.valid) {
                a.context.globalAlpha = this.worldAlpha, a.roundPixels ? a.context.setTransform(this.worldTransform.a, this.worldTransform.c, this.worldTransform.b, this.worldTransform.d, 0 | this.worldTransform.tx, 0 | this.worldTransform.ty) : a.context.setTransform(this.worldTransform.a, this.worldTransform.c, this.worldTransform.b, this.worldTransform.d, this.worldTransform.tx, this.worldTransform.ty), 
                a.smoothProperty && a.scaleMode !== this.texture.baseTexture.scaleMode && (a.scaleMode = this.texture.baseTexture.scaleMode, 
                a.context[a.smoothProperty] = a.scaleMode === b.scaleModes.LINEAR);
                var c = this.texture.trim ? this.texture.trim.x - this.anchor.x * this.texture.trim.width : this.anchor.x * -this.texture.frame.width, d = this.texture.trim ? this.texture.trim.y - this.anchor.y * this.texture.trim.height : this.anchor.y * -this.texture.frame.height;
                16777215 !== this.tint ? (this.cachedTint !== this.tint && (this.cachedTint = this.tint, 
                this.tintedTexture = b.CanvasTinter.getTintedTexture(this, this.tint)), a.context.drawImage(this.tintedTexture, 0, 0, this.texture.crop.width, this.texture.crop.height, c, d, this.texture.crop.width, this.texture.crop.height)) : a.context.drawImage(this.texture.baseTexture.source, this.texture.crop.x, this.texture.crop.y, this.texture.crop.width, this.texture.crop.height, c, d, this.texture.crop.width, this.texture.crop.height);
            }
            for (var e = 0, f = this.children.length; f > e; e++) this.children[e]._renderCanvas(a);
            this._mask && a.maskManager.popMask(a.context);
        }
    }, b.Sprite.fromFrame = function(a) {
        var c = b.TextureCache[a];
        if (!c) throw new Error('The frameId "' + a + '" does not exist in the texture cache' + this);
        return new b.Sprite(c);
    }, b.Sprite.fromImage = function(a, c, d) {
        var e = b.Texture.fromImage(a, c, d);
        return new b.Sprite(e);
    }, b.SpriteBatch = function(a) {
        b.DisplayObjectContainer.call(this), this.textureThing = a, this.ready = !1;
    }, b.SpriteBatch.prototype = Object.create(b.DisplayObjectContainer.prototype), 
    b.SpriteBatch.constructor = b.SpriteBatch, b.SpriteBatch.prototype.initWebGL = function(a) {
        this.fastSpriteBatch = new b.WebGLFastSpriteBatch(a), this.ready = !0;
    }, b.SpriteBatch.prototype.updateTransform = function() {
        b.DisplayObject.prototype.updateTransform.call(this);
    }, b.SpriteBatch.prototype._renderWebGL = function(a) {
        !this.visible || this.alpha <= 0 || !this.children.length || (this.ready || this.initWebGL(a.gl), 
        a.spriteBatch.stop(), a.shaderManager.setShader(a.shaderManager.fastShader), this.fastSpriteBatch.begin(this, a), 
        this.fastSpriteBatch.render(this), a.spriteBatch.start());
    }, b.SpriteBatch.prototype._renderCanvas = function(a) {
        var c = a.context;
        c.globalAlpha = this.worldAlpha, b.DisplayObject.prototype.updateTransform.call(this);
        for (var d = this.worldTransform, e = !0, f = 0; f < this.children.length; f++) {
            var g = this.children[f];
            if (g.visible) {
                var h = g.texture, i = h.frame;
                if (c.globalAlpha = this.worldAlpha * g.alpha, g.rotation % (2 * Math.PI) === 0) e && (c.setTransform(d.a, d.c, d.b, d.d, d.tx, d.ty), 
                e = !1), c.drawImage(h.baseTexture.source, i.x, i.y, i.width, i.height, g.anchor.x * -i.width * g.scale.x + g.position.x + .5 | 0, g.anchor.y * -i.height * g.scale.y + g.position.y + .5 | 0, i.width * g.scale.x, i.height * g.scale.y); else {
                    e || (e = !0), b.DisplayObject.prototype.updateTransform.call(g);
                    var j = g.worldTransform;
                    a.roundPixels ? c.setTransform(j.a, j.c, j.b, j.d, 0 | j.tx, 0 | j.ty) : c.setTransform(j.a, j.c, j.b, j.d, j.tx, j.ty), 
                    c.drawImage(h.baseTexture.source, i.x, i.y, i.width, i.height, g.anchor.x * -i.width + .5 | 0, g.anchor.y * -i.height + .5 | 0, i.width, i.height);
                }
            }
        }
    }, b.MovieClip = function(a) {
        b.Sprite.call(this, a[0]), this.textures = a, this.animationSpeed = 1, this.loop = !0, 
        this.onComplete = null, this.currentFrame = 0, this.playing = !1;
    }, b.MovieClip.prototype = Object.create(b.Sprite.prototype), b.MovieClip.prototype.constructor = b.MovieClip, 
    Object.defineProperty(b.MovieClip.prototype, "totalFrames", {
        get: function() {
            return this.textures.length;
        }
    }), b.MovieClip.prototype.stop = function() {
        this.playing = !1;
    }, b.MovieClip.prototype.play = function() {
        this.playing = !0;
    }, b.MovieClip.prototype.gotoAndStop = function(a) {
        this.playing = !1, this.currentFrame = a;
        var b = this.currentFrame + .5 | 0;
        this.setTexture(this.textures[b % this.textures.length]);
    }, b.MovieClip.prototype.gotoAndPlay = function(a) {
        this.currentFrame = a, this.playing = !0;
    }, b.MovieClip.prototype.updateTransform = function() {
        if (b.Sprite.prototype.updateTransform.call(this), this.playing) {
            this.currentFrame += this.animationSpeed;
            var a = this.currentFrame + .5 | 0;
            this.currentFrame = this.currentFrame % this.textures.length, this.loop || a < this.textures.length ? this.setTexture(this.textures[a % this.textures.length]) : a >= this.textures.length && (this.gotoAndStop(this.textures.length - 1), 
            this.onComplete && this.onComplete());
        }
    }, b.MovieClip.fromFrames = function(a) {
        for (var c = [], d = 0; d < a.length; d++) c.push(new b.Texture.fromFrame(a[d]));
        return new b.MovieClip(c);
    }, b.MovieClip.fromImages = function(a) {
        for (var c = [], d = 0; d < a.length; d++) c.push(new b.Texture.fromImage(a[d]));
        return new b.MovieClip(c);
    }, b.FilterBlock = function() {
        this.visible = !0, this.renderable = !0;
    }, b.Text = function(a, c) {
        this.canvas = document.createElement("canvas"), this.context = this.canvas.getContext("2d"), 
        b.Sprite.call(this, b.Texture.fromCanvas(this.canvas)), this.setText(a), this.setStyle(c);
    }, b.Text.prototype = Object.create(b.Sprite.prototype), b.Text.prototype.constructor = b.Text, 
    Object.defineProperty(b.Text.prototype, "width", {
        get: function() {
            return this.dirty && (this.updateText(), this.dirty = !1), this.scale.x * this.texture.frame.width;
        },
        set: function(a) {
            this.scale.x = a / this.texture.frame.width, this._width = a;
        }
    }), Object.defineProperty(b.Text.prototype, "height", {
        get: function() {
            return this.dirty && (this.updateText(), this.dirty = !1), this.scale.y * this.texture.frame.height;
        },
        set: function(a) {
            this.scale.y = a / this.texture.frame.height, this._height = a;
        }
    }), b.Text.prototype.setStyle = function(a) {
        a = a || {}, a.font = a.font || "bold 20pt Arial", a.fill = a.fill || "black", a.align = a.align || "left", 
        a.stroke = a.stroke || "black", a.strokeThickness = a.strokeThickness || 0, a.wordWrap = a.wordWrap || !1, 
        a.wordWrapWidth = a.wordWrapWidth || 100, a.wordWrapWidth = a.wordWrapWidth || 100, 
        a.dropShadow = a.dropShadow || !1, a.dropShadowAngle = a.dropShadowAngle || Math.PI / 6, 
        a.dropShadowDistance = a.dropShadowDistance || 4, a.dropShadowColor = a.dropShadowColor || "black", 
        this.style = a, this.dirty = !0;
    }, b.Text.prototype.setText = function(a) {
        this.text = a.toString() || " ", this.dirty = !0;
    }, b.Text.prototype.updateText = function() {
        this.context.font = this.style.font;
        var a = this.text;
        this.style.wordWrap && (a = this.wordWrap(this.text));
        for (var b = a.split(/(?:\r\n|\r|\n)/), c = [], d = 0, e = 0; e < b.length; e++) {
            var f = this.context.measureText(b[e]).width;
            c[e] = f, d = Math.max(d, f);
        }
        var g = d + this.style.strokeThickness;
        this.style.dropShadow && (g += this.style.dropShadowDistance), this.canvas.width = g + this.context.lineWidth;
        var h = this.determineFontHeight("font: " + this.style.font + ";") + this.style.strokeThickness, i = h * b.length;
        this.style.dropShadow && (i += this.style.dropShadowDistance), this.canvas.height = i, 
        navigator.isCocoonJS && this.context.clearRect(0, 0, this.canvas.width, this.canvas.height), 
        this.context.font = this.style.font, this.context.strokeStyle = this.style.stroke, 
        this.context.lineWidth = this.style.strokeThickness, this.context.textBaseline = "top";
        var j, k;
        if (this.style.dropShadow) {
            this.context.fillStyle = this.style.dropShadowColor;
            var l = Math.sin(this.style.dropShadowAngle) * this.style.dropShadowDistance, m = Math.cos(this.style.dropShadowAngle) * this.style.dropShadowDistance;
            for (e = 0; e < b.length; e++) j = this.style.strokeThickness / 2, k = this.style.strokeThickness / 2 + e * h, 
            "right" === this.style.align ? j += d - c[e] : "center" === this.style.align && (j += (d - c[e]) / 2), 
            this.style.fill && this.context.fillText(b[e], j + l, k + m);
        }
        for (this.context.fillStyle = this.style.fill, e = 0; e < b.length; e++) j = this.style.strokeThickness / 2, 
        k = this.style.strokeThickness / 2 + e * h, "right" === this.style.align ? j += d - c[e] : "center" === this.style.align && (j += (d - c[e]) / 2), 
        this.style.stroke && this.style.strokeThickness && this.context.strokeText(b[e], j, k), 
        this.style.fill && this.context.fillText(b[e], j, k);
        this.updateTexture();
    }, b.Text.prototype.updateTexture = function() {
        this.texture.baseTexture.width = this.canvas.width, this.texture.baseTexture.height = this.canvas.height, 
        this.texture.crop.width = this.texture.frame.width = this.canvas.width, this.texture.crop.height = this.texture.frame.height = this.canvas.height, 
        this._width = this.canvas.width, this._height = this.canvas.height, this.requiresUpdate = !0;
    }, b.Text.prototype._renderWebGL = function(a) {
        this.requiresUpdate && (this.requiresUpdate = !1, b.updateWebGLTexture(this.texture.baseTexture, a.gl)), 
        b.Sprite.prototype._renderWebGL.call(this, a);
    }, b.Text.prototype.updateTransform = function() {
        this.dirty && (this.updateText(), this.dirty = !1), b.Sprite.prototype.updateTransform.call(this);
    }, b.Text.prototype.determineFontHeight = function(a) {
        var c = b.Text.heightCache[a];
        if (!c) {
            var d = document.getElementsByTagName("body")[0], e = document.createElement("div"), f = document.createTextNode("M");
            e.appendChild(f), e.setAttribute("style", a + ";position:absolute;top:0;left:0"), 
            d.appendChild(e), c = e.offsetHeight, b.Text.heightCache[a] = c, d.removeChild(e);
        }
        return c;
    }, b.Text.prototype.wordWrap = function(a) {
        for (var b = "", c = a.split("\n"), d = 0; d < c.length; d++) {
            for (var e = this.style.wordWrapWidth, f = c[d].split(" "), g = 0; g < f.length; g++) {
                var h = this.context.measureText(f[g]).width, i = h + this.context.measureText(" ").width;
                0 === g || i > e ? (g > 0 && (b += "\n"), b += f[g], e = this.style.wordWrapWidth - h) : (e -= i, 
                b += " " + f[g]);
            }
            d < c.length - 1 && (b += "\n");
        }
        return b;
    }, b.Text.prototype.destroy = function(a) {
        this.context = null, this.canvas = null, this.texture.destroy(void 0 === a ? !0 : a);
    }, b.Text.heightCache = {}, b.BitmapText = function(a, c) {
        b.DisplayObjectContainer.call(this), this._pool = [], this.setText(a), this.setStyle(c), 
        this.updateText(), this.dirty = !1;
    }, b.BitmapText.prototype = Object.create(b.DisplayObjectContainer.prototype), b.BitmapText.prototype.constructor = b.BitmapText, 
    b.BitmapText.prototype.setText = function(a) {
        this.text = a || " ", this.dirty = !0;
    }, b.BitmapText.prototype.setStyle = function(a) {
        a = a || {}, a.align = a.align || "left", this.style = a;
        var c = a.font.split(" ");
        this.fontName = c[c.length - 1], this.fontSize = c.length >= 2 ? parseInt(c[c.length - 2], 10) : b.BitmapText.fonts[this.fontName].size, 
        this.dirty = !0, this.tint = a.tint;
    }, b.BitmapText.prototype.updateText = function() {
        for (var a = b.BitmapText.fonts[this.fontName], c = new b.Point(), d = null, e = [], f = 0, g = [], h = 0, i = this.fontSize / a.size, j = 0; j < this.text.length; j++) {
            var k = this.text.charCodeAt(j);
            if (/(?:\r\n|\r|\n)/.test(this.text.charAt(j))) g.push(c.x), f = Math.max(f, c.x), 
            h++, c.x = 0, c.y += a.lineHeight, d = null; else {
                var l = a.chars[k];
                l && (d && l[d] && (c.x += l.kerning[d]), e.push({
                    texture: l.texture,
                    line: h,
                    charCode: k,
                    position: new b.Point(c.x + l.xOffset, c.y + l.yOffset)
                }), c.x += l.xAdvance, d = k);
            }
        }
        g.push(c.x), f = Math.max(f, c.x);
        var m = [];
        for (j = 0; h >= j; j++) {
            var n = 0;
            "right" === this.style.align ? n = f - g[j] : "center" === this.style.align && (n = (f - g[j]) / 2), 
            m.push(n);
        }
        var o = this.children.length, p = e.length, q = this.tint || 16777215;
        for (j = 0; p > j; j++) {
            var r = o > j ? this.children[j] : this._pool.pop();
            r ? r.setTexture(e[j].texture) : r = new b.Sprite(e[j].texture), r.position.x = (e[j].position.x + m[e[j].line]) * i, 
            r.position.y = e[j].position.y * i, r.scale.x = r.scale.y = i, r.tint = q, r.parent || this.addChild(r);
        }
        for (;this.children.length > p; ) {
            var s = this.getChildAt(this.children.length - 1);
            this._pool.push(s), this.removeChild(s);
        }
        this.textWidth = f * i, this.textHeight = (c.y + a.lineHeight) * i;
    }, b.BitmapText.prototype.updateTransform = function() {
        this.dirty && (this.updateText(), this.dirty = !1), b.DisplayObjectContainer.prototype.updateTransform.call(this);
    }, b.BitmapText.fonts = {}, b.InteractionData = function() {
        this.global = new b.Point(), this.target = null, this.originalEvent = null;
    }, b.InteractionData.prototype.getLocalPosition = function(a) {
        var c = a.worldTransform, d = this.global, e = c.a, f = c.b, g = c.tx, h = c.c, i = c.d, j = c.ty, k = 1 / (e * i + f * -h);
        return new b.Point(i * k * d.x + -f * k * d.y + (j * f - g * i) * k, e * k * d.y + -h * k * d.x + (-j * e + g * h) * k);
    }, b.InteractionData.prototype.constructor = b.InteractionData, b.InteractionManager = function(a) {
        this.stage = a, this.mouse = new b.InteractionData(), this.touchs = {}, this.tempPoint = new b.Point(), 
        this.mouseoverEnabled = !0, this.pool = [], this.interactiveItems = [], this.interactionDOMElement = null, 
        this.onMouseMove = this.onMouseMove.bind(this), this.onMouseDown = this.onMouseDown.bind(this), 
        this.onMouseOut = this.onMouseOut.bind(this), this.onMouseUp = this.onMouseUp.bind(this), 
        this.onTouchStart = this.onTouchStart.bind(this), this.onTouchEnd = this.onTouchEnd.bind(this), 
        this.onTouchMove = this.onTouchMove.bind(this), this.last = 0, this.currentCursorStyle = "inherit", 
        this.mouseOut = !1;
    }, b.InteractionManager.prototype.constructor = b.InteractionManager, b.InteractionManager.prototype.collectInteractiveSprite = function(a, b) {
        for (var c = a.children, d = c.length, e = d - 1; e >= 0; e--) {
            var f = c[e];
            f._interactive ? (b.interactiveChildren = !0, this.interactiveItems.push(f), f.children.length > 0 && this.collectInteractiveSprite(f, f)) : (f.__iParent = null, 
            f.children.length > 0 && this.collectInteractiveSprite(f, b));
        }
    }, b.InteractionManager.prototype.setTarget = function(a) {
        this.target = a, null === this.interactionDOMElement && this.setTargetDomElement(a.view);
    }, b.InteractionManager.prototype.setTargetDomElement = function(a) {
        this.removeEvents(), window.navigator.msPointerEnabled && (a.style["-ms-content-zooming"] = "none", 
        a.style["-ms-touch-action"] = "none"), this.interactionDOMElement = a, a.addEventListener("mousemove", this.onMouseMove, !0), 
        a.addEventListener("mousedown", this.onMouseDown, !0), a.addEventListener("mouseout", this.onMouseOut, !0), 
        a.addEventListener("touchstart", this.onTouchStart, !0), a.addEventListener("touchend", this.onTouchEnd, !0), 
        a.addEventListener("touchmove", this.onTouchMove, !0), window.addEventListener("mouseup", this.onMouseUp, !0);
    }, b.InteractionManager.prototype.removeEvents = function() {
        this.interactionDOMElement && (this.interactionDOMElement.style["-ms-content-zooming"] = "", 
        this.interactionDOMElement.style["-ms-touch-action"] = "", this.interactionDOMElement.removeEventListener("mousemove", this.onMouseMove, !0), 
        this.interactionDOMElement.removeEventListener("mousedown", this.onMouseDown, !0), 
        this.interactionDOMElement.removeEventListener("mouseout", this.onMouseOut, !0), 
        this.interactionDOMElement.removeEventListener("touchstart", this.onTouchStart, !0), 
        this.interactionDOMElement.removeEventListener("touchend", this.onTouchEnd, !0), 
        this.interactionDOMElement.removeEventListener("touchmove", this.onTouchMove, !0), 
        this.interactionDOMElement = null, window.removeEventListener("mouseup", this.onMouseUp, !0));
    }, b.InteractionManager.prototype.update = function() {
        if (this.target) {
            var a = Date.now(), c = a - this.last;
            if (c = c * b.INTERACTION_FREQUENCY / 1e3, !(1 > c)) {
                this.last = a;
                var d = 0;
                this.dirty && this.rebuildInteractiveGraph();
                var e = this.interactiveItems.length, f = "inherit", g = !1;
                for (d = 0; e > d; d++) {
                    var h = this.interactiveItems[d];
                    h.__hit = this.hitTest(h, this.mouse), this.mouse.target = h, h.__hit && !g ? (h.buttonMode && (f = h.defaultCursor), 
                    h.interactiveChildren || (g = !0), h.__isOver || (h.mouseover && h.mouseover(this.mouse), 
                    h.__isOver = !0)) : h.__isOver && (h.mouseout && h.mouseout(this.mouse), h.__isOver = !1);
                }
                this.currentCursorStyle !== f && (this.currentCursorStyle = f, this.interactionDOMElement.style.cursor = f);
            }
        }
    }, b.InteractionManager.prototype.rebuildInteractiveGraph = function() {
        this.dirty = !1;
        for (var a = this.interactiveItems.length, b = 0; a > b; b++) this.interactiveItems[b].interactiveChildren = !1;
        this.interactiveItems = [], this.stage.interactive && this.interactiveItems.push(this.stage), 
        this.collectInteractiveSprite(this.stage, this.stage);
    }, b.InteractionManager.prototype.onMouseMove = function(a) {
        this.dirty && this.rebuildInteractiveGraph(), this.mouse.originalEvent = a || window.event;
        var b = this.interactionDOMElement.getBoundingClientRect();
        this.mouse.global.x = (a.clientX - b.left) * (this.target.width / b.width), this.mouse.global.y = (a.clientY - b.top) * (this.target.height / b.height);
        for (var c = this.interactiveItems.length, d = 0; c > d; d++) {
            var e = this.interactiveItems[d];
            e.mousemove && e.mousemove(this.mouse);
        }
    }, b.InteractionManager.prototype.onMouseDown = function(a) {
        this.dirty && this.rebuildInteractiveGraph(), this.mouse.originalEvent = a || window.event, 
        b.AUTO_PREVENT_DEFAULT && this.mouse.originalEvent.preventDefault();
        for (var c = this.interactiveItems.length, d = 0; c > d; d++) {
            var e = this.interactiveItems[d];
            if ((e.mousedown || e.click) && (e.__mouseIsDown = !0, e.__hit = this.hitTest(e, this.mouse), 
            e.__hit && (e.mousedown && e.mousedown(this.mouse), e.__isDown = !0, !e.interactiveChildren))) break;
        }
    }, b.InteractionManager.prototype.onMouseOut = function() {
        this.dirty && this.rebuildInteractiveGraph();
        var a = this.interactiveItems.length;
        this.interactionDOMElement.style.cursor = "inherit";
        for (var b = 0; a > b; b++) {
            var c = this.interactiveItems[b];
            c.__isOver && (this.mouse.target = c, c.mouseout && c.mouseout(this.mouse), c.__isOver = !1);
        }
        this.mouseOut = !0, this.mouse.global.x = -1e4, this.mouse.global.y = -1e4;
    }, b.InteractionManager.prototype.onMouseUp = function(a) {
        this.dirty && this.rebuildInteractiveGraph(), this.mouse.originalEvent = a || window.event;
        for (var b = this.interactiveItems.length, c = !1, d = 0; b > d; d++) {
            var e = this.interactiveItems[d];
            e.__hit = this.hitTest(e, this.mouse), e.__hit && !c ? (e.mouseup && e.mouseup(this.mouse), 
            e.__isDown && e.click && e.click(this.mouse), e.interactiveChildren || (c = !0)) : e.__isDown && e.mouseupoutside && e.mouseupoutside(this.mouse), 
            e.__isDown = !1;
        }
    }, b.InteractionManager.prototype.hitTest = function(a, c) {
        var d = c.global;
        if (!a.worldVisible) return !1;
        var e = a instanceof b.Sprite, f = a.worldTransform, g = f.a, h = f.b, i = f.tx, j = f.c, k = f.d, l = f.ty, m = 1 / (g * k + h * -j), n = k * m * d.x + -h * m * d.y + (l * h - i * k) * m, o = g * m * d.y + -j * m * d.x + (-l * g + i * j) * m;
        if (c.target = a, a.hitArea && a.hitArea.contains) return a.hitArea.contains(n, o) ? (c.target = a, 
        !0) : !1;
        if (e) {
            var p, q = a.texture.frame.width, r = a.texture.frame.height, s = -q * a.anchor.x;
            if (n > s && s + q > n && (p = -r * a.anchor.y, o > p && p + r > o)) return c.target = a, 
            !0;
        }
        for (var t = a.children.length, u = 0; t > u; u++) {
            var v = a.children[u], w = this.hitTest(v, c);
            if (w) return c.target = a, !0;
        }
        return !1;
    }, b.InteractionManager.prototype.onTouchMove = function(a) {
        this.dirty && this.rebuildInteractiveGraph();
        var b, c = this.interactionDOMElement.getBoundingClientRect(), d = a.changedTouches, e = 0;
        for (e = 0; e < d.length; e++) {
            var f = d[e];
            b = this.touchs[f.identifier], b.originalEvent = a || window.event, b.global.x = (f.clientX - c.left) * (this.target.width / c.width), 
            b.global.y = (f.clientY - c.top) * (this.target.height / c.height), navigator.isCocoonJS && (b.global.x = f.clientX, 
            b.global.y = f.clientY);
            for (var g = 0; g < this.interactiveItems.length; g++) {
                var h = this.interactiveItems[g];
                h.touchmove && h.__touchData && h.__touchData[f.identifier] && h.touchmove(b);
            }
        }
    }, b.InteractionManager.prototype.onTouchStart = function(a) {
        this.dirty && this.rebuildInteractiveGraph();
        var c = this.interactionDOMElement.getBoundingClientRect();
        b.AUTO_PREVENT_DEFAULT && a.preventDefault();
        for (var d = a.changedTouches, e = 0; e < d.length; e++) {
            var f = d[e], g = this.pool.pop();
            g || (g = new b.InteractionData()), g.originalEvent = a || window.event, this.touchs[f.identifier] = g, 
            g.global.x = (f.clientX - c.left) * (this.target.width / c.width), g.global.y = (f.clientY - c.top) * (this.target.height / c.height), 
            navigator.isCocoonJS && (g.global.x = f.clientX, g.global.y = f.clientY);
            for (var h = this.interactiveItems.length, i = 0; h > i; i++) {
                var j = this.interactiveItems[i];
                if ((j.touchstart || j.tap) && (j.__hit = this.hitTest(j, g), j.__hit && (j.touchstart && j.touchstart(g), 
                j.__isDown = !0, j.__touchData = j.__touchData || {}, j.__touchData[f.identifier] = g, 
                !j.interactiveChildren))) break;
            }
        }
    }, b.InteractionManager.prototype.onTouchEnd = function(a) {
        this.dirty && this.rebuildInteractiveGraph();
        for (var b = this.interactionDOMElement.getBoundingClientRect(), c = a.changedTouches, d = 0; d < c.length; d++) {
            var e = c[d], f = this.touchs[e.identifier], g = !1;
            f.global.x = (e.clientX - b.left) * (this.target.width / b.width), f.global.y = (e.clientY - b.top) * (this.target.height / b.height), 
            navigator.isCocoonJS && (f.global.x = e.clientX, f.global.y = e.clientY);
            for (var h = this.interactiveItems.length, i = 0; h > i; i++) {
                var j = this.interactiveItems[i];
                j.__touchData && j.__touchData[e.identifier] && (j.__hit = this.hitTest(j, j.__touchData[e.identifier]), 
                f.originalEvent = a || window.event, (j.touchend || j.tap) && (j.__hit && !g ? (j.touchend && j.touchend(f), 
                j.__isDown && j.tap && j.tap(f), j.interactiveChildren || (g = !0)) : j.__isDown && j.touchendoutside && j.touchendoutside(f), 
                j.__isDown = !1), j.__touchData[e.identifier] = null);
            }
            this.pool.push(f), this.touchs[e.identifier] = null;
        }
    }, b.Stage = function(a) {
        b.DisplayObjectContainer.call(this), this.worldTransform = new b.Matrix(), this.interactive = !0, 
        this.interactionManager = new b.InteractionManager(this), this.dirty = !0, this.stage = this, 
        this.stage.hitArea = new b.Rectangle(0, 0, 1e5, 1e5), this.setBackgroundColor(a);
    }, b.Stage.prototype = Object.create(b.DisplayObjectContainer.prototype), b.Stage.prototype.constructor = b.Stage, 
    b.Stage.prototype.setInteractionDelegate = function(a) {
        this.interactionManager.setTargetDomElement(a);
    }, b.Stage.prototype.updateTransform = function() {
        this.worldAlpha = 1;
        for (var a = 0, b = this.children.length; b > a; a++) this.children[a].updateTransform();
        this.dirty && (this.dirty = !1, this.interactionManager.dirty = !0), this.interactive && this.interactionManager.update();
    }, b.Stage.prototype.setBackgroundColor = function(a) {
        this.backgroundColor = a || 0, this.backgroundColorSplit = b.hex2rgb(this.backgroundColor);
        var c = this.backgroundColor.toString(16);
        c = "000000".substr(0, 6 - c.length) + c, this.backgroundColorString = "#" + c;
    }, b.Stage.prototype.getMousePosition = function() {
        return this.interactionManager.mouse.global;
    };
    for (var c = 0, d = [ "ms", "moz", "webkit", "o" ], e = 0; e < d.length && !window.requestAnimationFrame; ++e) window.requestAnimationFrame = window[d[e] + "RequestAnimationFrame"], 
    window.cancelAnimationFrame = window[d[e] + "CancelAnimationFrame"] || window[d[e] + "CancelRequestAnimationFrame"];
    window.requestAnimationFrame || (window.requestAnimationFrame = function(a) {
        var b = new Date().getTime(), d = Math.max(0, 16 - (b - c)), e = window.setTimeout(function() {
            a(b + d);
        }, d);
        return c = b + d, e;
    }), window.cancelAnimationFrame || (window.cancelAnimationFrame = function(a) {
        clearTimeout(a);
    }), window.requestAnimFrame = window.requestAnimationFrame, b.hex2rgb = function(a) {
        return [ (a >> 16 & 255) / 255, (a >> 8 & 255) / 255, (255 & a) / 255 ];
    }, b.rgb2hex = function(a) {
        return (255 * a[0] << 16) + (255 * a[1] << 8) + 255 * a[2];
    }, "function" != typeof Function.prototype.bind && (Function.prototype.bind = function() {
        var a = Array.prototype.slice;
        return function(b) {
            function c() {
                var f = e.concat(a.call(arguments));
                d.apply(this instanceof c ? this : b, f);
            }
            var d = this, e = a.call(arguments, 1);
            if ("function" != typeof d) throw new TypeError();
            return c.prototype = function f(a) {
                return a && (f.prototype = a), this instanceof f ? void 0 : new f();
            }(d.prototype), c;
        };
    }()), b.AjaxRequest = function() {
        var a = [ "Msxml2.XMLHTTP.6.0", "Msxml2.XMLHTTP.3.0", "Microsoft.XMLHTTP" ];
        if (!window.ActiveXObject) return window.XMLHttpRequest ? new window.XMLHttpRequest() : !1;
        for (var b = 0; b < a.length; b++) try {
            return new window.ActiveXObject(a[b]);
        } catch (c) {}
    }, b.canUseNewCanvasBlendModes = function() {
        var a = document.createElement("canvas");
        a.width = 1, a.height = 1;
        var b = a.getContext("2d");
        return b.fillStyle = "#000", b.fillRect(0, 0, 1, 1), b.globalCompositeOperation = "multiply", 
        b.fillStyle = "#fff", b.fillRect(0, 0, 1, 1), 0 === b.getImageData(0, 0, 1, 1).data[0];
    }, b.getNextPowerOfTwo = function(a) {
        if (a > 0 && 0 === (a & a - 1)) return a;
        for (var b = 1; a > b; ) b <<= 1;
        return b;
    }, b.EventTarget = function() {
        var a = {};
        this.addEventListener = this.on = function(b, c) {
            void 0 === a[b] && (a[b] = []), -1 === a[b].indexOf(c) && a[b].unshift(c);
        }, this.dispatchEvent = this.emit = function(b) {
            if (a[b.type] && a[b.type].length) for (var c = a[b.type].length - 1; c >= 0; c--) a[b.type][c](b);
        }, this.removeEventListener = this.off = function(b, c) {
            if (void 0 !== a[b]) {
                var d = a[b].indexOf(c);
                -1 !== d && a[b].splice(d, 1);
            }
        }, this.removeAllEventListeners = function(b) {
            var c = a[b];
            c && (c.length = 0);
        };
    }, b.autoDetectRenderer = function(a, c, d, e, f) {
        a || (a = 800), c || (c = 600);
        var g = function() {
            try {
                var a = document.createElement("canvas");
                return !!window.WebGLRenderingContext && (a.getContext("webgl") || a.getContext("experimental-webgl"));
            } catch (b) {
                return !1;
            }
        }();
        return g ? new b.WebGLRenderer(a, c, d, e, f) : new b.CanvasRenderer(a, c, d, e);
    }, b.autoDetectRecommendedRenderer = function(a, c, d, e, f) {
        a || (a = 800), c || (c = 600);
        var g = function() {
            try {
                var a = document.createElement("canvas");
                return !!window.WebGLRenderingContext && (a.getContext("webgl") || a.getContext("experimental-webgl"));
            } catch (b) {
                return !1;
            }
        }(), h = /Android/i.test(navigator.userAgent);
        return g && !h ? new b.WebGLRenderer(a, c, d, e, f) : new b.CanvasRenderer(a, c, d, e);
    }, b.PolyK = {}, b.PolyK.Triangulate = function(a) {
        var c = !0, d = a.length >> 1;
        if (3 > d) return [];
        for (var e = [], f = [], g = 0; d > g; g++) f.push(g);
        g = 0;
        for (var h = d; h > 3; ) {
            var i = f[(g + 0) % h], j = f[(g + 1) % h], k = f[(g + 2) % h], l = a[2 * i], m = a[2 * i + 1], n = a[2 * j], o = a[2 * j + 1], p = a[2 * k], q = a[2 * k + 1], r = !1;
            if (b.PolyK._convex(l, m, n, o, p, q, c)) {
                r = !0;
                for (var s = 0; h > s; s++) {
                    var t = f[s];
                    if (t !== i && t !== j && t !== k && b.PolyK._PointInTriangle(a[2 * t], a[2 * t + 1], l, m, n, o, p, q)) {
                        r = !1;
                        break;
                    }
                }
            }
            if (r) e.push(i, j, k), f.splice((g + 1) % h, 1), h--, g = 0; else if (g++ > 3 * h) {
                if (!c) return window.console.log("PIXI Warning: shape too complex to fill"), [];
                for (e = [], f = [], g = 0; d > g; g++) f.push(g);
                g = 0, h = d, c = !1;
            }
        }
        return e.push(f[0], f[1], f[2]), e;
    }, b.PolyK._PointInTriangle = function(a, b, c, d, e, f, g, h) {
        var i = g - c, j = h - d, k = e - c, l = f - d, m = a - c, n = b - d, o = i * i + j * j, p = i * k + j * l, q = i * m + j * n, r = k * k + l * l, s = k * m + l * n, t = 1 / (o * r - p * p), u = (r * q - p * s) * t, v = (o * s - p * q) * t;
        return u >= 0 && v >= 0 && 1 > u + v;
    }, b.PolyK._convex = function(a, b, c, d, e, f, g) {
        return (b - d) * (e - c) + (c - a) * (f - d) >= 0 === g;
    }, b.initDefaultShaders = function() {}, b.CompileVertexShader = function(a, c) {
        return b._CompileShader(a, c, a.VERTEX_SHADER);
    }, b.CompileFragmentShader = function(a, c) {
        return b._CompileShader(a, c, a.FRAGMENT_SHADER);
    }, b._CompileShader = function(a, b, c) {
        var d = b.join("\n"), e = a.createShader(c);
        return a.shaderSource(e, d), a.compileShader(e), a.getShaderParameter(e, a.COMPILE_STATUS) ? e : (window.console.log(a.getShaderInfoLog(e)), 
        null);
    }, b.compileProgram = function(a, c, d) {
        var e = b.CompileFragmentShader(a, d), f = b.CompileVertexShader(a, c), g = a.createProgram();
        return a.attachShader(g, f), a.attachShader(g, e), a.linkProgram(g), a.getProgramParameter(g, a.LINK_STATUS) || window.console.log("Could not initialise shaders"), 
        g;
    }, b.PixiShader = function(a) {
        this._UID = b._UID++, this.gl = a, this.program = null, this.fragmentSrc = [ "precision lowp float;", "varying vec2 vTextureCoord;", "varying vec4 vColor;", "uniform sampler2D uSampler;", "void main(void) {", "   gl_FragColor = texture2D(uSampler, vTextureCoord) * vColor ;", "}" ], 
        this.textureCount = 0, this.attributes = [], this.init();
    }, b.PixiShader.prototype.init = function() {
        var a = this.gl, c = b.compileProgram(a, this.vertexSrc || b.PixiShader.defaultVertexSrc, this.fragmentSrc);
        a.useProgram(c), this.uSampler = a.getUniformLocation(c, "uSampler"), this.projectionVector = a.getUniformLocation(c, "projectionVector"), 
        this.offsetVector = a.getUniformLocation(c, "offsetVector"), this.dimensions = a.getUniformLocation(c, "dimensions"), 
        this.aVertexPosition = a.getAttribLocation(c, "aVertexPosition"), this.aTextureCoord = a.getAttribLocation(c, "aTextureCoord"), 
        this.colorAttribute = a.getAttribLocation(c, "aColor"), -1 === this.colorAttribute && (this.colorAttribute = 2), 
        this.attributes = [ this.aVertexPosition, this.aTextureCoord, this.colorAttribute ];
        for (var d in this.uniforms) this.uniforms[d].uniformLocation = a.getUniformLocation(c, d);
        this.initUniforms(), this.program = c;
    }, b.PixiShader.prototype.initUniforms = function() {
        this.textureCount = 1;
        var a, b = this.gl;
        for (var c in this.uniforms) {
            a = this.uniforms[c];
            var d = a.type;
            "sampler2D" === d ? (a._init = !1, null !== a.value && this.initSampler2D(a)) : "mat2" === d || "mat3" === d || "mat4" === d ? (a.glMatrix = !0, 
            a.glValueLength = 1, "mat2" === d ? a.glFunc = b.uniformMatrix2fv : "mat3" === d ? a.glFunc = b.uniformMatrix3fv : "mat4" === d && (a.glFunc = b.uniformMatrix4fv)) : (a.glFunc = b["uniform" + d], 
            a.glValueLength = "2f" === d || "2i" === d ? 2 : "3f" === d || "3i" === d ? 3 : "4f" === d || "4i" === d ? 4 : 1);
        }
    }, b.PixiShader.prototype.initSampler2D = function(a) {
        if (a.value && a.value.baseTexture && a.value.baseTexture.hasLoaded) {
            var b = this.gl;
            if (b.activeTexture(b["TEXTURE" + this.textureCount]), b.bindTexture(b.TEXTURE_2D, a.value.baseTexture._glTextures[b.id]), 
            a.textureData) {
                var c = a.textureData, d = c.magFilter ? c.magFilter : b.LINEAR, e = c.minFilter ? c.minFilter : b.LINEAR, f = c.wrapS ? c.wrapS : b.CLAMP_TO_EDGE, g = c.wrapT ? c.wrapT : b.CLAMP_TO_EDGE, h = c.luminance ? b.LUMINANCE : b.RGBA;
                if (c.repeat && (f = b.REPEAT, g = b.REPEAT), b.pixelStorei(b.UNPACK_FLIP_Y_WEBGL, !!c.flipY), 
                c.width) {
                    var i = c.width ? c.width : 512, j = c.height ? c.height : 2, k = c.border ? c.border : 0;
                    b.texImage2D(b.TEXTURE_2D, 0, h, i, j, k, h, b.UNSIGNED_BYTE, null);
                } else b.texImage2D(b.TEXTURE_2D, 0, h, b.RGBA, b.UNSIGNED_BYTE, a.value.baseTexture.source);
                b.texParameteri(b.TEXTURE_2D, b.TEXTURE_MAG_FILTER, d), b.texParameteri(b.TEXTURE_2D, b.TEXTURE_MIN_FILTER, e), 
                b.texParameteri(b.TEXTURE_2D, b.TEXTURE_WRAP_S, f), b.texParameteri(b.TEXTURE_2D, b.TEXTURE_WRAP_T, g);
            }
            b.uniform1i(a.uniformLocation, this.textureCount), a._init = !0, this.textureCount++;
        }
    }, b.PixiShader.prototype.syncUniforms = function() {
        this.textureCount = 1;
        var a, c = this.gl;
        for (var d in this.uniforms) a = this.uniforms[d], 1 === a.glValueLength ? a.glMatrix === !0 ? a.glFunc.call(c, a.uniformLocation, a.transpose, a.value) : a.glFunc.call(c, a.uniformLocation, a.value) : 2 === a.glValueLength ? a.glFunc.call(c, a.uniformLocation, a.value.x, a.value.y) : 3 === a.glValueLength ? a.glFunc.call(c, a.uniformLocation, a.value.x, a.value.y, a.value.z) : 4 === a.glValueLength ? a.glFunc.call(c, a.uniformLocation, a.value.x, a.value.y, a.value.z, a.value.w) : "sampler2D" === a.type && (a._init ? (c.activeTexture(c["TEXTURE" + this.textureCount]), 
        c.bindTexture(c.TEXTURE_2D, a.value.baseTexture._glTextures[c.id] || b.createWebGLTexture(a.value.baseTexture, c)), 
        c.uniform1i(a.uniformLocation, this.textureCount), this.textureCount++) : this.initSampler2D(a));
    }, b.PixiShader.prototype.destroy = function() {
        this.gl.deleteProgram(this.program), this.uniforms = null, this.gl = null, this.attributes = null;
    }, b.PixiShader.defaultVertexSrc = [ "attribute vec2 aVertexPosition;", "attribute vec2 aTextureCoord;", "attribute vec2 aColor;", "uniform vec2 projectionVector;", "uniform vec2 offsetVector;", "varying vec2 vTextureCoord;", "varying vec4 vColor;", "const vec2 center = vec2(-1.0, 1.0);", "void main(void) {", "   gl_Position = vec4( ((aVertexPosition + offsetVector) / projectionVector) + center , 0.0, 1.0);", "   vTextureCoord = aTextureCoord;", "   vec3 color = mod(vec3(aColor.y/65536.0, aColor.y/256.0, aColor.y), 256.0) / 256.0;", "   vColor = vec4(color * aColor.x, aColor.x);", "}" ], 
    b.PixiFastShader = function(a) {
        this._UID = b._UID++, this.gl = a, this.program = null, this.fragmentSrc = [ "precision lowp float;", "varying vec2 vTextureCoord;", "varying float vColor;", "uniform sampler2D uSampler;", "void main(void) {", "   gl_FragColor = texture2D(uSampler, vTextureCoord) * vColor ;", "}" ], 
        this.vertexSrc = [ "attribute vec2 aVertexPosition;", "attribute vec2 aPositionCoord;", "attribute vec2 aScale;", "attribute float aRotation;", "attribute vec2 aTextureCoord;", "attribute float aColor;", "uniform vec2 projectionVector;", "uniform vec2 offsetVector;", "uniform mat3 uMatrix;", "varying vec2 vTextureCoord;", "varying float vColor;", "const vec2 center = vec2(-1.0, 1.0);", "void main(void) {", "   vec2 v;", "   vec2 sv = aVertexPosition * aScale;", "   v.x = (sv.x) * cos(aRotation) - (sv.y) * sin(aRotation);", "   v.y = (sv.x) * sin(aRotation) + (sv.y) * cos(aRotation);", "   v = ( uMatrix * vec3(v + aPositionCoord , 1.0) ).xy ;", "   gl_Position = vec4( ( v / projectionVector) + center , 0.0, 1.0);", "   vTextureCoord = aTextureCoord;", "   vColor = aColor;", "}" ], 
        this.textureCount = 0, this.init();
    }, b.PixiFastShader.prototype.init = function() {
        var a = this.gl, c = b.compileProgram(a, this.vertexSrc, this.fragmentSrc);
        a.useProgram(c), this.uSampler = a.getUniformLocation(c, "uSampler"), this.projectionVector = a.getUniformLocation(c, "projectionVector"), 
        this.offsetVector = a.getUniformLocation(c, "offsetVector"), this.dimensions = a.getUniformLocation(c, "dimensions"), 
        this.uMatrix = a.getUniformLocation(c, "uMatrix"), this.aVertexPosition = a.getAttribLocation(c, "aVertexPosition"), 
        this.aPositionCoord = a.getAttribLocation(c, "aPositionCoord"), this.aScale = a.getAttribLocation(c, "aScale"), 
        this.aRotation = a.getAttribLocation(c, "aRotation"), this.aTextureCoord = a.getAttribLocation(c, "aTextureCoord"), 
        this.colorAttribute = a.getAttribLocation(c, "aColor"), -1 === this.colorAttribute && (this.colorAttribute = 2), 
        this.attributes = [ this.aVertexPosition, this.aPositionCoord, this.aScale, this.aRotation, this.aTextureCoord, this.colorAttribute ], 
        this.program = c;
    }, b.PixiFastShader.prototype.destroy = function() {
        this.gl.deleteProgram(this.program), this.uniforms = null, this.gl = null, this.attributes = null;
    }, b.StripShader = function(a) {
        this._UID = b._UID++, this.gl = a, this.program = null, this.fragmentSrc = [ "precision mediump float;", "varying vec2 vTextureCoord;", "uniform float alpha;", "uniform sampler2D uSampler;", "void main(void) {", "   gl_FragColor = texture2D(uSampler, vec2(vTextureCoord.x, vTextureCoord.y));", "}" ], 
        this.vertexSrc = [ "attribute vec2 aVertexPosition;", "attribute vec2 aTextureCoord;", "uniform mat3 translationMatrix;", "uniform vec2 projectionVector;", "uniform vec2 offsetVector;", "varying vec2 vTextureCoord;", "void main(void) {", "   vec3 v = translationMatrix * vec3(aVertexPosition , 1.0);", "   v -= offsetVector.xyx;", "   gl_Position = vec4( v.x / projectionVector.x -1.0, v.y / -projectionVector.y + 1.0 , 0.0, 1.0);", "   vTextureCoord = aTextureCoord;", "}" ], 
        this.init();
    }, b.StripShader.prototype.init = function() {
        var a = this.gl, c = b.compileProgram(a, this.vertexSrc, this.fragmentSrc);
        a.useProgram(c), this.uSampler = a.getUniformLocation(c, "uSampler"), this.projectionVector = a.getUniformLocation(c, "projectionVector"), 
        this.offsetVector = a.getUniformLocation(c, "offsetVector"), this.colorAttribute = a.getAttribLocation(c, "aColor"), 
        this.aVertexPosition = a.getAttribLocation(c, "aVertexPosition"), this.aTextureCoord = a.getAttribLocation(c, "aTextureCoord"), 
        this.attributes = [ this.aVertexPosition, this.aTextureCoord ], this.translationMatrix = a.getUniformLocation(c, "translationMatrix"), 
        this.alpha = a.getUniformLocation(c, "alpha"), this.program = c;
    }, b.PrimitiveShader = function(a) {
        this._UID = b._UID++, this.gl = a, this.program = null, this.fragmentSrc = [ "precision mediump float;", "varying vec4 vColor;", "void main(void) {", "   gl_FragColor = vColor;", "}" ], 
        this.vertexSrc = [ "attribute vec2 aVertexPosition;", "attribute vec4 aColor;", "uniform mat3 translationMatrix;", "uniform vec2 projectionVector;", "uniform vec2 offsetVector;", "uniform float alpha;", "uniform vec3 tint;", "varying vec4 vColor;", "void main(void) {", "   vec3 v = translationMatrix * vec3(aVertexPosition , 1.0);", "   v -= offsetVector.xyx;", "   gl_Position = vec4( v.x / projectionVector.x -1.0, v.y / -projectionVector.y + 1.0 , 0.0, 1.0);", "   vColor = aColor * vec4(tint * alpha, alpha);", "}" ], 
        this.init();
    }, b.PrimitiveShader.prototype.init = function() {
        var a = this.gl, c = b.compileProgram(a, this.vertexSrc, this.fragmentSrc);
        a.useProgram(c), this.projectionVector = a.getUniformLocation(c, "projectionVector"), 
        this.offsetVector = a.getUniformLocation(c, "offsetVector"), this.tintColor = a.getUniformLocation(c, "tint"), 
        this.aVertexPosition = a.getAttribLocation(c, "aVertexPosition"), this.colorAttribute = a.getAttribLocation(c, "aColor"), 
        this.attributes = [ this.aVertexPosition, this.colorAttribute ], this.translationMatrix = a.getUniformLocation(c, "translationMatrix"), 
        this.alpha = a.getUniformLocation(c, "alpha"), this.program = c;
    }, b.PrimitiveShader.prototype.destroy = function() {
        this.gl.deleteProgram(this.program), this.uniforms = null, this.gl = null, this.attribute = null;
    }, b.ComplexPrimitiveShader = function(a) {
        this._UID = b._UID++, this.gl = a, this.program = null, this.fragmentSrc = [ "precision mediump float;", "varying vec4 vColor;", "void main(void) {", "   gl_FragColor = vColor;", "}" ], 
        this.vertexSrc = [ "attribute vec2 aVertexPosition;", "uniform mat3 translationMatrix;", "uniform vec2 projectionVector;", "uniform vec2 offsetVector;", "uniform vec3 tint;", "uniform float alpha;", "uniform vec3 color;", "varying vec4 vColor;", "void main(void) {", "   vec3 v = translationMatrix * vec3(aVertexPosition , 1.0);", "   v -= offsetVector.xyx;", "   gl_Position = vec4( v.x / projectionVector.x -1.0, v.y / -projectionVector.y + 1.0 , 0.0, 1.0);", "   vColor = vec4(color * alpha * tint, alpha);", "}" ], 
        this.init();
    }, b.ComplexPrimitiveShader.prototype.init = function() {
        var a = this.gl, c = b.compileProgram(a, this.vertexSrc, this.fragmentSrc);
        a.useProgram(c), this.projectionVector = a.getUniformLocation(c, "projectionVector"), 
        this.offsetVector = a.getUniformLocation(c, "offsetVector"), this.tintColor = a.getUniformLocation(c, "tint"), 
        this.color = a.getUniformLocation(c, "color"), this.aVertexPosition = a.getAttribLocation(c, "aVertexPosition"), 
        this.attributes = [ this.aVertexPosition, this.colorAttribute ], this.translationMatrix = a.getUniformLocation(c, "translationMatrix"), 
        this.alpha = a.getUniformLocation(c, "alpha"), this.program = c;
    }, b.ComplexPrimitiveShader.prototype.destroy = function() {
        this.gl.deleteProgram(this.program), this.uniforms = null, this.gl = null, this.attribute = null;
    }, b.WebGLGraphics = function() {}, b.WebGLGraphics.renderGraphics = function(a, c) {
        var d, e = c.gl, f = c.projection, g = c.offset, h = c.shaderManager.primitiveShader;
        a.dirty && b.WebGLGraphics.updateGraphics(a, e);
        for (var i = a._webGL[e.id], j = 0; j < i.data.length; j++) 1 === i.data[j].mode ? (d = i.data[j], 
        c.stencilManager.pushStencil(a, d, c), e.drawElements(e.TRIANGLE_FAN, 4, e.UNSIGNED_SHORT, 2 * (d.indices.length - 4)), 
        c.stencilManager.popStencil(a, d, c), this.last = d.mode) : (d = i.data[j], c.shaderManager.setShader(h), 
        h = c.shaderManager.primitiveShader, e.uniformMatrix3fv(h.translationMatrix, !1, a.worldTransform.toArray(!0)), 
        e.uniform2f(h.projectionVector, f.x, -f.y), e.uniform2f(h.offsetVector, -g.x, -g.y), 
        e.uniform3fv(h.tintColor, b.hex2rgb(a.tint)), e.uniform1f(h.alpha, a.worldAlpha), 
        e.bindBuffer(e.ARRAY_BUFFER, d.buffer), e.vertexAttribPointer(h.aVertexPosition, 2, e.FLOAT, !1, 24, 0), 
        e.vertexAttribPointer(h.colorAttribute, 4, e.FLOAT, !1, 24, 8), e.bindBuffer(e.ELEMENT_ARRAY_BUFFER, d.indexBuffer), 
        e.drawElements(e.TRIANGLE_STRIP, d.indices.length, e.UNSIGNED_SHORT, 0));
    }, b.WebGLGraphics.updateGraphics = function(a, c) {
        var d = a._webGL[c.id];
        d || (d = a._webGL[c.id] = {
            lastIndex: 0,
            data: [],
            gl: c
        }), a.dirty = !1;
        var e;
        if (a.clearDirty) {
            for (a.clearDirty = !1, e = 0; e < d.data.length; e++) {
                var f = d.data[e];
                f.reset(), b.WebGLGraphics.graphicsDataPool.push(f);
            }
            d.data = [], d.lastIndex = 0;
        }
        var g;
        for (e = d.lastIndex; e < a.graphicsData.length; e++) {
            var h = a.graphicsData[e];
            h.type === b.Graphics.POLY ? (h.fill && h.points.length > 6 && (h.points.length > 10 ? (g = b.WebGLGraphics.switchMode(d, 1), 
            b.WebGLGraphics.buildComplexPoly(h, g)) : (g = b.WebGLGraphics.switchMode(d, 0), 
            b.WebGLGraphics.buildPoly(h, g))), h.lineWidth > 0 && (g = b.WebGLGraphics.switchMode(d, 0), 
            b.WebGLGraphics.buildLine(h, g))) : (g = b.WebGLGraphics.switchMode(d, 0), h.type === b.Graphics.RECT ? b.WebGLGraphics.buildRectangle(h, g) : h.type === b.Graphics.CIRC || h.type === b.Graphics.ELIP ? b.WebGLGraphics.buildCircle(h, g) : h.type === b.Graphics.RREC && b.WebGLGraphics.buildRoundedRectangle(h, g)), 
            d.lastIndex++;
        }
        for (e = 0; e < d.data.length; e++) g = d.data[e], g.dirty && g.upload();
    }, b.WebGLGraphics.switchMode = function(a, c) {
        var d;
        return a.data.length ? (d = a.data[a.data.length - 1], (d.mode !== c || 1 === c) && (d = b.WebGLGraphics.graphicsDataPool.pop() || new b.WebGLGraphicsData(a.gl), 
        d.mode = c, a.data.push(d))) : (d = b.WebGLGraphics.graphicsDataPool.pop() || new b.WebGLGraphicsData(a.gl), 
        d.mode = c, a.data.push(d)), d.dirty = !0, d;
    }, b.WebGLGraphics.buildRectangle = function(a, c) {
        var d = a.points, e = d[0], f = d[1], g = d[2], h = d[3];
        if (a.fill) {
            var i = b.hex2rgb(a.fillColor), j = a.fillAlpha, k = i[0] * j, l = i[1] * j, m = i[2] * j, n = c.points, o = c.indices, p = n.length / 6;
            n.push(e, f), n.push(k, l, m, j), n.push(e + g, f), n.push(k, l, m, j), n.push(e, f + h), 
            n.push(k, l, m, j), n.push(e + g, f + h), n.push(k, l, m, j), o.push(p, p, p + 1, p + 2, p + 3, p + 3);
        }
        if (a.lineWidth) {
            var q = a.points;
            a.points = [ e, f, e + g, f, e + g, f + h, e, f + h, e, f ], b.WebGLGraphics.buildLine(a, c), 
            a.points = q;
        }
    }, b.WebGLGraphics.buildRoundedRectangle = function(a, c) {
        var d = a.points, e = d[0], f = d[1], g = d[2], h = d[3], i = d[4], j = [];
        if (j.push(e, f + i), j = j.concat(b.WebGLGraphics.quadraticBezierCurve(e, f + h - i, e, f + h, e + i, f + h)), 
        j = j.concat(b.WebGLGraphics.quadraticBezierCurve(e + g - i, f + h, e + g, f + h, e + g, f + h - i)), 
        j = j.concat(b.WebGLGraphics.quadraticBezierCurve(e + g, f + i, e + g, f, e + g - i, f)), 
        j = j.concat(b.WebGLGraphics.quadraticBezierCurve(e + i, f, e, f, e, f + i)), a.fill) {
            var k = b.hex2rgb(a.fillColor), l = a.fillAlpha, m = k[0] * l, n = k[1] * l, o = k[2] * l, p = c.points, q = c.indices, r = p.length / 6, s = b.PolyK.Triangulate(j), t = 0;
            for (t = 0; t < s.length; t += 3) q.push(s[t] + r), q.push(s[t] + r), q.push(s[t + 1] + r), 
            q.push(s[t + 2] + r), q.push(s[t + 2] + r);
            for (t = 0; t < j.length; t++) p.push(j[t], j[++t], m, n, o, l);
        }
        if (a.lineWidth) {
            var u = a.points;
            a.points = j, b.WebGLGraphics.buildLine(a, c), a.points = u;
        }
    }, b.WebGLGraphics.quadraticBezierCurve = function(a, b, c, d, e, f) {
        function g(a, b, c) {
            var d = b - a;
            return a + d * c;
        }
        for (var h, i, j, k, l, m, n = 20, o = [], p = 0, q = 0; n >= q; q++) p = q / n, 
        h = g(a, c, p), i = g(b, d, p), j = g(c, e, p), k = g(d, f, p), l = g(h, j, p), 
        m = g(i, k, p), o.push(l, m);
        return o;
    }, b.WebGLGraphics.buildCircle = function(a, c) {
        var d = a.points, e = d[0], f = d[1], g = d[2], h = d[3], i = 40, j = 2 * Math.PI / i, k = 0;
        if (a.fill) {
            var l = b.hex2rgb(a.fillColor), m = a.fillAlpha, n = l[0] * m, o = l[1] * m, p = l[2] * m, q = c.points, r = c.indices, s = q.length / 6;
            for (r.push(s), k = 0; i + 1 > k; k++) q.push(e, f, n, o, p, m), q.push(e + Math.sin(j * k) * g, f + Math.cos(j * k) * h, n, o, p, m), 
            r.push(s++, s++);
            r.push(s - 1);
        }
        if (a.lineWidth) {
            var t = a.points;
            for (a.points = [], k = 0; i + 1 > k; k++) a.points.push(e + Math.sin(j * k) * g, f + Math.cos(j * k) * h);
            b.WebGLGraphics.buildLine(a, c), a.points = t;
        }
    }, b.WebGLGraphics.buildLine = function(a, c) {
        var d = 0, e = a.points;
        if (0 !== e.length) {
            if (a.lineWidth % 2) for (d = 0; d < e.length; d++) e[d] += .5;
            var f = new b.Point(e[0], e[1]), g = new b.Point(e[e.length - 2], e[e.length - 1]);
            if (f.x === g.x && f.y === g.y) {
                e = e.slice(), e.pop(), e.pop(), g = new b.Point(e[e.length - 2], e[e.length - 1]);
                var h = g.x + .5 * (f.x - g.x), i = g.y + .5 * (f.y - g.y);
                e.unshift(h, i), e.push(h, i);
            }
            var j, k, l, m, n, o, p, q, r, s, t, u, v, w, x, y, z, A, B, C, D, E, F, G = c.points, H = c.indices, I = e.length / 2, J = e.length, K = G.length / 6, L = a.lineWidth / 2, M = b.hex2rgb(a.lineColor), N = a.lineAlpha, O = M[0] * N, P = M[1] * N, Q = M[2] * N;
            for (l = e[0], m = e[1], n = e[2], o = e[3], r = -(m - o), s = l - n, F = Math.sqrt(r * r + s * s), 
            r /= F, s /= F, r *= L, s *= L, G.push(l - r, m - s, O, P, Q, N), G.push(l + r, m + s, O, P, Q, N), 
            d = 1; I - 1 > d; d++) l = e[2 * (d - 1)], m = e[2 * (d - 1) + 1], n = e[2 * d], 
            o = e[2 * d + 1], p = e[2 * (d + 1)], q = e[2 * (d + 1) + 1], r = -(m - o), s = l - n, 
            F = Math.sqrt(r * r + s * s), r /= F, s /= F, r *= L, s *= L, t = -(o - q), u = n - p, 
            F = Math.sqrt(t * t + u * u), t /= F, u /= F, t *= L, u *= L, x = -s + m - (-s + o), 
            y = -r + n - (-r + l), z = (-r + l) * (-s + o) - (-r + n) * (-s + m), A = -u + q - (-u + o), 
            B = -t + n - (-t + p), C = (-t + p) * (-u + o) - (-t + n) * (-u + q), D = x * B - A * y, 
            Math.abs(D) < .1 ? (D += 10.1, G.push(n - r, o - s, O, P, Q, N), G.push(n + r, o + s, O, P, Q, N)) : (j = (y * C - B * z) / D, 
            k = (A * z - x * C) / D, E = (j - n) * (j - n) + (k - o) + (k - o), E > 19600 ? (v = r - t, 
            w = s - u, F = Math.sqrt(v * v + w * w), v /= F, w /= F, v *= L, w *= L, G.push(n - v, o - w), 
            G.push(O, P, Q, N), G.push(n + v, o + w), G.push(O, P, Q, N), G.push(n - v, o - w), 
            G.push(O, P, Q, N), J++) : (G.push(j, k), G.push(O, P, Q, N), G.push(n - (j - n), o - (k - o)), 
            G.push(O, P, Q, N)));
            for (l = e[2 * (I - 2)], m = e[2 * (I - 2) + 1], n = e[2 * (I - 1)], o = e[2 * (I - 1) + 1], 
            r = -(m - o), s = l - n, F = Math.sqrt(r * r + s * s), r /= F, s /= F, r *= L, s *= L, 
            G.push(n - r, o - s), G.push(O, P, Q, N), G.push(n + r, o + s), G.push(O, P, Q, N), 
            H.push(K), d = 0; J > d; d++) H.push(K++);
            H.push(K - 1);
        }
    }, b.WebGLGraphics.buildComplexPoly = function(a, c) {
        var d = a.points.slice();
        if (!(d.length < 6)) {
            var e = c.indices;
            c.points = d, c.alpha = a.fillAlpha, c.color = b.hex2rgb(a.fillColor);
            for (var f, g, h = 1 / 0, i = -1 / 0, j = 1 / 0, k = -1 / 0, l = 0; l < d.length; l += 2) f = d[l], 
            g = d[l + 1], h = h > f ? f : h, i = f > i ? f : i, j = j > g ? g : j, k = g > k ? g : k;
            d.push(h, j, i, j, i, k, h, k);
            var m = d.length / 2;
            for (l = 0; m > l; l++) e.push(l);
        }
    }, b.WebGLGraphics.buildPoly = function(a, c) {
        var d = a.points;
        if (!(d.length < 6)) {
            var e = c.points, f = c.indices, g = d.length / 2, h = b.hex2rgb(a.fillColor), i = a.fillAlpha, j = h[0] * i, k = h[1] * i, l = h[2] * i, m = b.PolyK.Triangulate(d), n = e.length / 6, o = 0;
            for (o = 0; o < m.length; o += 3) f.push(m[o] + n), f.push(m[o] + n), f.push(m[o + 1] + n), 
            f.push(m[o + 2] + n), f.push(m[o + 2] + n);
            for (o = 0; g > o; o++) e.push(d[2 * o], d[2 * o + 1], j, k, l, i);
        }
    }, b.WebGLGraphics.graphicsDataPool = [], b.WebGLGraphicsData = function(a) {
        this.gl = a, this.color = [ 0, 0, 0 ], this.points = [], this.indices = [], this.lastIndex = 0, 
        this.buffer = a.createBuffer(), this.indexBuffer = a.createBuffer(), this.mode = 1, 
        this.alpha = 1, this.dirty = !0;
    }, b.WebGLGraphicsData.prototype.reset = function() {
        this.points = [], this.indices = [], this.lastIndex = 0;
    }, b.WebGLGraphicsData.prototype.upload = function() {
        var a = this.gl;
        this.glPoints = new Float32Array(this.points), a.bindBuffer(a.ARRAY_BUFFER, this.buffer), 
        a.bufferData(a.ARRAY_BUFFER, this.glPoints, a.STATIC_DRAW), this.glIndicies = new Uint16Array(this.indices), 
        a.bindBuffer(a.ELEMENT_ARRAY_BUFFER, this.indexBuffer), a.bufferData(a.ELEMENT_ARRAY_BUFFER, this.glIndicies, a.STATIC_DRAW), 
        this.dirty = !1;
    }, b.glContexts = [], b.WebGLRenderer = function(a, c, d, e, f, g) {
        b.defaultRenderer || (b.sayHello("webGL"), b.defaultRenderer = this), this.type = b.WEBGL_RENDERER, 
        this.transparent = !!e, this.preserveDrawingBuffer = g, this.width = a || 800, this.height = c || 600, 
        this.view = d || document.createElement("canvas"), this.view.width = this.width, 
        this.view.height = this.height, this.contextLost = this.handleContextLost.bind(this), 
        this.contextRestoredLost = this.handleContextRestored.bind(this), this.view.addEventListener("webglcontextlost", this.contextLost, !1), 
        this.view.addEventListener("webglcontextrestored", this.contextRestoredLost, !1), 
        this.options = {
            alpha: this.transparent,
            antialias: !!f,
            premultipliedAlpha: !!e,
            stencil: !0,
            preserveDrawingBuffer: g
        };
        var h = null;
        if ([ "experimental-webgl", "webgl" ].forEach(function(a) {
            try {
                h = h || this.view.getContext(a, this.options);
            } catch (b) {}
        }, this), !h) throw new Error("This browser does not support webGL. Try using the canvas renderer" + this);
        this.gl = h, this.glContextId = h.id = b.WebGLRenderer.glContextId++, b.glContexts[this.glContextId] = h, 
        b.blendModesWebGL || (b.blendModesWebGL = [], b.blendModesWebGL[b.blendModes.NORMAL] = [ h.ONE, h.ONE_MINUS_SRC_ALPHA ], 
        b.blendModesWebGL[b.blendModes.ADD] = [ h.SRC_ALPHA, h.DST_ALPHA ], b.blendModesWebGL[b.blendModes.MULTIPLY] = [ h.DST_COLOR, h.ONE_MINUS_SRC_ALPHA ], 
        b.blendModesWebGL[b.blendModes.SCREEN] = [ h.SRC_ALPHA, h.ONE ], b.blendModesWebGL[b.blendModes.OVERLAY] = [ h.ONE, h.ONE_MINUS_SRC_ALPHA ], 
        b.blendModesWebGL[b.blendModes.DARKEN] = [ h.ONE, h.ONE_MINUS_SRC_ALPHA ], b.blendModesWebGL[b.blendModes.LIGHTEN] = [ h.ONE, h.ONE_MINUS_SRC_ALPHA ], 
        b.blendModesWebGL[b.blendModes.COLOR_DODGE] = [ h.ONE, h.ONE_MINUS_SRC_ALPHA ], 
        b.blendModesWebGL[b.blendModes.COLOR_BURN] = [ h.ONE, h.ONE_MINUS_SRC_ALPHA ], b.blendModesWebGL[b.blendModes.HARD_LIGHT] = [ h.ONE, h.ONE_MINUS_SRC_ALPHA ], 
        b.blendModesWebGL[b.blendModes.SOFT_LIGHT] = [ h.ONE, h.ONE_MINUS_SRC_ALPHA ], b.blendModesWebGL[b.blendModes.DIFFERENCE] = [ h.ONE, h.ONE_MINUS_SRC_ALPHA ], 
        b.blendModesWebGL[b.blendModes.EXCLUSION] = [ h.ONE, h.ONE_MINUS_SRC_ALPHA ], b.blendModesWebGL[b.blendModes.HUE] = [ h.ONE, h.ONE_MINUS_SRC_ALPHA ], 
        b.blendModesWebGL[b.blendModes.SATURATION] = [ h.ONE, h.ONE_MINUS_SRC_ALPHA ], b.blendModesWebGL[b.blendModes.COLOR] = [ h.ONE, h.ONE_MINUS_SRC_ALPHA ], 
        b.blendModesWebGL[b.blendModes.LUMINOSITY] = [ h.ONE, h.ONE_MINUS_SRC_ALPHA ]), 
        this.projection = new b.Point(), this.projection.x = this.width / 2, this.projection.y = -this.height / 2, 
        this.offset = new b.Point(0, 0), this.resize(this.width, this.height), this.contextLost = !1, 
        this.shaderManager = new b.WebGLShaderManager(h), this.spriteBatch = new b.WebGLSpriteBatch(h), 
        this.maskManager = new b.WebGLMaskManager(h), this.filterManager = new b.WebGLFilterManager(h, this.transparent), 
        this.stencilManager = new b.WebGLStencilManager(h), this.blendModeManager = new b.WebGLBlendModeManager(h), 
        this.renderSession = {}, this.renderSession.gl = this.gl, this.renderSession.drawCount = 0, 
        this.renderSession.shaderManager = this.shaderManager, this.renderSession.maskManager = this.maskManager, 
        this.renderSession.filterManager = this.filterManager, this.renderSession.blendModeManager = this.blendModeManager, 
        this.renderSession.spriteBatch = this.spriteBatch, this.renderSession.stencilManager = this.stencilManager, 
        this.renderSession.renderer = this, h.useProgram(this.shaderManager.defaultShader.program), 
        h.disable(h.DEPTH_TEST), h.disable(h.CULL_FACE), h.enable(h.BLEND), h.colorMask(!0, !0, !0, this.transparent);
    }, b.WebGLRenderer.prototype.constructor = b.WebGLRenderer, b.WebGLRenderer.prototype.render = function(a) {
        if (!this.contextLost) {
            this.__stage !== a && (a.interactive && a.interactionManager.removeEvents(), this.__stage = a), 
            b.WebGLRenderer.updateTextures(), a.updateTransform(), a._interactive && (a._interactiveEventsAdded || (a._interactiveEventsAdded = !0, 
            a.interactionManager.setTarget(this)));
            var c = this.gl;
            c.viewport(0, 0, this.width, this.height), c.bindFramebuffer(c.FRAMEBUFFER, null), 
            this.transparent ? c.clearColor(0, 0, 0, 0) : c.clearColor(a.backgroundColorSplit[0], a.backgroundColorSplit[1], a.backgroundColorSplit[2], 1), 
            c.clear(c.COLOR_BUFFER_BIT), this.renderDisplayObject(a, this.projection), a.interactive ? a._interactiveEventsAdded || (a._interactiveEventsAdded = !0, 
            a.interactionManager.setTarget(this)) : a._interactiveEventsAdded && (a._interactiveEventsAdded = !1, 
            a.interactionManager.setTarget(this));
        }
    }, b.WebGLRenderer.prototype.renderDisplayObject = function(a, c, d) {
        this.renderSession.blendModeManager.setBlendMode(b.blendModes.NORMAL), this.renderSession.drawCount = 0, 
        this.renderSession.currentBlendMode = 9999, this.renderSession.projection = c, this.renderSession.offset = this.offset, 
        this.spriteBatch.begin(this.renderSession), this.filterManager.begin(this.renderSession, d), 
        a._renderWebGL(this.renderSession), this.spriteBatch.end();
    }, b.WebGLRenderer.updateTextures = function() {
        var a = 0;
        for (a = 0; a < b.Texture.frameUpdates.length; a++) b.WebGLRenderer.updateTextureFrame(b.Texture.frameUpdates[a]);
        for (a = 0; a < b.texturesToDestroy.length; a++) b.WebGLRenderer.destroyTexture(b.texturesToDestroy[a]);
        b.texturesToUpdate.length = 0, b.texturesToDestroy.length = 0, b.Texture.frameUpdates.length = 0;
    }, b.WebGLRenderer.destroyTexture = function(a) {
        for (var c = a._glTextures.length - 1; c >= 0; c--) {
            var d = a._glTextures[c], e = b.glContexts[c];
            e && d && e.deleteTexture(d);
        }
        a._glTextures.length = 0;
    }, b.WebGLRenderer.updateTextureFrame = function(a) {
        a._updateWebGLuvs();
    }, b.WebGLRenderer.prototype.resize = function(a, b) {
        this.width = a, this.height = b, this.view.width = a, this.view.height = b, this.gl.viewport(0, 0, this.width, this.height), 
        this.projection.x = this.width / 2, this.projection.y = -this.height / 2;
    }, b.createWebGLTexture = function(a, c) {
        return a.hasLoaded && (a._glTextures[c.id] = c.createTexture(), c.bindTexture(c.TEXTURE_2D, a._glTextures[c.id]), 
        c.pixelStorei(c.UNPACK_PREMULTIPLY_ALPHA_WEBGL, a.premultipliedAlpha), c.texImage2D(c.TEXTURE_2D, 0, c.RGBA, c.RGBA, c.UNSIGNED_BYTE, a.source), 
        c.texParameteri(c.TEXTURE_2D, c.TEXTURE_MAG_FILTER, a.scaleMode === b.scaleModes.LINEAR ? c.LINEAR : c.NEAREST), 
        c.texParameteri(c.TEXTURE_2D, c.TEXTURE_MIN_FILTER, a.scaleMode === b.scaleModes.LINEAR ? c.LINEAR : c.NEAREST), 
        a._powerOf2 ? (c.texParameteri(c.TEXTURE_2D, c.TEXTURE_WRAP_S, c.REPEAT), c.texParameteri(c.TEXTURE_2D, c.TEXTURE_WRAP_T, c.REPEAT)) : (c.texParameteri(c.TEXTURE_2D, c.TEXTURE_WRAP_S, c.CLAMP_TO_EDGE), 
        c.texParameteri(c.TEXTURE_2D, c.TEXTURE_WRAP_T, c.CLAMP_TO_EDGE)), c.bindTexture(c.TEXTURE_2D, null), 
        a._dirty[c.id] = !1), a._glTextures[c.id];
    }, b.updateWebGLTexture = function(a, c) {
        a._glTextures[c.id] && (c.bindTexture(c.TEXTURE_2D, a._glTextures[c.id]), c.pixelStorei(c.UNPACK_PREMULTIPLY_ALPHA_WEBGL, a.premultipliedAlpha), 
        c.texImage2D(c.TEXTURE_2D, 0, c.RGBA, c.RGBA, c.UNSIGNED_BYTE, a.source), c.texParameteri(c.TEXTURE_2D, c.TEXTURE_MAG_FILTER, a.scaleMode === b.scaleModes.LINEAR ? c.LINEAR : c.NEAREST), 
        c.texParameteri(c.TEXTURE_2D, c.TEXTURE_MIN_FILTER, a.scaleMode === b.scaleModes.LINEAR ? c.LINEAR : c.NEAREST), 
        a._powerOf2 ? (c.texParameteri(c.TEXTURE_2D, c.TEXTURE_WRAP_S, c.REPEAT), c.texParameteri(c.TEXTURE_2D, c.TEXTURE_WRAP_T, c.REPEAT)) : (c.texParameteri(c.TEXTURE_2D, c.TEXTURE_WRAP_S, c.CLAMP_TO_EDGE), 
        c.texParameteri(c.TEXTURE_2D, c.TEXTURE_WRAP_T, c.CLAMP_TO_EDGE)), a._dirty[c.id] = !1);
    }, b.WebGLRenderer.prototype.handleContextLost = function(a) {
        a.preventDefault(), this.contextLost = !0;
    }, b.WebGLRenderer.prototype.handleContextRestored = function() {
        try {
            this.gl = this.view.getContext("experimental-webgl", this.options);
        } catch (a) {
            try {
                this.gl = this.view.getContext("webgl", this.options);
            } catch (c) {
                throw new Error(" This browser does not support webGL. Try using the canvas renderer" + this);
            }
        }
        var d = this.gl;
        d.id = b.WebGLRenderer.glContextId++, this.shaderManager.setContext(d), this.spriteBatch.setContext(d), 
        this.primitiveBatch.setContext(d), this.maskManager.setContext(d), this.filterManager.setContext(d), 
        this.renderSession.gl = this.gl, d.disable(d.DEPTH_TEST), d.disable(d.CULL_FACE), 
        d.enable(d.BLEND), d.colorMask(!0, !0, !0, this.transparent), this.gl.viewport(0, 0, this.width, this.height);
        for (var e in b.TextureCache) {
            var f = b.TextureCache[e].baseTexture;
            f._glTextures = [];
        }
        this.contextLost = !1;
    }, b.WebGLRenderer.prototype.destroy = function() {
        this.view.removeEventListener("webglcontextlost", this.contextLost), this.view.removeEventListener("webglcontextrestored", this.contextRestoredLost), 
        b.glContexts[this.glContextId] = null, this.projection = null, this.offset = null, 
        this.shaderManager.destroy(), this.spriteBatch.destroy(), this.primitiveBatch.destroy(), 
        this.maskManager.destroy(), this.filterManager.destroy(), this.shaderManager = null, 
        this.spriteBatch = null, this.maskManager = null, this.filterManager = null, this.gl = null, 
        this.renderSession = null;
    }, b.WebGLRenderer.glContextId = 0, b.WebGLBlendModeManager = function(a) {
        this.gl = a, this.currentBlendMode = 99999;
    }, b.WebGLBlendModeManager.prototype.setBlendMode = function(a) {
        if (this.currentBlendMode === a) return !1;
        this.currentBlendMode = a;
        var c = b.blendModesWebGL[this.currentBlendMode];
        return this.gl.blendFunc(c[0], c[1]), !0;
    }, b.WebGLBlendModeManager.prototype.destroy = function() {
        this.gl = null;
    }, b.WebGLMaskManager = function(a) {
        this.maskStack = [], this.maskPosition = 0, this.setContext(a), this.reverse = !1, 
        this.count = 0;
    }, b.WebGLMaskManager.prototype.setContext = function(a) {
        this.gl = a;
    }, b.WebGLMaskManager.prototype.pushMask = function(a, c) {
        var d = c.gl;
        a.dirty && b.WebGLGraphics.updateGraphics(a, d), a._webGL[d.id].data.length && c.stencilManager.pushStencil(a, a._webGL[d.id].data[0], c);
    }, b.WebGLMaskManager.prototype.popMask = function(a, b) {
        var c = this.gl;
        b.stencilManager.popStencil(a, a._webGL[c.id].data[0], b);
    }, b.WebGLMaskManager.prototype.destroy = function() {
        this.maskStack = null, this.gl = null;
    }, b.WebGLStencilManager = function(a) {
        this.stencilStack = [], this.setContext(a), this.reverse = !0, this.count = 0;
    }, b.WebGLStencilManager.prototype.setContext = function(a) {
        this.gl = a;
    }, b.WebGLStencilManager.prototype.pushStencil = function(a, b, c) {
        var d = this.gl;
        this.bindGraphics(a, b, c), 0 === this.stencilStack.length && (d.enable(d.STENCIL_TEST), 
        d.clear(d.STENCIL_BUFFER_BIT), this.reverse = !0, this.count = 0), this.stencilStack.push(b);
        var e = this.count;
        d.colorMask(!1, !1, !1, !1), d.stencilFunc(d.ALWAYS, 0, 255), d.stencilOp(d.KEEP, d.KEEP, d.INVERT), 
        1 === b.mode ? (d.drawElements(d.TRIANGLE_FAN, b.indices.length - 4, d.UNSIGNED_SHORT, 0), 
        this.reverse ? (d.stencilFunc(d.EQUAL, 255 - e, 255), d.stencilOp(d.KEEP, d.KEEP, d.DECR)) : (d.stencilFunc(d.EQUAL, e, 255), 
        d.stencilOp(d.KEEP, d.KEEP, d.INCR)), d.drawElements(d.TRIANGLE_FAN, 4, d.UNSIGNED_SHORT, 2 * (b.indices.length - 4)), 
        this.reverse ? d.stencilFunc(d.EQUAL, 255 - (e + 1), 255) : d.stencilFunc(d.EQUAL, e + 1, 255), 
        this.reverse = !this.reverse) : (this.reverse ? (d.stencilFunc(d.EQUAL, e, 255), 
        d.stencilOp(d.KEEP, d.KEEP, d.INCR)) : (d.stencilFunc(d.EQUAL, 255 - e, 255), d.stencilOp(d.KEEP, d.KEEP, d.DECR)), 
        d.drawElements(d.TRIANGLE_STRIP, b.indices.length, d.UNSIGNED_SHORT, 0), this.reverse ? d.stencilFunc(d.EQUAL, e + 1, 255) : d.stencilFunc(d.EQUAL, 255 - (e + 1), 255)), 
        d.colorMask(!0, !0, !0, !0), d.stencilOp(d.KEEP, d.KEEP, d.KEEP), this.count++;
    }, b.WebGLStencilManager.prototype.bindGraphics = function(a, c, d) {
        this._currentGraphics = a;
        var e, f = this.gl, g = d.projection, h = d.offset;
        1 === c.mode ? (e = d.shaderManager.complexPrimativeShader, d.shaderManager.setShader(e), 
        f.uniformMatrix3fv(e.translationMatrix, !1, a.worldTransform.toArray(!0)), f.uniform2f(e.projectionVector, g.x, -g.y), 
        f.uniform2f(e.offsetVector, -h.x, -h.y), f.uniform3fv(e.tintColor, b.hex2rgb(a.tint)), 
        f.uniform3fv(e.color, c.color), f.uniform1f(e.alpha, a.worldAlpha * c.alpha), f.bindBuffer(f.ARRAY_BUFFER, c.buffer), 
        f.vertexAttribPointer(e.aVertexPosition, 2, f.FLOAT, !1, 8, 0), f.bindBuffer(f.ELEMENT_ARRAY_BUFFER, c.indexBuffer)) : (e = d.shaderManager.primitiveShader, 
        d.shaderManager.setShader(e), f.uniformMatrix3fv(e.translationMatrix, !1, a.worldTransform.toArray(!0)), 
        f.uniform2f(e.projectionVector, g.x, -g.y), f.uniform2f(e.offsetVector, -h.x, -h.y), 
        f.uniform3fv(e.tintColor, b.hex2rgb(a.tint)), f.uniform1f(e.alpha, a.worldAlpha), 
        f.bindBuffer(f.ARRAY_BUFFER, c.buffer), f.vertexAttribPointer(e.aVertexPosition, 2, f.FLOAT, !1, 24, 0), 
        f.vertexAttribPointer(e.colorAttribute, 4, f.FLOAT, !1, 24, 8), f.bindBuffer(f.ELEMENT_ARRAY_BUFFER, c.indexBuffer));
    }, b.WebGLStencilManager.prototype.popStencil = function(a, b, c) {
        var d = this.gl;
        if (this.stencilStack.pop(), this.count--, 0 === this.stencilStack.length) d.disable(d.STENCIL_TEST); else {
            var e = this.count;
            this.bindGraphics(a, b, c), d.colorMask(!1, !1, !1, !1), 1 === b.mode ? (this.reverse = !this.reverse, 
            this.reverse ? (d.stencilFunc(d.EQUAL, 255 - (e + 1), 255), d.stencilOp(d.KEEP, d.KEEP, d.INCR)) : (d.stencilFunc(d.EQUAL, e + 1, 255), 
            d.stencilOp(d.KEEP, d.KEEP, d.DECR)), d.drawElements(d.TRIANGLE_FAN, 4, d.UNSIGNED_SHORT, 2 * (b.indices.length - 4)), 
            d.stencilFunc(d.ALWAYS, 0, 255), d.stencilOp(d.KEEP, d.KEEP, d.INVERT), d.drawElements(d.TRIANGLE_FAN, b.indices.length - 4, d.UNSIGNED_SHORT, 0), 
            this.reverse ? d.stencilFunc(d.EQUAL, e, 255) : d.stencilFunc(d.EQUAL, 255 - e, 255)) : (this.reverse ? (d.stencilFunc(d.EQUAL, e + 1, 255), 
            d.stencilOp(d.KEEP, d.KEEP, d.DECR)) : (d.stencilFunc(d.EQUAL, 255 - (e + 1), 255), 
            d.stencilOp(d.KEEP, d.KEEP, d.INCR)), d.drawElements(d.TRIANGLE_STRIP, b.indices.length, d.UNSIGNED_SHORT, 0), 
            this.reverse ? d.stencilFunc(d.EQUAL, e, 255) : d.stencilFunc(d.EQUAL, 255 - e, 255)), 
            d.colorMask(!0, !0, !0, !0), d.stencilOp(d.KEEP, d.KEEP, d.KEEP);
        }
    }, b.WebGLStencilManager.prototype.destroy = function() {
        this.maskStack = null, this.gl = null;
    }, b.WebGLShaderManager = function(a) {
        this.maxAttibs = 10, this.attribState = [], this.tempAttribState = [], this.shaderMap = [];
        for (var b = 0; b < this.maxAttibs; b++) this.attribState[b] = !1;
        this.setContext(a);
    }, b.WebGLShaderManager.prototype.setContext = function(a) {
        this.gl = a, this.primitiveShader = new b.PrimitiveShader(a), this.complexPrimativeShader = new b.ComplexPrimitiveShader(a), 
        this.defaultShader = new b.PixiShader(a), this.fastShader = new b.PixiFastShader(a), 
        this.stripShader = new b.StripShader(a), this.setShader(this.defaultShader);
    }, b.WebGLShaderManager.prototype.setAttribs = function(a) {
        var b;
        for (b = 0; b < this.tempAttribState.length; b++) this.tempAttribState[b] = !1;
        for (b = 0; b < a.length; b++) {
            var c = a[b];
            this.tempAttribState[c] = !0;
        }
        var d = this.gl;
        for (b = 0; b < this.attribState.length; b++) this.attribState[b] !== this.tempAttribState[b] && (this.attribState[b] = this.tempAttribState[b], 
        this.tempAttribState[b] ? d.enableVertexAttribArray(b) : d.disableVertexAttribArray(b));
    }, b.WebGLShaderManager.prototype.setShader = function(a) {
        return this._currentId === a._UID ? !1 : (this._currentId = a._UID, this.currentShader = a, 
        this.gl.useProgram(a.program), this.setAttribs(a.attributes), !0);
    }, b.WebGLShaderManager.prototype.destroy = function() {
        this.attribState = null, this.tempAttribState = null, this.primitiveShader.destroy(), 
        this.defaultShader.destroy(), this.fastShader.destroy(), this.stripShader.destroy(), 
        this.gl = null;
    }, b.WebGLSpriteBatch = function(a) {
        this.vertSize = 6, this.size = 2e3;
        var b = 4 * this.size * this.vertSize, c = 6 * this.size;
        this.vertices = new Float32Array(b), this.indices = new Uint16Array(c), this.lastIndexCount = 0;
        for (var d = 0, e = 0; c > d; d += 6, e += 4) this.indices[d + 0] = e + 0, this.indices[d + 1] = e + 1, 
        this.indices[d + 2] = e + 2, this.indices[d + 3] = e + 0, this.indices[d + 4] = e + 2, 
        this.indices[d + 5] = e + 3;
        this.drawing = !1, this.currentBatchSize = 0, this.currentBaseTexture = null, this.setContext(a), 
        this.dirty = !0, this.textures = [], this.blendModes = [];
    }, b.WebGLSpriteBatch.prototype.setContext = function(a) {
        this.gl = a, this.vertexBuffer = a.createBuffer(), this.indexBuffer = a.createBuffer(), 
        a.bindBuffer(a.ELEMENT_ARRAY_BUFFER, this.indexBuffer), a.bufferData(a.ELEMENT_ARRAY_BUFFER, this.indices, a.STATIC_DRAW), 
        a.bindBuffer(a.ARRAY_BUFFER, this.vertexBuffer), a.bufferData(a.ARRAY_BUFFER, this.vertices, a.DYNAMIC_DRAW), 
        this.currentBlendMode = 99999;
    }, b.WebGLSpriteBatch.prototype.begin = function(a) {
        this.renderSession = a, this.shader = this.renderSession.shaderManager.defaultShader, 
        this.start();
    }, b.WebGLSpriteBatch.prototype.end = function() {
        this.flush();
    }, b.WebGLSpriteBatch.prototype.render = function(a) {
        var b = a.texture;
        this.currentBatchSize >= this.size && (this.flush(), this.currentBaseTexture = b.baseTexture);
        var c = b._uvs;
        if (c) {
            var d, e, f, g, h = a.worldAlpha, i = a.tint, j = this.vertices, k = a.anchor.x, l = a.anchor.y;
            if (b.trim) {
                var m = b.trim;
                e = m.x - k * m.width, d = e + b.crop.width, g = m.y - l * m.height, f = g + b.crop.height;
            } else d = b.frame.width * (1 - k), e = b.frame.width * -k, f = b.frame.height * (1 - l), 
            g = b.frame.height * -l;
            var n = 4 * this.currentBatchSize * this.vertSize, o = a.worldTransform, p = o.a, q = o.c, r = o.b, s = o.d, t = o.tx, u = o.ty;
            j[n++] = p * e + r * g + t, j[n++] = s * g + q * e + u, j[n++] = c.x0, j[n++] = c.y0, 
            j[n++] = h, j[n++] = i, j[n++] = p * d + r * g + t, j[n++] = s * g + q * d + u, 
            j[n++] = c.x1, j[n++] = c.y1, j[n++] = h, j[n++] = i, j[n++] = p * d + r * f + t, 
            j[n++] = s * f + q * d + u, j[n++] = c.x2, j[n++] = c.y2, j[n++] = h, j[n++] = i, 
            j[n++] = p * e + r * f + t, j[n++] = s * f + q * e + u, j[n++] = c.x3, j[n++] = c.y3, 
            j[n++] = h, j[n++] = i, this.textures[this.currentBatchSize] = a.texture.baseTexture, 
            this.blendModes[this.currentBatchSize] = a.blendMode, this.currentBatchSize++;
        }
    }, b.WebGLSpriteBatch.prototype.renderTilingSprite = function(a) {
        var c = a.tilingTexture;
        this.currentBatchSize >= this.size && (this.flush(), this.currentBaseTexture = c.baseTexture), 
        a._uvs || (a._uvs = new b.TextureUvs());
        var d = a._uvs;
        a.tilePosition.x %= c.baseTexture.width * a.tileScaleOffset.x, a.tilePosition.y %= c.baseTexture.height * a.tileScaleOffset.y;
        var e = a.tilePosition.x / (c.baseTexture.width * a.tileScaleOffset.x), f = a.tilePosition.y / (c.baseTexture.height * a.tileScaleOffset.y), g = a.width / c.baseTexture.width / (a.tileScale.x * a.tileScaleOffset.x), h = a.height / c.baseTexture.height / (a.tileScale.y * a.tileScaleOffset.y);
        d.x0 = 0 - e, d.y0 = 0 - f, d.x1 = 1 * g - e, d.y1 = 0 - f, d.x2 = 1 * g - e, d.y2 = 1 * h - f, 
        d.x3 = 0 - e, d.y3 = 1 * h - f;
        var i = a.worldAlpha, j = a.tint, k = this.vertices, l = a.width, m = a.height, n = a.anchor.x, o = a.anchor.y, p = l * (1 - n), q = l * -n, r = m * (1 - o), s = m * -o, t = 4 * this.currentBatchSize * this.vertSize, u = a.worldTransform, v = u.a, w = u.c, x = u.b, y = u.d, z = u.tx, A = u.ty;
        k[t++] = v * q + x * s + z, k[t++] = y * s + w * q + A, k[t++] = d.x0, k[t++] = d.y0, 
        k[t++] = i, k[t++] = j, k[t++] = v * p + x * s + z, k[t++] = y * s + w * p + A, 
        k[t++] = d.x1, k[t++] = d.y1, k[t++] = i, k[t++] = j, k[t++] = v * p + x * r + z, 
        k[t++] = y * r + w * p + A, k[t++] = d.x2, k[t++] = d.y2, k[t++] = i, k[t++] = j, 
        k[t++] = v * q + x * r + z, k[t++] = y * r + w * q + A, k[t++] = d.x3, k[t++] = d.y3, 
        k[t++] = i, k[t++] = j, this.textures[this.currentBatchSize] = c.baseTexture, this.blendModes[this.currentBatchSize] = a.blendMode, 
        this.currentBatchSize++;
    }, b.WebGLSpriteBatch.prototype.flush = function() {
        if (0 !== this.currentBatchSize) {
            var a = this.gl;
            if (this.renderSession.shaderManager.setShader(this.renderSession.shaderManager.defaultShader), 
            this.dirty) {
                this.dirty = !1, a.activeTexture(a.TEXTURE0), a.bindBuffer(a.ARRAY_BUFFER, this.vertexBuffer), 
                a.bindBuffer(a.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
                var b = this.renderSession.projection;
                a.uniform2f(this.shader.projectionVector, b.x, b.y);
                var c = 4 * this.vertSize;
                a.vertexAttribPointer(this.shader.aVertexPosition, 2, a.FLOAT, !1, c, 0), a.vertexAttribPointer(this.shader.aTextureCoord, 2, a.FLOAT, !1, c, 8), 
                a.vertexAttribPointer(this.shader.colorAttribute, 2, a.FLOAT, !1, c, 16);
            }
            if (this.currentBatchSize > .5 * this.size) a.bufferSubData(a.ARRAY_BUFFER, 0, this.vertices); else {
                var d = this.vertices.subarray(0, 4 * this.currentBatchSize * this.vertSize);
                a.bufferSubData(a.ARRAY_BUFFER, 0, d);
            }
            for (var e, f, g = 0, h = 0, i = null, j = this.renderSession.blendModeManager.currentBlendMode, k = 0, l = this.currentBatchSize; l > k; k++) e = this.textures[k], 
            f = this.blendModes[k], (i !== e || j !== f) && (this.renderBatch(i, g, h), h = k, 
            g = 0, i = e, j = f, this.renderSession.blendModeManager.setBlendMode(j)), g++;
            this.renderBatch(i, g, h), this.currentBatchSize = 0;
        }
    }, b.WebGLSpriteBatch.prototype.renderBatch = function(a, c, d) {
        if (0 !== c) {
            var e = this.gl;
            e.bindTexture(e.TEXTURE_2D, a._glTextures[e.id] || b.createWebGLTexture(a, e)), 
            a._dirty[e.id] && b.updateWebGLTexture(this.currentBaseTexture, e), e.drawElements(e.TRIANGLES, 6 * c, e.UNSIGNED_SHORT, 6 * d * 2), 
            this.renderSession.drawCount++;
        }
    }, b.WebGLSpriteBatch.prototype.stop = function() {
        this.flush();
    }, b.WebGLSpriteBatch.prototype.start = function() {
        this.dirty = !0;
    }, b.WebGLSpriteBatch.prototype.destroy = function() {
        this.vertices = null, this.indices = null, this.gl.deleteBuffer(this.vertexBuffer), 
        this.gl.deleteBuffer(this.indexBuffer), this.currentBaseTexture = null, this.gl = null;
    }, b.WebGLFastSpriteBatch = function(a) {
        this.vertSize = 10, this.maxSize = 6e3, this.size = this.maxSize;
        var b = 4 * this.size * this.vertSize, c = 6 * this.maxSize;
        this.vertices = new Float32Array(b), this.indices = new Uint16Array(c), this.vertexBuffer = null, 
        this.indexBuffer = null, this.lastIndexCount = 0;
        for (var d = 0, e = 0; c > d; d += 6, e += 4) this.indices[d + 0] = e + 0, this.indices[d + 1] = e + 1, 
        this.indices[d + 2] = e + 2, this.indices[d + 3] = e + 0, this.indices[d + 4] = e + 2, 
        this.indices[d + 5] = e + 3;
        this.drawing = !1, this.currentBatchSize = 0, this.currentBaseTexture = null, this.currentBlendMode = 0, 
        this.renderSession = null, this.shader = null, this.matrix = null, this.setContext(a);
    }, b.WebGLFastSpriteBatch.prototype.setContext = function(a) {
        this.gl = a, this.vertexBuffer = a.createBuffer(), this.indexBuffer = a.createBuffer(), 
        a.bindBuffer(a.ELEMENT_ARRAY_BUFFER, this.indexBuffer), a.bufferData(a.ELEMENT_ARRAY_BUFFER, this.indices, a.STATIC_DRAW), 
        a.bindBuffer(a.ARRAY_BUFFER, this.vertexBuffer), a.bufferData(a.ARRAY_BUFFER, this.vertices, a.DYNAMIC_DRAW);
    }, b.WebGLFastSpriteBatch.prototype.begin = function(a, b) {
        this.renderSession = b, this.shader = this.renderSession.shaderManager.fastShader, 
        this.matrix = a.worldTransform.toArray(!0), this.start();
    }, b.WebGLFastSpriteBatch.prototype.end = function() {
        this.flush();
    }, b.WebGLFastSpriteBatch.prototype.render = function(a) {
        var b = a.children, c = b[0];
        if (c.texture._uvs) {
            this.currentBaseTexture = c.texture.baseTexture, c.blendMode !== this.renderSession.blendModeManager.currentBlendMode && (this.flush(), 
            this.renderSession.blendModeManager.setBlendMode(c.blendMode));
            for (var d = 0, e = b.length; e > d; d++) this.renderSprite(b[d]);
            this.flush();
        }
    }, b.WebGLFastSpriteBatch.prototype.renderSprite = function(a) {
        if (a.visible && (a.texture.baseTexture === this.currentBaseTexture || (this.flush(), 
        this.currentBaseTexture = a.texture.baseTexture, a.texture._uvs))) {
            var b, c, d, e, f, g, h, i, j = this.vertices;
            if (b = a.texture._uvs, c = a.texture.frame.width, d = a.texture.frame.height, a.texture.trim) {
                var k = a.texture.trim;
                f = k.x - a.anchor.x * k.width, e = f + a.texture.crop.width, h = k.y - a.anchor.y * k.height, 
                g = h + a.texture.crop.height;
            } else e = a.texture.frame.width * (1 - a.anchor.x), f = a.texture.frame.width * -a.anchor.x, 
            g = a.texture.frame.height * (1 - a.anchor.y), h = a.texture.frame.height * -a.anchor.y;
            i = 4 * this.currentBatchSize * this.vertSize, j[i++] = f, j[i++] = h, j[i++] = a.position.x, 
            j[i++] = a.position.y, j[i++] = a.scale.x, j[i++] = a.scale.y, j[i++] = a.rotation, 
            j[i++] = b.x0, j[i++] = b.y1, j[i++] = a.alpha, j[i++] = e, j[i++] = h, j[i++] = a.position.x, 
            j[i++] = a.position.y, j[i++] = a.scale.x, j[i++] = a.scale.y, j[i++] = a.rotation, 
            j[i++] = b.x1, j[i++] = b.y1, j[i++] = a.alpha, j[i++] = e, j[i++] = g, j[i++] = a.position.x, 
            j[i++] = a.position.y, j[i++] = a.scale.x, j[i++] = a.scale.y, j[i++] = a.rotation, 
            j[i++] = b.x2, j[i++] = b.y2, j[i++] = a.alpha, j[i++] = f, j[i++] = g, j[i++] = a.position.x, 
            j[i++] = a.position.y, j[i++] = a.scale.x, j[i++] = a.scale.y, j[i++] = a.rotation, 
            j[i++] = b.x3, j[i++] = b.y3, j[i++] = a.alpha, this.currentBatchSize++, this.currentBatchSize >= this.size && this.flush();
        }
    }, b.WebGLFastSpriteBatch.prototype.flush = function() {
        if (0 !== this.currentBatchSize) {
            var a = this.gl;
            if (this.currentBaseTexture._glTextures[a.id] || b.createWebGLTexture(this.currentBaseTexture, a), 
            a.bindTexture(a.TEXTURE_2D, this.currentBaseTexture._glTextures[a.id]), this.currentBatchSize > .5 * this.size) a.bufferSubData(a.ARRAY_BUFFER, 0, this.vertices); else {
                var c = this.vertices.subarray(0, 4 * this.currentBatchSize * this.vertSize);
                a.bufferSubData(a.ARRAY_BUFFER, 0, c);
            }
            a.drawElements(a.TRIANGLES, 6 * this.currentBatchSize, a.UNSIGNED_SHORT, 0), this.currentBatchSize = 0, 
            this.renderSession.drawCount++;
        }
    }, b.WebGLFastSpriteBatch.prototype.stop = function() {
        this.flush();
    }, b.WebGLFastSpriteBatch.prototype.start = function() {
        var a = this.gl;
        a.activeTexture(a.TEXTURE0), a.bindBuffer(a.ARRAY_BUFFER, this.vertexBuffer), a.bindBuffer(a.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
        var b = this.renderSession.projection;
        a.uniform2f(this.shader.projectionVector, b.x, b.y), a.uniformMatrix3fv(this.shader.uMatrix, !1, this.matrix);
        var c = 4 * this.vertSize;
        a.vertexAttribPointer(this.shader.aVertexPosition, 2, a.FLOAT, !1, c, 0), a.vertexAttribPointer(this.shader.aPositionCoord, 2, a.FLOAT, !1, c, 8), 
        a.vertexAttribPointer(this.shader.aScale, 2, a.FLOAT, !1, c, 16), a.vertexAttribPointer(this.shader.aRotation, 1, a.FLOAT, !1, c, 24), 
        a.vertexAttribPointer(this.shader.aTextureCoord, 2, a.FLOAT, !1, c, 28), a.vertexAttribPointer(this.shader.colorAttribute, 1, a.FLOAT, !1, c, 36);
    }, b.WebGLFilterManager = function(a, b) {
        this.transparent = b, this.filterStack = [], this.offsetX = 0, this.offsetY = 0, 
        this.setContext(a);
    }, b.WebGLFilterManager.prototype.setContext = function(a) {
        this.gl = a, this.texturePool = [], this.initShaderBuffers();
    }, b.WebGLFilterManager.prototype.begin = function(a, b) {
        this.renderSession = a, this.defaultShader = a.shaderManager.defaultShader;
        var c = this.renderSession.projection;
        this.width = 2 * c.x, this.height = 2 * -c.y, this.buffer = b;
    }, b.WebGLFilterManager.prototype.pushFilter = function(a) {
        var c = this.gl, d = this.renderSession.projection, e = this.renderSession.offset;
        a._filterArea = a.target.filterArea || a.target.getBounds(), this.filterStack.push(a);
        var f = a.filterPasses[0];
        this.offsetX += a._filterArea.x, this.offsetY += a._filterArea.y;
        var g = this.texturePool.pop();
        g ? g.resize(this.width, this.height) : g = new b.FilterTexture(this.gl, this.width, this.height), 
        c.bindTexture(c.TEXTURE_2D, g.texture);
        var h = a._filterArea, i = f.padding;
        h.x -= i, h.y -= i, h.width += 2 * i, h.height += 2 * i, h.x < 0 && (h.x = 0), h.width > this.width && (h.width = this.width), 
        h.y < 0 && (h.y = 0), h.height > this.height && (h.height = this.height), c.bindFramebuffer(c.FRAMEBUFFER, g.frameBuffer), 
        c.viewport(0, 0, h.width, h.height), d.x = h.width / 2, d.y = -h.height / 2, e.x = -h.x, 
        e.y = -h.y, this.renderSession.shaderManager.setShader(this.defaultShader), c.uniform2f(this.defaultShader.projectionVector, h.width / 2, -h.height / 2), 
        c.uniform2f(this.defaultShader.offsetVector, -h.x, -h.y), c.colorMask(!0, !0, !0, !0), 
        c.clearColor(0, 0, 0, 0), c.clear(c.COLOR_BUFFER_BIT), a._glFilterTexture = g;
    }, b.WebGLFilterManager.prototype.popFilter = function() {
        var a = this.gl, c = this.filterStack.pop(), d = c._filterArea, e = c._glFilterTexture, f = this.renderSession.projection, g = this.renderSession.offset;
        if (c.filterPasses.length > 1) {
            a.viewport(0, 0, d.width, d.height), a.bindBuffer(a.ARRAY_BUFFER, this.vertexBuffer), 
            this.vertexArray[0] = 0, this.vertexArray[1] = d.height, this.vertexArray[2] = d.width, 
            this.vertexArray[3] = d.height, this.vertexArray[4] = 0, this.vertexArray[5] = 0, 
            this.vertexArray[6] = d.width, this.vertexArray[7] = 0, a.bufferSubData(a.ARRAY_BUFFER, 0, this.vertexArray), 
            a.bindBuffer(a.ARRAY_BUFFER, this.uvBuffer), this.uvArray[2] = d.width / this.width, 
            this.uvArray[5] = d.height / this.height, this.uvArray[6] = d.width / this.width, 
            this.uvArray[7] = d.height / this.height, a.bufferSubData(a.ARRAY_BUFFER, 0, this.uvArray);
            var h = e, i = this.texturePool.pop();
            i || (i = new b.FilterTexture(this.gl, this.width, this.height)), i.resize(this.width, this.height), 
            a.bindFramebuffer(a.FRAMEBUFFER, i.frameBuffer), a.clear(a.COLOR_BUFFER_BIT), a.disable(a.BLEND);
            for (var j = 0; j < c.filterPasses.length - 1; j++) {
                var k = c.filterPasses[j];
                a.bindFramebuffer(a.FRAMEBUFFER, i.frameBuffer), a.activeTexture(a.TEXTURE0), a.bindTexture(a.TEXTURE_2D, h.texture), 
                this.applyFilterPass(k, d, d.width, d.height);
                var l = h;
                h = i, i = l;
            }
            a.enable(a.BLEND), e = h, this.texturePool.push(i);
        }
        var m = c.filterPasses[c.filterPasses.length - 1];
        this.offsetX -= d.x, this.offsetY -= d.y;
        var n = this.width, o = this.height, p = 0, q = 0, r = this.buffer;
        if (0 === this.filterStack.length) a.colorMask(!0, !0, !0, !0); else {
            var s = this.filterStack[this.filterStack.length - 1];
            d = s._filterArea, n = d.width, o = d.height, p = d.x, q = d.y, r = s._glFilterTexture.frameBuffer;
        }
        f.x = n / 2, f.y = -o / 2, g.x = p, g.y = q, d = c._filterArea;
        var t = d.x - p, u = d.y - q;
        a.bindBuffer(a.ARRAY_BUFFER, this.vertexBuffer), this.vertexArray[0] = t, this.vertexArray[1] = u + d.height, 
        this.vertexArray[2] = t + d.width, this.vertexArray[3] = u + d.height, this.vertexArray[4] = t, 
        this.vertexArray[5] = u, this.vertexArray[6] = t + d.width, this.vertexArray[7] = u, 
        a.bufferSubData(a.ARRAY_BUFFER, 0, this.vertexArray), a.bindBuffer(a.ARRAY_BUFFER, this.uvBuffer), 
        this.uvArray[2] = d.width / this.width, this.uvArray[5] = d.height / this.height, 
        this.uvArray[6] = d.width / this.width, this.uvArray[7] = d.height / this.height, 
        a.bufferSubData(a.ARRAY_BUFFER, 0, this.uvArray), a.viewport(0, 0, n, o), a.bindFramebuffer(a.FRAMEBUFFER, r), 
        a.activeTexture(a.TEXTURE0), a.bindTexture(a.TEXTURE_2D, e.texture), this.applyFilterPass(m, d, n, o), 
        this.renderSession.shaderManager.setShader(this.defaultShader), a.uniform2f(this.defaultShader.projectionVector, n / 2, -o / 2), 
        a.uniform2f(this.defaultShader.offsetVector, -p, -q), this.texturePool.push(e), 
        c._glFilterTexture = null;
    }, b.WebGLFilterManager.prototype.applyFilterPass = function(a, c, d, e) {
        var f = this.gl, g = a.shaders[f.id];
        g || (g = new b.PixiShader(f), g.fragmentSrc = a.fragmentSrc, g.uniforms = a.uniforms, 
        g.init(), a.shaders[f.id] = g), this.renderSession.shaderManager.setShader(g), f.uniform2f(g.projectionVector, d / 2, -e / 2), 
        f.uniform2f(g.offsetVector, 0, 0), a.uniforms.dimensions && (a.uniforms.dimensions.value[0] = this.width, 
        a.uniforms.dimensions.value[1] = this.height, a.uniforms.dimensions.value[2] = this.vertexArray[0], 
        a.uniforms.dimensions.value[3] = this.vertexArray[5]), g.syncUniforms(), f.bindBuffer(f.ARRAY_BUFFER, this.vertexBuffer), 
        f.vertexAttribPointer(g.aVertexPosition, 2, f.FLOAT, !1, 0, 0), f.bindBuffer(f.ARRAY_BUFFER, this.uvBuffer), 
        f.vertexAttribPointer(g.aTextureCoord, 2, f.FLOAT, !1, 0, 0), f.bindBuffer(f.ARRAY_BUFFER, this.colorBuffer), 
        f.vertexAttribPointer(g.colorAttribute, 2, f.FLOAT, !1, 0, 0), f.bindBuffer(f.ELEMENT_ARRAY_BUFFER, this.indexBuffer), 
        f.drawElements(f.TRIANGLES, 6, f.UNSIGNED_SHORT, 0), this.renderSession.drawCount++;
    }, b.WebGLFilterManager.prototype.initShaderBuffers = function() {
        var a = this.gl;
        this.vertexBuffer = a.createBuffer(), this.uvBuffer = a.createBuffer(), this.colorBuffer = a.createBuffer(), 
        this.indexBuffer = a.createBuffer(), this.vertexArray = new Float32Array([ 0, 0, 1, 0, 0, 1, 1, 1 ]), 
        a.bindBuffer(a.ARRAY_BUFFER, this.vertexBuffer), a.bufferData(a.ARRAY_BUFFER, this.vertexArray, a.STATIC_DRAW), 
        this.uvArray = new Float32Array([ 0, 0, 1, 0, 0, 1, 1, 1 ]), a.bindBuffer(a.ARRAY_BUFFER, this.uvBuffer), 
        a.bufferData(a.ARRAY_BUFFER, this.uvArray, a.STATIC_DRAW), this.colorArray = new Float32Array([ 1, 16777215, 1, 16777215, 1, 16777215, 1, 16777215 ]), 
        a.bindBuffer(a.ARRAY_BUFFER, this.colorBuffer), a.bufferData(a.ARRAY_BUFFER, this.colorArray, a.STATIC_DRAW), 
        a.bindBuffer(a.ELEMENT_ARRAY_BUFFER, this.indexBuffer), a.bufferData(a.ELEMENT_ARRAY_BUFFER, new Uint16Array([ 0, 1, 2, 1, 3, 2 ]), a.STATIC_DRAW);
    }, b.WebGLFilterManager.prototype.destroy = function() {
        var a = this.gl;
        this.filterStack = null, this.offsetX = 0, this.offsetY = 0;
        for (var b = 0; b < this.texturePool.length; b++) this.texturePool[b].destroy();
        this.texturePool = null, a.deleteBuffer(this.vertexBuffer), a.deleteBuffer(this.uvBuffer), 
        a.deleteBuffer(this.colorBuffer), a.deleteBuffer(this.indexBuffer);
    }, b.FilterTexture = function(a, c, d, e) {
        this.gl = a, this.frameBuffer = a.createFramebuffer(), this.texture = a.createTexture(), 
        e = e || b.scaleModes.DEFAULT, a.bindTexture(a.TEXTURE_2D, this.texture), a.texParameteri(a.TEXTURE_2D, a.TEXTURE_MAG_FILTER, e === b.scaleModes.LINEAR ? a.LINEAR : a.NEAREST), 
        a.texParameteri(a.TEXTURE_2D, a.TEXTURE_MIN_FILTER, e === b.scaleModes.LINEAR ? a.LINEAR : a.NEAREST), 
        a.texParameteri(a.TEXTURE_2D, a.TEXTURE_WRAP_S, a.CLAMP_TO_EDGE), a.texParameteri(a.TEXTURE_2D, a.TEXTURE_WRAP_T, a.CLAMP_TO_EDGE), 
        a.bindFramebuffer(a.FRAMEBUFFER, this.framebuffer), a.bindFramebuffer(a.FRAMEBUFFER, this.frameBuffer), 
        a.framebufferTexture2D(a.FRAMEBUFFER, a.COLOR_ATTACHMENT0, a.TEXTURE_2D, this.texture, 0), 
        this.renderBuffer = a.createRenderbuffer(), a.bindRenderbuffer(a.RENDERBUFFER, this.renderBuffer), 
        a.framebufferRenderbuffer(a.FRAMEBUFFER, a.DEPTH_STENCIL_ATTACHMENT, a.RENDERBUFFER, this.renderBuffer), 
        this.resize(c, d);
    }, b.FilterTexture.prototype.clear = function() {
        var a = this.gl;
        a.clearColor(0, 0, 0, 0), a.clear(a.COLOR_BUFFER_BIT);
    }, b.FilterTexture.prototype.resize = function(a, b) {
        if (this.width !== a || this.height !== b) {
            this.width = a, this.height = b;
            var c = this.gl;
            c.bindTexture(c.TEXTURE_2D, this.texture), c.texImage2D(c.TEXTURE_2D, 0, c.RGBA, a, b, 0, c.RGBA, c.UNSIGNED_BYTE, null), 
            c.bindRenderbuffer(c.RENDERBUFFER, this.renderBuffer), c.renderbufferStorage(c.RENDERBUFFER, c.DEPTH_STENCIL, a, b);
        }
    }, b.FilterTexture.prototype.destroy = function() {
        var a = this.gl;
        a.deleteFramebuffer(this.frameBuffer), a.deleteTexture(this.texture), this.frameBuffer = null, 
        this.texture = null;
    }, b.CanvasMaskManager = function() {}, b.CanvasMaskManager.prototype.pushMask = function(a, c) {
        c.save();
        var d = a.alpha, e = a.worldTransform;
        c.setTransform(e.a, e.c, e.b, e.d, e.tx, e.ty), b.CanvasGraphics.renderGraphicsMask(a, c), 
        c.clip(), a.worldAlpha = d;
    }, b.CanvasMaskManager.prototype.popMask = function(a) {
        a.restore();
    }, b.CanvasTinter = function() {}, b.CanvasTinter.getTintedTexture = function(a, c) {
        var d = a.texture;
        c = b.CanvasTinter.roundColor(c);
        var e = "#" + ("00000" + (0 | c).toString(16)).substr(-6);
        if (d.tintCache = d.tintCache || {}, d.tintCache[e]) return d.tintCache[e];
        var f = b.CanvasTinter.canvas || document.createElement("canvas");
        if (b.CanvasTinter.tintMethod(d, c, f), b.CanvasTinter.convertTintToImage) {
            var g = new Image();
            g.src = f.toDataURL(), d.tintCache[e] = g;
        } else d.tintCache[e] = f, b.CanvasTinter.canvas = null;
        return f;
    }, b.CanvasTinter.tintWithMultiply = function(a, b, c) {
        var d = c.getContext("2d"), e = a.frame;
        c.width = e.width, c.height = e.height, d.fillStyle = "#" + ("00000" + (0 | b).toString(16)).substr(-6), 
        d.fillRect(0, 0, e.width, e.height), d.globalCompositeOperation = "multiply", d.drawImage(a.baseTexture.source, e.x, e.y, e.width, e.height, 0, 0, e.width, e.height), 
        d.globalCompositeOperation = "destination-atop", d.drawImage(a.baseTexture.source, e.x, e.y, e.width, e.height, 0, 0, e.width, e.height);
    }, b.CanvasTinter.tintWithOverlay = function(a, b, c) {
        var d = c.getContext("2d"), e = a.frame;
        c.width = e.width, c.height = e.height, d.globalCompositeOperation = "copy", d.fillStyle = "#" + ("00000" + (0 | b).toString(16)).substr(-6), 
        d.fillRect(0, 0, e.width, e.height), d.globalCompositeOperation = "destination-atop", 
        d.drawImage(a.baseTexture.source, e.x, e.y, e.width, e.height, 0, 0, e.width, e.height);
    }, b.CanvasTinter.tintWithPerPixel = function(a, c, d) {
        var e = d.getContext("2d"), f = a.frame;
        d.width = f.width, d.height = f.height, e.globalCompositeOperation = "copy", e.drawImage(a.baseTexture.source, f.x, f.y, f.width, f.height, 0, 0, f.width, f.height);
        for (var g = b.hex2rgb(c), h = g[0], i = g[1], j = g[2], k = e.getImageData(0, 0, f.width, f.height), l = k.data, m = 0; m < l.length; m += 4) l[m + 0] *= h, 
        l[m + 1] *= i, l[m + 2] *= j;
        e.putImageData(k, 0, 0);
    }, b.CanvasTinter.roundColor = function(a) {
        var c = b.CanvasTinter.cacheStepsPerColorChannel, d = b.hex2rgb(a);
        return d[0] = Math.min(255, d[0] / c * c), d[1] = Math.min(255, d[1] / c * c), d[2] = Math.min(255, d[2] / c * c), 
        b.rgb2hex(d);
    }, b.CanvasTinter.cacheStepsPerColorChannel = 8, b.CanvasTinter.convertTintToImage = !1, 
    b.CanvasTinter.canUseMultiply = b.canUseNewCanvasBlendModes(), b.CanvasTinter.tintMethod = b.CanvasTinter.canUseMultiply ? b.CanvasTinter.tintWithMultiply : b.CanvasTinter.tintWithPerPixel, 
    b.CanvasRenderer = function(a, c, d, e) {
        b.defaultRenderer || (b.sayHello("Canvas"), b.defaultRenderer = this), this.type = b.CANVAS_RENDERER, 
        this.clearBeforeRender = !0, this.transparent = !!e, b.blendModesCanvas || (b.blendModesCanvas = [], 
        b.canUseNewCanvasBlendModes() ? (b.blendModesCanvas[b.blendModes.NORMAL] = "source-over", 
        b.blendModesCanvas[b.blendModes.ADD] = "lighter", b.blendModesCanvas[b.blendModes.MULTIPLY] = "multiply", 
        b.blendModesCanvas[b.blendModes.SCREEN] = "screen", b.blendModesCanvas[b.blendModes.OVERLAY] = "overlay", 
        b.blendModesCanvas[b.blendModes.DARKEN] = "darken", b.blendModesCanvas[b.blendModes.LIGHTEN] = "lighten", 
        b.blendModesCanvas[b.blendModes.COLOR_DODGE] = "color-dodge", b.blendModesCanvas[b.blendModes.COLOR_BURN] = "color-burn", 
        b.blendModesCanvas[b.blendModes.HARD_LIGHT] = "hard-light", b.blendModesCanvas[b.blendModes.SOFT_LIGHT] = "soft-light", 
        b.blendModesCanvas[b.blendModes.DIFFERENCE] = "difference", b.blendModesCanvas[b.blendModes.EXCLUSION] = "exclusion", 
        b.blendModesCanvas[b.blendModes.HUE] = "hue", b.blendModesCanvas[b.blendModes.SATURATION] = "saturation", 
        b.blendModesCanvas[b.blendModes.COLOR] = "color", b.blendModesCanvas[b.blendModes.LUMINOSITY] = "luminosity") : (b.blendModesCanvas[b.blendModes.NORMAL] = "source-over", 
        b.blendModesCanvas[b.blendModes.ADD] = "lighter", b.blendModesCanvas[b.blendModes.MULTIPLY] = "source-over", 
        b.blendModesCanvas[b.blendModes.SCREEN] = "source-over", b.blendModesCanvas[b.blendModes.OVERLAY] = "source-over", 
        b.blendModesCanvas[b.blendModes.DARKEN] = "source-over", b.blendModesCanvas[b.blendModes.LIGHTEN] = "source-over", 
        b.blendModesCanvas[b.blendModes.COLOR_DODGE] = "source-over", b.blendModesCanvas[b.blendModes.COLOR_BURN] = "source-over", 
        b.blendModesCanvas[b.blendModes.HARD_LIGHT] = "source-over", b.blendModesCanvas[b.blendModes.SOFT_LIGHT] = "source-over", 
        b.blendModesCanvas[b.blendModes.DIFFERENCE] = "source-over", b.blendModesCanvas[b.blendModes.EXCLUSION] = "source-over", 
        b.blendModesCanvas[b.blendModes.HUE] = "source-over", b.blendModesCanvas[b.blendModes.SATURATION] = "source-over", 
        b.blendModesCanvas[b.blendModes.COLOR] = "source-over", b.blendModesCanvas[b.blendModes.LUMINOSITY] = "source-over")), 
        this.width = a || 800, this.height = c || 600, this.view = d || document.createElement("canvas"), 
        this.context = this.view.getContext("2d", {
            alpha: this.transparent
        }), this.refresh = !0, this.view.width = this.width, this.view.height = this.height, 
        this.count = 0, this.maskManager = new b.CanvasMaskManager(), this.renderSession = {
            context: this.context,
            maskManager: this.maskManager,
            scaleMode: null,
            smoothProperty: null,
            roundPixels: !1
        }, "imageSmoothingEnabled" in this.context ? this.renderSession.smoothProperty = "imageSmoothingEnabled" : "webkitImageSmoothingEnabled" in this.context ? this.renderSession.smoothProperty = "webkitImageSmoothingEnabled" : "mozImageSmoothingEnabled" in this.context ? this.renderSession.smoothProperty = "mozImageSmoothingEnabled" : "oImageSmoothingEnabled" in this.context && (this.renderSession.smoothProperty = "oImageSmoothingEnabled");
    }, b.CanvasRenderer.prototype.constructor = b.CanvasRenderer, b.CanvasRenderer.prototype.render = function(a) {
        b.texturesToUpdate.length = 0, b.texturesToDestroy.length = 0, a.updateTransform(), 
        this.context.setTransform(1, 0, 0, 1, 0, 0), this.context.globalAlpha = 1, navigator.isCocoonJS && this.view.screencanvas && (this.context.fillStyle = "black", 
        this.context.clear()), !this.transparent && this.clearBeforeRender ? (this.context.fillStyle = a.backgroundColorString, 
        this.context.fillRect(0, 0, this.width, this.height)) : this.transparent && this.clearBeforeRender && this.context.clearRect(0, 0, this.width, this.height), 
        this.renderDisplayObject(a), a.interactive && (a._interactiveEventsAdded || (a._interactiveEventsAdded = !0, 
        a.interactionManager.setTarget(this))), b.Texture.frameUpdates.length > 0 && (b.Texture.frameUpdates.length = 0);
    }, b.CanvasRenderer.prototype.resize = function(a, b) {
        this.width = a, this.height = b, this.view.width = a, this.view.height = b;
    }, b.CanvasRenderer.prototype.renderDisplayObject = function(a, b) {
        this.renderSession.context = b || this.context, a._renderCanvas(this.renderSession);
    }, b.CanvasRenderer.prototype.renderStripFlat = function(a) {
        var b = this.context, c = a.verticies, d = c.length / 2;
        this.count++, b.beginPath();
        for (var e = 1; d - 2 > e; e++) {
            var f = 2 * e, g = c[f], h = c[f + 2], i = c[f + 4], j = c[f + 1], k = c[f + 3], l = c[f + 5];
            b.moveTo(g, j), b.lineTo(h, k), b.lineTo(i, l);
        }
        b.fillStyle = "#FF0000", b.fill(), b.closePath();
    }, b.CanvasRenderer.prototype.renderStrip = function(a) {
        var b = this.context, c = a.verticies, d = a.uvs, e = c.length / 2;
        this.count++;
        for (var f = 1; e - 2 > f; f++) {
            var g = 2 * f, h = c[g], i = c[g + 2], j = c[g + 4], k = c[g + 1], l = c[g + 3], m = c[g + 5], n = d[g] * a.texture.width, o = d[g + 2] * a.texture.width, p = d[g + 4] * a.texture.width, q = d[g + 1] * a.texture.height, r = d[g + 3] * a.texture.height, s = d[g + 5] * a.texture.height;
            b.save(), b.beginPath(), b.moveTo(h, k), b.lineTo(i, l), b.lineTo(j, m), b.closePath(), 
            b.clip();
            var t = n * r + q * p + o * s - r * p - q * o - n * s, u = h * r + q * j + i * s - r * j - q * i - h * s, v = n * i + h * p + o * j - i * p - h * o - n * j, w = n * r * j + q * i * p + h * o * s - h * r * p - q * o * j - n * i * s, x = k * r + q * m + l * s - r * m - q * l - k * s, y = n * l + k * p + o * m - l * p - k * o - n * m, z = n * r * m + q * l * p + k * o * s - k * r * p - q * o * m - n * l * s;
            b.transform(u / t, x / t, v / t, y / t, w / t, z / t), b.drawImage(a.texture.baseTexture.source, 0, 0), 
            b.restore();
        }
    }, b.CanvasBuffer = function(a, b) {
        this.width = a, this.height = b, this.canvas = document.createElement("canvas"), 
        this.context = this.canvas.getContext("2d"), this.canvas.width = a, this.canvas.height = b;
    }, b.CanvasBuffer.prototype.clear = function() {
        this.context.clearRect(0, 0, this.width, this.height);
    }, b.CanvasBuffer.prototype.resize = function(a, b) {
        this.width = this.canvas.width = a, this.height = this.canvas.height = b;
    }, b.CanvasGraphics = function() {}, b.CanvasGraphics.renderGraphics = function(a, c) {
        for (var d = a.worldAlpha, e = "", f = 0; f < a.graphicsData.length; f++) {
            var g = a.graphicsData[f], h = g.points;
            if (c.strokeStyle = e = "#" + ("00000" + (0 | g.lineColor).toString(16)).substr(-6), 
            c.lineWidth = g.lineWidth, g.type === b.Graphics.POLY) {
                c.beginPath(), c.moveTo(h[0], h[1]);
                for (var i = 1; i < h.length / 2; i++) c.lineTo(h[2 * i], h[2 * i + 1]);
                h[0] === h[h.length - 2] && h[1] === h[h.length - 1] && c.closePath(), g.fill && (c.globalAlpha = g.fillAlpha * d, 
                c.fillStyle = e = "#" + ("00000" + (0 | g.fillColor).toString(16)).substr(-6), c.fill()), 
                g.lineWidth && (c.globalAlpha = g.lineAlpha * d, c.stroke());
            } else if (g.type === b.Graphics.RECT) (g.fillColor || 0 === g.fillColor) && (c.globalAlpha = g.fillAlpha * d, 
            c.fillStyle = e = "#" + ("00000" + (0 | g.fillColor).toString(16)).substr(-6), c.fillRect(h[0], h[1], h[2], h[3])), 
            g.lineWidth && (c.globalAlpha = g.lineAlpha * d, c.strokeRect(h[0], h[1], h[2], h[3])); else if (g.type === b.Graphics.CIRC) c.beginPath(), 
            c.arc(h[0], h[1], h[2], 0, 2 * Math.PI), c.closePath(), g.fill && (c.globalAlpha = g.fillAlpha * d, 
            c.fillStyle = e = "#" + ("00000" + (0 | g.fillColor).toString(16)).substr(-6), c.fill()), 
            g.lineWidth && (c.globalAlpha = g.lineAlpha * d, c.stroke()); else if (g.type === b.Graphics.ELIP) {
                var j = g.points, k = 2 * j[2], l = 2 * j[3], m = j[0] - k / 2, n = j[1] - l / 2;
                c.beginPath();
                var o = .5522848, p = k / 2 * o, q = l / 2 * o, r = m + k, s = n + l, t = m + k / 2, u = n + l / 2;
                c.moveTo(m, u), c.bezierCurveTo(m, u - q, t - p, n, t, n), c.bezierCurveTo(t + p, n, r, u - q, r, u), 
                c.bezierCurveTo(r, u + q, t + p, s, t, s), c.bezierCurveTo(t - p, s, m, u + q, m, u), 
                c.closePath(), g.fill && (c.globalAlpha = g.fillAlpha * d, c.fillStyle = e = "#" + ("00000" + (0 | g.fillColor).toString(16)).substr(-6), 
                c.fill()), g.lineWidth && (c.globalAlpha = g.lineAlpha * d, c.stroke());
            } else if (g.type === b.Graphics.RREC) {
                var v = h[0], w = h[1], x = h[2], y = h[3], z = h[4], A = Math.min(x, y) / 2 | 0;
                z = z > A ? A : z, c.beginPath(), c.moveTo(v, w + z), c.lineTo(v, w + y - z), c.quadraticCurveTo(v, w + y, v + z, w + y), 
                c.lineTo(v + x - z, w + y), c.quadraticCurveTo(v + x, w + y, v + x, w + y - z), 
                c.lineTo(v + x, w + z), c.quadraticCurveTo(v + x, w, v + x - z, w), c.lineTo(v + z, w), 
                c.quadraticCurveTo(v, w, v, w + z), c.closePath(), (g.fillColor || 0 === g.fillColor) && (c.globalAlpha = g.fillAlpha * d, 
                c.fillStyle = e = "#" + ("00000" + (0 | g.fillColor).toString(16)).substr(-6), c.fill()), 
                g.lineWidth && (c.globalAlpha = g.lineAlpha * d, c.stroke());
            }
        }
    }, b.CanvasGraphics.renderGraphicsMask = function(a, c) {
        var d = a.graphicsData.length;
        if (0 !== d) {
            d > 1 && (d = 1, window.console.log("Pixi.js warning: masks in canvas can only mask using the first path in the graphics object"));
            for (var e = 0; 1 > e; e++) {
                var f = a.graphicsData[e], g = f.points;
                if (f.type === b.Graphics.POLY) {
                    c.beginPath(), c.moveTo(g[0], g[1]);
                    for (var h = 1; h < g.length / 2; h++) c.lineTo(g[2 * h], g[2 * h + 1]);
                    g[0] === g[g.length - 2] && g[1] === g[g.length - 1] && c.closePath();
                } else if (f.type === b.Graphics.RECT) c.beginPath(), c.rect(g[0], g[1], g[2], g[3]), 
                c.closePath(); else if (f.type === b.Graphics.CIRC) c.beginPath(), c.arc(g[0], g[1], g[2], 0, 2 * Math.PI), 
                c.closePath(); else if (f.type === b.Graphics.ELIP) {
                    var i = f.points, j = 2 * i[2], k = 2 * i[3], l = i[0] - j / 2, m = i[1] - k / 2;
                    c.beginPath();
                    var n = .5522848, o = j / 2 * n, p = k / 2 * n, q = l + j, r = m + k, s = l + j / 2, t = m + k / 2;
                    c.moveTo(l, t), c.bezierCurveTo(l, t - p, s - o, m, s, m), c.bezierCurveTo(s + o, m, q, t - p, q, t), 
                    c.bezierCurveTo(q, t + p, s + o, r, s, r), c.bezierCurveTo(s - o, r, l, t + p, l, t), 
                    c.closePath();
                } else if (f.type === b.Graphics.RREC) {
                    var u = g[0], v = g[1], w = g[2], x = g[3], y = g[4], z = Math.min(w, x) / 2 | 0;
                    y = y > z ? z : y, c.beginPath(), c.moveTo(u, v + y), c.lineTo(u, v + x - y), c.quadraticCurveTo(u, v + x, u + y, v + x), 
                    c.lineTo(u + w - y, v + x), c.quadraticCurveTo(u + w, v + x, u + w, v + x - y), 
                    c.lineTo(u + w, v + y), c.quadraticCurveTo(u + w, v, u + w - y, v), c.lineTo(u + y, v), 
                    c.quadraticCurveTo(u, v, u, v + y), c.closePath();
                }
            }
        }
    }, b.Graphics = function() {
        b.DisplayObjectContainer.call(this), this.renderable = !0, this.fillAlpha = 1, this.lineWidth = 0, 
        this.lineColor = "black", this.graphicsData = [], this.tint = 16777215, this.blendMode = b.blendModes.NORMAL, 
        this.currentPath = {
            points: []
        }, this._webGL = [], this.isMask = !1, this.bounds = null, this.boundsPadding = 10, 
        this.dirty = !0;
    }, b.Graphics.prototype = Object.create(b.DisplayObjectContainer.prototype), b.Graphics.prototype.constructor = b.Graphics, 
    Object.defineProperty(b.Graphics.prototype, "cacheAsBitmap", {
        get: function() {
            return this._cacheAsBitmap;
        },
        set: function(a) {
            this._cacheAsBitmap = a, this._cacheAsBitmap ? this._generateCachedSprite() : (this.destroyCachedSprite(), 
            this.dirty = !0);
        }
    }), b.Graphics.prototype.lineStyle = function(a, c, d) {
        return this.currentPath.points.length || this.graphicsData.pop(), this.lineWidth = a || 0, 
        this.lineColor = c || 0, this.lineAlpha = arguments.length < 3 ? 1 : d, this.currentPath = {
            lineWidth: this.lineWidth,
            lineColor: this.lineColor,
            lineAlpha: this.lineAlpha,
            fillColor: this.fillColor,
            fillAlpha: this.fillAlpha,
            fill: this.filling,
            points: [],
            type: b.Graphics.POLY
        }, this.graphicsData.push(this.currentPath), this;
    }, b.Graphics.prototype.moveTo = function(a, c) {
        return this.currentPath.points.length || this.graphicsData.pop(), this.currentPath = this.currentPath = {
            lineWidth: this.lineWidth,
            lineColor: this.lineColor,
            lineAlpha: this.lineAlpha,
            fillColor: this.fillColor,
            fillAlpha: this.fillAlpha,
            fill: this.filling,
            points: [],
            type: b.Graphics.POLY
        }, this.currentPath.points.push(a, c), this.graphicsData.push(this.currentPath), 
        this;
    }, b.Graphics.prototype.lineTo = function(a, b) {
        return this.currentPath.points.push(a, b), this.dirty = !0, this;
    }, b.Graphics.prototype.quadraticCurveTo = function(a, b, c, d) {
        0 === this.currentPath.points.length && this.moveTo(0, 0);
        var e, f, g = 20, h = this.currentPath.points;
        0 === h.length && this.moveTo(0, 0);
        for (var i = h[h.length - 2], j = h[h.length - 1], k = 0, l = 1; g >= l; l++) k = l / g, 
        e = i + (a - i) * k, f = j + (b - j) * k, h.push(e + (a + (c - a) * k - e) * k, f + (b + (d - b) * k - f) * k);
        return this.dirty = !0, this;
    }, b.Graphics.prototype.bezierCurveTo = function(a, b, c, d, e, f) {
        0 === this.currentPath.points.length && this.moveTo(0, 0);
        for (var g, h, i, j, k, l = 20, m = this.currentPath.points, n = m[m.length - 2], o = m[m.length - 1], p = 0, q = 1; l > q; q++) p = q / l, 
        g = 1 - p, h = g * g, i = h * g, j = p * p, k = j * p, m.push(i * n + 3 * h * p * a + 3 * g * j * c + k * e, i * o + 3 * h * p * b + 3 * g * j * d + k * f);
        return this.dirty = !0, this;
    }, b.Graphics.prototype.arcTo = function(a, b, c, d, e) {
        0 === this.currentPath.points.length && this.moveTo(a, b);
        var f = this.currentPath.points, g = f[f.length - 2], h = f[f.length - 1], i = h - b, j = g - a, k = d - b, l = c - a, m = Math.abs(i * l - j * k);
        if (1e-8 > m || 0 === e) f.push(a, b); else {
            var n = i * i + j * j, o = k * k + l * l, p = i * k + j * l, q = e * Math.sqrt(n) / m, r = e * Math.sqrt(o) / m, s = q * p / n, t = r * p / o, u = q * l + r * j, v = q * k + r * i, w = j * (r + s), x = i * (r + s), y = l * (q + t), z = k * (q + t), A = Math.atan2(x - v, w - u), B = Math.atan2(z - v, y - u);
            this.arc(u + a, v + b, e, A, B, j * k > l * i);
        }
        return this.dirty = !0, this;
    }, b.Graphics.prototype.arc = function(a, b, c, d, e, f) {
        var g = a + Math.cos(d) * c, h = b + Math.sin(d) * c, i = this.currentPath.points;
        if ((0 !== i.length && i[i.length - 2] !== g || i[i.length - 1] !== h) && (this.moveTo(g, h), 
        i = this.currentPath.points), d === e) return this;
        !f && d >= e ? e += 2 * Math.PI : f && e >= d && (d += 2 * Math.PI);
        var j = f ? -1 * (d - e) : e - d, k = Math.abs(j) / (2 * Math.PI) * 40;
        if (0 === j) return this;
        for (var l = j / (2 * k), m = 2 * l, n = Math.cos(l), o = Math.sin(l), p = k - 1, q = p % 1 / p, r = 0; p >= r; r++) {
            var s = r + q * r, t = l + d + m * s, u = Math.cos(t), v = -Math.sin(t);
            i.push((n * u + o * v) * c + a, (n * -v + o * u) * c + b);
        }
        return this.dirty = !0, this;
    }, b.Graphics.prototype.drawPath = function(a) {
        return this.currentPath.points.length || this.graphicsData.pop(), this.currentPath = this.currentPath = {
            lineWidth: this.lineWidth,
            lineColor: this.lineColor,
            lineAlpha: this.lineAlpha,
            fillColor: this.fillColor,
            fillAlpha: this.fillAlpha,
            fill: this.filling,
            points: [],
            type: b.Graphics.POLY
        }, this.graphicsData.push(this.currentPath), this.currentPath.points = this.currentPath.points.concat(a), 
        this.dirty = !0, this;
    }, b.Graphics.prototype.beginFill = function(a, b) {
        return this.filling = !0, this.fillColor = a || 0, this.fillAlpha = arguments.length < 2 ? 1 : b, 
        this;
    }, b.Graphics.prototype.endFill = function() {
        return this.filling = !1, this.fillColor = null, this.fillAlpha = 1, this;
    }, b.Graphics.prototype.drawRect = function(a, c, d, e) {
        return this.currentPath.points.length || this.graphicsData.pop(), this.currentPath = {
            lineWidth: this.lineWidth,
            lineColor: this.lineColor,
            lineAlpha: this.lineAlpha,
            fillColor: this.fillColor,
            fillAlpha: this.fillAlpha,
            fill: this.filling,
            points: [ a, c, d, e ],
            type: b.Graphics.RECT
        }, this.graphicsData.push(this.currentPath), this.dirty = !0, this;
    }, b.Graphics.prototype.drawRoundedRect = function(a, c, d, e, f) {
        return this.currentPath.points.length || this.graphicsData.pop(), this.currentPath = {
            lineWidth: this.lineWidth,
            lineColor: this.lineColor,
            lineAlpha: this.lineAlpha,
            fillColor: this.fillColor,
            fillAlpha: this.fillAlpha,
            fill: this.filling,
            points: [ a, c, d, e, f ],
            type: b.Graphics.RREC
        }, this.graphicsData.push(this.currentPath), this.dirty = !0, this;
    }, b.Graphics.prototype.drawCircle = function(a, c, d) {
        return this.currentPath.points.length || this.graphicsData.pop(), this.currentPath = {
            lineWidth: this.lineWidth,
            lineColor: this.lineColor,
            lineAlpha: this.lineAlpha,
            fillColor: this.fillColor,
            fillAlpha: this.fillAlpha,
            fill: this.filling,
            points: [ a, c, d, d ],
            type: b.Graphics.CIRC
        }, this.graphicsData.push(this.currentPath), this.dirty = !0, this;
    }, b.Graphics.prototype.drawEllipse = function(a, c, d, e) {
        return this.currentPath.points.length || this.graphicsData.pop(), this.currentPath = {
            lineWidth: this.lineWidth,
            lineColor: this.lineColor,
            lineAlpha: this.lineAlpha,
            fillColor: this.fillColor,
            fillAlpha: this.fillAlpha,
            fill: this.filling,
            points: [ a, c, d, e ],
            type: b.Graphics.ELIP
        }, this.graphicsData.push(this.currentPath), this.dirty = !0, this;
    }, b.Graphics.prototype.clear = function() {
        return this.lineWidth = 0, this.filling = !1, this.dirty = !0, this.clearDirty = !0, 
        this.graphicsData = [], this.bounds = null, this;
    }, b.Graphics.prototype.generateTexture = function() {
        var a = this.getBounds(), c = new b.CanvasBuffer(a.width, a.height), d = b.Texture.fromCanvas(c.canvas);
        return c.context.translate(-a.x, -a.y), b.CanvasGraphics.renderGraphics(this, c.context), 
        d;
    }, b.Graphics.prototype._renderWebGL = function(a) {
        if (this.visible !== !1 && 0 !== this.alpha && this.isMask !== !0) {
            if (this._cacheAsBitmap) return this.dirty && (this._generateCachedSprite(), b.updateWebGLTexture(this._cachedSprite.texture.baseTexture, a.gl), 
            this.dirty = !1), this._cachedSprite.alpha = this.alpha, void b.Sprite.prototype._renderWebGL.call(this._cachedSprite, a);
            if (a.spriteBatch.stop(), a.blendModeManager.setBlendMode(this.blendMode), this._mask && a.maskManager.pushMask(this._mask, a), 
            this._filters && a.filterManager.pushFilter(this._filterBlock), this.blendMode !== a.spriteBatch.currentBlendMode) {
                a.spriteBatch.currentBlendMode = this.blendMode;
                var c = b.blendModesWebGL[a.spriteBatch.currentBlendMode];
                a.spriteBatch.gl.blendFunc(c[0], c[1]);
            }
            if (b.WebGLGraphics.renderGraphics(this, a), this.children.length) {
                a.spriteBatch.start();
                for (var d = 0, e = this.children.length; e > d; d++) this.children[d]._renderWebGL(a);
                a.spriteBatch.stop();
            }
            this._filters && a.filterManager.popFilter(), this._mask && a.maskManager.popMask(this.mask, a), 
            a.drawCount++, a.spriteBatch.start();
        }
    }, b.Graphics.prototype._renderCanvas = function(a) {
        if (this.visible !== !1 && 0 !== this.alpha && this.isMask !== !0) {
            var c = a.context, d = this.worldTransform;
            this.blendMode !== a.currentBlendMode && (a.currentBlendMode = this.blendMode, c.globalCompositeOperation = b.blendModesCanvas[a.currentBlendMode]), 
            this._mask && a.maskManager.pushMask(this._mask, a.context), c.setTransform(d.a, d.c, d.b, d.d, d.tx, d.ty), 
            b.CanvasGraphics.renderGraphics(this, c);
            for (var e = 0, f = this.children.length; f > e; e++) this.children[e]._renderCanvas(a);
            this._mask && a.maskManager.popMask(a.context);
        }
    }, b.Graphics.prototype.getBounds = function(a) {
        this.bounds || this.updateBounds();
        var b = this.bounds.x, c = this.bounds.width + this.bounds.x, d = this.bounds.y, e = this.bounds.height + this.bounds.y, f = a || this.worldTransform, g = f.a, h = f.c, i = f.b, j = f.d, k = f.tx, l = f.ty, m = g * c + i * e + k, n = j * e + h * c + l, o = g * b + i * e + k, p = j * e + h * b + l, q = g * b + i * d + k, r = j * d + h * b + l, s = g * c + i * d + k, t = j * d + h * c + l, u = m, v = n, w = m, x = n;
        w = w > o ? o : w, w = w > q ? q : w, w = w > s ? s : w, x = x > p ? p : x, x = x > r ? r : x, 
        x = x > t ? t : x, u = o > u ? o : u, u = q > u ? q : u, u = s > u ? s : u, v = p > v ? p : v, 
        v = r > v ? r : v, v = t > v ? t : v;
        var y = this._bounds;
        return y.x = w, y.width = u - w, y.y = x, y.height = v - x, y;
    }, b.Graphics.prototype.updateBounds = function() {
        for (var a, c, d, e, f, g = 1 / 0, h = -1 / 0, i = 1 / 0, j = -1 / 0, k = 0; k < this.graphicsData.length; k++) {
            var l = this.graphicsData[k], m = l.type, n = l.lineWidth;
            if (a = l.points, m === b.Graphics.RECT) c = a[0] - n / 2, d = a[1] - n / 2, e = a[2] + n, 
            f = a[3] + n, g = g > c ? c : g, h = c + e > h ? c + e : h, i = i > d ? c : i, j = d + f > j ? d + f : j; else if (m === b.Graphics.CIRC || m === b.Graphics.ELIP) c = a[0], 
            d = a[1], e = a[2] + n / 2, f = a[3] + n / 2, g = g > c - e ? c - e : g, h = c + e > h ? c + e : h, 
            i = i > d - f ? d - f : i, j = d + f > j ? d + f : j; else for (var o = 0; o < a.length; o += 2) c = a[o], 
            d = a[o + 1], g = g > c - n ? c - n : g, h = c + n > h ? c + n : h, i = i > d - n ? d - n : i, 
            j = d + n > j ? d + n : j;
        }
        var p = this.boundsPadding;
        this.bounds = new b.Rectangle(g - p, i - p, h - g + 2 * p, j - i + 2 * p);
    }, b.Graphics.prototype._generateCachedSprite = function() {
        var a = this.getLocalBounds();
        if (this._cachedSprite) this._cachedSprite.buffer.resize(a.width, a.height); else {
            var c = new b.CanvasBuffer(a.width, a.height), d = b.Texture.fromCanvas(c.canvas);
            this._cachedSprite = new b.Sprite(d), this._cachedSprite.buffer = c, this._cachedSprite.worldTransform = this.worldTransform;
        }
        this._cachedSprite.anchor.x = -(a.x / a.width), this._cachedSprite.anchor.y = -(a.y / a.height), 
        this._cachedSprite.buffer.context.translate(-a.x, -a.y), b.CanvasGraphics.renderGraphics(this, this._cachedSprite.buffer.context), 
        this._cachedSprite.alpha = this.alpha;
    }, b.Graphics.prototype.destroyCachedSprite = function() {
        this._cachedSprite.texture.destroy(!0), this._cachedSprite = null;
    }, b.Graphics.POLY = 0, b.Graphics.RECT = 1, b.Graphics.CIRC = 2, b.Graphics.ELIP = 3, 
    b.Graphics.RREC = 4, b.Strip = function(a) {
        b.DisplayObjectContainer.call(this), this.texture = a, this.uvs = new b.Float32Array([ 0, 1, 1, 1, 1, 0, 0, 1 ]), 
        this.verticies = new b.Float32Array([ 0, 0, 100, 0, 100, 100, 0, 100 ]), this.colors = new b.Float32Array([ 1, 1, 1, 1 ]), 
        this.indices = new b.Uint16Array([ 0, 1, 2, 3 ]), this.dirty = !0;
    }, b.Strip.prototype = Object.create(b.DisplayObjectContainer.prototype), b.Strip.prototype.constructor = b.Strip, 
    b.Strip.prototype._renderWebGL = function(a) {
        !this.visible || this.alpha <= 0 || (a.spriteBatch.stop(), this._vertexBuffer || this._initWebGL(a), 
        a.shaderManager.setShader(a.shaderManager.stripShader), this._renderStrip(a), a.spriteBatch.start());
    }, b.Strip.prototype._initWebGL = function(a) {
        var b = a.gl;
        this._vertexBuffer = b.createBuffer(), this._indexBuffer = b.createBuffer(), this._uvBuffer = b.createBuffer(), 
        this._colorBuffer = b.createBuffer(), b.bindBuffer(b.ARRAY_BUFFER, this._vertexBuffer), 
        b.bufferData(b.ARRAY_BUFFER, this.verticies, b.DYNAMIC_DRAW), b.bindBuffer(b.ARRAY_BUFFER, this._uvBuffer), 
        b.bufferData(b.ARRAY_BUFFER, this.uvs, b.STATIC_DRAW), b.bindBuffer(b.ARRAY_BUFFER, this._colorBuffer), 
        b.bufferData(b.ARRAY_BUFFER, this.colors, b.STATIC_DRAW), b.bindBuffer(b.ELEMENT_ARRAY_BUFFER, this._indexBuffer), 
        b.bufferData(b.ELEMENT_ARRAY_BUFFER, this.indices, b.STATIC_DRAW);
    }, b.Strip.prototype._renderStrip = function(a) {
        var c = a.gl, d = a.projection, e = a.offset, f = a.shaderManager.stripShader;
        c.blendFunc(c.ONE, c.ONE_MINUS_SRC_ALPHA), c.uniformMatrix3fv(f.translationMatrix, !1, this.worldTransform.toArray(!0)), 
        c.uniform2f(f.projectionVector, d.x, -d.y), c.uniform2f(f.offsetVector, -e.x, -e.y), 
        c.uniform1f(f.alpha, 1), this.dirty ? (this.dirty = !1, c.bindBuffer(c.ARRAY_BUFFER, this._vertexBuffer), 
        c.bufferData(c.ARRAY_BUFFER, this.verticies, c.STATIC_DRAW), c.vertexAttribPointer(f.aVertexPosition, 2, c.FLOAT, !1, 0, 0), 
        c.bindBuffer(c.ARRAY_BUFFER, this._uvBuffer), c.bufferData(c.ARRAY_BUFFER, this.uvs, c.STATIC_DRAW), 
        c.vertexAttribPointer(f.aTextureCoord, 2, c.FLOAT, !1, 0, 0), c.activeTexture(c.TEXTURE0), 
        c.bindTexture(c.TEXTURE_2D, this.texture.baseTexture._glTextures[c.id] || b.createWebGLTexture(this.texture.baseTexture, c)), 
        c.bindBuffer(c.ELEMENT_ARRAY_BUFFER, this._indexBuffer), c.bufferData(c.ELEMENT_ARRAY_BUFFER, this.indices, c.STATIC_DRAW)) : (c.bindBuffer(c.ARRAY_BUFFER, this._vertexBuffer), 
        c.bufferSubData(c.ARRAY_BUFFER, 0, this.verticies), c.vertexAttribPointer(f.aVertexPosition, 2, c.FLOAT, !1, 0, 0), 
        c.bindBuffer(c.ARRAY_BUFFER, this._uvBuffer), c.vertexAttribPointer(f.aTextureCoord, 2, c.FLOAT, !1, 0, 0), 
        c.activeTexture(c.TEXTURE0), c.bindTexture(c.TEXTURE_2D, this.texture.baseTexture._glTextures[c.id] || b.createWebGLTexture(this.texture.baseTexture, c)), 
        c.bindBuffer(c.ELEMENT_ARRAY_BUFFER, this._indexBuffer)), c.drawElements(c.TRIANGLE_STRIP, this.indices.length, c.UNSIGNED_SHORT, 0);
    }, b.Strip.prototype._renderCanvas = function(a) {
        var b = a.context, c = this.worldTransform;
        a.roundPixels ? b.setTransform(c.a, c.c, c.b, c.d, 0 | c.tx, 0 | c.ty) : b.setTransform(c.a, c.c, c.b, c.d, c.tx, c.ty);
        var d = this, e = d.verticies, f = d.uvs, g = e.length / 2;
        this.count++;
        for (var h = 0; g - 2 > h; h++) {
            var i = 2 * h, j = e[i], k = e[i + 2], l = e[i + 4], m = e[i + 1], n = e[i + 3], o = e[i + 5], p = (j + k + l) / 3, q = (m + n + o) / 3, r = j - p, s = m - q, t = Math.sqrt(r * r + s * s);
            j = p + r / t * (t + 3), m = q + s / t * (t + 3), r = k - p, s = n - q, t = Math.sqrt(r * r + s * s), 
            k = p + r / t * (t + 3), n = q + s / t * (t + 3), r = l - p, s = o - q, t = Math.sqrt(r * r + s * s), 
            l = p + r / t * (t + 3), o = q + s / t * (t + 3);
            var u = f[i] * d.texture.width, v = f[i + 2] * d.texture.width, w = f[i + 4] * d.texture.width, x = f[i + 1] * d.texture.height, y = f[i + 3] * d.texture.height, z = f[i + 5] * d.texture.height;
            b.save(), b.beginPath(), b.moveTo(j, m), b.lineTo(k, n), b.lineTo(l, o), b.closePath(), 
            b.clip();
            var A = u * y + x * w + v * z - y * w - x * v - u * z, B = j * y + x * l + k * z - y * l - x * k - j * z, C = u * k + j * w + v * l - k * w - j * v - u * l, D = u * y * l + x * k * w + j * v * z - j * y * w - x * v * l - u * k * z, E = m * y + x * o + n * z - y * o - x * n - m * z, F = u * n + m * w + v * o - n * w - m * v - u * o, G = u * y * o + x * n * w + m * v * z - m * y * w - x * v * o - u * n * z;
            b.transform(B / A, E / A, C / A, F / A, D / A, G / A), b.drawImage(d.texture.baseTexture.source, 0, 0), 
            b.restore();
        }
    }, b.Strip.prototype.onTextureUpdate = function() {
        this.updateFrame = !0;
    }, b.Rope = function(a, c) {
        b.Strip.call(this, a), this.points = c, this.verticies = new b.Float32Array(4 * c.length), 
        this.uvs = new b.Float32Array(4 * c.length), this.colors = new b.Float32Array(2 * c.length), 
        this.indices = new b.Uint16Array(2 * c.length), this.refresh();
    }, b.Rope.prototype = Object.create(b.Strip.prototype), b.Rope.prototype.constructor = b.Rope, 
    b.Rope.prototype.refresh = function() {
        var a = this.points;
        if (!(a.length < 1)) {
            var b = this.uvs, c = a[0], d = this.indices, e = this.colors;
            this.count -= .2, b[0] = 0, b[1] = 0, b[2] = 0, b[3] = 1, e[0] = 1, e[1] = 1, d[0] = 0, 
            d[1] = 1;
            for (var f, g, h, i = a.length, j = 1; i > j; j++) f = a[j], g = 4 * j, h = j / (i - 1), 
            j % 2 ? (b[g] = h, b[g + 1] = 0, b[g + 2] = h, b[g + 3] = 1) : (b[g] = h, b[g + 1] = 0, 
            b[g + 2] = h, b[g + 3] = 1), g = 2 * j, e[g] = 1, e[g + 1] = 1, g = 2 * j, d[g] = g, 
            d[g + 1] = g + 1, c = f;
        }
    }, b.Rope.prototype.updateTransform = function() {
        var a = this.points;
        if (!(a.length < 1)) {
            var c, d = a[0], e = {
                x: 0,
                y: 0
            };
            this.count -= .2;
            for (var f, g, h, i, j, k = this.verticies, l = a.length, m = 0; l > m; m++) f = a[m], 
            g = 4 * m, c = m < a.length - 1 ? a[m + 1] : f, e.y = -(c.x - d.x), e.x = c.y - d.y, 
            h = 10 * (1 - m / (l - 1)), h > 1 && (h = 1), i = Math.sqrt(e.x * e.x + e.y * e.y), 
            j = this.texture.height / 2, e.x /= i, e.y /= i, e.x *= j, e.y *= j, k[g] = f.x + e.x, 
            k[g + 1] = f.y + e.y, k[g + 2] = f.x - e.x, k[g + 3] = f.y - e.y, d = f;
            b.DisplayObjectContainer.prototype.updateTransform.call(this);
        }
    }, b.Rope.prototype.setTexture = function(a) {
        this.texture = a;
    }, b.TilingSprite = function(a, c, d) {
        b.Sprite.call(this, a), this._width = c || 100, this._height = d || 100, this.tileScale = new b.Point(1, 1), 
        this.tileScaleOffset = new b.Point(1, 1), this.tilePosition = new b.Point(0, 0), 
        this.renderable = !0, this.tint = 16777215, this.blendMode = b.blendModes.NORMAL;
    }, b.TilingSprite.prototype = Object.create(b.Sprite.prototype), b.TilingSprite.prototype.constructor = b.TilingSprite, 
    Object.defineProperty(b.TilingSprite.prototype, "width", {
        get: function() {
            return this._width;
        },
        set: function(a) {
            this._width = a;
        }
    }), Object.defineProperty(b.TilingSprite.prototype, "height", {
        get: function() {
            return this._height;
        },
        set: function(a) {
            this._height = a;
        }
    }), b.TilingSprite.prototype.setTexture = function(a) {
        this.texture !== a && (this.texture = a, this.refreshTexture = !0, this.cachedTint = 16777215);
    }, b.TilingSprite.prototype._renderWebGL = function(a) {
        if (this.visible !== !1 && 0 !== this.alpha) {
            var c, d;
            for (this._mask && (a.spriteBatch.stop(), a.maskManager.pushMask(this.mask, a), 
            a.spriteBatch.start()), this._filters && (a.spriteBatch.flush(), a.filterManager.pushFilter(this._filterBlock)), 
            !this.tilingTexture || this.refreshTexture ? (this.generateTilingTexture(!0), this.tilingTexture && this.tilingTexture.needsUpdate && (b.updateWebGLTexture(this.tilingTexture.baseTexture, a.gl), 
            this.tilingTexture.needsUpdate = !1)) : a.spriteBatch.renderTilingSprite(this), 
            c = 0, d = this.children.length; d > c; c++) this.children[c]._renderWebGL(a);
            a.spriteBatch.stop(), this._filters && a.filterManager.popFilter(), this._mask && a.maskManager.popMask(a), 
            a.spriteBatch.start();
        }
    }, b.TilingSprite.prototype._renderCanvas = function(a) {
        if (this.visible !== !1 && 0 !== this.alpha) {
            var c = a.context;
            this._mask && a.maskManager.pushMask(this._mask, c), c.globalAlpha = this.worldAlpha;
            var d, e, f = this.worldTransform;
            if (c.setTransform(f.a, f.c, f.b, f.d, f.tx, f.ty), !this.__tilePattern || this.refreshTexture) {
                if (this.generateTilingTexture(!1), !this.tilingTexture) return;
                this.__tilePattern = c.createPattern(this.tilingTexture.baseTexture.source, "repeat");
            }
            this.blendMode !== a.currentBlendMode && (a.currentBlendMode = this.blendMode, c.globalCompositeOperation = b.blendModesCanvas[a.currentBlendMode]);
            var g = this.tilePosition, h = this.tileScale;
            for (g.x %= this.tilingTexture.baseTexture.width, g.y %= this.tilingTexture.baseTexture.height, 
            c.scale(h.x, h.y), c.translate(g.x, g.y), c.fillStyle = this.__tilePattern, c.fillRect(-g.x + this.anchor.x * -this._width, -g.y + this.anchor.y * -this._height, this._width / h.x, this._height / h.y), 
            c.scale(1 / h.x, 1 / h.y), c.translate(-g.x, -g.y), this._mask && a.maskManager.popMask(a.context), 
            d = 0, e = this.children.length; e > d; d++) this.children[d]._renderCanvas(a);
        }
    }, b.TilingSprite.prototype.getBounds = function() {
        var a = this._width, b = this._height, c = a * (1 - this.anchor.x), d = a * -this.anchor.x, e = b * (1 - this.anchor.y), f = b * -this.anchor.y, g = this.worldTransform, h = g.a, i = g.c, j = g.b, k = g.d, l = g.tx, m = g.ty, n = h * d + j * f + l, o = k * f + i * d + m, p = h * c + j * f + l, q = k * f + i * c + m, r = h * c + j * e + l, s = k * e + i * c + m, t = h * d + j * e + l, u = k * e + i * d + m, v = -1 / 0, w = -1 / 0, x = 1 / 0, y = 1 / 0;
        x = x > n ? n : x, x = x > p ? p : x, x = x > r ? r : x, x = x > t ? t : x, y = y > o ? o : y, 
        y = y > q ? q : y, y = y > s ? s : y, y = y > u ? u : y, v = n > v ? n : v, v = p > v ? p : v, 
        v = r > v ? r : v, v = t > v ? t : v, w = o > w ? o : w, w = q > w ? q : w, w = s > w ? s : w, 
        w = u > w ? u : w;
        var z = this._bounds;
        return z.x = x, z.width = v - x, z.y = y, z.height = w - y, this._currentBounds = z, 
        z;
    }, b.TilingSprite.prototype.onTextureUpdate = function() {}, b.TilingSprite.prototype.generateTilingTexture = function(a) {
        if (this.texture.baseTexture.hasLoaded) {
            var c, d, e = this.texture, f = e.frame, g = f.width !== e.baseTexture.width || f.height !== e.baseTexture.height, h = !1;
            if (a ? (c = b.getNextPowerOfTwo(f.width), d = b.getNextPowerOfTwo(f.height), (f.width !== c || f.height !== d) && (h = !0)) : g && (c = f.width, 
            d = f.height, h = !0), h) {
                var i;
                this.tilingTexture && this.tilingTexture.isTiling ? (i = this.tilingTexture.canvasBuffer, 
                i.resize(c, d), this.tilingTexture.baseTexture.width = c, this.tilingTexture.baseTexture.height = d, 
                this.tilingTexture.needsUpdate = !0) : (i = new b.CanvasBuffer(c, d), this.tilingTexture = b.Texture.fromCanvas(i.canvas), 
                this.tilingTexture.canvasBuffer = i, this.tilingTexture.isTiling = !0), i.context.drawImage(e.baseTexture.source, e.crop.x, e.crop.y, e.crop.width, e.crop.height, 0, 0, c, d), 
                this.tileScaleOffset.x = f.width / c, this.tileScaleOffset.y = f.height / d;
            } else this.tilingTexture && this.tilingTexture.isTiling && this.tilingTexture.destroy(!0), 
            this.tileScaleOffset.x = 1, this.tileScaleOffset.y = 1, this.tilingTexture = e;
            this.refreshTexture = !1, this.tilingTexture.baseTexture._powerOf2 = !0;
        }
    };
    var f = {};
    f.BoneData = function(a, b) {
        this.name = a, this.parent = b;
    }, f.BoneData.prototype = {
        length: 0,
        x: 0,
        y: 0,
        rotation: 0,
        scaleX: 1,
        scaleY: 1
    }, f.SlotData = function(a, b) {
        this.name = a, this.boneData = b;
    }, f.SlotData.prototype = {
        r: 1,
        g: 1,
        b: 1,
        a: 1,
        attachmentName: null
    }, f.Bone = function(a, b) {
        this.data = a, this.parent = b, this.setToSetupPose();
    }, f.Bone.yDown = !1, f.Bone.prototype = {
        x: 0,
        y: 0,
        rotation: 0,
        scaleX: 1,
        scaleY: 1,
        m00: 0,
        m01: 0,
        worldX: 0,
        m10: 0,
        m11: 0,
        worldY: 0,
        worldRotation: 0,
        worldScaleX: 1,
        worldScaleY: 1,
        updateWorldTransform: function(a, b) {
            var c = this.parent;
            null != c ? (this.worldX = this.x * c.m00 + this.y * c.m01 + c.worldX, this.worldY = this.x * c.m10 + this.y * c.m11 + c.worldY, 
            this.worldScaleX = c.worldScaleX * this.scaleX, this.worldScaleY = c.worldScaleY * this.scaleY, 
            this.worldRotation = c.worldRotation + this.rotation) : (this.worldX = this.x, this.worldY = this.y, 
            this.worldScaleX = this.scaleX, this.worldScaleY = this.scaleY, this.worldRotation = this.rotation);
            var d = this.worldRotation * Math.PI / 180, e = Math.cos(d), g = Math.sin(d);
            this.m00 = e * this.worldScaleX, this.m10 = g * this.worldScaleX, this.m01 = -g * this.worldScaleY, 
            this.m11 = e * this.worldScaleY, a && (this.m00 = -this.m00, this.m01 = -this.m01), 
            b && (this.m10 = -this.m10, this.m11 = -this.m11), f.Bone.yDown && (this.m10 = -this.m10, 
            this.m11 = -this.m11);
        },
        setToSetupPose: function() {
            var a = this.data;
            this.x = a.x, this.y = a.y, this.rotation = a.rotation, this.scaleX = a.scaleX, 
            this.scaleY = a.scaleY;
        }
    }, f.Slot = function(a, b, c) {
        this.data = a, this.skeleton = b, this.bone = c, this.setToSetupPose();
    }, f.Slot.prototype = {
        r: 1,
        g: 1,
        b: 1,
        a: 1,
        _attachmentTime: 0,
        attachment: null,
        setAttachment: function(a) {
            this.attachment = a, this._attachmentTime = this.skeleton.time;
        },
        setAttachmentTime: function(a) {
            this._attachmentTime = this.skeleton.time - a;
        },
        getAttachmentTime: function() {
            return this.skeleton.time - this._attachmentTime;
        },
        setToSetupPose: function() {
            var a = this.data;
            this.r = a.r, this.g = a.g, this.b = a.b, this.a = a.a;
            for (var b = this.skeleton.data.slots, c = 0, d = b.length; d > c; c++) if (b[c] == a) {
                this.setAttachment(a.attachmentName ? this.skeleton.getAttachmentBySlotIndex(c, a.attachmentName) : null);
                break;
            }
        }
    }, f.Skin = function(a) {
        this.name = a, this.attachments = {};
    }, f.Skin.prototype = {
        addAttachment: function(a, b, c) {
            this.attachments[a + ":" + b] = c;
        },
        getAttachment: function(a, b) {
            return this.attachments[a + ":" + b];
        },
        _attachAll: function(a, b) {
            for (var c in b.attachments) {
                var d = c.indexOf(":"), e = parseInt(c.substring(0, d), 10), f = c.substring(d + 1), g = a.slots[e];
                if (g.attachment && g.attachment.name == f) {
                    var h = this.getAttachment(e, f);
                    h && g.setAttachment(h);
                }
            }
        }
    }, f.Animation = function(a, b, c) {
        this.name = a, this.timelines = b, this.duration = c;
    }, f.Animation.prototype = {
        apply: function(a, b, c) {
            c && this.duration && (b %= this.duration);
            for (var d = this.timelines, e = 0, f = d.length; f > e; e++) d[e].apply(a, b, 1);
        },
        mix: function(a, b, c, d) {
            c && this.duration && (b %= this.duration);
            for (var e = this.timelines, f = 0, g = e.length; g > f; f++) e[f].apply(a, b, d);
        }
    }, f.binarySearch = function(a, b, c) {
        var d = 0, e = Math.floor(a.length / c) - 2;
        if (!e) return c;
        for (var f = e >>> 1; ;) {
            if (a[(f + 1) * c] <= b ? d = f + 1 : e = f, d == e) return (d + 1) * c;
            f = d + e >>> 1;
        }
    }, f.linearSearch = function(a, b, c) {
        for (var d = 0, e = a.length - c; e >= d; d += c) if (a[d] > b) return d;
        return -1;
    }, f.Curves = function(a) {
        this.curves = [], this.curves.length = 6 * (a - 1);
    }, f.Curves.prototype = {
        setLinear: function(a) {
            this.curves[6 * a] = 0;
        },
        setStepped: function(a) {
            this.curves[6 * a] = -1;
        },
        setCurve: function(a, b, c, d, e) {
            var f = .1, g = f * f, h = g * f, i = 3 * f, j = 3 * g, k = 6 * g, l = 6 * h, m = 2 * -b + d, n = 2 * -c + e, o = 3 * (b - d) + 1, p = 3 * (c - e) + 1, q = 6 * a, r = this.curves;
            r[q] = b * i + m * j + o * h, r[q + 1] = c * i + n * j + p * h, r[q + 2] = m * k + o * l, 
            r[q + 3] = n * k + p * l, r[q + 4] = o * l, r[q + 5] = p * l;
        },
        getCurvePercent: function(a, b) {
            b = 0 > b ? 0 : b > 1 ? 1 : b;
            var c = 6 * a, d = this.curves, e = d[c];
            if (!e) return b;
            if (-1 == e) return 0;
            for (var f = d[c + 1], g = d[c + 2], h = d[c + 3], i = d[c + 4], j = d[c + 5], k = e, l = f, m = 8; ;) {
                if (k >= b) {
                    var n = k - e, o = l - f;
                    return o + (l - o) * (b - n) / (k - n);
                }
                if (!m) break;
                m--, e += g, f += h, g += i, h += j, k += e, l += f;
            }
            return l + (1 - l) * (b - k) / (1 - k);
        }
    }, f.RotateTimeline = function(a) {
        this.curves = new f.Curves(a), this.frames = [], this.frames.length = 2 * a;
    }, f.RotateTimeline.prototype = {
        boneIndex: 0,
        getFrameCount: function() {
            return this.frames.length / 2;
        },
        setFrame: function(a, b, c) {
            a *= 2, this.frames[a] = b, this.frames[a + 1] = c;
        },
        apply: function(a, b, c) {
            var d, e = this.frames;
            if (!(b < e[0])) {
                var g = a.bones[this.boneIndex];
                if (b >= e[e.length - 2]) {
                    for (d = g.data.rotation + e[e.length - 1] - g.rotation; d > 180; ) d -= 360;
                    for (;-180 > d; ) d += 360;
                    return void (g.rotation += d * c);
                }
                var h = f.binarySearch(e, b, 2), i = e[h - 1], j = e[h], k = 1 - (b - j) / (e[h - 2] - j);
                for (k = this.curves.getCurvePercent(h / 2 - 1, k), d = e[h + 1] - i; d > 180; ) d -= 360;
                for (;-180 > d; ) d += 360;
                for (d = g.data.rotation + (i + d * k) - g.rotation; d > 180; ) d -= 360;
                for (;-180 > d; ) d += 360;
                g.rotation += d * c;
            }
        }
    }, f.TranslateTimeline = function(a) {
        this.curves = new f.Curves(a), this.frames = [], this.frames.length = 3 * a;
    }, f.TranslateTimeline.prototype = {
        boneIndex: 0,
        getFrameCount: function() {
            return this.frames.length / 3;
        },
        setFrame: function(a, b, c, d) {
            a *= 3, this.frames[a] = b, this.frames[a + 1] = c, this.frames[a + 2] = d;
        },
        apply: function(a, b, c) {
            var d = this.frames;
            if (!(b < d[0])) {
                var e = a.bones[this.boneIndex];
                if (b >= d[d.length - 3]) return e.x += (e.data.x + d[d.length - 2] - e.x) * c, 
                void (e.y += (e.data.y + d[d.length - 1] - e.y) * c);
                var g = f.binarySearch(d, b, 3), h = d[g - 2], i = d[g - 1], j = d[g], k = 1 - (b - j) / (d[g + -3] - j);
                k = this.curves.getCurvePercent(g / 3 - 1, k), e.x += (e.data.x + h + (d[g + 1] - h) * k - e.x) * c, 
                e.y += (e.data.y + i + (d[g + 2] - i) * k - e.y) * c;
            }
        }
    }, f.ScaleTimeline = function(a) {
        this.curves = new f.Curves(a), this.frames = [], this.frames.length = 3 * a;
    }, f.ScaleTimeline.prototype = {
        boneIndex: 0,
        getFrameCount: function() {
            return this.frames.length / 3;
        },
        setFrame: function(a, b, c, d) {
            a *= 3, this.frames[a] = b, this.frames[a + 1] = c, this.frames[a + 2] = d;
        },
        apply: function(a, b, c) {
            var d = this.frames;
            if (!(b < d[0])) {
                var e = a.bones[this.boneIndex];
                if (b >= d[d.length - 3]) return e.scaleX += (e.data.scaleX - 1 + d[d.length - 2] - e.scaleX) * c, 
                void (e.scaleY += (e.data.scaleY - 1 + d[d.length - 1] - e.scaleY) * c);
                var g = f.binarySearch(d, b, 3), h = d[g - 2], i = d[g - 1], j = d[g], k = 1 - (b - j) / (d[g + -3] - j);
                k = this.curves.getCurvePercent(g / 3 - 1, k), e.scaleX += (e.data.scaleX - 1 + h + (d[g + 1] - h) * k - e.scaleX) * c, 
                e.scaleY += (e.data.scaleY - 1 + i + (d[g + 2] - i) * k - e.scaleY) * c;
            }
        }
    }, f.ColorTimeline = function(a) {
        this.curves = new f.Curves(a), this.frames = [], this.frames.length = 5 * a;
    }, f.ColorTimeline.prototype = {
        slotIndex: 0,
        getFrameCount: function() {
            return this.frames.length / 5;
        },
        setFrame: function(a, b, c, d, e, f) {
            a *= 5, this.frames[a] = b, this.frames[a + 1] = c, this.frames[a + 2] = d, this.frames[a + 3] = e, 
            this.frames[a + 4] = f;
        },
        apply: function(a, b, c) {
            var d = this.frames;
            if (!(b < d[0])) {
                var e = a.slots[this.slotIndex];
                if (b >= d[d.length - 5]) {
                    var g = d.length - 1;
                    return e.r = d[g - 3], e.g = d[g - 2], e.b = d[g - 1], void (e.a = d[g]);
                }
                var h = f.binarySearch(d, b, 5), i = d[h - 4], j = d[h - 3], k = d[h - 2], l = d[h - 1], m = d[h], n = 1 - (b - m) / (d[h - 5] - m);
                n = this.curves.getCurvePercent(h / 5 - 1, n);
                var o = i + (d[h + 1] - i) * n, p = j + (d[h + 2] - j) * n, q = k + (d[h + 3] - k) * n, r = l + (d[h + 4] - l) * n;
                1 > c ? (e.r += (o - e.r) * c, e.g += (p - e.g) * c, e.b += (q - e.b) * c, e.a += (r - e.a) * c) : (e.r = o, 
                e.g = p, e.b = q, e.a = r);
            }
        }
    }, f.AttachmentTimeline = function(a) {
        this.curves = new f.Curves(a), this.frames = [], this.frames.length = a, this.attachmentNames = [], 
        this.attachmentNames.length = a;
    }, f.AttachmentTimeline.prototype = {
        slotIndex: 0,
        getFrameCount: function() {
            return this.frames.length;
        },
        setFrame: function(a, b, c) {
            this.frames[a] = b, this.attachmentNames[a] = c;
        },
        apply: function(a, b) {
            var c = this.frames;
            if (!(b < c[0])) {
                var d;
                d = b >= c[c.length - 1] ? c.length - 1 : f.binarySearch(c, b, 1) - 1;
                var e = this.attachmentNames[d];
                a.slots[this.slotIndex].setAttachment(e ? a.getAttachmentBySlotIndex(this.slotIndex, e) : null);
            }
        }
    }, f.SkeletonData = function() {
        this.bones = [], this.slots = [], this.skins = [], this.animations = [];
    }, f.SkeletonData.prototype = {
        defaultSkin: null,
        findBone: function(a) {
            for (var b = this.bones, c = 0, d = b.length; d > c; c++) if (b[c].name == a) return b[c];
            return null;
        },
        findBoneIndex: function(a) {
            for (var b = this.bones, c = 0, d = b.length; d > c; c++) if (b[c].name == a) return c;
            return -1;
        },
        findSlot: function(a) {
            for (var b = this.slots, c = 0, d = b.length; d > c; c++) if (b[c].name == a) return slot[c];
            return null;
        },
        findSlotIndex: function(a) {
            for (var b = this.slots, c = 0, d = b.length; d > c; c++) if (b[c].name == a) return c;
            return -1;
        },
        findSkin: function(a) {
            for (var b = this.skins, c = 0, d = b.length; d > c; c++) if (b[c].name == a) return b[c];
            return null;
        },
        findAnimation: function(a) {
            for (var b = this.animations, c = 0, d = b.length; d > c; c++) if (b[c].name == a) return b[c];
            return null;
        }
    }, f.Skeleton = function(a) {
        this.data = a, this.bones = [];
        for (var b = 0, c = a.bones.length; c > b; b++) {
            var d = a.bones[b], e = d.parent ? this.bones[a.bones.indexOf(d.parent)] : null;
            this.bones.push(new f.Bone(d, e));
        }
        for (this.slots = [], this.drawOrder = [], b = 0, c = a.slots.length; c > b; b++) {
            var g = a.slots[b], h = this.bones[a.bones.indexOf(g.boneData)], i = new f.Slot(g, this, h);
            this.slots.push(i), this.drawOrder.push(i);
        }
    }, f.Skeleton.prototype = {
        x: 0,
        y: 0,
        skin: null,
        r: 1,
        g: 1,
        b: 1,
        a: 1,
        time: 0,
        flipX: !1,
        flipY: !1,
        updateWorldTransform: function() {
            for (var a = this.flipX, b = this.flipY, c = this.bones, d = 0, e = c.length; e > d; d++) c[d].updateWorldTransform(a, b);
        },
        setToSetupPose: function() {
            this.setBonesToSetupPose(), this.setSlotsToSetupPose();
        },
        setBonesToSetupPose: function() {
            for (var a = this.bones, b = 0, c = a.length; c > b; b++) a[b].setToSetupPose();
        },
        setSlotsToSetupPose: function() {
            for (var a = this.slots, b = 0, c = a.length; c > b; b++) a[b].setToSetupPose(b);
        },
        getRootBone: function() {
            return this.bones.length ? this.bones[0] : null;
        },
        findBone: function(a) {
            for (var b = this.bones, c = 0, d = b.length; d > c; c++) if (b[c].data.name == a) return b[c];
            return null;
        },
        findBoneIndex: function(a) {
            for (var b = this.bones, c = 0, d = b.length; d > c; c++) if (b[c].data.name == a) return c;
            return -1;
        },
        findSlot: function(a) {
            for (var b = this.slots, c = 0, d = b.length; d > c; c++) if (b[c].data.name == a) return b[c];
            return null;
        },
        findSlotIndex: function(a) {
            for (var b = this.slots, c = 0, d = b.length; d > c; c++) if (b[c].data.name == a) return c;
            return -1;
        },
        setSkinByName: function(a) {
            var b = this.data.findSkin(a);
            if (!b) throw "Skin not found: " + a;
            this.setSkin(b);
        },
        setSkin: function(a) {
            this.skin && a && a._attachAll(this, this.skin), this.skin = a;
        },
        getAttachmentBySlotName: function(a, b) {
            return this.getAttachmentBySlotIndex(this.data.findSlotIndex(a), b);
        },
        getAttachmentBySlotIndex: function(a, b) {
            if (this.skin) {
                var c = this.skin.getAttachment(a, b);
                if (c) return c;
            }
            return this.data.defaultSkin ? this.data.defaultSkin.getAttachment(a, b) : null;
        },
        setAttachment: function(a, b) {
            for (var c = this.slots, d = 0, e = c.size; e > d; d++) {
                var f = c[d];
                if (f.data.name == a) {
                    var g = null;
                    if (b && (g = this.getAttachment(d, b), null == g)) throw "Attachment not found: " + b + ", for slot: " + a;
                    return void f.setAttachment(g);
                }
            }
            throw "Slot not found: " + a;
        },
        update: function(a) {
            time += a;
        }
    }, f.AttachmentType = {
        region: 0
    }, f.RegionAttachment = function() {
        this.offset = [], this.offset.length = 8, this.uvs = [], this.uvs.length = 8;
    }, f.RegionAttachment.prototype = {
        x: 0,
        y: 0,
        rotation: 0,
        scaleX: 1,
        scaleY: 1,
        width: 0,
        height: 0,
        rendererObject: null,
        regionOffsetX: 0,
        regionOffsetY: 0,
        regionWidth: 0,
        regionHeight: 0,
        regionOriginalWidth: 0,
        regionOriginalHeight: 0,
        setUVs: function(a, b, c, d, e) {
            var f = this.uvs;
            e ? (f[2] = a, f[3] = d, f[4] = a, f[5] = b, f[6] = c, f[7] = b, f[0] = c, f[1] = d) : (f[0] = a, 
            f[1] = d, f[2] = a, f[3] = b, f[4] = c, f[5] = b, f[6] = c, f[7] = d);
        },
        updateOffset: function() {
            var a = this.width / this.regionOriginalWidth * this.scaleX, b = this.height / this.regionOriginalHeight * this.scaleY, c = -this.width / 2 * this.scaleX + this.regionOffsetX * a, d = -this.height / 2 * this.scaleY + this.regionOffsetY * b, e = c + this.regionWidth * a, f = d + this.regionHeight * b, g = this.rotation * Math.PI / 180, h = Math.cos(g), i = Math.sin(g), j = c * h + this.x, k = c * i, l = d * h + this.y, m = d * i, n = e * h + this.x, o = e * i, p = f * h + this.y, q = f * i, r = this.offset;
            r[0] = j - m, r[1] = l + k, r[2] = j - q, r[3] = p + k, r[4] = n - q, r[5] = p + o, 
            r[6] = n - m, r[7] = l + o;
        },
        computeVertices: function(a, b, c, d) {
            a += c.worldX, b += c.worldY;
            var e = c.m00, f = c.m01, g = c.m10, h = c.m11, i = this.offset;
            d[0] = i[0] * e + i[1] * f + a, d[1] = i[0] * g + i[1] * h + b, d[2] = i[2] * e + i[3] * f + a, 
            d[3] = i[2] * g + i[3] * h + b, d[4] = i[4] * e + i[5] * f + a, d[5] = i[4] * g + i[5] * h + b, 
            d[6] = i[6] * e + i[7] * f + a, d[7] = i[6] * g + i[7] * h + b;
        }
    }, f.AnimationStateData = function(a) {
        this.skeletonData = a, this.animationToMixTime = {};
    }, f.AnimationStateData.prototype = {
        defaultMix: 0,
        setMixByName: function(a, b, c) {
            var d = this.skeletonData.findAnimation(a);
            if (!d) throw "Animation not found: " + a;
            var e = this.skeletonData.findAnimation(b);
            if (!e) throw "Animation not found: " + b;
            this.setMix(d, e, c);
        },
        setMix: function(a, b, c) {
            this.animationToMixTime[a.name + ":" + b.name] = c;
        },
        getMix: function(a, b) {
            var c = this.animationToMixTime[a.name + ":" + b.name];
            return c ? c : this.defaultMix;
        }
    }, f.AnimationState = function(a) {
        this.data = a, this.queue = [];
    }, f.AnimationState.prototype = {
        animationSpeed: 1,
        current: null,
        previous: null,
        currentTime: 0,
        previousTime: 0,
        currentLoop: !1,
        previousLoop: !1,
        mixTime: 0,
        mixDuration: 0,
        update: function(a) {
            if (this.currentTime += a * this.animationSpeed, this.previousTime += a, this.mixTime += a, 
            this.queue.length > 0) {
                var b = this.queue[0];
                this.currentTime >= b.delay && (this._setAnimation(b.animation, b.loop), this.queue.shift());
            }
        },
        apply: function(a) {
            if (this.current) if (this.previous) {
                this.previous.apply(a, this.previousTime, this.previousLoop);
                var b = this.mixTime / this.mixDuration;
                b >= 1 && (b = 1, this.previous = null), this.current.mix(a, this.currentTime, this.currentLoop, b);
            } else this.current.apply(a, this.currentTime, this.currentLoop);
        },
        clearAnimation: function() {
            this.previous = null, this.current = null, this.queue.length = 0;
        },
        _setAnimation: function(a, b) {
            this.previous = null, a && this.current && (this.mixDuration = this.data.getMix(this.current, a), 
            this.mixDuration > 0 && (this.mixTime = 0, this.previous = this.current, this.previousTime = this.currentTime, 
            this.previousLoop = this.currentLoop)), this.current = a, this.currentLoop = b, 
            this.currentTime = 0;
        },
        setAnimationByName: function(a, b) {
            var c = this.data.skeletonData.findAnimation(a);
            if (!c) throw "Animation not found: " + a;
            this.setAnimation(c, b);
        },
        setAnimation: function(a, b) {
            this.queue.length = 0, this._setAnimation(a, b);
        },
        addAnimationByName: function(a, b, c) {
            var d = this.data.skeletonData.findAnimation(a);
            if (!d) throw "Animation not found: " + a;
            this.addAnimation(d, b, c);
        },
        addAnimation: function(a, b, c) {
            var d = {};
            if (d.animation = a, d.loop = b, !c || 0 >= c) {
                var e = this.queue.length ? this.queue[this.queue.length - 1].animation : this.current;
                c = null != e ? e.duration - this.data.getMix(e, a) + (c || 0) : 0;
            }
            d.delay = c, this.queue.push(d);
        },
        isComplete: function() {
            return !this.current || this.currentTime >= this.current.duration;
        }
    }, f.SkeletonJson = function(a) {
        this.attachmentLoader = a;
    }, f.SkeletonJson.prototype = {
        scale: 1,
        readSkeletonData: function(a) {
            for (var b, c = new f.SkeletonData(), d = a.bones, e = 0, g = d.length; g > e; e++) {
                var h = d[e], i = null;
                if (h.parent && (i = c.findBone(h.parent), !i)) throw "Parent bone not found: " + h.parent;
                b = new f.BoneData(h.name, i), b.length = (h.length || 0) * this.scale, b.x = (h.x || 0) * this.scale, 
                b.y = (h.y || 0) * this.scale, b.rotation = h.rotation || 0, b.scaleX = h.scaleX || 1, 
                b.scaleY = h.scaleY || 1, c.bones.push(b);
            }
            var j = a.slots;
            for (e = 0, g = j.length; g > e; e++) {
                var k = j[e];
                if (b = c.findBone(k.bone), !b) throw "Slot bone not found: " + k.bone;
                var l = new f.SlotData(k.name, b), m = k.color;
                m && (l.r = f.SkeletonJson.toColor(m, 0), l.g = f.SkeletonJson.toColor(m, 1), l.b = f.SkeletonJson.toColor(m, 2), 
                l.a = f.SkeletonJson.toColor(m, 3)), l.attachmentName = k.attachment, c.slots.push(l);
            }
            var n = a.skins;
            for (var o in n) if (n.hasOwnProperty(o)) {
                var p = n[o], q = new f.Skin(o);
                for (var r in p) if (p.hasOwnProperty(r)) {
                    var s = c.findSlotIndex(r), t = p[r];
                    for (var u in t) if (t.hasOwnProperty(u)) {
                        var v = this.readAttachment(q, u, t[u]);
                        null != v && q.addAttachment(s, u, v);
                    }
                }
                c.skins.push(q), "default" == q.name && (c.defaultSkin = q);
            }
            var w = a.animations;
            for (var x in w) w.hasOwnProperty(x) && this.readAnimation(x, w[x], c);
            return c;
        },
        readAttachment: function(a, b, c) {
            b = c.name || b;
            var d = f.AttachmentType[c.type || "region"];
            if (d == f.AttachmentType.region) {
                var e = new f.RegionAttachment();
                return e.x = (c.x || 0) * this.scale, e.y = (c.y || 0) * this.scale, e.scaleX = c.scaleX || 1, 
                e.scaleY = c.scaleY || 1, e.rotation = c.rotation || 0, e.width = (c.width || 32) * this.scale, 
                e.height = (c.height || 32) * this.scale, e.updateOffset(), e.rendererObject = {}, 
                e.rendererObject.name = b, e.rendererObject.scale = {}, e.rendererObject.scale.x = e.scaleX, 
                e.rendererObject.scale.y = e.scaleY, e.rendererObject.rotation = -e.rotation * Math.PI / 180, 
                e;
            }
            throw "Unknown attachment type: " + d;
        },
        readAnimation: function(a, b, c) {
            var d, e, g, h, i, j, k, l = [], m = 0, n = b.bones;
            for (var o in n) if (n.hasOwnProperty(o)) {
                var p = c.findBoneIndex(o);
                if (-1 == p) throw "Bone not found: " + o;
                var q = n[o];
                for (g in q) if (q.hasOwnProperty(g)) if (i = q[g], "rotate" == g) {
                    for (e = new f.RotateTimeline(i.length), e.boneIndex = p, d = 0, j = 0, k = i.length; k > j; j++) h = i[j], 
                    e.setFrame(d, h.time, h.angle), f.SkeletonJson.readCurve(e, d, h), d++;
                    l.push(e), m = Math.max(m, e.frames[2 * e.getFrameCount() - 2]);
                } else {
                    if ("translate" != g && "scale" != g) throw "Invalid timeline type for a bone: " + g + " (" + o + ")";
                    var r = 1;
                    for ("scale" == g ? e = new f.ScaleTimeline(i.length) : (e = new f.TranslateTimeline(i.length), 
                    r = this.scale), e.boneIndex = p, d = 0, j = 0, k = i.length; k > j; j++) {
                        h = i[j];
                        var s = (h.x || 0) * r, t = (h.y || 0) * r;
                        e.setFrame(d, h.time, s, t), f.SkeletonJson.readCurve(e, d, h), d++;
                    }
                    l.push(e), m = Math.max(m, e.frames[3 * e.getFrameCount() - 3]);
                }
            }
            var u = b.slots;
            for (var v in u) if (u.hasOwnProperty(v)) {
                var w = u[v], x = c.findSlotIndex(v);
                for (g in w) if (w.hasOwnProperty(g)) if (i = w[g], "color" == g) {
                    for (e = new f.ColorTimeline(i.length), e.slotIndex = x, d = 0, j = 0, k = i.length; k > j; j++) {
                        h = i[j];
                        var y = h.color, z = f.SkeletonJson.toColor(y, 0), A = f.SkeletonJson.toColor(y, 1), B = f.SkeletonJson.toColor(y, 2), C = f.SkeletonJson.toColor(y, 3);
                        e.setFrame(d, h.time, z, A, B, C), f.SkeletonJson.readCurve(e, d, h), d++;
                    }
                    l.push(e), m = Math.max(m, e.frames[5 * e.getFrameCount() - 5]);
                } else {
                    if ("attachment" != g) throw "Invalid timeline type for a slot: " + g + " (" + v + ")";
                    for (e = new f.AttachmentTimeline(i.length), e.slotIndex = x, d = 0, j = 0, k = i.length; k > j; j++) h = i[j], 
                    e.setFrame(d++, h.time, h.name);
                    l.push(e), m = Math.max(m, e.frames[e.getFrameCount() - 1]);
                }
            }
            c.animations.push(new f.Animation(a, l, m));
        }
    }, f.SkeletonJson.readCurve = function(a, b, c) {
        var d = c.curve;
        d && ("stepped" == d ? a.curves.setStepped(b) : d instanceof Array && a.curves.setCurve(b, d[0], d[1], d[2], d[3]));
    }, f.SkeletonJson.toColor = function(a, b) {
        if (8 != a.length) throw "Color hexidecimal length must be 8, recieved: " + a;
        return parseInt(a.substr(2 * b, 2), 16) / 255;
    }, f.Atlas = function(a, b) {
        this.textureLoader = b, this.pages = [], this.regions = [];
        var c = new f.AtlasReader(a), d = [];
        d.length = 4;
        for (var e = null; ;) {
            var g = c.readLine();
            if (null == g) break;
            if (g = c.trim(g), g.length) if (e) {
                var h = new f.AtlasRegion();
                h.name = g, h.page = e, h.rotate = "true" == c.readValue(), c.readTuple(d);
                var i = parseInt(d[0], 10), j = parseInt(d[1], 10);
                c.readTuple(d);
                var k = parseInt(d[0], 10), l = parseInt(d[1], 10);
                h.u = i / e.width, h.v = j / e.height, h.rotate ? (h.u2 = (i + l) / e.width, h.v2 = (j + k) / e.height) : (h.u2 = (i + k) / e.width, 
                h.v2 = (j + l) / e.height), h.x = i, h.y = j, h.width = Math.abs(k), h.height = Math.abs(l), 
                4 == c.readTuple(d) && (h.splits = [ parseInt(d[0], 10), parseInt(d[1], 10), parseInt(d[2], 10), parseInt(d[3], 10) ], 
                4 == c.readTuple(d) && (h.pads = [ parseInt(d[0], 10), parseInt(d[1], 10), parseInt(d[2], 10), parseInt(d[3], 10) ], 
                c.readTuple(d))), h.originalWidth = parseInt(d[0], 10), h.originalHeight = parseInt(d[1], 10), 
                c.readTuple(d), h.offsetX = parseInt(d[0], 10), h.offsetY = parseInt(d[1], 10), 
                h.index = parseInt(c.readValue(), 10), this.regions.push(h);
            } else {
                e = new f.AtlasPage(), e.name = g, e.format = f.Atlas.Format[c.readValue()], c.readTuple(d), 
                e.minFilter = f.Atlas.TextureFilter[d[0]], e.magFilter = f.Atlas.TextureFilter[d[1]];
                var m = c.readValue();
                e.uWrap = f.Atlas.TextureWrap.clampToEdge, e.vWrap = f.Atlas.TextureWrap.clampToEdge, 
                "x" == m ? e.uWrap = f.Atlas.TextureWrap.repeat : "y" == m ? e.vWrap = f.Atlas.TextureWrap.repeat : "xy" == m && (e.uWrap = e.vWrap = f.Atlas.TextureWrap.repeat), 
                b.load(e, g), this.pages.push(e);
            } else e = null;
        }
    }, f.Atlas.prototype = {
        findRegion: function(a) {
            for (var b = this.regions, c = 0, d = b.length; d > c; c++) if (b[c].name == a) return b[c];
            return null;
        },
        dispose: function() {
            for (var a = this.pages, b = 0, c = a.length; c > b; b++) this.textureLoader.unload(a[b].rendererObject);
        },
        updateUVs: function(a) {
            for (var b = this.regions, c = 0, d = b.length; d > c; c++) {
                var e = b[c];
                e.page == a && (e.u = e.x / a.width, e.v = e.y / a.height, e.rotate ? (e.u2 = (e.x + e.height) / a.width, 
                e.v2 = (e.y + e.width) / a.height) : (e.u2 = (e.x + e.width) / a.width, e.v2 = (e.y + e.height) / a.height));
            }
        }
    }, f.Atlas.Format = {
        alpha: 0,
        intensity: 1,
        luminanceAlpha: 2,
        rgb565: 3,
        rgba4444: 4,
        rgb888: 5,
        rgba8888: 6
    }, f.Atlas.TextureFilter = {
        nearest: 0,
        linear: 1,
        mipMap: 2,
        mipMapNearestNearest: 3,
        mipMapLinearNearest: 4,
        mipMapNearestLinear: 5,
        mipMapLinearLinear: 6
    }, f.Atlas.TextureWrap = {
        mirroredRepeat: 0,
        clampToEdge: 1,
        repeat: 2
    }, f.AtlasPage = function() {}, f.AtlasPage.prototype = {
        name: null,
        format: null,
        minFilter: null,
        magFilter: null,
        uWrap: null,
        vWrap: null,
        rendererObject: null,
        width: 0,
        height: 0
    }, f.AtlasRegion = function() {}, f.AtlasRegion.prototype = {
        page: null,
        name: null,
        x: 0,
        y: 0,
        width: 0,
        height: 0,
        u: 0,
        v: 0,
        u2: 0,
        v2: 0,
        offsetX: 0,
        offsetY: 0,
        originalWidth: 0,
        originalHeight: 0,
        index: 0,
        rotate: !1,
        splits: null,
        pads: null
    }, f.AtlasReader = function(a) {
        this.lines = a.split(/\r\n|\r|\n/);
    }, f.AtlasReader.prototype = {
        index: 0,
        trim: function(a) {
            return a.replace(/^\s+|\s+$/g, "");
        },
        readLine: function() {
            return this.index >= this.lines.length ? null : this.lines[this.index++];
        },
        readValue: function() {
            var a = this.readLine(), b = a.indexOf(":");
            if (-1 == b) throw "Invalid line: " + a;
            return this.trim(a.substring(b + 1));
        },
        readTuple: function(a) {
            var b = this.readLine(), c = b.indexOf(":");
            if (-1 == c) throw "Invalid line: " + b;
            for (var d = 0, e = c + 1; 3 > d; d++) {
                var f = b.indexOf(",", e);
                if (-1 == f) {
                    if (!d) throw "Invalid line: " + b;
                    break;
                }
                a[d] = this.trim(b.substr(e, f - e)), e = f + 1;
            }
            return a[d] = this.trim(b.substring(e)), d + 1;
        }
    }, f.AtlasAttachmentLoader = function(a) {
        this.atlas = a;
    }, f.AtlasAttachmentLoader.prototype = {
        newAttachment: function(a, b, c) {
            switch (b) {
              case f.AttachmentType.region:
                var d = this.atlas.findRegion(c);
                if (!d) throw "Region not found in atlas: " + c + " (" + b + ")";
                var e = new f.RegionAttachment(c);
                return e.rendererObject = d, e.setUVs(d.u, d.v, d.u2, d.v2, d.rotate), e.regionOffsetX = d.offsetX, 
                e.regionOffsetY = d.offsetY, e.regionWidth = d.width, e.regionHeight = d.height, 
                e.regionOriginalWidth = d.originalWidth, e.regionOriginalHeight = d.originalHeight, 
                e;
            }
            throw "Unknown attachment type: " + b;
        }
    }, f.Bone.yDown = !0, b.AnimCache = {}, b.Spine = function(a) {
        if (b.DisplayObjectContainer.call(this), this.spineData = b.AnimCache[a], !this.spineData) throw new Error("Spine data must be preloaded using PIXI.SpineLoader or PIXI.AssetLoader: " + a);
        this.skeleton = new f.Skeleton(this.spineData), this.skeleton.updateWorldTransform(), 
        this.stateData = new f.AnimationStateData(this.spineData), this.state = new f.AnimationState(this.stateData), 
        this.slotContainers = [];
        for (var c = 0, d = this.skeleton.drawOrder.length; d > c; c++) {
            var e = this.skeleton.drawOrder[c], g = e.attachment, h = new b.DisplayObjectContainer();
            if (this.slotContainers.push(h), this.addChild(h), g instanceof f.RegionAttachment) {
                var i = g.rendererObject.name, j = this.createSprite(e, g.rendererObject);
                e.currentSprite = j, e.currentSpriteName = i, h.addChild(j);
            }
        }
    }, b.Spine.prototype = Object.create(b.DisplayObjectContainer.prototype), b.Spine.prototype.constructor = b.Spine, 
    b.Spine.prototype.updateTransform = function() {
        this.lastTime = this.lastTime || Date.now();
        var a = .001 * (Date.now() - this.lastTime);
        this.lastTime = Date.now(), this.state.update(a), this.state.apply(this.skeleton), 
        this.skeleton.updateWorldTransform();
        for (var c = this.skeleton.drawOrder, d = 0, e = c.length; e > d; d++) {
            var g = c[d], h = g.attachment, i = this.slotContainers[d];
            if (h instanceof f.RegionAttachment) {
                if (h.rendererObject && (!g.currentSpriteName || g.currentSpriteName != h.name)) {
                    var j = h.rendererObject.name;
                    if (void 0 !== g.currentSprite && (g.currentSprite.visible = !1), g.sprites = g.sprites || {}, 
                    void 0 !== g.sprites[j]) g.sprites[j].visible = !0; else {
                        var k = this.createSprite(g, h.rendererObject);
                        i.addChild(k);
                    }
                    g.currentSprite = g.sprites[j], g.currentSpriteName = j;
                }
                i.visible = !0;
                var l = g.bone;
                i.position.x = l.worldX + h.x * l.m00 + h.y * l.m01, i.position.y = l.worldY + h.x * l.m10 + h.y * l.m11, 
                i.scale.x = l.worldScaleX, i.scale.y = l.worldScaleY, i.rotation = -(g.bone.worldRotation * Math.PI / 180), 
                i.alpha = g.a, g.currentSprite.tint = b.rgb2hex([ g.r, g.g, g.b ]);
            } else i.visible = !1;
        }
        b.DisplayObjectContainer.prototype.updateTransform.call(this);
    }, b.Spine.prototype.createSprite = function(a, c) {
        var d = b.TextureCache[c.name] ? c.name : c.name + ".png", e = new b.Sprite(b.Texture.fromFrame(d));
        return e.scale = c.scale, e.rotation = c.rotation, e.anchor.x = e.anchor.y = .5, 
        a.sprites = a.sprites || {}, a.sprites[c.name] = e, e;
    }, b.BaseTextureCache = {}, b.texturesToUpdate = [], b.texturesToDestroy = [], b.BaseTextureCacheIdGenerator = 0, 
    b.BaseTexture = function(a, c) {
        if (b.EventTarget.call(this), this.width = 100, this.height = 100, this.scaleMode = c || b.scaleModes.DEFAULT, 
        this.hasLoaded = !1, this.source = a, this.id = b.BaseTextureCacheIdGenerator++, 
        this.premultipliedAlpha = !0, this._glTextures = [], this._dirty = [], a) {
            if ((this.source.complete || this.source.getContext) && this.source.width && this.source.height) this.hasLoaded = !0, 
            this.width = this.source.width, this.height = this.source.height, b.texturesToUpdate.push(this); else {
                var d = this;
                this.source.onload = function() {
                    d.hasLoaded = !0, d.width = d.source.width, d.height = d.source.height;
                    for (var a = 0; a < d._glTextures.length; a++) d._dirty[a] = !0;
                    d.dispatchEvent({
                        type: "loaded",
                        content: d
                    });
                }, this.source.onerror = function() {
                    d.dispatchEvent({
                        type: "error",
                        content: d
                    });
                };
            }
            this.imageUrl = null, this._powerOf2 = !1;
        }
    }, b.BaseTexture.prototype.constructor = b.BaseTexture, b.BaseTexture.prototype.destroy = function() {
        this.imageUrl ? (delete b.BaseTextureCache[this.imageUrl], delete b.TextureCache[this.imageUrl], 
        this.imageUrl = null, this.source.src = null) : this.source && this.source._pixiId && delete b.BaseTextureCache[this.source._pixiId], 
        this.source = null, b.texturesToDestroy.push(this);
    }, b.BaseTexture.prototype.updateSourceImage = function(a) {
        this.hasLoaded = !1, this.source.src = null, this.source.src = a;
    }, b.BaseTexture.fromImage = function(a, c, d) {
        var e = b.BaseTextureCache[a];
        if (void 0 === c && -1 === a.indexOf("data:") && (c = !0), !e) {
            var f = new Image();
            c && (f.crossOrigin = ""), f.src = a, e = new b.BaseTexture(f, d), e.imageUrl = a, 
            b.BaseTextureCache[a] = e;
        }
        return e;
    }, b.BaseTexture.fromCanvas = function(a, c) {
        a._pixiId || (a._pixiId = "canvas_" + b.TextureCacheIdGenerator++);
        var d = b.BaseTextureCache[a._pixiId];
        return d || (d = new b.BaseTexture(a, c), b.BaseTextureCache[a._pixiId] = d), d;
    }, b.TextureCache = {}, b.FrameCache = {}, b.TextureCacheIdGenerator = 0, b.Texture = function(a, c) {
        if (b.EventTarget.call(this), this.noFrame = !1, c || (this.noFrame = !0, c = new b.Rectangle(0, 0, 1, 1)), 
        a instanceof b.Texture && (a = a.baseTexture), this.baseTexture = a, this.frame = c, 
        this.trim = null, this.valid = !1, this.scope = this, this._uvs = null, this.width = 0, 
        this.height = 0, this.crop = new b.Rectangle(0, 0, 1, 1), a.hasLoaded) this.noFrame && (c = new b.Rectangle(0, 0, a.width, a.height)), 
        this.setFrame(c); else {
            var d = this;
            a.addEventListener("loaded", function() {
                d.onBaseTextureLoaded();
            });
        }
    }, b.Texture.prototype.constructor = b.Texture, b.Texture.prototype.onBaseTextureLoaded = function() {
        var a = this.baseTexture;
        a.removeEventListener("loaded", this.onLoaded), this.noFrame && (this.frame = new b.Rectangle(0, 0, a.width, a.height)), 
        this.setFrame(this.frame), this.scope.dispatchEvent({
            type: "update",
            content: this
        });
    }, b.Texture.prototype.destroy = function(a) {
        a && this.baseTexture.destroy(), this.valid = !1;
    }, b.Texture.prototype.setFrame = function(a) {
        if (this.noFrame = !1, this.frame = a, this.width = a.width, this.height = a.height, 
        this.crop.x = a.x, this.crop.y = a.y, this.crop.width = a.width, this.crop.height = a.height, 
        !this.trim && (a.x + a.width > this.baseTexture.width || a.y + a.height > this.baseTexture.height)) throw new Error("Texture Error: frame does not fit inside the base Texture dimensions " + this);
        this.valid = a && a.width && a.height && this.baseTexture.source && this.baseTexture.hasLoaded, 
        this.trim && (this.width = this.trim.width, this.height = this.trim.height, this.frame.width = this.trim.width, 
        this.frame.height = this.trim.height), this.valid && b.Texture.frameUpdates.push(this);
    }, b.Texture.prototype._updateWebGLuvs = function() {
        this._uvs || (this._uvs = new b.TextureUvs());
        var a = this.crop, c = this.baseTexture.width, d = this.baseTexture.height;
        this._uvs.x0 = a.x / c, this._uvs.y0 = a.y / d, this._uvs.x1 = (a.x + a.width) / c, 
        this._uvs.y1 = a.y / d, this._uvs.x2 = (a.x + a.width) / c, this._uvs.y2 = (a.y + a.height) / d, 
        this._uvs.x3 = a.x / c, this._uvs.y3 = (a.y + a.height) / d;
    }, b.Texture.fromImage = function(a, c, d) {
        var e = b.TextureCache[a];
        return e || (e = new b.Texture(b.BaseTexture.fromImage(a, c, d)), b.TextureCache[a] = e), 
        e;
    }, b.Texture.fromFrame = function(a) {
        var c = b.TextureCache[a];
        if (!c) throw new Error('The frameId "' + a + '" does not exist in the texture cache ');
        return c;
    }, b.Texture.fromCanvas = function(a, c) {
        var d = b.BaseTexture.fromCanvas(a, c);
        return new b.Texture(d);
    }, b.Texture.addTextureToCache = function(a, c) {
        b.TextureCache[c] = a;
    }, b.Texture.removeTextureFromCache = function(a) {
        var c = b.TextureCache[a];
        return delete b.TextureCache[a], delete b.BaseTextureCache[a], c;
    }, b.Texture.frameUpdates = [], b.TextureUvs = function() {
        this.x0 = 0, this.y0 = 0, this.x1 = 0, this.y1 = 0, this.x2 = 0, this.y2 = 0, this.x3 = 0, 
        this.y3 = 0;
    }, b.RenderTexture = function(a, c, d, e) {
        if (b.EventTarget.call(this), this.width = a || 100, this.height = c || 100, this.frame = new b.Rectangle(0, 0, this.width, this.height), 
        this.crop = new b.Rectangle(0, 0, this.width, this.height), this.baseTexture = new b.BaseTexture(), 
        this.baseTexture.width = this.width, this.baseTexture.height = this.height, this.baseTexture._glTextures = [], 
        this.baseTexture.scaleMode = e || b.scaleModes.DEFAULT, this.baseTexture.hasLoaded = !0, 
        this.renderer = d || b.defaultRenderer, this.renderer.type === b.WEBGL_RENDERER) {
            var f = this.renderer.gl;
            this.textureBuffer = new b.FilterTexture(f, this.width, this.height, this.baseTexture.scaleMode), 
            this.baseTexture._glTextures[f.id] = this.textureBuffer.texture, this.render = this.renderWebGL, 
            this.projection = new b.Point(this.width / 2, -this.height / 2);
        } else this.render = this.renderCanvas, this.textureBuffer = new b.CanvasBuffer(this.width, this.height), 
        this.baseTexture.source = this.textureBuffer.canvas;
        this.valid = !0, b.Texture.frameUpdates.push(this);
    }, b.RenderTexture.prototype = Object.create(b.Texture.prototype), b.RenderTexture.prototype.constructor = b.RenderTexture, 
    b.RenderTexture.prototype.resize = function(a, c, d) {
        (a !== this.width || c !== this.height) && (this.width = this.frame.width = this.crop.width = a, 
        this.height = this.frame.height = this.crop.height = c, d && (this.baseTexture.width = this.width, 
        this.baseTexture.height = this.height), this.renderer.type === b.WEBGL_RENDERER && (this.projection.x = this.width / 2, 
        this.projection.y = -this.height / 2), this.textureBuffer.resize(this.width, this.height));
    }, b.RenderTexture.prototype.clear = function() {
        this.renderer.type === b.WEBGL_RENDERER && this.renderer.gl.bindFramebuffer(this.renderer.gl.FRAMEBUFFER, this.textureBuffer.frameBuffer), 
        this.textureBuffer.clear();
    }, b.RenderTexture.prototype.renderWebGL = function(a, c, d) {
        var e = this.renderer.gl;
        e.colorMask(!0, !0, !0, !0), e.viewport(0, 0, this.width, this.height), e.bindFramebuffer(e.FRAMEBUFFER, this.textureBuffer.frameBuffer), 
        d && this.textureBuffer.clear();
        var f = a.children, g = a.worldTransform;
        a.worldTransform = b.RenderTexture.tempMatrix, a.worldTransform.d = -1, a.worldTransform.ty = -2 * this.projection.y, 
        c && (a.worldTransform.tx = c.x, a.worldTransform.ty -= c.y);
        for (var h = 0, i = f.length; i > h; h++) f[h].updateTransform();
        b.WebGLRenderer.updateTextures(), this.renderer.spriteBatch.dirty = !0, this.renderer.renderDisplayObject(a, this.projection, this.textureBuffer.frameBuffer), 
        a.worldTransform = g, this.renderer.spriteBatch.dirty = !0;
    }, b.RenderTexture.prototype.renderCanvas = function(a, c, d) {
        var e = a.children, f = a.worldTransform;
        a.worldTransform = b.RenderTexture.tempMatrix, c ? (a.worldTransform.tx = c.x, a.worldTransform.ty = c.y) : (a.worldTransform.tx = 0, 
        a.worldTransform.ty = 0);
        for (var g = 0, h = e.length; h > g; g++) e[g].updateTransform();
        d && this.textureBuffer.clear();
        var i = this.textureBuffer.context;
        this.renderer.renderDisplayObject(a, i), i.setTransform(1, 0, 0, 1, 0, 0), a.worldTransform = f;
    }, b.RenderTexture.tempMatrix = new b.Matrix(), b.AssetLoader = function(a, c) {
        b.EventTarget.call(this), this.assetURLs = a, this.crossorigin = c, this.loadersByType = {
            jpg: b.ImageLoader,
            jpeg: b.ImageLoader,
            png: b.ImageLoader,
            gif: b.ImageLoader,
            webp: b.ImageLoader,
            json: b.JsonLoader,
            atlas: b.AtlasLoader,
            anim: b.SpineLoader,
            xml: b.BitmapFontLoader,
            fnt: b.BitmapFontLoader
        };
    }, b.AssetLoader.prototype.constructor = b.AssetLoader, b.AssetLoader.prototype._getDataType = function(a) {
        var b = "data:", c = a.slice(0, b.length).toLowerCase();
        if (c === b) {
            var d = a.slice(b.length), e = d.indexOf(",");
            if (-1 === e) return null;
            var f = d.slice(0, e).split(";")[0];
            return f && "text/plain" !== f.toLowerCase() ? f.split("/").pop().toLowerCase() : "txt";
        }
        return null;
    }, b.AssetLoader.prototype.load = function() {
        function a(a) {
            b.onAssetLoaded(a.content);
        }
        var b = this;
        this.loadCount = this.assetURLs.length;
        for (var c = 0; c < this.assetURLs.length; c++) {
            var d = this.assetURLs[c], e = this._getDataType(d);
            e || (e = d.split("?").shift().split(".").pop().toLowerCase());
            var f = this.loadersByType[e];
            if (!f) throw new Error(e + " is an unsupported file type");
            var g = new f(d, this.crossorigin);
            g.addEventListener("loaded", a), g.load();
        }
    }, b.AssetLoader.prototype.onAssetLoaded = function(a) {
        this.loadCount--, this.dispatchEvent({
            type: "onProgress",
            content: this,
            loader: a
        }), this.onProgress && this.onProgress(a), this.loadCount || (this.dispatchEvent({
            type: "onComplete",
            content: this
        }), this.onComplete && this.onComplete());
    }, b.JsonLoader = function(a, c) {
        b.EventTarget.call(this), this.url = a, this.crossorigin = c, this.baseUrl = a.replace(/[^\/]*$/, ""), 
        this.loaded = !1;
    }, b.JsonLoader.prototype.constructor = b.JsonLoader, b.JsonLoader.prototype.load = function() {
        var a = this;
        window.XDomainRequest && a.crossorigin ? (this.ajaxRequest = new window.XDomainRequest(), 
        this.ajaxRequest.timeout = 3e3, this.ajaxRequest.onerror = function() {
            a.onError();
        }, this.ajaxRequest.ontimeout = function() {
            a.onError();
        }, this.ajaxRequest.onprogress = function() {}) : this.ajaxRequest = window.XMLHttpRequest ? new window.XMLHttpRequest() : new window.ActiveXObject("Microsoft.XMLHTTP"), 
        this.ajaxRequest.onload = function() {
            a.onJSONLoaded();
        }, this.ajaxRequest.open("GET", this.url, !0), this.ajaxRequest.send();
    }, b.JsonLoader.prototype.onJSONLoaded = function() {
        if (!this.ajaxRequest.responseText) return void this.onError();
        if (this.json = JSON.parse(this.ajaxRequest.responseText), this.json.frames) {
            var a = this, c = this.baseUrl + this.json.meta.image, d = new b.ImageLoader(c, this.crossorigin), e = this.json.frames;
            this.texture = d.texture.baseTexture, d.addEventListener("loaded", function() {
                a.onLoaded();
            });
            for (var g in e) {
                var h = e[g].frame;
                if (h && (b.TextureCache[g] = new b.Texture(this.texture, {
                    x: h.x,
                    y: h.y,
                    width: h.w,
                    height: h.h
                }), b.TextureCache[g].crop = new b.Rectangle(h.x, h.y, h.w, h.h), e[g].trimmed)) {
                    var i = e[g].sourceSize, j = e[g].spriteSourceSize;
                    b.TextureCache[g].trim = new b.Rectangle(j.x, j.y, i.w, i.h);
                }
            }
            d.load();
        } else if (this.json.bones) {
            var k = new f.SkeletonJson(), l = k.readSkeletonData(this.json);
            b.AnimCache[this.url] = l, this.onLoaded();
        } else this.onLoaded();
    }, b.JsonLoader.prototype.onLoaded = function() {
        this.loaded = !0, this.dispatchEvent({
            type: "loaded",
            content: this
        });
    }, b.JsonLoader.prototype.onError = function() {
        this.dispatchEvent({
            type: "error",
            content: this
        });
    }, b.AtlasLoader = function(a, c) {
        b.EventTarget.call(this), this.url = a, this.baseUrl = a.replace(/[^\/]*$/, ""), 
        this.crossorigin = c, this.loaded = !1;
    }, b.AtlasLoader.constructor = b.AtlasLoader, b.AtlasLoader.prototype.load = function() {
        this.ajaxRequest = new b.AjaxRequest(), this.ajaxRequest.onreadystatechange = this.onAtlasLoaded.bind(this), 
        this.ajaxRequest.open("GET", this.url, !0), this.ajaxRequest.overrideMimeType && this.ajaxRequest.overrideMimeType("application/json"), 
        this.ajaxRequest.send(null);
    }, b.AtlasLoader.prototype.onAtlasLoaded = function() {
        if (4 === this.ajaxRequest.readyState) if (200 === this.ajaxRequest.status || -1 === window.location.href.indexOf("http")) {
            this.atlas = {
                meta: {
                    image: []
                },
                frames: []
            };
            var a = this.ajaxRequest.responseText.split(/\r?\n/), c = -3, d = 0, e = null, f = !1, g = 0, h = 0, i = this.onLoaded.bind(this);
            for (g = 0; g < a.length; g++) if (a[g] = a[g].replace(/^\s+|\s+$/g, ""), "" === a[g] && (f = g + 1), 
            a[g].length > 0) {
                if (f === g) this.atlas.meta.image.push(a[g]), d = this.atlas.meta.image.length - 1, 
                this.atlas.frames.push({}), c = -3; else if (c > 0) if (c % 7 === 1) null != e && (this.atlas.frames[d][e.name] = e), 
                e = {
                    name: a[g],
                    frame: {}
                }; else {
                    var j = a[g].split(" ");
                    if (c % 7 === 3) e.frame.x = Number(j[1].replace(",", "")), e.frame.y = Number(j[2]); else if (c % 7 === 4) e.frame.w = Number(j[1].replace(",", "")), 
                    e.frame.h = Number(j[2]); else if (c % 7 === 5) {
                        var k = {
                            x: 0,
                            y: 0,
                            w: Number(j[1].replace(",", "")),
                            h: Number(j[2])
                        };
                        k.w > e.frame.w || k.h > e.frame.h ? (e.trimmed = !0, e.realSize = k) : e.trimmed = !1;
                    }
                }
                c++;
            }
            if (null != e && (this.atlas.frames[d][e.name] = e), this.atlas.meta.image.length > 0) {
                for (this.images = [], h = 0; h < this.atlas.meta.image.length; h++) {
                    var l = this.baseUrl + this.atlas.meta.image[h], m = this.atlas.frames[h];
                    this.images.push(new b.ImageLoader(l, this.crossorigin));
                    for (g in m) {
                        var n = m[g].frame;
                        n && (b.TextureCache[g] = new b.Texture(this.images[h].texture.baseTexture, {
                            x: n.x,
                            y: n.y,
                            width: n.w,
                            height: n.h
                        }), m[g].trimmed && (b.TextureCache[g].realSize = m[g].realSize, b.TextureCache[g].trim.x = 0, 
                        b.TextureCache[g].trim.y = 0));
                    }
                }
                for (this.currentImageId = 0, h = 0; h < this.images.length; h++) this.images[h].addEventListener("loaded", i);
                this.images[this.currentImageId].load();
            } else this.onLoaded();
        } else this.onError();
    }, b.AtlasLoader.prototype.onLoaded = function() {
        this.images.length - 1 > this.currentImageId ? (this.currentImageId++, this.images[this.currentImageId].load()) : (this.loaded = !0, 
        this.dispatchEvent({
            type: "loaded",
            content: this
        }));
    }, b.AtlasLoader.prototype.onError = function() {
        this.dispatchEvent({
            type: "error",
            content: this
        });
    }, b.SpriteSheetLoader = function(a, c) {
        b.EventTarget.call(this), this.url = a, this.crossorigin = c, this.baseUrl = a.replace(/[^\/]*$/, ""), 
        this.texture = null, this.frames = {};
    }, b.SpriteSheetLoader.prototype.constructor = b.SpriteSheetLoader, b.SpriteSheetLoader.prototype.load = function() {
        var a = this, c = new b.JsonLoader(this.url, this.crossorigin);
        c.addEventListener("loaded", function(b) {
            a.json = b.content.json, a.onLoaded();
        }), c.load();
    }, b.SpriteSheetLoader.prototype.onLoaded = function() {
        this.dispatchEvent({
            type: "loaded",
            content: this
        });
    }, b.ImageLoader = function(a, c) {
        b.EventTarget.call(this), this.texture = b.Texture.fromImage(a, c), this.frames = [];
    }, b.ImageLoader.prototype.constructor = b.ImageLoader, b.ImageLoader.prototype.load = function() {
        if (this.texture.baseTexture.hasLoaded) this.onLoaded(); else {
            var a = this;
            this.texture.baseTexture.addEventListener("loaded", function() {
                a.onLoaded();
            });
        }
    }, b.ImageLoader.prototype.onLoaded = function() {
        this.dispatchEvent({
            type: "loaded",
            content: this
        });
    }, b.ImageLoader.prototype.loadFramedSpriteSheet = function(a, c, d) {
        this.frames = [];
        for (var e = Math.floor(this.texture.width / a), f = Math.floor(this.texture.height / c), g = 0, h = 0; f > h; h++) for (var i = 0; e > i; i++, 
        g++) {
            var j = new b.Texture(this.texture, {
                x: i * a,
                y: h * c,
                width: a,
                height: c
            });
            this.frames.push(j), d && (b.TextureCache[d + "-" + g] = j);
        }
        if (this.texture.baseTexture.hasLoaded) this.onLoaded(); else {
            var k = this;
            this.texture.baseTexture.addEventListener("loaded", function() {
                k.onLoaded();
            });
        }
    }, b.BitmapFontLoader = function(a, c) {
        b.EventTarget.call(this), this.url = a, this.crossorigin = c, this.baseUrl = a.replace(/[^\/]*$/, ""), 
        this.texture = null;
    }, b.BitmapFontLoader.prototype.constructor = b.BitmapFontLoader, b.BitmapFontLoader.prototype.load = function() {
        this.ajaxRequest = new b.AjaxRequest();
        var a = this;
        this.ajaxRequest.onreadystatechange = function() {
            a.onXMLLoaded();
        }, this.ajaxRequest.open("GET", this.url, !0), this.ajaxRequest.overrideMimeType && this.ajaxRequest.overrideMimeType("application/xml"), 
        this.ajaxRequest.send(null);
    }, b.BitmapFontLoader.prototype.onXMLLoaded = function() {
        if (4 === this.ajaxRequest.readyState && (200 === this.ajaxRequest.status || -1 === window.location.protocol.indexOf("http"))) {
            var a = this.ajaxRequest.responseXML;
            if (!a || /MSIE 9/i.test(navigator.userAgent) || navigator.isCocoonJS) if ("function" == typeof window.DOMParser) {
                var c = new DOMParser();
                a = c.parseFromString(this.ajaxRequest.responseText, "text/xml");
            } else {
                var d = document.createElement("div");
                d.innerHTML = this.ajaxRequest.responseText, a = d;
            }
            var e = this.baseUrl + a.getElementsByTagName("page")[0].getAttribute("file"), f = new b.ImageLoader(e, this.crossorigin);
            this.texture = f.texture.baseTexture;
            var g = {}, h = a.getElementsByTagName("info")[0], i = a.getElementsByTagName("common")[0];
            g.font = h.getAttribute("face"), g.size = parseInt(h.getAttribute("size"), 10), 
            g.lineHeight = parseInt(i.getAttribute("lineHeight"), 10), g.chars = {};
            for (var j = a.getElementsByTagName("char"), k = 0; k < j.length; k++) {
                var l = parseInt(j[k].getAttribute("id"), 10), m = new b.Rectangle(parseInt(j[k].getAttribute("x"), 10), parseInt(j[k].getAttribute("y"), 10), parseInt(j[k].getAttribute("width"), 10), parseInt(j[k].getAttribute("height"), 10));
                g.chars[l] = {
                    xOffset: parseInt(j[k].getAttribute("xoffset"), 10),
                    yOffset: parseInt(j[k].getAttribute("yoffset"), 10),
                    xAdvance: parseInt(j[k].getAttribute("xadvance"), 10),
                    kerning: {},
                    texture: b.TextureCache[l] = new b.Texture(this.texture, m)
                };
            }
            var n = a.getElementsByTagName("kerning");
            for (k = 0; k < n.length; k++) {
                var o = parseInt(n[k].getAttribute("first"), 10), p = parseInt(n[k].getAttribute("second"), 10), q = parseInt(n[k].getAttribute("amount"), 10);
                g.chars[p].kerning[o] = q;
            }
            b.BitmapText.fonts[g.font] = g;
            var r = this;
            f.addEventListener("loaded", function() {
                r.onLoaded();
            }), f.load();
        }
    }, b.BitmapFontLoader.prototype.onLoaded = function() {
        this.dispatchEvent({
            type: "loaded",
            content: this
        });
    }, b.SpineLoader = function(a, c) {
        b.EventTarget.call(this), this.url = a, this.crossorigin = c, this.loaded = !1;
    }, b.SpineLoader.prototype.constructor = b.SpineLoader, b.SpineLoader.prototype.load = function() {
        var a = this, c = new b.JsonLoader(this.url, this.crossorigin);
        c.addEventListener("loaded", function(b) {
            a.json = b.content.json, a.onLoaded();
        }), c.load();
    }, b.SpineLoader.prototype.onLoaded = function() {
        this.loaded = !0, this.dispatchEvent({
            type: "loaded",
            content: this
        });
    }, b.AbstractFilter = function(a, b) {
        this.passes = [ this ], this.shaders = [], this.dirty = !0, this.padding = 0, this.uniforms = b || {}, 
        this.fragmentSrc = a || [];
    }, b.AlphaMaskFilter = function(a) {
        b.AbstractFilter.call(this), this.passes = [ this ], a.baseTexture._powerOf2 = !0, 
        this.uniforms = {
            mask: {
                type: "sampler2D",
                value: a
            },
            mapDimensions: {
                type: "2f",
                value: {
                    x: 1,
                    y: 5112
                }
            },
            dimensions: {
                type: "4fv",
                value: [ 0, 0, 0, 0 ]
            }
        }, a.baseTexture.hasLoaded ? (this.uniforms.mask.value.x = a.width, this.uniforms.mask.value.y = a.height) : (this.boundLoadedFunction = this.onTextureLoaded.bind(this), 
        a.baseTexture.on("loaded", this.boundLoadedFunction)), this.fragmentSrc = [ "precision mediump float;", "varying vec2 vTextureCoord;", "varying vec4 vColor;", "uniform sampler2D mask;", "uniform sampler2D uSampler;", "uniform vec2 offset;", "uniform vec4 dimensions;", "uniform vec2 mapDimensions;", "void main(void) {", "   vec2 mapCords = vTextureCoord.xy;", "   mapCords += (dimensions.zw + offset)/ dimensions.xy ;", "   mapCords.y *= -1.0;", "   mapCords.y += 1.0;", "   mapCords *= dimensions.xy / mapDimensions;", "   vec4 original =  texture2D(uSampler, vTextureCoord);", "   float maskAlpha =  texture2D(mask, mapCords).r;", "   original *= maskAlpha;", "   gl_FragColor =  original;", "}" ];
    }, b.AlphaMaskFilter.prototype = Object.create(b.AbstractFilter.prototype), b.AlphaMaskFilter.prototype.constructor = b.AlphaMaskFilter, 
    b.AlphaMaskFilter.prototype.onTextureLoaded = function() {
        this.uniforms.mapDimensions.value.x = this.uniforms.mask.value.width, this.uniforms.mapDimensions.value.y = this.uniforms.mask.value.height, 
        this.uniforms.mask.value.baseTexture.off("loaded", this.boundLoadedFunction);
    }, Object.defineProperty(b.AlphaMaskFilter.prototype, "map", {
        get: function() {
            return this.uniforms.mask.value;
        },
        set: function(a) {
            this.uniforms.mask.value = a;
        }
    }), b.ColorMatrixFilter = function() {
        b.AbstractFilter.call(this), this.passes = [ this ], this.uniforms = {
            matrix: {
                type: "mat4",
                value: [ 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1 ]
            }
        }, this.fragmentSrc = [ "precision mediump float;", "varying vec2 vTextureCoord;", "varying vec4 vColor;", "uniform float invert;", "uniform mat4 matrix;", "uniform sampler2D uSampler;", "void main(void) {", "   gl_FragColor = texture2D(uSampler, vTextureCoord) * matrix;", "}" ];
    }, b.ColorMatrixFilter.prototype = Object.create(b.AbstractFilter.prototype), b.ColorMatrixFilter.prototype.constructor = b.ColorMatrixFilter, 
    Object.defineProperty(b.ColorMatrixFilter.prototype, "matrix", {
        get: function() {
            return this.uniforms.matrix.value;
        },
        set: function(a) {
            this.uniforms.matrix.value = a;
        }
    }), b.GrayFilter = function() {
        b.AbstractFilter.call(this), this.passes = [ this ], this.uniforms = {
            gray: {
                type: "1f",
                value: 1
            }
        }, this.fragmentSrc = [ "precision mediump float;", "varying vec2 vTextureCoord;", "varying vec4 vColor;", "uniform sampler2D uSampler;", "uniform float gray;", "void main(void) {", "   gl_FragColor = texture2D(uSampler, vTextureCoord);", "   gl_FragColor.rgb = mix(gl_FragColor.rgb, vec3(0.2126*gl_FragColor.r + 0.7152*gl_FragColor.g + 0.0722*gl_FragColor.b), gray);", "}" ];
    }, b.GrayFilter.prototype = Object.create(b.AbstractFilter.prototype), b.GrayFilter.prototype.constructor = b.GrayFilter, 
    Object.defineProperty(b.GrayFilter.prototype, "gray", {
        get: function() {
            return this.uniforms.gray.value;
        },
        set: function(a) {
            this.uniforms.gray.value = a;
        }
    }), b.DisplacementFilter = function(a) {
        b.AbstractFilter.call(this), this.passes = [ this ], a.baseTexture._powerOf2 = !0, 
        this.uniforms = {
            displacementMap: {
                type: "sampler2D",
                value: a
            },
            scale: {
                type: "2f",
                value: {
                    x: 30,
                    y: 30
                }
            },
            offset: {
                type: "2f",
                value: {
                    x: 0,
                    y: 0
                }
            },
            mapDimensions: {
                type: "2f",
                value: {
                    x: 1,
                    y: 5112
                }
            },
            dimensions: {
                type: "4fv",
                value: [ 0, 0, 0, 0 ]
            }
        }, a.baseTexture.hasLoaded ? (this.uniforms.mapDimensions.value.x = a.width, this.uniforms.mapDimensions.value.y = a.height) : (this.boundLoadedFunction = this.onTextureLoaded.bind(this), 
        a.baseTexture.on("loaded", this.boundLoadedFunction)), this.fragmentSrc = [ "precision mediump float;", "varying vec2 vTextureCoord;", "varying vec4 vColor;", "uniform sampler2D displacementMap;", "uniform sampler2D uSampler;", "uniform vec2 scale;", "uniform vec2 offset;", "uniform vec4 dimensions;", "uniform vec2 mapDimensions;", "void main(void) {", "   vec2 mapCords = vTextureCoord.xy;", "   mapCords += (dimensions.zw + offset)/ dimensions.xy ;", "   mapCords.y *= -1.0;", "   mapCords.y += 1.0;", "   vec2 matSample = texture2D(displacementMap, mapCords).xy;", "   matSample -= 0.5;", "   matSample *= scale;", "   matSample /= mapDimensions;", "   gl_FragColor = texture2D(uSampler, vec2(vTextureCoord.x + matSample.x, vTextureCoord.y + matSample.y));", "   gl_FragColor.rgb = mix( gl_FragColor.rgb, gl_FragColor.rgb, 1.0);", "   vec2 cord = vTextureCoord;", "}" ];
    }, b.DisplacementFilter.prototype = Object.create(b.AbstractFilter.prototype), b.DisplacementFilter.prototype.constructor = b.DisplacementFilter, 
    b.DisplacementFilter.prototype.onTextureLoaded = function() {
        this.uniforms.mapDimensions.value.x = this.uniforms.displacementMap.value.width, 
        this.uniforms.mapDimensions.value.y = this.uniforms.displacementMap.value.height, 
        this.uniforms.displacementMap.value.baseTexture.off("loaded", this.boundLoadedFunction);
    }, Object.defineProperty(b.DisplacementFilter.prototype, "map", {
        get: function() {
            return this.uniforms.displacementMap.value;
        },
        set: function(a) {
            this.uniforms.displacementMap.value = a;
        }
    }), Object.defineProperty(b.DisplacementFilter.prototype, "scale", {
        get: function() {
            return this.uniforms.scale.value;
        },
        set: function(a) {
            this.uniforms.scale.value = a;
        }
    }), Object.defineProperty(b.DisplacementFilter.prototype, "offset", {
        get: function() {
            return this.uniforms.offset.value;
        },
        set: function(a) {
            this.uniforms.offset.value = a;
        }
    }), b.PixelateFilter = function() {
        b.AbstractFilter.call(this), this.passes = [ this ], this.uniforms = {
            invert: {
                type: "1f",
                value: 0
            },
            dimensions: {
                type: "4fv",
                value: new Float32Array([ 1e4, 100, 10, 10 ])
            },
            pixelSize: {
                type: "2f",
                value: {
                    x: 10,
                    y: 10
                }
            }
        }, this.fragmentSrc = [ "precision mediump float;", "varying vec2 vTextureCoord;", "varying vec4 vColor;", "uniform vec2 testDim;", "uniform vec4 dimensions;", "uniform vec2 pixelSize;", "uniform sampler2D uSampler;", "void main(void) {", "   vec2 coord = vTextureCoord;", "   vec2 size = dimensions.xy/pixelSize;", "   vec2 color = floor( ( vTextureCoord * size ) ) / size + pixelSize/dimensions.xy * 0.5;", "   gl_FragColor = texture2D(uSampler, color);", "}" ];
    }, b.PixelateFilter.prototype = Object.create(b.AbstractFilter.prototype), b.PixelateFilter.prototype.constructor = b.PixelateFilter, 
    Object.defineProperty(b.PixelateFilter.prototype, "size", {
        get: function() {
            return this.uniforms.pixelSize.value;
        },
        set: function(a) {
            this.dirty = !0, this.uniforms.pixelSize.value = a;
        }
    }), b.BlurXFilter = function() {
        b.AbstractFilter.call(this), this.passes = [ this ], this.uniforms = {
            blur: {
                type: "1f",
                value: 1 / 512
            }
        }, this.fragmentSrc = [ "precision mediump float;", "varying vec2 vTextureCoord;", "varying vec4 vColor;", "uniform float blur;", "uniform sampler2D uSampler;", "void main(void) {", "   vec4 sum = vec4(0.0);", "   sum += texture2D(uSampler, vec2(vTextureCoord.x - 4.0*blur, vTextureCoord.y)) * 0.05;", "   sum += texture2D(uSampler, vec2(vTextureCoord.x - 3.0*blur, vTextureCoord.y)) * 0.09;", "   sum += texture2D(uSampler, vec2(vTextureCoord.x - 2.0*blur, vTextureCoord.y)) * 0.12;", "   sum += texture2D(uSampler, vec2(vTextureCoord.x - blur, vTextureCoord.y)) * 0.15;", "   sum += texture2D(uSampler, vec2(vTextureCoord.x, vTextureCoord.y)) * 0.16;", "   sum += texture2D(uSampler, vec2(vTextureCoord.x + blur, vTextureCoord.y)) * 0.15;", "   sum += texture2D(uSampler, vec2(vTextureCoord.x + 2.0*blur, vTextureCoord.y)) * 0.12;", "   sum += texture2D(uSampler, vec2(vTextureCoord.x + 3.0*blur, vTextureCoord.y)) * 0.09;", "   sum += texture2D(uSampler, vec2(vTextureCoord.x + 4.0*blur, vTextureCoord.y)) * 0.05;", "   gl_FragColor = sum;", "}" ];
    }, b.BlurXFilter.prototype = Object.create(b.AbstractFilter.prototype), b.BlurXFilter.prototype.constructor = b.BlurXFilter, 
    Object.defineProperty(b.BlurXFilter.prototype, "blur", {
        get: function() {
            return this.uniforms.blur.value / (1 / 7e3);
        },
        set: function(a) {
            this.dirty = !0, this.uniforms.blur.value = 1 / 7e3 * a;
        }
    }), b.BlurYFilter = function() {
        b.AbstractFilter.call(this), this.passes = [ this ], this.uniforms = {
            blur: {
                type: "1f",
                value: 1 / 512
            }
        }, this.fragmentSrc = [ "precision mediump float;", "varying vec2 vTextureCoord;", "varying vec4 vColor;", "uniform float blur;", "uniform sampler2D uSampler;", "void main(void) {", "   vec4 sum = vec4(0.0);", "   sum += texture2D(uSampler, vec2(vTextureCoord.x, vTextureCoord.y - 4.0*blur)) * 0.05;", "   sum += texture2D(uSampler, vec2(vTextureCoord.x, vTextureCoord.y - 3.0*blur)) * 0.09;", "   sum += texture2D(uSampler, vec2(vTextureCoord.x, vTextureCoord.y - 2.0*blur)) * 0.12;", "   sum += texture2D(uSampler, vec2(vTextureCoord.x, vTextureCoord.y - blur)) * 0.15;", "   sum += texture2D(uSampler, vec2(vTextureCoord.x, vTextureCoord.y)) * 0.16;", "   sum += texture2D(uSampler, vec2(vTextureCoord.x, vTextureCoord.y + blur)) * 0.15;", "   sum += texture2D(uSampler, vec2(vTextureCoord.x, vTextureCoord.y + 2.0*blur)) * 0.12;", "   sum += texture2D(uSampler, vec2(vTextureCoord.x, vTextureCoord.y + 3.0*blur)) * 0.09;", "   sum += texture2D(uSampler, vec2(vTextureCoord.x, vTextureCoord.y + 4.0*blur)) * 0.05;", "   gl_FragColor = sum;", "}" ];
    }, b.BlurYFilter.prototype = Object.create(b.AbstractFilter.prototype), b.BlurYFilter.prototype.constructor = b.BlurYFilter, 
    Object.defineProperty(b.BlurYFilter.prototype, "blur", {
        get: function() {
            return this.uniforms.blur.value / (1 / 7e3);
        },
        set: function(a) {
            this.uniforms.blur.value = 1 / 7e3 * a;
        }
    }), b.BlurFilter = function() {
        this.blurXFilter = new b.BlurXFilter(), this.blurYFilter = new b.BlurYFilter(), 
        this.passes = [ this.blurXFilter, this.blurYFilter ];
    }, Object.defineProperty(b.BlurFilter.prototype, "blur", {
        get: function() {
            return this.blurXFilter.blur;
        },
        set: function(a) {
            this.blurXFilter.blur = this.blurYFilter.blur = a;
        }
    }), Object.defineProperty(b.BlurFilter.prototype, "blurX", {
        get: function() {
            return this.blurXFilter.blur;
        },
        set: function(a) {
            this.blurXFilter.blur = a;
        }
    }), Object.defineProperty(b.BlurFilter.prototype, "blurY", {
        get: function() {
            return this.blurYFilter.blur;
        },
        set: function(a) {
            this.blurYFilter.blur = a;
        }
    }), b.InvertFilter = function() {
        b.AbstractFilter.call(this), this.passes = [ this ], this.uniforms = {
            invert: {
                type: "1f",
                value: 1
            }
        }, this.fragmentSrc = [ "precision mediump float;", "varying vec2 vTextureCoord;", "varying vec4 vColor;", "uniform float invert;", "uniform sampler2D uSampler;", "void main(void) {", "   gl_FragColor = texture2D(uSampler, vTextureCoord);", "   gl_FragColor.rgb = mix( (vec3(1)-gl_FragColor.rgb) * gl_FragColor.a, gl_FragColor.rgb, 1.0 - invert);", "}" ];
    }, b.InvertFilter.prototype = Object.create(b.AbstractFilter.prototype), b.InvertFilter.prototype.constructor = b.InvertFilter, 
    Object.defineProperty(b.InvertFilter.prototype, "invert", {
        get: function() {
            return this.uniforms.invert.value;
        },
        set: function(a) {
            this.uniforms.invert.value = a;
        }
    }), b.SepiaFilter = function() {
        b.AbstractFilter.call(this), this.passes = [ this ], this.uniforms = {
            sepia: {
                type: "1f",
                value: 1
            }
        }, this.fragmentSrc = [ "precision mediump float;", "varying vec2 vTextureCoord;", "varying vec4 vColor;", "uniform float sepia;", "uniform sampler2D uSampler;", "const mat3 sepiaMatrix = mat3(0.3588, 0.7044, 0.1368, 0.2990, 0.5870, 0.1140, 0.2392, 0.4696, 0.0912);", "void main(void) {", "   gl_FragColor = texture2D(uSampler, vTextureCoord);", "   gl_FragColor.rgb = mix( gl_FragColor.rgb, gl_FragColor.rgb * sepiaMatrix, sepia);", "}" ];
    }, b.SepiaFilter.prototype = Object.create(b.AbstractFilter.prototype), b.SepiaFilter.prototype.constructor = b.SepiaFilter, 
    Object.defineProperty(b.SepiaFilter.prototype, "sepia", {
        get: function() {
            return this.uniforms.sepia.value;
        },
        set: function(a) {
            this.uniforms.sepia.value = a;
        }
    }), b.TwistFilter = function() {
        b.AbstractFilter.call(this), this.passes = [ this ], this.uniforms = {
            radius: {
                type: "1f",
                value: .5
            },
            angle: {
                type: "1f",
                value: 5
            },
            offset: {
                type: "2f",
                value: {
                    x: .5,
                    y: .5
                }
            }
        }, this.fragmentSrc = [ "precision mediump float;", "varying vec2 vTextureCoord;", "varying vec4 vColor;", "uniform vec4 dimensions;", "uniform sampler2D uSampler;", "uniform float radius;", "uniform float angle;", "uniform vec2 offset;", "void main(void) {", "   vec2 coord = vTextureCoord - offset;", "   float distance = length(coord);", "   if (distance < radius) {", "       float ratio = (radius - distance) / radius;", "       float angleMod = ratio * ratio * angle;", "       float s = sin(angleMod);", "       float c = cos(angleMod);", "       coord = vec2(coord.x * c - coord.y * s, coord.x * s + coord.y * c);", "   }", "   gl_FragColor = texture2D(uSampler, coord+offset);", "}" ];
    }, b.TwistFilter.prototype = Object.create(b.AbstractFilter.prototype), b.TwistFilter.prototype.constructor = b.TwistFilter, 
    Object.defineProperty(b.TwistFilter.prototype, "offset", {
        get: function() {
            return this.uniforms.offset.value;
        },
        set: function(a) {
            this.dirty = !0, this.uniforms.offset.value = a;
        }
    }), Object.defineProperty(b.TwistFilter.prototype, "radius", {
        get: function() {
            return this.uniforms.radius.value;
        },
        set: function(a) {
            this.dirty = !0, this.uniforms.radius.value = a;
        }
    }), Object.defineProperty(b.TwistFilter.prototype, "angle", {
        get: function() {
            return this.uniforms.angle.value;
        },
        set: function(a) {
            this.dirty = !0, this.uniforms.angle.value = a;
        }
    }), b.ColorStepFilter = function() {
        b.AbstractFilter.call(this), this.passes = [ this ], this.uniforms = {
            step: {
                type: "1f",
                value: 5
            }
        }, this.fragmentSrc = [ "precision mediump float;", "varying vec2 vTextureCoord;", "varying vec4 vColor;", "uniform sampler2D uSampler;", "uniform float step;", "void main(void) {", "   vec4 color = texture2D(uSampler, vTextureCoord);", "   color = floor(color * step) / step;", "   gl_FragColor = color;", "}" ];
    }, b.ColorStepFilter.prototype = Object.create(b.AbstractFilter.prototype), b.ColorStepFilter.prototype.constructor = b.ColorStepFilter, 
    Object.defineProperty(b.ColorStepFilter.prototype, "step", {
        get: function() {
            return this.uniforms.step.value;
        },
        set: function(a) {
            this.uniforms.step.value = a;
        }
    }), b.DotScreenFilter = function() {
        b.AbstractFilter.call(this), this.passes = [ this ], this.uniforms = {
            scale: {
                type: "1f",
                value: 1
            },
            angle: {
                type: "1f",
                value: 5
            },
            dimensions: {
                type: "4fv",
                value: [ 0, 0, 0, 0 ]
            }
        }, this.fragmentSrc = [ "precision mediump float;", "varying vec2 vTextureCoord;", "varying vec4 vColor;", "uniform vec4 dimensions;", "uniform sampler2D uSampler;", "uniform float angle;", "uniform float scale;", "float pattern() {", "   float s = sin(angle), c = cos(angle);", "   vec2 tex = vTextureCoord * dimensions.xy;", "   vec2 point = vec2(", "       c * tex.x - s * tex.y,", "       s * tex.x + c * tex.y", "   ) * scale;", "   return (sin(point.x) * sin(point.y)) * 4.0;", "}", "void main() {", "   vec4 color = texture2D(uSampler, vTextureCoord);", "   float average = (color.r + color.g + color.b) / 3.0;", "   gl_FragColor = vec4(vec3(average * 10.0 - 5.0 + pattern()), color.a);", "}" ];
    }, b.DotScreenFilter.prototype = Object.create(b.AbstractFilter.prototype), b.DotScreenFilter.prototype.constructor = b.DotScreenFilter, 
    Object.defineProperty(b.DotScreenFilter.prototype, "scale", {
        get: function() {
            return this.uniforms.scale.value;
        },
        set: function(a) {
            this.dirty = !0, this.uniforms.scale.value = a;
        }
    }), Object.defineProperty(b.DotScreenFilter.prototype, "angle", {
        get: function() {
            return this.uniforms.angle.value;
        },
        set: function(a) {
            this.dirty = !0, this.uniforms.angle.value = a;
        }
    }), b.CrossHatchFilter = function() {
        b.AbstractFilter.call(this), this.passes = [ this ], this.uniforms = {
            blur: {
                type: "1f",
                value: 1 / 512
            }
        }, this.fragmentSrc = [ "precision mediump float;", "varying vec2 vTextureCoord;", "varying vec4 vColor;", "uniform float blur;", "uniform sampler2D uSampler;", "void main(void) {", "    float lum = length(texture2D(uSampler, vTextureCoord.xy).rgb);", "    gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);", "    if (lum < 1.00) {", "        if (mod(gl_FragCoord.x + gl_FragCoord.y, 10.0) == 0.0) {", "            gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);", "        }", "    }", "    if (lum < 0.75) {", "        if (mod(gl_FragCoord.x - gl_FragCoord.y, 10.0) == 0.0) {", "            gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);", "        }", "    }", "    if (lum < 0.50) {", "        if (mod(gl_FragCoord.x + gl_FragCoord.y - 5.0, 10.0) == 0.0) {", "            gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);", "        }", "    }", "    if (lum < 0.3) {", "        if (mod(gl_FragCoord.x - gl_FragCoord.y - 5.0, 10.0) == 0.0) {", "            gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);", "        }", "    }", "}" ];
    }, b.CrossHatchFilter.prototype = Object.create(b.AbstractFilter.prototype), b.CrossHatchFilter.prototype.constructor = b.BlurYFilter, 
    Object.defineProperty(b.CrossHatchFilter.prototype, "blur", {
        get: function() {
            return this.uniforms.blur.value / (1 / 7e3);
        },
        set: function(a) {
            this.uniforms.blur.value = 1 / 7e3 * a;
        }
    }), b.RGBSplitFilter = function() {
        b.AbstractFilter.call(this), this.passes = [ this ], this.uniforms = {
            red: {
                type: "2f",
                value: {
                    x: 20,
                    y: 20
                }
            },
            green: {
                type: "2f",
                value: {
                    x: -20,
                    y: 20
                }
            },
            blue: {
                type: "2f",
                value: {
                    x: 20,
                    y: -20
                }
            },
            dimensions: {
                type: "4fv",
                value: [ 0, 0, 0, 0 ]
            }
        }, this.fragmentSrc = [ "precision mediump float;", "varying vec2 vTextureCoord;", "varying vec4 vColor;", "uniform vec2 red;", "uniform vec2 green;", "uniform vec2 blue;", "uniform vec4 dimensions;", "uniform sampler2D uSampler;", "void main(void) {", "   gl_FragColor.r = texture2D(uSampler, vTextureCoord + red/dimensions.xy).r;", "   gl_FragColor.g = texture2D(uSampler, vTextureCoord + green/dimensions.xy).g;", "   gl_FragColor.b = texture2D(uSampler, vTextureCoord + blue/dimensions.xy).b;", "   gl_FragColor.a = texture2D(uSampler, vTextureCoord).a;", "}" ];
    }, b.RGBSplitFilter.prototype = Object.create(b.AbstractFilter.prototype), b.RGBSplitFilter.prototype.constructor = b.RGBSplitFilter, 
    Object.defineProperty(b.RGBSplitFilter.prototype, "angle", {
        get: function() {
            return this.uniforms.blur.value / (1 / 7e3);
        },
        set: function(a) {
            this.uniforms.blur.value = 1 / 7e3 * a;
        }
    }), "undefined" != typeof exports ? ("undefined" != typeof module && module.exports && (exports = module.exports = b), 
    exports.PIXI = b) : "undefined" != typeof define && define.amd ? define(b) : a.PIXI = b;
}.call(this), window.Modernizr = function(a, b, c) {
    function D(a) {
        j.cssText = a;
    }
    function E(a, b) {
        return D(n.join(a + ";") + (b || ""));
    }
    function F(a, b) {
        return typeof a === b;
    }
    function G(a, b) {
        return !!~("" + a).indexOf(b);
    }
    function H(a, b) {
        for (var d in a) {
            var e = a[d];
            if (!G(e, "-") && j[e] !== c) return "pfx" == b ? e : !0;
        }
        return !1;
    }
    function I(a, b, d) {
        for (var e in a) {
            var f = b[a[e]];
            if (f !== c) return d === !1 ? a[e] : F(f, "function") ? f.bind(d || b) : f;
        }
        return !1;
    }
    function J(a, b, c) {
        var d = a.charAt(0).toUpperCase() + a.slice(1), e = (a + " " + p.join(d + " ") + d).split(" ");
        return F(b, "string") || F(b, "undefined") ? H(e, b) : (e = (a + " " + q.join(d + " ") + d).split(" "), 
        I(e, b, c));
    }
    function K() {
        e.input = function(c) {
            for (var d = 0, e = c.length; e > d; d++) u[c[d]] = c[d] in k;
            return u.list && (u.list = !!b.createElement("datalist") && !!a.HTMLDataListElement), 
            u;
        }("autocomplete autofocus list placeholder max min multiple pattern required step".split(" ")), 
        e.inputtypes = function(a) {
            for (var e, f, h, d = 0, i = a.length; i > d; d++) k.setAttribute("type", f = a[d]), 
            e = "text" !== k.type, e && (k.value = l, k.style.cssText = "position:absolute;visibility:hidden;", 
            /^range$/.test(f) && k.style.WebkitAppearance !== c ? (g.appendChild(k), h = b.defaultView, 
            e = h.getComputedStyle && "textfield" !== h.getComputedStyle(k, null).WebkitAppearance && 0 !== k.offsetHeight, 
            g.removeChild(k)) : /^(search|tel)$/.test(f) || (e = /^(url|email)$/.test(f) ? k.checkValidity && k.checkValidity() === !1 : k.value != l)), 
            t[a[d]] = !!e;
            return t;
        }("search tel url email datetime date month week time datetime-local number range color".split(" "));
    }
    var x, C, d = "2.7.1", e = {}, f = !0, g = b.documentElement, h = "modernizr", i = b.createElement(h), j = i.style, k = b.createElement("input"), l = ":)", m = {}.toString, n = " -webkit- -moz- -o- -ms- ".split(" "), o = "Webkit Moz O ms", p = o.split(" "), q = o.toLowerCase().split(" "), r = {
        svg: "http://www.w3.org/2000/svg"
    }, s = {}, t = {}, u = {}, v = [], w = v.slice, y = function(a, c, d, e) {
        var f, i, j, k, l = b.createElement("div"), m = b.body, n = m || b.createElement("body");
        if (parseInt(d, 10)) for (;d--; ) j = b.createElement("div"), j.id = e ? e[d] : h + (d + 1), 
        l.appendChild(j);
        return f = [ "&#173;", '<style id="s', h, '">', a, "</style>" ].join(""), l.id = h, 
        (m ? l : n).innerHTML += f, n.appendChild(l), m || (n.style.background = "", n.style.overflow = "hidden", 
        k = g.style.overflow, g.style.overflow = "hidden", g.appendChild(n)), i = c(l, a), 
        m ? l.parentNode.removeChild(l) : (n.parentNode.removeChild(n), g.style.overflow = k), 
        !!i;
    }, z = function(b) {
        var c = a.matchMedia || a.msMatchMedia;
        if (c) return c(b).matches;
        var d;
        return y("@media " + b + " { #" + h + " { position: absolute; } }", function(b) {
            d = "absolute" == (a.getComputedStyle ? getComputedStyle(b, null) : b.currentStyle).position;
        }), d;
    }, A = function() {
        function d(d, e) {
            e = e || b.createElement(a[d] || "div"), d = "on" + d;
            var f = d in e;
            return f || (e.setAttribute || (e = b.createElement("div")), e.setAttribute && e.removeAttribute && (e.setAttribute(d, ""), 
            f = F(e[d], "function"), F(e[d], "undefined") || (e[d] = c), e.removeAttribute(d))), 
            e = null, f;
        }
        var a = {
            select: "input",
            change: "input",
            submit: "form",
            reset: "form",
            error: "img",
            load: "img",
            abort: "img"
        };
        return d;
    }(), B = {}.hasOwnProperty;
    C = F(B, "undefined") || F(B.call, "undefined") ? function(a, b) {
        return b in a && F(a.constructor.prototype[b], "undefined");
    } : function(a, b) {
        return B.call(a, b);
    }, Function.prototype.bind || (Function.prototype.bind = function(b) {
        var c = this;
        if ("function" != typeof c) throw new TypeError();
        var d = w.call(arguments, 1), e = function() {
            if (this instanceof e) {
                var a = function() {};
                a.prototype = c.prototype;
                var f = new a(), g = c.apply(f, d.concat(w.call(arguments)));
                return Object(g) === g ? g : f;
            }
            return c.apply(b, d.concat(w.call(arguments)));
        };
        return e;
    }), s.flexbox = function() {
        return J("flexWrap");
    }, s.canvas = function() {
        var a = b.createElement("canvas");
        return !!a.getContext && !!a.getContext("2d");
    }, s.canvastext = function() {
        return !!e.canvas && !!F(b.createElement("canvas").getContext("2d").fillText, "function");
    }, s.webgl = function() {
        return !!a.WebGLRenderingContext;
    }, s.touch = function() {
        var c;
        return "ontouchstart" in a || a.DocumentTouch && b instanceof DocumentTouch ? c = !0 : y([ "@media (", n.join("touch-enabled),("), h, ")", "{#modernizr{top:9px;position:absolute}}" ].join(""), function(a) {
            c = 9 === a.offsetTop;
        }), c;
    }, s.geolocation = function() {
        return "geolocation" in navigator;
    }, s.postmessage = function() {
        return !!a.postMessage;
    }, s.websqldatabase = function() {
        return !!a.openDatabase;
    }, s.indexedDB = function() {
        return !!J("indexedDB", a);
    }, s.hashchange = function() {
        return A("hashchange", a) && (b.documentMode === c || b.documentMode > 7);
    }, s.history = function() {
        return !!a.history && !!history.pushState;
    }, s.draganddrop = function() {
        var a = b.createElement("div");
        return "draggable" in a || "ondragstart" in a && "ondrop" in a;
    }, s.websockets = function() {
        return "WebSocket" in a || "MozWebSocket" in a;
    }, s.rgba = function() {
        return D("background-color:rgba(150,255,150,.5)"), G(j.backgroundColor, "rgba");
    }, s.hsla = function() {
        return D("background-color:hsla(120,40%,100%,.5)"), G(j.backgroundColor, "rgba") || G(j.backgroundColor, "hsla");
    }, s.multiplebgs = function() {
        return D("background:url(https://),url(https://),red url(https://)"), /(url\s*\(.*?){3}/.test(j.background);
    }, s.backgroundsize = function() {
        return J("backgroundSize");
    }, s.borderimage = function() {
        return J("borderImage");
    }, s.borderradius = function() {
        return J("borderRadius");
    }, s.boxshadow = function() {
        return J("boxShadow");
    }, s.textshadow = function() {
        return "" === b.createElement("div").style.textShadow;
    }, s.opacity = function() {
        return E("opacity:.55"), /^0.55$/.test(j.opacity);
    }, s.cssanimations = function() {
        return J("animationName");
    }, s.csscolumns = function() {
        return J("columnCount");
    }, s.cssgradients = function() {
        var a = "background-image:", b = "gradient(linear,left top,right bottom,from(#9f9),to(white));", c = "linear-gradient(left top,#9f9, white);";
        return D((a + "-webkit- ".split(" ").join(b + a) + n.join(c + a)).slice(0, -a.length)), 
        G(j.backgroundImage, "gradient");
    }, s.cssreflections = function() {
        return J("boxReflect");
    }, s.csstransforms = function() {
        return !!J("transform");
    }, s.csstransforms3d = function() {
        var a = !!J("perspective");
        return a && "webkitPerspective" in g.style && y("@media (transform-3d),(-webkit-transform-3d){#modernizr{left:9px;position:absolute;height:3px;}}", function(b) {
            a = 9 === b.offsetLeft && 3 === b.offsetHeight;
        }), a;
    }, s.csstransitions = function() {
        return J("transition");
    }, s.fontface = function() {
        var a;
        return y('@font-face {font-family:"font";src:url("https://")}', function(c, d) {
            var e = b.getElementById("smodernizr"), f = e.sheet || e.styleSheet, g = f ? f.cssRules && f.cssRules[0] ? f.cssRules[0].cssText : f.cssText || "" : "";
            a = /src/i.test(g) && 0 === g.indexOf(d.split(" ")[0]);
        }), a;
    }, s.generatedcontent = function() {
        var a;
        return y([ "#", h, "{font:0/0 a}#", h, ':after{content:"', l, '";visibility:hidden;font:3px/1 a}' ].join(""), function(b) {
            a = b.offsetHeight >= 3;
        }), a;
    }, s.video = function() {
        var a = b.createElement("video"), c = !1;
        try {
            (c = !!a.canPlayType) && (c = new Boolean(c), c.ogg = a.canPlayType('video/ogg; codecs="theora"').replace(/^no$/, ""), 
            c.h264 = a.canPlayType('video/mp4; codecs="avc1.42E01E"').replace(/^no$/, ""), c.webm = a.canPlayType('video/webm; codecs="vp8, vorbis"').replace(/^no$/, ""));
        } catch (d) {}
        return c;
    }, s.audio = function() {
        var a = b.createElement("audio"), c = !1;
        try {
            (c = !!a.canPlayType) && (c = new Boolean(c), c.ogg = a.canPlayType('audio/ogg; codecs="vorbis"').replace(/^no$/, ""), 
            c.mp3 = a.canPlayType("audio/mpeg;").replace(/^no$/, ""), c.wav = a.canPlayType('audio/wav; codecs="1"').replace(/^no$/, ""), 
            c.m4a = (a.canPlayType("audio/x-m4a;") || a.canPlayType("audio/aac;")).replace(/^no$/, ""));
        } catch (d) {}
        return c;
    }, s.localstorage = function() {
        try {
            return localStorage.setItem(h, h), localStorage.removeItem(h), !0;
        } catch (a) {
            return !1;
        }
    }, s.sessionstorage = function() {
        try {
            return sessionStorage.setItem(h, h), sessionStorage.removeItem(h), !0;
        } catch (a) {
            return !1;
        }
    }, s.webworkers = function() {
        return !!a.Worker;
    }, s.applicationcache = function() {
        return !!a.applicationCache;
    }, s.svg = function() {
        return !!b.createElementNS && !!b.createElementNS(r.svg, "svg").createSVGRect;
    }, s.inlinesvg = function() {
        var a = b.createElement("div");
        return a.innerHTML = "<svg/>", (a.firstChild && a.firstChild.namespaceURI) == r.svg;
    }, s.smil = function() {
        return !!b.createElementNS && /SVGAnimate/.test(m.call(b.createElementNS(r.svg, "animate")));
    }, s.svgclippaths = function() {
        return !!b.createElementNS && /SVGClipPath/.test(m.call(b.createElementNS(r.svg, "clipPath")));
    };
    for (var L in s) C(s, L) && (x = L.toLowerCase(), e[x] = s[L](), v.push((e[x] ? "" : "no-") + x));
    return e.input || K(), e.addTest = function(a, b) {
        if ("object" == typeof a) for (var d in a) C(a, d) && e.addTest(d, a[d]); else {
            if (a = a.toLowerCase(), e[a] !== c) return e;
            b = "function" == typeof b ? b() : b, "undefined" != typeof f && f && (g.className += " " + (b ? "" : "no-") + a), 
            e[a] = b;
        }
        return e;
    }, D(""), i = k = null, function(a, b) {
        function l(a, b) {
            var c = a.createElement("p"), d = a.getElementsByTagName("head")[0] || a.documentElement;
            return c.innerHTML = "x<style>" + b + "</style>", d.insertBefore(c.lastChild, d.firstChild);
        }
        function m() {
            var a = s.elements;
            return "string" == typeof a ? a.split(" ") : a;
        }
        function n(a) {
            var b = j[a[h]];
            return b || (b = {}, i++, a[h] = i, j[i] = b), b;
        }
        function o(a, c, d) {
            if (c || (c = b), k) return c.createElement(a);
            d || (d = n(c));
            var g;
            return g = d.cache[a] ? d.cache[a].cloneNode() : f.test(a) ? (d.cache[a] = d.createElem(a)).cloneNode() : d.createElem(a), 
            !g.canHaveChildren || e.test(a) || g.tagUrn ? g : d.frag.appendChild(g);
        }
        function p(a, c) {
            if (a || (a = b), k) return a.createDocumentFragment();
            c = c || n(a);
            for (var d = c.frag.cloneNode(), e = 0, f = m(), g = f.length; g > e; e++) d.createElement(f[e]);
            return d;
        }
        function q(a, b) {
            b.cache || (b.cache = {}, b.createElem = a.createElement, b.createFrag = a.createDocumentFragment, 
            b.frag = b.createFrag()), a.createElement = function(c) {
                return s.shivMethods ? o(c, a, b) : b.createElem(c);
            }, a.createDocumentFragment = Function("h,f", "return function(){var n=f.cloneNode(),c=n.createElement;h.shivMethods&&(" + m().join().replace(/[\w\-]+/g, function(a) {
                return b.createElem(a), b.frag.createElement(a), 'c("' + a + '")';
            }) + ");return n}")(s, b.frag);
        }
        function r(a) {
            a || (a = b);
            var c = n(a);
            return s.shivCSS && !g && !c.hasCSS && (c.hasCSS = !!l(a, "article,aside,dialog,figcaption,figure,footer,header,hgroup,main,nav,section{display:block}mark{background:#FF0;color:#000}template{display:none}")), 
            k || q(a, c), a;
        }
        var g, k, c = "3.7.0", d = a.html5 || {}, e = /^<|^(?:button|map|select|textarea|object|iframe|option|optgroup)$/i, f = /^(?:a|b|code|div|fieldset|h1|h2|h3|h4|h5|h6|i|label|li|ol|p|q|span|strong|style|table|tbody|td|th|tr|ul)$/i, h = "_html5shiv", i = 0, j = {};
        !function() {
            try {
                var a = b.createElement("a");
                a.innerHTML = "<xyz></xyz>", g = "hidden" in a, k = 1 == a.childNodes.length || function() {
                    b.createElement("a");
                    var a = b.createDocumentFragment();
                    return "undefined" == typeof a.cloneNode || "undefined" == typeof a.createDocumentFragment || "undefined" == typeof a.createElement;
                }();
            } catch (c) {
                g = !0, k = !0;
            }
        }();
        var s = {
            elements: d.elements || "abbr article aside audio bdi canvas data datalist details dialog figcaption figure footer header hgroup main mark meter nav output progress section summary template time video",
            version: c,
            shivCSS: d.shivCSS !== !1,
            supportsUnknownElements: k,
            shivMethods: d.shivMethods !== !1,
            type: "default",
            shivDocument: r,
            createElement: o,
            createDocumentFragment: p
        };
        a.html5 = s, r(b);
    }(this, b), e._version = d, e._prefixes = n, e._domPrefixes = q, e._cssomPrefixes = p, 
    e.mq = z, e.hasEvent = A, e.testProp = function(a) {
        return H([ a ]);
    }, e.testAllProps = J, e.testStyles = y, e.prefixed = function(a, b, c) {
        return b ? J(a, b, c) : J(a, "pfx");
    }, g.className = g.className.replace(/(^|\s)no-js(\s|$)/, "$1$2") + (f ? " js " + v.join(" ") : ""), 
    e;
}(this, this.document), function(a, b, c) {
    function d(a) {
        return "[object Function]" == o.call(a);
    }
    function e(a) {
        return "string" == typeof a;
    }
    function f() {}
    function g(a) {
        return !a || "loaded" == a || "complete" == a || "uninitialized" == a;
    }
    function h() {
        var a = p.shift();
        q = 1, a ? a.t ? m(function() {
            ("c" == a.t ? B.injectCss : B.injectJs)(a.s, 0, a.a, a.x, a.e, 1);
        }, 0) : (a(), h()) : q = 0;
    }
    function i(a, c, d, e, f, i, j) {
        function k(b) {
            if (!o && g(l.readyState) && (u.r = o = 1, !q && h(), l.onload = l.onreadystatechange = null, 
            b)) {
                "img" != a && m(function() {
                    t.removeChild(l);
                }, 50);
                for (var d in y[c]) y[c].hasOwnProperty(d) && y[c][d].onload();
            }
        }
        var j = j || B.errorTimeout, l = b.createElement(a), o = 0, r = 0, u = {
            t: d,
            s: c,
            e: f,
            a: i,
            x: j
        };
        1 === y[c] && (r = 1, y[c] = []), "object" == a ? l.data = c : (l.src = c, l.type = a), 
        l.width = l.height = "0", l.onerror = l.onload = l.onreadystatechange = function() {
            k.call(this, r);
        }, p.splice(e, 0, u), "img" != a && (r || 2 === y[c] ? (t.insertBefore(l, s ? null : n), 
        m(k, j)) : y[c].push(l));
    }
    function j(a, b, c, d, f) {
        return q = 0, b = b || "j", e(a) ? i("c" == b ? v : u, a, b, this.i++, c, d, f) : (p.splice(this.i++, 0, a), 
        1 == p.length && h()), this;
    }
    function k() {
        var a = B;
        return a.loader = {
            load: j,
            i: 0
        }, a;
    }
    var A, B, l = b.documentElement, m = a.setTimeout, n = b.getElementsByTagName("script")[0], o = {}.toString, p = [], q = 0, r = "MozAppearance" in l.style, s = r && !!b.createRange().compareNode, t = s ? l : n.parentNode, l = a.opera && "[object Opera]" == o.call(a.opera), l = !!b.attachEvent && !l, u = r ? "object" : l ? "script" : "img", v = l ? "script" : u, w = Array.isArray || function(a) {
        return "[object Array]" == o.call(a);
    }, x = [], y = {}, z = {
        timeout: function(a, b) {
            return b.length && (a.timeout = b[0]), a;
        }
    };
    B = function(a) {
        function b(a) {
            var e, f, g, a = a.split("!"), b = x.length, c = a.pop(), d = a.length, c = {
                url: c,
                origUrl: c,
                prefixes: a
            };
            for (f = 0; d > f; f++) g = a[f].split("="), (e = z[g.shift()]) && (c = e(c, g));
            for (f = 0; b > f; f++) c = x[f](c);
            return c;
        }
        function g(a, e, f, g, h) {
            var i = b(a), j = i.autoCallback;
            i.url.split(".").pop().split("?").shift(), i.bypass || (e && (e = d(e) ? e : e[a] || e[g] || e[a.split("/").pop().split("?")[0]]), 
            i.instead ? i.instead(a, e, f, g, h) : (y[i.url] ? i.noexec = !0 : y[i.url] = 1, 
            f.load(i.url, i.forceCSS || !i.forceJS && "css" == i.url.split(".").pop().split("?").shift() ? "c" : c, i.noexec, i.attrs, i.timeout), 
            (d(e) || d(j)) && f.load(function() {
                k(), e && e(i.origUrl, h, g), j && j(i.origUrl, h, g), y[i.url] = 2;
            })));
        }
        function h(a, b) {
            function c(a, c) {
                if (a) {
                    if (e(a)) c || (j = function() {
                        var a = [].slice.call(arguments);
                        k.apply(this, a), l();
                    }), g(a, j, b, 0, h); else if (Object(a) === a) for (n in m = function() {
                        var c, b = 0;
                        for (c in a) a.hasOwnProperty(c) && b++;
                        return b;
                    }(), a) a.hasOwnProperty(n) && (!c && !--m && (d(j) ? j = function() {
                        var a = [].slice.call(arguments);
                        k.apply(this, a), l();
                    } : j[n] = function(a) {
                        return function() {
                            var b = [].slice.call(arguments);
                            a && a.apply(this, b), l();
                        };
                    }(k[n])), g(a[n], j, b, n, h));
                } else !c && l();
            }
            var m, n, h = !!a.test, i = a.load || a.both, j = a.callback || f, k = j, l = a.complete || f;
            c(h ? a.yep : a.nope, !!i), i && c(i);
        }
        var i, j, l = this.yepnope.loader;
        if (e(a)) g(a, 0, l, 0); else if (w(a)) for (i = 0; i < a.length; i++) j = a[i], 
        e(j) ? g(j, 0, l, 0) : w(j) ? B(j) : Object(j) === j && h(j, l); else Object(a) === a && h(a, l);
    }, B.addPrefix = function(a, b) {
        z[a] = b;
    }, B.addFilter = function(a) {
        x.push(a);
    }, B.errorTimeout = 1e4, null == b.readyState && b.addEventListener && (b.readyState = "loading", 
    b.addEventListener("DOMContentLoaded", A = function() {
        b.removeEventListener("DOMContentLoaded", A, 0), b.readyState = "complete";
    }, 0)), a.yepnope = k(), a.yepnope.executeStack = h, a.yepnope.injectJs = function(a, c, d, e, i, j) {
        var l, o, k = b.createElement("script"), e = e || B.errorTimeout;
        k.src = a;
        for (o in d) k.setAttribute(o, d[o]);
        c = j ? h : c || f, k.onreadystatechange = k.onload = function() {
            !l && g(k.readyState) && (l = 1, c(), k.onload = k.onreadystatechange = null);
        }, m(function() {
            l || (l = 1, c(1));
        }, e), i ? k.onload() : n.parentNode.insertBefore(k, n);
    }, a.yepnope.injectCss = function(a, c, d, e, g, i) {
        var j, e = b.createElement("link"), c = i ? h : c || f;
        e.href = a, e.rel = "stylesheet", e.type = "text/css";
        for (j in d) e.setAttribute(j, d[j]);
        g || (n.parentNode.insertBefore(e, n), m(c, 0));
    };
}(this, document), Modernizr.load = function() {
    yepnope.apply(window, [].slice.call(arguments, 0));
}, !function(a, b) {
    "object" == typeof module && "object" == typeof module.exports ? module.exports = a.document ? b(a, !0) : function(a) {
        if (!a.document) throw new Error("jQuery requires a window with a document");
        return b(a);
    } : b(a);
}("undefined" != typeof window ? window : this, function(a, b) {
    function s(a) {
        var b = a.length, c = n.type(a);
        return "function" === c || n.isWindow(a) ? !1 : 1 === a.nodeType && b ? !0 : "array" === c || 0 === b || "number" == typeof b && b > 0 && b - 1 in a;
    }
    function x(a, b, c) {
        if (n.isFunction(b)) return n.grep(a, function(a, d) {
            return !!b.call(a, d, a) !== c;
        });
        if (b.nodeType) return n.grep(a, function(a) {
            return a === b !== c;
        });
        if ("string" == typeof b) {
            if (w.test(b)) return n.filter(b, a, c);
            b = n.filter(b, a);
        }
        return n.grep(a, function(a) {
            return n.inArray(a, b) >= 0 !== c;
        });
    }
    function E(a, b) {
        do a = a[b]; while (a && 1 !== a.nodeType);
        return a;
    }
    function H(a) {
        var b = G[a] = {};
        return n.each(a.match(F) || [], function(a, c) {
            b[c] = !0;
        }), b;
    }
    function J() {
        z.addEventListener ? (z.removeEventListener("DOMContentLoaded", K, !1), a.removeEventListener("load", K, !1)) : (z.detachEvent("onreadystatechange", K), 
        a.detachEvent("onload", K));
    }
    function K() {
        (z.addEventListener || "load" === event.type || "complete" === z.readyState) && (J(), 
        n.ready());
    }
    function P(a, b, c) {
        if (void 0 === c && 1 === a.nodeType) {
            var d = "data-" + b.replace(O, "-$1").toLowerCase();
            if (c = a.getAttribute(d), "string" == typeof c) {
                try {
                    c = "true" === c ? !0 : "false" === c ? !1 : "null" === c ? null : +c + "" === c ? +c : N.test(c) ? n.parseJSON(c) : c;
                } catch (e) {}
                n.data(a, b, c);
            } else c = void 0;
        }
        return c;
    }
    function Q(a) {
        var b;
        for (b in a) if (("data" !== b || !n.isEmptyObject(a[b])) && "toJSON" !== b) return !1;
        return !0;
    }
    function R(a, b, d, e) {
        if (n.acceptData(a)) {
            var f, g, h = n.expando, i = a.nodeType, j = i ? n.cache : a, k = i ? a[h] : a[h] && h;
            if (k && j[k] && (e || j[k].data) || void 0 !== d || "string" != typeof b) return k || (k = i ? a[h] = c.pop() || n.guid++ : h), 
            j[k] || (j[k] = i ? {} : {
                toJSON: n.noop
            }), ("object" == typeof b || "function" == typeof b) && (e ? j[k] = n.extend(j[k], b) : j[k].data = n.extend(j[k].data, b)), 
            g = j[k], e || (g.data || (g.data = {}), g = g.data), void 0 !== d && (g[n.camelCase(b)] = d), 
            "string" == typeof b ? (f = g[b], null == f && (f = g[n.camelCase(b)])) : f = g, 
            f;
        }
    }
    function S(a, b, c) {
        if (n.acceptData(a)) {
            var d, e, f = a.nodeType, g = f ? n.cache : a, h = f ? a[n.expando] : n.expando;
            if (g[h]) {
                if (b && (d = c ? g[h] : g[h].data)) {
                    n.isArray(b) ? b = b.concat(n.map(b, n.camelCase)) : b in d ? b = [ b ] : (b = n.camelCase(b), 
                    b = b in d ? [ b ] : b.split(" ")), e = b.length;
                    for (;e--; ) delete d[b[e]];
                    if (c ? !Q(d) : !n.isEmptyObject(d)) return;
                }
                (c || (delete g[h].data, Q(g[h]))) && (f ? n.cleanData([ a ], !0) : l.deleteExpando || g != g.window ? delete g[h] : g[h] = null);
            }
        }
    }
    function bb() {
        return !0;
    }
    function cb() {
        return !1;
    }
    function db() {
        try {
            return z.activeElement;
        } catch (a) {}
    }
    function eb(a) {
        var b = fb.split("|"), c = a.createDocumentFragment();
        if (c.createElement) for (;b.length; ) c.createElement(b.pop());
        return c;
    }
    function vb(a, b) {
        var c, d, e = 0, f = typeof a.getElementsByTagName !== L ? a.getElementsByTagName(b || "*") : typeof a.querySelectorAll !== L ? a.querySelectorAll(b || "*") : void 0;
        if (!f) for (f = [], c = a.childNodes || a; null != (d = c[e]); e++) !b || n.nodeName(d, b) ? f.push(d) : n.merge(f, vb(d, b));
        return void 0 === b || b && n.nodeName(a, b) ? n.merge([ a ], f) : f;
    }
    function wb(a) {
        X.test(a.type) && (a.defaultChecked = a.checked);
    }
    function xb(a, b) {
        return n.nodeName(a, "table") && n.nodeName(11 !== b.nodeType ? b : b.firstChild, "tr") ? a.getElementsByTagName("tbody")[0] || a.appendChild(a.ownerDocument.createElement("tbody")) : a;
    }
    function yb(a) {
        return a.type = (null !== n.find.attr(a, "type")) + "/" + a.type, a;
    }
    function zb(a) {
        var b = qb.exec(a.type);
        return b ? a.type = b[1] : a.removeAttribute("type"), a;
    }
    function Ab(a, b) {
        for (var c, d = 0; null != (c = a[d]); d++) n._data(c, "globalEval", !b || n._data(b[d], "globalEval"));
    }
    function Bb(a, b) {
        if (1 === b.nodeType && n.hasData(a)) {
            var c, d, e, f = n._data(a), g = n._data(b, f), h = f.events;
            if (h) {
                delete g.handle, g.events = {};
                for (c in h) for (d = 0, e = h[c].length; e > d; d++) n.event.add(b, c, h[c][d]);
            }
            g.data && (g.data = n.extend({}, g.data));
        }
    }
    function Cb(a, b) {
        var c, d, e;
        if (1 === b.nodeType) {
            if (c = b.nodeName.toLowerCase(), !l.noCloneEvent && b[n.expando]) {
                e = n._data(b);
                for (d in e.events) n.removeEvent(b, d, e.handle);
                b.removeAttribute(n.expando);
            }
            "script" === c && b.text !== a.text ? (yb(b).text = a.text, zb(b)) : "object" === c ? (b.parentNode && (b.outerHTML = a.outerHTML), 
            l.html5Clone && a.innerHTML && !n.trim(b.innerHTML) && (b.innerHTML = a.innerHTML)) : "input" === c && X.test(a.type) ? (b.defaultChecked = b.checked = a.checked, 
            b.value !== a.value && (b.value = a.value)) : "option" === c ? b.defaultSelected = b.selected = a.defaultSelected : ("input" === c || "textarea" === c) && (b.defaultValue = a.defaultValue);
        }
    }
    function Fb(b, c) {
        var d = n(c.createElement(b)).appendTo(c.body), e = a.getDefaultComputedStyle ? a.getDefaultComputedStyle(d[0]).display : n.css(d[0], "display");
        return d.detach(), e;
    }
    function Gb(a) {
        var b = z, c = Eb[a];
        return c || (c = Fb(a, b), "none" !== c && c || (Db = (Db || n("<iframe frameborder='0' width='0' height='0'/>")).appendTo(b.documentElement), 
        b = (Db[0].contentWindow || Db[0].contentDocument).document, b.write(), b.close(), 
        c = Fb(a, b), Db.detach()), Eb[a] = c), c;
    }
    function Mb(a, b) {
        return {
            get: function() {
                var c = a();
                return null != c ? c ? void delete this.get : (this.get = b).apply(this, arguments) : void 0;
            }
        };
    }
    function Vb(a, b) {
        if (b in a) return b;
        for (var c = b.charAt(0).toUpperCase() + b.slice(1), d = b, e = Ub.length; e--; ) if (b = Ub[e] + c, 
        b in a) return b;
        return d;
    }
    function Wb(a, b) {
        for (var c, d, e, f = [], g = 0, h = a.length; h > g; g++) d = a[g], d.style && (f[g] = n._data(d, "olddisplay"), 
        c = d.style.display, b ? (f[g] || "none" !== c || (d.style.display = ""), "" === d.style.display && V(d) && (f[g] = n._data(d, "olddisplay", Gb(d.nodeName)))) : f[g] || (e = V(d), 
        (c && "none" !== c || !e) && n._data(d, "olddisplay", e ? c : n.css(d, "display"))));
        for (g = 0; h > g; g++) d = a[g], d.style && (b && "none" !== d.style.display && "" !== d.style.display || (d.style.display = b ? f[g] || "" : "none"));
        return a;
    }
    function Xb(a, b, c) {
        var d = Qb.exec(b);
        return d ? Math.max(0, d[1] - (c || 0)) + (d[2] || "px") : b;
    }
    function Yb(a, b, c, d, e) {
        for (var f = c === (d ? "border" : "content") ? 4 : "width" === b ? 1 : 0, g = 0; 4 > f; f += 2) "margin" === c && (g += n.css(a, c + U[f], !0, e)), 
        d ? ("content" === c && (g -= n.css(a, "padding" + U[f], !0, e)), "margin" !== c && (g -= n.css(a, "border" + U[f] + "Width", !0, e))) : (g += n.css(a, "padding" + U[f], !0, e), 
        "padding" !== c && (g += n.css(a, "border" + U[f] + "Width", !0, e)));
        return g;
    }
    function Zb(a, b, c) {
        var d = !0, e = "width" === b ? a.offsetWidth : a.offsetHeight, f = Jb(a), g = l.boxSizing() && "border-box" === n.css(a, "boxSizing", !1, f);
        if (0 >= e || null == e) {
            if (e = Kb(a, b, f), (0 > e || null == e) && (e = a.style[b]), Ib.test(e)) return e;
            d = g && (l.boxSizingReliable() || e === a.style[b]), e = parseFloat(e) || 0;
        }
        return e + Yb(a, b, c || (g ? "border" : "content"), d, f) + "px";
    }
    function $b(a, b, c, d, e) {
        return new $b.prototype.init(a, b, c, d, e);
    }
    function gc() {
        return setTimeout(function() {
            _b = void 0;
        }), _b = n.now();
    }
    function hc(a, b) {
        var c, d = {
            height: a
        }, e = 0;
        for (b = b ? 1 : 0; 4 > e; e += 2 - b) c = U[e], d["margin" + c] = d["padding" + c] = a;
        return b && (d.opacity = d.width = a), d;
    }
    function ic(a, b, c) {
        for (var d, e = (fc[b] || []).concat(fc["*"]), f = 0, g = e.length; g > f; f++) if (d = e[f].call(c, b, a)) return d;
    }
    function jc(a, b, c) {
        var d, e, f, g, h, i, j, k, m = this, o = {}, p = a.style, q = a.nodeType && V(a), r = n._data(a, "fxshow");
        c.queue || (h = n._queueHooks(a, "fx"), null == h.unqueued && (h.unqueued = 0, i = h.empty.fire, 
        h.empty.fire = function() {
            h.unqueued || i();
        }), h.unqueued++, m.always(function() {
            m.always(function() {
                h.unqueued--, n.queue(a, "fx").length || h.empty.fire();
            });
        })), 1 === a.nodeType && ("height" in b || "width" in b) && (c.overflow = [ p.overflow, p.overflowX, p.overflowY ], 
        j = n.css(a, "display"), k = Gb(a.nodeName), "none" === j && (j = k), "inline" === j && "none" === n.css(a, "float") && (l.inlineBlockNeedsLayout && "inline" !== k ? p.zoom = 1 : p.display = "inline-block")), 
        c.overflow && (p.overflow = "hidden", l.shrinkWrapBlocks() || m.always(function() {
            p.overflow = c.overflow[0], p.overflowX = c.overflow[1], p.overflowY = c.overflow[2];
        }));
        for (d in b) if (e = b[d], bc.exec(e)) {
            if (delete b[d], f = f || "toggle" === e, e === (q ? "hide" : "show")) {
                if ("show" !== e || !r || void 0 === r[d]) continue;
                q = !0;
            }
            o[d] = r && r[d] || n.style(a, d);
        }
        if (!n.isEmptyObject(o)) {
            r ? "hidden" in r && (q = r.hidden) : r = n._data(a, "fxshow", {}), f && (r.hidden = !q), 
            q ? n(a).show() : m.done(function() {
                n(a).hide();
            }), m.done(function() {
                var b;
                n._removeData(a, "fxshow");
                for (b in o) n.style(a, b, o[b]);
            });
            for (d in o) g = ic(q ? r[d] : 0, d, m), d in r || (r[d] = g.start, q && (g.end = g.start, 
            g.start = "width" === d || "height" === d ? 1 : 0));
        }
    }
    function kc(a, b) {
        var c, d, e, f, g;
        for (c in a) if (d = n.camelCase(c), e = b[d], f = a[c], n.isArray(f) && (e = f[1], 
        f = a[c] = f[0]), c !== d && (a[d] = f, delete a[c]), g = n.cssHooks[d], g && "expand" in g) {
            f = g.expand(f), delete a[d];
            for (c in f) c in a || (a[c] = f[c], b[c] = e);
        } else b[d] = e;
    }
    function lc(a, b, c) {
        var d, e, f = 0, g = ec.length, h = n.Deferred().always(function() {
            delete i.elem;
        }), i = function() {
            if (e) return !1;
            for (var b = _b || gc(), c = Math.max(0, j.startTime + j.duration - b), d = c / j.duration || 0, f = 1 - d, g = 0, i = j.tweens.length; i > g; g++) j.tweens[g].run(f);
            return h.notifyWith(a, [ j, f, c ]), 1 > f && i ? c : (h.resolveWith(a, [ j ]), 
            !1);
        }, j = h.promise({
            elem: a,
            props: n.extend({}, b),
            opts: n.extend(!0, {
                specialEasing: {}
            }, c),
            originalProperties: b,
            originalOptions: c,
            startTime: _b || gc(),
            duration: c.duration,
            tweens: [],
            createTween: function(b, c) {
                var d = n.Tween(a, j.opts, b, c, j.opts.specialEasing[b] || j.opts.easing);
                return j.tweens.push(d), d;
            },
            stop: function(b) {
                var c = 0, d = b ? j.tweens.length : 0;
                if (e) return this;
                for (e = !0; d > c; c++) j.tweens[c].run(1);
                return b ? h.resolveWith(a, [ j, b ]) : h.rejectWith(a, [ j, b ]), this;
            }
        }), k = j.props;
        for (kc(k, j.opts.specialEasing); g > f; f++) if (d = ec[f].call(j, a, k, j.opts)) return d;
        return n.map(k, ic, j), n.isFunction(j.opts.start) && j.opts.start.call(a, j), n.fx.timer(n.extend(i, {
            elem: a,
            anim: j,
            queue: j.opts.queue
        })), j.progress(j.opts.progress).done(j.opts.done, j.opts.complete).fail(j.opts.fail).always(j.opts.always);
    }
    function Mc(a) {
        return function(b, c) {
            "string" != typeof b && (c = b, b = "*");
            var d, e = 0, f = b.toLowerCase().match(F) || [];
            if (n.isFunction(c)) for (;d = f[e++]; ) "+" === d.charAt(0) ? (d = d.slice(1) || "*", 
            (a[d] = a[d] || []).unshift(c)) : (a[d] = a[d] || []).push(c);
        };
    }
    function Nc(a, b, c, d) {
        function g(h) {
            var i;
            return e[h] = !0, n.each(a[h] || [], function(a, h) {
                var j = h(b, c, d);
                return "string" != typeof j || f || e[j] ? f ? !(i = j) : void 0 : (b.dataTypes.unshift(j), 
                g(j), !1);
            }), i;
        }
        var e = {}, f = a === Jc;
        return g(b.dataTypes[0]) || !e["*"] && g("*");
    }
    function Oc(a, b) {
        var c, d, e = n.ajaxSettings.flatOptions || {};
        for (d in b) void 0 !== b[d] && ((e[d] ? a : c || (c = {}))[d] = b[d]);
        return c && n.extend(!0, a, c), a;
    }
    function Pc(a, b, c) {
        for (var d, e, f, g, h = a.contents, i = a.dataTypes; "*" === i[0]; ) i.shift(), 
        void 0 === e && (e = a.mimeType || b.getResponseHeader("Content-Type"));
        if (e) for (g in h) if (h[g] && h[g].test(e)) {
            i.unshift(g);
            break;
        }
        if (i[0] in c) f = i[0]; else {
            for (g in c) {
                if (!i[0] || a.converters[g + " " + i[0]]) {
                    f = g;
                    break;
                }
                d || (d = g);
            }
            f = f || d;
        }
        return f ? (f !== i[0] && i.unshift(f), c[f]) : void 0;
    }
    function Qc(a, b, c, d) {
        var e, f, g, h, i, j = {}, k = a.dataTypes.slice();
        if (k[1]) for (g in a.converters) j[g.toLowerCase()] = a.converters[g];
        for (f = k.shift(); f; ) if (a.responseFields[f] && (c[a.responseFields[f]] = b), 
        !i && d && a.dataFilter && (b = a.dataFilter(b, a.dataType)), i = f, f = k.shift()) if ("*" === f) f = i; else if ("*" !== i && i !== f) {
            if (g = j[i + " " + f] || j["* " + f], !g) for (e in j) if (h = e.split(" "), h[1] === f && (g = j[i + " " + h[0]] || j["* " + h[0]])) {
                g === !0 ? g = j[e] : j[e] !== !0 && (f = h[0], k.unshift(h[1]));
                break;
            }
            if (g !== !0) if (g && a["throws"]) b = g(b); else try {
                b = g(b);
            } catch (l) {
                return {
                    state: "parsererror",
                    error: g ? l : "No conversion from " + i + " to " + f
                };
            }
        }
        return {
            state: "success",
            data: b
        };
    }
    function Wc(a, b, c, d) {
        var e;
        if (n.isArray(b)) n.each(b, function(b, e) {
            c || Sc.test(a) ? d(a, e) : Wc(a + "[" + ("object" == typeof e ? b : "") + "]", e, c, d);
        }); else if (c || "object" !== n.type(b)) d(a, b); else for (e in b) Wc(a + "[" + e + "]", b[e], c, d);
    }
    function $c() {
        try {
            return new a.XMLHttpRequest();
        } catch (b) {}
    }
    function _c() {
        try {
            return new a.ActiveXObject("Microsoft.XMLHTTP");
        } catch (b) {}
    }
    function ed(a) {
        return n.isWindow(a) ? a : 9 === a.nodeType ? a.defaultView || a.parentWindow : !1;
    }
    var c = [], d = c.slice, e = c.concat, f = c.push, g = c.indexOf, h = {}, i = h.toString, j = h.hasOwnProperty, k = "".trim, l = {}, m = "1.11.0", n = function(a, b) {
        return new n.fn.init(a, b);
    }, o = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, p = /^-ms-/, q = /-([\da-z])/gi, r = function(a, b) {
        return b.toUpperCase();
    };
    n.fn = n.prototype = {
        jquery: m,
        constructor: n,
        selector: "",
        length: 0,
        toArray: function() {
            return d.call(this);
        },
        get: function(a) {
            return null != a ? 0 > a ? this[a + this.length] : this[a] : d.call(this);
        },
        pushStack: function(a) {
            var b = n.merge(this.constructor(), a);
            return b.prevObject = this, b.context = this.context, b;
        },
        each: function(a, b) {
            return n.each(this, a, b);
        },
        map: function(a) {
            return this.pushStack(n.map(this, function(b, c) {
                return a.call(b, c, b);
            }));
        },
        slice: function() {
            return this.pushStack(d.apply(this, arguments));
        },
        first: function() {
            return this.eq(0);
        },
        last: function() {
            return this.eq(-1);
        },
        eq: function(a) {
            var b = this.length, c = +a + (0 > a ? b : 0);
            return this.pushStack(c >= 0 && b > c ? [ this[c] ] : []);
        },
        end: function() {
            return this.prevObject || this.constructor(null);
        },
        push: f,
        sort: c.sort,
        splice: c.splice
    }, n.extend = n.fn.extend = function() {
        var a, b, c, d, e, f, g = arguments[0] || {}, h = 1, i = arguments.length, j = !1;
        for ("boolean" == typeof g && (j = g, g = arguments[h] || {}, h++), "object" == typeof g || n.isFunction(g) || (g = {}), 
        h === i && (g = this, h--); i > h; h++) if (null != (e = arguments[h])) for (d in e) a = g[d], 
        c = e[d], g !== c && (j && c && (n.isPlainObject(c) || (b = n.isArray(c))) ? (b ? (b = !1, 
        f = a && n.isArray(a) ? a : []) : f = a && n.isPlainObject(a) ? a : {}, g[d] = n.extend(j, f, c)) : void 0 !== c && (g[d] = c));
        return g;
    }, n.extend({
        expando: "jQuery" + (m + Math.random()).replace(/\D/g, ""),
        isReady: !0,
        error: function(a) {
            throw new Error(a);
        },
        noop: function() {},
        isFunction: function(a) {
            return "function" === n.type(a);
        },
        isArray: Array.isArray || function(a) {
            return "array" === n.type(a);
        },
        isWindow: function(a) {
            return null != a && a == a.window;
        },
        isNumeric: function(a) {
            return a - parseFloat(a) >= 0;
        },
        isEmptyObject: function(a) {
            var b;
            for (b in a) return !1;
            return !0;
        },
        isPlainObject: function(a) {
            var b;
            if (!a || "object" !== n.type(a) || a.nodeType || n.isWindow(a)) return !1;
            try {
                if (a.constructor && !j.call(a, "constructor") && !j.call(a.constructor.prototype, "isPrototypeOf")) return !1;
            } catch (c) {
                return !1;
            }
            if (l.ownLast) for (b in a) return j.call(a, b);
            for (b in a) ;
            return void 0 === b || j.call(a, b);
        },
        type: function(a) {
            return null == a ? a + "" : "object" == typeof a || "function" == typeof a ? h[i.call(a)] || "object" : typeof a;
        },
        globalEval: function(b) {
            b && n.trim(b) && (a.execScript || function(b) {
                a.eval.call(a, b);
            })(b);
        },
        camelCase: function(a) {
            return a.replace(p, "ms-").replace(q, r);
        },
        nodeName: function(a, b) {
            return a.nodeName && a.nodeName.toLowerCase() === b.toLowerCase();
        },
        each: function(a, b, c) {
            var d, e = 0, f = a.length, g = s(a);
            if (c) {
                if (g) for (;f > e && (d = b.apply(a[e], c), d !== !1); e++) ; else for (e in a) if (d = b.apply(a[e], c), 
                d === !1) break;
            } else if (g) for (;f > e && (d = b.call(a[e], e, a[e]), d !== !1); e++) ; else for (e in a) if (d = b.call(a[e], e, a[e]), 
            d === !1) break;
            return a;
        },
        trim: k && !k.call("﻿ ") ? function(a) {
            return null == a ? "" : k.call(a);
        } : function(a) {
            return null == a ? "" : (a + "").replace(o, "");
        },
        makeArray: function(a, b) {
            var c = b || [];
            return null != a && (s(Object(a)) ? n.merge(c, "string" == typeof a ? [ a ] : a) : f.call(c, a)), 
            c;
        },
        inArray: function(a, b, c) {
            var d;
            if (b) {
                if (g) return g.call(b, a, c);
                for (d = b.length, c = c ? 0 > c ? Math.max(0, d + c) : c : 0; d > c; c++) if (c in b && b[c] === a) return c;
            }
            return -1;
        },
        merge: function(a, b) {
            for (var c = +b.length, d = 0, e = a.length; c > d; ) a[e++] = b[d++];
            if (c !== c) for (;void 0 !== b[d]; ) a[e++] = b[d++];
            return a.length = e, a;
        },
        grep: function(a, b, c) {
            for (var d, e = [], f = 0, g = a.length, h = !c; g > f; f++) d = !b(a[f], f), d !== h && e.push(a[f]);
            return e;
        },
        map: function(a, b, c) {
            var d, f = 0, g = a.length, h = s(a), i = [];
            if (h) for (;g > f; f++) d = b(a[f], f, c), null != d && i.push(d); else for (f in a) d = b(a[f], f, c), 
            null != d && i.push(d);
            return e.apply([], i);
        },
        guid: 1,
        proxy: function(a, b) {
            var c, e, f;
            return "string" == typeof b && (f = a[b], b = a, a = f), n.isFunction(a) ? (c = d.call(arguments, 2), 
            e = function() {
                return a.apply(b || this, c.concat(d.call(arguments)));
            }, e.guid = a.guid = a.guid || n.guid++, e) : void 0;
        },
        now: function() {
            return +new Date();
        },
        support: l
    }), n.each("Boolean Number String Function Array Date RegExp Object Error".split(" "), function(a, b) {
        h["[object " + b + "]"] = b.toLowerCase();
    });
    var t = function(a) {
        function db(a, b, d, e) {
            var f, g, h, i, j, m, p, q, u, v;
            if ((b ? b.ownerDocument || b : t) !== l && k(b), b = b || l, d = d || [], !a || "string" != typeof a) return d;
            if (1 !== (i = b.nodeType) && 9 !== i) return [];
            if (n && !e) {
                if (f = Z.exec(a)) if (h = f[1]) {
                    if (9 === i) {
                        if (g = b.getElementById(h), !g || !g.parentNode) return d;
                        if (g.id === h) return d.push(g), d;
                    } else if (b.ownerDocument && (g = b.ownerDocument.getElementById(h)) && r(b, g) && g.id === h) return d.push(g), 
                    d;
                } else {
                    if (f[2]) return G.apply(d, b.getElementsByTagName(a)), d;
                    if ((h = f[3]) && c.getElementsByClassName && b.getElementsByClassName) return G.apply(d, b.getElementsByClassName(h)), 
                    d;
                }
                if (c.qsa && (!o || !o.test(a))) {
                    if (q = p = s, u = b, v = 9 === i && a, 1 === i && "object" !== b.nodeName.toLowerCase()) {
                        for (m = ob(a), (p = b.getAttribute("id")) ? q = p.replace(_, "\\$&") : b.setAttribute("id", q), 
                        q = "[id='" + q + "'] ", j = m.length; j--; ) m[j] = q + pb(m[j]);
                        u = $.test(a) && mb(b.parentNode) || b, v = m.join(",");
                    }
                    if (v) try {
                        return G.apply(d, u.querySelectorAll(v)), d;
                    } catch (w) {} finally {
                        p || b.removeAttribute("id");
                    }
                }
            }
            return xb(a.replace(P, "$1"), b, d, e);
        }
        function eb() {
            function b(c, e) {
                return a.push(c + " ") > d.cacheLength && delete b[a.shift()], b[c + " "] = e;
            }
            var a = [];
            return b;
        }
        function fb(a) {
            return a[s] = !0, a;
        }
        function gb(a) {
            var b = l.createElement("div");
            try {
                return !!a(b);
            } catch (c) {
                return !1;
            } finally {
                b.parentNode && b.parentNode.removeChild(b), b = null;
            }
        }
        function hb(a, b) {
            for (var c = a.split("|"), e = a.length; e--; ) d.attrHandle[c[e]] = b;
        }
        function ib(a, b) {
            var c = b && a, d = c && 1 === a.nodeType && 1 === b.nodeType && (~b.sourceIndex || B) - (~a.sourceIndex || B);
            if (d) return d;
            if (c) for (;c = c.nextSibling; ) if (c === b) return -1;
            return a ? 1 : -1;
        }
        function jb(a) {
            return function(b) {
                var c = b.nodeName.toLowerCase();
                return "input" === c && b.type === a;
            };
        }
        function kb(a) {
            return function(b) {
                var c = b.nodeName.toLowerCase();
                return ("input" === c || "button" === c) && b.type === a;
            };
        }
        function lb(a) {
            return fb(function(b) {
                return b = +b, fb(function(c, d) {
                    for (var e, f = a([], c.length, b), g = f.length; g--; ) c[e = f[g]] && (c[e] = !(d[e] = c[e]));
                });
            });
        }
        function mb(a) {
            return a && typeof a.getElementsByTagName !== A && a;
        }
        function nb() {}
        function ob(a, b) {
            var c, e, f, g, h, i, j, k = x[a + " "];
            if (k) return b ? 0 : k.slice(0);
            for (h = a, i = [], j = d.preFilter; h; ) {
                (!c || (e = Q.exec(h))) && (e && (h = h.slice(e[0].length) || h), i.push(f = [])), 
                c = !1, (e = R.exec(h)) && (c = e.shift(), f.push({
                    value: c,
                    type: e[0].replace(P, " ")
                }), h = h.slice(c.length));
                for (g in d.filter) !(e = V[g].exec(h)) || j[g] && !(e = j[g](e)) || (c = e.shift(), 
                f.push({
                    value: c,
                    type: g,
                    matches: e
                }), h = h.slice(c.length));
                if (!c) break;
            }
            return b ? h.length : h ? db.error(a) : x(a, i).slice(0);
        }
        function pb(a) {
            for (var b = 0, c = a.length, d = ""; c > b; b++) d += a[b].value;
            return d;
        }
        function qb(a, b, c) {
            var d = b.dir, e = c && "parentNode" === d, f = v++;
            return b.first ? function(b, c, f) {
                for (;b = b[d]; ) if (1 === b.nodeType || e) return a(b, c, f);
            } : function(b, c, g) {
                var h, i, j = [ u, f ];
                if (g) {
                    for (;b = b[d]; ) if ((1 === b.nodeType || e) && a(b, c, g)) return !0;
                } else for (;b = b[d]; ) if (1 === b.nodeType || e) {
                    if (i = b[s] || (b[s] = {}), (h = i[d]) && h[0] === u && h[1] === f) return j[2] = h[2];
                    if (i[d] = j, j[2] = a(b, c, g)) return !0;
                }
            };
        }
        function rb(a) {
            return a.length > 1 ? function(b, c, d) {
                for (var e = a.length; e--; ) if (!a[e](b, c, d)) return !1;
                return !0;
            } : a[0];
        }
        function sb(a, b, c, d, e) {
            for (var f, g = [], h = 0, i = a.length, j = null != b; i > h; h++) (f = a[h]) && (!c || c(f, d, e)) && (g.push(f), 
            j && b.push(h));
            return g;
        }
        function tb(a, b, c, d, e, f) {
            return d && !d[s] && (d = tb(d)), e && !e[s] && (e = tb(e, f)), fb(function(f, g, h, i) {
                var j, k, l, m = [], n = [], o = g.length, p = f || wb(b || "*", h.nodeType ? [ h ] : h, []), q = !a || !f && b ? p : sb(p, m, a, h, i), r = c ? e || (f ? a : o || d) ? [] : g : q;
                if (c && c(q, r, h, i), d) for (j = sb(r, n), d(j, [], h, i), k = j.length; k--; ) (l = j[k]) && (r[n[k]] = !(q[n[k]] = l));
                if (f) {
                    if (e || a) {
                        if (e) {
                            for (j = [], k = r.length; k--; ) (l = r[k]) && j.push(q[k] = l);
                            e(null, r = [], j, i);
                        }
                        for (k = r.length; k--; ) (l = r[k]) && (j = e ? I.call(f, l) : m[k]) > -1 && (f[j] = !(g[j] = l));
                    }
                } else r = sb(r === g ? r.splice(o, r.length) : r), e ? e(null, g, r, i) : G.apply(g, r);
            });
        }
        function ub(a) {
            for (var b, c, e, f = a.length, g = d.relative[a[0].type], i = g || d.relative[" "], j = g ? 1 : 0, k = qb(function(a) {
                return a === b;
            }, i, !0), l = qb(function(a) {
                return I.call(b, a) > -1;
            }, i, !0), m = [ function(a, c, d) {
                return !g && (d || c !== h) || ((b = c).nodeType ? k(a, c, d) : l(a, c, d));
            } ]; f > j; j++) if (c = d.relative[a[j].type]) m = [ qb(rb(m), c) ]; else {
                if (c = d.filter[a[j].type].apply(null, a[j].matches), c[s]) {
                    for (e = ++j; f > e && !d.relative[a[e].type]; e++) ;
                    return tb(j > 1 && rb(m), j > 1 && pb(a.slice(0, j - 1).concat({
                        value: " " === a[j - 2].type ? "*" : ""
                    })).replace(P, "$1"), c, e > j && ub(a.slice(j, e)), f > e && ub(a = a.slice(e)), f > e && pb(a));
                }
                m.push(c);
            }
            return rb(m);
        }
        function vb(a, b) {
            var c = b.length > 0, e = a.length > 0, f = function(f, g, i, j, k) {
                var m, n, o, p = 0, q = "0", r = f && [], s = [], t = h, v = f || e && d.find.TAG("*", k), w = u += null == t ? 1 : Math.random() || .1, x = v.length;
                for (k && (h = g !== l && g); q !== x && null != (m = v[q]); q++) {
                    if (e && m) {
                        for (n = 0; o = a[n++]; ) if (o(m, g, i)) {
                            j.push(m);
                            break;
                        }
                        k && (u = w);
                    }
                    c && ((m = !o && m) && p--, f && r.push(m));
                }
                if (p += q, c && q !== p) {
                    for (n = 0; o = b[n++]; ) o(r, s, g, i);
                    if (f) {
                        if (p > 0) for (;q--; ) r[q] || s[q] || (s[q] = E.call(j));
                        s = sb(s);
                    }
                    G.apply(j, s), k && !f && s.length > 0 && p + b.length > 1 && db.uniqueSort(j);
                }
                return k && (u = w, h = t), r;
            };
            return c ? fb(f) : f;
        }
        function wb(a, b, c) {
            for (var d = 0, e = b.length; e > d; d++) db(a, b[d], c);
            return c;
        }
        function xb(a, b, e, f) {
            var h, i, j, k, l, m = ob(a);
            if (!f && 1 === m.length) {
                if (i = m[0] = m[0].slice(0), i.length > 2 && "ID" === (j = i[0]).type && c.getById && 9 === b.nodeType && n && d.relative[i[1].type]) {
                    if (b = (d.find.ID(j.matches[0].replace(ab, bb), b) || [])[0], !b) return e;
                    a = a.slice(i.shift().value.length);
                }
                for (h = V.needsContext.test(a) ? 0 : i.length; h-- && (j = i[h], !d.relative[k = j.type]); ) if ((l = d.find[k]) && (f = l(j.matches[0].replace(ab, bb), $.test(i[0].type) && mb(b.parentNode) || b))) {
                    if (i.splice(h, 1), a = f.length && pb(i), !a) return G.apply(e, f), e;
                    break;
                }
            }
            return g(a, m)(f, b, !n, e, $.test(a) && mb(b.parentNode) || b), e;
        }
        var b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q, r, s = "sizzle" + -new Date(), t = a.document, u = 0, v = 0, w = eb(), x = eb(), y = eb(), z = function(a, b) {
            return a === b && (j = !0), 0;
        }, A = "undefined", B = 1 << 31, C = {}.hasOwnProperty, D = [], E = D.pop, F = D.push, G = D.push, H = D.slice, I = D.indexOf || function(a) {
            for (var b = 0, c = this.length; c > b; b++) if (this[b] === a) return b;
            return -1;
        }, J = "checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped", K = "[\\x20\\t\\r\\n\\f]", L = "(?:\\\\.|[\\w-]|[^\\x00-\\xa0])+", M = L.replace("w", "w#"), N = "\\[" + K + "*(" + L + ")" + K + "*(?:([*^$|!~]?=)" + K + "*(?:(['\"])((?:\\\\.|[^\\\\])*?)\\3|(" + M + ")|)|)" + K + "*\\]", O = ":(" + L + ")(?:\\(((['\"])((?:\\\\.|[^\\\\])*?)\\3|((?:\\\\.|[^\\\\()[\\]]|" + N.replace(3, 8) + ")*)|.*)\\)|)", P = new RegExp("^" + K + "+|((?:^|[^\\\\])(?:\\\\.)*)" + K + "+$", "g"), Q = new RegExp("^" + K + "*," + K + "*"), R = new RegExp("^" + K + "*([>+~]|" + K + ")" + K + "*"), S = new RegExp("=" + K + "*([^\\]'\"]*?)" + K + "*\\]", "g"), T = new RegExp(O), U = new RegExp("^" + M + "$"), V = {
            ID: new RegExp("^#(" + L + ")"),
            CLASS: new RegExp("^\\.(" + L + ")"),
            TAG: new RegExp("^(" + L.replace("w", "w*") + ")"),
            ATTR: new RegExp("^" + N),
            PSEUDO: new RegExp("^" + O),
            CHILD: new RegExp("^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\(" + K + "*(even|odd|(([+-]|)(\\d*)n|)" + K + "*(?:([+-]|)" + K + "*(\\d+)|))" + K + "*\\)|)", "i"),
            bool: new RegExp("^(?:" + J + ")$", "i"),
            needsContext: new RegExp("^" + K + "*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\(" + K + "*((?:-\\d)?\\d*)" + K + "*\\)|)(?=[^-]|$)", "i")
        }, W = /^(?:input|select|textarea|button)$/i, X = /^h\d$/i, Y = /^[^{]+\{\s*\[native \w/, Z = /^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/, $ = /[+~]/, _ = /'|\\/g, ab = new RegExp("\\\\([\\da-f]{1,6}" + K + "?|(" + K + ")|.)", "ig"), bb = function(a, b, c) {
            var d = "0x" + b - 65536;
            return d !== d || c ? b : 0 > d ? String.fromCharCode(d + 65536) : String.fromCharCode(d >> 10 | 55296, 1023 & d | 56320);
        };
        try {
            G.apply(D = H.call(t.childNodes), t.childNodes), D[t.childNodes.length].nodeType;
        } catch (cb) {
            G = {
                apply: D.length ? function(a, b) {
                    F.apply(a, H.call(b));
                } : function(a, b) {
                    for (var c = a.length, d = 0; a[c++] = b[d++]; ) ;
                    a.length = c - 1;
                }
            };
        }
        c = db.support = {}, f = db.isXML = function(a) {
            var b = a && (a.ownerDocument || a).documentElement;
            return b ? "HTML" !== b.nodeName : !1;
        }, k = db.setDocument = function(a) {
            var b, e = a ? a.ownerDocument || a : t, g = e.defaultView;
            return e !== l && 9 === e.nodeType && e.documentElement ? (l = e, m = e.documentElement, 
            n = !f(e), g && g !== g.top && (g.addEventListener ? g.addEventListener("unload", function() {
                k();
            }, !1) : g.attachEvent && g.attachEvent("onunload", function() {
                k();
            })), c.attributes = gb(function(a) {
                return a.className = "i", !a.getAttribute("className");
            }), c.getElementsByTagName = gb(function(a) {
                return a.appendChild(e.createComment("")), !a.getElementsByTagName("*").length;
            }), c.getElementsByClassName = Y.test(e.getElementsByClassName) && gb(function(a) {
                return a.innerHTML = "<div class='a'></div><div class='a i'></div>", a.firstChild.className = "i", 
                2 === a.getElementsByClassName("i").length;
            }), c.getById = gb(function(a) {
                return m.appendChild(a).id = s, !e.getElementsByName || !e.getElementsByName(s).length;
            }), c.getById ? (d.find.ID = function(a, b) {
                if (typeof b.getElementById !== A && n) {
                    var c = b.getElementById(a);
                    return c && c.parentNode ? [ c ] : [];
                }
            }, d.filter.ID = function(a) {
                var b = a.replace(ab, bb);
                return function(a) {
                    return a.getAttribute("id") === b;
                };
            }) : (delete d.find.ID, d.filter.ID = function(a) {
                var b = a.replace(ab, bb);
                return function(a) {
                    var c = typeof a.getAttributeNode !== A && a.getAttributeNode("id");
                    return c && c.value === b;
                };
            }), d.find.TAG = c.getElementsByTagName ? function(a, b) {
                return typeof b.getElementsByTagName !== A ? b.getElementsByTagName(a) : void 0;
            } : function(a, b) {
                var c, d = [], e = 0, f = b.getElementsByTagName(a);
                if ("*" === a) {
                    for (;c = f[e++]; ) 1 === c.nodeType && d.push(c);
                    return d;
                }
                return f;
            }, d.find.CLASS = c.getElementsByClassName && function(a, b) {
                return typeof b.getElementsByClassName !== A && n ? b.getElementsByClassName(a) : void 0;
            }, p = [], o = [], (c.qsa = Y.test(e.querySelectorAll)) && (gb(function(a) {
                a.innerHTML = "<select t=''><option selected=''></option></select>", a.querySelectorAll("[t^='']").length && o.push("[*^$]=" + K + "*(?:''|\"\")"), 
                a.querySelectorAll("[selected]").length || o.push("\\[" + K + "*(?:value|" + J + ")"), 
                a.querySelectorAll(":checked").length || o.push(":checked");
            }), gb(function(a) {
                var b = e.createElement("input");
                b.setAttribute("type", "hidden"), a.appendChild(b).setAttribute("name", "D"), a.querySelectorAll("[name=d]").length && o.push("name" + K + "*[*^$|!~]?="), 
                a.querySelectorAll(":enabled").length || o.push(":enabled", ":disabled"), a.querySelectorAll("*,:x"), 
                o.push(",.*:");
            })), (c.matchesSelector = Y.test(q = m.webkitMatchesSelector || m.mozMatchesSelector || m.oMatchesSelector || m.msMatchesSelector)) && gb(function(a) {
                c.disconnectedMatch = q.call(a, "div"), q.call(a, "[s!='']:x"), p.push("!=", O);
            }), o = o.length && new RegExp(o.join("|")), p = p.length && new RegExp(p.join("|")), 
            b = Y.test(m.compareDocumentPosition), r = b || Y.test(m.contains) ? function(a, b) {
                var c = 9 === a.nodeType ? a.documentElement : a, d = b && b.parentNode;
                return a === d || !(!d || 1 !== d.nodeType || !(c.contains ? c.contains(d) : a.compareDocumentPosition && 16 & a.compareDocumentPosition(d)));
            } : function(a, b) {
                if (b) for (;b = b.parentNode; ) if (b === a) return !0;
                return !1;
            }, z = b ? function(a, b) {
                if (a === b) return j = !0, 0;
                var d = !a.compareDocumentPosition - !b.compareDocumentPosition;
                return d ? d : (d = (a.ownerDocument || a) === (b.ownerDocument || b) ? a.compareDocumentPosition(b) : 1, 
                1 & d || !c.sortDetached && b.compareDocumentPosition(a) === d ? a === e || a.ownerDocument === t && r(t, a) ? -1 : b === e || b.ownerDocument === t && r(t, b) ? 1 : i ? I.call(i, a) - I.call(i, b) : 0 : 4 & d ? -1 : 1);
            } : function(a, b) {
                if (a === b) return j = !0, 0;
                var c, d = 0, f = a.parentNode, g = b.parentNode, h = [ a ], k = [ b ];
                if (!f || !g) return a === e ? -1 : b === e ? 1 : f ? -1 : g ? 1 : i ? I.call(i, a) - I.call(i, b) : 0;
                if (f === g) return ib(a, b);
                for (c = a; c = c.parentNode; ) h.unshift(c);
                for (c = b; c = c.parentNode; ) k.unshift(c);
                for (;h[d] === k[d]; ) d++;
                return d ? ib(h[d], k[d]) : h[d] === t ? -1 : k[d] === t ? 1 : 0;
            }, e) : l;
        }, db.matches = function(a, b) {
            return db(a, null, null, b);
        }, db.matchesSelector = function(a, b) {
            if ((a.ownerDocument || a) !== l && k(a), b = b.replace(S, "='$1']"), !(!c.matchesSelector || !n || p && p.test(b) || o && o.test(b))) try {
                var d = q.call(a, b);
                if (d || c.disconnectedMatch || a.document && 11 !== a.document.nodeType) return d;
            } catch (e) {}
            return db(b, l, null, [ a ]).length > 0;
        }, db.contains = function(a, b) {
            return (a.ownerDocument || a) !== l && k(a), r(a, b);
        }, db.attr = function(a, b) {
            (a.ownerDocument || a) !== l && k(a);
            var e = d.attrHandle[b.toLowerCase()], f = e && C.call(d.attrHandle, b.toLowerCase()) ? e(a, b, !n) : void 0;
            return void 0 !== f ? f : c.attributes || !n ? a.getAttribute(b) : (f = a.getAttributeNode(b)) && f.specified ? f.value : null;
        }, db.error = function(a) {
            throw new Error("Syntax error, unrecognized expression: " + a);
        }, db.uniqueSort = function(a) {
            var b, d = [], e = 0, f = 0;
            if (j = !c.detectDuplicates, i = !c.sortStable && a.slice(0), a.sort(z), j) {
                for (;b = a[f++]; ) b === a[f] && (e = d.push(f));
                for (;e--; ) a.splice(d[e], 1);
            }
            return i = null, a;
        }, e = db.getText = function(a) {
            var b, c = "", d = 0, f = a.nodeType;
            if (f) {
                if (1 === f || 9 === f || 11 === f) {
                    if ("string" == typeof a.textContent) return a.textContent;
                    for (a = a.firstChild; a; a = a.nextSibling) c += e(a);
                } else if (3 === f || 4 === f) return a.nodeValue;
            } else for (;b = a[d++]; ) c += e(b);
            return c;
        }, d = db.selectors = {
            cacheLength: 50,
            createPseudo: fb,
            match: V,
            attrHandle: {},
            find: {},
            relative: {
                ">": {
                    dir: "parentNode",
                    first: !0
                },
                " ": {
                    dir: "parentNode"
                },
                "+": {
                    dir: "previousSibling",
                    first: !0
                },
                "~": {
                    dir: "previousSibling"
                }
            },
            preFilter: {
                ATTR: function(a) {
                    return a[1] = a[1].replace(ab, bb), a[3] = (a[4] || a[5] || "").replace(ab, bb), 
                    "~=" === a[2] && (a[3] = " " + a[3] + " "), a.slice(0, 4);
                },
                CHILD: function(a) {
                    return a[1] = a[1].toLowerCase(), "nth" === a[1].slice(0, 3) ? (a[3] || db.error(a[0]), 
                    a[4] = +(a[4] ? a[5] + (a[6] || 1) : 2 * ("even" === a[3] || "odd" === a[3])), a[5] = +(a[7] + a[8] || "odd" === a[3])) : a[3] && db.error(a[0]), 
                    a;
                },
                PSEUDO: function(a) {
                    var b, c = !a[5] && a[2];
                    return V.CHILD.test(a[0]) ? null : (a[3] && void 0 !== a[4] ? a[2] = a[4] : c && T.test(c) && (b = ob(c, !0)) && (b = c.indexOf(")", c.length - b) - c.length) && (a[0] = a[0].slice(0, b), 
                    a[2] = c.slice(0, b)), a.slice(0, 3));
                }
            },
            filter: {
                TAG: function(a) {
                    var b = a.replace(ab, bb).toLowerCase();
                    return "*" === a ? function() {
                        return !0;
                    } : function(a) {
                        return a.nodeName && a.nodeName.toLowerCase() === b;
                    };
                },
                CLASS: function(a) {
                    var b = w[a + " "];
                    return b || (b = new RegExp("(^|" + K + ")" + a + "(" + K + "|$)")) && w(a, function(a) {
                        return b.test("string" == typeof a.className && a.className || typeof a.getAttribute !== A && a.getAttribute("class") || "");
                    });
                },
                ATTR: function(a, b, c) {
                    return function(d) {
                        var e = db.attr(d, a);
                        return null == e ? "!=" === b : b ? (e += "", "=" === b ? e === c : "!=" === b ? e !== c : "^=" === b ? c && 0 === e.indexOf(c) : "*=" === b ? c && e.indexOf(c) > -1 : "$=" === b ? c && e.slice(-c.length) === c : "~=" === b ? (" " + e + " ").indexOf(c) > -1 : "|=" === b ? e === c || e.slice(0, c.length + 1) === c + "-" : !1) : !0;
                    };
                },
                CHILD: function(a, b, c, d, e) {
                    var f = "nth" !== a.slice(0, 3), g = "last" !== a.slice(-4), h = "of-type" === b;
                    return 1 === d && 0 === e ? function(a) {
                        return !!a.parentNode;
                    } : function(b, c, i) {
                        var j, k, l, m, n, o, p = f !== g ? "nextSibling" : "previousSibling", q = b.parentNode, r = h && b.nodeName.toLowerCase(), t = !i && !h;
                        if (q) {
                            if (f) {
                                for (;p; ) {
                                    for (l = b; l = l[p]; ) if (h ? l.nodeName.toLowerCase() === r : 1 === l.nodeType) return !1;
                                    o = p = "only" === a && !o && "nextSibling";
                                }
                                return !0;
                            }
                            if (o = [ g ? q.firstChild : q.lastChild ], g && t) {
                                for (k = q[s] || (q[s] = {}), j = k[a] || [], n = j[0] === u && j[1], m = j[0] === u && j[2], 
                                l = n && q.childNodes[n]; l = ++n && l && l[p] || (m = n = 0) || o.pop(); ) if (1 === l.nodeType && ++m && l === b) {
                                    k[a] = [ u, n, m ];
                                    break;
                                }
                            } else if (t && (j = (b[s] || (b[s] = {}))[a]) && j[0] === u) m = j[1]; else for (;(l = ++n && l && l[p] || (m = n = 0) || o.pop()) && ((h ? l.nodeName.toLowerCase() !== r : 1 !== l.nodeType) || !++m || (t && ((l[s] || (l[s] = {}))[a] = [ u, m ]), 
                            l !== b)); ) ;
                            return m -= e, m === d || m % d === 0 && m / d >= 0;
                        }
                    };
                },
                PSEUDO: function(a, b) {
                    var c, e = d.pseudos[a] || d.setFilters[a.toLowerCase()] || db.error("unsupported pseudo: " + a);
                    return e[s] ? e(b) : e.length > 1 ? (c = [ a, a, "", b ], d.setFilters.hasOwnProperty(a.toLowerCase()) ? fb(function(a, c) {
                        for (var d, f = e(a, b), g = f.length; g--; ) d = I.call(a, f[g]), a[d] = !(c[d] = f[g]);
                    }) : function(a) {
                        return e(a, 0, c);
                    }) : e;
                }
            },
            pseudos: {
                not: fb(function(a) {
                    var b = [], c = [], d = g(a.replace(P, "$1"));
                    return d[s] ? fb(function(a, b, c, e) {
                        for (var f, g = d(a, null, e, []), h = a.length; h--; ) (f = g[h]) && (a[h] = !(b[h] = f));
                    }) : function(a, e, f) {
                        return b[0] = a, d(b, null, f, c), !c.pop();
                    };
                }),
                has: fb(function(a) {
                    return function(b) {
                        return db(a, b).length > 0;
                    };
                }),
                contains: fb(function(a) {
                    return function(b) {
                        return (b.textContent || b.innerText || e(b)).indexOf(a) > -1;
                    };
                }),
                lang: fb(function(a) {
                    return U.test(a || "") || db.error("unsupported lang: " + a), a = a.replace(ab, bb).toLowerCase(), 
                    function(b) {
                        var c;
                        do if (c = n ? b.lang : b.getAttribute("xml:lang") || b.getAttribute("lang")) return c = c.toLowerCase(), 
                        c === a || 0 === c.indexOf(a + "-"); while ((b = b.parentNode) && 1 === b.nodeType);
                        return !1;
                    };
                }),
                target: function(b) {
                    var c = a.location && a.location.hash;
                    return c && c.slice(1) === b.id;
                },
                root: function(a) {
                    return a === m;
                },
                focus: function(a) {
                    return a === l.activeElement && (!l.hasFocus || l.hasFocus()) && !!(a.type || a.href || ~a.tabIndex);
                },
                enabled: function(a) {
                    return a.disabled === !1;
                },
                disabled: function(a) {
                    return a.disabled === !0;
                },
                checked: function(a) {
                    var b = a.nodeName.toLowerCase();
                    return "input" === b && !!a.checked || "option" === b && !!a.selected;
                },
                selected: function(a) {
                    return a.parentNode && a.parentNode.selectedIndex, a.selected === !0;
                },
                empty: function(a) {
                    for (a = a.firstChild; a; a = a.nextSibling) if (a.nodeType < 6) return !1;
                    return !0;
                },
                parent: function(a) {
                    return !d.pseudos.empty(a);
                },
                header: function(a) {
                    return X.test(a.nodeName);
                },
                input: function(a) {
                    return W.test(a.nodeName);
                },
                button: function(a) {
                    var b = a.nodeName.toLowerCase();
                    return "input" === b && "button" === a.type || "button" === b;
                },
                text: function(a) {
                    var b;
                    return "input" === a.nodeName.toLowerCase() && "text" === a.type && (null == (b = a.getAttribute("type")) || "text" === b.toLowerCase());
                },
                first: lb(function() {
                    return [ 0 ];
                }),
                last: lb(function(a, b) {
                    return [ b - 1 ];
                }),
                eq: lb(function(a, b, c) {
                    return [ 0 > c ? c + b : c ];
                }),
                even: lb(function(a, b) {
                    for (var c = 0; b > c; c += 2) a.push(c);
                    return a;
                }),
                odd: lb(function(a, b) {
                    for (var c = 1; b > c; c += 2) a.push(c);
                    return a;
                }),
                lt: lb(function(a, b, c) {
                    for (var d = 0 > c ? c + b : c; --d >= 0; ) a.push(d);
                    return a;
                }),
                gt: lb(function(a, b, c) {
                    for (var d = 0 > c ? c + b : c; ++d < b; ) a.push(d);
                    return a;
                })
            }
        }, d.pseudos.nth = d.pseudos.eq;
        for (b in {
            radio: !0,
            checkbox: !0,
            file: !0,
            password: !0,
            image: !0
        }) d.pseudos[b] = jb(b);
        for (b in {
            submit: !0,
            reset: !0
        }) d.pseudos[b] = kb(b);
        return nb.prototype = d.filters = d.pseudos, d.setFilters = new nb(), g = db.compile = function(a, b) {
            var c, d = [], e = [], f = y[a + " "];
            if (!f) {
                for (b || (b = ob(a)), c = b.length; c--; ) f = ub(b[c]), f[s] ? d.push(f) : e.push(f);
                f = y(a, vb(e, d));
            }
            return f;
        }, c.sortStable = s.split("").sort(z).join("") === s, c.detectDuplicates = !!j, 
        k(), c.sortDetached = gb(function(a) {
            return 1 & a.compareDocumentPosition(l.createElement("div"));
        }), gb(function(a) {
            return a.innerHTML = "<a href='#'></a>", "#" === a.firstChild.getAttribute("href");
        }) || hb("type|href|height|width", function(a, b, c) {
            return c ? void 0 : a.getAttribute(b, "type" === b.toLowerCase() ? 1 : 2);
        }), c.attributes && gb(function(a) {
            return a.innerHTML = "<input/>", a.firstChild.setAttribute("value", ""), "" === a.firstChild.getAttribute("value");
        }) || hb("value", function(a, b, c) {
            return c || "input" !== a.nodeName.toLowerCase() ? void 0 : a.defaultValue;
        }), gb(function(a) {
            return null == a.getAttribute("disabled");
        }) || hb(J, function(a, b, c) {
            var d;
            return c ? void 0 : a[b] === !0 ? b.toLowerCase() : (d = a.getAttributeNode(b)) && d.specified ? d.value : null;
        }), db;
    }(a);
    n.find = t, n.expr = t.selectors, n.expr[":"] = n.expr.pseudos, n.unique = t.uniqueSort, 
    n.text = t.getText, n.isXMLDoc = t.isXML, n.contains = t.contains;
    var u = n.expr.match.needsContext, v = /^<(\w+)\s*\/?>(?:<\/\1>|)$/, w = /^.[^:#\[\.,]*$/;
    n.filter = function(a, b, c) {
        var d = b[0];
        return c && (a = ":not(" + a + ")"), 1 === b.length && 1 === d.nodeType ? n.find.matchesSelector(d, a) ? [ d ] : [] : n.find.matches(a, n.grep(b, function(a) {
            return 1 === a.nodeType;
        }));
    }, n.fn.extend({
        find: function(a) {
            var b, c = [], d = this, e = d.length;
            if ("string" != typeof a) return this.pushStack(n(a).filter(function() {
                for (b = 0; e > b; b++) if (n.contains(d[b], this)) return !0;
            }));
            for (b = 0; e > b; b++) n.find(a, d[b], c);
            return c = this.pushStack(e > 1 ? n.unique(c) : c), c.selector = this.selector ? this.selector + " " + a : a, 
            c;
        },
        filter: function(a) {
            return this.pushStack(x(this, a || [], !1));
        },
        not: function(a) {
            return this.pushStack(x(this, a || [], !0));
        },
        is: function(a) {
            return !!x(this, "string" == typeof a && u.test(a) ? n(a) : a || [], !1).length;
        }
    });
    var y, z = a.document, A = /^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]*))$/, B = n.fn.init = function(a, b) {
        var c, d;
        if (!a) return this;
        if ("string" == typeof a) {
            if (c = "<" === a.charAt(0) && ">" === a.charAt(a.length - 1) && a.length >= 3 ? [ null, a, null ] : A.exec(a), 
            !c || !c[1] && b) return !b || b.jquery ? (b || y).find(a) : this.constructor(b).find(a);
            if (c[1]) {
                if (b = b instanceof n ? b[0] : b, n.merge(this, n.parseHTML(c[1], b && b.nodeType ? b.ownerDocument || b : z, !0)), 
                v.test(c[1]) && n.isPlainObject(b)) for (c in b) n.isFunction(this[c]) ? this[c](b[c]) : this.attr(c, b[c]);
                return this;
            }
            if (d = z.getElementById(c[2]), d && d.parentNode) {
                if (d.id !== c[2]) return y.find(a);
                this.length = 1, this[0] = d;
            }
            return this.context = z, this.selector = a, this;
        }
        return a.nodeType ? (this.context = this[0] = a, this.length = 1, this) : n.isFunction(a) ? "undefined" != typeof y.ready ? y.ready(a) : a(n) : (void 0 !== a.selector && (this.selector = a.selector, 
        this.context = a.context), n.makeArray(a, this));
    };
    B.prototype = n.fn, y = n(z);
    var C = /^(?:parents|prev(?:Until|All))/, D = {
        children: !0,
        contents: !0,
        next: !0,
        prev: !0
    };
    n.extend({
        dir: function(a, b, c) {
            for (var d = [], e = a[b]; e && 9 !== e.nodeType && (void 0 === c || 1 !== e.nodeType || !n(e).is(c)); ) 1 === e.nodeType && d.push(e), 
            e = e[b];
            return d;
        },
        sibling: function(a, b) {
            for (var c = []; a; a = a.nextSibling) 1 === a.nodeType && a !== b && c.push(a);
            return c;
        }
    }), n.fn.extend({
        has: function(a) {
            var b, c = n(a, this), d = c.length;
            return this.filter(function() {
                for (b = 0; d > b; b++) if (n.contains(this, c[b])) return !0;
            });
        },
        closest: function(a, b) {
            for (var c, d = 0, e = this.length, f = [], g = u.test(a) || "string" != typeof a ? n(a, b || this.context) : 0; e > d; d++) for (c = this[d]; c && c !== b; c = c.parentNode) if (c.nodeType < 11 && (g ? g.index(c) > -1 : 1 === c.nodeType && n.find.matchesSelector(c, a))) {
                f.push(c);
                break;
            }
            return this.pushStack(f.length > 1 ? n.unique(f) : f);
        },
        index: function(a) {
            return a ? "string" == typeof a ? n.inArray(this[0], n(a)) : n.inArray(a.jquery ? a[0] : a, this) : this[0] && this[0].parentNode ? this.first().prevAll().length : -1;
        },
        add: function(a, b) {
            return this.pushStack(n.unique(n.merge(this.get(), n(a, b))));
        },
        addBack: function(a) {
            return this.add(null == a ? this.prevObject : this.prevObject.filter(a));
        }
    }), n.each({
        parent: function(a) {
            var b = a.parentNode;
            return b && 11 !== b.nodeType ? b : null;
        },
        parents: function(a) {
            return n.dir(a, "parentNode");
        },
        parentsUntil: function(a, b, c) {
            return n.dir(a, "parentNode", c);
        },
        next: function(a) {
            return E(a, "nextSibling");
        },
        prev: function(a) {
            return E(a, "previousSibling");
        },
        nextAll: function(a) {
            return n.dir(a, "nextSibling");
        },
        prevAll: function(a) {
            return n.dir(a, "previousSibling");
        },
        nextUntil: function(a, b, c) {
            return n.dir(a, "nextSibling", c);
        },
        prevUntil: function(a, b, c) {
            return n.dir(a, "previousSibling", c);
        },
        siblings: function(a) {
            return n.sibling((a.parentNode || {}).firstChild, a);
        },
        children: function(a) {
            return n.sibling(a.firstChild);
        },
        contents: function(a) {
            return n.nodeName(a, "iframe") ? a.contentDocument || a.contentWindow.document : n.merge([], a.childNodes);
        }
    }, function(a, b) {
        n.fn[a] = function(c, d) {
            var e = n.map(this, b, c);
            return "Until" !== a.slice(-5) && (d = c), d && "string" == typeof d && (e = n.filter(d, e)), 
            this.length > 1 && (D[a] || (e = n.unique(e)), C.test(a) && (e = e.reverse())), 
            this.pushStack(e);
        };
    });
    var F = /\S+/g, G = {};
    n.Callbacks = function(a) {
        a = "string" == typeof a ? G[a] || H(a) : n.extend({}, a);
        var b, c, d, e, f, g, h = [], i = !a.once && [], j = function(l) {
            for (c = a.memory && l, d = !0, f = g || 0, g = 0, e = h.length, b = !0; h && e > f; f++) if (h[f].apply(l[0], l[1]) === !1 && a.stopOnFalse) {
                c = !1;
                break;
            }
            b = !1, h && (i ? i.length && j(i.shift()) : c ? h = [] : k.disable());
        }, k = {
            add: function() {
                if (h) {
                    var d = h.length;
                    !function f(b) {
                        n.each(b, function(b, c) {
                            var d = n.type(c);
                            "function" === d ? a.unique && k.has(c) || h.push(c) : c && c.length && "string" !== d && f(c);
                        });
                    }(arguments), b ? e = h.length : c && (g = d, j(c));
                }
                return this;
            },
            remove: function() {
                return h && n.each(arguments, function(a, c) {
                    for (var d; (d = n.inArray(c, h, d)) > -1; ) h.splice(d, 1), b && (e >= d && e--, 
                    f >= d && f--);
                }), this;
            },
            has: function(a) {
                return a ? n.inArray(a, h) > -1 : !(!h || !h.length);
            },
            empty: function() {
                return h = [], e = 0, this;
            },
            disable: function() {
                return h = i = c = void 0, this;
            },
            disabled: function() {
                return !h;
            },
            lock: function() {
                return i = void 0, c || k.disable(), this;
            },
            locked: function() {
                return !i;
            },
            fireWith: function(a, c) {
                return !h || d && !i || (c = c || [], c = [ a, c.slice ? c.slice() : c ], b ? i.push(c) : j(c)), 
                this;
            },
            fire: function() {
                return k.fireWith(this, arguments), this;
            },
            fired: function() {
                return !!d;
            }
        };
        return k;
    }, n.extend({
        Deferred: function(a) {
            var b = [ [ "resolve", "done", n.Callbacks("once memory"), "resolved" ], [ "reject", "fail", n.Callbacks("once memory"), "rejected" ], [ "notify", "progress", n.Callbacks("memory") ] ], c = "pending", d = {
                state: function() {
                    return c;
                },
                always: function() {
                    return e.done(arguments).fail(arguments), this;
                },
                then: function() {
                    var a = arguments;
                    return n.Deferred(function(c) {
                        n.each(b, function(b, f) {
                            var g = n.isFunction(a[b]) && a[b];
                            e[f[1]](function() {
                                var a = g && g.apply(this, arguments);
                                a && n.isFunction(a.promise) ? a.promise().done(c.resolve).fail(c.reject).progress(c.notify) : c[f[0] + "With"](this === d ? c.promise() : this, g ? [ a ] : arguments);
                            });
                        }), a = null;
                    }).promise();
                },
                promise: function(a) {
                    return null != a ? n.extend(a, d) : d;
                }
            }, e = {};
            return d.pipe = d.then, n.each(b, function(a, f) {
                var g = f[2], h = f[3];
                d[f[1]] = g.add, h && g.add(function() {
                    c = h;
                }, b[1 ^ a][2].disable, b[2][2].lock), e[f[0]] = function() {
                    return e[f[0] + "With"](this === e ? d : this, arguments), this;
                }, e[f[0] + "With"] = g.fireWith;
            }), d.promise(e), a && a.call(e, e), e;
        },
        when: function(a) {
            var i, j, k, b = 0, c = d.call(arguments), e = c.length, f = 1 !== e || a && n.isFunction(a.promise) ? e : 0, g = 1 === f ? a : n.Deferred(), h = function(a, b, c) {
                return function(e) {
                    b[a] = this, c[a] = arguments.length > 1 ? d.call(arguments) : e, c === i ? g.notifyWith(b, c) : --f || g.resolveWith(b, c);
                };
            };
            if (e > 1) for (i = new Array(e), j = new Array(e), k = new Array(e); e > b; b++) c[b] && n.isFunction(c[b].promise) ? c[b].promise().done(h(b, k, c)).fail(g.reject).progress(h(b, j, i)) : --f;
            return f || g.resolveWith(k, c), g.promise();
        }
    });
    var I;
    n.fn.ready = function(a) {
        return n.ready.promise().done(a), this;
    }, n.extend({
        isReady: !1,
        readyWait: 1,
        holdReady: function(a) {
            a ? n.readyWait++ : n.ready(!0);
        },
        ready: function(a) {
            if (a === !0 ? !--n.readyWait : !n.isReady) {
                if (!z.body) return setTimeout(n.ready);
                n.isReady = !0, a !== !0 && --n.readyWait > 0 || (I.resolveWith(z, [ n ]), n.fn.trigger && n(z).trigger("ready").off("ready"));
            }
        }
    }), n.ready.promise = function(b) {
        if (!I) if (I = n.Deferred(), "complete" === z.readyState) setTimeout(n.ready); else if (z.addEventListener) z.addEventListener("DOMContentLoaded", K, !1), 
        a.addEventListener("load", K, !1); else {
            z.attachEvent("onreadystatechange", K), a.attachEvent("onload", K);
            var c = !1;
            try {
                c = null == a.frameElement && z.documentElement;
            } catch (d) {}
            c && c.doScroll && !function e() {
                if (!n.isReady) {
                    try {
                        c.doScroll("left");
                    } catch (a) {
                        return setTimeout(e, 50);
                    }
                    J(), n.ready();
                }
            }();
        }
        return I.promise(b);
    };
    var M, L = "undefined";
    for (M in n(l)) break;
    l.ownLast = "0" !== M, l.inlineBlockNeedsLayout = !1, n(function() {
        var a, b, c = z.getElementsByTagName("body")[0];
        c && (a = z.createElement("div"), a.style.cssText = "border:0;width:0;height:0;position:absolute;top:0;left:-9999px;margin-top:1px", 
        b = z.createElement("div"), c.appendChild(a).appendChild(b), typeof b.style.zoom !== L && (b.style.cssText = "border:0;margin:0;width:1px;padding:1px;display:inline;zoom:1", 
        (l.inlineBlockNeedsLayout = 3 === b.offsetWidth) && (c.style.zoom = 1)), c.removeChild(a), 
        a = b = null);
    }), function() {
        var a = z.createElement("div");
        if (null == l.deleteExpando) {
            l.deleteExpando = !0;
            try {
                delete a.test;
            } catch (b) {
                l.deleteExpando = !1;
            }
        }
        a = null;
    }(), n.acceptData = function(a) {
        var b = n.noData[(a.nodeName + " ").toLowerCase()], c = +a.nodeType || 1;
        return 1 !== c && 9 !== c ? !1 : !b || b !== !0 && a.getAttribute("classid") === b;
    };
    var N = /^(?:\{[\w\W]*\}|\[[\w\W]*\])$/, O = /([A-Z])/g;
    n.extend({
        cache: {},
        noData: {
            "applet ": !0,
            "embed ": !0,
            "object ": "clsid:D27CDB6E-AE6D-11cf-96B8-444553540000"
        },
        hasData: function(a) {
            return a = a.nodeType ? n.cache[a[n.expando]] : a[n.expando], !!a && !Q(a);
        },
        data: function(a, b, c) {
            return R(a, b, c);
        },
        removeData: function(a, b) {
            return S(a, b);
        },
        _data: function(a, b, c) {
            return R(a, b, c, !0);
        },
        _removeData: function(a, b) {
            return S(a, b, !0);
        }
    }), n.fn.extend({
        data: function(a, b) {
            var c, d, e, f = this[0], g = f && f.attributes;
            if (void 0 === a) {
                if (this.length && (e = n.data(f), 1 === f.nodeType && !n._data(f, "parsedAttrs"))) {
                    for (c = g.length; c--; ) d = g[c].name, 0 === d.indexOf("data-") && (d = n.camelCase(d.slice(5)), 
                    P(f, d, e[d]));
                    n._data(f, "parsedAttrs", !0);
                }
                return e;
            }
            return "object" == typeof a ? this.each(function() {
                n.data(this, a);
            }) : arguments.length > 1 ? this.each(function() {
                n.data(this, a, b);
            }) : f ? P(f, a, n.data(f, a)) : void 0;
        },
        removeData: function(a) {
            return this.each(function() {
                n.removeData(this, a);
            });
        }
    }), n.extend({
        queue: function(a, b, c) {
            var d;
            return a ? (b = (b || "fx") + "queue", d = n._data(a, b), c && (!d || n.isArray(c) ? d = n._data(a, b, n.makeArray(c)) : d.push(c)), 
            d || []) : void 0;
        },
        dequeue: function(a, b) {
            b = b || "fx";
            var c = n.queue(a, b), d = c.length, e = c.shift(), f = n._queueHooks(a, b), g = function() {
                n.dequeue(a, b);
            };
            "inprogress" === e && (e = c.shift(), d--), e && ("fx" === b && c.unshift("inprogress"), 
            delete f.stop, e.call(a, g, f)), !d && f && f.empty.fire();
        },
        _queueHooks: function(a, b) {
            var c = b + "queueHooks";
            return n._data(a, c) || n._data(a, c, {
                empty: n.Callbacks("once memory").add(function() {
                    n._removeData(a, b + "queue"), n._removeData(a, c);
                })
            });
        }
    }), n.fn.extend({
        queue: function(a, b) {
            var c = 2;
            return "string" != typeof a && (b = a, a = "fx", c--), arguments.length < c ? n.queue(this[0], a) : void 0 === b ? this : this.each(function() {
                var c = n.queue(this, a, b);
                n._queueHooks(this, a), "fx" === a && "inprogress" !== c[0] && n.dequeue(this, a);
            });
        },
        dequeue: function(a) {
            return this.each(function() {
                n.dequeue(this, a);
            });
        },
        clearQueue: function(a) {
            return this.queue(a || "fx", []);
        },
        promise: function(a, b) {
            var c, d = 1, e = n.Deferred(), f = this, g = this.length, h = function() {
                --d || e.resolveWith(f, [ f ]);
            };
            for ("string" != typeof a && (b = a, a = void 0), a = a || "fx"; g--; ) c = n._data(f[g], a + "queueHooks"), 
            c && c.empty && (d++, c.empty.add(h));
            return h(), e.promise(b);
        }
    });
    var T = /[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/.source, U = [ "Top", "Right", "Bottom", "Left" ], V = function(a, b) {
        return a = b || a, "none" === n.css(a, "display") || !n.contains(a.ownerDocument, a);
    }, W = n.access = function(a, b, c, d, e, f, g) {
        var h = 0, i = a.length, j = null == c;
        if ("object" === n.type(c)) {
            e = !0;
            for (h in c) n.access(a, b, h, c[h], !0, f, g);
        } else if (void 0 !== d && (e = !0, n.isFunction(d) || (g = !0), j && (g ? (b.call(a, d), 
        b = null) : (j = b, b = function(a, b, c) {
            return j.call(n(a), c);
        })), b)) for (;i > h; h++) b(a[h], c, g ? d : d.call(a[h], h, b(a[h], c)));
        return e ? a : j ? b.call(a) : i ? b(a[0], c) : f;
    }, X = /^(?:checkbox|radio)$/i;
    !function() {
        var a = z.createDocumentFragment(), b = z.createElement("div"), c = z.createElement("input");
        if (b.setAttribute("className", "t"), b.innerHTML = "  <link/><table></table><a href='/a'>a</a>", 
        l.leadingWhitespace = 3 === b.firstChild.nodeType, l.tbody = !b.getElementsByTagName("tbody").length, 
        l.htmlSerialize = !!b.getElementsByTagName("link").length, l.html5Clone = "<:nav></:nav>" !== z.createElement("nav").cloneNode(!0).outerHTML, 
        c.type = "checkbox", c.checked = !0, a.appendChild(c), l.appendChecked = c.checked, 
        b.innerHTML = "<textarea>x</textarea>", l.noCloneChecked = !!b.cloneNode(!0).lastChild.defaultValue, 
        a.appendChild(b), b.innerHTML = "<input type='radio' checked='checked' name='t'/>", 
        l.checkClone = b.cloneNode(!0).cloneNode(!0).lastChild.checked, l.noCloneEvent = !0, 
        b.attachEvent && (b.attachEvent("onclick", function() {
            l.noCloneEvent = !1;
        }), b.cloneNode(!0).click()), null == l.deleteExpando) {
            l.deleteExpando = !0;
            try {
                delete b.test;
            } catch (d) {
                l.deleteExpando = !1;
            }
        }
        a = b = c = null;
    }(), function() {
        var b, c, d = z.createElement("div");
        for (b in {
            submit: !0,
            change: !0,
            focusin: !0
        }) c = "on" + b, (l[b + "Bubbles"] = c in a) || (d.setAttribute(c, "t"), l[b + "Bubbles"] = d.attributes[c].expando === !1);
        d = null;
    }();
    var Y = /^(?:input|select|textarea)$/i, Z = /^key/, $ = /^(?:mouse|contextmenu)|click/, _ = /^(?:focusinfocus|focusoutblur)$/, ab = /^([^.]*)(?:\.(.+)|)$/;
    n.event = {
        global: {},
        add: function(a, b, c, d, e) {
            var f, g, h, i, j, k, l, m, o, p, q, r = n._data(a);
            if (r) {
                for (c.handler && (i = c, c = i.handler, e = i.selector), c.guid || (c.guid = n.guid++), 
                (g = r.events) || (g = r.events = {}), (k = r.handle) || (k = r.handle = function(a) {
                    return typeof n === L || a && n.event.triggered === a.type ? void 0 : n.event.dispatch.apply(k.elem, arguments);
                }, k.elem = a), b = (b || "").match(F) || [ "" ], h = b.length; h--; ) f = ab.exec(b[h]) || [], 
                o = q = f[1], p = (f[2] || "").split(".").sort(), o && (j = n.event.special[o] || {}, 
                o = (e ? j.delegateType : j.bindType) || o, j = n.event.special[o] || {}, l = n.extend({
                    type: o,
                    origType: q,
                    data: d,
                    handler: c,
                    guid: c.guid,
                    selector: e,
                    needsContext: e && n.expr.match.needsContext.test(e),
                    namespace: p.join(".")
                }, i), (m = g[o]) || (m = g[o] = [], m.delegateCount = 0, j.setup && j.setup.call(a, d, p, k) !== !1 || (a.addEventListener ? a.addEventListener(o, k, !1) : a.attachEvent && a.attachEvent("on" + o, k))), 
                j.add && (j.add.call(a, l), l.handler.guid || (l.handler.guid = c.guid)), e ? m.splice(m.delegateCount++, 0, l) : m.push(l), 
                n.event.global[o] = !0);
                a = null;
            }
        },
        remove: function(a, b, c, d, e) {
            var f, g, h, i, j, k, l, m, o, p, q, r = n.hasData(a) && n._data(a);
            if (r && (k = r.events)) {
                for (b = (b || "").match(F) || [ "" ], j = b.length; j--; ) if (h = ab.exec(b[j]) || [], 
                o = q = h[1], p = (h[2] || "").split(".").sort(), o) {
                    for (l = n.event.special[o] || {}, o = (d ? l.delegateType : l.bindType) || o, m = k[o] || [], 
                    h = h[2] && new RegExp("(^|\\.)" + p.join("\\.(?:.*\\.|)") + "(\\.|$)"), i = f = m.length; f--; ) g = m[f], 
                    !e && q !== g.origType || c && c.guid !== g.guid || h && !h.test(g.namespace) || d && d !== g.selector && ("**" !== d || !g.selector) || (m.splice(f, 1), 
                    g.selector && m.delegateCount--, l.remove && l.remove.call(a, g));
                    i && !m.length && (l.teardown && l.teardown.call(a, p, r.handle) !== !1 || n.removeEvent(a, o, r.handle), 
                    delete k[o]);
                } else for (o in k) n.event.remove(a, o + b[j], c, d, !0);
                n.isEmptyObject(k) && (delete r.handle, n._removeData(a, "events"));
            }
        },
        trigger: function(b, c, d, e) {
            var f, g, h, i, k, l, m, o = [ d || z ], p = j.call(b, "type") ? b.type : b, q = j.call(b, "namespace") ? b.namespace.split(".") : [];
            if (h = l = d = d || z, 3 !== d.nodeType && 8 !== d.nodeType && !_.test(p + n.event.triggered) && (p.indexOf(".") >= 0 && (q = p.split("."), 
            p = q.shift(), q.sort()), g = p.indexOf(":") < 0 && "on" + p, b = b[n.expando] ? b : new n.Event(p, "object" == typeof b && b), 
            b.isTrigger = e ? 2 : 3, b.namespace = q.join("."), b.namespace_re = b.namespace ? new RegExp("(^|\\.)" + q.join("\\.(?:.*\\.|)") + "(\\.|$)") : null, 
            b.result = void 0, b.target || (b.target = d), c = null == c ? [ b ] : n.makeArray(c, [ b ]), 
            k = n.event.special[p] || {}, e || !k.trigger || k.trigger.apply(d, c) !== !1)) {
                if (!e && !k.noBubble && !n.isWindow(d)) {
                    for (i = k.delegateType || p, _.test(i + p) || (h = h.parentNode); h; h = h.parentNode) o.push(h), 
                    l = h;
                    l === (d.ownerDocument || z) && o.push(l.defaultView || l.parentWindow || a);
                }
                for (m = 0; (h = o[m++]) && !b.isPropagationStopped(); ) b.type = m > 1 ? i : k.bindType || p, 
                f = (n._data(h, "events") || {})[b.type] && n._data(h, "handle"), f && f.apply(h, c), 
                f = g && h[g], f && f.apply && n.acceptData(h) && (b.result = f.apply(h, c), b.result === !1 && b.preventDefault());
                if (b.type = p, !e && !b.isDefaultPrevented() && (!k._default || k._default.apply(o.pop(), c) === !1) && n.acceptData(d) && g && d[p] && !n.isWindow(d)) {
                    l = d[g], l && (d[g] = null), n.event.triggered = p;
                    try {
                        d[p]();
                    } catch (r) {}
                    n.event.triggered = void 0, l && (d[g] = l);
                }
                return b.result;
            }
        },
        dispatch: function(a) {
            a = n.event.fix(a);
            var b, c, e, f, g, h = [], i = d.call(arguments), j = (n._data(this, "events") || {})[a.type] || [], k = n.event.special[a.type] || {};
            if (i[0] = a, a.delegateTarget = this, !k.preDispatch || k.preDispatch.call(this, a) !== !1) {
                for (h = n.event.handlers.call(this, a, j), b = 0; (f = h[b++]) && !a.isPropagationStopped(); ) for (a.currentTarget = f.elem, 
                g = 0; (e = f.handlers[g++]) && !a.isImmediatePropagationStopped(); ) (!a.namespace_re || a.namespace_re.test(e.namespace)) && (a.handleObj = e, 
                a.data = e.data, c = ((n.event.special[e.origType] || {}).handle || e.handler).apply(f.elem, i), 
                void 0 !== c && (a.result = c) === !1 && (a.preventDefault(), a.stopPropagation()));
                return k.postDispatch && k.postDispatch.call(this, a), a.result;
            }
        },
        handlers: function(a, b) {
            var c, d, e, f, g = [], h = b.delegateCount, i = a.target;
            if (h && i.nodeType && (!a.button || "click" !== a.type)) for (;i != this; i = i.parentNode || this) if (1 === i.nodeType && (i.disabled !== !0 || "click" !== a.type)) {
                for (e = [], f = 0; h > f; f++) d = b[f], c = d.selector + " ", void 0 === e[c] && (e[c] = d.needsContext ? n(c, this).index(i) >= 0 : n.find(c, this, null, [ i ]).length), 
                e[c] && e.push(d);
                e.length && g.push({
                    elem: i,
                    handlers: e
                });
            }
            return h < b.length && g.push({
                elem: this,
                handlers: b.slice(h)
            }), g;
        },
        fix: function(a) {
            if (a[n.expando]) return a;
            var b, c, d, e = a.type, f = a, g = this.fixHooks[e];
            for (g || (this.fixHooks[e] = g = $.test(e) ? this.mouseHooks : Z.test(e) ? this.keyHooks : {}), 
            d = g.props ? this.props.concat(g.props) : this.props, a = new n.Event(f), b = d.length; b--; ) c = d[b], 
            a[c] = f[c];
            return a.target || (a.target = f.srcElement || z), 3 === a.target.nodeType && (a.target = a.target.parentNode), 
            a.metaKey = !!a.metaKey, g.filter ? g.filter(a, f) : a;
        },
        props: "altKey bubbles cancelable ctrlKey currentTarget eventPhase metaKey relatedTarget shiftKey target timeStamp view which".split(" "),
        fixHooks: {},
        keyHooks: {
            props: "char charCode key keyCode".split(" "),
            filter: function(a, b) {
                return null == a.which && (a.which = null != b.charCode ? b.charCode : b.keyCode), 
                a;
            }
        },
        mouseHooks: {
            props: "button buttons clientX clientY fromElement offsetX offsetY pageX pageY screenX screenY toElement".split(" "),
            filter: function(a, b) {
                var c, d, e, f = b.button, g = b.fromElement;
                return null == a.pageX && null != b.clientX && (d = a.target.ownerDocument || z, 
                e = d.documentElement, c = d.body, a.pageX = b.clientX + (e && e.scrollLeft || c && c.scrollLeft || 0) - (e && e.clientLeft || c && c.clientLeft || 0), 
                a.pageY = b.clientY + (e && e.scrollTop || c && c.scrollTop || 0) - (e && e.clientTop || c && c.clientTop || 0)), 
                !a.relatedTarget && g && (a.relatedTarget = g === a.target ? b.toElement : g), a.which || void 0 === f || (a.which = 1 & f ? 1 : 2 & f ? 3 : 4 & f ? 2 : 0), 
                a;
            }
        },
        special: {
            load: {
                noBubble: !0
            },
            focus: {
                trigger: function() {
                    if (this !== db() && this.focus) try {
                        return this.focus(), !1;
                    } catch (a) {}
                },
                delegateType: "focusin"
            },
            blur: {
                trigger: function() {
                    return this === db() && this.blur ? (this.blur(), !1) : void 0;
                },
                delegateType: "focusout"
            },
            click: {
                trigger: function() {
                    return n.nodeName(this, "input") && "checkbox" === this.type && this.click ? (this.click(), 
                    !1) : void 0;
                },
                _default: function(a) {
                    return n.nodeName(a.target, "a");
                }
            },
            beforeunload: {
                postDispatch: function(a) {
                    void 0 !== a.result && (a.originalEvent.returnValue = a.result);
                }
            }
        },
        simulate: function(a, b, c, d) {
            var e = n.extend(new n.Event(), c, {
                type: a,
                isSimulated: !0,
                originalEvent: {}
            });
            d ? n.event.trigger(e, null, b) : n.event.dispatch.call(b, e), e.isDefaultPrevented() && c.preventDefault();
        }
    }, n.removeEvent = z.removeEventListener ? function(a, b, c) {
        a.removeEventListener && a.removeEventListener(b, c, !1);
    } : function(a, b, c) {
        var d = "on" + b;
        a.detachEvent && (typeof a[d] === L && (a[d] = null), a.detachEvent(d, c));
    }, n.Event = function(a, b) {
        return this instanceof n.Event ? (a && a.type ? (this.originalEvent = a, this.type = a.type, 
        this.isDefaultPrevented = a.defaultPrevented || void 0 === a.defaultPrevented && (a.returnValue === !1 || a.getPreventDefault && a.getPreventDefault()) ? bb : cb) : this.type = a, 
        b && n.extend(this, b), this.timeStamp = a && a.timeStamp || n.now(), void (this[n.expando] = !0)) : new n.Event(a, b);
    }, n.Event.prototype = {
        isDefaultPrevented: cb,
        isPropagationStopped: cb,
        isImmediatePropagationStopped: cb,
        preventDefault: function() {
            var a = this.originalEvent;
            this.isDefaultPrevented = bb, a && (a.preventDefault ? a.preventDefault() : a.returnValue = !1);
        },
        stopPropagation: function() {
            var a = this.originalEvent;
            this.isPropagationStopped = bb, a && (a.stopPropagation && a.stopPropagation(), 
            a.cancelBubble = !0);
        },
        stopImmediatePropagation: function() {
            this.isImmediatePropagationStopped = bb, this.stopPropagation();
        }
    }, n.each({
        mouseenter: "mouseover",
        mouseleave: "mouseout"
    }, function(a, b) {
        n.event.special[a] = {
            delegateType: b,
            bindType: b,
            handle: function(a) {
                var c, d = this, e = a.relatedTarget, f = a.handleObj;
                return (!e || e !== d && !n.contains(d, e)) && (a.type = f.origType, c = f.handler.apply(this, arguments), 
                a.type = b), c;
            }
        };
    }), l.submitBubbles || (n.event.special.submit = {
        setup: function() {
            return n.nodeName(this, "form") ? !1 : void n.event.add(this, "click._submit keypress._submit", function(a) {
                var b = a.target, c = n.nodeName(b, "input") || n.nodeName(b, "button") ? b.form : void 0;
                c && !n._data(c, "submitBubbles") && (n.event.add(c, "submit._submit", function(a) {
                    a._submit_bubble = !0;
                }), n._data(c, "submitBubbles", !0));
            });
        },
        postDispatch: function(a) {
            a._submit_bubble && (delete a._submit_bubble, this.parentNode && !a.isTrigger && n.event.simulate("submit", this.parentNode, a, !0));
        },
        teardown: function() {
            return n.nodeName(this, "form") ? !1 : void n.event.remove(this, "._submit");
        }
    }), l.changeBubbles || (n.event.special.change = {
        setup: function() {
            return Y.test(this.nodeName) ? (("checkbox" === this.type || "radio" === this.type) && (n.event.add(this, "propertychange._change", function(a) {
                "checked" === a.originalEvent.propertyName && (this._just_changed = !0);
            }), n.event.add(this, "click._change", function(a) {
                this._just_changed && !a.isTrigger && (this._just_changed = !1), n.event.simulate("change", this, a, !0);
            })), !1) : void n.event.add(this, "beforeactivate._change", function(a) {
                var b = a.target;
                Y.test(b.nodeName) && !n._data(b, "changeBubbles") && (n.event.add(b, "change._change", function(a) {
                    !this.parentNode || a.isSimulated || a.isTrigger || n.event.simulate("change", this.parentNode, a, !0);
                }), n._data(b, "changeBubbles", !0));
            });
        },
        handle: function(a) {
            var b = a.target;
            return this !== b || a.isSimulated || a.isTrigger || "radio" !== b.type && "checkbox" !== b.type ? a.handleObj.handler.apply(this, arguments) : void 0;
        },
        teardown: function() {
            return n.event.remove(this, "._change"), !Y.test(this.nodeName);
        }
    }), l.focusinBubbles || n.each({
        focus: "focusin",
        blur: "focusout"
    }, function(a, b) {
        var c = function(a) {
            n.event.simulate(b, a.target, n.event.fix(a), !0);
        };
        n.event.special[b] = {
            setup: function() {
                var d = this.ownerDocument || this, e = n._data(d, b);
                e || d.addEventListener(a, c, !0), n._data(d, b, (e || 0) + 1);
            },
            teardown: function() {
                var d = this.ownerDocument || this, e = n._data(d, b) - 1;
                e ? n._data(d, b, e) : (d.removeEventListener(a, c, !0), n._removeData(d, b));
            }
        };
    }), n.fn.extend({
        on: function(a, b, c, d, e) {
            var f, g;
            if ("object" == typeof a) {
                "string" != typeof b && (c = c || b, b = void 0);
                for (f in a) this.on(f, b, c, a[f], e);
                return this;
            }
            if (null == c && null == d ? (d = b, c = b = void 0) : null == d && ("string" == typeof b ? (d = c, 
            c = void 0) : (d = c, c = b, b = void 0)), d === !1) d = cb; else if (!d) return this;
            return 1 === e && (g = d, d = function(a) {
                return n().off(a), g.apply(this, arguments);
            }, d.guid = g.guid || (g.guid = n.guid++)), this.each(function() {
                n.event.add(this, a, d, c, b);
            });
        },
        one: function(a, b, c, d) {
            return this.on(a, b, c, d, 1);
        },
        off: function(a, b, c) {
            var d, e;
            if (a && a.preventDefault && a.handleObj) return d = a.handleObj, n(a.delegateTarget).off(d.namespace ? d.origType + "." + d.namespace : d.origType, d.selector, d.handler), 
            this;
            if ("object" == typeof a) {
                for (e in a) this.off(e, b, a[e]);
                return this;
            }
            return (b === !1 || "function" == typeof b) && (c = b, b = void 0), c === !1 && (c = cb), 
            this.each(function() {
                n.event.remove(this, a, c, b);
            });
        },
        trigger: function(a, b) {
            return this.each(function() {
                n.event.trigger(a, b, this);
            });
        },
        triggerHandler: function(a, b) {
            var c = this[0];
            return c ? n.event.trigger(a, b, c, !0) : void 0;
        }
    });
    var fb = "abbr|article|aside|audio|bdi|canvas|data|datalist|details|figcaption|figure|footer|header|hgroup|mark|meter|nav|output|progress|section|summary|time|video", gb = / jQuery\d+="(?:null|\d+)"/g, hb = new RegExp("<(?:" + fb + ")[\\s/>]", "i"), ib = /^\s+/, jb = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/gi, kb = /<([\w:]+)/, lb = /<tbody/i, mb = /<|&#?\w+;/, nb = /<(?:script|style|link)/i, ob = /checked\s*(?:[^=]|=\s*.checked.)/i, pb = /^$|\/(?:java|ecma)script/i, qb = /^true\/(.*)/, rb = /^\s*<!(?:\[CDATA\[|--)|(?:\]\]|--)>\s*$/g, sb = {
        option: [ 1, "<select multiple='multiple'>", "</select>" ],
        legend: [ 1, "<fieldset>", "</fieldset>" ],
        area: [ 1, "<map>", "</map>" ],
        param: [ 1, "<object>", "</object>" ],
        thead: [ 1, "<table>", "</table>" ],
        tr: [ 2, "<table><tbody>", "</tbody></table>" ],
        col: [ 2, "<table><tbody></tbody><colgroup>", "</colgroup></table>" ],
        td: [ 3, "<table><tbody><tr>", "</tr></tbody></table>" ],
        _default: l.htmlSerialize ? [ 0, "", "" ] : [ 1, "X<div>", "</div>" ]
    }, tb = eb(z), ub = tb.appendChild(z.createElement("div"));
    sb.optgroup = sb.option, sb.tbody = sb.tfoot = sb.colgroup = sb.caption = sb.thead, 
    sb.th = sb.td, n.extend({
        clone: function(a, b, c) {
            var d, e, f, g, h, i = n.contains(a.ownerDocument, a);
            if (l.html5Clone || n.isXMLDoc(a) || !hb.test("<" + a.nodeName + ">") ? f = a.cloneNode(!0) : (ub.innerHTML = a.outerHTML, 
            ub.removeChild(f = ub.firstChild)), !(l.noCloneEvent && l.noCloneChecked || 1 !== a.nodeType && 11 !== a.nodeType || n.isXMLDoc(a))) for (d = vb(f), 
            h = vb(a), g = 0; null != (e = h[g]); ++g) d[g] && Cb(e, d[g]);
            if (b) if (c) for (h = h || vb(a), d = d || vb(f), g = 0; null != (e = h[g]); g++) Bb(e, d[g]); else Bb(a, f);
            return d = vb(f, "script"), d.length > 0 && Ab(d, !i && vb(a, "script")), d = h = e = null, 
            f;
        },
        buildFragment: function(a, b, c, d) {
            for (var e, f, g, h, i, j, k, m = a.length, o = eb(b), p = [], q = 0; m > q; q++) if (f = a[q], 
            f || 0 === f) if ("object" === n.type(f)) n.merge(p, f.nodeType ? [ f ] : f); else if (mb.test(f)) {
                for (h = h || o.appendChild(b.createElement("div")), i = (kb.exec(f) || [ "", "" ])[1].toLowerCase(), 
                k = sb[i] || sb._default, h.innerHTML = k[1] + f.replace(jb, "<$1></$2>") + k[2], 
                e = k[0]; e--; ) h = h.lastChild;
                if (!l.leadingWhitespace && ib.test(f) && p.push(b.createTextNode(ib.exec(f)[0])), 
                !l.tbody) for (f = "table" !== i || lb.test(f) ? "<table>" !== k[1] || lb.test(f) ? 0 : h : h.firstChild, 
                e = f && f.childNodes.length; e--; ) n.nodeName(j = f.childNodes[e], "tbody") && !j.childNodes.length && f.removeChild(j);
                for (n.merge(p, h.childNodes), h.textContent = ""; h.firstChild; ) h.removeChild(h.firstChild);
                h = o.lastChild;
            } else p.push(b.createTextNode(f));
            for (h && o.removeChild(h), l.appendChecked || n.grep(vb(p, "input"), wb), q = 0; f = p[q++]; ) if ((!d || -1 === n.inArray(f, d)) && (g = n.contains(f.ownerDocument, f), 
            h = vb(o.appendChild(f), "script"), g && Ab(h), c)) for (e = 0; f = h[e++]; ) pb.test(f.type || "") && c.push(f);
            return h = null, o;
        },
        cleanData: function(a, b) {
            for (var d, e, f, g, h = 0, i = n.expando, j = n.cache, k = l.deleteExpando, m = n.event.special; null != (d = a[h]); h++) if ((b || n.acceptData(d)) && (f = d[i], 
            g = f && j[f])) {
                if (g.events) for (e in g.events) m[e] ? n.event.remove(d, e) : n.removeEvent(d, e, g.handle);
                j[f] && (delete j[f], k ? delete d[i] : typeof d.removeAttribute !== L ? d.removeAttribute(i) : d[i] = null, 
                c.push(f));
            }
        }
    }), n.fn.extend({
        text: function(a) {
            return W(this, function(a) {
                return void 0 === a ? n.text(this) : this.empty().append((this[0] && this[0].ownerDocument || z).createTextNode(a));
            }, null, a, arguments.length);
        },
        append: function() {
            return this.domManip(arguments, function(a) {
                if (1 === this.nodeType || 11 === this.nodeType || 9 === this.nodeType) {
                    var b = xb(this, a);
                    b.appendChild(a);
                }
            });
        },
        prepend: function() {
            return this.domManip(arguments, function(a) {
                if (1 === this.nodeType || 11 === this.nodeType || 9 === this.nodeType) {
                    var b = xb(this, a);
                    b.insertBefore(a, b.firstChild);
                }
            });
        },
        before: function() {
            return this.domManip(arguments, function(a) {
                this.parentNode && this.parentNode.insertBefore(a, this);
            });
        },
        after: function() {
            return this.domManip(arguments, function(a) {
                this.parentNode && this.parentNode.insertBefore(a, this.nextSibling);
            });
        },
        remove: function(a, b) {
            for (var c, d = a ? n.filter(a, this) : this, e = 0; null != (c = d[e]); e++) b || 1 !== c.nodeType || n.cleanData(vb(c)), 
            c.parentNode && (b && n.contains(c.ownerDocument, c) && Ab(vb(c, "script")), c.parentNode.removeChild(c));
            return this;
        },
        empty: function() {
            for (var a, b = 0; null != (a = this[b]); b++) {
                for (1 === a.nodeType && n.cleanData(vb(a, !1)); a.firstChild; ) a.removeChild(a.firstChild);
                a.options && n.nodeName(a, "select") && (a.options.length = 0);
            }
            return this;
        },
        clone: function(a, b) {
            return a = null == a ? !1 : a, b = null == b ? a : b, this.map(function() {
                return n.clone(this, a, b);
            });
        },
        html: function(a) {
            return W(this, function(a) {
                var b = this[0] || {}, c = 0, d = this.length;
                if (void 0 === a) return 1 === b.nodeType ? b.innerHTML.replace(gb, "") : void 0;
                if (!("string" != typeof a || nb.test(a) || !l.htmlSerialize && hb.test(a) || !l.leadingWhitespace && ib.test(a) || sb[(kb.exec(a) || [ "", "" ])[1].toLowerCase()])) {
                    a = a.replace(jb, "<$1></$2>");
                    try {
                        for (;d > c; c++) b = this[c] || {}, 1 === b.nodeType && (n.cleanData(vb(b, !1)), 
                        b.innerHTML = a);
                        b = 0;
                    } catch (e) {}
                }
                b && this.empty().append(a);
            }, null, a, arguments.length);
        },
        replaceWith: function() {
            var a = arguments[0];
            return this.domManip(arguments, function(b) {
                a = this.parentNode, n.cleanData(vb(this)), a && a.replaceChild(b, this);
            }), a && (a.length || a.nodeType) ? this : this.remove();
        },
        detach: function(a) {
            return this.remove(a, !0);
        },
        domManip: function(a, b) {
            a = e.apply([], a);
            var c, d, f, g, h, i, j = 0, k = this.length, m = this, o = k - 1, p = a[0], q = n.isFunction(p);
            if (q || k > 1 && "string" == typeof p && !l.checkClone && ob.test(p)) return this.each(function(c) {
                var d = m.eq(c);
                q && (a[0] = p.call(this, c, d.html())), d.domManip(a, b);
            });
            if (k && (i = n.buildFragment(a, this[0].ownerDocument, !1, this), c = i.firstChild, 
            1 === i.childNodes.length && (i = c), c)) {
                for (g = n.map(vb(i, "script"), yb), f = g.length; k > j; j++) d = i, j !== o && (d = n.clone(d, !0, !0), 
                f && n.merge(g, vb(d, "script"))), b.call(this[j], d, j);
                if (f) for (h = g[g.length - 1].ownerDocument, n.map(g, zb), j = 0; f > j; j++) d = g[j], 
                pb.test(d.type || "") && !n._data(d, "globalEval") && n.contains(h, d) && (d.src ? n._evalUrl && n._evalUrl(d.src) : n.globalEval((d.text || d.textContent || d.innerHTML || "").replace(rb, "")));
                i = c = null;
            }
            return this;
        }
    }), n.each({
        appendTo: "append",
        prependTo: "prepend",
        insertBefore: "before",
        insertAfter: "after",
        replaceAll: "replaceWith"
    }, function(a, b) {
        n.fn[a] = function(a) {
            for (var c, d = 0, e = [], g = n(a), h = g.length - 1; h >= d; d++) c = d === h ? this : this.clone(!0), 
            n(g[d])[b](c), f.apply(e, c.get());
            return this.pushStack(e);
        };
    });
    var Db, Eb = {};
    !function() {
        var a, b, c = z.createElement("div"), d = "-webkit-box-sizing:content-box;-moz-box-sizing:content-box;box-sizing:content-box;display:block;padding:0;margin:0;border:0";
        c.innerHTML = "  <link/><table></table><a href='/a'>a</a><input type='checkbox'/>", 
        a = c.getElementsByTagName("a")[0], a.style.cssText = "float:left;opacity:.5", l.opacity = /^0.5/.test(a.style.opacity), 
        l.cssFloat = !!a.style.cssFloat, c.style.backgroundClip = "content-box", c.cloneNode(!0).style.backgroundClip = "", 
        l.clearCloneStyle = "content-box" === c.style.backgroundClip, a = c = null, l.shrinkWrapBlocks = function() {
            var a, c, e, f;
            if (null == b) {
                if (a = z.getElementsByTagName("body")[0], !a) return;
                f = "border:0;width:0;height:0;position:absolute;top:0;left:-9999px", c = z.createElement("div"), 
                e = z.createElement("div"), a.appendChild(c).appendChild(e), b = !1, typeof e.style.zoom !== L && (e.style.cssText = d + ";width:1px;padding:1px;zoom:1", 
                e.innerHTML = "<div></div>", e.firstChild.style.width = "5px", b = 3 !== e.offsetWidth), 
                a.removeChild(c), a = c = e = null;
            }
            return b;
        };
    }();
    var Jb, Kb, Hb = /^margin/, Ib = new RegExp("^(" + T + ")(?!px)[a-z%]+$", "i"), Lb = /^(top|right|bottom|left)$/;
    a.getComputedStyle ? (Jb = function(a) {
        return a.ownerDocument.defaultView.getComputedStyle(a, null);
    }, Kb = function(a, b, c) {
        var d, e, f, g, h = a.style;
        return c = c || Jb(a), g = c ? c.getPropertyValue(b) || c[b] : void 0, c && ("" !== g || n.contains(a.ownerDocument, a) || (g = n.style(a, b)), 
        Ib.test(g) && Hb.test(b) && (d = h.width, e = h.minWidth, f = h.maxWidth, h.minWidth = h.maxWidth = h.width = g, 
        g = c.width, h.width = d, h.minWidth = e, h.maxWidth = f)), void 0 === g ? g : g + "";
    }) : z.documentElement.currentStyle && (Jb = function(a) {
        return a.currentStyle;
    }, Kb = function(a, b, c) {
        var d, e, f, g, h = a.style;
        return c = c || Jb(a), g = c ? c[b] : void 0, null == g && h && h[b] && (g = h[b]), 
        Ib.test(g) && !Lb.test(b) && (d = h.left, e = a.runtimeStyle, f = e && e.left, f && (e.left = a.currentStyle.left), 
        h.left = "fontSize" === b ? "1em" : g, g = h.pixelLeft + "px", h.left = d, f && (e.left = f)), 
        void 0 === g ? g : g + "" || "auto";
    }), !function() {
        function k() {
            var b, c, h = z.getElementsByTagName("body")[0];
            h && (b = z.createElement("div"), c = z.createElement("div"), b.style.cssText = i, 
            h.appendChild(b).appendChild(c), c.style.cssText = "-webkit-box-sizing:border-box;-moz-box-sizing:border-box;box-sizing:border-box;position:absolute;display:block;padding:1px;border:1px;width:4px;margin-top:1%;top:1%", 
            n.swap(h, null != h.style.zoom ? {
                zoom: 1
            } : {}, function() {
                d = 4 === c.offsetWidth;
            }), e = !0, f = !1, g = !0, a.getComputedStyle && (f = "1%" !== (a.getComputedStyle(c, null) || {}).top, 
            e = "4px" === (a.getComputedStyle(c, null) || {
                width: "4px"
            }).width), h.removeChild(b), c = h = null);
        }
        var b, c, d, e, f, g, h = z.createElement("div"), i = "border:0;width:0;height:0;position:absolute;top:0;left:-9999px", j = "-webkit-box-sizing:content-box;-moz-box-sizing:content-box;box-sizing:content-box;display:block;padding:0;margin:0;border:0";
        h.innerHTML = "  <link/><table></table><a href='/a'>a</a><input type='checkbox'/>", 
        b = h.getElementsByTagName("a")[0], b.style.cssText = "float:left;opacity:.5", l.opacity = /^0.5/.test(b.style.opacity), 
        l.cssFloat = !!b.style.cssFloat, h.style.backgroundClip = "content-box", h.cloneNode(!0).style.backgroundClip = "", 
        l.clearCloneStyle = "content-box" === h.style.backgroundClip, b = h = null, n.extend(l, {
            reliableHiddenOffsets: function() {
                if (null != c) return c;
                var a, b, d, e = z.createElement("div"), f = z.getElementsByTagName("body")[0];
                return f ? (e.setAttribute("className", "t"), e.innerHTML = "  <link/><table></table><a href='/a'>a</a><input type='checkbox'/>", 
                a = z.createElement("div"), a.style.cssText = i, f.appendChild(a).appendChild(e), 
                e.innerHTML = "<table><tr><td></td><td>t</td></tr></table>", b = e.getElementsByTagName("td"), 
                b[0].style.cssText = "padding:0;margin:0;border:0;display:none", d = 0 === b[0].offsetHeight, 
                b[0].style.display = "", b[1].style.display = "none", c = d && 0 === b[0].offsetHeight, 
                f.removeChild(a), e = f = null, c) : void 0;
            },
            boxSizing: function() {
                return null == d && k(), d;
            },
            boxSizingReliable: function() {
                return null == e && k(), e;
            },
            pixelPosition: function() {
                return null == f && k(), f;
            },
            reliableMarginRight: function() {
                var b, c, d, e;
                if (null == g && a.getComputedStyle) {
                    if (b = z.getElementsByTagName("body")[0], !b) return;
                    c = z.createElement("div"), d = z.createElement("div"), c.style.cssText = i, b.appendChild(c).appendChild(d), 
                    e = d.appendChild(z.createElement("div")), e.style.cssText = d.style.cssText = j, 
                    e.style.marginRight = e.style.width = "0", d.style.width = "1px", g = !parseFloat((a.getComputedStyle(e, null) || {}).marginRight), 
                    b.removeChild(c);
                }
                return g;
            }
        });
    }(), n.swap = function(a, b, c, d) {
        var e, f, g = {};
        for (f in b) g[f] = a.style[f], a.style[f] = b[f];
        e = c.apply(a, d || []);
        for (f in b) a.style[f] = g[f];
        return e;
    };
    var Nb = /alpha\([^)]*\)/i, Ob = /opacity\s*=\s*([^)]*)/, Pb = /^(none|table(?!-c[ea]).+)/, Qb = new RegExp("^(" + T + ")(.*)$", "i"), Rb = new RegExp("^([+-])=(" + T + ")", "i"), Sb = {
        position: "absolute",
        visibility: "hidden",
        display: "block"
    }, Tb = {
        letterSpacing: 0,
        fontWeight: 400
    }, Ub = [ "Webkit", "O", "Moz", "ms" ];
    n.extend({
        cssHooks: {
            opacity: {
                get: function(a, b) {
                    if (b) {
                        var c = Kb(a, "opacity");
                        return "" === c ? "1" : c;
                    }
                }
            }
        },
        cssNumber: {
            columnCount: !0,
            fillOpacity: !0,
            fontWeight: !0,
            lineHeight: !0,
            opacity: !0,
            order: !0,
            orphans: !0,
            widows: !0,
            zIndex: !0,
            zoom: !0
        },
        cssProps: {
            "float": l.cssFloat ? "cssFloat" : "styleFloat"
        },
        style: function(a, b, c, d) {
            if (a && 3 !== a.nodeType && 8 !== a.nodeType && a.style) {
                var e, f, g, h = n.camelCase(b), i = a.style;
                if (b = n.cssProps[h] || (n.cssProps[h] = Vb(i, h)), g = n.cssHooks[b] || n.cssHooks[h], 
                void 0 === c) return g && "get" in g && void 0 !== (e = g.get(a, !1, d)) ? e : i[b];
                if (f = typeof c, "string" === f && (e = Rb.exec(c)) && (c = (e[1] + 1) * e[2] + parseFloat(n.css(a, b)), 
                f = "number"), null != c && c === c && ("number" !== f || n.cssNumber[h] || (c += "px"), 
                l.clearCloneStyle || "" !== c || 0 !== b.indexOf("background") || (i[b] = "inherit"), 
                !(g && "set" in g && void 0 === (c = g.set(a, c, d))))) try {
                    i[b] = "", i[b] = c;
                } catch (j) {}
            }
        },
        css: function(a, b, c, d) {
            var e, f, g, h = n.camelCase(b);
            return b = n.cssProps[h] || (n.cssProps[h] = Vb(a.style, h)), g = n.cssHooks[b] || n.cssHooks[h], 
            g && "get" in g && (f = g.get(a, !0, c)), void 0 === f && (f = Kb(a, b, d)), "normal" === f && b in Tb && (f = Tb[b]), 
            "" === c || c ? (e = parseFloat(f), c === !0 || n.isNumeric(e) ? e || 0 : f) : f;
        }
    }), n.each([ "height", "width" ], function(a, b) {
        n.cssHooks[b] = {
            get: function(a, c, d) {
                return c ? 0 === a.offsetWidth && Pb.test(n.css(a, "display")) ? n.swap(a, Sb, function() {
                    return Zb(a, b, d);
                }) : Zb(a, b, d) : void 0;
            },
            set: function(a, c, d) {
                var e = d && Jb(a);
                return Xb(a, c, d ? Yb(a, b, d, l.boxSizing() && "border-box" === n.css(a, "boxSizing", !1, e), e) : 0);
            }
        };
    }), l.opacity || (n.cssHooks.opacity = {
        get: function(a, b) {
            return Ob.test((b && a.currentStyle ? a.currentStyle.filter : a.style.filter) || "") ? .01 * parseFloat(RegExp.$1) + "" : b ? "1" : "";
        },
        set: function(a, b) {
            var c = a.style, d = a.currentStyle, e = n.isNumeric(b) ? "alpha(opacity=" + 100 * b + ")" : "", f = d && d.filter || c.filter || "";
            c.zoom = 1, (b >= 1 || "" === b) && "" === n.trim(f.replace(Nb, "")) && c.removeAttribute && (c.removeAttribute("filter"), 
            "" === b || d && !d.filter) || (c.filter = Nb.test(f) ? f.replace(Nb, e) : f + " " + e);
        }
    }), n.cssHooks.marginRight = Mb(l.reliableMarginRight, function(a, b) {
        return b ? n.swap(a, {
            display: "inline-block"
        }, Kb, [ a, "marginRight" ]) : void 0;
    }), n.each({
        margin: "",
        padding: "",
        border: "Width"
    }, function(a, b) {
        n.cssHooks[a + b] = {
            expand: function(c) {
                for (var d = 0, e = {}, f = "string" == typeof c ? c.split(" ") : [ c ]; 4 > d; d++) e[a + U[d] + b] = f[d] || f[d - 2] || f[0];
                return e;
            }
        }, Hb.test(a) || (n.cssHooks[a + b].set = Xb);
    }), n.fn.extend({
        css: function(a, b) {
            return W(this, function(a, b, c) {
                var d, e, f = {}, g = 0;
                if (n.isArray(b)) {
                    for (d = Jb(a), e = b.length; e > g; g++) f[b[g]] = n.css(a, b[g], !1, d);
                    return f;
                }
                return void 0 !== c ? n.style(a, b, c) : n.css(a, b);
            }, a, b, arguments.length > 1);
        },
        show: function() {
            return Wb(this, !0);
        },
        hide: function() {
            return Wb(this);
        },
        toggle: function(a) {
            return "boolean" == typeof a ? a ? this.show() : this.hide() : this.each(function() {
                V(this) ? n(this).show() : n(this).hide();
            });
        }
    }), n.Tween = $b, $b.prototype = {
        constructor: $b,
        init: function(a, b, c, d, e, f) {
            this.elem = a, this.prop = c, this.easing = e || "swing", this.options = b, this.start = this.now = this.cur(), 
            this.end = d, this.unit = f || (n.cssNumber[c] ? "" : "px");
        },
        cur: function() {
            var a = $b.propHooks[this.prop];
            return a && a.get ? a.get(this) : $b.propHooks._default.get(this);
        },
        run: function(a) {
            var b, c = $b.propHooks[this.prop];
            return this.pos = b = this.options.duration ? n.easing[this.easing](a, this.options.duration * a, 0, 1, this.options.duration) : a, 
            this.now = (this.end - this.start) * b + this.start, this.options.step && this.options.step.call(this.elem, this.now, this), 
            c && c.set ? c.set(this) : $b.propHooks._default.set(this), this;
        }
    }, $b.prototype.init.prototype = $b.prototype, $b.propHooks = {
        _default: {
            get: function(a) {
                var b;
                return null == a.elem[a.prop] || a.elem.style && null != a.elem.style[a.prop] ? (b = n.css(a.elem, a.prop, ""), 
                b && "auto" !== b ? b : 0) : a.elem[a.prop];
            },
            set: function(a) {
                n.fx.step[a.prop] ? n.fx.step[a.prop](a) : a.elem.style && (null != a.elem.style[n.cssProps[a.prop]] || n.cssHooks[a.prop]) ? n.style(a.elem, a.prop, a.now + a.unit) : a.elem[a.prop] = a.now;
            }
        }
    }, $b.propHooks.scrollTop = $b.propHooks.scrollLeft = {
        set: function(a) {
            a.elem.nodeType && a.elem.parentNode && (a.elem[a.prop] = a.now);
        }
    }, n.easing = {
        linear: function(a) {
            return a;
        },
        swing: function(a) {
            return .5 - Math.cos(a * Math.PI) / 2;
        }
    }, n.fx = $b.prototype.init, n.fx.step = {};
    var _b, ac, bc = /^(?:toggle|show|hide)$/, cc = new RegExp("^(?:([+-])=|)(" + T + ")([a-z%]*)$", "i"), dc = /queueHooks$/, ec = [ jc ], fc = {
        "*": [ function(a, b) {
            var c = this.createTween(a, b), d = c.cur(), e = cc.exec(b), f = e && e[3] || (n.cssNumber[a] ? "" : "px"), g = (n.cssNumber[a] || "px" !== f && +d) && cc.exec(n.css(c.elem, a)), h = 1, i = 20;
            if (g && g[3] !== f) {
                f = f || g[3], e = e || [], g = +d || 1;
                do h = h || ".5", g /= h, n.style(c.elem, a, g + f); while (h !== (h = c.cur() / d) && 1 !== h && --i);
            }
            return e && (g = c.start = +g || +d || 0, c.unit = f, c.end = e[1] ? g + (e[1] + 1) * e[2] : +e[2]), 
            c;
        } ]
    };
    n.Animation = n.extend(lc, {
        tweener: function(a, b) {
            n.isFunction(a) ? (b = a, a = [ "*" ]) : a = a.split(" ");
            for (var c, d = 0, e = a.length; e > d; d++) c = a[d], fc[c] = fc[c] || [], fc[c].unshift(b);
        },
        prefilter: function(a, b) {
            b ? ec.unshift(a) : ec.push(a);
        }
    }), n.speed = function(a, b, c) {
        var d = a && "object" == typeof a ? n.extend({}, a) : {
            complete: c || !c && b || n.isFunction(a) && a,
            duration: a,
            easing: c && b || b && !n.isFunction(b) && b
        };
        return d.duration = n.fx.off ? 0 : "number" == typeof d.duration ? d.duration : d.duration in n.fx.speeds ? n.fx.speeds[d.duration] : n.fx.speeds._default, 
        (null == d.queue || d.queue === !0) && (d.queue = "fx"), d.old = d.complete, d.complete = function() {
            n.isFunction(d.old) && d.old.call(this), d.queue && n.dequeue(this, d.queue);
        }, d;
    }, n.fn.extend({
        fadeTo: function(a, b, c, d) {
            return this.filter(V).css("opacity", 0).show().end().animate({
                opacity: b
            }, a, c, d);
        },
        animate: function(a, b, c, d) {
            var e = n.isEmptyObject(a), f = n.speed(b, c, d), g = function() {
                var b = lc(this, n.extend({}, a), f);
                (e || n._data(this, "finish")) && b.stop(!0);
            };
            return g.finish = g, e || f.queue === !1 ? this.each(g) : this.queue(f.queue, g);
        },
        stop: function(a, b, c) {
            var d = function(a) {
                var b = a.stop;
                delete a.stop, b(c);
            };
            return "string" != typeof a && (c = b, b = a, a = void 0), b && a !== !1 && this.queue(a || "fx", []), 
            this.each(function() {
                var b = !0, e = null != a && a + "queueHooks", f = n.timers, g = n._data(this);
                if (e) g[e] && g[e].stop && d(g[e]); else for (e in g) g[e] && g[e].stop && dc.test(e) && d(g[e]);
                for (e = f.length; e--; ) f[e].elem !== this || null != a && f[e].queue !== a || (f[e].anim.stop(c), 
                b = !1, f.splice(e, 1));
                (b || !c) && n.dequeue(this, a);
            });
        },
        finish: function(a) {
            return a !== !1 && (a = a || "fx"), this.each(function() {
                var b, c = n._data(this), d = c[a + "queue"], e = c[a + "queueHooks"], f = n.timers, g = d ? d.length : 0;
                for (c.finish = !0, n.queue(this, a, []), e && e.stop && e.stop.call(this, !0), 
                b = f.length; b--; ) f[b].elem === this && f[b].queue === a && (f[b].anim.stop(!0), 
                f.splice(b, 1));
                for (b = 0; g > b; b++) d[b] && d[b].finish && d[b].finish.call(this);
                delete c.finish;
            });
        }
    }), n.each([ "toggle", "show", "hide" ], function(a, b) {
        var c = n.fn[b];
        n.fn[b] = function(a, d, e) {
            return null == a || "boolean" == typeof a ? c.apply(this, arguments) : this.animate(hc(b, !0), a, d, e);
        };
    }), n.each({
        slideDown: hc("show"),
        slideUp: hc("hide"),
        slideToggle: hc("toggle"),
        fadeIn: {
            opacity: "show"
        },
        fadeOut: {
            opacity: "hide"
        },
        fadeToggle: {
            opacity: "toggle"
        }
    }, function(a, b) {
        n.fn[a] = function(a, c, d) {
            return this.animate(b, a, c, d);
        };
    }), n.timers = [], n.fx.tick = function() {
        var a, b = n.timers, c = 0;
        for (_b = n.now(); c < b.length; c++) a = b[c], a() || b[c] !== a || b.splice(c--, 1);
        b.length || n.fx.stop(), _b = void 0;
    }, n.fx.timer = function(a) {
        n.timers.push(a), a() ? n.fx.start() : n.timers.pop();
    }, n.fx.interval = 13, n.fx.start = function() {
        ac || (ac = setInterval(n.fx.tick, n.fx.interval));
    }, n.fx.stop = function() {
        clearInterval(ac), ac = null;
    }, n.fx.speeds = {
        slow: 600,
        fast: 200,
        _default: 400
    }, n.fn.delay = function(a, b) {
        return a = n.fx ? n.fx.speeds[a] || a : a, b = b || "fx", this.queue(b, function(b, c) {
            var d = setTimeout(b, a);
            c.stop = function() {
                clearTimeout(d);
            };
        });
    }, function() {
        var a, b, c, d, e = z.createElement("div");
        e.setAttribute("className", "t"), e.innerHTML = "  <link/><table></table><a href='/a'>a</a><input type='checkbox'/>", 
        a = e.getElementsByTagName("a")[0], c = z.createElement("select"), d = c.appendChild(z.createElement("option")), 
        b = e.getElementsByTagName("input")[0], a.style.cssText = "top:1px", l.getSetAttribute = "t" !== e.className, 
        l.style = /top/.test(a.getAttribute("style")), l.hrefNormalized = "/a" === a.getAttribute("href"), 
        l.checkOn = !!b.value, l.optSelected = d.selected, l.enctype = !!z.createElement("form").enctype, 
        c.disabled = !0, l.optDisabled = !d.disabled, b = z.createElement("input"), b.setAttribute("value", ""), 
        l.input = "" === b.getAttribute("value"), b.value = "t", b.setAttribute("type", "radio"), 
        l.radioValue = "t" === b.value, a = b = c = d = e = null;
    }();
    var mc = /\r/g;
    n.fn.extend({
        val: function(a) {
            var b, c, d, e = this[0];
            return arguments.length ? (d = n.isFunction(a), this.each(function(c) {
                var e;
                1 === this.nodeType && (e = d ? a.call(this, c, n(this).val()) : a, null == e ? e = "" : "number" == typeof e ? e += "" : n.isArray(e) && (e = n.map(e, function(a) {
                    return null == a ? "" : a + "";
                })), b = n.valHooks[this.type] || n.valHooks[this.nodeName.toLowerCase()], b && "set" in b && void 0 !== b.set(this, e, "value") || (this.value = e));
            })) : e ? (b = n.valHooks[e.type] || n.valHooks[e.nodeName.toLowerCase()], b && "get" in b && void 0 !== (c = b.get(e, "value")) ? c : (c = e.value, 
            "string" == typeof c ? c.replace(mc, "") : null == c ? "" : c)) : void 0;
        }
    }), n.extend({
        valHooks: {
            option: {
                get: function(a) {
                    var b = n.find.attr(a, "value");
                    return null != b ? b : n.text(a);
                }
            },
            select: {
                get: function(a) {
                    for (var b, c, d = a.options, e = a.selectedIndex, f = "select-one" === a.type || 0 > e, g = f ? null : [], h = f ? e + 1 : d.length, i = 0 > e ? h : f ? e : 0; h > i; i++) if (c = d[i], 
                    !(!c.selected && i !== e || (l.optDisabled ? c.disabled : null !== c.getAttribute("disabled")) || c.parentNode.disabled && n.nodeName(c.parentNode, "optgroup"))) {
                        if (b = n(c).val(), f) return b;
                        g.push(b);
                    }
                    return g;
                },
                set: function(a, b) {
                    for (var c, d, e = a.options, f = n.makeArray(b), g = e.length; g--; ) if (d = e[g], 
                    n.inArray(n.valHooks.option.get(d), f) >= 0) try {
                        d.selected = c = !0;
                    } catch (h) {
                        d.scrollHeight;
                    } else d.selected = !1;
                    return c || (a.selectedIndex = -1), e;
                }
            }
        }
    }), n.each([ "radio", "checkbox" ], function() {
        n.valHooks[this] = {
            set: function(a, b) {
                return n.isArray(b) ? a.checked = n.inArray(n(a).val(), b) >= 0 : void 0;
            }
        }, l.checkOn || (n.valHooks[this].get = function(a) {
            return null === a.getAttribute("value") ? "on" : a.value;
        });
    });
    var nc, oc, pc = n.expr.attrHandle, qc = /^(?:checked|selected)$/i, rc = l.getSetAttribute, sc = l.input;
    n.fn.extend({
        attr: function(a, b) {
            return W(this, n.attr, a, b, arguments.length > 1);
        },
        removeAttr: function(a) {
            return this.each(function() {
                n.removeAttr(this, a);
            });
        }
    }), n.extend({
        attr: function(a, b, c) {
            var d, e, f = a.nodeType;
            return a && 3 !== f && 8 !== f && 2 !== f ? typeof a.getAttribute === L ? n.prop(a, b, c) : (1 === f && n.isXMLDoc(a) || (b = b.toLowerCase(), 
            d = n.attrHooks[b] || (n.expr.match.bool.test(b) ? oc : nc)), void 0 === c ? d && "get" in d && null !== (e = d.get(a, b)) ? e : (e = n.find.attr(a, b), 
            null == e ? void 0 : e) : null !== c ? d && "set" in d && void 0 !== (e = d.set(a, c, b)) ? e : (a.setAttribute(b, c + ""), 
            c) : void n.removeAttr(a, b)) : void 0;
        },
        removeAttr: function(a, b) {
            var c, d, e = 0, f = b && b.match(F);
            if (f && 1 === a.nodeType) for (;c = f[e++]; ) d = n.propFix[c] || c, n.expr.match.bool.test(c) ? sc && rc || !qc.test(c) ? a[d] = !1 : a[n.camelCase("default-" + c)] = a[d] = !1 : n.attr(a, c, ""), 
            a.removeAttribute(rc ? c : d);
        },
        attrHooks: {
            type: {
                set: function(a, b) {
                    if (!l.radioValue && "radio" === b && n.nodeName(a, "input")) {
                        var c = a.value;
                        return a.setAttribute("type", b), c && (a.value = c), b;
                    }
                }
            }
        }
    }), oc = {
        set: function(a, b, c) {
            return b === !1 ? n.removeAttr(a, c) : sc && rc || !qc.test(c) ? a.setAttribute(!rc && n.propFix[c] || c, c) : a[n.camelCase("default-" + c)] = a[c] = !0, 
            c;
        }
    }, n.each(n.expr.match.bool.source.match(/\w+/g), function(a, b) {
        var c = pc[b] || n.find.attr;
        pc[b] = sc && rc || !qc.test(b) ? function(a, b, d) {
            var e, f;
            return d || (f = pc[b], pc[b] = e, e = null != c(a, b, d) ? b.toLowerCase() : null, 
            pc[b] = f), e;
        } : function(a, b, c) {
            return c ? void 0 : a[n.camelCase("default-" + b)] ? b.toLowerCase() : null;
        };
    }), sc && rc || (n.attrHooks.value = {
        set: function(a, b, c) {
            return n.nodeName(a, "input") ? void (a.defaultValue = b) : nc && nc.set(a, b, c);
        }
    }), rc || (nc = {
        set: function(a, b, c) {
            var d = a.getAttributeNode(c);
            return d || a.setAttributeNode(d = a.ownerDocument.createAttribute(c)), d.value = b += "", 
            "value" === c || b === a.getAttribute(c) ? b : void 0;
        }
    }, pc.id = pc.name = pc.coords = function(a, b, c) {
        var d;
        return c ? void 0 : (d = a.getAttributeNode(b)) && "" !== d.value ? d.value : null;
    }, n.valHooks.button = {
        get: function(a, b) {
            var c = a.getAttributeNode(b);
            return c && c.specified ? c.value : void 0;
        },
        set: nc.set
    }, n.attrHooks.contenteditable = {
        set: function(a, b, c) {
            nc.set(a, "" === b ? !1 : b, c);
        }
    }, n.each([ "width", "height" ], function(a, b) {
        n.attrHooks[b] = {
            set: function(a, c) {
                return "" === c ? (a.setAttribute(b, "auto"), c) : void 0;
            }
        };
    })), l.style || (n.attrHooks.style = {
        get: function(a) {
            return a.style.cssText || void 0;
        },
        set: function(a, b) {
            return a.style.cssText = b + "";
        }
    });
    var tc = /^(?:input|select|textarea|button|object)$/i, uc = /^(?:a|area)$/i;
    n.fn.extend({
        prop: function(a, b) {
            return W(this, n.prop, a, b, arguments.length > 1);
        },
        removeProp: function(a) {
            return a = n.propFix[a] || a, this.each(function() {
                try {
                    this[a] = void 0, delete this[a];
                } catch (b) {}
            });
        }
    }), n.extend({
        propFix: {
            "for": "htmlFor",
            "class": "className"
        },
        prop: function(a, b, c) {
            var d, e, f, g = a.nodeType;
            return a && 3 !== g && 8 !== g && 2 !== g ? (f = 1 !== g || !n.isXMLDoc(a), f && (b = n.propFix[b] || b, 
            e = n.propHooks[b]), void 0 !== c ? e && "set" in e && void 0 !== (d = e.set(a, c, b)) ? d : a[b] = c : e && "get" in e && null !== (d = e.get(a, b)) ? d : a[b]) : void 0;
        },
        propHooks: {
            tabIndex: {
                get: function(a) {
                    var b = n.find.attr(a, "tabindex");
                    return b ? parseInt(b, 10) : tc.test(a.nodeName) || uc.test(a.nodeName) && a.href ? 0 : -1;
                }
            }
        }
    }), l.hrefNormalized || n.each([ "href", "src" ], function(a, b) {
        n.propHooks[b] = {
            get: function(a) {
                return a.getAttribute(b, 4);
            }
        };
    }), l.optSelected || (n.propHooks.selected = {
        get: function(a) {
            var b = a.parentNode;
            return b && (b.selectedIndex, b.parentNode && b.parentNode.selectedIndex), null;
        }
    }), n.each([ "tabIndex", "readOnly", "maxLength", "cellSpacing", "cellPadding", "rowSpan", "colSpan", "useMap", "frameBorder", "contentEditable" ], function() {
        n.propFix[this.toLowerCase()] = this;
    }), l.enctype || (n.propFix.enctype = "encoding");
    var vc = /[\t\r\n\f]/g;
    n.fn.extend({
        addClass: function(a) {
            var b, c, d, e, f, g, h = 0, i = this.length, j = "string" == typeof a && a;
            if (n.isFunction(a)) return this.each(function(b) {
                n(this).addClass(a.call(this, b, this.className));
            });
            if (j) for (b = (a || "").match(F) || []; i > h; h++) if (c = this[h], d = 1 === c.nodeType && (c.className ? (" " + c.className + " ").replace(vc, " ") : " ")) {
                for (f = 0; e = b[f++]; ) d.indexOf(" " + e + " ") < 0 && (d += e + " ");
                g = n.trim(d), c.className !== g && (c.className = g);
            }
            return this;
        },
        removeClass: function(a) {
            var b, c, d, e, f, g, h = 0, i = this.length, j = 0 === arguments.length || "string" == typeof a && a;
            if (n.isFunction(a)) return this.each(function(b) {
                n(this).removeClass(a.call(this, b, this.className));
            });
            if (j) for (b = (a || "").match(F) || []; i > h; h++) if (c = this[h], d = 1 === c.nodeType && (c.className ? (" " + c.className + " ").replace(vc, " ") : "")) {
                for (f = 0; e = b[f++]; ) for (;d.indexOf(" " + e + " ") >= 0; ) d = d.replace(" " + e + " ", " ");
                g = a ? n.trim(d) : "", c.className !== g && (c.className = g);
            }
            return this;
        },
        toggleClass: function(a, b) {
            var c = typeof a;
            return "boolean" == typeof b && "string" === c ? b ? this.addClass(a) : this.removeClass(a) : this.each(n.isFunction(a) ? function(c) {
                n(this).toggleClass(a.call(this, c, this.className, b), b);
            } : function() {
                if ("string" === c) for (var b, d = 0, e = n(this), f = a.match(F) || []; b = f[d++]; ) e.hasClass(b) ? e.removeClass(b) : e.addClass(b); else (c === L || "boolean" === c) && (this.className && n._data(this, "__className__", this.className), 
                this.className = this.className || a === !1 ? "" : n._data(this, "__className__") || "");
            });
        },
        hasClass: function(a) {
            for (var b = " " + a + " ", c = 0, d = this.length; d > c; c++) if (1 === this[c].nodeType && (" " + this[c].className + " ").replace(vc, " ").indexOf(b) >= 0) return !0;
            return !1;
        }
    }), n.each("blur focus focusin focusout load resize scroll unload click dblclick mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave change select submit keydown keypress keyup error contextmenu".split(" "), function(a, b) {
        n.fn[b] = function(a, c) {
            return arguments.length > 0 ? this.on(b, null, a, c) : this.trigger(b);
        };
    }), n.fn.extend({
        hover: function(a, b) {
            return this.mouseenter(a).mouseleave(b || a);
        },
        bind: function(a, b, c) {
            return this.on(a, null, b, c);
        },
        unbind: function(a, b) {
            return this.off(a, null, b);
        },
        delegate: function(a, b, c, d) {
            return this.on(b, a, c, d);
        },
        undelegate: function(a, b, c) {
            return 1 === arguments.length ? this.off(a, "**") : this.off(b, a || "**", c);
        }
    });
    var wc = n.now(), xc = /\?/, yc = /(,)|(\[|{)|(}|])|"(?:[^"\\\r\n]|\\["\\\/bfnrt]|\\u[\da-fA-F]{4})*"\s*:?|true|false|null|-?(?!0\d)\d+(?:\.\d+|)(?:[eE][+-]?\d+|)/g;
    n.parseJSON = function(b) {
        if (a.JSON && a.JSON.parse) return a.JSON.parse(b + "");
        var c, d = null, e = n.trim(b + "");
        return e && !n.trim(e.replace(yc, function(a, b, e, f) {
            return c && b && (d = 0), 0 === d ? a : (c = e || b, d += !f - !e, "");
        })) ? Function("return " + e)() : n.error("Invalid JSON: " + b);
    }, n.parseXML = function(b) {
        var c, d;
        if (!b || "string" != typeof b) return null;
        try {
            a.DOMParser ? (d = new DOMParser(), c = d.parseFromString(b, "text/xml")) : (c = new ActiveXObject("Microsoft.XMLDOM"), 
            c.async = "false", c.loadXML(b));
        } catch (e) {
            c = void 0;
        }
        return c && c.documentElement && !c.getElementsByTagName("parsererror").length || n.error("Invalid XML: " + b), 
        c;
    };
    var zc, Ac, Bc = /#.*$/, Cc = /([?&])_=[^&]*/, Dc = /^(.*?):[ \t]*([^\r\n]*)\r?$/gm, Ec = /^(?:about|app|app-storage|.+-extension|file|res|widget):$/, Fc = /^(?:GET|HEAD)$/, Gc = /^\/\//, Hc = /^([\w.+-]+:)(?:\/\/(?:[^\/?#]*@|)([^\/?#:]*)(?::(\d+)|)|)/, Ic = {}, Jc = {}, Kc = "*/".concat("*");
    try {
        Ac = location.href;
    } catch (Lc) {
        Ac = z.createElement("a"), Ac.href = "", Ac = Ac.href;
    }
    zc = Hc.exec(Ac.toLowerCase()) || [], n.extend({
        active: 0,
        lastModified: {},
        etag: {},
        ajaxSettings: {
            url: Ac,
            type: "GET",
            isLocal: Ec.test(zc[1]),
            global: !0,
            processData: !0,
            async: !0,
            contentType: "application/x-www-form-urlencoded; charset=UTF-8",
            accepts: {
                "*": Kc,
                text: "text/plain",
                html: "text/html",
                xml: "application/xml, text/xml",
                json: "application/json, text/javascript"
            },
            contents: {
                xml: /xml/,
                html: /html/,
                json: /json/
            },
            responseFields: {
                xml: "responseXML",
                text: "responseText",
                json: "responseJSON"
            },
            converters: {
                "* text": String,
                "text html": !0,
                "text json": n.parseJSON,
                "text xml": n.parseXML
            },
            flatOptions: {
                url: !0,
                context: !0
            }
        },
        ajaxSetup: function(a, b) {
            return b ? Oc(Oc(a, n.ajaxSettings), b) : Oc(n.ajaxSettings, a);
        },
        ajaxPrefilter: Mc(Ic),
        ajaxTransport: Mc(Jc),
        ajax: function(a, b) {
            function x(a, b, c, d) {
                var j, r, s, u, w, x = b;
                2 !== t && (t = 2, g && clearTimeout(g), i = void 0, f = d || "", v.readyState = a > 0 ? 4 : 0, 
                j = a >= 200 && 300 > a || 304 === a, c && (u = Pc(k, v, c)), u = Qc(k, u, v, j), 
                j ? (k.ifModified && (w = v.getResponseHeader("Last-Modified"), w && (n.lastModified[e] = w), 
                w = v.getResponseHeader("etag"), w && (n.etag[e] = w)), 204 === a || "HEAD" === k.type ? x = "nocontent" : 304 === a ? x = "notmodified" : (x = u.state, 
                r = u.data, s = u.error, j = !s)) : (s = x, (a || !x) && (x = "error", 0 > a && (a = 0))), 
                v.status = a, v.statusText = (b || x) + "", j ? o.resolveWith(l, [ r, x, v ]) : o.rejectWith(l, [ v, x, s ]), 
                v.statusCode(q), q = void 0, h && m.trigger(j ? "ajaxSuccess" : "ajaxError", [ v, k, j ? r : s ]), 
                p.fireWith(l, [ v, x ]), h && (m.trigger("ajaxComplete", [ v, k ]), --n.active || n.event.trigger("ajaxStop")));
            }
            "object" == typeof a && (b = a, a = void 0), b = b || {};
            var c, d, e, f, g, h, i, j, k = n.ajaxSetup({}, b), l = k.context || k, m = k.context && (l.nodeType || l.jquery) ? n(l) : n.event, o = n.Deferred(), p = n.Callbacks("once memory"), q = k.statusCode || {}, r = {}, s = {}, t = 0, u = "canceled", v = {
                readyState: 0,
                getResponseHeader: function(a) {
                    var b;
                    if (2 === t) {
                        if (!j) for (j = {}; b = Dc.exec(f); ) j[b[1].toLowerCase()] = b[2];
                        b = j[a.toLowerCase()];
                    }
                    return null == b ? null : b;
                },
                getAllResponseHeaders: function() {
                    return 2 === t ? f : null;
                },
                setRequestHeader: function(a, b) {
                    var c = a.toLowerCase();
                    return t || (a = s[c] = s[c] || a, r[a] = b), this;
                },
                overrideMimeType: function(a) {
                    return t || (k.mimeType = a), this;
                },
                statusCode: function(a) {
                    var b;
                    if (a) if (2 > t) for (b in a) q[b] = [ q[b], a[b] ]; else v.always(a[v.status]);
                    return this;
                },
                abort: function(a) {
                    var b = a || u;
                    return i && i.abort(b), x(0, b), this;
                }
            };
            if (o.promise(v).complete = p.add, v.success = v.done, v.error = v.fail, k.url = ((a || k.url || Ac) + "").replace(Bc, "").replace(Gc, zc[1] + "//"), 
            k.type = b.method || b.type || k.method || k.type, k.dataTypes = n.trim(k.dataType || "*").toLowerCase().match(F) || [ "" ], 
            null == k.crossDomain && (c = Hc.exec(k.url.toLowerCase()), k.crossDomain = !(!c || c[1] === zc[1] && c[2] === zc[2] && (c[3] || ("http:" === c[1] ? "80" : "443")) === (zc[3] || ("http:" === zc[1] ? "80" : "443")))), 
            k.data && k.processData && "string" != typeof k.data && (k.data = n.param(k.data, k.traditional)), 
            Nc(Ic, k, b, v), 2 === t) return v;
            h = k.global, h && 0 === n.active++ && n.event.trigger("ajaxStart"), k.type = k.type.toUpperCase(), 
            k.hasContent = !Fc.test(k.type), e = k.url, k.hasContent || (k.data && (e = k.url += (xc.test(e) ? "&" : "?") + k.data, 
            delete k.data), k.cache === !1 && (k.url = Cc.test(e) ? e.replace(Cc, "$1_=" + wc++) : e + (xc.test(e) ? "&" : "?") + "_=" + wc++)), 
            k.ifModified && (n.lastModified[e] && v.setRequestHeader("If-Modified-Since", n.lastModified[e]), 
            n.etag[e] && v.setRequestHeader("If-None-Match", n.etag[e])), (k.data && k.hasContent && k.contentType !== !1 || b.contentType) && v.setRequestHeader("Content-Type", k.contentType), 
            v.setRequestHeader("Accept", k.dataTypes[0] && k.accepts[k.dataTypes[0]] ? k.accepts[k.dataTypes[0]] + ("*" !== k.dataTypes[0] ? ", " + Kc + "; q=0.01" : "") : k.accepts["*"]);
            for (d in k.headers) v.setRequestHeader(d, k.headers[d]);
            if (k.beforeSend && (k.beforeSend.call(l, v, k) === !1 || 2 === t)) return v.abort();
            u = "abort";
            for (d in {
                success: 1,
                error: 1,
                complete: 1
            }) v[d](k[d]);
            if (i = Nc(Jc, k, b, v)) {
                v.readyState = 1, h && m.trigger("ajaxSend", [ v, k ]), k.async && k.timeout > 0 && (g = setTimeout(function() {
                    v.abort("timeout");
                }, k.timeout));
                try {
                    t = 1, i.send(r, x);
                } catch (w) {
                    if (!(2 > t)) throw w;
                    x(-1, w);
                }
            } else x(-1, "No Transport");
            return v;
        },
        getJSON: function(a, b, c) {
            return n.get(a, b, c, "json");
        },
        getScript: function(a, b) {
            return n.get(a, void 0, b, "script");
        }
    }), n.each([ "get", "post" ], function(a, b) {
        n[b] = function(a, c, d, e) {
            return n.isFunction(c) && (e = e || d, d = c, c = void 0), n.ajax({
                url: a,
                type: b,
                dataType: e,
                data: c,
                success: d
            });
        };
    }), n.each([ "ajaxStart", "ajaxStop", "ajaxComplete", "ajaxError", "ajaxSuccess", "ajaxSend" ], function(a, b) {
        n.fn[b] = function(a) {
            return this.on(b, a);
        };
    }), n._evalUrl = function(a) {
        return n.ajax({
            url: a,
            type: "GET",
            dataType: "script",
            async: !1,
            global: !1,
            "throws": !0
        });
    }, n.fn.extend({
        wrapAll: function(a) {
            if (n.isFunction(a)) return this.each(function(b) {
                n(this).wrapAll(a.call(this, b));
            });
            if (this[0]) {
                var b = n(a, this[0].ownerDocument).eq(0).clone(!0);
                this[0].parentNode && b.insertBefore(this[0]), b.map(function() {
                    for (var a = this; a.firstChild && 1 === a.firstChild.nodeType; ) a = a.firstChild;
                    return a;
                }).append(this);
            }
            return this;
        },
        wrapInner: function(a) {
            return this.each(n.isFunction(a) ? function(b) {
                n(this).wrapInner(a.call(this, b));
            } : function() {
                var b = n(this), c = b.contents();
                c.length ? c.wrapAll(a) : b.append(a);
            });
        },
        wrap: function(a) {
            var b = n.isFunction(a);
            return this.each(function(c) {
                n(this).wrapAll(b ? a.call(this, c) : a);
            });
        },
        unwrap: function() {
            return this.parent().each(function() {
                n.nodeName(this, "body") || n(this).replaceWith(this.childNodes);
            }).end();
        }
    }), n.expr.filters.hidden = function(a) {
        return a.offsetWidth <= 0 && a.offsetHeight <= 0 || !l.reliableHiddenOffsets() && "none" === (a.style && a.style.display || n.css(a, "display"));
    }, n.expr.filters.visible = function(a) {
        return !n.expr.filters.hidden(a);
    };
    var Rc = /%20/g, Sc = /\[\]$/, Tc = /\r?\n/g, Uc = /^(?:submit|button|image|reset|file)$/i, Vc = /^(?:input|select|textarea|keygen)/i;
    n.param = function(a, b) {
        var c, d = [], e = function(a, b) {
            b = n.isFunction(b) ? b() : null == b ? "" : b, d[d.length] = encodeURIComponent(a) + "=" + encodeURIComponent(b);
        };
        if (void 0 === b && (b = n.ajaxSettings && n.ajaxSettings.traditional), n.isArray(a) || a.jquery && !n.isPlainObject(a)) n.each(a, function() {
            e(this.name, this.value);
        }); else for (c in a) Wc(c, a[c], b, e);
        return d.join("&").replace(Rc, "+");
    }, n.fn.extend({
        serialize: function() {
            return n.param(this.serializeArray());
        },
        serializeArray: function() {
            return this.map(function() {
                var a = n.prop(this, "elements");
                return a ? n.makeArray(a) : this;
            }).filter(function() {
                var a = this.type;
                return this.name && !n(this).is(":disabled") && Vc.test(this.nodeName) && !Uc.test(a) && (this.checked || !X.test(a));
            }).map(function(a, b) {
                var c = n(this).val();
                return null == c ? null : n.isArray(c) ? n.map(c, function(a) {
                    return {
                        name: b.name,
                        value: a.replace(Tc, "\r\n")
                    };
                }) : {
                    name: b.name,
                    value: c.replace(Tc, "\r\n")
                };
            }).get();
        }
    }), n.ajaxSettings.xhr = void 0 !== a.ActiveXObject ? function() {
        return !this.isLocal && /^(get|post|head|put|delete|options)$/i.test(this.type) && $c() || _c();
    } : $c;
    var Xc = 0, Yc = {}, Zc = n.ajaxSettings.xhr();
    a.ActiveXObject && n(a).on("unload", function() {
        for (var a in Yc) Yc[a](void 0, !0);
    }), l.cors = !!Zc && "withCredentials" in Zc, Zc = l.ajax = !!Zc, Zc && n.ajaxTransport(function(a) {
        if (!a.crossDomain || l.cors) {
            var b;
            return {
                send: function(c, d) {
                    var e, f = a.xhr(), g = ++Xc;
                    if (f.open(a.type, a.url, a.async, a.username, a.password), a.xhrFields) for (e in a.xhrFields) f[e] = a.xhrFields[e];
                    a.mimeType && f.overrideMimeType && f.overrideMimeType(a.mimeType), a.crossDomain || c["X-Requested-With"] || (c["X-Requested-With"] = "XMLHttpRequest");
                    for (e in c) void 0 !== c[e] && f.setRequestHeader(e, c[e] + "");
                    f.send(a.hasContent && a.data || null), b = function(c, e) {
                        var h, i, j;
                        if (b && (e || 4 === f.readyState)) if (delete Yc[g], b = void 0, f.onreadystatechange = n.noop, 
                        e) 4 !== f.readyState && f.abort(); else {
                            j = {}, h = f.status, "string" == typeof f.responseText && (j.text = f.responseText);
                            try {
                                i = f.statusText;
                            } catch (k) {
                                i = "";
                            }
                            h || !a.isLocal || a.crossDomain ? 1223 === h && (h = 204) : h = j.text ? 200 : 404;
                        }
                        j && d(h, i, j, f.getAllResponseHeaders());
                    }, a.async ? 4 === f.readyState ? setTimeout(b) : f.onreadystatechange = Yc[g] = b : b();
                },
                abort: function() {
                    b && b(void 0, !0);
                }
            };
        }
    }), n.ajaxSetup({
        accepts: {
            script: "text/javascript, application/javascript, application/ecmascript, application/x-ecmascript"
        },
        contents: {
            script: /(?:java|ecma)script/
        },
        converters: {
            "text script": function(a) {
                return n.globalEval(a), a;
            }
        }
    }), n.ajaxPrefilter("script", function(a) {
        void 0 === a.cache && (a.cache = !1), a.crossDomain && (a.type = "GET", a.global = !1);
    }), n.ajaxTransport("script", function(a) {
        if (a.crossDomain) {
            var b, c = z.head || n("head")[0] || z.documentElement;
            return {
                send: function(d, e) {
                    b = z.createElement("script"), b.async = !0, a.scriptCharset && (b.charset = a.scriptCharset), 
                    b.src = a.url, b.onload = b.onreadystatechange = function(a, c) {
                        (c || !b.readyState || /loaded|complete/.test(b.readyState)) && (b.onload = b.onreadystatechange = null, 
                        b.parentNode && b.parentNode.removeChild(b), b = null, c || e(200, "success"));
                    }, c.insertBefore(b, c.firstChild);
                },
                abort: function() {
                    b && b.onload(void 0, !0);
                }
            };
        }
    });
    var ad = [], bd = /(=)\?(?=&|$)|\?\?/;
    n.ajaxSetup({
        jsonp: "callback",
        jsonpCallback: function() {
            var a = ad.pop() || n.expando + "_" + wc++;
            return this[a] = !0, a;
        }
    }), n.ajaxPrefilter("json jsonp", function(b, c, d) {
        var e, f, g, h = b.jsonp !== !1 && (bd.test(b.url) ? "url" : "string" == typeof b.data && !(b.contentType || "").indexOf("application/x-www-form-urlencoded") && bd.test(b.data) && "data");
        return h || "jsonp" === b.dataTypes[0] ? (e = b.jsonpCallback = n.isFunction(b.jsonpCallback) ? b.jsonpCallback() : b.jsonpCallback, 
        h ? b[h] = b[h].replace(bd, "$1" + e) : b.jsonp !== !1 && (b.url += (xc.test(b.url) ? "&" : "?") + b.jsonp + "=" + e), 
        b.converters["script json"] = function() {
            return g || n.error(e + " was not called"), g[0];
        }, b.dataTypes[0] = "json", f = a[e], a[e] = function() {
            g = arguments;
        }, d.always(function() {
            a[e] = f, b[e] && (b.jsonpCallback = c.jsonpCallback, ad.push(e)), g && n.isFunction(f) && f(g[0]), 
            g = f = void 0;
        }), "script") : void 0;
    }), n.parseHTML = function(a, b, c) {
        if (!a || "string" != typeof a) return null;
        "boolean" == typeof b && (c = b, b = !1), b = b || z;
        var d = v.exec(a), e = !c && [];
        return d ? [ b.createElement(d[1]) ] : (d = n.buildFragment([ a ], b, e), e && e.length && n(e).remove(), 
        n.merge([], d.childNodes));
    };
    var cd = n.fn.load;
    n.fn.load = function(a, b, c) {
        if ("string" != typeof a && cd) return cd.apply(this, arguments);
        var d, e, f, g = this, h = a.indexOf(" ");
        return h >= 0 && (d = a.slice(h, a.length), a = a.slice(0, h)), n.isFunction(b) ? (c = b, 
        b = void 0) : b && "object" == typeof b && (f = "POST"), g.length > 0 && n.ajax({
            url: a,
            type: f,
            dataType: "html",
            data: b
        }).done(function(a) {
            e = arguments, g.html(d ? n("<div>").append(n.parseHTML(a)).find(d) : a);
        }).complete(c && function(a, b) {
            g.each(c, e || [ a.responseText, b, a ]);
        }), this;
    }, n.expr.filters.animated = function(a) {
        return n.grep(n.timers, function(b) {
            return a === b.elem;
        }).length;
    };
    var dd = a.document.documentElement;
    n.offset = {
        setOffset: function(a, b, c) {
            var d, e, f, g, h, i, j, k = n.css(a, "position"), l = n(a), m = {};
            "static" === k && (a.style.position = "relative"), h = l.offset(), f = n.css(a, "top"), 
            i = n.css(a, "left"), j = ("absolute" === k || "fixed" === k) && n.inArray("auto", [ f, i ]) > -1, 
            j ? (d = l.position(), g = d.top, e = d.left) : (g = parseFloat(f) || 0, e = parseFloat(i) || 0), 
            n.isFunction(b) && (b = b.call(a, c, h)), null != b.top && (m.top = b.top - h.top + g), 
            null != b.left && (m.left = b.left - h.left + e), "using" in b ? b.using.call(a, m) : l.css(m);
        }
    }, n.fn.extend({
        offset: function(a) {
            if (arguments.length) return void 0 === a ? this : this.each(function(b) {
                n.offset.setOffset(this, a, b);
            });
            var b, c, d = {
                top: 0,
                left: 0
            }, e = this[0], f = e && e.ownerDocument;
            return f ? (b = f.documentElement, n.contains(b, e) ? (typeof e.getBoundingClientRect !== L && (d = e.getBoundingClientRect()), 
            c = ed(f), {
                top: d.top + (c.pageYOffset || b.scrollTop) - (b.clientTop || 0),
                left: d.left + (c.pageXOffset || b.scrollLeft) - (b.clientLeft || 0)
            }) : d) : void 0;
        },
        position: function() {
            if (this[0]) {
                var a, b, c = {
                    top: 0,
                    left: 0
                }, d = this[0];
                return "fixed" === n.css(d, "position") ? b = d.getBoundingClientRect() : (a = this.offsetParent(), 
                b = this.offset(), n.nodeName(a[0], "html") || (c = a.offset()), c.top += n.css(a[0], "borderTopWidth", !0), 
                c.left += n.css(a[0], "borderLeftWidth", !0)), {
                    top: b.top - c.top - n.css(d, "marginTop", !0),
                    left: b.left - c.left - n.css(d, "marginLeft", !0)
                };
            }
        },
        offsetParent: function() {
            return this.map(function() {
                for (var a = this.offsetParent || dd; a && !n.nodeName(a, "html") && "static" === n.css(a, "position"); ) a = a.offsetParent;
                return a || dd;
            });
        }
    }), n.each({
        scrollLeft: "pageXOffset",
        scrollTop: "pageYOffset"
    }, function(a, b) {
        var c = /Y/.test(b);
        n.fn[a] = function(d) {
            return W(this, function(a, d, e) {
                var f = ed(a);
                return void 0 === e ? f ? b in f ? f[b] : f.document.documentElement[d] : a[d] : void (f ? f.scrollTo(c ? n(f).scrollLeft() : e, c ? e : n(f).scrollTop()) : a[d] = e);
            }, a, d, arguments.length, null);
        };
    }), n.each([ "top", "left" ], function(a, b) {
        n.cssHooks[b] = Mb(l.pixelPosition, function(a, c) {
            return c ? (c = Kb(a, b), Ib.test(c) ? n(a).position()[b] + "px" : c) : void 0;
        });
    }), n.each({
        Height: "height",
        Width: "width"
    }, function(a, b) {
        n.each({
            padding: "inner" + a,
            content: b,
            "": "outer" + a
        }, function(c, d) {
            n.fn[d] = function(d, e) {
                var f = arguments.length && (c || "boolean" != typeof d), g = c || (d === !0 || e === !0 ? "margin" : "border");
                return W(this, function(b, c, d) {
                    var e;
                    return n.isWindow(b) ? b.document.documentElement["client" + a] : 9 === b.nodeType ? (e = b.documentElement, 
                    Math.max(b.body["scroll" + a], e["scroll" + a], b.body["offset" + a], e["offset" + a], e["client" + a])) : void 0 === d ? n.css(b, c, g) : n.style(b, c, d, g);
                }, b, f ? d : void 0, f, null);
            };
        });
    }), n.fn.size = function() {
        return this.length;
    }, n.fn.andSelf = n.fn.addBack, "function" == typeof define && define.amd && define("jquery", [], function() {
        return n;
    });
    var fd = a.jQuery, gd = a.$;
    return n.noConflict = function(b) {
        return a.$ === n && (a.$ = gd), b && a.jQuery === n && (a.jQuery = fd), n;
    }, typeof b === L && (a.jQuery = a.$ = n), n;
}), function() {
    var initializing = !1, fnTest = /xyz/.test(function() {}) ? /\b_super\b/ : /.*/;
    this.Class = function() {}, Class.extend = function(prop) {
        function Class() {
            !initializing && this.init && this.init.apply(this, arguments);
        }
        var _super = this.prototype;
        initializing = !0;
        var prototype = new this();
        initializing = !1;
        for (var name in prop) prototype[name] = "function" == typeof prop[name] && "function" == typeof _super[name] && fnTest.test(prop[name]) ? function(name, fn) {
            return function() {
                var tmp = this._super;
                this._super = _super[name];
                var ret = fn.apply(this, arguments);
                return this._super = tmp, ret;
            };
        }(name, prop[name]) : prop[name];
        return Class.prototype = prototype, Class.prototype.constructor = Class, Class.extend = arguments.callee, 
        Class;
    };
}(), (window._gsQueue || (window._gsQueue = [])).push(function() {
    "use strict";
    window._gsDefine("easing.Back", [ "easing.Ease" ], function(t) {
        var e, i, s, r = window.GreenSockGlobals || window, n = r.com.greensock, a = 2 * Math.PI, o = Math.PI / 2, h = n._class, l = function(e, i) {
            var s = h("easing." + e, function() {}, !0), r = s.prototype = new t();
            return r.constructor = s, r.getRatio = i, s;
        }, _ = t.register || function() {}, u = function(t, e, i, s) {
            var r = h("easing." + t, {
                easeOut: new e(),
                easeIn: new i(),
                easeInOut: new s()
            }, !0);
            return _(r, t), r;
        }, c = function(t, e, i) {
            this.t = t, this.v = e, i && (this.next = i, i.prev = this, this.c = i.v - e, this.gap = i.t - t);
        }, f = function(e, i) {
            var s = h("easing." + e, function(t) {
                this._p1 = t || 0 === t ? t : 1.70158, this._p2 = 1.525 * this._p1;
            }, !0), r = s.prototype = new t();
            return r.constructor = s, r.getRatio = i, r.config = function(t) {
                return new s(t);
            }, s;
        }, p = u("Back", f("BackOut", function(t) {
            return (t -= 1) * t * ((this._p1 + 1) * t + this._p1) + 1;
        }), f("BackIn", function(t) {
            return t * t * ((this._p1 + 1) * t - this._p1);
        }), f("BackInOut", function(t) {
            return 1 > (t *= 2) ? .5 * t * t * ((this._p2 + 1) * t - this._p2) : .5 * ((t -= 2) * t * ((this._p2 + 1) * t + this._p2) + 2);
        })), m = h("easing.SlowMo", function(t, e, i) {
            e = e || 0 === e ? e : .7, null == t ? t = .7 : t > 1 && (t = 1), this._p = 1 !== t ? e : 0, 
            this._p1 = (1 - t) / 2, this._p2 = t, this._p3 = this._p1 + this._p2, this._calcEnd = i === !0;
        }, !0), d = m.prototype = new t();
        return d.constructor = m, d.getRatio = function(t) {
            var e = t + (.5 - t) * this._p;
            return this._p1 > t ? this._calcEnd ? 1 - (t = 1 - t / this._p1) * t : e - (t = 1 - t / this._p1) * t * t * t * e : t > this._p3 ? this._calcEnd ? 1 - (t = (t - this._p3) / this._p1) * t : e + (t - e) * (t = (t - this._p3) / this._p1) * t * t * t : this._calcEnd ? 1 : e;
        }, m.ease = new m(.7, .7), d.config = m.config = function(t, e, i) {
            return new m(t, e, i);
        }, e = h("easing.SteppedEase", function(t) {
            t = t || 1, this._p1 = 1 / t, this._p2 = t + 1;
        }, !0), d = e.prototype = new t(), d.constructor = e, d.getRatio = function(t) {
            return 0 > t ? t = 0 : t >= 1 && (t = .999999999), (this._p2 * t >> 0) * this._p1;
        }, d.config = e.config = function(t) {
            return new e(t);
        }, i = h("easing.RoughEase", function(e) {
            e = e || {};
            for (var i, s, r, n, a, o, h = e.taper || "none", l = [], _ = 0, u = 0 | (e.points || 20), f = u, p = e.randomize !== !1, m = e.clamp === !0, d = e.template instanceof t ? e.template : null, g = "number" == typeof e.strength ? .4 * e.strength : .4; --f > -1; ) i = p ? Math.random() : 1 / u * f, 
            s = d ? d.getRatio(i) : i, "none" === h ? r = g : "out" === h ? (n = 1 - i, r = n * n * g) : "in" === h ? r = i * i * g : .5 > i ? (n = 2 * i, 
            r = .5 * n * n * g) : (n = 2 * (1 - i), r = .5 * n * n * g), p ? s += Math.random() * r - .5 * r : f % 2 ? s += .5 * r : s -= .5 * r, 
            m && (s > 1 ? s = 1 : 0 > s && (s = 0)), l[_++] = {
                x: i,
                y: s
            };
            for (l.sort(function(t, e) {
                return t.x - e.x;
            }), o = new c(1, 1, null), f = u; --f > -1; ) a = l[f], o = new c(a.x, a.y, o);
            this._prev = new c(0, 0, 0 !== o.t ? o : o.next);
        }, !0), d = i.prototype = new t(), d.constructor = i, d.getRatio = function(t) {
            var e = this._prev;
            if (t > e.t) {
                for (;e.next && t >= e.t; ) e = e.next;
                e = e.prev;
            } else for (;e.prev && e.t >= t; ) e = e.prev;
            return this._prev = e, e.v + (t - e.t) / e.gap * e.c;
        }, d.config = function(t) {
            return new i(t);
        }, i.ease = new i(), u("Bounce", l("BounceOut", function(t) {
            return 1 / 2.75 > t ? 7.5625 * t * t : 2 / 2.75 > t ? 7.5625 * (t -= 1.5 / 2.75) * t + .75 : 2.5 / 2.75 > t ? 7.5625 * (t -= 2.25 / 2.75) * t + .9375 : 7.5625 * (t -= 2.625 / 2.75) * t + .984375;
        }), l("BounceIn", function(t) {
            return 1 / 2.75 > (t = 1 - t) ? 1 - 7.5625 * t * t : 2 / 2.75 > t ? 1 - (7.5625 * (t -= 1.5 / 2.75) * t + .75) : 2.5 / 2.75 > t ? 1 - (7.5625 * (t -= 2.25 / 2.75) * t + .9375) : 1 - (7.5625 * (t -= 2.625 / 2.75) * t + .984375);
        }), l("BounceInOut", function(t) {
            var e = .5 > t;
            return t = e ? 1 - 2 * t : 2 * t - 1, t = 1 / 2.75 > t ? 7.5625 * t * t : 2 / 2.75 > t ? 7.5625 * (t -= 1.5 / 2.75) * t + .75 : 2.5 / 2.75 > t ? 7.5625 * (t -= 2.25 / 2.75) * t + .9375 : 7.5625 * (t -= 2.625 / 2.75) * t + .984375, 
            e ? .5 * (1 - t) : .5 * t + .5;
        })), u("Circ", l("CircOut", function(t) {
            return Math.sqrt(1 - (t -= 1) * t);
        }), l("CircIn", function(t) {
            return -(Math.sqrt(1 - t * t) - 1);
        }), l("CircInOut", function(t) {
            return 1 > (t *= 2) ? -.5 * (Math.sqrt(1 - t * t) - 1) : .5 * (Math.sqrt(1 - (t -= 2) * t) + 1);
        })), s = function(e, i, s) {
            var r = h("easing." + e, function(t, e) {
                this._p1 = t || 1, this._p2 = e || s, this._p3 = this._p2 / a * (Math.asin(1 / this._p1) || 0);
            }, !0), n = r.prototype = new t();
            return n.constructor = r, n.getRatio = i, n.config = function(t, e) {
                return new r(t, e);
            }, r;
        }, u("Elastic", s("ElasticOut", function(t) {
            return this._p1 * Math.pow(2, -10 * t) * Math.sin((t - this._p3) * a / this._p2) + 1;
        }, .3), s("ElasticIn", function(t) {
            return -(this._p1 * Math.pow(2, 10 * (t -= 1)) * Math.sin((t - this._p3) * a / this._p2));
        }, .3), s("ElasticInOut", function(t) {
            return 1 > (t *= 2) ? -.5 * this._p1 * Math.pow(2, 10 * (t -= 1)) * Math.sin((t - this._p3) * a / this._p2) : .5 * this._p1 * Math.pow(2, -10 * (t -= 1)) * Math.sin((t - this._p3) * a / this._p2) + 1;
        }, .45)), u("Expo", l("ExpoOut", function(t) {
            return 1 - Math.pow(2, -10 * t);
        }), l("ExpoIn", function(t) {
            return Math.pow(2, 10 * (t - 1)) - .001;
        }), l("ExpoInOut", function(t) {
            return 1 > (t *= 2) ? .5 * Math.pow(2, 10 * (t - 1)) : .5 * (2 - Math.pow(2, -10 * (t - 1)));
        })), u("Sine", l("SineOut", function(t) {
            return Math.sin(t * o);
        }), l("SineIn", function(t) {
            return -Math.cos(t * o) + 1;
        }), l("SineInOut", function(t) {
            return -.5 * (Math.cos(Math.PI * t) - 1);
        })), h("easing.EaseLookup", {
            find: function(e) {
                return t.map[e];
            }
        }, !0), _(r.SlowMo, "SlowMo", "ease,"), _(i, "RoughEase", "ease,"), _(e, "SteppedEase", "ease,"), 
        p;
    }, !0);
}), window._gsDefine && window._gsQueue.pop()(), (window._gsQueue || (window._gsQueue = [])).push(function() {
    "use strict";
    window._gsDefine("TimelineLite", [ "core.Animation", "core.SimpleTimeline", "TweenLite" ], function(t, e, i) {
        var s = function(t) {
            e.call(this, t), this._labels = {}, this.autoRemoveChildren = this.vars.autoRemoveChildren === !0, 
            this.smoothChildTiming = this.vars.smoothChildTiming === !0, this._sortChildren = !0, 
            this._onUpdate = this.vars.onUpdate;
            var i, s, r = this.vars;
            for (s in r) i = r[s], i instanceof Array && -1 !== i.join("").indexOf("{self}") && (r[s] = this._swapSelfInParams(i));
            r.tweens instanceof Array && this.add(r.tweens, 0, r.align, r.stagger);
        }, r = [], n = function(t) {
            var e, i = {};
            for (e in t) i[e] = t[e];
            return i;
        }, a = function(t, e, i, s) {
            t._timeline.pause(t._startTime), e && e.apply(s || t._timeline, i || r);
        }, o = r.slice, h = s.prototype = new e();
        return s.version = "1.10.2", h.constructor = s, h.kill()._gc = !1, h.to = function(t, e, s, r) {
            return e ? this.add(new i(t, e, s), r) : this.set(t, s, r);
        }, h.from = function(t, e, s, r) {
            return this.add(i.from(t, e, s), r);
        }, h.fromTo = function(t, e, s, r, n) {
            return e ? this.add(i.fromTo(t, e, s, r), n) : this.set(t, r, n);
        }, h.staggerTo = function(t, e, r, a, h, l, _, u) {
            var p, f = new s({
                onComplete: l,
                onCompleteParams: _,
                onCompleteScope: u
            });
            for ("string" == typeof t && (t = i.selector(t) || t), !(t instanceof Array) && t.length && t !== window && t[0] && (t[0] === window || t[0].nodeType && t[0].style && !t.nodeType) && (t = o.call(t, 0)), 
            a = a || 0, p = 0; t.length > p; p++) r.startAt && (r.startAt = n(r.startAt)), f.to(t[p], e, n(r), p * a);
            return this.add(f, h);
        }, h.staggerFrom = function(t, e, i, s, r, n, a, o) {
            return i.immediateRender = 0 != i.immediateRender, i.runBackwards = !0, this.staggerTo(t, e, i, s, r, n, a, o);
        }, h.staggerFromTo = function(t, e, i, s, r, n, a, o, h) {
            return s.startAt = i, s.immediateRender = 0 != s.immediateRender && 0 != i.immediateRender, 
            this.staggerTo(t, e, s, r, n, a, o, h);
        }, h.call = function(t, e, s, r) {
            return this.add(i.delayedCall(0, t, e, s), r);
        }, h.set = function(t, e, s) {
            return s = this._parseTimeOrLabel(s, 0, !0), null == e.immediateRender && (e.immediateRender = s === this._time && !this._paused), 
            this.add(new i(t, 0, e), s);
        }, s.exportRoot = function(t, e) {
            t = t || {}, null == t.smoothChildTiming && (t.smoothChildTiming = !0);
            var r, n, a = new s(t), o = a._timeline;
            for (null == e && (e = !0), o._remove(a, !0), a._startTime = 0, a._rawPrevTime = a._time = a._totalTime = o._time, 
            r = o._first; r; ) n = r._next, e && r instanceof i && r.target === r.vars.onComplete || a.add(r, r._startTime - r._delay), 
            r = n;
            return o.add(a, 0), a;
        }, h.add = function(r, n, a, o) {
            var h, l, _, u, p;
            if ("number" != typeof n && (n = this._parseTimeOrLabel(n, 0, !0, r)), !(r instanceof t)) {
                if (r instanceof Array) {
                    for (a = a || "normal", o = o || 0, h = n, l = r.length, _ = 0; l > _; _++) (u = r[_]) instanceof Array && (u = new s({
                        tweens: u
                    })), this.add(u, h), "string" != typeof u && "function" != typeof u && ("sequence" === a ? h = u._startTime + u.totalDuration() / u._timeScale : "start" === a && (u._startTime -= u.delay())), 
                    h += o;
                    return this._uncache(!0);
                }
                if ("string" == typeof r) return this.addLabel(r, n);
                if ("function" != typeof r) throw "Cannot add " + r + " into the timeline; it is neither a tween, timeline, function, nor a string.";
                r = i.delayedCall(0, r);
            }
            if (e.prototype.add.call(this, r, n), this._gc && !this._paused && this._time === this._duration && this._time < this.duration()) for (p = this; p._gc && p._timeline; ) p._timeline.smoothChildTiming ? p.totalTime(p._totalTime, !0) : p._enabled(!0, !1), 
            p = p._timeline;
            return this;
        }, h.remove = function(e) {
            if (e instanceof t) return this._remove(e, !1);
            if (e instanceof Array) {
                for (var i = e.length; --i > -1; ) this.remove(e[i]);
                return this;
            }
            return "string" == typeof e ? this.removeLabel(e) : this.kill(null, e);
        }, h._remove = function(t, i) {
            return e.prototype._remove.call(this, t, i), this._last ? this._time > this._last._startTime && (this._time = this.duration(), 
            this._totalTime = this._totalDuration) : this._time = this._totalTime = 0, this;
        }, h.append = function(t, e) {
            return this.add(t, this._parseTimeOrLabel(null, e, !0, t));
        }, h.insert = h.insertMultiple = function(t, e, i, s) {
            return this.add(t, e || 0, i, s);
        }, h.appendMultiple = function(t, e, i, s) {
            return this.add(t, this._parseTimeOrLabel(null, e, !0, t), i, s);
        }, h.addLabel = function(t, e) {
            return this._labels[t] = this._parseTimeOrLabel(e), this;
        }, h.addPause = function(t, e, i, s) {
            return this.call(a, [ "{self}", e, i, s ], this, t);
        }, h.removeLabel = function(t) {
            return delete this._labels[t], this;
        }, h.getLabelTime = function(t) {
            return null != this._labels[t] ? this._labels[t] : -1;
        }, h._parseTimeOrLabel = function(e, i, s, r) {
            var n;
            if (r instanceof t && r.timeline === this) this.remove(r); else if (r instanceof Array) for (n = r.length; --n > -1; ) r[n] instanceof t && r[n].timeline === this && this.remove(r[n]);
            if ("string" == typeof i) return this._parseTimeOrLabel(i, s && "number" == typeof e && null == this._labels[i] ? e - this.duration() : 0, s);
            if (i = i || 0, "string" != typeof e || !isNaN(e) && null == this._labels[e]) null == e && (e = this.duration()); else {
                if (n = e.indexOf("="), -1 === n) return null == this._labels[e] ? s ? this._labels[e] = this.duration() + i : i : this._labels[e] + i;
                i = parseInt(e.charAt(n - 1) + "1", 10) * Number(e.substr(n + 1)), e = n > 1 ? this._parseTimeOrLabel(e.substr(0, n - 1), 0, s) : this.duration();
            }
            return Number(e) + i;
        }, h.seek = function(t, e) {
            return this.totalTime("number" == typeof t ? t : this._parseTimeOrLabel(t), e !== !1);
        }, h.stop = function() {
            return this.paused(!0);
        }, h.gotoAndPlay = function(t, e) {
            return this.play(t, e);
        }, h.gotoAndStop = function(t, e) {
            return this.pause(t, e);
        }, h.render = function(t, e, i) {
            this._gc && this._enabled(!0, !1);
            var s, n, a, o, h, l = this._dirty ? this.totalDuration() : this._totalDuration, _ = this._time, u = this._startTime, p = this._timeScale, f = this._paused;
            if (t >= l ? (this._totalTime = this._time = l, this._reversed || this._hasPausedChild() || (n = !0, 
            o = "onComplete", 0 === this._duration && (0 === t || 0 > this._rawPrevTime) && this._rawPrevTime !== t && this._first && (h = !0, 
            this._rawPrevTime > 0 && (o = "onReverseComplete"))), this._rawPrevTime = t, t = l + 1e-6) : 1e-7 > t ? (this._totalTime = this._time = 0, 
            (0 !== _ || 0 === this._duration && this._rawPrevTime > 0) && (o = "onReverseComplete", 
            n = this._reversed), 0 > t ? (this._active = !1, 0 === this._duration && this._rawPrevTime >= 0 && this._first && (h = !0), 
            this._rawPrevTime = t) : (this._rawPrevTime = t, t = 0, this._initted || (h = !0))) : this._totalTime = this._time = this._rawPrevTime = t, 
            this._time !== _ && this._first || i || h) {
                if (this._initted || (this._initted = !0), this._active || !this._paused && this._time !== _ && t > 0 && (this._active = !0), 
                0 === _ && this.vars.onStart && 0 !== this._time && (e || this.vars.onStart.apply(this.vars.onStartScope || this, this.vars.onStartParams || r)), 
                this._time >= _) for (s = this._first; s && (a = s._next, !this._paused || f); ) (s._active || s._startTime <= this._time && !s._paused && !s._gc) && (s._reversed ? s.render((s._dirty ? s.totalDuration() : s._totalDuration) - (t - s._startTime) * s._timeScale, e, i) : s.render((t - s._startTime) * s._timeScale, e, i)), 
                s = a; else for (s = this._last; s && (a = s._prev, !this._paused || f); ) (s._active || _ >= s._startTime && !s._paused && !s._gc) && (s._reversed ? s.render((s._dirty ? s.totalDuration() : s._totalDuration) - (t - s._startTime) * s._timeScale, e, i) : s.render((t - s._startTime) * s._timeScale, e, i)), 
                s = a;
                this._onUpdate && (e || this._onUpdate.apply(this.vars.onUpdateScope || this, this.vars.onUpdateParams || r)), 
                o && (this._gc || (u === this._startTime || p !== this._timeScale) && (0 === this._time || l >= this.totalDuration()) && (n && (this._timeline.autoRemoveChildren && this._enabled(!1, !1), 
                this._active = !1), !e && this.vars[o] && this.vars[o].apply(this.vars[o + "Scope"] || this, this.vars[o + "Params"] || r)));
            }
        }, h._hasPausedChild = function() {
            for (var t = this._first; t; ) {
                if (t._paused || t instanceof s && t._hasPausedChild()) return !0;
                t = t._next;
            }
            return !1;
        }, h.getChildren = function(t, e, s, r) {
            r = r || -9999999999;
            for (var n = [], a = this._first, o = 0; a; ) r > a._startTime || (a instanceof i ? e !== !1 && (n[o++] = a) : (s !== !1 && (n[o++] = a), 
            t !== !1 && (n = n.concat(a.getChildren(!0, e, s)), o = n.length))), a = a._next;
            return n;
        }, h.getTweensOf = function(t, e) {
            for (var s = i.getTweensOf(t), r = s.length, n = [], a = 0; --r > -1; ) (s[r].timeline === this || e && this._contains(s[r])) && (n[a++] = s[r]);
            return n;
        }, h._contains = function(t) {
            for (var e = t.timeline; e; ) {
                if (e === this) return !0;
                e = e.timeline;
            }
            return !1;
        }, h.shiftChildren = function(t, e, i) {
            i = i || 0;
            for (var s, r = this._first, n = this._labels; r; ) r._startTime >= i && (r._startTime += t), 
            r = r._next;
            if (e) for (s in n) n[s] >= i && (n[s] += t);
            return this._uncache(!0);
        }, h._kill = function(t, e) {
            if (!t && !e) return this._enabled(!1, !1);
            for (var i = e ? this.getTweensOf(e) : this.getChildren(!0, !0, !1), s = i.length, r = !1; --s > -1; ) i[s]._kill(t, e) && (r = !0);
            return r;
        }, h.clear = function(t) {
            var e = this.getChildren(!1, !0, !0), i = e.length;
            for (this._time = this._totalTime = 0; --i > -1; ) e[i]._enabled(!1, !1);
            return t !== !1 && (this._labels = {}), this._uncache(!0);
        }, h.invalidate = function() {
            for (var t = this._first; t; ) t.invalidate(), t = t._next;
            return this;
        }, h._enabled = function(t, i) {
            if (t === this._gc) for (var s = this._first; s; ) s._enabled(t, !0), s = s._next;
            return e.prototype._enabled.call(this, t, i);
        }, h.progress = function(t) {
            return arguments.length ? this.totalTime(this.duration() * t, !1) : this._time / this.duration();
        }, h.duration = function(t) {
            return arguments.length ? (0 !== this.duration() && 0 !== t && this.timeScale(this._duration / t), 
            this) : (this._dirty && this.totalDuration(), this._duration);
        }, h.totalDuration = function(t) {
            if (!arguments.length) {
                if (this._dirty) {
                    for (var e, i, s = 0, r = this._last, n = 999999999999; r; ) e = r._prev, r._dirty && r.totalDuration(), 
                    r._startTime > n && this._sortChildren && !r._paused ? this.add(r, r._startTime - r._delay) : n = r._startTime, 
                    0 > r._startTime && !r._paused && (s -= r._startTime, this._timeline.smoothChildTiming && (this._startTime += r._startTime / this._timeScale), 
                    this.shiftChildren(-r._startTime, !1, -9999999999), n = 0), i = r._startTime + r._totalDuration / r._timeScale, 
                    i > s && (s = i), r = e;
                    this._duration = this._totalDuration = s, this._dirty = !1;
                }
                return this._totalDuration;
            }
            return 0 !== this.totalDuration() && 0 !== t && this.timeScale(this._totalDuration / t), 
            this;
        }, h.usesFrames = function() {
            for (var e = this._timeline; e._timeline; ) e = e._timeline;
            return e === t._rootFramesTimeline;
        }, h.rawTime = function() {
            return this._paused || 0 !== this._totalTime && this._totalTime !== this._totalDuration ? this._totalTime : (this._timeline.rawTime() - this._startTime) * this._timeScale;
        }, s;
    }, !0);
}), window._gsDefine && window._gsQueue.pop()(), function(t) {
    "use strict";
    var e, i, s, n, r, a = t.GreenSockGlobals || t, o = function(t) {
        var e, i = t.split("."), s = a;
        for (e = 0; i.length > e; e++) s[i[e]] = s = s[i[e]] || {};
        return s;
    }, h = o("com.greensock"), l = [].slice, _ = function() {}, u = {}, m = function(e, i, s, n) {
        this.sc = u[e] ? u[e].sc : [], u[e] = this, this.gsClass = null, this.func = s;
        var r = [];
        this.check = function(h) {
            for (var l, _, f, p, c = i.length, d = c; --c > -1; ) (l = u[i[c]] || new m(i[c], [])).gsClass ? (r[c] = l.gsClass, 
            d--) : h && l.sc.push(this);
            if (0 === d && s) for (_ = ("com.greensock." + e).split("."), f = _.pop(), p = o(_.join("."))[f] = this.gsClass = s.apply(s, r), 
            n && (a[f] = p, "function" == typeof define && define.amd ? define((t.GreenSockAMDPath ? t.GreenSockAMDPath + "/" : "") + e.split(".").join("/"), [], function() {
                return p;
            }) : "undefined" != typeof module && module.exports && (module.exports = p)), c = 0; this.sc.length > c; c++) this.sc[c].check();
        }, this.check(!0);
    }, f = t._gsDefine = function(t, e, i, s) {
        return new m(t, e, i, s);
    }, p = h._class = function(t, e, i) {
        return e = e || function() {}, f(t, [], function() {
            return e;
        }, i), e;
    };
    f.globals = a;
    var c = [ 0, 0, 1, 1 ], d = [], v = p("easing.Ease", function(t, e, i, s) {
        this._func = t, this._type = i || 0, this._power = s || 0, this._params = e ? c.concat(e) : c;
    }, !0), g = v.map = {}, T = v.register = function(t, e, i, s) {
        for (var n, r, a, o, l = e.split(","), _ = l.length, u = (i || "easeIn,easeOut,easeInOut").split(","); --_ > -1; ) for (r = l[_], 
        n = s ? p("easing." + r, null, !0) : h.easing[r] || {}, a = u.length; --a > -1; ) o = u[a], 
        g[r + "." + o] = g[o + r] = n[o] = t.getRatio ? t : t[o] || new t();
    };
    for (s = v.prototype, s._calcEnd = !1, s.getRatio = function(t) {
        if (this._func) return this._params[0] = t, this._func.apply(null, this._params);
        var e = this._type, i = this._power, s = 1 === e ? 1 - t : 2 === e ? t : .5 > t ? 2 * t : 2 * (1 - t);
        return 1 === i ? s *= s : 2 === i ? s *= s * s : 3 === i ? s *= s * s * s : 4 === i && (s *= s * s * s * s), 
        1 === e ? 1 - s : 2 === e ? s : .5 > t ? s / 2 : 1 - s / 2;
    }, e = [ "Linear", "Quad", "Cubic", "Quart", "Quint,Strong" ], i = e.length; --i > -1; ) s = e[i] + ",Power" + i, 
    T(new v(null, null, 1, i), s, "easeOut", !0), T(new v(null, null, 2, i), s, "easeIn" + (0 === i ? ",easeNone" : "")), 
    T(new v(null, null, 3, i), s, "easeInOut");
    g.linear = h.easing.Linear.easeIn, g.swing = h.easing.Quad.easeInOut;
    var w = p("events.EventDispatcher", function(t) {
        this._listeners = {}, this._eventTarget = t || this;
    });
    s = w.prototype, s.addEventListener = function(t, e, i, s, a) {
        a = a || 0;
        var o, h, l = this._listeners[t], _ = 0;
        for (null == l && (this._listeners[t] = l = []), h = l.length; --h > -1; ) o = l[h], 
        o.c === e && o.s === i ? l.splice(h, 1) : 0 === _ && a > o.pr && (_ = h + 1);
        l.splice(_, 0, {
            c: e,
            s: i,
            up: s,
            pr: a
        }), this !== n || r || n.wake();
    }, s.removeEventListener = function(t, e) {
        var i, s = this._listeners[t];
        if (s) for (i = s.length; --i > -1; ) if (s[i].c === e) return void s.splice(i, 1);
    }, s.dispatchEvent = function(t) {
        var e, i, s, n = this._listeners[t];
        if (n) for (e = n.length, i = this._eventTarget; --e > -1; ) s = n[e], s.up ? s.c.call(s.s || i, {
            type: t,
            target: i
        }) : s.c.call(s.s || i);
    };
    var P = t.requestAnimationFrame, y = t.cancelAnimationFrame, k = Date.now || function() {
        return new Date().getTime();
    };
    for (e = [ "ms", "moz", "webkit", "o" ], i = e.length; --i > -1 && !P; ) P = t[e[i] + "RequestAnimationFrame"], 
    y = t[e[i] + "CancelAnimationFrame"] || t[e[i] + "CancelRequestAnimationFrame"];
    p("Ticker", function(t, e) {
        var i, s, a, o, h, l = this, u = k(), m = e !== !1 && P, f = function(t) {
            l.time = (k() - u) / 1e3;
            var e = a, n = l.time - h;
            (!i || n > 0 || t === !0) && (l.frame++, h += n + (n >= o ? .004 : o - n), l.dispatchEvent("tick")), 
            t !== !0 && e === a && (a = s(f));
        };
        w.call(l), this.time = this.frame = 0, this.tick = function() {
            f(!0);
        }, this.sleep = function() {
            null != a && (m && y ? y(a) : clearTimeout(a), s = _, a = null, l === n && (r = !1));
        }, this.wake = function() {
            null !== a && l.sleep(), s = 0 === i ? _ : m && P ? P : function(t) {
                return setTimeout(t, 0 | 1e3 * (h - l.time) + 1);
            }, l === n && (r = !0), f(2);
        }, this.fps = function(t) {
            return arguments.length ? (i = t, o = 1 / (i || 60), h = this.time + o, void l.wake()) : i;
        }, this.useRAF = function(t) {
            return arguments.length ? (l.sleep(), m = t, void l.fps(i)) : m;
        }, l.fps(t), setTimeout(function() {
            m && (!a || 5 > l.frame) && l.useRAF(!1);
        }, 1500);
    }), s = h.Ticker.prototype = new h.events.EventDispatcher(), s.constructor = h.Ticker;
    var b = p("core.Animation", function(t, e) {
        if (this.vars = e || {}, this._duration = this._totalDuration = t || 0, this._delay = Number(this.vars.delay) || 0, 
        this._timeScale = 1, this._active = this.vars.immediateRender === !0, this.data = this.vars.data, 
        this._reversed = this.vars.reversed === !0, L) {
            r || n.wake();
            var i = this.vars.useFrames ? U : L;
            i.add(this, i._time), this.vars.paused && this.paused(!0);
        }
    });
    n = b.ticker = new h.Ticker(), s = b.prototype, s._dirty = s._gc = s._initted = s._paused = !1, 
    s._totalTime = s._time = 0, s._rawPrevTime = -1, s._next = s._last = s._onUpdate = s._timeline = s.timeline = null, 
    s._paused = !1, s.play = function(t, e) {
        return arguments.length && this.seek(t, e), this.reversed(!1).paused(!1);
    }, s.pause = function(t, e) {
        return arguments.length && this.seek(t, e), this.paused(!0);
    }, s.resume = function(t, e) {
        return arguments.length && this.seek(t, e), this.paused(!1);
    }, s.seek = function(t, e) {
        return this.totalTime(Number(t), e !== !1);
    }, s.restart = function(t, e) {
        return this.reversed(!1).paused(!1).totalTime(t ? -this._delay : 0, e !== !1, !0);
    }, s.reverse = function(t, e) {
        return arguments.length && this.seek(t || this.totalDuration(), e), this.reversed(!0).paused(!1);
    }, s.render = function() {}, s.invalidate = function() {
        return this;
    }, s._enabled = function(t, e) {
        return r || n.wake(), this._gc = !t, this._active = t && !this._paused && this._totalTime > 0 && this._totalTime < this._totalDuration, 
        e !== !0 && (t && !this.timeline ? this._timeline.add(this, this._startTime - this._delay) : !t && this.timeline && this._timeline._remove(this, !0)), 
        !1;
    }, s._kill = function() {
        return this._enabled(!1, !1);
    }, s.kill = function(t, e) {
        return this._kill(t, e), this;
    }, s._uncache = function(t) {
        for (var e = t ? this : this.timeline; e; ) e._dirty = !0, e = e.timeline;
        return this;
    }, s._swapSelfInParams = function(t) {
        for (var e = t.length, i = t.concat(); --e > -1; ) "{self}" === t[e] && (i[e] = this);
        return i;
    }, s.eventCallback = function(t, e, i, s) {
        if ("on" === (t || "").substr(0, 2)) {
            var n = this.vars;
            if (1 === arguments.length) return n[t];
            null == e ? delete n[t] : (n[t] = e, n[t + "Params"] = i instanceof Array && -1 !== i.join("").indexOf("{self}") ? this._swapSelfInParams(i) : i, 
            n[t + "Scope"] = s), "onUpdate" === t && (this._onUpdate = e);
        }
        return this;
    }, s.delay = function(t) {
        return arguments.length ? (this._timeline.smoothChildTiming && this.startTime(this._startTime + t - this._delay), 
        this._delay = t, this) : this._delay;
    }, s.duration = function(t) {
        return arguments.length ? (this._duration = this._totalDuration = t, this._uncache(!0), 
        this._timeline.smoothChildTiming && this._time > 0 && this._time < this._duration && 0 !== t && this.totalTime(this._totalTime * (t / this._duration), !0), 
        this) : (this._dirty = !1, this._duration);
    }, s.totalDuration = function(t) {
        return this._dirty = !1, arguments.length ? this.duration(t) : this._totalDuration;
    }, s.time = function(t, e) {
        return arguments.length ? (this._dirty && this.totalDuration(), this.totalTime(t > this._duration ? this._duration : t, e)) : this._time;
    }, s.totalTime = function(t, e, i) {
        if (r || n.wake(), !arguments.length) return this._totalTime;
        if (this._timeline) {
            if (0 > t && !i && (t += this.totalDuration()), this._timeline.smoothChildTiming) {
                this._dirty && this.totalDuration();
                var s = this._totalDuration, a = this._timeline;
                if (t > s && !i && (t = s), this._startTime = (this._paused ? this._pauseTime : a._time) - (this._reversed ? s - t : t) / this._timeScale, 
                a._dirty || this._uncache(!1), a._timeline) for (;a._timeline; ) a._timeline._time !== (a._startTime + a._totalTime) / a._timeScale && a.totalTime(a._totalTime, !0), 
                a = a._timeline;
            }
            this._gc && this._enabled(!0, !1), this._totalTime !== t && this.render(t, e, !1);
        }
        return this;
    }, s.startTime = function(t) {
        return arguments.length ? (t !== this._startTime && (this._startTime = t, this.timeline && this.timeline._sortChildren && this.timeline.add(this, t - this._delay)), 
        this) : this._startTime;
    }, s.timeScale = function(t) {
        if (!arguments.length) return this._timeScale;
        if (t = t || 1e-6, this._timeline && this._timeline.smoothChildTiming) {
            var e = this._pauseTime, i = e || 0 === e ? e : this._timeline.totalTime();
            this._startTime = i - (i - this._startTime) * this._timeScale / t;
        }
        return this._timeScale = t, this._uncache(!1);
    }, s.reversed = function(t) {
        return arguments.length ? (t != this._reversed && (this._reversed = t, this.totalTime(this._totalTime, !0)), 
        this) : this._reversed;
    }, s.paused = function(t) {
        if (!arguments.length) return this._paused;
        if (t != this._paused && this._timeline) {
            r || t || n.wake();
            var e = this._timeline, i = e.rawTime(), s = i - this._pauseTime;
            !t && e.smoothChildTiming && (this._startTime += s, this._uncache(!1)), this._pauseTime = t ? i : null, 
            this._paused = t, this._active = !t && this._totalTime > 0 && this._totalTime < this._totalDuration, 
            t || 0 === s || 0 === this._duration || this.render(e.smoothChildTiming ? this._totalTime : (i - this._startTime) / this._timeScale, !0, !0);
        }
        return this._gc && !t && this._enabled(!0, !1), this;
    };
    var S = p("core.SimpleTimeline", function(t) {
        b.call(this, 0, t), this.autoRemoveChildren = this.smoothChildTiming = !0;
    });
    s = S.prototype = new b(), s.constructor = S, s.kill()._gc = !1, s._first = s._last = null, 
    s._sortChildren = !1, s.add = s.insert = function(t, e) {
        var i, s;
        if (t._startTime = Number(e || 0) + t._delay, t._paused && this !== t._timeline && (t._pauseTime = t._startTime + (this.rawTime() - t._startTime) / t._timeScale), 
        t.timeline && t.timeline._remove(t, !0), t.timeline = t._timeline = this, t._gc && t._enabled(!0, !0), 
        i = this._last, this._sortChildren) for (s = t._startTime; i && i._startTime > s; ) i = i._prev;
        return i ? (t._next = i._next, i._next = t) : (t._next = this._first, this._first = t), 
        t._next ? t._next._prev = t : this._last = t, t._prev = i, this._timeline && this._uncache(!0), 
        this;
    }, s._remove = function(t, e) {
        return t.timeline === this && (e || t._enabled(!1, !0), t.timeline = null, t._prev ? t._prev._next = t._next : this._first === t && (this._first = t._next), 
        t._next ? t._next._prev = t._prev : this._last === t && (this._last = t._prev), 
        this._timeline && this._uncache(!0)), this;
    }, s.render = function(t, e, i) {
        var s, n = this._first;
        for (this._totalTime = this._time = this._rawPrevTime = t; n; ) s = n._next, (n._active || t >= n._startTime && !n._paused) && (n._reversed ? n.render((n._dirty ? n.totalDuration() : n._totalDuration) - (t - n._startTime) * n._timeScale, e, i) : n.render((t - n._startTime) * n._timeScale, e, i)), 
        n = s;
    }, s.rawTime = function() {
        return r || n.wake(), this._totalTime;
    };
    var A = p("TweenLite", function(e, i, s) {
        if (b.call(this, i, s), null == e) throw "Cannot tween a null target.";
        this.target = e = "string" != typeof e ? e : A.selector(e) || e;
        var n, r, a, o = e.jquery || e.length && e !== t && e[0] && (e[0] === t || e[0].nodeType && e[0].style && !e.nodeType), h = this.vars.overwrite;
        if (this._overwrite = h = null == h ? N[A.defaultOverwrite] : "number" == typeof h ? h >> 0 : N[h], 
        (o || e instanceof Array) && "number" != typeof e[0]) for (this._targets = a = l.call(e, 0), 
        this._propLookup = [], this._siblings = [], n = 0; a.length > n; n++) r = a[n], 
        r ? "string" != typeof r ? r.length && r !== t && r[0] && (r[0] === t || r[0].nodeType && r[0].style && !r.nodeType) ? (a.splice(n--, 1), 
        this._targets = a = a.concat(l.call(r, 0))) : (this._siblings[n] = F(r, this, !1), 
        1 === h && this._siblings[n].length > 1 && j(r, this, null, 1, this._siblings[n])) : (r = a[n--] = A.selector(r), 
        "string" == typeof r && a.splice(n + 1, 1)) : a.splice(n--, 1); else this._propLookup = {}, 
        this._siblings = F(e, this, !1), 1 === h && this._siblings.length > 1 && j(e, this, null, 1, this._siblings);
        (this.vars.immediateRender || 0 === i && 0 === this._delay && this.vars.immediateRender !== !1) && this.render(-this._delay, !1, !0);
    }, !0), x = function(e) {
        return e.length && e !== t && e[0] && (e[0] === t || e[0].nodeType && e[0].style && !e.nodeType);
    }, C = function(t, e) {
        var i, s = {};
        for (i in t) O[i] || i in e && "x" !== i && "y" !== i && "width" !== i && "height" !== i && "className" !== i && "border" !== i || !(!D[i] || D[i] && D[i]._autoCSS) || (s[i] = t[i], 
        delete t[i]);
        t.css = s;
    };
    s = A.prototype = new b(), s.constructor = A, s.kill()._gc = !1, s.ratio = 0, s._firstPT = s._targets = s._overwrittenProps = s._startAt = null, 
    s._notifyPluginsOfEnabled = !1, A.version = "1.10.1", A.defaultEase = s._ease = new v(null, null, 1, 1), 
    A.defaultOverwrite = "auto", A.ticker = n, A.autoSleep = !0, A.selector = t.$ || t.jQuery || function(e) {
        return t.$ ? (A.selector = t.$, t.$(e)) : t.document ? t.document.getElementById("#" === e.charAt(0) ? e.substr(1) : e) : e;
    };
    var R = A._internals = {}, D = A._plugins = {}, E = A._tweenLookup = {}, I = 0, O = R.reservedProps = {
        ease: 1,
        delay: 1,
        overwrite: 1,
        onComplete: 1,
        onCompleteParams: 1,
        onCompleteScope: 1,
        useFrames: 1,
        runBackwards: 1,
        startAt: 1,
        onUpdate: 1,
        onUpdateParams: 1,
        onUpdateScope: 1,
        onStart: 1,
        onStartParams: 1,
        onStartScope: 1,
        onReverseComplete: 1,
        onReverseCompleteParams: 1,
        onReverseCompleteScope: 1,
        onRepeat: 1,
        onRepeatParams: 1,
        onRepeatScope: 1,
        easeParams: 1,
        yoyo: 1,
        immediateRender: 1,
        repeat: 1,
        repeatDelay: 1,
        data: 1,
        paused: 1,
        reversed: 1,
        autoCSS: 1
    }, N = {
        none: 0,
        all: 1,
        auto: 2,
        concurrent: 3,
        allOnStart: 4,
        preexisting: 5,
        "true": 1,
        "false": 0
    }, U = b._rootFramesTimeline = new S(), L = b._rootTimeline = new S();
    L._startTime = n.time, U._startTime = n.frame, L._active = U._active = !0, b._updateRoot = function() {
        if (L.render((n.time - L._startTime) * L._timeScale, !1, !1), U.render((n.frame - U._startTime) * U._timeScale, !1, !1), 
        !(n.frame % 120)) {
            var t, e, i;
            for (i in E) {
                for (e = E[i].tweens, t = e.length; --t > -1; ) e[t]._gc && e.splice(t, 1);
                0 === e.length && delete E[i];
            }
            if (i = L._first, (!i || i._paused) && A.autoSleep && !U._first && 1 === n._listeners.tick.length) {
                for (;i && i._paused; ) i = i._next;
                i || n.sleep();
            }
        }
    }, n.addEventListener("tick", b._updateRoot);
    var F = function(t, e, i) {
        var s, n, r = t._gsTweenID;
        if (E[r || (t._gsTweenID = r = "t" + I++)] || (E[r] = {
            target: t,
            tweens: []
        }), e && (s = E[r].tweens, s[n = s.length] = e, i)) for (;--n > -1; ) s[n] === e && s.splice(n, 1);
        return E[r].tweens;
    }, j = function(t, e, i, s, n) {
        var r, a, o, h;
        if (1 === s || s >= 4) {
            for (h = n.length, r = 0; h > r; r++) if ((o = n[r]) !== e) o._gc || o._enabled(!1, !1) && (a = !0); else if (5 === s) break;
            return a;
        }
        var l, _ = e._startTime + 1e-10, u = [], m = 0, f = 0 === e._duration;
        for (r = n.length; --r > -1; ) (o = n[r]) === e || o._gc || o._paused || (o._timeline !== e._timeline ? (l = l || G(e, 0, f), 
        0 === G(o, l, f) && (u[m++] = o)) : _ >= o._startTime && o._startTime + o.totalDuration() / o._timeScale + 1e-10 > _ && ((f || !o._initted) && 2e-10 >= _ - o._startTime || (u[m++] = o)));
        for (r = m; --r > -1; ) o = u[r], 2 === s && o._kill(i, t) && (a = !0), (2 !== s || !o._firstPT && o._initted) && o._enabled(!1, !1) && (a = !0);
        return a;
    }, G = function(t, e, i) {
        for (var s = t._timeline, n = s._timeScale, r = t._startTime, a = 1e-10; s._timeline; ) {
            if (r += s._startTime, n *= s._timeScale, s._paused) return -100;
            s = s._timeline;
        }
        return r /= n, r > e ? r - e : i && r === e || !t._initted && 2 * a > r - e ? a : (r += t.totalDuration() / t._timeScale / n) > e + a ? 0 : r - e - a;
    };
    s._init = function() {
        var t, e, i, s, n = this.vars, r = this._overwrittenProps, a = this._duration, o = n.ease;
        if (n.startAt) {
            if (n.startAt.overwrite = 0, n.startAt.immediateRender = !0, this._startAt = A.to(this.target, 0, n.startAt), 
            n.immediateRender && (this._startAt = null, 0 === this._time && 0 !== a)) return;
        } else if (n.runBackwards && n.immediateRender && 0 !== a) if (this._startAt) this._startAt.render(-1, !0), 
        this._startAt = null; else if (0 === this._time) {
            i = {};
            for (s in n) O[s] && "autoCSS" !== s || (i[s] = n[s]);
            return i.overwrite = 0, void (this._startAt = A.to(this.target, 0, i));
        }
        if (this._ease = o ? o instanceof v ? n.easeParams instanceof Array ? o.config.apply(o, n.easeParams) : o : "function" == typeof o ? new v(o, n.easeParams) : g[o] || A.defaultEase : A.defaultEase, 
        this._easeType = this._ease._type, this._easePower = this._ease._power, this._firstPT = null, 
        this._targets) for (t = this._targets.length; --t > -1; ) this._initProps(this._targets[t], this._propLookup[t] = {}, this._siblings[t], r ? r[t] : null) && (e = !0); else e = this._initProps(this.target, this._propLookup, this._siblings, r);
        if (e && A._onPluginEvent("_onInitAllProps", this), r && (this._firstPT || "function" != typeof this.target && this._enabled(!1, !1)), 
        n.runBackwards) for (i = this._firstPT; i; ) i.s += i.c, i.c = -i.c, i = i._next;
        this._onUpdate = n.onUpdate, this._initted = !0;
    }, s._initProps = function(e, i, s, n) {
        var r, a, o, h, l, _;
        if (null == e) return !1;
        this.vars.css || e.style && e !== t && e.nodeType && D.css && this.vars.autoCSS !== !1 && C(this.vars, e);
        for (r in this.vars) {
            if (_ = this.vars[r], O[r]) _ instanceof Array && -1 !== _.join("").indexOf("{self}") && (this.vars[r] = _ = this._swapSelfInParams(_, this)); else if (D[r] && (h = new D[r]())._onInitTween(e, this.vars[r], this)) {
                for (this._firstPT = l = {
                    _next: this._firstPT,
                    t: h,
                    p: "setRatio",
                    s: 0,
                    c: 1,
                    f: !0,
                    n: r,
                    pg: !0,
                    pr: h._priority
                }, a = h._overwriteProps.length; --a > -1; ) i[h._overwriteProps[a]] = this._firstPT;
                (h._priority || h._onInitAllProps) && (o = !0), (h._onDisable || h._onEnable) && (this._notifyPluginsOfEnabled = !0);
            } else this._firstPT = i[r] = l = {
                _next: this._firstPT,
                t: e,
                p: r,
                f: "function" == typeof e[r],
                n: r,
                pg: !1,
                pr: 0
            }, l.s = l.f ? e[r.indexOf("set") || "function" != typeof e["get" + r.substr(3)] ? r : "get" + r.substr(3)]() : parseFloat(e[r]), 
            l.c = "string" == typeof _ && "=" === _.charAt(1) ? parseInt(_.charAt(0) + "1", 10) * Number(_.substr(2)) : Number(_) - l.s || 0;
            l && l._next && (l._next._prev = l);
        }
        return n && this._kill(n, e) ? this._initProps(e, i, s, n) : this._overwrite > 1 && this._firstPT && s.length > 1 && j(e, this, i, this._overwrite, s) ? (this._kill(i, e), 
        this._initProps(e, i, s, n)) : o;
    }, s.render = function(t, e, i) {
        var s, n, r, a = this._time;
        if (t >= this._duration) this._totalTime = this._time = this._duration, this.ratio = this._ease._calcEnd ? this._ease.getRatio(1) : 1, 
        this._reversed || (s = !0, n = "onComplete"), 0 === this._duration && ((0 === t || 0 > this._rawPrevTime) && this._rawPrevTime !== t && (i = !0, 
        this._rawPrevTime > 0 && (n = "onReverseComplete", e && (t = -1))), this._rawPrevTime = t); else if (1e-7 > t) this._totalTime = this._time = 0, 
        this.ratio = this._ease._calcEnd ? this._ease.getRatio(0) : 0, (0 !== a || 0 === this._duration && this._rawPrevTime > 0) && (n = "onReverseComplete", 
        s = this._reversed), 0 > t ? (this._active = !1, 0 === this._duration && (this._rawPrevTime >= 0 && (i = !0), 
        this._rawPrevTime = t)) : this._initted || (i = !0); else if (this._totalTime = this._time = t, 
        this._easeType) {
            var o = t / this._duration, h = this._easeType, l = this._easePower;
            (1 === h || 3 === h && o >= .5) && (o = 1 - o), 3 === h && (o *= 2), 1 === l ? o *= o : 2 === l ? o *= o * o : 3 === l ? o *= o * o * o : 4 === l && (o *= o * o * o * o), 
            this.ratio = 1 === h ? 1 - o : 2 === h ? o : .5 > t / this._duration ? o / 2 : 1 - o / 2;
        } else this.ratio = this._ease.getRatio(t / this._duration);
        if (this._time !== a || i) {
            if (!this._initted) {
                if (this._init(), !this._initted) return;
                this._time && !s ? this.ratio = this._ease.getRatio(this._time / this._duration) : s && this._ease._calcEnd && (this.ratio = this._ease.getRatio(0 === this._time ? 0 : 1));
            }
            for (this._active || !this._paused && this._time !== a && t >= 0 && (this._active = !0), 
            0 === a && (this._startAt && (t >= 0 ? this._startAt.render(t, e, i) : n || (n = "_dummyGS")), 
            this.vars.onStart && (0 !== this._time || 0 === this._duration) && (e || this.vars.onStart.apply(this.vars.onStartScope || this, this.vars.onStartParams || d))), 
            r = this._firstPT; r; ) r.f ? r.t[r.p](r.c * this.ratio + r.s) : r.t[r.p] = r.c * this.ratio + r.s, 
            r = r._next;
            this._onUpdate && (0 > t && this._startAt && this._startAt.render(t, e, i), e || this._onUpdate.apply(this.vars.onUpdateScope || this, this.vars.onUpdateParams || d)), 
            n && (this._gc || (0 > t && this._startAt && !this._onUpdate && this._startAt.render(t, e, i), 
            s && (this._timeline.autoRemoveChildren && this._enabled(!1, !1), this._active = !1), 
            !e && this.vars[n] && this.vars[n].apply(this.vars[n + "Scope"] || this, this.vars[n + "Params"] || d)));
        }
    }, s._kill = function(t, e) {
        if ("all" === t && (t = null), null == t && (null == e || e === this.target)) return this._enabled(!1, !1);
        e = "string" != typeof e ? e || this._targets || this.target : A.selector(e) || e;
        var i, s, n, r, a, o, h, l;
        if ((e instanceof Array || x(e)) && "number" != typeof e[0]) for (i = e.length; --i > -1; ) this._kill(t, e[i]) && (o = !0); else {
            if (this._targets) {
                for (i = this._targets.length; --i > -1; ) if (e === this._targets[i]) {
                    a = this._propLookup[i] || {}, this._overwrittenProps = this._overwrittenProps || [], 
                    s = this._overwrittenProps[i] = t ? this._overwrittenProps[i] || {} : "all";
                    break;
                }
            } else {
                if (e !== this.target) return !1;
                a = this._propLookup, s = this._overwrittenProps = t ? this._overwrittenProps || {} : "all";
            }
            if (a) {
                h = t || a, l = t !== s && "all" !== s && t !== a && (null == t || t._tempKill !== !0);
                for (n in h) (r = a[n]) && (r.pg && r.t._kill(h) && (o = !0), r.pg && 0 !== r.t._overwriteProps.length || (r._prev ? r._prev._next = r._next : r === this._firstPT && (this._firstPT = r._next), 
                r._next && (r._next._prev = r._prev), r._next = r._prev = null), delete a[n]), l && (s[n] = 1);
                !this._firstPT && this._initted && this._enabled(!1, !1);
            }
        }
        return o;
    }, s.invalidate = function() {
        return this._notifyPluginsOfEnabled && A._onPluginEvent("_onDisable", this), this._firstPT = null, 
        this._overwrittenProps = null, this._onUpdate = null, this._startAt = null, this._initted = this._active = this._notifyPluginsOfEnabled = !1, 
        this._propLookup = this._targets ? {} : [], this;
    }, s._enabled = function(t, e) {
        if (r || n.wake(), t && this._gc) {
            var i, s = this._targets;
            if (s) for (i = s.length; --i > -1; ) this._siblings[i] = F(s[i], this, !0); else this._siblings = F(this.target, this, !0);
        }
        return b.prototype._enabled.call(this, t, e), this._notifyPluginsOfEnabled && this._firstPT ? A._onPluginEvent(t ? "_onEnable" : "_onDisable", this) : !1;
    }, A.to = function(t, e, i) {
        return new A(t, e, i);
    }, A.from = function(t, e, i) {
        return i.runBackwards = !0, i.immediateRender = 0 != i.immediateRender, new A(t, e, i);
    }, A.fromTo = function(t, e, i, s) {
        return s.startAt = i, s.immediateRender = 0 != s.immediateRender && 0 != i.immediateRender, 
        new A(t, e, s);
    }, A.delayedCall = function(t, e, i, s, n) {
        return new A(e, 0, {
            delay: t,
            onComplete: e,
            onCompleteParams: i,
            onCompleteScope: s,
            onReverseComplete: e,
            onReverseCompleteParams: i,
            onReverseCompleteScope: s,
            immediateRender: !1,
            useFrames: n,
            overwrite: 0
        });
    }, A.set = function(t, e) {
        return new A(t, 0, e);
    }, A.killTweensOf = A.killDelayedCallsTo = function(t, e) {
        for (var i = A.getTweensOf(t), s = i.length; --s > -1; ) i[s]._kill(e, t);
    }, A.getTweensOf = function(t) {
        if (null == t) return [];
        t = "string" != typeof t ? t : A.selector(t) || t;
        var e, i, s, n;
        if ((t instanceof Array || x(t)) && "number" != typeof t[0]) {
            for (e = t.length, i = []; --e > -1; ) i = i.concat(A.getTweensOf(t[e]));
            for (e = i.length; --e > -1; ) for (n = i[e], s = e; --s > -1; ) n === i[s] && i.splice(e, 1);
        } else for (i = F(t).concat(), e = i.length; --e > -1; ) i[e]._gc && i.splice(e, 1);
        return i;
    };
    var Q = p("plugins.TweenPlugin", function(t, e) {
        this._overwriteProps = (t || "").split(","), this._propName = this._overwriteProps[0], 
        this._priority = e || 0, this._super = Q.prototype;
    }, !0);
    if (s = Q.prototype, Q.version = "1.10.1", Q.API = 2, s._firstPT = null, s._addTween = function(t, e, i, s, n, r) {
        var a, o;
        return null != s && (a = "number" == typeof s || "=" !== s.charAt(1) ? Number(s) - i : parseInt(s.charAt(0) + "1", 10) * Number(s.substr(2))) ? (this._firstPT = o = {
            _next: this._firstPT,
            t: t,
            p: e,
            s: i,
            c: a,
            f: "function" == typeof t[e],
            n: n || e,
            r: r
        }, o._next && (o._next._prev = o), o) : void 0;
    }, s.setRatio = function(t) {
        for (var e, i = this._firstPT, s = 1e-6; i; ) e = i.c * t + i.s, i.r ? e = 0 | e + (e > 0 ? .5 : -.5) : s > e && e > -s && (e = 0), 
        i.f ? i.t[i.p](e) : i.t[i.p] = e, i = i._next;
    }, s._kill = function(t) {
        var e, i = this._overwriteProps, s = this._firstPT;
        if (null != t[this._propName]) this._overwriteProps = []; else for (e = i.length; --e > -1; ) null != t[i[e]] && i.splice(e, 1);
        for (;s; ) null != t[s.n] && (s._next && (s._next._prev = s._prev), s._prev ? (s._prev._next = s._next, 
        s._prev = null) : this._firstPT === s && (this._firstPT = s._next)), s = s._next;
        return !1;
    }, s._roundProps = function(t, e) {
        for (var i = this._firstPT; i; ) (t[this._propName] || null != i.n && t[i.n.split(this._propName + "_").join("")]) && (i.r = e), 
        i = i._next;
    }, A._onPluginEvent = function(t, e) {
        var i, s, n, r, a, o = e._firstPT;
        if ("_onInitAllProps" === t) {
            for (;o; ) {
                for (a = o._next, s = n; s && s.pr > o.pr; ) s = s._next;
                (o._prev = s ? s._prev : r) ? o._prev._next = o : n = o, (o._next = s) ? s._prev = o : r = o, 
                o = a;
            }
            o = e._firstPT = n;
        }
        for (;o; ) o.pg && "function" == typeof o.t[t] && o.t[t]() && (i = !0), o = o._next;
        return i;
    }, Q.activate = function(t) {
        for (var e = t.length; --e > -1; ) t[e].API === Q.API && (D[new t[e]()._propName] = t[e]);
        return !0;
    }, f.plugin = function(t) {
        if (!(t && t.propName && t.init && t.API)) throw "illegal plugin definition.";
        var e, i = t.propName, s = t.priority || 0, n = t.overwriteProps, r = {
            init: "_onInitTween",
            set: "setRatio",
            kill: "_kill",
            round: "_roundProps",
            initAll: "_onInitAllProps"
        }, a = p("plugins." + i.charAt(0).toUpperCase() + i.substr(1) + "Plugin", function() {
            Q.call(this, i, s), this._overwriteProps = n || [];
        }, t.global === !0), o = a.prototype = new Q(i);
        o.constructor = a, a.API = t.API;
        for (e in r) "function" == typeof t[e] && (o[r[e]] = t[e]);
        return a.version = t.version, Q.activate([ a ]), a;
    }, e = t._gsQueue) {
        for (i = 0; e.length > i; i++) e[i]();
        for (s in u) u[s].func || t.console.log("GSAP encountered missing dependency: com.greensock." + s);
    }
    r = !1;
}(window);

var DefaultButton = Class.extend({
    init: function(imgUp, imgOver, imgDown) {
        imgDown || (imgDown = imgOver), this.container = new PIXI.DisplayObjectContainer(), 
        this.textureButton = PIXI.Texture.fromImage(imgUp), this.textureButtonDown = PIXI.Texture.fromImage(imgDown), 
        this.textureButtonOver = PIXI.Texture.fromImage(imgOver), this.shapeButton = new PIXI.Sprite(this.textureButton), 
        this.isOver = !1, this.isdown = !1, this.width = 10, this.height = 10, this.clickCallback = null, 
        this.mouseDownCallback = null, this.mouseUpCallback = null, this.container.addChild(this.shapeButton);
    },
    destroy: function() {
        this.textureButton.destroy(), this.textureButtonDown.destroy(), this.textureButtonOver.destroy(), 
        delete this.container;
    },
    build: function(width, height) {
        var that = this;
        this.width = width ? width : this.shapeButton.width, this.height = height ? height : this.shapeButton.height, 
        this.shapeButton.buttonMode = !0, this.shapeButton.position.x = 0, this.shapeButton.position.y = 0, 
        width && (this.shapeButton.width = this.width), height && (this.shapeButton.height = this.height), 
        this.shapeButton.setInteractive(!0), this.shapeButton.mousedown = this.shapeButton.touchstart = function() {
            null != that.mouseDownCallback && that.mouseDownCallback(), that.isdown = !0, that.shapeButton.setTexture(that.textureButtonDown), 
            that.alpha = 1;
        }, this.shapeButton.mouseup = this.shapeButton.touchend = this.shapeButton.touchoutside = this.shapeButton.mouseuoutside = this.shapeButton.touchendoutside = function(data) {
            this.isdown = !1, console.log(data), null != that.mouseUpCallback && that.mouseUpCallback(), 
            that.shapeButton.setTexture(that.isOver ? that.textureButtonOver : that.textureButton);
        }, this.shapeButton.mouseover = function() {
            that.isOver = !0, that.shapeButton.setTexture(that.textureButtonOver);
        }, this.shapeButton.mouseout = function() {
            that.isOver = !1, that.shapeButton.setTexture(that.textureButton);
        }, this.shapeButton.click = function() {
            null != that.clickCallback && that.clickCallback();
        }, this.shapeButton.tap = function() {
            null != that.clickCallback && that.clickCallback(), console.log("TAP!!");
        };
    },
    addLabel: function(text, marginX, marginY, autoAlign, acressX, acressY) {
        if (this.container.addChild(text), text.position.x = this.shapeButton.position.x, 
        text.position.y = this.shapeButton.position.y, autoAlign) {
            var scaleFactorX = (this.shapeButton.width - 2 * marginX) / text.width, scaleFactorY = (this.shapeButton.height - 2 * marginY) / text.height;
            scaleFactorY > scaleFactorX ? scaleFactorY = scaleFactorX : scaleFactorX = scaleFactorY, 
            text.width *= scaleFactorX, text.height *= scaleFactorY, text.position.x = this.shapeButton.position.x + this.shapeButton.width / 2 - text.width / 2 + acressX, 
            text.position.y = this.shapeButton.position.y + this.shapeButton.height / 2 - text.height / 2 + acressY;
        } else text.position.x = this.shapeButton.position.x + marginX, text.position.y = this.shapeButton.position.y + marginY;
    },
    setPosition: function(x, y) {
        this.container.position.x = x, this.container.position.y = y;
    },
    getContent: function() {
        return this.container;
    },
    destroy: function() {}
}), AbstractApplication = Class.extend({
    init: function(canvasWidth, canvasHeight) {
        this.stage = new PIXI.Stage(6750105, !0), this.canvasWidth = canvasWidth, this.canvasHeight = canvasHeight, 
        this.screenManager = new ScreenManager(), this.screenManager.build("MainScreenManager"), 
        this.screenManager.setCanvasArea(canvasWidth, canvasHeight), this.stage.addChild(this.screenManager.container), 
        this.loader, this.loadPercent, this.loadText = new PIXI.Text("0%", {
            font: "20px Luckiest Guy",
            fill: "black",
            align: "center"
        }), this.stage.addChild(this.loadText), this.loadText.position.x = this.canvasWidth / 2 - this.loadText.width / 2, 
        this.loadText.position.y = this.canvasHeight / 2 - this.loadText.height / 2;
    },
    build: function() {},
    update: function() {
        this.screenManager.update();
    },
    initLoad: function() {
        var that = this;
        this.loader.onComplete = function() {
            that.onAssetsLoaded();
        }, this.loader.onProgress = function() {
            that.onProgress();
        }, this.loader.load();
    },
    onAssetsLoaded: function() {
        this.stage.removeChild(this.loadText);
    },
    onProgress: function() {
        this.loadPercent = (this.loader.assetURLs.length - this.loader.loadCount) / this.loader.assetURLs.length, 
        this.stage.removeChild(this.loadText), this.loadText = new PIXI.Text(Math.floor(100 * this.loadPercent) + "%", {
            fill: "black",
            align: "center"
        }), this.stage.addChild(this.loadText), this.loadText.position.x = this.canvasWidth / 2 - this.loadText.width / 2, 
        this.loadText.position.y = this.canvasHeight / 2 - this.loadText.height / 2;
    }
}), Entity = Class.extend({
    init: function() {
        this.texture = "", this.sprite = "", this.velocity = {
            x: 0,
            y: 0
        }, this.centerPosition = {
            x: 0,
            y: 0
        }, this.gravity = 0, this.kill = !1, this.updateable = !0, this.boundsCollision = !1, 
        this.range = 10, this.collidable = !0, this.virtualVelocity = {
            x: 0,
            y: 0
        }, this.layer, this.jumpPower = 2, this.life = 2, this.collisionPointsMarginDivide = 8, 
        this.defaultVelocity = 0;
    },
    build: function(img) {
        this.texture = PIXI.Texture.fromImage(img), this.sprite = new PIXI.Sprite(this.texture), 
        this.sprite.anchor.x = .5, this.sprite.anchor.y = .5;
    },
    getBounds: function() {
        return this.bounds = {
            x: this.getPosition().x - this.width * this.sprite.anchor.x,
            y: this.getPosition().y - this.height * this.sprite.anchor.y,
            w: this.sprite.width,
            h: this.sprite.height
        }, this.bounds;
    },
    debugPolygon: function(color, force) {
        if (this.polygon && this.polygon.points && (this.lastColorDebug !== color || force)) {
            null === this.debugGraphic.parent && null !== this.getContent().parent && this.getContent().parent.addChild(this.debugGraphic), 
            this.lastColorDebug = color, this.gambAcum++, void 0 !== this.debugGraphic ? this.debugGraphic.clear() : this.debugGraphic = new PIXI.Graphics(), 
            this.debugGraphic.beginFill(color, .5), this.debugGraphic.lineStyle(1, 16767232), 
            this.debugGraphic.moveTo(this.polygon.points[this.polygon.points.length - 1].x, this.polygon.points[this.polygon.points.length - 1].y);
            for (var i = this.polygon.points.length - 2; i >= 0; i--) this.debugGraphic.lineTo(this.polygon.points[i].x, this.polygon.points[i].y);
            this.debugGraphic.endFill();
        }
    },
    updateCollisionPoints: function(makePoly) {
        this.collisionPoints = {
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
                y: this.bounds.y + this.bounds.h - this.bounds.h / this.collisionPointsMarginDivide
            },
            topLeft: {
                x: this.bounds.x,
                y: this.bounds.y + this.bounds.h / this.collisionPointsMarginDivide
            },
            bottomRight: {
                x: this.bounds.x + this.bounds.w,
                y: this.bounds.y + this.bounds.h - this.bounds.h / this.collisionPointsMarginDivide
            },
            topRight: {
                x: this.bounds.x + this.bounds.w,
                y: this.bounds.y + this.bounds.h / this.collisionPointsMarginDivide
            }
        }, makePoly && (this.polygon = new PIXI.Polygon(new PIXI.Point(this.bounds.x + this.bounds.w / 2, this.bounds.y), new PIXI.Point(this.bounds.x, this.bounds.y + this.bounds.h / this.collisionPointsMarginDivide), new PIXI.Point(this.bounds.x, this.bounds.y + this.bounds.h - this.bounds.h / this.collisionPointsMarginDivide), new PIXI.Point(this.bounds.x + this.bounds.w / 2, this.bounds.y + this.bounds.h), new PIXI.Point(this.bounds.x + this.bounds.w, this.bounds.y + this.bounds.h - this.bounds.h / this.collisionPointsMarginDivide), new PIXI.Point(this.bounds.x + this.bounds.w, this.bounds.y + this.bounds.h / this.collisionPointsMarginDivide)));
    },
    preKill: function() {
        this.kill = !0;
    },
    setParentLayer: function(parentLayer) {
        this.layer = parentLayer;
    },
    setScale: function(x, y) {
        this.sprite.scale.x = x, this.sprite.scale.y = y;
    },
    getContent: function() {
        return this.sprite;
    },
    getPosition: function() {
        return this.sprite.position;
    },
    setPosition: function(x, y) {
        this.sprite.position.x = x, this.sprite.position.y = y;
    },
    setVelocity: function(x, y) {
        this.velocity.x = x, this.velocity.y = y;
    },
    update: function() {
        this.sprite.position.x += this.velocity.x, this.sprite.position.y += this.velocity.y;
    },
    applyGravity: function() {
        this.velocity.y += this.gravity;
    },
    jump: function() {
        this.velocity.y = -this.jumpPower;
    },
    setGravity: function(gravity) {
        this.gravity = gravity;
    },
    collide: function() {}
}), SpritesheetEntity = Entity.extend({
    init: function() {
        this._super(!0), this.spritesheet;
    },
    build: function(spSheet) {
        this.spritesheet = spSheet, this.spritesheet.setPosition(100, 100), this.setVelocity(1, 1);
    },
    setPosition: function(x, y) {
        this.spritesheet && (this.spritesheet.position.x = x, this.spritesheet.position.y = y, 
        this.spritesheet.setPosition(x, y));
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
        }, this.bounds;
    },
    getPosition: function() {
        return this.spritesheet.position;
    },
    getTexture: function() {
        return this.spritesheet.texture.texture;
    },
    getContent: function() {
        return this.spritesheet.container;
    },
    update: function() {
        this.spritesheet.position.x += this.velocity.x, this.spritesheet.position.y += this.velocity.y;
        var temp = {
            x: this.spritesheet.position.x + this.velocity.x,
            y: this.spritesheet.position.y + this.velocity.y
        };
        this.spritesheet.setPosition(temp.x, temp.y), this.spritesheet.update();
    },
    getFramesByRange: function(label, init, end, type) {
        for (var tempArray = new Array(), tempI = "", i = init; end >= i; i++) 10 > i ? tempI = "00" + i : 100 > i ? tempI = "0" + i : 1e3 > i && (tempI = i), 
        tempArray.push(label + tempI);
        if ("pingPong" == type) for (var i = end - 1; i > init; i--) 10 > i ? tempI = "00" + i : 100 > i ? tempI = "0" + i : 1e3 > i && (tempI = i), 
        tempArray.push(label + tempI);
        return tempArray;
    }
}), Layer = Class.extend({
    init: function() {
        this.childs = new Array(), this.name, this.container = new PIXI.DisplayObjectContainer(), 
        this.updateable = !0, this.layerManager = null, this.kill = !1;
    },
    build: function(name) {
        this.name = name;
    },
    getContent: function() {
        return this.container;
    },
    addChild: function(child) {
        this.childs.push(child), this.container.addChild(child.getContent()), child.setParentLayer(this);
    },
    removeChild: function(child) {
        for (var i = 0; i < this.childs.length; i++) if (this.childs[i] == child) return this.childs.splice(i, 1), 
        void this.container.removeChild(child.getContent());
    },
    update: function() {
        for (var i = 0; i < this.childs.length; i++) this.childs[i].kill && this.removeChild(this.childs[i]), 
        this.childs[i] && this.childs[i].updateable && this.childs[i].update();
    },
    collideChilds: function(child) {
        if (child && child.collidable) {
            for (var isCollide = !1, objectCollided = new Array(), i = 0; i < this.childs.length; i++) this.childs[i] != child && this.childs[i].collidable && Math.abs(child.range + this.childs[i].range) > 0 && this.pointDistance(child.getPosition().x + child.centerPosition.x, child.getPosition().y + child.centerPosition.y, this.childs[i].getPosition().x + this.childs[i].centerPosition.x, this.childs[i].getPosition().y + this.childs[i].centerPosition.y) < child.range + this.childs[i].range && (objectCollided.push(this.childs[i]), 
            isCollide = !0);
            isCollide && child.collide(objectCollided);
        }
    },
    pointDistance: function(x, y, x0, y0) {
        return Math.sqrt((x -= x0) * x + (y -= y0) * y);
    },
    setManager: function(layerManager) {
        this.layerManager = layerManager;
    }
}), LayerManager = Class.extend({
    init: function() {
        this.childs = new Array(), this.name, this.container = new PIXI.DisplayObjectContainer(), 
        this.updateable = !0;
    },
    build: function(name) {
        this.name = name;
    },
    addLayer: function(layer) {
        this.childs.push(layer), this.container.addChild(layer.container), layer.setManager(this);
    },
    getContent: function() {
        return this.container;
    },
    removeChild: function(child) {
        for (var i = 0; i < this.childs.length; i++) if (this.childs[i] == child) return this.childs.splice(i, 1), 
        void this.container.removeChild(child.getContent());
    },
    update: function() {
        for (var i = 0; i < this.childs.length; i++) this.childs[i].kill && this.removeChild(this.childs[i]), 
        this.childs[i] && this.childs[i].updateable && this.childs[i].update();
    }
}), AbstractScreen = Class.extend({
    init: function(label) {
        this.screenLabel = label, this.screenManager = null, this.childs = [], this.outCallback = null, 
        this.container = new PIXI.DisplayObjectContainer(), this.updateable = !0, this.layerManager = null, 
        this.canvasArea = {
            x: 0,
            y: 0
        }, this.loader, this.loadPercent, this.loadText = new PIXI.Text("0%", {
            font: "20px Luckiest Guy",
            fill: "black",
            align: "center"
        }), this.container.addChild(this.loadText), this.loadText.position.x = this.canvasWidth / 2 - this.loadText.width / 2, 
        this.loadText.position.y = this.canvasHeight / 2 - this.loadText.height / 2;
    },
    initLoad: function() {
        var that = this;
        this.loader.onComplete = function() {
            that.onAssetsLoaded();
        }, this.loader.onProgress = function() {
            that.onProgress();
        }, this.loader.load();
    },
    build: function() {
        AbstractScreen.debug && console.log("build", this.screenLabel);
    },
    getContent: function() {
        return this.container;
    },
    onAssetsLoaded: function() {
        this.container.removeChild(this.loadText);
    },
    onProgress: function() {
        this.loadPercent = (this.loader.assetURLs.length - this.loader.loadCount) / this.loader.assetURLs.length, 
        this.loadText.parent && this.container.removeChild(this.loadText), this.loadText = new PIXI.Text(Math.floor(100 * this.loadPercent) + "%", {
            fill: "black",
            align: "center"
        }), this.container.addChild(this.loadText), this.loadText.position.x = this.canvasArea.x / 2 - this.loadText.width / 2, 
        this.loadText.position.y = this.canvasArea.y / 2 - this.loadText.height / 2;
    },
    addChild: function(child) {
        this.childs.push(child), this.container.addChild(void 0 != child.getContent ? child.getContent() : child);
    },
    removeChild: function(child) {
        child instanceof PIXI.Text;
        for (var i = 0; i < this.childs.length; i++) if (this.childs[i] == child) return this.childs.splice(i, 1), 
        void (this.container && this.container.removeChild(void 0 != child.getContent ? child.getContent() : child));
    },
    update: function() {
        for (var i = 0; i < this.childs.length; i++) this.childs[i].kill && this.removeChild(this.childs[i]), 
        this.childs[i] && this.childs[i].updateable && this.childs[i].update();
    },
    transitionIn: function() {
        AbstractScreen.debug && console.log("transitionIn", this.screenLabel), this.build();
    },
    transitionOut: function(nextScreen, container) {
        AbstractScreen.debug && console.log("transitionOut", this.screenLabel, "to", nextScreen.screenLabel), 
        this.destroy(), container.removeChild(this.getContent()), nextScreen.transitionIn();
    },
    destroy: function() {
        for (AbstractScreen.debug && console.log("destroy", this.screenLabel); this.childs.length > 0; ) {
            var temp = this.childs[0];
            this.removeChild(this.childs[0]), "function" == typeof temp.destroy && temp.destroy(), 
            delete temp;
        }
        this.childs = new Array();
    }
}), ScreenManager = Class.extend({
    init: function() {
        this.label = "", this.childs = [], this.container = new PIXI.DisplayObjectContainer(), 
        this.currentScreen = null, this.nextScreen = null, this.canvasArea = {
            x: 0,
            y: 0
        };
    },
    build: function(label) {
        this.label = label;
    },
    addScreen: function(screen) {
        null === this.currentScreen && (this.currentScreen = screen), this.childs.push(screen), 
        screen.canvasArea = this.canvasArea, screen.screenManager = this;
    },
    change: function(screenLabel) {
        ScreenManager.debug && console.log("change to", screenLabel);
        for (var i = 0; i < this.childs.length; i++) this.childs[i].screenLabel == screenLabel && (this.nextScreen = this.childs[i], 
        this.currentScreen && this.currentScreen.getContent().parent ? (this.currentScreen.transitionOut(this.nextScreen, this.container), 
        this.container.addChild(this.nextScreen.getContent())) : (this.nextScreen.transitionIn(), 
        this.container.addChild(this.nextScreen.getContent())), this.currentScreen = this.nextScreen);
    },
    update: function() {
        null != this.currentScreen && this.currentScreen.update();
    },
    setCanvasArea: function(canvasWidth, canvasHeight) {
        this.canvasArea.x = canvasWidth, this.canvasArea.y = canvasHeight;
    }
}), BoundCollisionSystem = Class.extend({
    init: function(container, debug) {
        this.container = container, debug && (this.graphDebug = new PIXI.Graphics(), this.graphDebug && this.container.addChild(this.graphDebug));
    },
    applyCollision: function(env, entities, colEntitiesTypes, precise) {
        var tempEnv = null, tempEntity = null, tempEnvBounds = null, tempEntityBounds = null;
        this.graphDebug && (this.graphDebug.clear(), this.graphDebug.beginFill(16711680), 
        this.graphDebug.lineStyle(5, 16711680));
        for (var i = env.length - 1; i >= 0; i--) {
            var isTouch = !1;
            if (tempEnv = env[i], "environment" === tempEnv.type) {
                tempEnvBounds = tempEnv.getBounds();
                for (var j = entities.length - 1; j >= 0; j--) if (tempEntity = entities[j], "environment" !== tempEntity.type && tempEntity.collidable) {
                    if (tempEntityBounds = tempEntity.getBounds(), tempEntityBounds.y += tempEntity.virtualVelocity.y, 
                    tempEntityBounds.x += tempEntity.virtualVelocity.x, this.testBoundsCollide(tempEnvBounds, tempEntityBounds)) {
                        var tempBounds = {
                            x: 0,
                            y: 0,
                            w: 1,
                            h: 1
                        }, touchCollection = {
                            object: tempEnv,
                            up: !1,
                            down: !1,
                            left: !1,
                            right: !1,
                            middleUp: !1,
                            middleDown: !1,
                            bottomLeft: !1,
                            bottomRight: !1,
                            topLeft: !1,
                            topRight: !1
                        };
                        tempEntity.boundsCollision ? (tempBounds.x = tempEntityBounds.x + Math.abs(2 * tempEntity.defaultVelocity), 
                        tempBounds.y = tempEntity.collisionPoints.up.y + 2 * tempEntity.virtualVelocity.y, 
                        tempBounds.w = tempEntityBounds.w - Math.abs(2 * tempEntity.defaultVelocity * 2), 
                        tempBounds.h = 1, this.graphDebug && this.graphDebug.drawRect(tempBounds.x, tempBounds.y, tempBounds.w, tempBounds.h), 
                        this.testBoundsCollide(tempEnvBounds, tempBounds) && tempEntity.virtualVelocity.y < 0 && (touchCollection.up = !0), 
                        tempBounds.x = tempEntityBounds.x + Math.abs(2 * tempEntity.defaultVelocity), tempBounds.y = tempEntity.collisionPoints.down.y + 2 * tempEntity.virtualVelocity.y, 
                        tempBounds.w = tempEntityBounds.w - Math.abs(2 * tempEntity.defaultVelocity * 2), 
                        tempBounds.h = 1, this.graphDebug && this.graphDebug.drawRect(tempBounds.x, tempBounds.y, tempBounds.w, tempBounds.h), 
                        this.testBoundsCollide(tempEnvBounds, tempBounds) && tempEntity.virtualVelocity.y > 0 && (touchCollection.down = !0), 
                        tempBounds.w = 1, tempBounds.x = tempEntity.collisionPoints.topLeft.x + 2 * tempEntity.virtualVelocity.x, 
                        tempBounds.y = tempEntity.collisionPoints.topLeft.y + Math.abs(2 * tempEntity.defaultVelocity), 
                        tempBounds.h = Math.abs(tempEntity.collisionPoints.topLeft.y - tempEntity.collisionPoints.bottomLeft.y) - Math.abs(2 * tempEntity.defaultVelocity * 2), 
                        this.graphDebug && this.graphDebug.drawRect(tempBounds.x, tempBounds.y, tempBounds.w, tempBounds.h), 
                        this.testBoundsCollide(tempEnvBounds, tempBounds) && tempEntity.virtualVelocity.x < 0 && (touchCollection.left = !0), 
                        tempBounds.w = 1, tempBounds.x = tempEntity.collisionPoints.topRight.x + 2 * tempEntity.virtualVelocity.x, 
                        tempBounds.y = tempEntity.collisionPoints.topRight.y + Math.abs(2 * tempEntity.defaultVelocity), 
                        tempBounds.h = Math.abs(tempEntity.collisionPoints.topRight.y - tempEntity.collisionPoints.bottomRight.y) - Math.abs(2 * tempEntity.defaultVelocity * 2), 
                        this.graphDebug && this.graphDebug.drawRect(tempBounds.x, tempBounds.y, tempBounds.w, tempBounds.h), 
                        this.testBoundsCollide(tempEnvBounds, tempBounds) && tempEntity.virtualVelocity.x > 0 && (touchCollection.right = !0), 
                        precise && (tempBounds.w = 1, tempBounds.h = 1, tempBounds.x = tempEntity.collisionPoints.down.x, 
                        tempBounds.y = tempEntityBounds.y, this.testBoundsCollide(tempEnvBounds, tempBounds) && (touchCollection.middleUp = !0), 
                        tempBounds.w = 1, tempBounds.x = tempEntity.collisionPoints.down.x, tempBounds.y = tempEntity.collisionPoints.down.y, 
                        this.testBoundsCollide(tempEnvBounds, tempBounds) && (touchCollection.middleDown = !0), 
                        tempBounds.x = tempEntity.collisionPoints.bottomLeft.x, tempBounds.y = tempEntity.collisionPoints.bottomLeft.y, 
                        this.testBoundsCollide(tempEnvBounds, tempBounds) && (touchCollection.bottomLeft = !0), 
                        tempBounds.x = tempEntity.collisionPoints.bottomRight.x, tempBounds.y = tempEntity.collisionPoints.bottomRight.y, 
                        this.testBoundsCollide(tempEnvBounds, tempBounds) && (touchCollection.bottomRight = !0), 
                        tempBounds.x = tempEntity.collisionPoints.topLeft.x, tempBounds.y = tempEntity.collisionPoints.topLeft.y, 
                        this.testBoundsCollide(tempEnvBounds, tempBounds) && (touchCollection.topLeft = !0), 
                        tempBounds.x = tempEntity.collisionPoints.topRight.x, tempBounds.y = tempEntity.collisionPoints.topRight.y, 
                        this.testBoundsCollide(tempEnvBounds, tempBounds) && (touchCollection.topRight = !0)), 
                        tempEntity.touch(touchCollection)) : tempEntity && tempEntity.touch && tempEntity.touch(touchCollection), 
                        isTouch = !0;
                    }
                    tempEntity.isTouch = isTouch;
                }
            }
        }
    },
    testBoundsCollide: function(bound1, bound2) {
        return bound1.x + bound1.w > bound2.x && bound1.x < bound2.x + bound2.w && bound1.y + bound1.h > bound2.y && bound1.y < bound2.y + bound2.h;
    }
}), ArrayUtils = {
    shuffle: function(array) {
        for (var temporaryValue, randomIndex, currentIndex = array.length; 0 !== currentIndex; ) randomIndex = Math.floor(Math.random() * currentIndex), 
        currentIndex -= 1, temporaryValue = array[currentIndex], array[currentIndex] = array[randomIndex], 
        array[randomIndex] = temporaryValue;
        return array;
    }
}, SimpleSprite = Class.extend({
    init: function(img) {
        this.texture = "string" == typeof img ? new PIXI.Texture.fromImage(img) : img, this.container = new PIXI.Sprite(this.texture);
    },
    getContent: function() {
        return this.container;
    },
    setPosition: function(x, y) {
        this.container.position.x = x, this.container.position.y = y;
    }
}), Spritesheet = Class.extend({
    init: function() {
        this.animations = [], this.currentAnimation = null, this.texture = null, this.timeElapsed = 0, 
        this.currentFrame = 0, this.container = new PIXI.DisplayObjectContainer(), this.position = {
            x: 0,
            y: 0
        }, this.scale = {
            x: 1,
            y: 1
        };
    },
    build: function() {},
    setFrame: function(frame) {
        this.currentAnimation = null, this.currentFrame = frame;
    },
    setScale: function(scaleX, scaleY) {
        this.scale.x = scaleX, this.scale.y = scaleY, this.texture.scale.x = this.scale.x, 
        this.texture.scale.y = this.scale.y, this.updateFrame();
    },
    addAnimation: function(animation) {
        this.animations.push(animation), null == this.texture && (this.currentAnimation = animation, 
        this.texture = PIXI.Sprite.fromFrame(this.currentAnimation.frames[this.currentAnimation.currentID]), 
        this.container.addChild(this.texture));
    },
    play: function(label) {
        for (var i = 0; i < this.animations.length; i++) this.animations[i].label == label && (this.currentAnimation = this.animations[i]), 
        this.currentAnimation.repeat || (this.currentAnimation.currentID = 0);
    },
    setPosition: function(x, y) {
        this.position.x = x, this.position.y = y, this.texture.position.x = this.position.x - this.texture.width / 2, 
        this.texture.position.y = this.position.y - this.texture.height / 2, this.updateFrame();
    },
    update: function() {
        var stop = !1;
        null != this.currentAnimation && (this.timeElapsed > this.currentAnimation.timeFrame ? (this.currentAnimation.currentID++, 
        this.currentAnimation.currentID >= this.currentAnimation.frames.length && (this.currentAnimation.currentID = this.currentAnimation.repeat ? 0 : this.currentAnimation.frames.length - 1, 
        null != this.currentAnimation.callback && this.currentAnimation.callback()), this.timeElapsed = 0, 
        stop || this.updateFrame()) : this.timeElapsed++);
    },
    updateFrame: function() {
        this.container.removeChild(this.texture);
        var frameID = 0;
        frameID = null == this.currentAnimation ? this.currentFrame : this.currentAnimation.frames[this.currentAnimation.currentID], 
        this.texture = PIXI.Sprite.fromFrame(frameID), this.texture.scale.x = this.scale.x, 
        this.texture.scale.y = this.scale.y, this.texture.position.x = this.position.x - this.texture.width / 2, 
        this.texture.position.y = this.position.y - this.texture.height / 2, this.container.addChild(this.texture);
    }
}), SpritesheetAnimation = Class.extend({
    init: function() {
        this.label = "", this.frames = [], this.timeFrame = 0, this.currentID = 0, this.callback = null, 
        this.repeat = !0;
    },
    build: function(label, frames, timeFrame, repeat, callback) {
        this.callback = callback, this.label = label, this.frames = frames, this.timeFrame = timeFrame, 
        this.repeat = repeat;
    }
});